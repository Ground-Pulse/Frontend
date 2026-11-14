"use client";

/**
 * ACTIVE CHECKLIST (UX screen 5, US-004) — full screen, local-first.
 *
 * Every tap writes to the Zustand draft (persisted to localStorage) and is
 * synced to PATCH /inspections/:id/checklist in the background (auto-save
 * every couple of seconds + manual "Save draft"). Submitting requires every
 * item to have a status, locks the checklist and triggers report generation.
 */
import { ArrowLeft, ChevronDown, CloudOff, Flag, Loader2, Save, Send, Timer, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChecklistItemRow from "@/components/checklist/ChecklistItemRow";
import FlagIssueSheet from "@/components/checklist/FlagIssueSheet";
import { IssueListItem } from "@/components/issue/IssueParts";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { ErrorState, Skeleton } from "@/components/ui/Feedback";
import { toast } from "@/components/ui/Toast";
import { useInspectionDetail, useSaveChecklistDraft, useStartInspection, useSubmitChecklist } from "@/hooks/useInspections";
import { errorMessage } from "@/lib/errors";
import type { ChecklistItem } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";
import { useActiveChecklistStore } from "@/stores/activeChecklistStore";

function Elapsed({ startIso }: { startIso: string | undefined }) {
  return <>{useElapsed(startIso)}</>;
}

function useElapsed(startIso: string | undefined) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!startIso) return "00:00";
  const s = Math.max(0, Math.floor((now - new Date(startIso).getTime()) / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function ChecklistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const detail = useInspectionDetail(id);
  const start = useStartInspection();
  const save = useSaveChecklistDraft(id);
  const saveDraft = save.mutateAsync; // stable reference
  const submit = useSubmitChecklist();

  const draft = useActiveChecklistStore((s) => s.drafts[id]);
  const store = useActiveChecklistStore.getState;

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [highlight, setHighlight] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [flagOpen, setFlagOpen] = useState(false);
  const [flagPreset, setFlagPreset] = useState<{ key: number; text?: string }>({ key: 0 });
  const [offline, setOffline] = useState(false);
  const startedRef = useRef(false);

  const d = detail.data;

  // Load server items into the local draft (a dirty local draft wins).
  useEffect(() => {
    if (d) store().loadInspection(id, d.checklistItems, d.startedAt);
  }, [d, id, store]);

  // Mark the inspection IN_PROGRESS the first time it's opened.
  useEffect(() => {
    if (d?.status === "SCHEDULED" && !startedRef.current) {
      startedRef.current = true;
      start.mutate(id);
    }
  }, [d?.status, id, start]);

  // Already submitted → go to the report.
  useEffect(() => {
    if (d?.status === "SUBMITTED") router.replace(`/report/${id}`);
  }, [d?.status, id, router]);

  const syncDraft = useCallback(
    async (manual = false) => {
      const current = store().drafts[id];
      if (!current) return true;
      if (!current.dirty && !manual) return true;
      try {
        const res = await saveDraft({ items: Object.values(current.items) });
        store().markSaved(id, res.savedAt);
        setOffline(false);
        if (manual) toast.success("Draft saved");
        return true;
      } catch (e) {
        setOffline(true);
        if (manual) toast.error("Couldn't reach the server", { description: "Your progress is saved on this device and will sync when you're back online." });
        void e;
        return false;
      }
    },
    [id, saveDraft, store]
  );

  // Auto-save: 2.5s after the last change.
  useEffect(() => {
    if (!draft?.dirty) return;
    const t = setTimeout(() => syncDraft(false), 2500);
    return () => clearTimeout(t);
  }, [draft, syncDraft]);

  // Warn before closing the tab with unsynced work.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (store().drafts[id]?.dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [id, store]);


  const rooms = useMemo(() => {
    const m = new Map<string, ChecklistItem[]>();
    d?.checklistItems.forEach((i) => m.set(i.roomArea, [...(m.get(i.roomArea) ?? []), i]));
    return [...m.entries()];
  }, [d]);

  if (detail.isError) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <ErrorState message={errorMessage(detail.error, "Couldn't open this checklist.")} onRetry={() => detail.refetch()} />
        <Link href="/inspections" className="mt-4 inline-block text-sm text-brand">← Back to inspections</Link>
      </div>
    );
  }

  const items = draft ? Object.values(draft.items) : [];
  const total = d?.checklistItems.length ?? 0;
  const done = items.filter((i) => i.status).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  function trySubmit() {
    if (done < total) {
      setHighlight(true);
      const first = d?.checklistItems.find((i) => !draft?.items[i.id]?.status);
      if (first) {
        setCollapsed((c) => ({ ...c, [first.roomArea]: false }));
        setTimeout(() => document.getElementById(`item-${first.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
      }
      toast.error("Complete all checklist items before submitting.", { description: `${total - done} item${total - done > 1 ? "s" : ""} still need a status.` });
      return;
    }
    setConfirmSubmit(true);
  }

  async function doSubmit() {
    const ok = await syncDraft(false);
    if (!ok) {
      toast.error("You're offline", { description: "Reconnect to submit. Your work is safe on this device." });
      return;
    }
    submit.mutate(id, {
      onSuccess: () => {
        store().clear(id);
        toast.success("Checklist submitted", { description: "The report is being generated and the owner will be notified." });
        router.push("/inspections");
      },
      onError: (e) => {
        setConfirmSubmit(false);
        toast.error("Couldn't submit", { description: errorMessage(e) });
      },
    });
  }

  function leave() {
    if (draft?.dirty) setConfirmLeave(true);
    else router.push("/inspections");
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Active checklist header: property, timer, progress, submit */}
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button type="button" onClick={leave} className="-ml-2 flex h-11 w-11 items-center justify-center rounded-xl text-muted hover:bg-surface-2" aria-label="Back to inspections">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{d ? d.propertyName : <Skeleton className="h-5 w-40" />}</div>
            <p className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1 font-mono tabular-nums" aria-label="Elapsed time">
                <Timer className="h-3.5 w-3.5" /> <Elapsed startIso={draft?.startedAt} />
              </span>
              <span aria-live="polite">
                {offline ? (
                  <span className="flex items-center gap-1 text-warn"><CloudOff className="h-3.5 w-3.5" /> Saved on device</span>
                ) : save.isPending ? (
                  <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving…</span>
                ) : draft?.lastSavedAt ? (
                  `Saved ${relativeTime(draft.lastSavedAt)}`
                ) : draft?.dirty ? (
                  "Unsaved changes"
                ) : null}
              </span>
            </p>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => syncDraft(true)} loading={save.isPending}>
            <Save className="h-4 w-4" /> Save draft
          </Button>
          <Button size="sm" onClick={trySubmit} disabled={!d}>
            <Send className="h-4 w-4" /> Submit
          </Button>
        </div>
        <div className="h-1 w-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${done} of ${total} items checked`}>
          <div className="h-full bg-brand transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-5">
        {!d || !draft ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p className="text-muted">{d.propertyAddress}</p>
              <p className="font-semibold tabular-nums">{done}/{total} checked</p>
            </div>

            {d.issues.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-bad">
                  <TriangleAlert className="h-4 w-4" /> Flagged during this visit ({d.issues.length})
                </h2>
                <div className="space-y-2">
                  {d.issues.map((i) => (
                    <IssueListItem key={i.id} issue={i} showProperty={false} />
                  ))}
                </div>
              </section>
            )}

            <div className="space-y-4">
              {rooms.map(([room, roomItems]) => {
                const roomDone = roomItems.filter((i) => draft.items[i.id]?.status).length;
                const isCollapsed = collapsed[room] ?? false;
                return (
                  <section key={room} className="rounded-2xl border border-line bg-surface">
                    <button
                      type="button"
                      onClick={() => setCollapsed((c) => ({ ...c, [room]: !isCollapsed }))}
                      aria-expanded={!isCollapsed}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="font-semibold">{room}</span>
                      <span className="flex items-center gap-2 text-xs text-muted">
                        <span className={cn("rounded-full px-2 py-0.5 tabular-nums", roomDone === roomItems.length ? "bg-ok-soft text-ok" : "bg-surface-2")}>
                          {roomDone}/{roomItems.length}
                        </span>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isCollapsed && "-rotate-90")} />
                      </span>
                    </button>
                    {!isCollapsed && (
                      <div className="divide-y divide-line border-t border-line px-3">
                        {roomItems.map((item) => {
                          const di = draft.items[item.id];
                          if (!di) return null;
                          return (
                            <div key={item.id}>
                              <ChecklistItemRow
                                id={item.id}
                                itemName={item.itemName}
                                status={di.status}
                                mediaUrls={di.mediaUrls}
                                notes={di.notes}
                                highlight={highlight}
                                onStatus={(s) => store().updateItemStatus(id, item.id, s)}
                                onAddMedia={(urls) => urls.forEach((u) => store().addMedia(id, item.id, u))}
                                onRemoveMedia={(u) => store().removeMedia(id, item.id, u)}
                                onNotes={(n) => store().setNotes(id, item.id, n)}
                              />
                              {di.status === "FAIL" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFlagPreset((p) => ({ key: p.key + 1, text: `${room} — ${item.itemName}: ` }));
                                    setFlagOpen(true);
                                  }}
                                  className="mb-3 ml-1 inline-flex items-center gap-1 text-xs font-semibold text-bad hover:underline"
                                >
                                  <Flag className="h-3.5 w-3.5" /> Flag this as an issue
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-2 sm:hidden">
              <Button variant="outline" onClick={() => syncDraft(true)} loading={save.isPending}>
                <Save className="h-4 w-4" /> Save draft
              </Button>
            </div>
          </>
        )}
      </main>

      {/* FAB: Flag Issue */}
      {d && (
        <button
          type="button"
          onClick={() => {
            setFlagPreset((p) => ({ key: p.key + 1 }));
            setFlagOpen(true);
          }}
          className="fixed bottom-6 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-bad px-5 font-semibold text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:bottom-8 sm:right-8"
          aria-label="Flag issue"
        >
          <Flag className="h-5 w-5" /> Flag issue
        </button>
      )}

      <FlagIssueSheet key={flagPreset.key} open={flagOpen} onOpenChange={setFlagOpen} inspectionId={id} presetDescription={flagPreset.text} />

      <ConfirmDialog
        open={confirmSubmit}
        onOpenChange={setConfirmSubmit}
        title="Submit checklist?"
        description={`${total} items checked${d?.issues.length ? `, ${d.issues.length} issue${d.issues.length > 1 ? "s" : ""} flagged` : ""}. The checklist locks and the report is generated for the owner.`}
        confirmLabel="Submit & lock"
        loading={submit.isPending || save.isPending}
        onConfirm={doSubmit}
      />
      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title="Save as draft before leaving?"
        description="Your progress is kept on this device either way. Saving also syncs it to the server."
        confirmLabel="Save & leave"
        loading={save.isPending}
        onConfirm={async () => {
          await syncDraft(true);
          router.push("/inspections");
        }}
      />
    </div>
  );
}
