import { NextResponse } from "next/server";
import { JSON_PLACEHOLDER_API_URL } from "@/app/utils/constants";
import type { JSONPlaceholderTodo } from "@/app/utils/types";
import { taskSchema } from "@/app/utils/validations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    // Fetch tasks, with optional search query
    const url = query ? `${JSON_PLACEHOLDER_API_URL}?q=${encodeURIComponent(query)}` : JSON_PLACEHOLDER_API_URL;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Failed to fetch tasks");
    
    const todos: JSONPlaceholderTodo[] = await response.json();
    
    // Transform JSONPlaceholder data to match UI needs
    const tasks = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      status: todo.completed ? "done" : "todo",
      priority: "medium", // Default fallback
      dueDate: new Date().toISOString().split('T')[0], // Default fallback
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const validation = taskSchema.safeParse(rawBody);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const body = validation.data;

    const response = await fetch(JSON_PLACEHOLDER_API_URL, {
      method: "POST",
      body: JSON.stringify({
        title: body.title,
        completed: body.status === "done",
        userId: 1, // Default assigned user
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) throw new Error("Failed to create task");
    
    const newTodo = await response.json();
    
    // Note: JSONPlaceholder always returns id: 201 for POST responses.
    const newTask = {
      id: newTodo.id, 
      title: body.title,
      status: body.status || "todo",
      priority: body.priority || "medium",
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      description: body.description || "",
    };

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST Tasks Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
