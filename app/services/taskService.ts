import { Task, CreateTaskInput, UpdateTaskInput } from '@/app/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  },

  async createTask(taskData: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create task');
    }
    return response.json();
  },

  async updateTask(id: string, updates: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update task');
    }
    return response.json();
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  },
};

