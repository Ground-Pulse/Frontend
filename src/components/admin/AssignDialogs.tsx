"use client";

/**
 * Admin assignment dialogs (US-009, US-011):
 *  - AssignProviderDialog: verified providers filtered by service type + locality
 *  - ReassignInspectorDialog: verified inspectors with their current load
 * Unverified people are listed but can't be selected (verification-gated).
 */
import { Star } from "lucide-react";
import { useState } from "react";
import { VerifiedBadge } from "@/components/issue/IssueParts";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { SkeletonRows } from "@/components/ui/Feedback";
import { toast } from "@/components/ui/Toast";
import { useInspectors, useProviders, useReassign } from "@/hooks/useAdmin";
import { useAssignProvider } from "@/hooks/useRepairs";
import { CATEGORY_SERVICE } from "@/lib/checklist-templates";
import { errorMessage } from "@/lib/errors";
import type { Inspection, RepairWithContext } from "@/lib/types";
import { CATEGORY_LABEL, cn, dayLabel } from "@/lib/utils";

export function AssignProviderDialog({
  repair,
  open,
  onOpenChange,
}: {
  repair: RepairWithContext | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const serviceType = repair ? CATEGORY_SERVICE[repair.issueCategory] : undefined;
  const providers = useProviders(showAll ? {} : { serviceType, locality: repair?.propertyCity });
  const assign = useAssignProvider();

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setSelected(null);
          setShowAll(false);
        }
        onOpenChange(o);
      }}
      title={repair?.providerId ? "Reassign provider" : "Assign a verified provider"}
      description={repair ? `${CATEGORY_LABEL[repair.issueCategory]} · ${repair.propertyName}, ${repair.propertyCity}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!selected}
            loading={assign.isPending}
            onClick={() =>
              assign.mutate(
                { repairId: repair!.id, providerId: selected! },
                {
                  onSuccess: (r) => {
                    toast.success("Provider assigned", { description: `${r.provider?.name} has been notified.` });
                    onOpenChange(false);
                    setSelected(null);
                  },
                  onError: (e) => toast.error("Couldn't assign", { description: errorMessage(e) }),
                }
              )
            }
          >
            Assign
          </Button>
        </>
      }
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-muted">
          {showAll ? "All providers" : <>Matching <strong className="text-ink">{serviceType}</strong> in <strong className="text-ink">{repair?.propertyCity}</strong></>}
        </p>
        <button type="button" onClick={() => setShowAll((s) => !s)} className="text-sm font-medium text-brand hover:underline">
          {showAll ? "Show matches only" : "Show all providers"}
        </button>
      </div>
      {providers.isLoading ? (
        <SkeletonRows count={3} />
      ) : !providers.data?.length ? (
        <p className="rounded-xl bg-surface-2 p-4 text-sm text-muted">No providers match this service and city. Try “Show all providers”.</p>
      ) : (
        <ul role="radiogroup" aria-label="Providers" className="space-y-2">
          {providers.data.map((sp) => (
            <li key={sp.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected === sp.id}
                aria-disabled={!sp.verified}
                disabled={!sp.verified}
                onClick={() => setSelected(sp.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  selected === sp.id ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2",
                  !sp.verified && "cursor-not-allowed opacity-60 hover:bg-transparent"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{sp.name}</span>
                    {sp.verified ? <VerifiedBadge /> : <Badge tone="amber">Not verified</Badge>}
                    {sp.id === repair?.providerId && <Badge tone="blue">Current</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {sp.serviceTypes.join(", ")} · {sp.locality} · {sp.completedJobs} jobs done
                  </p>
                </div>
                {sp.rating != null && (
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-warn text-warn" /> {sp.rating.toFixed(1)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}

export function ReassignInspectorDialog({
  inspection,
  open,
  onOpenChange,
}: {
  inspection: Inspection | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const inspectors = useInspectors();
  const reassign = useReassign();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setSelected(null);
        onOpenChange(o);
      }}
      title={inspection?.inspectorId ? "Reassign inspector" : "Assign inspector"}
      description={inspection ? `${inspection.propertyName} · ${dayLabel(inspection.scheduledDate)}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            disabled={!selected || selected === inspection?.inspectorId}
            loading={reassign.isPending}
            onClick={() =>
              reassign.mutate(
                { kind: "INSPECTION", id: inspection!.id, assigneeId: selected! },
                {
                  onSuccess: () => {
                    toast.success("Inspector assigned", { description: "The owner and inspector have been notified." });
                    onOpenChange(false);
                  },
                  onError: (e) => toast.error("Couldn't assign", { description: errorMessage(e) }),
                }
              )
            }
          >
            Assign
          </Button>
        </>
      }
    >
      {inspectors.isLoading ? (
        <SkeletonRows count={3} />
      ) : (
        <ul role="radiogroup" aria-label="Inspectors" className="space-y-2">
          {inspectors.data?.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                role="radio"
                aria-checked={selected === u.id}
                disabled={!u.verified}
                onClick={() => setSelected(u.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left",
                  selected === u.id ? "border-brand bg-brand-soft" : "border-line hover:bg-surface-2",
                  !u.verified && "cursor-not-allowed opacity-60"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{u.name}</span>
                    {u.verified ? <VerifiedBadge /> : <Badge tone="amber">Not verified</Badge>}
                    {u.id === inspection?.inspectorId && <Badge tone="blue">Current</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{u.email}</p>
                </div>
                <span className="text-xs text-muted">{u.activeJobs} open job{u.activeJobs === 1 ? "" : "s"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
