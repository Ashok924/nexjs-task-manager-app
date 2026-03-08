'use client';

import { useState } from 'react';
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalErrorFallback } from "@/app/components/ui/GlobalErrorFallback";
import { authClient } from '@/app/lib/auth/client';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // While session is loading, show nothing
  if (isPending) return null;

  // No session = hard redirect to sign-in
  if (!data?.session) {
    window.location.href = '/auth/sign-in';
    return null;
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    setMenuOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/auth/sign-in';
        },
        onError: () => {
          window.location.href = '/auth/sign-in';
        },
      },
    });
  };

  const userEmail = data.user?.email ?? '';
  const userInitial = userEmail.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="w-full flex justify-end items-center px-8 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10 flex-shrink-0">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-80 transition-opacity"
            title={userEmail}
          >
            {userInitial}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1.5 overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{userEmail}</p>
                </div>
                <a
                  href="/account/settings"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Account Settings
                </a>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Scrollable main area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
          <Providers>
            <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
              {children}
            </ErrorBoundary>
            {/* Removed Toaster because NeonAuthUIProvider injects one natively, avoiding duplicate toasts */}
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
