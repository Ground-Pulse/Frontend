"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type {
  Inspection,
  InspectionDetail,
  SaveChecklistDraftInput,
  ScheduleInspectionInput,
} from "@/lib/types";

export interface InspectionFilters {
  propertyId?: string;
  status?: string;
  unassigned?: boolean;
}

function qs(f: InspectionFilters = {}) {
  const p = new URLSearchParams();
  if (f.propertyId) p.set("propertyId", f.propertyId);
  if (f.status) p.set("status", f.status);
  if (f.unassigned) p.set("unassigned", "true");
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Role-scoped list: owners get their properties', inspectors their assigned, admins all. */
export function useInspections(filters: InspectionFilters = {}) {
  return useQuery({
    queryKey: ["inspections", filters],
    queryFn: () => apiClient.get<Inspection[]>(`/inspections${qs(filters)}`),
    staleTime: 60_000,
  });
}

export const useAssignedInspections = () => useInspections();

export function useInspectionDetail(id: string) {
  return useQuery({
    queryKey: ["inspection", id],
    queryFn: () => apiClient.get<InspectionDetail>(`/inspections/${id}`),
  });
}

export function useScheduleInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleInspectionInput) => apiClient.post<Inspection>("/inspections", input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inspections"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property"] });
    },
  });
}

export function useCancelInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/inspections/${id}/cancel`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inspections"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["property"] });
    },
  });
}

export function useStartInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post<Inspection>(`/inspections/${id}/start`),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["inspections"] });
      qc.invalidateQueries({ queryKey: ["inspection", id] });
    },
  });
}

export function useSaveChecklistDraft(inspectionId: string) {
  return useMutation({
    mutationFn: (input: SaveChecklistDraftInput) =>
      apiClient.patch<{ ok: true; savedAt: string }>(`/inspections/${inspectionId}/checklist`, input),
  });
}

export function useSubmitChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (inspectionId: string) =>
      apiClient.post<{ ok: true; inspectionId: string }>(`/inspections/${inspectionId}/submit`),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["inspections"] });
      qc.invalidateQueries({ queryKey: ["inspection", id] });
    },
  });
}
