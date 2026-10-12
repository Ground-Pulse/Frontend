/**
 * Demo-only "session".
 *
 * The PRD specifies Passport.js + JWT on the backend (Section 7.2). That is my
 * teammate's work. For the frontend demo we only need to remember which role
 * logged in so the dashboards can be shown, so we store it in localStorage.
 *
 * When the real API exists, saveSession() will store the JWT returned by
 * POST /auth/login and every request will send it in the Authorization header.
 */
import type { Role } from "./types";

const KEY = "groundpulse_session";

export interface Session {
  name: string;
  email: string;
  role: Role;
}

export function saveSession(session: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Session) : null;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
