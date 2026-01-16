import { Task, TaskStatus } from '@/app/types/task';

let tasks: Task[] = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    status: 'created',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getAllTasks(): Task[] {
  return tasks;
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find(task => task.id === id);
}

export function createTask(title: string, description?: string): Task {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    description,
    status: 'created',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  return newTask;
}

export function updateTaskStatus(id: string, status: TaskStatus): Task | null {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  
  task.status = status;
  task.updatedAt = new Date();
  return task;
}

export function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  
  Object.assign(task, updates, { updatedAt: new Date() });
  return task;
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  return true;
}

