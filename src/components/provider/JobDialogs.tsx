"use client";

/** Provider dialogs: accept (with cost estimate) and Mark Complete (US-010). */
import { useState } from "react";
import { MediaThumbnailStrip, MediaUploadButton } from "@/components/media/Media";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input, { Textarea } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useCompleteRepair, useTransitionRepair } from "@/hooks/useRepairs";
import { errorMessage } from "@/lib/errors";
import type { RepairWithContext } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/utils";

export function AcceptJobDialog({ job, open, onOpenChange }: { job: RepairWithContext | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [cost, setCost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const transition = useTransitionRepair();
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setCost("");
          setError(null);
        }
        onOpenChange(o);
      }}
      title="Accept job"
      description={job ? `${CATEGORY_LABEL[job.issueCategory]} · ${job.propertyName}, ${job.propertyCity}` : undefined}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            loading={transition.isPending}
            onClick={() => {
              const n = cost.trim() === "" ? null : Number(cost);
              if (n != null && (isNaN(n) || n < 0)) return setError("Enter an amount of zero or more.");
              transition.mutate(
                { repairId: job!.id, status: "IN_PROGRESS", costEstimate: n },
                {
                  onSuccess: () => {
                    toast.success("Job accepted", { description: "The owner can see the repair is in progress." });
                    onOpenChange(false);
                  },
                  onError: (e) => toast.error("Couldn't accept", { description: errorMessage(e) }),
                }
              );
            }}
          >
            Accept & start
          </Button>
        </>
      }
    >
      <label htmlFor="cost" className="mb-1.5 block text-sm font-medium">Estimated cost (₹, optional)</label>
      <Input id="cost" inputMode="numeric" placeholder="e.g. 2500" value={cost} onChange={(e) => setCost(e.target.value)} error={error ?? undefined} />
      <p className="mt-2 text-xs text-muted">Shared with the owner on the repair page.</p>
    </Dialog>
  );
}

export function MarkCompleteDialog({ job, open, onOpenChange }: { job: RepairWithContext | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const complete = useCompleteRepair();
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setNotes("");
          setPhotos([]);
          setError(null);
        }
        onOpenChange(o);
      }}
      title="Mark job complete"
      description={job ? `${CATEGORY_LABEL[job.issueCategory]} · ${job.propertyName}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            loading={complete.isPending}
            onClick={() => {
              if (!notes.trim()) return setError("Add a confirmation note before marking this job complete.");
              complete.mutate(
                { repairId: job!.id, completionNotes: notes.trim(), completionPhotos: photos },
                {
                  onSuccess: () => {
                    toast.success("Job completed", { description: "The owner has been notified." });
                    onOpenChange(false);
                  },
                  onError: (e) => setError(errorMessage(e)),
                }
              );
            }}
          >
            Mark complete
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
            Confirmation note <span className="text-bad">*</span>
          </label>
          <Textarea id="notes" rows={4} value={notes} onChange={(e) => { setNotes(e.target.value); setError(null); }} placeholder="What did you fix, which parts were replaced, anything the owner should watch?" error={error ?? undefined} />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">After photos (optional)</p>
          <div className="flex flex-wrap items-center gap-2">
            <MediaThumbnailStrip urls={photos} size={80} onRemove={(u) => setPhotos((p) => p.filter((x) => x !== u))} />
            <MediaUploadButton variant="tile" capture label="Add" onUploaded={(u) => setPhotos((p) => [...p, ...u])} />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
