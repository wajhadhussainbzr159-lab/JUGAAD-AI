import React, { useState } from 'react';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Memory } from '../types';

interface MemoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  memoryEnabled: boolean;
  onToggleMemoryEnabled: (enabled: boolean) => void;
  onAddMemory: (content: string, category?: string) => Promise<void>;
  onDeleteMemory: (id: string) => Promise<void>;
  onClearAllMemories: () => Promise<void>;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({
  isOpen,
  onClose,
  memories,
  memoryEnabled,
  onToggleMemoryEnabled,
  onAddMemory,
  onDeleteMemory,
  onClearAllMemories
}) => {
  const [newContent, setNewContent] = useState('');
  const [category, setCategory] = useState('preference');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    setIsAdding(true);
    try {
      await onAddMemory(newContent.trim(), category);
      setNewContent('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-2xl w-full bg-[#10141e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Personal AI Memory</h2>
              <p className="text-xs text-slate-400">Manage what JUGAAD AI remembers about your preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Toggle Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-sm font-semibold text-slate-200">AI Memory Retention</span>
              <p className="text-xs text-slate-400 mt-0.5">
                {memoryEnabled 
                  ? 'Active: JUGAAD AI applies your stored preferences to every response.' 
                  : 'Disabled: JUGAAD AI will not recall past stored memories.'}
              </p>
            </div>
            <button
              onClick={() => onToggleMemoryEnabled(!memoryEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                memoryEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  memoryEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Add New Memory Input */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Teach a New Preference
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Remember that I prefer simple code examples with TypeScript"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
              />
              <button
                onClick={handleAdd}
                disabled={isAdding || !newContent.trim()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Memories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Saved Memories ({memories.length})</span>
              {memories.length > 0 && (
                <button
                  onClick={onClearAllMemories}
                  className="text-red-400 hover:text-red-300 transition text-[11px]"
                >
                  Clear All
                </button>
              )}
            </div>

            {memories.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs italic">
                No memories stored yet. Add custom rules or preferences above.
              </div>
            ) : (
              <div className="space-y-2">
                {memories.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
                  >
                    <div className="pr-3 text-xs text-slate-200 leading-relaxed">
                      {m.content}
                    </div>
                    <button
                      onClick={() => onDeleteMemory(m.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition rounded-lg hover:bg-slate-800"
                      title="Delete memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2 p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Memory privacy protected: JUGAAD AI only remembers non-sensitive, productive guidelines you explicitly permit. You can edit or purge your memory record at any time.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
