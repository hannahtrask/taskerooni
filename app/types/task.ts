export type TaskStatus = 'created' | 'in-progress' | 'complete';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}