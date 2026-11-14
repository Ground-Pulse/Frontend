"use client";

/**
 * Modal + bottom-sheet built on Radix Dialog (focus trap, Esc to close,
 * aria wiring). On phones every dialog slides up from the bottom; on desktop
 * it fades in centered (UX animation spec).
 */
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { Textarea } from "./Input";

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=open]:animate-[gp-overlay_150ms_ease-out]" />
        <RadixDialog.Content
          className={cn(
            "fixed z-50 flex max-h-[92dvh] flex-col border border-line bg-surface text-ink shadow-2xl outline-none",
            // mobile: bottom sheet
            "inset-x-0 bottom-0 rounded-t-3xl data-[state=open]:animate-[gp-sheet-up_220ms_cubic-bezier(0.16,1,0.3,1)]",
            // desktop: centered
            "sm:inset-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:data-[state=open]:animate-[gp-pop_160ms_ease-out]",
            size === "sm" && "sm:max-w-md",
            size === "md" && "sm:max-w-lg",
            size === "lg" && "sm:max-w-2xl"
          )}
        >
          <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 sm:px-6 sm:pt-5">
            <div>
              <RadixDialog.Title className="text-lg font-semibold">{title}</RadixDialog.Title>
              {description ? (
                <RadixDialog.Description className="mt-1 text-sm text-muted">{description}</RadixDialog.Description>
              ) : (
                <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close
              className="-mr-2 rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-ring"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </RadixDialog.Close>
          </div>
          <div className="overflow-y-auto px-5 pb-5 sm:px-6">{children}</div>
          {footer && (
            <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

/**
 * Confirmation before high-stakes actions (approve repair, decline, discard
 * draft, submit checklist). With `requireReason` it collects a reason too.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "primary",
  loading,
  onConfirm,
  requireReason,
  reasonLabel = "Reason",
  reasonPlaceholder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  tone?: "primary" | "danger";
  loading?: boolean;
  onConfirm: (reason: string) => void;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const missing = requireReason && !reason.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setReason("");
          setTouched(false);
        }
        onOpenChange(o);
      }}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            loading={loading}
            onClick={() => {
              setTouched(true);
              if (missing) return;
              onConfirm(reason.trim());
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {requireReason && (
        <div>
          <label htmlFor="confirm-reason" className="mb-1.5 block text-sm font-medium">
            {reasonLabel}
          </label>
          <Textarea
            id="confirm-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={reasonPlaceholder}
            error={touched && missing ? "Please add a reason." : undefined}
          />
        </div>
      )}
    </Dialog>
  );
}
