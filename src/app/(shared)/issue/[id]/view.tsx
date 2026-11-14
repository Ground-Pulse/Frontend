"use client";

/**
 * ISSUE & REPAIR DETAIL (UX screen 6; US-007, US-008, S-016, S-017).
 * Pre-approval: category, description, gallery, Approve / Decline.
 * Post-approval: live Repair Status Tracker, provider details, completion
 * proof, rating, message thread and the full audit trail.
 */
import { CheckCircle2, MessageSquare, Phone, ShieldCheck, Star, UserRoundCog, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AssignProviderDialog } from "@/components/admin/AssignDialogs";
import {
  AuditTrail,
  AuditTrailHeading,
  CategoryTag,
  IssueMessages,
  RepairStatusTracker,
  StarRating,
  VerifiedBadge,
} from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import { MediaGallery, MediaThumbnailStrip } from "@/components/media/Media";
import { StatusBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { toast } from "@/components/ui/Toast";
import { useApproveIssue, useDeclineIssue, useIssue } from "@/hooks/useIssues";
import { useRateRepair } from "@/hooks/useRepairs";
import { errorMessage } from "@/lib/errors";
import { CATEGORY_LABEL, formatDateTime, formatINR } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export default function IssueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const role = useAuthStore((s) => s.user?.role);
  const issue = useIssue(id);
  const approve = useApproveIssue();
  const decline = useDeclineIssue();
  const rate = useRateRepair();
  const [confirm, setConfirm] = useState<"approve" | "decline" | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  const back =
    role === "OWNER" ? { href: "/issues", label: "Issues & repairs" } :
    role === "ADMIN" ? { href: "/admin/reassign", label: "Assignments" } :
    role === "PROVIDER" ? { href: "/provider/jobs", label: "My jobs" } :
    { href: "/inspections", label: "Inspections" };

  if (issue.isError) return <ErrorState message={errorMessage(issue.error, "Couldn't load this issue.")} onRetry={() => issue.refetch()} />;
  const d = issue.data;
  const repair = d?.repair;

  return (
    <>
      <PageHeader
        back={back}
        title={d ? `${CATEGORY_LABEL[d.category]} issue` : <Skeleton className="h-8 w-56" />}
        description={d && <Link href={role === "OWNER" || role === "ADMIN" ? `/property/${d.propertyId}` : "#"} className="hover:underline">{d.propertyName} · {d.propertyAddress}</Link>}
        actions={d && <StatusBadge status={d.status} className="px-3 py-1 text-sm" />}
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            {d ? (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <CategoryTag category={d.category} />
                  <span className="text-xs text-muted">
                    Flagged by {d.flaggedByName} · <time className="font-mono">{formatDateTime(d.createdAt)}</time>
                  </span>
                </div>
                <p className="text-ink">{d.description}</p>
                <div className="mt-5">
                  <MediaGallery urls={d.mediaUrls} />
                </div>
              </>
            ) : (
              <>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-3 h-4 w-full" />
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <Skeleton className="aspect-[4/3]" />
                  <Skeleton className="aspect-[4/3]" />
                  <Skeleton className="aspect-[4/3]" />
                </div>
              </>
            )}
          </Card>

          {d?.status === "FLAGGED" && role === "OWNER" && (
            <Card className="border-brand/30">
              <CardHeader title="Your decision" description="No work happens on your property without your explicit approval." />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={() => setConfirm("approve")}>
                  <CheckCircle2 className="h-5 w-5" /> Approve repair
                </Button>
                <Button size="lg" variant="outline" className="flex-1" onClick={() => setConfirm("decline")}>
                  <XCircle className="h-5 w-5" /> Decline
                </Button>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Only verified local providers can be assigned to your repair.
              </p>
            </Card>
          )}

          {d?.status === "FLAGGED" && role !== "OWNER" && (
            <Card className="text-sm text-muted">Waiting for the owner to approve or decline this repair.</Card>
          )}

          {d?.status === "DECLINED" && (
            <Card>
              <p className="text-sm font-semibold">Declined by owner</p>
              <p className="mt-1 text-sm text-muted">“{d.decisionReason}”</p>
            </Card>
          )}

          {repair && (
            <Card>
              <CardHeader
                title="Repair status"
                description="Updates live as the provider works — no refresh needed."
                action={
                  role === "ADMIN" && (repair.status === "REQUESTED" || repair.status === "ASSIGNED") ? (
                    <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
                      <UserRoundCog className="h-4 w-4" /> {repair.providerId ? "Reassign" : "Assign provider"}
                    </Button>
                  ) : undefined
                }
              />
              <RepairStatusTracker status={repair.status} />

              <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Provider</p>
                  {repair.provider ? (
                    <div className="mt-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{repair.provider.name}</span>
                        {repair.provider.verified && <VerifiedBadge />}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                        {repair.provider.rating != null && (
                          <>
                            <Star className="h-3 w-3 fill-warn text-warn" /> {repair.provider.rating.toFixed(1)} ·{" "}
                          </>
                        )}
                        {repair.provider.completedJobs} jobs completed
                      </p>
                      {repair.provider.phone && (
                        <a href={`tel:${repair.provider.phone}`} className="mt-1 flex items-center gap-1 text-xs text-brand hover:underline">
                          <Phone className="h-3 w-3" /> {repair.provider.phone}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="mt-1.5 text-sm text-muted">An admin is assigning a verified provider.</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Cost estimate</p>
                  <p className="mt-1.5 text-lg font-bold">{formatINR(repair.costEstimate)}</p>
                  {repair.costEstimate == null && <p className="text-xs text-muted">Provided by the provider on accepting the job.</p>}
                </div>
              </div>

              {repair.status === "COMPLETED" && (
                <div className="mt-5 space-y-4 rounded-xl bg-ok-soft/60 p-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ok">
                      <CheckCircle2 className="h-4 w-4" /> Completed {formatDateTime(repair.updatedAt)}
                    </p>
                    <p className="mt-1 text-sm text-ink">{repair.completionNotes}</p>
                  </div>
                  <MediaThumbnailStrip urls={repair.completionPhotos} size={72} />
                  {role === "OWNER" && (
                    <div className="border-t border-line pt-4">
                      <p className="mb-1 text-sm font-medium">{repair.ownerRating ? "Your rating" : "How was the work?"}</p>
                      <StarRating
                        value={repair.ownerRating}
                        readOnly={!!repair.ownerRating}
                        onChange={(rating) =>
                          rate.mutate(
                            { repairId: repair.id, rating },
                            {
                              onSuccess: () => toast.success("Thanks for rating the provider"),
                              onError: (e) => toast.error(errorMessage(e)),
                            }
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          {d && d.status !== "DECLINED" && (
            <Card>
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
                <MessageSquare className="h-4 w-4 text-muted" /> Messages
              </h3>
              <IssueMessages issueId={d.id} messages={d.messages} />
            </Card>
          )}
          <Card>
            <AuditTrailHeading />
            {d ? <AuditTrail entries={d.auditTrail} /> : <Skeleton className="h-32 w-full" />}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "approve"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Approve this repair?"
        description="This will notify admin to assign a verified provider. Continue?"
        confirmLabel="Approve repair"
        loading={approve.isPending}
        onConfirm={() =>
          approve.mutate(id, {
            onSuccess: () => {
              toast.success("Repair approved", { description: "We'll assign a verified provider and keep you posted." });
              setConfirm(null);
            },
            onError: (e) =>
              toast.error("Couldn't save your decision.", {
                description: errorMessage(e),
                action: { label: "Retry", onClick: () => approve.mutate(id) },
              }),
          })
        }
      />
      <ConfirmDialog
        open={confirm === "decline"}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Decline this repair?"
        description="The issue will be closed. Your reason is saved in the audit trail."
        confirmLabel="Decline"
        tone="danger"
        requireReason
        reasonLabel="Reason for declining"
        reasonPlaceholder="e.g. Cosmetic only — will fix during the next renovation."
        loading={decline.isPending}
        onConfirm={(reason) =>
          decline.mutate(
            { id, reason },
            {
              onSuccess: () => {
                toast.success("Issue declined");
                setConfirm(null);
              },
              onError: (e) => toast.error("Couldn't save your decision.", { description: errorMessage(e) }),
            }
          )
        }
      />
      <AssignProviderDialog repair={repair ?? null} open={assignOpen} onOpenChange={setAssignOpen} />
    </>
  );
}
