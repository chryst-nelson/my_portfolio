"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, GraduationCap, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { createEducation, deleteEducation, getEducation, updateEducation } from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { EducationRequest, EducationResponse } from "@/lib/api/types";

const EMPTY_FORM: EducationRequest = {
  institution: "",
  degree: "",
  course: "",
  details: "",
  startDate: "",
  endDate: "",
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminEducationPage() {
  const { token, isReady } = useRequireAdmin();
  const [education, setEducation] = useState<EducationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EducationRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadEducation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadEducation() {
    setIsLoading(true);
    try {
      setEducation(await getEducation());
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load education.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(item: EducationResponse) {
    setEditingId(item.id);
    setForm({
      institution: item.institution,
      degree: item.degree ?? "",
      course: item.course ?? "",
      details: item.details ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
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

    const payload: EducationRequest = {
      ...form,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    try {
      if (editingId) {
        await updateEducation(token, editingId, payload);
      } else {
        await createEducation(token, payload);
      }
      cancelEdit();
      await loadEducation();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that entry.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this education entry? This can't be undone.")) return;

    try {
      await deleteEducation(token, id);
      await loadEducation();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that entry.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Education</h1>
      <p className="mt-1 text-sm text-slate-500">Academic background the assistant can reference.</p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Institution</label>
            <input
              required
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Degree</label>
              <input
                placeholder="e.g. B.Sc."
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Course</label>
              <input
                placeholder="e.g. Computer Science"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Details</label>
            <textarea
              rows={2}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                value={form.startDate ?? ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>End date</label>
              <input
                type="date"
                value={form.endDate ?? ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Add education"}
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
            <Loader2 className="h-4 w-4 animate-spin" /> Loading education…
          </div>
        ) : education.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <GraduationCap className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No education yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Institution</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Degree / Course</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Dates</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {education.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.institution}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {[item.degree, item.course].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.startDate ?? "—"} — {item.endDate ?? "Present"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.institution}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Delete ${item.institution}`}
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
