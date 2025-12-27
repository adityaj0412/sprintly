
import React, { useState } from 'react';
import { Task, AISuggestion, Priority } from '../types';
import { suggestNextTasks } from '../services/geminiService';
import { ICONS } from '../constants';
import PriorityBadge from './PriorityBadge';

interface AIAssistantProps {
  existingTasks: Task[];
  onAddFromSuggestion: (suggestion: AISuggestion) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ existingTasks, onAddFromSuggestion }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const results = await suggestNextTasks(existingTasks);
      setSuggestions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl p-6 md:p-10 text-white ai-glow">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
            <ICONS.Sparkles />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Sprint Intelligence</h2>
            <p className="text-slate-400 text-sm font-medium">Next-step predictive modeling</p>
          </div>
        </div>
        
        <button
          onClick={handleGetSuggestions}
          disabled={loading}
          className="group relative px-8 py-3 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-50 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? <ICONS.Loader /> : <ICONS.Plus />}
            {loading ? 'Optimizing...' : 'Predict Next Sprint'}
          </span>
        </button>
      </div>

      {suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
          {suggestions.map((suggestion, idx) => (
            <div key={idx} className="group flex flex-col p-6 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <PriorityBadge priority={suggestion.suggestedPriority as Priority} />
                <button
                  onClick={() => {
                    onAddFromSuggestion(suggestion);
                    setSuggestions(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-700 text-blue-400 flex items-center justify-center border border-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-lg"
                >
                  <ICONS.Plus />
                </button>
              </div>
              <h4 className="font-bold text-white text-lg mb-2 leading-tight group-hover:text-blue-400 transition-colors">{suggestion.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{suggestion.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
            <ICONS.Rocket />
          </div>
          <p className="text-slate-300 font-bold text-lg max-w-md">
            {loading 
              ? "Synthesizing your workflow history..." 
              : "Accelerate your output. Let Sprint Intelligence scan your current tasks for high-impact opportunities."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
