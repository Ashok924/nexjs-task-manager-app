import { redirect } from 'next/navigation';
import { TaskManager } from "@/app/components/TaskManager";
import AppShell from "@/app/components/ui/AppShell";
import type { Task } from "@/app/utils/types";
import prisma from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Server-side session guard — redirect if not authenticated
  // data?.session is the actual token; data alone may be a truthy object even when signed out
  const { data } = await auth.getSession();
  if (!data?.session) redirect('/auth/sign-in');
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  const initialTasks: Task[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status as Task["status"],
    priority: task.priority as Task["priority"],
    dueDate: task.dueDate || new Date().toISOString().split('T')[0],
    description: task.description || "",
  }));

  return (
    <AppShell>
      <TaskManager initialTasks={initialTasks} />
    </AppShell>
  );
}
