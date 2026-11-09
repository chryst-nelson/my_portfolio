"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, FolderKanban, Github, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { SkillMultiSelect } from "@/components/admin/SkillMultiSelect";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  getSkills,
  updateProject,
} from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { ProjectRequest, ProjectSummaryResponse, SkillResponse } from "@/lib/api/types";

const EMPTY_FORM: ProjectRequest = {
  name: "",
  slug: "",
  description: "",
  problemSolved: "",
  category: "",
  githubUrl: "",
  liveUrl: "",
  technologyIds: [],
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminProjectsPage() {
  const { token, isReady } = useRequireAdmin();
  const [projects, setProjects] = useState<ProjectSummaryResponse[]>([]);
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectRequest>(EMPTY_FORM);
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
      const [projectList, skillList] = await Promise.all([getProjects(), getSkills()]);
      setProjects(projectList);
      setSkills(skillList);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load projects.");
    } finally {
      setIsLoading(false);
    }
  }

  async function startEdit(id: number) {
    try {
      const detail = await getProject(id);
      setEditingId(id);
      setForm({
        name: detail.name,
        slug: detail.slug,
        description: detail.description ?? "",
        problemSolved: detail.problemSolved ?? "",
        category: detail.category ?? "",
        githubUrl: detail.githubUrl ?? "",
        liveUrl: detail.liveUrl ?? "",
        technologyIds: detail.technologies.map((t) => t.id),
      });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load that project.");
    }
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
        await updateProject(token, editingId, form);
      } else {
        await createProject(token, form);
      }
      cancelEdit();
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that project.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this project? This can't be undone.")) return;

    try {
      await deleteProject(token, id);
      await loadAll();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that project.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Projects</h1>
      <p className="mt-1 text-sm text-slate-500">What the assistant shows when visitors ask about your work.</p>

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
              <label className={labelClass}>Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                required
                placeholder="e.g. football-scouting-app"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={inputClass}
              />
            </div>
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

          <div>
            <label className={labelClass}>Problem solved</label>
            <textarea
              rows={2}
              value={form.problemSolved}
              onChange={(e) => setForm({ ...form, problemSolved: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input
                value={form.githubUrl}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Live URL</label>
              <input
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className={inputClass}
              />
            </div>
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
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Add project"}
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
            <Loader2 className="h-4 w-4 animate-spin" /> Loading projects…
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <FolderKanban className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No projects yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Links</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{project.name}</td>
                  <td className="px-4 py-3 text-slate-600">{project.category || "—"}</td>
                  <td className="px-4 py-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="View on GitHub"
                        className="inline-flex text-slate-400 hover:text-slate-700"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(project.id)}
                        aria-label={`Edit ${project.name}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        aria-label={`Delete ${project.name}`}
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
