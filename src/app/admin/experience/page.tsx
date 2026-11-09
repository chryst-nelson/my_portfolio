"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Briefcase, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { SkillMultiSelect } from "@/components/admin/SkillMultiSelect";
import { AchievementListEditor } from "@/components/admin/AchievementListEditor";
import {
  createExperience,
  deleteExperience,
  getExperience,
  getSkills,
  updateExperience,
} from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { ExperienceRequest, ExperienceResponse, SkillResponse } from "@/lib/api/types";

const EMPTY_FORM: ExperienceRequest = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  responsibilities: "",
  technologyIds: [],
  achievements: [],
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminExperiencePage() {
  const { token, isReady } = useRequireAdmin();
  const [experience, setExperience] = useState<ExperienceResponse[]>([]);
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadAll() {
    setIsLoading(true);
    try {
      const [experienceList, skillList] = await Promise.all([getExperience(), getSkills()]);
      setExperience(experienceList);
      setSkills(skillList);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load experience.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(item: ExperienceResponse) {
    setEditingId(item.id);
    setForm({
      company: item.company,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      responsibilities: item.responsibilities ?? "",
      technologyIds: item.technologies.map((t) => t.id),
      achievements: item.achievements,
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

    const payload: ExperienceRequest = {
      ...form,
      endDate: form.endDate || null,
      achievements: form.achievements.filter((a) => a.trim().length > 0),
    };

    try {
      if (editingId) {
        await updateExperience(token, editingId, payload);
      } else {
        await createExperience(token, payload);
      }
      cancelEdit();
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that entry.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this experience entry? This can't be undone.")) return;

    try {
      await deleteExperience(token, id);
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that entry.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Experience</h1>
      <p className="mt-1 text-sm text-slate-500">Work history the assistant draws on for recruiter questions.</p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Company</label>
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                required
                value={form.startDate}
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
              <p className="mt-1.5 text-xs text-slate-400">Leave blank if this is your current role.</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Responsibilities</label>
            <textarea
              rows={3}
              value={form.responsibilities}
              onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Technologies</label>
            <div className="mt-2">
              <SkillMultiSelect
                skills={skills}
                selectedIds={form.technologyIds}
                onChange={(ids) => setForm({ ...form, technologyIds: ids })}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Achievements</label>
            <div className="mt-2">
              <AchievementListEditor
                achievements={form.achievements}
                onChange={(achievements) => setForm({ ...form, achievements })}
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
            {editingId ? "Save changes" : "Add experience"}
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

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-10 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading experience…
          </div>
        ) : experience.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-10 text-center">
            <Briefcase className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No experience yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {experience.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.role} <span className="font-normal text-slate-400">·</span> {item.company}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.startDate} — {item.endDate ?? "Present"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => startEdit(item)}
                      aria-label={`Edit ${item.role} at ${item.company}`}
                      className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Delete ${item.role} at ${item.company}`}
                      className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
