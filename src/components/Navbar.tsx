import React from 'react';
import { 
  Zap, 
  Globe2, 
  Settings as SettingsIcon, 
  Mic, 
  MicOff, 
  Sparkles, 
  Search, 
  BookOpen, 
  Code, 
  BarChart3, 
  Palette, 
  Bot, 
  Info,
  Menu
} from 'lucide-react';
import { AppMode, Language } from '../types';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  jugaadMode: boolean;
  onToggleJugaad: () => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  jugaadMode,
  onToggleJugaad,
  language,
  onChangeLanguage,
  onOpenSettings,
  onOpenAbout,
  isVoiceActive,
  onToggleVoice,
  onToggleSidebar
}) => {
  const languageLabels: Record<Language, string> = {
    en: 'English (EN)',
    ur: 'اردو (Urdu)',
    roman_ur: 'Roman Urdu',
    sd: 'سنڌي (Sindhi)',
    hi: 'हिन्दी (Hindi)',
    ar: 'العربية (Arabic)'
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-[#090b10]/90 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between">
      {/* Left side: Hamburger + Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition lg:hidden"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onSelectMode('chat')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition">
            <div className="w-full h-full bg-[#0d1117] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400/30 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                JUGAAD AI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                PRO
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 font-medium tracking-wide">
              A Smart Solution for Every Problem.
            </p>
          </div>
        </div>
      </div>

      {/* Center: Signature JUGAAD MODE switch & Mode chips */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* JUGAAD MODE TOGGLE */}
        <button
          onClick={onToggleJugaad}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            jugaadMode
              ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-amber-500/60 text-amber-300 glow-amber ring-2 ring-amber-500/20 animate-pulse'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
          title="JUGAAD MODE: The Smartest Practical Solution with $0/Low Budget & Fast Workarounds"
        >
          <Zap className={`w-4 h-4 ${jugaadMode ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
          <span className="hidden xs:inline">JUGAAD MODE</span>
          <span className={`w-2 h-2 rounded-full ${jugaadMode ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`}></span>
        </button>

        {/* Quick Nav Chips (visible on tablet and up) */}
        <div className="hidden xl:flex items-center bg-slate-900/90 border border-slate-800/80 rounded-xl p-1 gap-1">
          <button
            onClick={() => onSelectMode('chat')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'chat' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => onSelectMode('deep_research')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'deep_research' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3 h-3 text-cyan-400" />
            <span>Research</span>
          </button>
          <button
            onClick={() => onSelectMode('agent')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'agent' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3 h-3 text-emerald-400" />
            <span>Agent</span>
          </button>
          <button
            onClick={() => onSelectMode('study')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'study' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3 text-indigo-400" />
            <span>Study</span>
          </button>
          <button
            onClick={() => onSelectMode('coding')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'coding' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3 text-violet-400" />
            <span>Code</span>
          </button>
          <button
            onClick={() => onSelectMode('data_analyst')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'data_analyst' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3 h-3 text-rose-400" />
            <span>Data</span>
          </button>
          <button
            onClick={() => onSelectMode('creative')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentMode === 'creative' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3 h-3 text-pink-400" />
            <span>Creative</span>
          </button>
        </div>
      </div>

      {/* Right side: Language, Voice, Creator info, Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as Language)}
            className="appearance-none bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 pr-6 hover:border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            title="Change AI Language"
          >
            <option value="en">English</option>
            <option value="roman_ur">Roman Urdu</option>
            <option value="ur">اردو (Urdu)</option>
            <option value="sd">سنڌي (Sindhi)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
          <Globe2 className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Voice Assistant Toggle */}
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-xl border transition ${
            isVoiceActive
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse glow-cyan'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={isVoiceActive ? 'Voice Assistant Active (Listening)' : 'Start Voice Assistant'}
        >
          {isVoiceActive ? <Mic className="w-4 h-4 text-rose-400" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Creator Credit Badge */}
        <button
          onClick={onOpenAbout}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 text-xs font-medium text-slate-300 hover:text-amber-300 transition"
          title="About Creator: Wajhad Bozdar"
        >
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px]">By Wajhad Bozdar</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          title="Settings & Admin"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
