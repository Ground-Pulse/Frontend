"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type {
  AdminDashboardSummary,
  AuditLog,
  ChecklistTemplate,
  Inspection,
  InspectorProfile,
  ReassignInput,
  ServiceProviderProfile,
  VerificationRequest,
} from "@/lib/types";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiClient.get<AdminDashboardSummary>("/admin/dashboard"),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useProviders(filters: { verified?: boolean; locality?: string; serviceType?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.verified) p.set("verified", "true");
  if (filters.locality) p.set("locality", filters.locality);
  if (filters.serviceType) p.set("serviceType", filters.serviceType);
  const s = p.toString();
  return useQuery({
    queryKey: ["admin", "providers", filters],
    queryFn: () => apiClient.get<ServiceProviderProfile[]>(`/providers${s ? `?${s}` : ""}`),
  });
}

export function useInspectors(verifiedOnly = false) {
  return useQuery({
    queryKey: ["admin", "inspectors", verifiedOnly],
    queryFn: () => apiClient.get<InspectorProfile[]>(`/inspectors${verifiedOnly ? "?verified=true" : ""}`),
  });
}

export function useReassign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReassignInput) => apiClient.post<Inspection>("/admin/reassign", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inspections"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}

export function useVerificationQueue() {
  return useQuery({
    queryKey: ["admin", "verification"],
    queryFn: () => apiClient.get<VerificationRequest[]>("/admin/verification"),
  });
}

export function useVerificationDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, approve, reason }: { userId: string; approve: boolean; reason?: string }) =>
      apiClient.post(`/admin/verification/${userId}/${approve ? "approve" : "reject"}`, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

export function useAuditLogs(filters: { entityType?: string; entityId?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.entityType) p.set("entityType", filters.entityType);
  if (filters.entityId) p.set("entityId", filters.entityId);
  const s = p.toString();
  return useQuery({
    queryKey: ["admin", "audit", filters],
    queryFn: () => apiClient.get<AuditLog[]>(`/admin/audit-logs${s ? `?${s}` : ""}`),
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["admin", "templates"],
    queryFn: () => apiClient.get<ChecklistTemplate[]>("/templates"),
  });
}

export function useSaveTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (t: Pick<ChecklistTemplate, "id" | "items">) =>
      apiClient.put<ChecklistTemplate>(`/templates/${t.id}`, { items: t.items }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "templates"] }),
  });
}
