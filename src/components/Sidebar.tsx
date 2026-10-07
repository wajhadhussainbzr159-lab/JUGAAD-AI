import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Pin, 
  Trash2, 
  FolderPlus, 
  Folder, 
  Brain, 
  Zap, 
  Compass, 
  Bot, 
  BookOpen, 
  Code, 
  BarChart3, 
  Palette, 
  X,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ChatSession, Project, AppMode } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onTogglePinChat: (id: string) => void;
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: () => void;
  onOpenMemories: () => void;
  onOpenLanding: () => void;
  memoryCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onTogglePinChat,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onOpenMemories,
  onOpenLanding,
  memoryCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(c => c.pinned);
  const recentChats = filteredChats.filter(c => !c.pinned);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 lg:static
        w-72 bg-[#0c0f17] border-r border-slate-800/80
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Conversation</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 ml-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Scrollable Main Section */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {/* Main Capabilities & Navigation */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              Core Capabilities
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => { onSelectMode('chat'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'chat' ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>AI Chat Assistant</span>
              </button>

              <button
                onClick={() => { onSelectMode('jugaad'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition ${
                  currentMode === 'jugaad' ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/15 text-amber-200 border border-amber-500/40 glow-amber' : 'text-amber-400/90 hover:bg-amber-500/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  <span>JUGAAD MODE</span>
                </div>
                <span className="text-[9px] font-mono bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                  SIGNATURE
                </span>
              </button>

              <button
                onClick={() => { onSelectMode('deep_research'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'deep_research' ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Deep Research</span>
              </button>

              <button
                onClick={() => { onSelectMode('agent'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'agent' ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Autonomous Agent</span>
              </button>

              <button
                onClick={() => { onSelectMode('study'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'study' ? 'bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Study Studio & Quiz</span>
              </button>

              <button
                onClick={() => { onSelectMode('coding'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'coding' ? 'bg-violet-500/15 text-violet-300 font-semibold border border-violet-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Code className="w-4 h-4 text-violet-400" />
                <span>Coding Workspace</span>
              </button>

              <button
                onClick={() => { onSelectMode('data_analyst'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'data_analyst' ? 'bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-rose-400" />
                <span>Data Analyst</span>
              </button>

              <button
                onClick={() => { onSelectMode('creative'); if (window.innerWidth < 1024) onClose(); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition ${
                  currentMode === 'creative' ? 'bg-pink-500/15 text-pink-300 font-semibold border border-pink-500/30' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4 text-pink-400" />
                <span>Creative Studio</span>
              </button>
            </div>
          </div>

          {/* Workspace Projects */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                Workspaces
              </span>
              <button
                onClick={onCreateProject}
                className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1 font-medium"
                title="Create Workspace Project"
              >
                <FolderPlus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.length === 0 ? (
                <div className="px-2.5 py-2 text-[11px] text-slate-500 italic">
                  No projects created yet.
                </div>
              ) : (
                projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(activeProjectId === proj.id ? null : proj.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                      activeProjectId === proj.id
                        ? 'bg-amber-500/20 text-amber-200 font-semibold border border-amber-500/30'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className={`w-3.5 h-3.5 ${activeProjectId === proj.id ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="truncate">{proj.title}</span>
                    </div>
                    {activeProjectId === proj.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat History */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              Recent Conversations
            </div>

            {/* Pinned Chats */}
            {pinnedChats.length > 0 && (
              <div className="mb-2 space-y-0.5">
                {pinnedChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      activeChatId === chat.id
                        ? 'bg-slate-800 text-slate-100 font-medium'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                    onClick={() => {
                      onSelectChat(chat.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Pin className="w-3 h-3 text-amber-400 fill-amber-400/30 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePinChat(chat.id); }}
                        className="p-1 hover:text-amber-400"
                        title="Unpin chat"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                        className="p-1 hover:text-red-400"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Regular Recent Chats */}
            <div className="space-y-0.5">
              {recentChats.length === 0 && pinnedChats.length === 0 ? (
                <div className="px-2.5 py-2 text-[11px] text-slate-500 italic">
                  No previous conversations.
                </div>
              ) : (
                recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition ${
                      activeChatId === chat.id
                        ? 'bg-slate-800 text-slate-100 font-medium'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                    onClick={() => {
                      onSelectChat(chat.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onTogglePinChat(chat.id); }}
                        className="p-1 hover:text-amber-400"
                        title="Pin chat"
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                        className="p-1 hover:text-red-400"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Drawer: Memory Bank, Landing Link, Creator Attribution */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090b10] space-y-2">
          {/* Memory Bank Button */}
          <button
            onClick={() => { onOpenMemories(); if (window.innerWidth < 1024) onClose(); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 text-xs font-medium text-slate-300 hover:text-amber-300 transition"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>Personal AI Memory</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono">
              {memoryCount}
            </span>
          </button>

          {/* Landing Page Trigger */}
          <button
            onClick={() => { onOpenLanding(); if (window.innerWidth < 1024) onClose(); }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Product Landing Page</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Mandatory Footer Accreditation */}
          <div className="pt-2 text-center border-t border-slate-800/60">
            <p className="text-[11px] font-medium text-slate-400">
              JUGAAD AI © 2026 <span className="text-amber-400 font-semibold">Wajhad Bozdar</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
