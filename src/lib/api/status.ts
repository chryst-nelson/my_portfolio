export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

export const MAINTENANCE_MESSAGE =
  "The server is under maintenance. Please try again shortly.";

/** 0 = no response at all (server off, DNS, CORS), 502/503/504 = proxy up but backend down. */
export function isMaintenanceStatus(status: number): boolean {
  return status === 0 || status === 502 || status === 503 || status === 504;
}

/** Lightweight reachability probe against a small public endpoint. */
export async function isBackendUp(timeoutMs = 5000): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}/api/achievements`, {
      cache: "no-store",
      signal: controller.signal,
    });
    return !isMaintenanceStatus(res.status);
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}
