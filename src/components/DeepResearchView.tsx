import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  CheckCircle2, 
  Loader2, 
  Globe, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  Download,
  ArrowRight
} from 'lucide-react';
import { runDeepResearch } from '../lib/api';
import { DeepResearchResult } from '../types';
import { MarkdownView } from './MarkdownView';

interface DeepResearchViewProps {
  onBackToChat: () => void;
}

export const DeepResearchView: React.FC<DeepResearchViewProps> = ({ onBackToChat }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<DeepResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const researchSteps = [
    'Understanding research objective',
    'Decomposing search queries',
    'Searching live web sources',
    'Comparing multiple perspectives',
    'Verifying critical claims',
    'Synthesizing intelligence report'
  ];

  const handleStartResearch = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(0);

    // Animate through progressive steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    try {
      const data = await runDeepResearch(query.trim());
      clearInterval(stepInterval);
      setCurrentStep(5);
      setResult(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Failed to complete deep research.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jugaad_deep_research_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>DEEP RESEARCH ENGINE</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
          Autonomous Web Intelligence
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Multi-source investigation, automated verification, cross-comparison, and structured report synthesis.
        </p>
      </div>

      {/* Query Input Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-xl space-y-4">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Research Topic / Objective
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartResearch()}
              placeholder="e.g. Research the best web development opportunities in Pakistan in 2026 and compare competitors"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>
          <button
            onClick={handleStartResearch}
            disabled={isLoading || !query.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Researching...' : 'Conduct Research'}</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Sample topics:</span>
          {[
            'Pakistani software exports & AI market trends 2026',
            'Best free-tier cloud architectures for zero-cost SaaS',
            'Compare Next.js 15 vs Remix vs Astro performance',
            'High-demand freelance skills in South Asia'
          ].map((pill, i) => (
            <button
              key={i}
              onClick={() => setQuery(pill)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Checklist (Active during research) */}
      {isLoading && (
        <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Deep Research in progress...</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Stage {currentStep + 1} of {researchSteps.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {researchSteps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition ${
                    isDone
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                      : isCurrent
                      ? 'bg-slate-900 border-cyan-500 text-cyan-300 glow-cyan animate-pulse'
                      : 'bg-slate-900/50 border-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
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

      {/* Research Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Investigated Query:</span>
              <p className="text-sm font-semibold text-slate-100">{result.query}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-2xl">
            <MarkdownView content={result.report} />
          </div>

          {/* Sources Section */}
          {result.sources && result.sources.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Referenced Web Sources ({result.sources.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition group"
                  >
                    <span className="truncate pr-2">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
