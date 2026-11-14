"use client";

/**
 * INSPECTION REPORT (US-005). Every checklist item with status + media,
 * flagged issues, health score. Shows "generating" until the async report job
 * finishes (pushed live), and a small celebration when nothing was flagged.
 */
import { CheckCircle2, Clock, Link2, Loader2, PartyPopper, Printer } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { StatusIcon } from "@/components/checklist/StatusIcon";
import { IssueListItem } from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import { MediaThumbnailStrip } from "@/components/media/Media";
import HealthScoreRing from "@/components/property/HealthScoreRing";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { toast } from "@/components/ui/Toast";
import { useInspectionDetail } from "@/hooks/useInspections";
import { errorMessage } from "@/lib/errors";
import type { ChecklistItem } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const role = useAuthStore((s) => s.user?.role);
  const q = useInspectionDetail(id);
  const d = q.data;

  const rooms = useMemo(() => {
    const m = new Map<string, ChecklistItem[]>();
    d?.checklistItems.forEach((i) => m.set(i.roomArea, [...(m.get(i.roomArea) ?? []), i]));
    return [...m.entries()];
  }, [d]);

  if (q.isError) return <ErrorState message={errorMessage(q.error, "Couldn't load this report.")} onRetry={() => q.refetch()} />;

  const backHref = role === "OWNER" ? (d ? `/property/${d.propertyId}` : "/dashboard") : role === "INSPECTOR" ? "/inspections/history" : "/admin/dashboard";
  const report = d?.report;
  const generating = d?.status === "SUBMITTED" && !report;
  const notSubmitted = d && d.status !== "SUBMITTED";

  return (
    <>
      <PageHeader
        back={{ href: backHref, label: "Back" }}
        title={d ? `Inspection report · ${d.propertyName}` : <Skeleton className="h-8 w-72" />}
        description={d && `${formatDate(d.scheduledDate)} · Inspector ${d.inspectorName ?? "—"} · ${d.propertyAddress}`}
        actions={
          report && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Link copied", { description: "Anyone you share it with must sign in to view it." });
                }}
              >
                <Link2 className="h-4 w-4" /> Copy link
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
            </>
          )
        }
      />

      {!d ? (
        <Skeleton className="h-60 w-full" />
      ) : notSubmitted ? (
        <Card className="flex items-center gap-3 text-sm text-muted">
          <Clock className="h-5 w-5" /> This inspection hasn&apos;t been submitted yet. <StatusBadge status={d.status} />
        </Card>
      ) : generating ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="mt-4 font-semibold">Generating your report…</p>
          <p className="mt-1 max-w-sm text-sm text-muted">The checklist was submitted {formatDateTime(d.submittedAt)}. This page updates automatically when the report is ready.</p>
        </Card>
      ) : (
        report && (
          <div className="space-y-6">
            <Card className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <HealthScoreRing score={report.healthScore} size={120} label="Health" />
              <div>
                {d.issues.length === 0 ? (
                  <div className="gp-burst mb-3 inline-flex items-center gap-2 rounded-full bg-ok-soft px-3 py-1.5 text-sm font-semibold text-ok">
                    <PartyPopper className="h-4 w-4" /> All clear — no issues flagged!
                  </div>
                ) : (
                  <p className="mb-3 text-sm font-semibold text-bad">
                    {d.issues.length} issue{d.issues.length > 1 ? "s" : ""} flagged — {d.issues.filter((i) => i.status === "FLAGGED").length} waiting for a decision
                  </p>
                )}
                <dl className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Pass", v: report.passCount, cls: "text-ok" },
                    { label: "Attention", v: report.attentionCount, cls: "text-warn" },
                    { label: "Fail", v: report.failCount, cls: "text-bad" },
                  ].map((x) => (
                    <div key={x.label} className="rounded-xl bg-surface-2 p-3 text-center">
                      <dd className={`text-2xl font-extrabold tabular-nums ${x.cls}`}>{x.v}</dd>
                      <dt className="text-xs text-muted">{x.label}</dt>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-xs text-muted">
                  Report generated <span className="font-mono">{formatDateTime(report.generatedAt)}</span> · {d.checklistItems.length} items checked
                </p>
              </div>
            </Card>

            {d.issues.length > 0 && (
              <section>
                <h2 className="mb-3 text-base font-semibold">Flagged issues</h2>
                <div className="space-y-3">
                  {d.issues.map((i) => (
                    <IssueListItem key={i.id} issue={i} showProperty={false} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-base font-semibold">Checklist</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {rooms.map(([room, items]) => (
                  <Card key={room}>
                    <CardHeader
                      title={room}
                      action={
                        items.every((i) => i.status === "PASS") ? (
                          <CheckCircle2 className="h-5 w-5 text-ok" aria-label="All passed" />
                        ) : undefined
                      }
                      className="mb-2"
                    />
                    <ul className="divide-y divide-line">
                      {items.map((i) => (
                        <li key={i.id} className="py-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-sm">{i.itemName}</span>
                            <StatusIcon status={i.status} className="shrink-0" />
                          </div>
                          {i.notes && <p className="mt-1 text-xs text-muted">{i.notes}</p>}
                          {i.mediaUrls.length > 0 && (
                            <div className="mt-2">
                              <MediaThumbnailStrip urls={i.mediaUrls} size={52} />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )
      )}
    </>
  );
}
