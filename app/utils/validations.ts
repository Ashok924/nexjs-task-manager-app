import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});
