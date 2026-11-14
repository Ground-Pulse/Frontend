"use client";

/**
 * Lightweight month calendar used as:
 *  - the date picker in the Inspection Scheduler (selectable, past days disabled)
 *  - the inspector's job calendar and owner schedule view (events per day)
 * Keyboard: arrow keys move focus between days, Enter selects.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function key(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function dateKeyFromIso(iso: string) {
  return key(new Date(iso));
}

export interface CalendarEvent {
  id: string;
  date: string; // ISO
  label: string;
  tone?: "blue" | "amber" | "green" | "red";
  href?: string;
}

export default function MonthCalendar({
  value,
  onChange,
  disablePast,
  events = [],
  onEventClick,
  compact,
}: {
  value?: string | null; // yyyy-mm-dd
  onChange?: (dateKey: string) => void;
  disablePast?: boolean;
  events?: CalendarEvent[];
  onEventClick?: (e: CalendarEvent) => void;
  compact?: boolean;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const initial = value ? new Date(value + "T00:00:00") : today;
  const [cursor, setCursor] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  const days = useMemo(() => {
    const first = new Date(cursor);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const start = new Date(first);
    start.setDate(first.getDate() - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const byDay = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      const k = dateKeyFromIso(e.date);
      m.set(k, [...(m.get(k) ?? []), e]);
    });
    return m;
  }, [events]);

  const toneCls = {
    blue: "bg-info-soft text-info",
    amber: "bg-warn-soft text-warn",
    green: "bg-ok-soft text-ok",
    red: "bg-bad-soft text-bad",
  };

  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = e.target as HTMLElement;
    const idx = Number(el.dataset.idx);
    if (isNaN(idx)) return;
    const move = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
    if (move) {
      e.preventDefault();
      const next = e.currentTarget.querySelector<HTMLElement>(`[data-idx="${idx + move}"]`);
      next?.focus();
    }
  }

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="select-none">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold" aria-live="polite">{monthLabel}</p>
        <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink" aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-muted">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">{compact ? d[0] : d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="grid" onKeyDown={onKey}>
        {days.map((d, i) => {
          const k = key(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isPast = d < today;
          const disabled = !!(disablePast && isPast);
          const selected = value === k;
          const isToday = d.getTime() === today.getTime();
          const evts = byDay.get(k) ?? [];
          const selectable = !!onChange;
          return (
            <div
              key={k}
              data-idx={i}
              role="gridcell"
              aria-selected={selected || undefined}
              aria-disabled={disabled || undefined}
              aria-label={d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) + (evts.length ? `, ${evts.length} event${evts.length > 1 ? "s" : ""}` : "")}
              tabIndex={selectable && !disabled ? (selected || (!value && isToday) ? 0 : -1) : -1}
              onClick={() => !disabled && onChange?.(k)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !disabled) {
                  e.preventDefault();
                  onChange?.(k);
                }
              }}
              className={cn(
                "rounded-lg text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                compact || !events.length ? "flex h-10 items-center justify-center" : "min-h-20 p-1.5 text-left align-top",
                !inMonth && "opacity-40",
                disabled ? "cursor-not-allowed text-subtle" : selectable && "cursor-pointer hover:bg-surface-2",
                selected && "bg-brand text-on-brand hover:bg-brand",
                isToday && !selected && "font-bold text-brand ring-1 ring-brand/40"
              )}
            >
              <span className={cn(events.length && !compact ? "text-xs" : "")}>{d.getDate()}</span>
              {!compact && evts.length > 0 && (
                <div className="mt-1 space-y-1">
                  {evts.slice(0, 2).map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        onEventClick?.(e);
                      }}
                      className={cn("block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium", toneCls[e.tone ?? "blue"])}
                    >
                      {e.label}
                    </button>
                  ))}
                  {evts.length > 2 && <p className="px-1 text-[10px] text-muted">+{evts.length - 2} more</p>}
                </div>
              )}
              {compact && evts.length > 0 && <span className="sr-only">has events</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
