"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(`Query Failed: ${error instanceof Error ? error.message : "Network error"}`);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(`Operation Failed: ${error instanceof Error ? error.message : "Something went wrong"}`);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
