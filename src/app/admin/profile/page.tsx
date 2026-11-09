"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { getProfile, updateProfile } from "@/lib/api/adminApi";
import { ApiRequestError } from "@/lib/api/client";
import type { ProfileUpdateRequest } from "@/lib/api/types";

const EMPTY_FORM: ProfileUpdateRequest = {
  fullName: "",
  title: "",
  bio: "",
  location: "",
  interests: "",
  careerGoals: "",
};

const inputClass =
  "mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "block text-sm font-medium text-slate-700";

export default function AdminProfilePage() {
  const { token, isReady } = useRequireAdmin();
  const [form, setForm] = useState<ProfileUpdateRequest>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function loadProfile() {
    setIsLoading(true);
    try {
      const profile = await getProfile();
      setForm({
        fullName: profile.fullName,
        title: profile.title ?? "",
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        interests: profile.interests ?? "",
        careerGoals: profile.careerGoals ?? "",
      });
    } catch (err) {
      // 404 just means the profile hasn't been set yet — form starts empty, that's fine.
      if (!(err instanceof ApiRequestError && err.status === 404)) {
        setError(err instanceof ApiRequestError ? err.message : "Couldn't load the profile.");
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
    setSaved(false);

    try {
      await updateProfile(token, form);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't save the profile.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">The bio and background the assistant introduces you with.</p>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {saved && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Profile saved.
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-10 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading profile…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Title</label>
                <input
                  placeholder="e.g. Full-Stack Developer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Interests</label>
              <textarea
                rows={2}
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Career goals</label>
              <textarea
                rows={2}
                value={form.careerGoals}
                onChange={(e) => setForm({ ...form, careerGoals: e.target.value })}
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
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
