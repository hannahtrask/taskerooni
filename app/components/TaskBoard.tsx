'use client';

import { useState, useEffect } from 'react';
import { Task, TaskPriority } from '@/app/types/task';
import { taskService } from '@/app/services/taskService';
import TaskCard from './TaskCard';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('low');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setError(null);
      const data = await taskService.getAllTasks();
      setTasks(data);
      console.log('tasks:', tasks)
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to load tasks. Make sure the backend is running on port 8080.');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setError(null);
      await taskService.createTask({
        title: newTaskTitle,
        description: newTaskDescription || undefined,
        priority: newTaskPriority,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('low');
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to create task:', error);
      setError(error.message || 'Failed to create task');
    }
  };

  const toggleTaskCompletion = async (task: Task) => {
    try {
      setError(null);
      await taskService.updateTask(task._id, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      setError(error.message || 'Failed to update task');
    }
  };

  const moveTaskForward = async (task: Task) => {
    try {
      setError(null);
      if (!task.completed && task.priority === 'low') {
        // Move from To Do to In Progress (increase priority)
        await taskService.updateTask(task._id, { priority: 'medium' });
      } else if (!task.completed) {
        // Move from In Progress to Complete
        await taskService.updateTask(task._id, { completed: true });
      }
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      setError(error.message || 'Failed to update task');
    }
  };

  const moveTaskBackward = async (task: Task) => {
    try {
      setError(null);
      if (task.completed) {
        // Move from Complete to In Progress
        await taskService.updateTask(task._id, { completed: false, priority: 'medium' });
      } else if (task.priority !== 'low') {
        // Move from In Progress to To Do
        await taskService.updateTask(task._id, { priority: 'low' });
      }
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      setError(error.message || 'Failed to update task');
    }
  };

  const updateTaskPriority = async (id: string, priority: TaskPriority) => {
    try {
      setError(null);
      await taskService.updateTask(id, { priority });
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      setError(error.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      fetchTasks();
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      setError(error.message || 'Failed to delete task');
    }
  };

  const getToDoTasks = () => {
    return tasks.filter(task => !task.completed && task.priority === 'low');
  };

  const getInProgressTasks = () => {
    return tasks.filter(task => !task.completed && task.priority !== 'low');
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-800">Loading tasks...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Task Board</h1>

      {error && (
        <div className="mb-4 p-4 bg-rose-100 border border-rose-300 rounded-lg text-rose-800">
          {error}
        </div>
      )}

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
            required
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 border border-stone-300 rounded bg-white text-gray-800"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            To Do ({getToDoTasks().length})
          </h2>
          <div className="bg-amber-50 p-4 rounded-lg min-h-[200px] border border-amber-200">
            {getToDoTasks().map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onMoveForward={moveTaskForward}
                onMoveBackward={moveTaskBackward}
                onPriorityChange={updateTaskPriority}
                onDelete={deleteTask}
              />
            ))}
            {getToDoTasks().length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No tasks yet</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            In Progress ({getInProgressTasks().length})
          </h2>
          <div className="bg-sky-50 p-4 rounded-lg min-h-[200px] border border-sky-200">
            {getInProgressTasks().map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onMoveForward={moveTaskForward}
                onMoveBackward={moveTaskBackward}
                onPriorityChange={updateTaskPriority}
                onDelete={deleteTask}
              />
            ))}
            {getInProgressTasks().length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No tasks in progress</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Complete ({getCompletedTasks().length})
          </h2>
          <div className="bg-emerald-50 p-4 rounded-lg min-h-[200px] border border-emerald-200">
            {getCompletedTasks().map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onMoveForward={moveTaskForward}
                onMoveBackward={moveTaskBackward}
                onPriorityChange={updateTaskPriority}
                onDelete={deleteTask}
              />
            ))}
            {getCompletedTasks().length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No completed tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

