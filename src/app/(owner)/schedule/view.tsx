"use client";

/** Owner → Inspections: upcoming / past list, calendar view, schedule, export. */
import { CalendarDays, CalendarPlus, Download, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import InspectionListItem from "@/components/inspection/InspectionListItem";
import { PageHeader } from "@/components/layout/AppShell";
import ScheduleInspectionDialog from "@/components/property/ScheduleInspectionDialog";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import Tabs from "@/components/ui/Tabs";
import { toast } from "@/components/ui/Toast";
import { useCancelInspection, useInspections } from "@/hooks/useInspections";
import { useProperties } from "@/hooks/useProperties";
import { errorMessage } from "@/lib/errors";
import { downloadIcs } from "@/lib/ics";
import { cn } from "@/lib/utils";

export default function OwnerSchedulePage() {
  const router = useRouter();
  const inspections = useInspections();
  const properties = useProperties();
  const cancel = useCancelInspection();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [open, setOpen] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);

  const all = inspections.data ?? [];
  const upcoming = all.filter((i) => i.status !== "SUBMITTED");
  const past = all.filter((i) => i.status === "SUBMITTED").reverse();
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <PageHeader
        title="Inspections"
        description="Upcoming visits and every past report."
        actions={
          <>
            <Button variant="outline" onClick={() => downloadIcs(upcoming)} disabled={!upcoming.length}>
              <Download className="h-4 w-4" /> Add to calendar
            </Button>
            <Button onClick={() => setOpen(true)} disabled={!properties.data?.length}>
              <CalendarPlus className="h-4 w-4" /> Schedule inspection
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <Tabs
          label="Inspection list"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "upcoming", label: "Upcoming", count: upcoming.length },
            { value: "past", label: "Past reports", count: past.length },
          ]}
        />
        <div className="flex rounded-xl bg-surface-2 p-1" role="radiogroup" aria-label="View">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={cn("flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium", view === v ? "bg-surface shadow-sm" : "text-muted")}
            >
              {v === "list" ? <List className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
              {v === "list" ? "List" : "Calendar"}
            </button>
          ))}
        </div>
      </div>

      {inspections.isLoading ? (
        <SkeletonRows />
      ) : inspections.isError ? (
        <ErrorState message="Couldn't load inspections." onRetry={() => inspections.refetch()} />
      ) : view === "calendar" ? (
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
              router.push(ins?.status === "SUBMITTED" ? `/report/${e.id}` : `/property/${ins?.propertyId}`);
            }}
          />
        </Card>
      ) : shown.length === 0 ? (
        <EmptyState
          title={tab === "upcoming" ? "No upcoming inspections" : "No reports yet"}
          description={tab === "upcoming" ? "Schedule one-off or recurring inspections for any property." : "Reports appear here within 48 hours of each visit."}
          action={tab === "upcoming" ? <Button onClick={() => setOpen(true)}>Schedule inspection</Button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {shown.map((i) => (
            <InspectionListItem
              key={i.id}
              inspection={i}
              href={i.status === "SUBMITTED" ? `/report/${i.id}` : `/property/${i.propertyId}`}
              action={
                i.status === "SCHEDULED" ? (
                  <Button size="sm" variant="ghost" className="text-bad" onClick={() => setCancelId(i.id)}>
                    Cancel
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      <ScheduleInspectionDialog open={open} onOpenChange={setOpen} properties={properties.data} />
      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(o) => !o && setCancelId(null)}
        title="Cancel this inspection?"
        description="The assigned inspector will be notified. This can't be undone."
        confirmLabel="Cancel inspection"
        tone="danger"
        loading={cancel.isPending}
        onConfirm={() =>
          cancel.mutate(cancelId!, {
            onSuccess: () => {
              toast.success("Inspection cancelled");
              setCancelId(null);
            },
            onError: (e) => toast.error("Couldn't cancel", { description: errorMessage(e) }),
          })
        }
      />
    </>
  );
}
