"use client";

/**
 * Toasts: confirmation on every save/submit, errors with an optional retry
 * action (FEA section 8). Call `toast.success("…")` from anywhere.
 */
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { create } from "zustand";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

const useToastStore = create<{
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
}>((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts.slice(-3), { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), t.action ? 7000 : 4500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

type Opts = { description?: string; action?: ToastItem["action"] };
export const toast = {
  success: (title: string, o: Opts = {}) => useToastStore.getState().push({ kind: "success", title, ...o }),
  error: (title: string, o: Opts = {}) => useToastStore.getState().push({ kind: "error", title, ...o }),
  info: (title: string, o: Opts = {}) => useToastStore.getState().push({ kind: "info", title, ...o }),
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] lg:bottom-4 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className="gp-fade-up pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-3.5 text-ink shadow-lg"
        >
          {t.kind === "success" && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" />}
          {t.kind === "error" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-bad" />}
          {t.kind === "info" && <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" />}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-muted">{t.description}</p>}
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className={cn("mt-1.5 text-xs font-semibold text-brand underline-offset-2 hover:underline")}
              >
                {t.action.label}
              </button>
            )}
          </div>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="rounded p-0.5 text-muted hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
