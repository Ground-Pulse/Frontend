"use client";

/**
 * Inspection Scheduler modal (UX screen 3, US-003).
 * Calendar date picker + recurrence toggle (None / Weekly / Monthly / Quarterly).
 * Validation: date must be in the future.
 */
import { useState } from "react";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Select } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useScheduleInspection } from "@/hooks/useInspections";
import { errorMessage } from "@/lib/errors";
import type { Property, Recurrence } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const RECURRENCE: { value: Recurrence; label: string; rule?: string }[] = [
  { value: "NONE", label: "One-off" },
  { value: "WEEKLY", label: "Weekly", rule: "FREQ=WEEKLY" },
  { value: "MONTHLY", label: "Monthly", rule: "FREQ=MONTHLY" },
  { value: "QUARTERLY", label: "Quarterly", rule: "FREQ=MONTHLY;INTERVAL=3" },
];

export default function ScheduleInspectionDialog({
  open,
  onOpenChange,
  property,
  properties,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** preselected property; if omitted the owner picks from `properties` */
  property?: Property | null;
  properties?: Property[];
}) {
  const [propertyId, setPropertyId] = useState<string>("");
  const [date, setDate] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState<Recurrence>("NONE");
  const [error, setError] = useState<string | null>(null);
  const schedule = useScheduleInspection();

  const selectedPropertyId = property?.id ?? propertyId;

  function reset() {
    setDate(null);
    setRecurrence("NONE");
    setError(null);
    setPropertyId("");
  }

  function submit() {
    if (!selectedPropertyId) return setError("Choose a property.");
    if (!date) return setError("Please select a valid future date.");
    const picked = new Date(date + "T10:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (picked < today) return setError("Please select a valid future date.");
    setError(null);
    schedule.mutate(
      {
        propertyId: selectedPropertyId,
        scheduledDate: picked.toISOString(),
        recurrenceRule: RECURRENCE.find((r) => r.value === recurrence)?.rule,
      },
      {
        onSuccess: () => {
          toast.success("Inspection scheduled", { description: "An inspector will be assigned shortly." });
          reset();
          onOpenChange(false);
        },
        onError: (e) => setError(errorMessage(e)),
      }
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title="Schedule an inspection"
      description={property ? `${property.name} · ${property.city}` : "Pick a property, a date and how often to repeat it."}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={schedule.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} loading={schedule.isPending}>
            Confirm{date ? ` · ${formatDate(date + "T10:00:00", { year: undefined })}` : ""}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {!property && (
          <div>
            <label htmlFor="sched-prop" className="mb-1.5 block text-sm font-medium">Property</label>
            <Select id="sched-prop" value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
              <option value="">Select a property…</option>
              {properties?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.city}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-medium">Date</p>
          <div className="rounded-xl border border-line p-3">
            <MonthCalendar value={date} onChange={(k) => { setDate(k); setError(null); }} disablePast compact />
          </div>
          {error && <p className="mt-2 text-xs text-bad" role="alert">{error}</p>}
        </div>

        <div>
          <p id="recurrence-label" className="mb-2 text-sm font-medium">Repeat</p>
          <div role="radiogroup" aria-labelledby="recurrence-label" className="grid grid-cols-2 gap-1 rounded-xl bg-surface-2 p-1 sm:grid-cols-4">
            {RECURRENCE.map((r) => (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={recurrence === r.value}
                onClick={() => setRecurrence(r.value)}
                className={cn(
                  "h-10 rounded-lg text-sm font-medium transition-colors",
                  recurrence === r.value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          {recurrence !== "NONE" && (
            <p className="mt-2 text-xs text-muted">The next inspection is created automatically after each report.</p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
