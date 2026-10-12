"use client";

/**
 * TanStack Query provider.
 *
 * The PRD (Section 7.1) picks TanStack Query for data fetching. It needs one
 * QueryClient created on the client and shared by the whole app, so this
 * component wraps everything in src/app/layout.tsx.
 *
 * useState(() => new QueryClient()) makes sure the client is created ONCE per
 * browser session and not re-created on every re-render.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // data stays "fresh" for 30s before refetch
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
