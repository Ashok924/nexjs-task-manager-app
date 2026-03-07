import { TaskManager } from "@/app/components/TaskManager";
import type { Task, JSONPlaceholderTodo } from "@/app/utils/types";
import { JSON_PLACEHOLDER_API_URL } from "@/app/utils/constants";

export default async function Home() {
  // Fetch ALL data on the Server
  const response = await fetch(JSON_PLACEHOLDER_API_URL, { cache: "no-store" });
  let initialTasks: Task[] = [];
  
  if (response.ok) {
    const todos: JSONPlaceholderTodo[] = await response.json();
    initialTasks = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      status: todo.completed ? "done" : "todo",
      priority: "medium", // Default
      dueDate: new Date().toISOString().split('T')[0], // Default
    }));
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="flex flex-col w-full max-w-5xl gap-8">
        <TaskManager initialTasks={initialTasks} />
      </main>
    </div>
  );
}
