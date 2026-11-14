"use client";

import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import { PageHeader } from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { useInspections } from "@/hooks/useInspections";
import { downloadIcs } from "@/lib/ics";

export default function InspectorCalendarPage() {
  const router = useRouter();
  const q = useInspections();
  const all = q.data ?? [];
  return (
    <>
      <PageHeader
        title="Calendar"
        description="Your scheduled and completed inspections."
        actions={
          <Button variant="outline" onClick={() => downloadIcs(all.filter((i) => i.status !== "SUBMITTED"), "my-inspections.ics")} disabled={!all.length}>
            <Download className="h-4 w-4" /> Export to calendar
          </Button>
        }
      />
      {q.isError ? (
        <ErrorState message="Couldn't load your calendar." onRetry={() => q.refetch()} />
      ) : q.isLoading ? (
        <Skeleton className="h-[520px] w-full rounded-2xl" />
      ) : (
        <Card>
          <MonthCalendar
            events={all.map((i) => ({
              id: i.id,
              date: i.scheduledDate,
              label: i.propertyName,
              tone: i.status === "SUBMITTED" ? "green" : i.status === "IN_PROGRESS" ? "amber" : "blue",
            }))}
            onEventClick={(e) => {
              const ins = all.find((x) => x.id === e.id);
              router.push(ins?.status === "SUBMITTED" ? `/report/${e.id}` : `/inspection/${e.id}/checklist`);
            }}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-info" /> Scheduled</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warn" /> In progress</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ok" /> Submitted</span>
          </div>
        </Card>
      )}
    </>
  );
}
