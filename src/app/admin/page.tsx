"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  FileText,
  FolderKanban,
  GraduationCap,
  HelpCircle,
  Mail,
  Trophy,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useRequireAdmin } from "@/lib/auth/useRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";

const SECTIONS: { href: string; label: string; blurb: string; icon: LucideIcon }[] = [
  { href: "/admin/projects", label: "Projects", blurb: "Add, edit, and remove portfolio projects.", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", blurb: "Manage the skills the assistant can reference.", icon: Wrench },
  { href: "/admin/experience", label: "Experience", blurb: "Manage work history and achievements.", icon: Briefcase },
  { href: "/admin/education", label: "Education", blurb: "Manage your academic background.", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", blurb: "Manage credentials and certificates.", icon: Award },
  { href: "/admin/achievements", label: "Achievements", blurb: "Manage and verify notable achievements.", icon: Trophy },
  { href: "/admin/faq", label: "Chat FAQ", blurb: "Curated answers the chat gives instantly.", icon: HelpCircle },
  { href: "/admin/profile", label: "Profile", blurb: "Update your bio and career goals.", icon: User },
  { href: "/admin/contact", label: "Contact", blurb: "Update how visitors can reach you.", icon: Mail },
  { href: "/admin/resume", label: "Resume", blurb: "Publish a new resume version.", icon: FileText },
];

export default function AdminHomePage() {
  const { isReady } = useRequireAdmin();

  if (!isReady) return null;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Pick a section to manage.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-lg border border-slate-200 bg-white p-5 transition-all hover:border-indigo-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-slate-900">
                {section.label}
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-1 text-sm text-slate-500">{section.blurb}</p>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
