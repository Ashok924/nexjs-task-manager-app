import { NextResponse } from "next/server";
import { taskSchema } from "@/app/utils/validations";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    const tasks = await prisma.task.findMany({
      where: query ? {
        title: {
          contains: query,
          mode: 'insensitive',
        }
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

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

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || "",
        status: body.status || "todo",
        priority: body.priority || "medium",
        dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      }
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST Tasks Error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
