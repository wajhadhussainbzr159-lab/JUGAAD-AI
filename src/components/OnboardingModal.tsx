import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Check, 
  Globe2, 
  Sparkles, 
  Brain, 
  Code, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  X 
} from 'lucide-react';
import { Language, Personality } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (prefs: {
    language: Language;
    personality: Personality;
    memoryEnabled: boolean;
  }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences
}) => {
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [primaryGoal, setPrimaryGoal] = useState('jugaad');
  const [memoryOptIn, setMemoryOptIn] = useState(true);

  if (!isOpen) return null;

  const handleFinish = () => {
    let chosenPersonality: Personality = 'jugaad_master';
    if (primaryGoal === 'coding') chosenPersonality = 'coding_expert';
    if (primaryGoal === 'study') chosenPersonality = 'teacher';
    if (primaryGoal === 'research') chosenPersonality = 'researcher';
    if (primaryGoal === 'business') chosenPersonality = 'business_advisor';

    onSavePreferences({
      language: selectedLanguage,
      personality: chosenPersonality,
      memoryEnabled: memoryOptIn
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-xl w-full bg-[#10141e] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
        {/* Progress header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Welcome to JUGAAD AI</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 3 • Quick Personalization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Skip
          </button>
        </div>

        {/* Step content */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-slate-100">Select Your Preferred Language</h4>
                <p className="text-xs text-slate-400">JUGAAD AI understands and seamlessly responds in multiple regional tongues.</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { id: 'en', label: 'English', sub: 'Global Standard' },
                  { id: 'roman_ur', label: 'Roman Urdu', sub: 'Aasan Baat Cheet' },
                  { id: 'ur', label: 'اردو', sub: 'Urdu Script' },
                  { id: 'sd', label: 'سنڌي', sub: 'Sindhi Script' },
                  { id: 'hi', label: 'हिन्दी', sub: 'Hindi / Hinglish' },
                  { id: 'ar', label: 'العربية', sub: 'Arabic Language' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedLanguage(item.id as Language)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedLanguage === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-slate-100">What is Your Primary Goal?</h4>
                <p className="text-xs text-slate-400">We will configure the AI's core reasoning style to match your workflow.</p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { id: 'jugaad', title: 'Jugaad & Problem Solving (Recommended)', desc: 'Zero-budget workarounds, rapid execution, cost and resource optimization.' },
                  { id: 'coding', title: 'Software Development & Architecture', desc: 'Fullstack coding, debugging, refactoring, and sandbox testing.' },
                  { id: 'study', title: 'Study & Exam Preparation', desc: 'Concept mastery, flashcards, interactive quizzes, and summaries.' },
                  { id: 'business', title: 'Startups & Business Strategy', desc: 'Market research, unit economics, lean launching, and growth.' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPrimaryGoal(item.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition ${
                      primaryGoal === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-slate-100">Memory & The Jugaad Guarantee</h4>
                <p className="text-xs text-slate-400">Finalize your experience before starting.</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>Meet JUGAAD MODE</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Whenever you need to solve an issue with limited money, limited time, or limited tools, toggle <strong>JUGAAD MODE</strong>. It finds the smartest practical shortcut.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="pr-4">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-amber-400" />
                    <span>Enable Personal AI Memory</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Remember your non-sensitive preferences across sessions. You can edit or purge memories anytime.
                  </p>
                </div>
                <button
                  onClick={() => setMemoryOptIn(!memoryOptIn)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    memoryOptIn ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      memoryOptIn ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition shadow-lg shadow-amber-500/30"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch JUGAAD AI</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
