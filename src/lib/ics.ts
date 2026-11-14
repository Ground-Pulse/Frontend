/**
 * Calendar export (C-019 Calendar Sync, lightweight version): builds an .ics
 * file that Google Calendar, Outlook and Apple Calendar can all import.
 */
import type { Inspection } from "./types";

function stamp(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function inspectionsToIcs(inspections: Inspection[]) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GroundPulse//Inspections//EN", "CALSCALE:GREGORIAN"];
  for (const i of inspections) {
    const start = new Date(i.scheduledDate);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${i.id}@groundpulse`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${escape(`GroundPulse inspection — ${i.propertyName}`)}`,
      `LOCATION:${escape(i.propertyAddress)}`,
      `DESCRIPTION:${escape(`Inspector: ${i.inspectorName ?? "being assigned"}`)}`,
      ...(i.recurrenceRule ? [`RRULE:${i.recurrenceRule}`] : []),
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(inspections: Inspection[], fileName = "groundpulse-inspections.ics") {
  const blob = new Blob([inspectionsToIcs(inspections)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
