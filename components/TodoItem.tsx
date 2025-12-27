
import React from 'react';
import { Task } from '../types';
import PriorityBadge from './PriorityBadge';
import { ICONS } from '../constants';

interface TodoItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300
      ${task.completed 
        ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 opacity-60' 
        : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 hover:-translate-y-0.5'}`}>
      
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center
          ${task.completed 
            ? 'bg-blue-600 border-blue-600 text-white shadow-inner scale-95' 
            : 'border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 hover:border-blue-400 group-hover:scale-110'}`}
      >
        {task.completed && <ICONS.Check />}
      </button>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className={`font-semibold text-slate-800 dark:text-slate-200 transition-all duration-300 ${task.completed ? 'line-through text-slate-400 dark:text-slate-600' : ''}`}>
            {task.title}
          </h3>
          <PriorityBadge priority={task.priority} />
        </div>
        {task.description && (
          <p className={`text-sm text-slate-500 dark:text-slate-400 line-clamp-2 transition-all duration-300 ${task.completed ? 'text-slate-300 dark:text-slate-700' : ''}`}>
            {task.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete task"
      >
        <ICONS.Delete />
      </button>
    </div>
  );
};

export default TodoItem;
