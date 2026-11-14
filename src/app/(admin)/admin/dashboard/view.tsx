"use client";

/**
 * ADMIN DASHBOARD (UX screen 7, US-011). Live count cards → click to filter
 * the drill-down table; rows open the property / inspection / issue / repair.
 * Counts refetch on every real-time push and on window focus.
 */
import { AlertTriangle, Building2, CalendarClock, ShieldCheck, UserRoundCog, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AssignProviderDialog, ReassignInspectorDialog } from "@/components/admin/AssignDialogs";
import { PageHeader } from "@/components/layout/AppShell";
import HealthScoreRing from "@/components/property/HealthScoreRing";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import StatCard from "@/components/ui/StatCard";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { useInspections } from "@/hooks/useInspections";
import { useIssues } from "@/hooks/useIssues";
import { useProperties } from "@/hooks/useProperties";
import { useRepairs } from "@/hooks/useRepairs";
import type { Inspection, RepairWithContext } from "@/lib/types";
import { CATEGORY_LABEL, dayLabel, formatDate, relativeTime } from "@/lib/utils";

type View = "properties" | "inspections" | "issues" | "repairs";

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export default function AdminDashboardPage() {
  const summary = useAdminDashboard();
  const [view, setView] = useState<View>("inspections");
  const properties = useProperties(view === "properties");
  const inspections = useInspections({ status: "SCHEDULED,IN_PROGRESS" });
  const issues = useIssues({ status: "FLAGGED" });
  const repairs = useRepairs("REQUESTED,ASSIGNED,IN_PROGRESS");
  const [reassign, setReassign] = useState<Inspection | null>(null);
  const [assign, setAssign] = useState<RepairWithContext | null>(null);

  const s = summary.data;
  const loading = summary.isLoading;

  return (
    <>
      <PageHeader title="Platform overview" description="Live counts across every property, inspection, issue and repair." />

      {summary.isError && <ErrorState className="mb-6" message="Couldn't load live counts." onRetry={() => summary.refetch()} />}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Active properties" value={s?.activeProperties ?? 0} icon={<Building2 className="h-4 w-4" />} loading={loading} onClick={() => setView("properties")} active={view === "properties"} />
        <StatCard label="Pending inspections" value={s?.pendingInspections ?? 0} icon={<CalendarClock className="h-4 w-4" />} tone="info" loading={loading} onClick={() => setView("inspections")} active={view === "inspections"} />
        <StatCard label="Open issues" value={s?.openIssues ?? 0} icon={<AlertTriangle className="h-4 w-4" />} tone="bad" loading={loading} onClick={() => setView("issues")} active={view === "issues"} />
        <StatCard label="Repairs underway" value={s?.inProgressRepairs ?? 0} hint={s?.requestedRepairs ? `${s.requestedRepairs} waiting for a provider` : undefined} icon={<Wrench className="h-4 w-4" />} tone="warn" loading={loading} onClick={() => setView("repairs")} active={view === "repairs"} />
      </div>

      {!!s?.pendingVerifications && (
        <Link href="/admin/verification" className="mt-4 flex items-center gap-3 rounded-2xl border border-teal/30 bg-teal-soft p-4 text-sm hover:brightness-[0.98]">
          <ShieldCheck className="h-5 w-5 text-teal" />
          <span className="flex-1"><strong>{s.pendingVerifications}</strong> inspector/provider account{s.pendingVerifications > 1 ? "s" : ""} waiting for verification</span>
          <span className="font-medium text-teal">Review →</span>
        </Link>
      )}

      <section className="mt-8" aria-live="polite">
        <h2 className="mb-4 text-lg font-semibold capitalize">
          {view === "inspections" ? "Pending inspections" : view === "issues" ? "Open issues" : view === "repairs" ? "Active repairs" : "Properties"}
        </h2>

        {view === "properties" &&
          (properties.isLoading ? <SkeletonRows /> : !properties.data?.length ? <EmptyState title="No properties yet" /> : (
            <Table head={["Property", "Owner", "Type", "Health", "Last inspected", "Open issues"]}>
              {properties.data.map((p) => (
                <tr key={p.id} className="hover:bg-surface-2">
                  <td className="px-4 py-3"><Link href={`/property/${p.id}`} className="font-medium hover:underline">{p.name}</Link><p className="text-xs text-muted">{p.city}</p></td>
                  <td className="px-4 py-3">{p.ownerName}</td>
                  <td className="px-4 py-3">{p.type}</td>
                  <td className="px-4 py-3"><HealthScoreRing score={p.healthScore} size={40} /></td>
                  <td className="px-4 py-3">{formatDate(p.lastInspectionDate)}</td>
                  <td className="px-4 py-3">{p.openIssueCount || "—"}</td>
                </tr>
              ))}
            </Table>
          ))}

        {view === "inspections" &&
          (inspections.isLoading ? <SkeletonRows /> : !inspections.data?.length ? <EmptyState title="No pending inspections" /> : (
            <Table head={["Date", "Property", "Inspector", "Status", "Progress", ""]}>
              {inspections.data.map((i) => (
                <tr key={i.id} className="hover:bg-surface-2">
                  <td className="whitespace-nowrap px-4 py-3">{dayLabel(i.scheduledDate)}</td>
                  <td className="px-4 py-3"><Link href={`/property/${i.propertyId}`} className="font-medium hover:underline">{i.propertyName}</Link></td>
                  <td className="px-4 py-3">{i.inspectorName ?? <span className="font-medium text-warn">Unassigned</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3 tabular-nums">{i.itemsDone}/{i.itemsTotal}</td>
                  <td className="px-4 py-3 text-right">
                    {i.status === "SCHEDULED" && (
                      <Button size="sm" variant="outline" onClick={() => setReassign(i)}>
                        <UserRoundCog className="h-4 w-4" /> {i.inspectorId ? "Reassign" : "Assign"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          ))}

        {view === "issues" &&
          (issues.isLoading ? <SkeletonRows /> : !issues.data?.length ? <EmptyState title="No open issues" /> : (
            <Table head={["Flagged", "Property", "Category", "Description", "Inspector"]}>
              {issues.data.map((i) => (
                <tr key={i.id} className="hover:bg-surface-2">
                  <td className="whitespace-nowrap px-4 py-3">{relativeTime(i.createdAt)}</td>
                  <td className="px-4 py-3">{i.propertyName}</td>
                  <td className="px-4 py-3">{CATEGORY_LABEL[i.category]}</td>
                  <td className="max-w-xs px-4 py-3"><Link href={`/issue/${i.id}`} className="line-clamp-1 hover:underline">{i.description}</Link></td>
                  <td className="px-4 py-3">{i.flaggedByName}</td>
                </tr>
              ))}
            </Table>
          ))}

        {view === "repairs" &&
          (repairs.isLoading ? <SkeletonRows /> : !repairs.data?.length ? <EmptyState title="No active repairs" /> : (
            <Table head={["Updated", "Property", "Category", "Provider", "Status", ""]}>
              {repairs.data.map((r) => (
                <tr key={r.id} className="hover:bg-surface-2">
                  <td className="whitespace-nowrap px-4 py-3">{relativeTime(r.updatedAt)}</td>
                  <td className="px-4 py-3"><Link href={`/issue/${r.issueId}`} className="font-medium hover:underline">{r.propertyName}</Link><p className="text-xs text-muted">{r.propertyCity}</p></td>
                  <td className="px-4 py-3">{CATEGORY_LABEL[r.issueCategory]}</td>
                  <td className="px-4 py-3">{r.provider?.name ?? <span className="font-medium text-warn">Needs provider</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {(r.status === "REQUESTED" || r.status === "ASSIGNED") && (
                      <Button size="sm" variant={r.status === "REQUESTED" ? "primary" : "outline"} onClick={() => setAssign(r)}>
                        {r.status === "REQUESTED" ? "Assign" : "Reassign"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          ))}
      </section>

      <Card className="mt-8 text-sm text-muted">
        Assignments are verification-gated: unverified inspectors and providers are visible but can never be selected.
      </Card>

      <ReassignInspectorDialog inspection={reassign} open={!!reassign} onOpenChange={(o) => !o && setReassign(null)} />
      <AssignProviderDialog repair={assign} open={!!assign} onOpenChange={(o) => !o && setAssign(null)} />
    </>
  );
}
