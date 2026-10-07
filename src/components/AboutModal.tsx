import React from 'react';
import { Zap, X, ShieldCheck, Heart, Award, Sparkles, Compass, Bot } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-lg w-full bg-[#10141e] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Header with Glowing Badge */}
        <div className="p-6 text-center border-b border-slate-800/80 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-3 glow-amber">
            <Zap className="w-8 h-8 fill-amber-400/20" />
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-100">
            JUGAAD AI
          </h2>
          <p className="text-sm font-semibold text-amber-300 mt-1">
            “A Smart Solution for Every Problem.”
          </p>
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Created & Developed by <span className="text-amber-400 font-bold">Wajhad Bozdar</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-[60vh]">
          <p>
            <strong className="text-slate-100">JUGAAD AI</strong> is an intelligent, production-ready AI platform crafted to solve real-world challenges with resourcefulness, agility, and uncompromising engineering.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> The Jugaad Philosophy
            </h4>
            <p className="text-xs text-slate-300">
              «“Give me your problem. I'll find the smartest practical solution.”»
              Whether you are constrained by budget, time, or infrastructure, JUGAAD AI architects clever workarounds, zero-cost stacks, and battle-tested execution roadmaps.
            </p>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <h4 className="font-semibold text-slate-200">Core Capabilities:</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Signature Jugaad Mode (0-Budget & Resource Optimizer)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Deep Research with Multi-Source Grounded Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Autonomous AI Agent with Safety Safeguards</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                <span>Sandboxed Code Execution (JS, TS, Python)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Multilingual & Mixed-Code Intelligence (Urdu, Roman Urdu, Sindhi)</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Official Engineering Release</span>
            <span className="font-mono text-amber-400 font-semibold">v2.5.0 Production</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 text-center">
          <p className="text-xs text-slate-400">
            JUGAAD AI © 2026 <span className="text-amber-400 font-semibold">Wajhad Bozdar</span>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
