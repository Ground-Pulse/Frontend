"use client";

/**
 * Session state (JWT + current user). Persisted to localStorage.
 *
 * A non-sensitive `gp_role` cookie is also written so src/proxy.ts can do the
 * optimistic role-based redirect before a page renders. The real authorization
 * check is always done by the backend (CASL guards).
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/lib/types";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setSession: (s: { accessToken: string; refreshToken: string; user: User }) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

function writeRoleCookie(role: Role | null) {
  if (typeof document === "undefined") return;
  if (role) {
    document.cookie = `gp_role=${role}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  } else {
    document.cookie = "gp_role=; path=/; max-age=0; samesite=lax";
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) => {
        writeRoleCookie(user.role);
        set({ accessToken, refreshToken, user });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        writeRoleCookie(null);
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: "gp_auth",
      onRehydrateStorage: () => (state) => {
        // keep the proxy cookie in sync with what's stored
        writeRoleCookie(state?.user?.role ?? null);
      },
    }
  )
);

export const ROLE_HOME: Record<Role, string> = {
  OWNER: "/dashboard",
  INSPECTOR: "/inspections",
  ADMIN: "/admin/dashboard",
  PROVIDER: "/provider/jobs",
};

export const ROLE_LABEL: Record<Role, string> = {
  OWNER: "Property Owner",
  INSPECTOR: "Inspector",
  ADMIN: "Admin",
  PROVIDER: "Service Provider",
};
