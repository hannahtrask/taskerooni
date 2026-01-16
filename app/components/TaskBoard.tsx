'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/app/types/task';
import TaskCard from './TaskCard';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
        }),
      });

      if (response.ok) {
        setNewTaskTitle('');
        setNewTaskDescription('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Task Board</h1>

      {/* Create Task Form */}
      <form onSubmit={createTask} className="mb-8 p-6 bg-stone-100 rounded-lg border border-stone-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Task</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded bg-white text-gray-800 placeholder-gray-500"
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Task description (optional)"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded bg-white text-gray-800 placeholder-gray-500"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
        >
          Add Task
        </button>
      </form>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Created</h2>
          <div className="bg-amber-50 p-4 rounded-lg min-h-[200px] border border-amber-200">
            {getTasksByStatus('created').map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">In Progress</h2>
          <div className="bg-sky-50 p-4 rounded-lg min-h-[200px] border border-sky-200">
            {getTasksByStatus('in-progress').map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Complete</h2>
          <div className="bg-emerald-50 p-4 rounded-lg min-h-[200px] border border-emerald-200">
            {getTasksByStatus('complete').map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

