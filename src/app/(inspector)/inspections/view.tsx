"use client";

/** INSPECTOR HOME — assigned inspections grouped by date (UX screen 4). */
import { ClipboardList, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import InspectionListItem from "@/components/inspection/InspectionListItem";
import { PageHeader } from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import StatCard from "@/components/ui/StatCard";
import { useInspections } from "@/hooks/useInspections";
import type { Inspection } from "@/lib/types";
import { dayLabel, daysUntil } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export default function AssignedInspectionsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const q = useInspections({ status: "SCHEDULED,IN_PROGRESS" });
  const jobs = q.data ?? [];
  const today = jobs.filter((j) => daysUntil(j.scheduledDate) <= 0);
  const week = jobs.filter((j) => daysUntil(j.scheduledDate) <= 7);

  const groups = jobs.reduce<Record<string, Inspection[]>>((acc, j) => {
    const k = daysUntil(j.scheduledDate) < 0 ? "Overdue" : dayLabel(j.scheduledDate);
    (acc[k] ||= []).push(j);
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Assigned inspections" description="Tap a job to open the checklist. Your progress saves automatically." />

      {user && !user.verified && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-warn/40 bg-warn-soft p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div>
            <p className="font-semibold text-ink">Verification pending</p>
            <p className="text-muted">An admin is reviewing your profile. You&apos;ll be assignable to jobs once verified.</p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Today" value={today.length} tone="warn" loading={q.isLoading} />
        <StatCard label="This week" value={week.length} tone="info" loading={q.isLoading} />
        <StatCard label="In progress" value={jobs.filter((j) => j.status === "IN_PROGRESS").length} loading={q.isLoading} />
      </div>

      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load your jobs." onRetry={() => q.refetch()} />
      ) : jobs.length === 0 ? (
        <EmptyState icon={<ClipboardList className="h-6 w-6" />} title="No inspections assigned today." description="New jobs appear here the moment an admin or the system assigns them to you." />
      ) : (
        <div className="space-y-8">
          {Object.entries(groups).map(([label, list]) => (
            <section key={label} aria-label={label}>
              <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${label === "Overdue" ? "text-bad" : "text-muted"}`}>{label}</h2>
              <div className="space-y-3">
                {list.map((j) => (
                  <InspectionListItem
                    key={j.id}
                    inspection={j}
                    showProgress
                    action={
                      <Button size="sm" variant={j.status === "IN_PROGRESS" ? "primary" : "secondary"} onClick={() => router.push(`/inspection/${j.id}/checklist`)}>
                        {j.status === "IN_PROGRESS" ? "Resume" : "Start"}
                      </Button>
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
