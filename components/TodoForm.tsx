
import React, { useState } from 'react';
import { Priority } from '../types';
import { ICONS } from '../constants';

interface TodoFormProps {
  onAdd: (task: { title: string; description: string; priority: Priority }) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, priority });
    setTitle('');
    setDescription('');
    setPriority(Priority.MEDIUM);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all focus-within:border-blue-500 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 mb-2 block">Task Objective</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Refactor authentication logic"
              className="w-full text-xl font-black bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white"
              required
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1 mb-2 block">Context & Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add technical constraints or steps..."
              rows={3}
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-all resize-none text-base placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium dark:text-white"
            />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Priority Mapping</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(Priority).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all
                    ${priority === p 
                      ? 'bg-slate-900 dark:bg-blue-600 border-slate-900 dark:border-blue-600 text-white shadow-xl scale-105' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-500 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            className="flex-grow flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl shadow-blue-200 dark:shadow-none active:scale-[0.98]"
          >
            <ICONS.Plus />
            Initiate Task
          </button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;
