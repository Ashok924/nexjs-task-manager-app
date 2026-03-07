export default function TaskLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="flex flex-col w-full max-w-3xl gap-8 animate-pulse">
        {/* Navigation / Header Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-9 w-3/4 max-w-lg bg-zinc-200 dark:bg-zinc-800 rounded-md mt-1"></div>
        </div>

        {/* Details Card Skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-8">
            
            {/* Status & Priority Badges Skeleton */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="flex flex-col gap-3">
              <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              <div className="space-y-3 pt-2">
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-4 w-11/12 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </div>
            </div>
            
            {/* Metadata Footer Skeleton */}
            <div className="pt-6 mt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
