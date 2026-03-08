"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Task } from "@/app/utils/types";
import { auth } from "@/app/lib/auth/server";

// Helper to serialize Task objects so Server Actions don't crash returning Dates
function serializeTask(task: any): Task {
  return {
    ...task,
    createdAt: task.createdAt?.toISOString(),
    updatedAt: task.updatedAt?.toISOString(),
  };
}

async function requireAuth() {
  const { data } = await auth.getSession();
  if (!data?.session) throw new Error("Unauthorized");
  return data.session;
}

export async function getTasks(query?: string) {
  try {
    await requireAuth();

    const tasks = await prisma.task.findMany({
      where: query
        ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
    return tasks.map(serializeTask) as Task[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function createTask(taskData: Omit<Task, "id">) {
  try {
    await requireAuth();

    const newTask = await prisma.task.create({
      data: taskData,
    });

    // Revalidate the /tasks path after creation
    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true, task: serializeTask(newTask) };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTask(id: number, taskData: Omit<Task, "id">) {
  try {
    await requireAuth();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: taskData,
    });

    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true, task: serializeTask(updatedTask) };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function updateTaskStatus(id: number, status: string) {
  try {
    await requireAuth();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true, task: serializeTask(updatedTask) };
  } catch (error) {
    console.error("Error updating task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function deleteTask(id: number) {
  try {
    await requireAuth();

    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/tasks");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
