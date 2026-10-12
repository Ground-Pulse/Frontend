"use client";

/**
 * INSPECTOR DASHBOARD (PRD US-004, US-006).
 *
 * What the inspector sees:
 *  - today's assigned jobs with a progress bar
 *  - the active checklist, grouped by room
 *  - PASS / FAIL / ATTENTION buttons on every row
 *
 * The checklist state is local for now. In the full build, "Submit checklist"
 * will POST to the backend, which locks the checklist and generates the report.
 */
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";
import Badge, { toneForStatus } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { api } from "@/lib/api";
import type { CheckStatus, ChecklistItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function InspectorDashboard() {
  const inspectionsQuery = useQuery({
    queryKey: ["inspections"],
    queryFn: api.getInspections,
  });
  const checklistQuery = useQuery({
    queryKey: ["checklist"],
    queryFn: api.getChecklist,
  });

  // Local copy of the checklist so the inspector can tick items in the demo.
  const [items, setItems] = useState<ChecklistItem[]>([]);
  useEffect(() => {
    if (checklistQuery.data) setItems(checklistQuery.data);
  }, [checklistQuery.data]);

  function setStatus(id: string, status: CheckStatus) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }

  const inspections = inspectionsQuery.data ?? [];
  const todaysJobs = inspections.filter((i) => i.status !== "SUBMITTED").length;
  const submitted = inspections.filter((i) => i.status === "SUBMITTED").length;
  const done = items.filter((i) => i.status !== null).length;

  // Group checklist rows by room so the UI matches how the inspector walks
  // through the property (PRD: "checklist organised by room/area").
  const rooms = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.roomArea] ||= []).push(item);
    return acc;
  }, {});

  return (
    <DashboardShell
      role="INSPECTOR"
      title="Today's inspections"
      subtitle="Your assigned jobs and the checklist for the property you are in."
    >
      {/* ---------- Counts ---------- */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Jobs today" value={todaysJobs} />
        <StatCard label="Submitted" value={submitted} hint="Report generated" />
        <StatCard
          label="Checklist progress"
          value={`${done}/${items.length}`}
          hint="Current property"
        />
      </div>

      {/* ---------- Assigned jobs ---------- */}
      <section className="mt-10">
        <h2 className="mb-4 font-serif text-xl font-semibold">Assigned jobs</h2>

        {inspectionsQuery.isLoading ? (
          <p className="text-sm text-[#6B6B63]">Loading jobs…</p>
        ) : (
          <div className="space-y-3">
            {inspections.map((job) => {
              const percent = Math.round((job.itemsDone / job.itemsTotal) * 100);
              return (
                <Card key={job.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge tone={toneForStatus(job.status)}>
                          {job.status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-[#6B6B63]">
                          {job.scheduledDate}
                        </span>
                      </div>
                      <p className="mt-2 font-medium">{job.propertyAddress}</p>

                      {/* progress bar */}
                      <div className="mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-[#F3F0E5]">
                        <div
                          className="h-full rounded-full bg-[#12452E]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-[#6B6B63]">
                        {job.itemsDone} of {job.itemsTotal} checks done
                      </p>
                    </div>

                    <Button size="sm" variant={job.status === "SUBMITTED" ? "ghost" : "primary"}>
                      {job.status === "SUBMITTED" ? "View report" : "Open checklist"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------- Active checklist ---------- */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold">
            Checklist — Brigade Meadows Villa
          </h2>
          <Button size="sm" disabled={done < items.length}>
            Submit checklist
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(rooms).map(([room, roomItems]) => (
            <Card key={room}>
              <p className="mb-3 text-xs uppercase tracking-wide text-[#6B6B63]">
                {room}
              </p>

              <div className="space-y-3">
                {roomItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F3F0E5] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.itemName}</p>
                      <p className="text-xs text-[#6B6B63]">
                        {item.photos} photo{item.photos === 1 ? "" : "s"} attached
                      </p>
                    </div>

                    {/* Three-state control: PASS / ATTENTION / FAIL */}
                    <div className="flex gap-1.5">
                      {(["PASS", "ATTENTION", "FAIL"] as CheckStatus[]).map(
                        (s) => (
                          <button
                            key={s}
                            onClick={() => setStatus(item.id, s)}
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                              item.status === s
                                ? s === "PASS"
                                  ? "border-[#2F7A52] bg-[#DCE9DF] text-[#0B3523]"
                                  : s === "ATTENTION"
                                  ? "border-[#C08A28] bg-[#FAEFD6] text-[#7A5A12]"
                                  : "border-[#C4554A] bg-[#FBE4E2] text-[#8A2B20]"
                                : "border-[#E4DFD2] text-[#6B6B63] hover:bg-[#F3F0E5]"
                            )}
                          >
                            {s === "ATTENTION" ? "Attention" : s === "PASS" ? "Pass" : "Fail"}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
