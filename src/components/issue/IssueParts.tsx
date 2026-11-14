"use client";

import { Check, ChevronRight, Droplets, History, ShieldAlert, ShieldCheck, Sparkles, Star, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import Badge, { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { usePostIssueMessage } from "@/hooks/useIssues";
import { errorMessage } from "@/lib/errors";
import type { AuditLog, Issue, IssueCategory, IssueMessage, RepairStatus } from "@/lib/types";
import { CATEGORY_LABEL, cn, formatDateTime, relativeTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export const CATEGORY_ICON: Record<IssueCategory, React.ComponentType<{ className?: string }>> = {
  LEAK: Droplets,
  ELECTRICAL: Zap,
  SECURITY: ShieldAlert,
  CLEANLINESS: Sparkles,
  OTHER: Wrench,
};

export function CategoryTag({ category }: { category: IssueCategory }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <Badge tone="neutral" icon={<Icon className="h-3 w-3" />}>
      {CATEGORY_LABEL[category]}
    </Badge>
  );
}

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <Badge tone="teal" icon={<ShieldCheck className="h-3 w-3" />} className="font-semibold">
      <span aria-label="Verified provider">{label}</span>
    </Badge>
  );
}

/** Requested → Assigned → In Progress → Completed (US-008). */
const STEPS: { status: RepairStatus; label: string }[] = [
  { status: "REQUESTED", label: "Requested" },
  { status: "ASSIGNED", label: "Assigned" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "COMPLETED", label: "Completed" },
];

export function RepairStatusTracker({ status }: { status: RepairStatus }) {
  const current = STEPS.findIndex((s) => s.status === status);
  return (
    <ol className="flex items-start" aria-label={`Repair status: ${status.replace("_", " ").toLowerCase()}`}>
      {STEPS.map((s, i) => {
        const done = i < current || status === "COMPLETED";
        const active = i === current && status !== "COMPLETED";
        return (
          <li key={s.status} className="relative flex flex-1 flex-col items-center text-center" aria-current={active ? "step" : undefined}>
            {i > 0 && (
              <span
                className={cn("absolute right-1/2 top-4 -z-0 h-0.5 w-full -translate-y-1/2 transition-colors duration-500", i <= current ? "bg-ok" : "bg-line")}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-500",
                done && "border-ok bg-ok text-white",
                active && "border-warn bg-warn-soft text-warn ring-4 ring-warn/15",
                !done && !active && "border-line bg-surface text-subtle"
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("mt-2 text-xs font-medium", active ? "text-ink" : done ? "text-ok" : "text-muted")}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function auditLabel(a: AuditLog) {
  const m = a.metadata as Record<string, string | number>;
  switch (a.action) {
    case "FLAGGED":
      return "Issue flagged";
    case "APPROVED":
      return "Repair approved by owner";
    case "DECLINED":
      return `Declined${m.reason ? ` — “${m.reason}”` : ""}`;
    case "CREATED":
      return "Repair request created";
    case "ASSIGNED":
      return "Verified provider assigned";
    case "REASSIGNED":
      return "Provider reassigned";
    case "STATUS_CHANGED":
      return `Status ${String(m.from ?? "").replace("_", " ").toLowerCase()} → ${String(m.to ?? "").replace("_", " ").toLowerCase()}${m.costEstimate ? ` · estimate ₹${m.costEstimate}` : ""}`;
    case "COMPLETED":
      return "Repair marked complete";
    case "RATED":
      return `Owner rated ${m.rating}/5`;
    default:
      return a.action.replace(/_/g, " ").toLowerCase();
  }
}

/** Immutable, timestamped audit trail (Trust & Transparency principle). */
export function AuditTrail({ entries }: { entries: AuditLog[] }) {
  if (!entries.length) return <p className="text-sm text-muted">No activity yet.</p>;
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {entries.map((a) => (
        <li key={a.id} className="relative">
          <span className="absolute -left-[25px] top-1 flex h-3 w-3 rounded-full border-2 border-surface bg-brand" aria-hidden />
          <p className="text-sm text-ink">{auditLabel(a)}</p>
          <p className="mt-0.5 text-xs text-muted">
            {a.actorName} · <time dateTime={a.timestamp} className="font-mono">{formatDateTime(a.timestamp)}</time>
          </p>
        </li>
      ))}
    </ol>
  );
}

export function AuditTrailHeading() {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
      <History className="h-4 w-4 text-muted" /> Audit trail
    </h3>
  );
}

/** In-app thread between owner, inspector and provider (S-017). */
export function IssueMessages({ issueId, messages, canPost = true }: { issueId: string; messages: IssueMessage[]; canPost?: boolean }) {
  const me = useAuthStore((s) => s.user);
  const [body, setBody] = useState("");
  const post = usePostIssueMessage(issueId);
  return (
    <div>
      <ul className="space-y-3" aria-live="polite">
        {messages.length === 0 && <li className="text-sm text-muted">No messages yet. Ask a question or share an update.</li>}
        {messages.map((m) => {
          const mine = m.authorId === me?.id;
          return (
            <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm", mine ? "rounded-br-sm bg-brand text-on-brand" : "rounded-bl-sm bg-surface-2 text-ink")}>
                {!mine && (
                  <p className="mb-0.5 text-xs font-semibold opacity-80">
                    {m.authorName} · {m.authorRole.toLowerCase()}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={cn("mt-1 text-[11px]", mine ? "text-on-brand/70" : "text-muted")}>{relativeTime(m.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {canPost && (
        <form
          className="mt-4 flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!body.trim()) return;
            post.mutate(body, {
              onSuccess: () => setBody(""),
              onError: (err) => toast.error("Message not sent", { description: errorMessage(err) }),
            });
          }}
        >
          <Textarea
            rows={1}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a message…"
            aria-label="Message"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <Button type="submit" loading={post.isPending} disabled={!body.trim()}>
            Send
          </Button>
        </form>
      )}
    </div>
  );
}

export const IssueListItem = memo(function IssueListItem({ issue, showProperty = true }: { issue: Issue; showProperty?: boolean }) {
  const Icon = CATEGORY_ICON[issue.category];
  return (
    <Link
      href={`/issue/${issue.id}`}
      className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", issue.status === "FLAGGED" ? "bg-bad-soft text-bad" : "bg-surface-2 text-muted")}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{CATEGORY_LABEL[issue.category]}</span>
          <StatusBadge status={issue.status === "FLAGGED" ? "FLAGGED" : issue.status} />
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted">{issue.description}</p>
        <p className="mt-0.5 text-xs text-subtle">
          {showProperty && <>{issue.propertyName} · </>}
          {relativeTime(issue.createdAt)}
        </p>
      </div>
      {issue.status === "FLAGGED" && <span className="hidden text-xs font-semibold text-bad sm:inline">Needs decision</span>}
      <ChevronRight className="h-4 w-4 shrink-0 text-subtle" />
    </Link>
  );
});

export function StarRating({ value, onChange, readOnly }: { value: number | null; onChange?: (v: number) => void; readOnly?: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;
  return (
    <div className="flex gap-1" role={readOnly ? "img" : "radiogroup"} aria-label={readOnly ? `Rated ${value ?? 0} of 5` : "Rate the provider"}>
      {[1, 2, 3, 4, 5].map((n) =>
        readOnly ? (
          <Star key={n} className={cn("h-4 w-4", n <= shown ? "fill-warn text-warn" : "text-line")} />
        ) : (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange?.(n)}
            className="rounded p-1"
          >
            <Star className={cn("h-7 w-7 transition-colors", n <= shown ? "fill-warn text-warn" : "text-line")} />
          </button>
        )
      )}
    </div>
  );
}
