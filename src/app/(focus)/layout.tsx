import type { Metadata } from "next";
import { Suspense } from "react";
import AppShell, { ShellFallback } from "@/components/layout/AppShell";

// Authenticated app routes: private data, never indexed (FEA section 15).
export const metadata: Metadata = { robots: { index: false, follow: false } };

// The session lives in the browser, so page content renders client-side after the
// auth check; opt out of build-time instant-navigation validation for this group.
export const instant = false;

/** Full-screen flows (active checklist, onboarding): guarded, no sidebar. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}><AppShell roles={["OWNER", "INSPECTOR"]} bare>
      {children}
    </AppShell></Suspense>
  );
}
