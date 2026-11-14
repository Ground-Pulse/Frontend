"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationChannel } from "@/lib/types";

export type ThemePreference = "light" | "dark" | "system";

interface PreferencesState {
  theme: ThemePreference;
  notificationChannel: NotificationChannel;
  dismissedFirstInspectionPrompt: boolean;
  setTheme: (t: ThemePreference) => void;
  setNotificationChannel: (c: NotificationChannel) => void;
  dismissFirstInspectionPrompt: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      notificationChannel: "BOTH",
      dismissedFirstInspectionPrompt: false,
      setTheme: (theme) => set({ theme }),
      setNotificationChannel: (notificationChannel) => set({ notificationChannel }),
      dismissFirstInspectionPrompt: () => set({ dismissedFirstInspectionPrompt: true }),
    }),
    { name: "gp_preferences" }
  )
);

export function resolveTheme(pref: ThemePreference): "light" | "dark" {
  if (pref !== "system") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
