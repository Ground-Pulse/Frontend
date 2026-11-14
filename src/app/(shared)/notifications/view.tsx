"use client";

/** Notification Center (UX screen 9). */
import { CheckCheck } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import { NotificationRow, useOpenNotification } from "@/components/notification/NotificationBell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import Tabs from "@/components/ui/Tabs";
import { useMarkAllNotificationsRead, useNotifications } from "@/hooks/useNotifications";

export default function NotificationsPage() {
  const q = useNotifications();
  const markAll = useMarkAllNotificationsRead();
  const open = useOpenNotification();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const all = q.data ?? [];
  const unread = all.filter((n) => !n.read);
  const shown = tab === "all" ? all : unread;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Reports, flagged issues and repair updates."
        actions={
          <Button variant="outline" onClick={() => markAll.mutate()} disabled={!unread.length}>
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        }
      />
      <div className="mb-4">
        <Tabs label="Filter" value={tab} onChange={setTab} tabs={[{ value: "all", label: "All", count: all.length }, { value: "unread", label: "Unread", count: unread.length }]} />
      </div>
      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load notifications." onRetry={() => q.refetch()} />
      ) : shown.length === 0 ? (
        <EmptyState title="You're all caught up." />
      ) : (
        <Card className="p-2">
          {shown.map((n) => (
            <NotificationRow key={n.id} n={n} onOpen={open} />
          ))}
        </Card>
      )}
    </>
  );
}
