"use client";

/**
 * Real-time cache fed by Socket.IO events (FEA section 4).
 * Components read live repair statuses / connection state from here; the
 * TanStack Query cache is invalidated alongside so lists refetch too.
 */
import { create } from "zustand";
import type { RepairStatus } from "@/lib/types";

export type ConnectionState = "connecting" | "connected" | "reconnecting" | "offline";

interface RealtimeState {
  connection: ConnectionState;
  repairStatuses: Record<string, RepairStatus>;
  lastEventAt: number | null;
  setConnection: (c: ConnectionState) => void;
  onRepairStatusUpdated: (repairId: string, status: RepairStatus) => void;
  touch: () => void;
}

export const useRealtimeStore = create<RealtimeState>()((set) => ({
  connection: "offline",
  repairStatuses: {},
  lastEventAt: null,
  setConnection: (connection) => set({ connection }),
  onRepairStatusUpdated: (repairId, status) =>
    set((s) => ({ repairStatuses: { ...s.repairStatuses, [repairId]: status }, lastEventAt: Date.now() })),
  touch: () => set({ lastEventAt: Date.now() }),
}));
