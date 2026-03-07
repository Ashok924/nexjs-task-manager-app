import { TaskManager } from "@/app/components/TaskManager";
import AppShell from "@/app/components/ui/AppShell";
import type { Task } from "@/app/utils/types";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
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
