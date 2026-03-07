import { NextResponse } from "next/server";
import { JSON_PLACEHOLDER_API_URL } from "@/app/utils/constants";
import { updateTaskSchema } from "@/app/utils/validations";

// Awaiting params covers compatibility for both Next.js 14 (sync) and Next.js 15+ (async params)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const response = await fetch(`${JSON_PLACEHOLDER_API_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      throw new Error("Failed to fetch task");
    }
    
    const todo = await response.json();
    
    const task = {
      id: todo.id,
      title: todo.title,
      status: todo.completed ? "done" : "todo",
      priority: "medium",
      dueDate: new Date().toISOString().split('T')[0],
      description: "",
    };

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET Task Error:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    const rawBody = await request.json();
    const validation = updateTaskSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validation.error.format() },
        { status: 400 }
      );
    }

    const body = validation.data;
    
    const response = await fetch(`${JSON_PLACEHOLDER_API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        title: body.title,
        completed: body.status === "done",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) throw new Error("Failed to update task");
    
    const updatedTodo = await response.json();
    
    return NextResponse.json({
      id: updatedTodo.id,
      title: body.title || updatedTodo.title,
      status: body.status || (updatedTodo.completed ? "done" : "todo"),
      priority: body.priority || "medium",
      dueDate: body.dueDate || null,
      description: body.description || "",
    });
  } catch (error) {
    console.error("PUT Tasks Error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;
    
    const response = await fetch(`${JSON_PLACEHOLDER_API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete task");

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE Tasks Error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
