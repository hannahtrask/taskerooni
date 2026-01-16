'use client';

import { Task, TaskStatus } from '@/app/types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case 'created':
        return 'in-progress';
      case 'in-progress':
        return 'complete';
      case 'complete':
        return null;
      default:
        return null;
    }
  };

  const getPreviousStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case 'complete':
        return 'in-progress';
      case 'in-progress':
        return 'created';
      case 'created':
        return null;
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(task.status);
  const previousStatus = getPreviousStatus(task.status);

  const statusColors = {
    'created': 'bg-white border-amber-300 shadow-sm',
    'in-progress': 'bg-white border-sky-300 shadow-sm',
    'complete': 'bg-white border-emerald-300 shadow-sm',
  };

  const statusBadgeColors = {
    'created': 'bg-amber-100 text-amber-800 border border-amber-300',
    'in-progress': 'bg-sky-100 text-sky-800 border border-sky-300',
    'complete': 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[task.status]} mb-3`}>
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-700 mb-3">{task.description}</p>
      )}
      <div className="flex gap-2 items-center flex-wrap">
        <span className={`text-xs font-medium px-2 py-1 rounded ${statusBadgeColors[task.status]}`}>
          {task.status}
        </span>
        <div className="flex gap-2 ml-auto">
          {previousStatus && (
            <button
              onClick={() => onStatusChange(task.id, previousStatus)}
              className="text-xs px-3 py-1 bg-stone-200 hover:bg-stone-300 text-gray-800 rounded font-medium"
            >
              ← Back
            </button>
          )}
          {nextStatus && (
            <button
              onClick={() => onStatusChange(task.id, nextStatus)}
              className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
            >
              Next →
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

