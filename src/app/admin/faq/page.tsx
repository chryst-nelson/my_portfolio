"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Loader2, Pencil, Plus, Trash2, HelpCircle, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  updateFaq,
} from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { FaqRequest, FaqResponse } from "@/lib/api/types";

const EMPTY_FORM: FaqRequest = {
  question: "",
  answer: "",
  keywords: "",
  enabled: true,
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminFaqPage() {
  const { token, isReady } = useRequireAdmin();
  const [faqs, setFaqs] = useState<FaqResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FaqRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady || !token) return;
    loadFaqs(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, token]);

  async function loadFaqs(authToken: string) {
    setIsLoading(true);
    try {
      setFaqs(await getAllFaqs(authToken));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't load FAQ entries.");
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(item: FaqResponse) {
    setEditingId(item.id);
    setForm({
      question: item.question,
      answer: item.answer,
      keywords: item.keywords ?? "",
      enabled: item.enabled,
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

    const payload: FaqRequest = { ...form, keywords: form.keywords?.trim() || null };

    try {
      if (editingId) {
        await updateFaq(token, editingId, payload);
      } else {
        await createFaq(token, payload);
      }
      cancelEdit();
      await loadFaqs(token);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save that FAQ entry.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!window.confirm("Delete this FAQ entry? This can't be undone.")) return;

    try {
      await deleteFaq(token, id);
      await loadFaqs(token);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't delete that FAQ entry.");
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Chat FAQ</h1>
      <p className="mt-1 text-sm text-slate-500">
        Questions the chat answers <span className="font-medium text-slate-700">instantly</span>
        , with exactly the wording you write. A visitor&apos;s message matches an entry when it contains one of
        its <span className="font-medium text-slate-700">keywords</span>, or is worded very
        similarly to its question. Write only facts you want stated verbatim.
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
            <label className={labelClass}>Question</label>
            <input
              required
              maxLength={500}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className={inputClass}
              placeholder="Is he open to remote work?"
            />
          </div>
          <div>
            <label className={labelClass}>Answer</label>
            <textarea
              required
              rows={3}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Keywords (comma-separated, optional)</label>
            <input
              maxLength={500}
              value={form.keywords ?? ""}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              className={inputClass}
              placeholder="remote, work from home, relocate"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/40"
            />
            Enabled
          </label>
        </div>

        <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Add FAQ entry"}
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
            <Loader2 className="h-4 w-4 animate-spin" /> Loading FAQ entries…
          </div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <HelpCircle className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-700">No FAQ entries yet</p>
            <p className="text-sm text-slate-500">Add the first one using the form above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Question</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Keywords</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.question}</td>
                  <td className="px-4 py-3 text-slate-600">{item.keywords ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.enabled ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.question}`}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label={`Delete ${item.question}`}
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
