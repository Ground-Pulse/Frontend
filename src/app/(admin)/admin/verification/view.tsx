"use client";

/** Provider & Inspector verification queue. Nobody is assignable until verified. */
import { Check, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { EmptyState, ErrorState, SkeletonRows } from "@/components/ui/Feedback";
import { toast } from "@/components/ui/Toast";
import { useVerificationDecision, useVerificationQueue } from "@/hooks/useAdmin";
import { errorMessage } from "@/lib/errors";
import type { VerificationRequest } from "@/lib/types";
import { initials, relativeTime } from "@/lib/utils";

export default function VerificationPage() {
  const q = useVerificationQueue();
  const decide = useVerificationDecision();
  const [reject, setReject] = useState<VerificationRequest | null>(null);

  return (
    <>
      <PageHeader title="Verification queue" description="Check ID, licences and references before approving. Only verified accounts can be assigned work." />
      {q.isLoading ? (
        <SkeletonRows />
      ) : q.isError ? (
        <ErrorState message="Couldn't load the queue." onRetry={() => q.refetch()} />
      ) : !q.data?.length ? (
        <EmptyState icon={<ShieldCheck className="h-6 w-6" />} title="Queue is empty" description="New inspector and provider sign-ups will appear here." />
      ) : (
        <div className="space-y-3">
          {q.data.map((r) => (
            <div key={r.userId} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold">{initials(r.name)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{r.name}</span>
                  <Badge tone={r.role === "PROVIDER" ? "teal" : "blue"}>{r.role === "PROVIDER" ? "Service provider" : "Inspector"}</Badge>
                  <span className="text-xs text-muted">signed up {relativeTime(r.createdAt)}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted">
                  {r.email}
                  {r.phone && ` · ${r.phone}`}
                </p>
                {r.role === "PROVIDER" && (
                  <p className="mt-0.5 text-xs text-muted">
                    {r.serviceTypes.join(", ")} · {r.locality}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setReject(r)}>
                  <X className="h-4 w-4" /> Reject
                </Button>
                <Button
                  loading={decide.isPending && decide.variables?.userId === r.userId && decide.variables.approve}
                  onClick={() =>
                    decide.mutate(
                      { userId: r.userId, approve: true },
                      {
                        onSuccess: () => toast.success(`${r.name} verified`, { description: "They can now be assigned jobs." }),
                        onError: (e) => toast.error(errorMessage(e)),
                      }
                    )
                  }
                >
                  <Check className="h-4 w-4" /> Verify
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!reject}
        onOpenChange={(o) => !o && setReject(null)}
        title={`Reject ${reject?.name}?`}
        description="They'll be notified. The decision is recorded in the audit log."
        confirmLabel="Reject"
        tone="danger"
        requireReason
        reasonLabel="Reason (sent to the applicant)"
        loading={decide.isPending}
        onConfirm={(reason) =>
          decide.mutate(
            { userId: reject!.userId, approve: false, reason },
            {
              onSuccess: () => {
                toast.success("Application rejected");
                setReject(null);
              },
            }
          )
        }
      />
    </>
  );
}
