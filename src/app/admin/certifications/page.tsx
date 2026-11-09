"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Award, AlertCircle, ExternalLink, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createCertification,
  deleteCertification,
  getCertifications,
  updateCertification,
} from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { CertificationRequest, CertificationResponse } from "@/lib/api/types";

const EMPTY_FORM: CertificationRequest = {
  name: "",
  provider: "",
  issuedDate: "",
  credentialUrl: "",
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminCertificationsPage() {
  const { token, isReady } = useRequireAdmin();
  const [certifications, setCertifications] = useState<CertificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CertificationRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadCertifications() {
    setIsLoading(true);
    try {
      setCertifications(await getCertifications());
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load certifications.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(item: CertificationResponse) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      provider: item.provider ?? "",
      issuedDate: item.issuedDate ?? "",
      credentialUrl: item.credentialUrl ?? "",
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

    const payload: CertificationRequest = { ...form, issuedDate: form.issuedDate || null };

    try {
      if (editingId) {
        await updateCertification(token, editingId, payload);
      } else {
        await createCertification(token, payload);
      }
      cancelEdit();
      await loadCertifications();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that certification.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this certification? This can't be undone.")) return;

    try {
      await deleteCertification(token, id);
      await loadCertifications();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that certification.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Certifications</h1>
      <p className="mt-1 text-sm text-slate-500">Credentials the assistant can reference.</p>

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
              <label className={labelClass}>Provider</label>
              <input
                placeholder="e.g. AWS"
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Issued date</label>
              <input
                type="date"
                value={form.issuedDate ?? ""}
                onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Credential URL</label>
              <input
                value={form.credentialUrl}
                onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })}
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
            {editingId ? "Save changes" : "Add certification"}
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
            <Loader2 className="h-4 w-4 animate-spin" /> Loading certifications…
          </div>
        ) : certifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Award className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No certifications yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Provider</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Issued</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{item.name}</span>
                    {item.credentialUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="View credential"
                        className="ml-2 inline-flex text-slate-400 hover:text-slate-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.provider || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{item.issuedDate ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Delete ${item.name}`}
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
