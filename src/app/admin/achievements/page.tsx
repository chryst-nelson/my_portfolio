"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2, Trophy, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAchievement,
  deleteAchievement,
  getAllAchievements,
  updateAchievement,
} from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { AchievementRequest, AchievementResponse } from "@/lib/api/types";

const EMPTY_FORM: AchievementRequest = {
  title: "",
  description: "",
  date: "",
  verified: true,
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminAchievementsPage() {
  const { token, isReady } = useRequireAdmin();
  const [achievements, setAchievements] = useState<AchievementResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady || !token) return;
    loadAchievements(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, token]);

  async function loadAchievements(authToken: string) {
    setIsLoading(true);
    try {
      setAchievements(await getAllAchievements(authToken));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load achievements.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(item: AchievementResponse) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      date: item.date ?? "",
      verified: item.verified,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setError(null);

    const payload: AchievementRequest = { ...form, date: form.date || null };

    try {
      if (editingId) {
        await updateAchievement(token, editingId, payload);
      } else {
        await createAchievement(token, payload);
      }
      cancelEdit();
      await loadAchievements(token);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that achievement.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this achievement? This can't be undone.")) return;

    try {
      await deleteAchievement(token, id);
      await loadAchievements(token);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that achievement.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Achievements</h1>
      <p className="mt-1 text-sm text-slate-500">
        Only <span className="font-medium text-slate-700">verified</span> achievements are visible
        to visitors and the assistant — unverified ones stay here for your own review.
      </p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                value={form.date ?? ""}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/40"
              />
              Verified (visible to visitors)
            </label>
          </div>
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Add achievement"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading achievements…
          </div>
        ) : achievements.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Trophy className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No achievements yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Title</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                  <td className="px-4 py-3 text-slate-600">{item.date ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.verified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.title}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
