import Link from "next/link";
import { cn } from "@/lib/utils";
import Card from "./Card";
import { Skeleton } from "./Feedback";

/**
 * One number + label box. Used for the owner summary row and the admin
 * LiveCountCard (clickable → filtered drill-down).
 */
export default function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  loading,
  tone = "default",
  active,
  onClick,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  loading?: boolean;
  tone?: "default" | "warn" | "bad" | "ok" | "info";
  active?: boolean;
  onClick?: () => void;
}) {
  const toneCls = {
    default: "bg-surface-2 text-muted",
    warn: "bg-warn-soft text-warn",
    bad: "bg-bad-soft text-bad",
    ok: "bg-ok-soft text-ok",
    info: "bg-info-soft text-info",
  }[tone];

  const body = (
    <Card
      className={cn(
        "h-full transition-colors",
        (href || onClick) && "hover:border-brand/40",
        active && "border-brand ring-1 ring-brand"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        {icon && <span className={cn("rounded-lg p-1.5", toneCls)}>{icon}</span>}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <p className="mt-2 text-3xl font-extrabold tabular-nums tracking-tight text-ink">{value}</p>
      )}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );

  if (href) return <Link href={href} className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-ring">{body}</Link>;
  if (onClick)
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className="block w-full rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-ring">
        {body}
      </button>
    );
  return body;
}
