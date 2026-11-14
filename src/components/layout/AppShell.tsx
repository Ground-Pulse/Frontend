"use client";

/**
 * Authenticated app chrome for all four roles.
 *  - waits for the persisted session, redirects to /login if missing
 *  - redirects to the user's own home if the role doesn't match (frontend half
 *    of RBAC — the backend re-checks every request with CASL guards)
 *  - sidebar (desktop) / bottom tabs (mobile), notification bell, settings,
 *    live-connection indicator, user menu with demo account switcher
 */
import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  FileClock,
  History,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Settings,
  ShieldCheck,
  UserRoundCog,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NotificationBell from "@/components/notification/NotificationBell";
import SettingsDialog from "@/components/settings/SettingsDialog";
import { toast } from "@/components/ui/Toast";
import { useLogin, useLogout } from "@/hooks/useAuth";
import { useHydrated } from "@/hooks/useHydrated";
import { config } from "@/lib/config";
import { errorMessage } from "@/lib/errors";
import type { Role } from "@/lib/types";
import { cn, initials } from "@/lib/utils";
import { ROLE_HOME, ROLE_LABEL, useAuthStore } from "@/stores/authStore";
import { useRealtimeStore } from "@/stores/realtimeStore";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; match?: string[] };

const NAV: Record<Role, NavItem[]> = {
  OWNER: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, match: ["/dashboard", "/property"] },
    { href: "/schedule", label: "Inspections", icon: CalendarDays, match: ["/schedule", "/report"] },
    { href: "/issues", label: "Issues & repairs", icon: Wrench, match: ["/issues", "/issue/"] },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
  INSPECTOR: [
    { href: "/inspections", label: "Assigned", icon: ClipboardList, match: ["/inspections", "/inspection/"] },
    { href: "/inspections/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/inspections/history", label: "History", icon: History, match: ["/inspections/history", "/report"] },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
  ADMIN: [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, match: ["/admin/dashboard", "/property", "/issue/", "/report"] },
    { href: "/admin/reassign", label: "Assignments", icon: UserRoundCog },
    { href: "/admin/verification", label: "Verification", icon: ShieldCheck },
    { href: "/admin/templates", label: "Templates", icon: ListChecks },
    { href: "/admin/audit", label: "Audit log", icon: FileClock },
  ],
  PROVIDER: [
    { href: "/provider/jobs", label: "My jobs", icon: Wrench, match: ["/provider/jobs", "/issue/"] },
    { href: "/provider/history", label: "History", icon: History },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ],
};

function isActive(pathname: string, item: NavItem) {
  const prefixes = item.match ?? [item.href];
  if (item.href === "/inspections") return pathname === "/inspections" || pathname.startsWith("/inspection/");
  return prefixes.some((p) => pathname.startsWith(p));
}

function ConnectionDot() {
  const state = useRealtimeStore((s) => s.connection);
  if (state === "connected")
    return (
      <span className="hidden items-center gap-1.5 text-xs text-muted md:flex" title="Live updates on">
        <span className="h-2 w-2 rounded-full bg-ok" /> Live
      </span>
    );
  if (state === "offline") return null;
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 text-xs font-medium text-warn" role="status">
      <Loader2 className="h-3 w-3 animate-spin" /> {state === "connecting" ? "Connecting…" : "Reconnecting…"}
    </span>
  );
}

function DemoSwitcher({ onDone }: { onDone: () => void }) {
  const login = useLogin();
  const router = useRouter();
  const [accounts, setAccounts] = useState<{ role: Role; email: string; name: string }[]>([]);
  useEffect(() => {
    import("@/lib/mock/server").then((m) => setAccounts(m.DEMO_ACCOUNTS));
  }, []);
  return (
    <div className="border-t border-line p-2">
      <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-subtle">Switch demo account</p>
      {accounts.map((a) => (
        <button
          key={a.email}
          type="button"
          disabled={login.isPending}
          onClick={() =>
            login.mutate(
              { email: a.email, password: "password123" },
              {
                onSuccess: (res) => {
                  onDone();
                  router.push(ROLE_HOME[res.user.role]);
                },
                onError: (e) => toast.error(errorMessage(e)),
              }
            )
          }
          className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-surface-2"
        >
          <span className="truncate">{a.name}</span>
          <span className="shrink-0 text-subtle">{ROLE_LABEL[a.role]}</span>
        </button>
      ))}
    </div>
  );
}

function UserMenu({ onSettings }: { onSettings: () => void }) {
  const user = useAuthStore((s) => s.user)!;
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="flex h-11 items-center gap-2 rounded-xl px-1.5 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-on-brand">{initials(user.name)}</span>
        <span className="hidden text-left leading-tight lg:block">
          <span className="block max-w-36 truncate text-sm font-medium">{user.name}</span>
          <span className="block text-xs text-muted">{ROLE_LABEL[user.role]}</span>
        </span>
      </button>
      {open && (
        <div role="menu" className="gp-fade-up absolute right-0 top-12 z-40 w-72 rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="p-2">
            <button type="button" role="menuitem" onClick={() => { setOpen(false); onSettings(); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-surface-2">
              <Settings className="h-4 w-4 text-muted" /> Settings
            </button>
            <button type="button" role="menuitem" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-bad hover:bg-bad-soft">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
          {config.useMockApi && <DemoSwitcher onDone={() => setOpen(false)} />}
        </div>
      )}
    </div>
  );
}

export default function AppShell({
  roles,
  children,
  bare = false,
}: {
  roles: Role[] | "ANY";
  children: React.ReactNode;
  /** full-screen pages (active checklist, onboarding) keep the guard but drop the chrome */
  bare?: boolean;
}) {
  const hydrated = useHydrated();
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allowed = !!user && (roles === "ANY" || roles.includes(user.role));

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (!allowed) router.replace(ROLE_HOME[user.role]);
  }, [hydrated, user, allowed, router, pathname]);

  if (!hydrated || !user || !allowed) return <ShellFallback />;

  if (bare) return <div className="gp-app min-h-screen font-sans">{children}</div>;

  const nav = NAV[user.role];

  return (
    <div className="gp-app min-h-screen font-sans">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
        <Link href={ROLE_HOME[user.role]} className="flex h-16 items-center gap-2 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-on-brand">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="font-serif text-xl font-semibold">GroundPulse</span>
        </Link>
        <nav aria-label="Main" className="flex-1 space-y-1 px-3 py-4">
          {nav.map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                  active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-ink"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4 text-xs text-muted">
          {user.role === "ADMIN" && (
            <p className="mb-2 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Admin console
            </p>
          )}
          {config.useMockApi && <p className="text-subtle">Demo mode · mock API</p>}
        </div>
      </aside>

      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
            <Link href={ROLE_HOME[user.role]} className="flex items-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-on-brand">
                <Building2 className="h-4 w-4" />
              </span>
              <span className="font-serif text-lg font-semibold">GroundPulse</span>
            </Link>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-1 sm:gap-2">
              <ConnectionDot />
              <NotificationBell />
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="hidden h-11 w-11 items-center justify-center rounded-xl text-muted hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring sm:flex"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              <UserMenu onSettings={() => setSettingsOpen(true)} />
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>

      {/* Bottom tabs (mobile) */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg">
          {nav.slice(0, 5).map((item) => {
            const active = isActive(pathname, item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-brand" : "text-muted")}
              >
                <Icon className="h-5 w-5" />
                <span className="max-w-full truncate px-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

export function ShellFallback() {
  return (
    <div className="gp-app flex min-h-screen items-center justify-center" aria-busy>
      <Loader2 className="h-6 w-6 animate-spin text-muted" aria-label="Loading" />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

