"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { resolveTheme, usePreferencesStore } from "@/stores/preferencesStore";

/** Applies the chosen theme to <html data-theme>. Landing pages stay light. */
const PUBLIC_PREFIXES = ["/login", "/register", "/book-inspection", "/sample-report", "/onboarding/welcome"];

export default function ThemeSync() {
  const pathname = usePathname();
  const enabled = pathname !== "/" && !PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const theme = usePreferencesStore((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.dataset.theme = "light";
      return;
    }
    const apply = () => (root.dataset.theme = resolveTheme(theme));
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme, enabled]);
  return null;
}
