"use client";

import { CalendarClock, MapPin } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Property } from "@/lib/types";
import { dayLabel, formatDate } from "@/lib/utils";
import HealthScoreRing from "./HealthScoreRing";

/** Property card on the owner dashboard (US-002). */
function PropertyCard({ property, onSchedule }: { property: Property; onSchedule: (p: Property) => void }) {
  const p = property;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-lg">
      <Link href={`/property/${p.id}`} className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-ring" aria-label={`Open ${p.name}`} />
      <div className="relative h-36 overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.coverPhotoUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone="neutral" className="bg-surface/90 text-ink backdrop-blur">{p.type}</Badge>
          {p.nextInspectionDate && (
            <Badge tone="blue" className="backdrop-blur" icon={<CalendarClock className="h-3 w-3" />}>
              Inspection {dayLabel(p.nextInspectionDate).toLowerCase()}
            </Badge>
          )}
        </div>
        {p.openIssueCount > 0 && (
          <span
            className="absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-bad px-2 text-xs font-bold text-white shadow"
            aria-label={`${p.openIssueCount} open issues`}
          >
            {p.openIssueCount}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-start gap-4 p-4">
        <HealthScoreRing score={p.healthScore} size={64} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-ink">{p.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
            <MapPin className="h-3 w-3 shrink-0" /> {p.address}, {p.city}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>Last inspected {formatDate(p.lastInspectionDate, { year: undefined })}</span>
            <span aria-hidden>·</span>
            {p.openIssueCount > 0 ? (
              <span className="font-medium text-bad">{p.openIssueCount} issue{p.openIssueCount > 1 ? "s" : ""} need you</span>
            ) : (
              <span className="font-medium text-ok">All clear</span>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-line px-4 py-3">
        <Button variant="secondary" size="sm" className="w-full" onClick={() => onSchedule(p)}>
          <CalendarClock className="h-4 w-4" /> Schedule inspection
        </Button>
      </div>
    </article>
  );
}

export default memo(PropertyCard);
