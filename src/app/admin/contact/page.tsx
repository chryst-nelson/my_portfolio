"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Plus, X } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { getContact, updateContact } from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { ContactRequest } from "@/lib/api/types";

const EMPTY_FORM: ContactRequest = {
  email: "",
  linkedinUrl: "",
  githubUrl: "",
  otherLinks: null,
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminContactPage() {
  const { token, isReady } = useRequireAdmin();
  const [form, setForm] = useState<ContactRequest>(EMPTY_FORM);
  const [otherLinks, setOtherLinks] = useState<{ label: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadContact() {
    setIsLoading(true);
    try {
      const contact = await getContact();
      setForm({
        email: contact.email,
        linkedinUrl: contact.linkedinUrl ?? "",
        githubUrl: contact.githubUrl ?? "",
        otherLinks: contact.otherLinks,
      });
      setOtherLinks(Object.entries(contact.otherLinks ?? {}).map(([label, url]) => ({ label, url })));
    } catch (err) {
      if (!(err instanceof ApiRequestError && err.status === 404)) {
        setError(err instanceof ApiRequestError ? err.message : "Couldn't load contact info.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function updateLink(index: number, patch: Partial<{ label: string; url: string }>) {
    setOtherLinks((prev) => prev.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  }

  function removeLink(index: number) {
    setOtherLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setError(null);
    setSaved(false);

    const links = otherLinks.filter((l) => l.label.trim() && l.url.trim());
    const otherLinksMap = links.length > 0 ? Object.fromEntries(links.map((l) => [l.label, l.url])) : null;

    try {
      await updateContact(token, { ...form, otherLinks: otherLinksMap });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save contact info.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Contact</h1>
      <p className="mt-1 text-sm text-slate-500">How the assistant tells visitors to reach you.</p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {saved && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Contact info saved.
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-10 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading contact info…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>LinkedIn URL</label>
                <input
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
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
            </div>

            <div>
              <label className={labelClass}>Other links</label>
              <div className="mt-2 space-y-2">
                {otherLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      placeholder="Label (e.g. Twitter)"
                      value={link.label}
                      onChange={(e) => updateLink(index, { label: e.target.value })}
                      className="w-1/3 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink(index, { url: e.target.value })}
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      aria-label="Remove link"
                      className="rounded-md p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setOtherLinks((prev) => [...prev, { label: "", url: "" }])}
                  className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" /> Add link
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving…" : "Save contact info"}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
