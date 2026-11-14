import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { IssueCategory } from "./types";

/**
 * Merges Tailwind class names safely.
 * clsx      -> joins conditional classes
 * twMerge   -> removes conflicting Tailwind classes (e.g. "p-2 p-4" -> "p-4")
 * This is the same helper shadcn/ui uses in every component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", ...opts });
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  const units: [number, string][] = [
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [604_800_000, "week"],
  ];
  if (abs < 60_000) return future ? "in a moment" : "just now";
  let value = 0;
  let unit = "minute";
  for (const [ms, name] of units) {
    if (abs >= ms) {
      value = Math.floor(abs / ms);
      unit = name;
    }
  }
  if (unit === "week" && value > 4) return formatDate(iso);
  const label = `${value} ${unit}${value > 1 ? "s" : ""}`;
  return future ? `in ${label}` : `${label} ago`;
}

export function daysUntil(iso: string) {
  const a = new Date();
  a.setHours(0, 0, 0, 0);
  const b = new Date(iso);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function dayLabel(iso: string) {
  const d = daysUntil(iso);
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  return formatDate(iso, { weekday: "short", year: undefined });
}

export const formatINR = (n: number | null | undefined) =>
  n == null ? "—" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const CATEGORY_LABEL: Record<IssueCategory, string> = {
  LEAK: "Water leakage",
  ELECTRICAL: "Electrical",
  SECURITY: "Security",
  CLEANLINESS: "Cleanliness",
  OTHER: "Other",
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function recurrenceLabel(rule: string | null) {
  if (!rule) return "One-off";
  if (rule.includes("WEEKLY")) return "Weekly";
  if (rule.includes("INTERVAL=3")) return "Quarterly";
  if (rule.includes("MONTHLY")) return "Monthly";
  return "Recurring";
}

export function scoreColor(score: number | null) {
  if (score == null) return "var(--gp-subtle)";
  if (score >= 70) return "var(--gp-ok)";
  if (score >= 40) return "var(--gp-warn)";
  return "var(--gp-bad)";
}
