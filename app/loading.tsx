export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="flex flex-col w-full max-w-5xl gap-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-full sm:w-64 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          </div>
        </div>

        {/* Table Container Skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden flex flex-col">
          {/* Header Grid Skeleton */}
          <div className="flex-none bg-zinc-50/50 border-b border-zinc-200 dark:bg-zinc-800/50 dark:border-zinc-800/80 text-sm text-zinc-500 dark:text-zinc-300">
            <div className="flex w-full px-6 py-4">
              <div className="w-[30%]"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div></div>
              <div className="w-[15%]"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div></div>
              <div className="w-[15%]"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div></div>
              <div className="w-[15%]"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div></div>
              <div className="w-[25%] flex justify-end pr-4"><div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div></div>
            </div>
          </div>
          
          {/* Body Skeleton */}
          <div className="flex-col relative bg-white dark:bg-zinc-900">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex w-full px-6 py-4 items-center border-b border-zinc-200 dark:border-zinc-800/80">
                <div className="w-[30%] pr-4"><div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div></div>
                <div className="w-[15%] pr-4"><div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div></div>
                <div className="w-[15%] pr-4"><div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div></div>
                <div className="w-[15%] pr-4"><div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div></div>
                <div className="w-[25%] flex items-center justify-end gap-2 pr-2">
                  <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
