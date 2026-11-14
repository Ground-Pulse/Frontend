import { AlertTriangle, CheckCircle2, Circle, XCircle } from "lucide-react";
import type { CheckStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Pass / Fail / Attention always shown with icon + label, never colour alone. */
export const STATUS_META: Record<CheckStatus, { label: string; icon: React.ComponentType<{ className?: string }>; on: string; text: string }> = {
  PASS: { label: "Pass", icon: CheckCircle2, on: "border-ok bg-ok text-white", text: "text-ok" },
  ATTENTION: { label: "Attention", icon: AlertTriangle, on: "border-warn bg-warn text-white dark:text-black", text: "text-warn" },
  FAIL: { label: "Fail", icon: XCircle, on: "border-bad bg-bad text-white dark:text-black", text: "text-bad" },
};

export function StatusIcon({ status, className }: { status: CheckStatus | null; className?: string }) {
  if (!status) return <Circle className={cn("h-4 w-4 text-subtle", className)} aria-label="Not checked" />;
  const M = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", M.text, className)}>
      <M.icon className="h-4 w-4" /> {M.label}
    </span>
  );
}
