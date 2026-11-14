"use client";

/** Immutable audit log of every state-changing action (BR-011). */
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import Badge from "@/components/ui/Badge";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import { Select } from "@/components/ui/Input";
import { useAuditLogs } from "@/hooks/useAdmin";
import type { AuditLog } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const ENTITY_TYPES = ["", "Property", "Inspection", "Issue", "Repair", "User"];

function entityHref(a: AuditLog) {
  if (a.entityType === "Property") return `/property/${a.entityId}`;
  if (a.entityType === "Inspection") return `/report/${a.entityId}`;
  if (a.entityType === "Issue") return `/issue/${a.entityId}`;
  return null;
}

export default function AuditPage() {
  const [entityType, setEntityType] = useState("");
  const q = useAuditLogs({ entityType: entityType || undefined });
  return (
    <>
      <PageHeader title="Audit log" description="Insert-only record of approvals, assignments and status changes." />
      <div className="mb-4 w-full max-w-xs">
        <Select value={entityType} onChange={(e) => setEntityType(e.target.value)} aria-label="Filter by entity">
          {ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>{t || "All entities"}</option>
          ))}
        </Select>
      </div>
      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load the audit log." onRetry={() => q.refetch()} />
      ) : !q.data?.length ? (
        <EmptyState title="No entries" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Time</th>
                <th scope="col" className="px-4 py-3 font-medium">Entity</th>
                <th scope="col" className="px-4 py-3 font-medium">Action</th>
                <th scope="col" className="px-4 py-3 font-medium">Actor</th>
                <th scope="col" className="px-4 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {q.data.map((a) => {
                const href = entityHref(a);
                return (
                  <tr key={a.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{formatDateTime(a.timestamp)}</td>
                    <td className="px-4 py-3">
                      <Badge tone="neutral">{a.entityType}</Badge>{" "}
                      {href ? <Link href={href} className="font-mono text-xs text-brand hover:underline">{a.entityId.slice(0, 14)}</Link> : <span className="font-mono text-xs">{a.entityId.slice(0, 14)}</span>}
                    </td>
                    <td className="px-4 py-3 font-medium">{a.action.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3">{a.actorName}</td>
                    <td className="max-w-xs truncate px-4 py-3 font-mono text-xs text-muted">{Object.keys(a.metadata).length ? JSON.stringify(a.metadata) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
