import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2, 
  Sparkles, 
  Wrench, 
  FileText, 
  Copy, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { runAgentTask } from '../lib/api';
import { MarkdownView } from './MarkdownView';

export const AgentView: React.FC = () => {
  const [taskPrompt, setTaskPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [planSteps, setPlanSteps] = useState<string[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [consequentialActionText, setConsequentialActionText] = useState('');
  const [copied, setCopied] = useState(false);

  const sampleAgentTasks = [
    'Find 10 Pakistani universities offering BS Computer Science, compare their fees and admission requirements, and create a report.',
    'Plan a lean marketing launch for an AI SaaS with zero ad spend using GitHub, Reddit, and LinkedIn outreach.',
    'Audit a React fullstack project architecture for performance bottlenecks, security vulnerabilities, and SEO optimization.'
  ];

  const handleStartAgent = async () => {
    if (!taskPrompt.trim() || isRunning) return;

    // Check if task seems to request consequential actions (e.g., deleting data, sending emails, purchasing)
    const lower = taskPrompt.toLowerCase();
    if (lower.includes('send email') || lower.includes('delete') || lower.includes('buy') || lower.includes('purchase') || lower.includes('transfer')) {
      setConsequentialActionText(`The requested task contains an external action: "${taskPrompt}". JUGAAD AI Agent safety protocol requires your explicit authorization before proceeding with external modifications.`);
      setShowConfirmationModal(true);
      return;
    }

    executeAgentExecution(false);
  };

  const executeAgentExecution = async (confirmed: boolean) => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    // Initial plan breakdown simulation
    setPlanSteps([
      'Deconstructing objectives into discrete milestones',
      'Searching web and official databases for verified data',
      'Executing data cross-referencing and fee normalization',
      'Formulating actionable report and tangible deliverable'
    ]);
    setActiveStepIdx(0);

    const stepTimer = setInterval(() => {
      setActiveStepIdx(prev => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    try {
      const data = await runAgentTask(taskPrompt.trim(), confirmed);
      clearInterval(stepTimer);
      setActiveStepIdx(3);
      setResult(data.result);
    } catch (err: any) {
      clearInterval(stepTimer);
      setError(err.message || 'Agent failed to complete execution.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleConfirmAction = () => {
    setShowConfirmationModal(false);
    executeAgentExecution(true);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>AUTONOMOUS AGENT RUNNER</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
          Multi-Step Task Execution
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Assign complex, multi-stage goals. JUGAAD AI autonomous agent creates an execution plan, orchestrates tools, handles error recovery, and delivers final outcomes.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-xl space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Task Description & Multi-Step Instructions
        </label>
        <textarea
          rows={3}
          value={taskPrompt}
          onChange={(e) => setTaskPrompt(e.target.value)}
          placeholder="e.g. Find 10 Pakistani universities offering BS Computer Science, compare their fees and admission requirements, and create a report."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-500">Presets:</span>
            {sampleAgentTasks.map((t, i) => (
              <button
                key={i}
                onClick={() => setTaskPrompt(t)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/30 transition truncate max-w-[220px]"
                title={t}
              >
                Task {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleStartAgent}
            disabled={isRunning || !taskPrompt.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Agent Executing...' : 'Launch Agent'}</span>
          </button>
        </div>
      </div>

      {/* Safety Gate Confirmation Dialog */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121824] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-100">User Confirmation Required</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {consequentialActionText}
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
              JUGAAD AI Agent enforces strict safety boundaries and never triggers consequential external actions without explicit user approval.
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel Task
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Agent Steps */}
      {isRunning && (
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Agent is executing instructions...</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              Phase {activeStepIdx + 1} of {planSteps.length}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {planSteps.map((step, idx) => {
              const isDone = idx < activeStepIdx;
              const isCurrent = idx === activeStepIdx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : isCurrent
                      ? 'bg-slate-900 border-emerald-500 text-emerald-300 glow-cyan animate-pulse'
                      : 'bg-slate-900/50 border-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="text-xs font-medium">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Final Outcome */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">Autonomous Task Complete</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Deliverable'}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-2xl">
            <MarkdownView content={result} />
          </div>
        </div>
      )}
    </div>
  );
};
