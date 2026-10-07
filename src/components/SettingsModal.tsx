import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  X, 
  Sliders, 
  UserCheck, 
  Volume2, 
  Activity, 
  Shield, 
  Cpu, 
  CheckCircle2, 
  Zap, 
  Save 
} from 'lucide-react';
import { Settings, Personality, Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'voice' | 'admin'>('ai');
  const [personality, setPersonality] = useState<Personality>(settings.personality);
  const [language, setLanguage] = useState<Language>(settings.language);
  const [customInstructions, setCustomInstructions] = useState(settings.customInstructions || '');
  const [temperature, setTemperature] = useState(settings.temperature || 0.7);
  const [voiceSpeed, setVoiceSpeed] = useState(settings.voiceSpeed || 1.0);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateSettings({
        personality,
        language,
        customInstructions,
        temperature,
        voiceSpeed
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const personalityList: Array<{ id: Personality; title: string; desc: string }> = [
    { id: 'jugaad_master', title: 'Jugaad Master (Default)', desc: 'Resourceful, witty, $0 budget & time-optimized workarounds.' },
    { id: 'coding_expert', title: 'Principal Software Architect', desc: 'Clean architecture, secure code, and optimal algorithms.' },
    { id: 'teacher', title: 'Dedicated Master Tutor', desc: 'Patient, intuitive analogies, step-by-step guidance.' },
    { id: 'researcher', title: 'Investigative Researcher', desc: 'Rigorous, evidence-backed, multi-source validation.' },
    { id: 'business_advisor', title: 'Pragmatic Venture Strategist', desc: 'Lean startup economics, ROI, and growth playbooks.' },
    { id: 'creative', title: 'Creative Studio Lead', desc: 'Bold, imaginative, and design-forward conceptualization.' }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-2xl w-full bg-[#10141e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <SettingsIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Platform Settings</h2>
              <p className="text-xs text-slate-400">Configure AI personality, voice, custom instructions, and metrics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/30 px-4 sm:px-6 gap-4">
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'ai' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>AI Personality & Logic</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`py-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'voice' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice & Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'admin' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin & Telemetry</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'ai' && (
            <div className="space-y-5">
              {/* Personality Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  AI Personality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {personalityList.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        personality === p.id
                          ? 'bg-amber-500/15 border-amber-500 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-xs flex items-center justify-between">
                        <span>{p.title}</span>
                        {personality === p.id && <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Creativity / Temperature</span>
                  <span className="font-mono text-amber-400 font-bold">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Precise & Deterministic (0.1)</span>
                  <span>Creative & Expansive (1.0)</span>
                </div>
              </div>

              {/* Custom Instructions */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Custom User Instructions
                </label>
                <textarea
                  rows={3}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Always answer me in simple Roman Urdu and format code in TypeScript."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Speech Playback Rate</span>
                  <span className="font-mono text-amber-400 font-bold">{voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.5x (Slow)</span>
                  <span>1.0x (Normal)</span>
                  <span>2.0x (Fast)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-slate-200">Voice Synthesis & Multimodal Audio</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  JUGAAD AI utilizes native high-definition speech recognition and browser speech synthesis with multilingual pronunciation support.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-5">
              {/* Telemetry KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">System Health</span>
                  <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% OK
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Active Model</span>
                  <p className="text-sm font-bold text-amber-300 mt-1">Gemini 3.8 Flash</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Response Mode</span>
                  <p className="text-sm font-bold text-cyan-400 mt-1">Live Stream (SSE)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Server Year</span>
                  <p className="text-sm font-bold text-slate-200 mt-1">2026</p>
                </div>
              </div>

              {/* Tools Execution Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-200">Operational Tool Registry</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Google Search Live Grounding</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Code Execution Sandbox</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Personal AI Memory Store</span>
                    <span className="text-emerald-400 font-mono">PERSISTENT</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-300">Autonomous Agent Controller</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-500">
                JUGAAD AI Master Admin Dashboard • Created & Maintained by <span className="text-slate-300 font-semibold">Wajhad Bozdar</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
