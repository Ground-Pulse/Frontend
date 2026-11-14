"use client";

/**
 * Local-first checklist draft (FEA section 4, LLD "ActiveChecklistStore").
 *
 * Every tap updates this store immediately (optimistic UI) and is persisted to
 * localStorage, so a dropped connection or closed tab never loses work. The
 * checklist page syncs `dirty` items to the API in the background.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckStatus, ChecklistItem } from "@/lib/types";

interface DraftItem {
  id: string;
  status: CheckStatus | null;
  mediaUrls: string[];
  notes: string | null;
}

interface Draft {
  inspectionId: string;
  items: Record<string, DraftItem>;
  dirty: boolean;
  lastSavedAt: string | null;
  startedAt: string;
}

interface ActiveChecklistState {
  drafts: Record<string, Draft>;
  loadInspection: (inspectionId: string, serverItems: ChecklistItem[], startedAt: string | null) => void;
  updateItemStatus: (inspectionId: string, itemId: string, status: CheckStatus) => void;
  addMedia: (inspectionId: string, itemId: string, url: string) => void;
  removeMedia: (inspectionId: string, itemId: string, url: string) => void;
  setNotes: (inspectionId: string, itemId: string, notes: string) => void;
  markSaved: (inspectionId: string, at: string) => void;
  clear: (inspectionId: string) => void;
}

function patchItem(
  state: ActiveChecklistState,
  inspectionId: string,
  itemId: string,
  fn: (i: DraftItem) => DraftItem
) {
  const d = state.drafts[inspectionId];
  if (!d || !d.items[itemId]) return state;
  return {
    drafts: {
      ...state.drafts,
      [inspectionId]: { ...d, dirty: true, items: { ...d.items, [itemId]: fn(d.items[itemId]) } },
    },
  };
}

export const useActiveChecklistStore = create<ActiveChecklistState>()(
  persist(
    (set) => ({
      drafts: {},
      loadInspection: (inspectionId, serverItems, startedAt) =>
        set((state) => {
          const existing = state.drafts[inspectionId];
          // A local unsynced draft wins over the server copy (rehydrate on resume).
          if (existing?.dirty) return state;
          const items: Record<string, DraftItem> = {};
          serverItems.forEach((i) => {
            items[i.id] = { id: i.id, status: i.status, mediaUrls: i.mediaUrls, notes: i.notes };
          });
          return {
            drafts: {
              ...state.drafts,
              [inspectionId]: {
                inspectionId,
                items,
                dirty: false,
                lastSavedAt: existing?.lastSavedAt ?? null,
                startedAt: existing?.startedAt ?? startedAt ?? new Date().toISOString(),
              },
            },
          };
        }),
      updateItemStatus: (inspectionId, itemId, status) =>
        set((s) => patchItem(s, inspectionId, itemId, (i) => ({ ...i, status }))),
      addMedia: (inspectionId, itemId, url) =>
        set((s) => patchItem(s, inspectionId, itemId, (i) => ({ ...i, mediaUrls: [...i.mediaUrls, url] }))),
      removeMedia: (inspectionId, itemId, url) =>
        set((s) => patchItem(s, inspectionId, itemId, (i) => ({ ...i, mediaUrls: i.mediaUrls.filter((u) => u !== url) }))),
      setNotes: (inspectionId, itemId, notes) =>
        set((s) => patchItem(s, inspectionId, itemId, (i) => ({ ...i, notes: notes || null }))),
      markSaved: (inspectionId, at) =>
        set((s) =>
          s.drafts[inspectionId]
            ? { drafts: { ...s.drafts, [inspectionId]: { ...s.drafts[inspectionId], dirty: false, lastSavedAt: at } } }
            : s
        ),
      clear: (inspectionId) =>
        set((s) => {
          const next = { ...s.drafts };
          delete next[inspectionId];
          return { drafts: next };
        }),
    }),
    { name: "gp_checklist_drafts" }
  )
);
