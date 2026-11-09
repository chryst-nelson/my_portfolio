"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, ExternalLink, FileText, Loader2, Upload } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { getResume, uploadResume } from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { ResumeResponse } from "@/lib/api/types";

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminResumePage() {
  const { token, isReady } = useRequireAdmin();
  const [current, setCurrent] = useState<ResumeResponse | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [version, setVersion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadResume() {
    setIsLoading(true);
    try {
      setCurrent(await getResume());
    } catch (err) {
      if (!(err instanceof ApiRequestError && err.status === 404)) {
        setError(err instanceof ApiRequestError ? err.message : "Couldn't load the resume.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setError(null);

    try {
      const updated = await uploadResume(token, { fileUrl, version });
      setCurrent(updated);
      setFileUrl("");
      setVersion("");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't publish that resume.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Resume</h1>
      <p className="mt-1 text-sm text-slate-500">
        Points at an already-hosted PDF — upload the file to storage first, then paste its URL here.
      </p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-700">Currently active</p>
        {isLoading ? (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : current ? (
          <a
            href={current.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-700"
          >
            <FileText className="h-4 w-4 text-slate-400" />
            {current.version || "Current resume"}
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <FileText className="h-4 w-4 text-slate-300" />
            No resume published yet.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          <div>
            <label className={labelClass}>File URL</label>
            <input
              required
              type="url"
              placeholder="https://…/resume.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Version label</label>
            <input
              placeholder="e.g. 2026-08"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isSaving ? "Publishing…" : "Publish resume"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
