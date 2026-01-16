'use client';

import { Task, TaskPriority } from '@/app/types/task';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onMoveForward: (task: Task) => void;
  onMoveBackward: (task: Task) => void;
  onPriorityChange: (id: string, priority: TaskPriority) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onMoveForward,
  onMoveBackward,
  onPriorityChange,
  onDelete
}: TaskCardProps) {
  const priorityColors = {
    'low': 'bg-slate-100 text-slate-700 border-slate-300',
    'medium': 'bg-amber-100 text-amber-800 border-amber-300',
    'high': 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const cardBorderColors = {
    'low': 'border-slate-300',
    'medium': 'border-amber-300',
    'high': 'border-rose-300',
  };

  // Determine if task can move forward or backward
  const canMoveForward = !task.completed || (task.priority === 'low' && !task.completed);
  const canMoveBackward = task.completed || (task.priority !== 'low' && !task.completed);

  return (
    <div className={`p-4 rounded-lg border-2 bg-white shadow-sm mb-3 ${cardBorderColors[task.priority]}`}>
      <div className="flex items-start gap-3 mb-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <div className="flex-1">
          <h3 className={`font-semibold text-lg text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm text-gray-700 mt-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap mt-3">
        <select
          value={task.priority}
          onChange={(e) => onPriorityChange(task._id, e.target.value as TaskPriority)}
          className={`text-xs font-medium px-2 py-1 rounded border ${priorityColors[task.priority]}`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {task.dueDate && (
          <span className="text-xs text-gray-600">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}

        <div className="flex gap-2 ml-auto">
          {canMoveBackward && (
            <button
              onClick={() => onMoveBackward(task)}
              className="text-xs px-3 py-1 bg-stone-200 hover:bg-stone-300 text-gray-800 rounded font-medium"
            >
              ← Back
            </button>
          )}
          {canMoveForward && (
            <button
              onClick={() => onMoveForward(task)}
              className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
            >
              Next →
            </button>
          )}
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

