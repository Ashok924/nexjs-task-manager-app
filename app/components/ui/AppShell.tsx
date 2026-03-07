'use client';

import { Providers } from "@/app/providers";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "@/app/components/ui/GlobalErrorFallback";
import { UserButton } from '@neondatabase/auth/react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar with UserButton */}
      <header className="w-full flex justify-end items-center px-8 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10 flex-shrink-0">
        <UserButton size="icon" />
      </header>

      {/* Scrollable main area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
          <Providers>
            <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
              {children}
            </ErrorBoundary>
            <Toaster position="top-right" richColors />
          </Providers>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-950 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
