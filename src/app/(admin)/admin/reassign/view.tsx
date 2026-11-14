"use client";

/** Admin → Assignments: repairs needing a provider + inspector (re)assignment. */
import { UserRoundCog, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AssignProviderDialog, ReassignInspectorDialog } from "@/components/admin/AssignDialogs";
import { CategoryTag } from "@/components/issue/IssueParts";
import InspectionListItem from "@/components/inspection/InspectionListItem";
import { PageHeader } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import Tabs from "@/components/ui/Tabs";
import { useInspections } from "@/hooks/useInspections";
import { useRepairs } from "@/hooks/useRepairs";
import type { Inspection, RepairWithContext } from "@/lib/types";
import { relativeTime } from "@/lib/utils";

export default function AssignmentsPage() {
  const [tab, setTab] = useState<"repairs" | "inspections">("repairs");
  const repairs = useRepairs("REQUESTED,ASSIGNED");
  const inspections = useInspections({ status: "SCHEDULED" });
  const [assign, setAssign] = useState<RepairWithContext | null>(null);
  const [reassign, setReassign] = useState<Inspection | null>(null);

  const requested = repairs.data?.filter((r) => r.status === "REQUESTED") ?? [];
  const unassigned = inspections.data?.filter((i) => !i.inspectorId) ?? [];

  return (
    <>
      <PageHeader title="Assignments" description="Route approved repairs to verified providers and (re)assign inspectors." />
      <div className="mb-5">
        <Tabs
          label="Assignment type"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "repairs", label: "Repairs", count: requested.length },
            { value: "inspections", label: "Inspections", count: unassigned.length },
          ]}
        />
      </div>

      {tab === "repairs" &&
        (repairs.isLoading ? (
          <SkeletonRows />
        ) : repairs.isError ? (
          <ErrorState message="Couldn't load repairs." onRetry={() => repairs.refetch()} />
        ) : !repairs.data?.length ? (
          <EmptyState icon={<Wrench className="h-6 w-6" />} title="Nothing to assign" description="Approved repairs appear here until a provider accepts them." />
        ) : (
          <div className="space-y-3">
            {repairs.data.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryTag category={r.issueCategory} />
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-muted">approved {relativeTime(r.createdAt)}</span>
                  </div>
                  <Link href={`/issue/${r.issueId}`} className="mt-1.5 block font-semibold hover:underline">
                    {r.propertyName}, {r.propertyCity}
                  </Link>
                  <p className="line-clamp-1 text-sm text-muted">{r.issueDescription}</p>
                  {r.provider && <p className="mt-1 text-xs text-muted">Assigned to {r.provider.name} · waiting for them to accept</p>}
                </div>
                <Button variant={r.status === "REQUESTED" ? "primary" : "outline"} onClick={() => setAssign(r)}>
                  {r.status === "REQUESTED" ? "Assign provider" : "Reassign"}
                </Button>
              </div>
            ))}
          </div>
        ))}

      {tab === "inspections" &&
        (inspections.isLoading ? (
          <SkeletonRows />
        ) : !inspections.data?.length ? (
          <EmptyState title="No scheduled inspections" />
        ) : (
          <div className="space-y-3">
            {[...unassigned, ...inspections.data.filter((i) => i.inspectorId)].map((i) => (
              <InspectionListItem
                key={i.id}
                inspection={i}
                action={
                  <Button size="sm" variant={i.inspectorId ? "outline" : "primary"} onClick={() => setReassign(i)}>
                    <UserRoundCog className="h-4 w-4" /> {i.inspectorId ? "Reassign" : "Assign"}
                  </Button>
                }
              />
            ))}
          </div>
        ))}

      <AssignProviderDialog repair={assign} open={!!assign} onOpenChange={(o) => !o && setAssign(null)} />
      <ReassignInspectorDialog inspection={reassign} open={!!reassign} onOpenChange={(o) => !o && setReassign(null)} />
    </>
  );
}
