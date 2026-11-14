"use client";

import { Bell, CheckCheck, ClipboardCheck, FileCheck2, MessageSquare, ShieldCheck, TriangleAlert, Wrench } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SkeletonRows } from "@/components/ui/Feedback";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import type { Notification, NotificationType } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";

const ICONS: Partial<Record<NotificationType, React.ComponentType<{ className?: string }>>> = {
  REPORT_READY: FileCheck2,
  ISSUE_FLAGGED: TriangleAlert,
  REPAIR_STATUS_UPDATED: Wrench,
  REPAIR_REQUESTED: Wrench,
  JOB_ASSIGNED: Wrench,
  INSPECTION_ASSIGNED: ClipboardCheck,
  ACCOUNT_VERIFIED: ShieldCheck,
  NEW_MESSAGE: MessageSquare,
};

const TONE: Partial<Record<NotificationType, string>> = {
  ISSUE_FLAGGED: "bg-bad-soft text-bad",
  REPORT_READY: "bg-ok-soft text-ok",
  REPAIR_STATUS_UPDATED: "bg-warn-soft text-warn",
  REPAIR_REQUESTED: "bg-warn-soft text-warn",
  ACCOUNT_VERIFIED: "bg-teal-soft text-teal",
};

export function NotificationRow({ n, onOpen }: { n: Notification; onOpen: (n: Notification) => void }) {
  const Icon = ICONS[n.type] ?? Bell;
  return (
    <button
      type="button"
      onClick={() => onOpen(n)}
      className={cn("flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-surface-2", !n.read && "bg-brand-soft/40")}
    >
      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", TONE[n.type] ?? "bg-info-soft text-info")}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("text-sm", n.read ? "font-medium" : "font-semibold")}>{n.payload.title}</span>
          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-info" aria-label="Unread" />}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{n.payload.body}</span>
        <span className="mt-1 block text-[11px] text-subtle">{relativeTime(n.createdAt)}</span>
      </span>
    </button>
  );
}

export function useOpenNotification() {
  const router = useRouter();
  const markRead = useMarkNotificationRead();
  return (n: Notification) => {
    if (!n.read) markRead.mutate(n.id);
    if (n.payload.href) router.push(n.payload.href);
  };
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useNotifications();
  const markAll = useMarkAllNotificationsRead();
  const openNotification = useOpenNotification();
  const ref = useRef<HTMLDivElement>(null);
  const unread = data?.filter((n) => !n.read).length ?? 0;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
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
        className="relative flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-bad px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="gp-fade-up fixed inset-x-3 top-16 z-40 rounded-2xl border border-line bg-surface shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-semibold">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={() => markAll.mutate()} className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {isLoading && <SkeletonRows count={3} />}
            {data?.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted">You&apos;re all caught up.</p>}
            {data?.slice(0, 8).map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onOpen={(x) => {
                  setOpen(false);
                  openNotification(x);
                }}
              />
            ))}
          </div>
          <Link href="/notifications" onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-medium text-brand hover:bg-surface-2">
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
