"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type {
  CreatePropertyInput,
  HealthPoint,
  Property,
  PropertyDocument,
  UpdatePropertyInput,
} from "@/lib/types";

export function useProperties(enabled = true) {
  return useQuery({
    queryKey: ["properties"],
    queryFn: () => apiClient.get<Property[]>("/properties"),
    staleTime: 60_000,
    enabled,
  });
}

export function useProperty(id: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => apiClient.get<Property>(`/properties/${id}`),
    // show the card data from the list instantly while the detail loads
    placeholderData: () => qc.getQueryData<Property[]>(["properties"])?.find((p) => p.id === id),
  });
}

export function useHealthHistory(id: string) {
  return useQuery({
    queryKey: ["health-history", id],
    queryFn: () => apiClient.get<HealthPoint[]>(`/properties/${id}/health-history`),
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePropertyInput) => apiClient.post<Property>("/properties", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePropertyInput) => apiClient.patch<Property>(`/properties/${id}`, input),
    onSuccess: (p) => {
      qc.setQueryData(["property", id], p);
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useArchiveProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.post(`/properties/${id}/archive`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });
}

export function usePropertyDocuments(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => apiClient.get<PropertyDocument[]>(`/properties/${id}/documents`),
  });
}

export function useAddDocument(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<PropertyDocument, "name" | "kind" | "url" | "sizeBytes">) =>
      apiClient.post<PropertyDocument>(`/properties/${propertyId}/documents`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents", propertyId] }),
  });
}

export function useDeleteDocument(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/documents/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents", propertyId] }),
  });
}
