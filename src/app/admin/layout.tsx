import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="admin-root min-h-screen bg-slate-50 text-slate-900"
      style={{ colorScheme: "light" }}
    >
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
