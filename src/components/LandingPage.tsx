import React from 'react';
import { 
  Zap, 
  Compass, 
  Code, 
  BookOpen, 
  BarChart3, 
  Palette, 
  Bot, 
  FileText, 
  Mic, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Globe2
} from 'lucide-react';
import { AppMode } from '../types';

interface LandingPageProps {
  onStartApp: (mode?: AppMode) => void;
  onOpenAbout: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartApp, onOpenAbout }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-[#080a0f] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[140px] -z-10 pointer-events-none rounded-full" />

        {/* Creator tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-lg shadow-amber-500/10">
          <Zap className="w-3.5 h-3.5 fill-amber-400" />
          <span>Crafted by Wajhad Bozdar</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-4">
          JUGAAD AI
        </h1>

        <p className="font-heading font-extrabold text-xl sm:text-3xl bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent mb-6">
          “A Smart Solution for Every Problem.”
        </p>

        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 leading-relaxed mb-10">
          An intelligent personal AI assistant that can understand, research, create, analyze, remember, and help you get things done. Designed with resourcefulness at its core.
        </p>

        {/* Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onStartApp('chat')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02]"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>Start Using JUGAAD AI</span>
            <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('features-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-sm sm:text-base transition"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Signature Feature Spotlight: JUGAAD MODE */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto my-12">
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#171e2e] via-[#0f1422] to-[#0a0d16] border border-amber-500/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap className="w-64 h-64 text-amber-400" />
          </div>

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              SIGNATURE CAPABILITY
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
              JUGAAD MODE
            </h2>
            <p className="text-base sm:text-lg text-amber-300 font-semibold italic">
              «“Give me your problem. I'll find the smartest practical solution.”»
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When resources are tight, time is limited, and budgets are zero, JUGAAD MODE shines. It cuts through fluff to design clever free-tier architectures, low-cost workarounds, and step-by-step execution roadmaps.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3">
              {[
                'Zero-Budget Stack',
                'Time Optimization',
                'Practical Workarounds',
                'Step-by-Step Plans',
                'Resource Multipliers',
                'Local & Cloud Hacks'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onStartApp('jugaad')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
              >
                <span>Try Jugaad Mode Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Key Features */}
      <section id="features-section" className="px-4 sm:px-6 max-w-6xl mx-auto py-16 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
            A Complete AI Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            More than a simple chat assistant. JUGAAD AI brings research, coding, academics, data, and autonomous execution into one unified workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Deep Research */}
          <div 
            onClick={() => onStartApp('deep_research')}
            className="p-6 rounded-2xl bg-[#0f1420] border border-slate-800 hover:border-cyan-500/40 hover:bg-[#121826] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition">
              Deep Research Mode
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Autonomous multi-angle search, conflict detection, claim verification, and structured intelligence reports with live web citations.
            </p>
          </div>

          {/* Autonomous Agent */}
          <div 
            onClick={() => onStartApp('agent')}
            className="p-6 rounded-2xl bg-[#0f1420] border border-slate-800 hover:border-emerald-500/40 hover:bg-[#121826] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition">
              Autonomous AI Agent
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Assign multi-stage directives. JUGAAD AI crafts an action plan, runs tools, checks safeguards, and delivers tangible results.
            </p>
          </div>

          {/* Coding Assistant */}
          <div 
            onClick={() => onStartApp('coding')}
            className="p-6 rounded-2xl bg-[#0f1420] border border-slate-800 hover:border-violet-500/40 hover:bg-[#121826] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-violet-300 transition">
              Coding Assistant & Sandbox
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generate, refactor, optimize, and safely execute JavaScript, TypeScript, and Python snippets with syntax highlighting and instant execution output.
            </p>
          </div>

          {/* Study Assistant */}
          <div 
            onClick={() => onStartApp('study')}
            className="p-6 rounded-2xl bg-[#0f1420] border border-slate-800 hover:border-indigo-500/40 hover:bg-[#121826] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition">
              Study Studio & Quiz
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Personalized AI tutor with tailored difficulty levels (Beginner, Intermediate, Advanced), interactive 3D flashcards, and MCQ exams with scoring.
            </p>
          </div>

          {/* Data Analyst */}
          <div 
            onClick={() => onStartApp('data_analyst')}
            className="p-6 rounded-2xl bg-[#0f1420] border border-slate-800 hover:border-rose-500/40 hover:bg-[#121826] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-rose-300 transition">
              Data Analyst & Metrics
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Upload spreadsheets and CSVs for column extraction, trend discovery, anomaly detection, interactive SVG charts, and business recommendations.
            </p>
          </div>

          {/* Creative Studio */}
          <div 
            onClick={() => onStartApp('creative')}
            className="p-6 rounded-2xl bg-[#0f1420] border border-slate-800 hover:border-pink-500/40 hover:bg-[#121826] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mb-4">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100 group-hover:text-pink-300 transition">
              Creative Studio
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Generate aesthetic visual art concepts, startup brand identities with HEX palettes, and viral YouTube title/thumbnail/script packages.
            </p>
          </div>
        </div>
      </section>

      {/* Multilingual & Vision Section */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
              <Globe2 className="w-4 h-4" />
              <span>Native Multilingual Intelligence</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Understands complex code-switching and mixed queries naturally. Chat effortlessly in English, Roman Urdu (e.g. <em>"Mujhe ek website banani hai kam budget mein"</em>), Urdu (اردو), Sindhi (سنڌي), Hindi, and Arabic.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Privacy-Centric Personal Memory</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              JUGAAD AI remembers your productive preferences when you opt in. Easily view, edit, toggle, or purge your memory record with zero sensitive tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Creator Accreditation Section */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto py-16 text-center space-y-4 border-t border-slate-800/80">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-2 glow-amber">
          <Zap className="w-8 h-8 fill-amber-400/20" />
        </div>
        <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-100">
          Created & Developed by Wajhad Bozdar
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Built with an uncompromising vision: to democratize world-class artificial intelligence with the agility, speed, and real-world practical genius of the Jugaad mindset.
        </p>

        <div className="pt-4">
          <button
            onClick={() => onStartApp('chat')}
            className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20"
          >
            Experience JUGAAD AI
          </button>
        </div>
      </section>

      {/* Mandatory Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">
          JUGAAD AI © 2026 <span className="text-amber-400 font-bold">Wajhad Bozdar</span>. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-600 mt-1">
          “A Smart Solution for Every Problem.”
        </p>
      </footer>
    </div>
  );
};
