"use client";

import { FallbackProps } from "react-error-boundary";

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
        <svg
          className="h-10 w-10 text-red-600 dark:text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
        Something went wrong
      </h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred in the application.
      </p>
      
      {process.env.NODE_ENV === "development" && (
        <div className="w-full max-w-2xl bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md overflow-auto text-left mb-8 shadow-inner border border-zinc-200 dark:border-zinc-800">
          <p className="font-mono text-sm text-red-600 dark:text-red-400 break-words">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:focus:ring-zinc-100 dark:focus:ring-offset-zinc-950"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
