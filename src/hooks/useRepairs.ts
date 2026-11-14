"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type {
  CompleteRepairInput,
  RepairStatus,
  RepairWithContext,
  ServiceProviderProfile,
} from "@/lib/types";

export function useRepairs(status?: string) {
  return useQuery({
    queryKey: ["repairs", status ?? "all"],
    queryFn: () => apiClient.get<RepairWithContext[]>(`/repairs${status ? `?status=${status}` : ""}`),
  });
}

function useRepairMutation<V>(fn: (v: V) => Promise<RepairWithContext>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["repairs"] });
      qc.invalidateQueries({ queryKey: ["issue", r.issueId] });
      qc.invalidateQueries({ queryKey: ["issues"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export const useAssignProvider = () =>
  useRepairMutation(({ repairId, providerId }: { repairId: string; providerId: string }) =>
    apiClient.post<RepairWithContext>(`/repairs/${repairId}/assign`, { providerId })
  );

export const useTransitionRepair = () =>
  useRepairMutation(({ repairId, status, costEstimate }: { repairId: string; status: RepairStatus; costEstimate?: number | null }) =>
    apiClient.patch<RepairWithContext>(`/repairs/${repairId}/status`, { status, costEstimate })
  );

export const useDeclineJob = () =>
  useRepairMutation(({ repairId, reason }: { repairId: string; reason: string }) =>
    apiClient.post<RepairWithContext>(`/repairs/${repairId}/decline`, { reason })
  );

export const useCompleteRepair = () =>
  useRepairMutation(({ repairId, ...input }: CompleteRepairInput & { repairId: string }) =>
    apiClient.post<RepairWithContext>(`/repairs/${repairId}/complete`, input)
  );

export const useRateRepair = () =>
  useRepairMutation(({ repairId, rating }: { repairId: string; rating: number }) =>
    apiClient.post<RepairWithContext>(`/repairs/${repairId}/rate`, { rating })
  );

export function useMyProviderProfile(enabled = true) {
  return useQuery({
    queryKey: ["provider-me"],
    queryFn: () => apiClient.get<ServiceProviderProfile>("/providers/me"),
    enabled,
  });
}
