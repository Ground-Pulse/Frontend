"use client";

/**
 * App-wide providers (FEA section 2):
 *  QueryClientProvider (TanStack Query) → ThemeSync → RealtimeBridge (Socket.IO) → Toaster
 *
 * useState(() => new QueryClient()) makes sure the client is created ONCE per
 * browser session and not re-created on every re-render.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import RealtimeBridge from "@/components/providers/RealtimeBridge";
import ThemeSync from "@/components/providers/ThemeSync";
import { Toaster } from "@/components/ui/Toast";
import { GroundPulseError } from "@/lib/errors";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // stale-while-revalidate
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: (count, err) =>
              !(err instanceof GroundPulseError && err.statusCode >= 400 && err.statusCode < 500) && count < 2,
          },
          mutations: { retry: 0 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <ThemeSync />
      </Suspense>
      <RealtimeBridge />
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
