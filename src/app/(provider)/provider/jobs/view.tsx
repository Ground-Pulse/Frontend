"use client";

/** PROVIDER DASHBOARD — assigned jobs (UX screen 8, US-010). */
import { MapPin, MessageSquare, ShieldAlert, Star, Wrench } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CategoryTag, RepairStatusTracker, VerifiedBadge } from "@/components/issue/IssueParts";
import { PageHeader } from "@/components/layout/AppShell";
import { MediaThumbnailStrip } from "@/components/media/Media";
import { AcceptJobDialog, MarkCompleteDialog } from "@/components/provider/JobDialogs";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import StatCard from "@/components/ui/StatCard";
import { toast } from "@/components/ui/Toast";
import { useDeclineJob, useMyProviderProfile, useRepairs } from "@/hooks/useRepairs";
import { errorMessage } from "@/lib/errors";
import type { RepairWithContext } from "@/lib/types";
import { formatINR, relativeTime } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

export default function ProviderJobsPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useMyProviderProfile();
  const jobs = useRepairs("ASSIGNED,IN_PROGRESS");
  const done = useRepairs("COMPLETED");
  const decline = useDeclineJob();
  const [accept, setAccept] = useState<RepairWithContext | null>(null);
  const [complete, setComplete] = useState<RepairWithContext | null>(null);
  const [declineJob, setDeclineJob] = useState<RepairWithContext | null>(null);

  const list = jobs.data ?? [];

  return (
    <>
      <PageHeader
        title="My jobs"
        description={
          profile.data && (
            <span className="flex flex-wrap items-center gap-2">
              {profile.data.serviceTypes.join(", ")} · {profile.data.locality}
              {profile.data.verified && <VerifiedBadge />}
            </span>
          )
        }
      />

      {user && !user.verified && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-warn/40 bg-warn-soft p-4 text-sm">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div>
            <p className="font-semibold text-ink">Verification pending</p>
            <p className="text-muted">An admin is reviewing your licence and references. Jobs can only be assigned to verified providers.</p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="New" value={list.filter((j) => j.status === "ASSIGNED").length} tone="info" loading={jobs.isLoading} />
        <StatCard label="In progress" value={list.filter((j) => j.status === "IN_PROGRESS").length} tone="warn" loading={jobs.isLoading} />
        <StatCard
          label="Rating"
          value={profile.data?.rating != null ? profile.data.rating.toFixed(1) : "—"}
          hint={`${done.data?.length ?? 0} jobs completed`}
          icon={<Star className="h-4 w-4" />}
          loading={profile.isLoading}
        />
      </div>

      {jobs.isLoading ? (
        <SkeletonRows />
      ) : jobs.isError ? (
        <ErrorState message="Couldn't load your jobs." onRetry={() => jobs.refetch()} />
      ) : list.length === 0 ? (
        <EmptyState icon={<Wrench className="h-6 w-6" />} title="No active jobs" description="When an admin assigns you a repair, it shows up here and you get a notification." />
      ) : (
        <div className="space-y-4">
          {list.map((j) => (
            <article key={j.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryTag category={j.issueCategory} />
                    <span className="text-xs text-muted">updated {relativeTime(j.updatedAt)}</span>
                  </div>
                  <h2 className="mt-2 font-semibold">{j.propertyName}</h2>
                  <p className="flex items-center gap-1 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5" /> {j.propertyAddress}, {j.propertyCity}
                  </p>
                  <p className="mt-3 text-sm">{j.issueDescription}</p>
                  <div className="mt-3">
                    <MediaThumbnailStrip urls={j.issueMediaUrls} size={64} />
                  </div>
                  {j.costEstimate != null && <p className="mt-3 text-sm">Your estimate: <strong>{formatINR(j.costEstimate)}</strong></p>}
                </div>
              </div>
              <div className="mt-5 border-t border-line pt-5">
                <RepairStatusTracker status={j.status} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {j.status === "ASSIGNED" ? (
                  <>
                    <Button onClick={() => setAccept(j)}>Accept job</Button>
                    <Button variant="outline" onClick={() => setDeclineJob(j)}>Decline</Button>
                  </>
                ) : (
                  <Button onClick={() => setComplete(j)}>Mark complete</Button>
                )}
                <Link href={`/issue/${j.issueId}`} className="inline-flex h-11 items-center gap-1.5 rounded-[10px] px-4 text-sm font-medium text-brand hover:bg-surface-2">
                  <MessageSquare className="h-4 w-4" /> Details & messages
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <AcceptJobDialog job={accept} open={!!accept} onOpenChange={(o) => !o && setAccept(null)} />
      <MarkCompleteDialog job={complete} open={!!complete} onOpenChange={(o) => !o && setComplete(null)} />
      <ConfirmDialog
        open={!!declineJob}
        onOpenChange={(o) => !o && setDeclineJob(null)}
        title="Decline this job?"
        description="The admin team will reassign it to another verified provider."
        confirmLabel="Decline job"
        tone="danger"
        requireReason
        reasonPlaceholder="e.g. Fully booked this week"
        loading={decline.isPending}
        onConfirm={(reason) =>
          decline.mutate(
            { repairId: declineJob!.id, reason },
            {
              onSuccess: () => {
                toast.success("Job declined");
                setDeclineJob(null);
              },
              onError: (e) => toast.error(errorMessage(e)),
            }
          )
        }
      />
    </>
  );
}
