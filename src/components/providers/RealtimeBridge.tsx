"use client";

/**
 * Connects Socket.IO once per session and turns server pushes into:
 *  - TanStack Query invalidations (lists/details refetch, no polling)
 *  - realtimeStore updates (live repair status pill)
 *  - a toast for each new notification
 */
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@/components/ui/Toast";
import { connectRealtime } from "@/lib/socket";
import type { Notification, RealtimeEvents } from "@/lib/types";
import { useAuthStore } from "@/stores/authStore";
import { useRealtimeStore } from "@/stores/realtimeStore";

export default function RealtimeBridge() {
  const userId = useAuthStore((s) => s.user?.id);
  const token = useAuthStore((s) => s.accessToken);
  const qc = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!userId || !token) return;
    const rt = useRealtimeStore.getState();
    return connectRealtime(
      userId,
      token,
      (event, payload) => {
        rt.touch();
        switch (event) {
          case "notification.new": {
            const n = payload as Notification;
            qc.setQueryData<Notification[]>(["notifications"], (old) => (old ? [n, ...old.filter((x) => x.id !== n.id)] : old));
            qc.invalidateQueries({ queryKey: ["notifications"] });
            toast.info(n.payload.title, {
              description: n.payload.body,
              action: n.payload.href ? { label: "View", onClick: () => router.push(n.payload.href!) } : undefined,
            });
            break;
          }
          case "repair.status.updated": {
            const p = payload as RealtimeEvents["repair.status.updated"];
            rt.onRepairStatusUpdated(p.repairId, p.status);
            qc.invalidateQueries({ queryKey: ["repairs"] });
            qc.invalidateQueries({ queryKey: ["issue", p.issueId] });
            qc.invalidateQueries({ queryKey: ["issues"] });
            qc.invalidateQueries({ queryKey: ["admin"] });
            break;
          }
          case "issue.flagged":
            qc.invalidateQueries({ queryKey: ["issues"] });
            qc.invalidateQueries({ queryKey: ["properties"] });
            qc.invalidateQueries({ queryKey: ["property"] });
            qc.invalidateQueries({ queryKey: ["admin"] });
            break;
          case "report.ready": {
            const p = payload as RealtimeEvents["report.ready"];
            qc.invalidateQueries({ queryKey: ["inspection", p.inspectionId] });
            qc.invalidateQueries({ queryKey: ["inspections"] });
            qc.invalidateQueries({ queryKey: ["properties"] });
            qc.invalidateQueries({ queryKey: ["property", p.propertyId] });
            qc.invalidateQueries({ queryKey: ["health-history", p.propertyId] });
            break;
          }
          case "inspection.updated":
            qc.invalidateQueries({ queryKey: ["inspections"] });
            qc.invalidateQueries({ queryKey: ["inspection", (payload as { inspectionId: string }).inspectionId] });
            qc.invalidateQueries({ queryKey: ["properties"] });
            qc.invalidateQueries({ queryKey: ["property"] });
            break;
          case "dashboard.changed":
            qc.invalidateQueries({ queryKey: ["admin"] });
            qc.invalidateQueries({ queryKey: ["inspections"] });
            qc.invalidateQueries({ queryKey: ["repairs"] });
            break;
        }
      },
      (state) => useRealtimeStore.getState().setConnection(state)
    );
  }, [userId, token, qc, router]);

  return null;
}
