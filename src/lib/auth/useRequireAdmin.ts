"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function useRequireAdmin() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/admin/login");
    }
  }, [isLoading, token, router]);

  return { token, isReady: !isLoading && !!token };
}
