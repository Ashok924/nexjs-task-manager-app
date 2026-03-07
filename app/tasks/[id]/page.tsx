import Link from "next/link";
import { notFound } from "next/navigation";
import type { Task } from "@/app/utils/types";
import prisma from "@/app/lib/prisma";
import AppShell from "@/app/components/ui/AppShell";

interface TaskPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function TaskDetailsPage({ params }: TaskPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) notFound();

  const dbTask = await prisma.task.findUnique({ where: { id } });
  if (!dbTask) notFound();

  const task: Task = {
    id: dbTask.id,
    title: dbTask.title,
    status: dbTask.status as Task["status"],
    priority: dbTask.priority as Task["priority"],
    dueDate: dbTask.dueDate || new Date().toISOString().split('T')[0],
    description: dbTask.description || "",
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full max-w-3xl mx-auto gap-8">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Tasks
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">{task.title}</h1>

        {/* Details Card */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Status:</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                  task.status === "done" ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20" :
                  task.status === "in_progress" ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20" :
                  "bg-zinc-100 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700/50"
                }`}>{task.status.replace("_", " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Priority:</span>
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset bg-zinc-100 text-zinc-700 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700/50 capitalize">{task.priority}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Due Date:</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/80 rounded-md px-2.5 py-1 bg-zinc-50 dark:bg-zinc-950/50">{task.dueDate}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Description</h2>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-prose">{task.description || "No description provided."}</p>
            </div>

            <div className="pt-6 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-sm text-zinc-500 dark:text-zinc-500">
              <span>Task ID: #{task.id}</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
