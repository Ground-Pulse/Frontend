"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { FlagIssueInput, Issue, IssueDetail, IssueMessage, Repair } from "@/lib/types";

export function useIssues(filters: { propertyId?: string; status?: string } = {}) {
  const p = new URLSearchParams();
  if (filters.propertyId) p.set("propertyId", filters.propertyId);
  if (filters.status) p.set("status", filters.status);
  const s = p.toString();
  return useQuery({
    queryKey: ["issues", filters],
    queryFn: () => apiClient.get<Issue[]>(`/issues${s ? `?${s}` : ""}`),
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ["issue", id],
    queryFn: () => apiClient.get<IssueDetail>(`/issues/${id}`),
  });
}

function invalidateIssueViews(qc: ReturnType<typeof useQueryClient>, id?: string) {
  qc.invalidateQueries({ queryKey: ["issues"] });
  qc.invalidateQueries({ queryKey: ["repairs"] });
  qc.invalidateQueries({ queryKey: ["properties"] });
  qc.invalidateQueries({ queryKey: ["property"] });
  if (id) qc.invalidateQueries({ queryKey: ["issue", id] });
}

export function useFlagIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FlagIssueInput) => apiClient.post<Issue>("/issues", input),
    onSuccess: (issue) => {
      invalidateIssueViews(qc);
      qc.invalidateQueries({ queryKey: ["inspection", issue.inspectionId] });
    },
  });
}

export function useApproveIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post<Repair>(`/issues/${id}/approve`),
    onSuccess: (_r, id) => invalidateIssueViews(qc, id),
  });
}

export function useDeclineIssue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.post<Issue>(`/issues/${id}/decline`, { reason }),
    onSuccess: (_r, v) => invalidateIssueViews(qc, v.id),
  });
}

export function usePostIssueMessage(issueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => apiClient.post<IssueMessage>(`/issues/${issueId}/messages`, { body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issue", issueId] }),
  });
}
