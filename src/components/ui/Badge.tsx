import { cn } from "@/lib/utils";

/**
 * Small coloured pill used for statuses:
 * PASS / FAIL / ATTENTION on checklist rows, and
 * SCHEDULED / IN_PROGRESS / SUBMITTED / FLAGGED / APPROVED on lists.
 */
export type Tone = "green" | "red" | "amber" | "neutral";

const tones: Record<Tone, string> = {
  green: "bg-[#DCE9DF] text-[#0B3523]",
  red: "bg-[#FBE4E2] text-[#8A2B20]",
  amber: "bg-[#FAEFD6] text-[#7A5A12]",
  neutral: "bg-[#F3F0E5] text-[#6B6B63]",
};

export default function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps a status string coming from the API to a badge colour. */
export function toneForStatus(status: string): Tone {
  switch (status) {
    case "PASS":
    case "SUBMITTED":
    case "APPROVED":
      return "green";
    case "FAIL":
    case "FLAGGED":
      return "red";
    case "ATTENTION":
    case "IN_PROGRESS":
      return "amber";
    default:
      return "neutral";
  }
}
