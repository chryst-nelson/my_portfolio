"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2, Wrench, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { createSkill, deleteSkill, getSkills, updateSkill } from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { SkillRequest, SkillResponse } from "@/lib/api/types";

const EMPTY_FORM: SkillRequest = {
  name: "",
  category: "",
  proficiency: "",
  currentlyLearning: false,
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminSkillsPage() {
  const { token, isReady } = useRequireAdmin();
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SkillRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadSkills() {
    setIsLoading(true);
    try {
      setSkills(await getSkills());
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load skills.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(skill: SkillResponse) {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency ?? "",
      currentlyLearning: skill.currentlyLearning,
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

    try {
      if (editingId) {
        await updateSkill(token, editingId, form);
      } else {
        await createSkill(token, form);
      }
      cancelEdit();
      await loadSkills();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that skill.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this skill? Projects and experience referencing it will lose the tag.")) return;

    try {
      await deleteSkill(token, id);
      await loadSkills();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that skill.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Skills</h1>
      <p className="mt-1 text-sm text-slate-500">These power the technology tags on projects and experience.</p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              required
              placeholder="e.g. Backend, DevOps"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Proficiency</label>
            <input
              placeholder="e.g. Advanced"
              value={form.proficiency}
              onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.currentlyLearning}
              onChange={(e) => setForm({ ...form, currentlyLearning: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/40"
            />
            Currently learning
          </label>
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Add skill"}
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
            <Loader2 className="h-4 w-4 animate-spin" /> Loading skills…
          </div>
        ) : skills.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Wrench className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No skills yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Proficiency</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{skill.name}</span>
                    {skill.currentlyLearning && (
                      <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        learning
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{skill.category}</td>
                  <td className="px-4 py-3 text-slate-600">{skill.proficiency || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(skill)}
                        aria-label={`Edit ${skill.name}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        aria-label={`Delete ${skill.name}`}
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
