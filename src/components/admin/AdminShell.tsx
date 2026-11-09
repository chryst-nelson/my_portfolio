"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Briefcase,
  HelpCircle,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Trophy,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import type { ReactNode } from "react";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
  { href: "/admin/faq", label: "Chat FAQ", icon: HelpCircle },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/resume", label: "Resume", icon: FileText },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white md:min-h-screen md:w-60 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white">
              C
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-slate-900">Admin</p>
              <p className="text-xs leading-tight text-slate-500">Portfolio content</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:overflow-visible">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-200 px-3 py-3">
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Log out
            </button>
          </div>
        </aside>
        <main className="flex-1 px-4 py-6 md:px-10 md:py-10">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
