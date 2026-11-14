"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import type { AuthResponse, LoginInput, NotificationChannel, RegisterInput, User } from "@/lib/types";
import { ROLE_HOME, useAuthStore } from "@/stores/authStore";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.post<AuthResponse>("/auth/login", input),
    onSuccess: (res) => {
      qc.clear();
      setSession(res);
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => apiClient.post<AuthResponse>("/auth/register", input),
    onSuccess: (res) => {
      qc.clear();
      setSession(res);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();
  const router = useRouter();
  return () => {
    logout();
    qc.clear();
    router.push("/login");
  };
}

export function useUpdateMe() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (input: { name?: string; phone?: string }) => apiClient.patch<User>("/users/me", input),
    onSuccess: setUser,
  });
}

export function useSaveNotificationChannel() {
  return useMutation({
    mutationFn: (notificationChannel: NotificationChannel) =>
      apiClient.patch("/users/me/preferences", { notificationChannel }),
  });
}

export { ROLE_HOME };
