"use client";

/**
 * Shared layout for both dashboards (owner + inspector).
 *
 * Responsibilities:
 *  1. Check that someone is logged in. If not -> send them to /login.
 *     This is the frontend half of "Role-Based Access" (F-011 in the PRD).
 *     The real security check happens again on the backend.
 *  2. Draw the top bar: logo, role label, the user's name and a logout button.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearSession, getSession, type Session } from "@/lib/auth";
import type { Role } from "@/lib/types";
import Button from "@/components/ui/Button";

export default function DashboardShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: Role;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login"); // not logged in
      return;
    }
    if (s.role !== role) {
      // Logged in as the wrong role -> send to their own dashboard.
      router.replace(s.role === "OWNER" ? "/owner" : "/inspector");
      return;
    }
    setSession(s);
  }, [role, router]);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  // While the session check runs we render nothing to avoid a flash of content.
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#FAF8EF] text-[#22231F]">
      <header className="sticky top-0 z-20 border-b border-[#E4DFD2] bg-[#FAF8EF]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="font-serif text-xl font-semibold">
            GroundPulse
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#6B6B63] sm:block">
              {session.name} · {role === "OWNER" ? "Owner" : "Inspector"}
            </span>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-[#6B6B63]">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
