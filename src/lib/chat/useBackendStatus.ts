"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isBackendUp } from "@/lib/api/status";

export type BackendStatus = "checking" | "up" | "down";

const RETRY_MS = 20_000;

/** Probes the backend on mount; while it is down, keeps retrying so the page recovers by itself. */
export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");
  const timer = useRef<number | undefined>(undefined);

  const check = useCallback(async () => {
    const up = await isBackendUp();
    setStatus(up ? "up" : "down");
    return up;
  }, []);

  const markDown = useCallback(() => setStatus("down"), []);

  useEffect(() => {
    void check();
  }, [check]);

  useEffect(() => {
    if (status !== "down") return;
    timer.current = window.setInterval(() => void check(), RETRY_MS);
    return () => window.clearInterval(timer.current);
  }, [status, check]);

  return { status, recheck: check, markDown };
}
