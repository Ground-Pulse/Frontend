"use client";

import { CalendarDays, ChevronRight, Repeat, UserRound } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import type { Inspection } from "@/lib/types";
import { cn, dayLabel, formatDate, recurrenceLabel } from "@/lib/utils";

/** One inspection row, reused by owner, inspector and admin lists. */
function InspectionListItem({
  inspection: i,
  href,
  showProgress,
  action,
}: {
  inspection: Inspection;
  href?: string;
  showProgress?: boolean;
  action?: React.ReactNode;
}) {
  const pct = i.itemsTotal ? Math.round((i.itemsDone / i.itemsTotal) * 100) : 0;
  const content = (
    <>
      <div className="flex w-14 shrink-0 flex-col items-center rounded-xl bg-surface-2 py-2 text-center">
        <span className="text-[11px] font-semibold uppercase text-muted">
          {new Date(i.scheduledDate).toLocaleDateString("en-IN", { month: "short" })}
        </span>
        <span className="text-xl font-extrabold leading-none text-ink">{new Date(i.scheduledDate).getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{i.propertyName}</p>
          <StatusBadge status={i.status} />
        </div>
        <p className="mt-0.5 truncate text-sm text-muted">{i.propertyAddress}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {i.status === "SUBMITTED" ? formatDate(i.submittedAt ?? i.scheduledDate) : dayLabel(i.scheduledDate)}
          </span>
          <span className="flex items-center gap-1">
            <UserRound className="h-3.5 w-3.5" /> {i.inspectorName ?? <em className="not-italic text-warn">Assigning inspector…</em>}
          </span>
          {i.recurrenceRule && (
            <span className="flex items-center gap-1">
              <Repeat className="h-3.5 w-3.5" /> {recurrenceLabel(i.recurrenceRule)}
            </span>
          )}
          {i.status === "SUBMITTED" && i.issueCount > 0 && <span className="font-medium text-bad">{i.issueCount} issue{i.issueCount > 1 ? "s" : ""}</span>}
        </div>
        {showProgress && i.status !== "SUBMITTED" && (
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Checklist progress">
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs tabular-nums text-muted">{i.itemsDone}/{i.itemsTotal}</span>
          </div>
        )}
      </div>
      {action}
      {href && !action && <ChevronRight className="h-4 w-4 shrink-0 text-subtle" />}
    </>
  );
  const cls = cn("flex items-center gap-4 rounded-2xl border border-line bg-surface p-4", href && "transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-ring");
  return href && !action ? (
    <Link href={href} className={cls}>
      {content}
    </Link>
  ) : (
    <div className={cls}>{content}</div>
  );
}

export default memo(InspectionListItem);
