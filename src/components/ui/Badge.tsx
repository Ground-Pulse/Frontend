import { cn } from "@/lib/utils";

/**
 * Status pill. Same component in Owner, Inspector, Admin and Provider views
 * (UX principle: consistency).
 */
export type Tone = "green" | "red" | "amber" | "neutral" | "blue" | "teal";

const tones: Record<Tone, string> = {
  green: "bg-ok-soft text-ok",
  red: "bg-bad-soft text-bad",
  amber: "bg-warn-soft text-warn",
  neutral: "bg-surface-2 text-muted",
  blue: "bg-info-soft text-info",
  teal: "bg-teal-soft text-teal",
};

export default function Badge({
  tone = "neutral",
  children,
  className,
  icon,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/** Maps a status string coming from the API to a badge colour. */
export function toneForStatus(status: string): Tone {
  switch (status) {
    case "PASS":
    case "SUBMITTED":
    case "COMPLETED":
    case "CLOSED":
      return "green";
    case "FAIL":
    case "FLAGGED":
      return "red";
    case "ATTENTION":
    case "IN_PROGRESS":
    case "REQUESTED":
      return "amber";
    case "SCHEDULED":
    case "ASSIGNED":
    case "APPROVED":
      return "blue";
    default:
      return "neutral";
  }
}

export function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ");
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={toneForStatus(status)} className={className}>
      {statusLabel(status)}
    </Badge>
  );
}
