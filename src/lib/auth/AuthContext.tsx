"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "@/lib/api/client";
import type { LoginResponse } from "@/lib/api/types";

const STORAGE_KEY = "portfolio_admin_session";

interface StoredSession {
  token: string;
  expiresAt: number;
}

interface AuthContextValue {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readStoredSession();
    setToken(session?.token ?? null);
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const response = await apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const session: StoredSession = {
      token: response.token,
      expiresAt: Date.now() + response.expiresInMs,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setToken(session.token);
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
