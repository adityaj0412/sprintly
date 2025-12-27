
import React, { useState, useMemo, useEffect } from 'react';
import { Task, Priority } from './types';
import { PRIORITY_CONFIG, ICONS } from './constants';
import TodoItem from './components/TodoItem';
import TodoForm from './components/TodoForm';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('sprintly_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sprintly_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');

  useEffect(() => {
    localStorage.setItem('sprintly_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync theme with document class and local storage
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('sprintly_theme', theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addTask = (newTask: { title: string; description: string; priority: Priority }) => {
    const task: Task = {
      id: crypto.randomUUID(),
      ...newTask,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }
    if (filterPriority !== 'ALL') {
      result = result.filter(t => t.priority === filterPriority);
    }
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityDiff = PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt - a.createdAt;
    });
  }, [tasks, searchQuery, filterPriority]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    const urgent = tasks.filter(t => t.priority === Priority.URGENT && !t.completed).length;
    return { total, completed, progress, urgent };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <header className="pt-16 pb-12 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-400 dark:shadow-blue-900/40 rotate-3 transition-transform hover:rotate-0">
                  <ICONS.Rocket />
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Sprintly</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight">High-velocity task optimization.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? <ICONS.Moon /> : <ICONS.Sun />}
              </button>

              <div className="bg-white dark:bg-slate-900 px-8 py-5 rounded-[2rem] shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col gap-3 min-w-[200px] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sprint Velocity</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">{stats.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                    style={{ width: `${stats.progress}%` }}
                  ></div>
                </div>
              </div>
              {stats.urgent > 0 && (
                <div className="bg-rose-600 px-8 py-5 rounded-[2rem] shadow-xl shadow-rose-200 dark:shadow-none text-white flex flex-col animate-pulse">
                  <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-1">Critical</span>
                  <span className="text-2xl font-black leading-none">{stats.urgent}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Action Layer */}
        <TodoForm onAdd={addTask} />

        {/* Command Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 sticky top-8 z-30">
          <div className="relative flex-grow w-full group">
            <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 dark:text-slate-600 group-focus-within:text-blue-600 transition-colors">
              <ICONS.Search />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, priority, or tech..."
              className="block w-full pl-14 pr-6 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/50 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all text-sm font-bold tracking-tight dark:text-white dark:placeholder:text-slate-700"
            />
          </div>
          
          <div className="flex p-1.5 gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none w-full sm:w-auto overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setFilterPriority('ALL')}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap
                ${filterPriority === 'ALL' 
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              All Tasks
            </button>
            {Object.values(Priority).map(p => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap
                  ${filterPriority === p 
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow List */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <ICONS.Trending />
              <h2 className="text-[11px] font-black text-slate-900 dark:text-slate-400 uppercase tracking-[0.25em]">Pipeline Velocity</h2>
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 border-2 border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full">{filteredAndSortedTasks.length} NODES</span>
          </div>
          
          {filteredAndSortedTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-500">
              {filteredAndSortedTasks.map(task => (
                <TodoItem 
                  key={task.id} 
                  task={task} 
                  onToggle={toggleTask} 
                  onDelete={deleteTask} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-slate-900/50 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-900 transition-all">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700 mb-8 border-2 border-slate-100 dark:border-slate-800">
                <ICONS.Rocket />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-200 mb-3 tracking-tight">System Idle</h3>
              <p className="text-slate-400 dark:text-slate-600 max-w-sm text-base font-bold leading-relaxed">
                {searchQuery ? "No matching modules in the current search query." : "Pipeline clear. All sprints have reached terminal velocity. Ready for new input."}
              </p>
            </div>
          )}
        </div>
        
        <footer className="mt-32 pt-12 border-t-2 border-slate-100 dark:border-slate-900 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-slate-900 dark:bg-blue-600 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-colors duration-500">
            <span className="w-2 h-2 bg-blue-500 dark:bg-white rounded-full shadow-[0_0_8px_#3b82f6] animate-pulse"></span>
            Sprintly Core Engine • Production Stable
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
