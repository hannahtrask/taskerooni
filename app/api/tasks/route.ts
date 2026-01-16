import { NextRequest, NextResponse } from 'next/server';
import { getAllTasks, createTask } from '@/app/lib/tasks';

export async function GET() {
  try {
    const tasks = getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tasks: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const newTask = createTask(title, description);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create task: ${error}` },
      { status: 500 }
    );
  }
}

