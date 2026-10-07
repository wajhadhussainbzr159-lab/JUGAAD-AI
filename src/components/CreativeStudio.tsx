import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Youtube, 
  Compass, 
  Copy, 
  Check, 
  Loader2, 
  Image as ImageIcon,
  Wand2,
  Share2
} from 'lucide-react';
import { generateCreativeAsset } from '../lib/api';
import { MarkdownView } from './MarkdownView';

export const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'branding' | 'youtube'>('visual');
  const [prompt, setPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState('Cyberpunk Futuristic');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const styleOptions = [
    'Cyberpunk Futuristic',
    'Minimalist Modern Vector',
    'Dark Mode Neon Glassmorphism',
    'Cinematic 3D Isometric',
    'Vintage Retro Sci-Fi'
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);

    try {
      const data = await generateCreativeAsset(activeTab, prompt.trim(), stylePreset);
      setResult(data.output);
    } catch (err: any) {
      console.error('Creative generation error:', err);
    } finally {
      setIsLoading(false);
    }
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>CREATIVE & VISUAL STUDIO</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-100">
          Design, Branding & Media Studio
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Craft brand identities, YouTube viral content packages, and generative aesthetic designs in seconds.
        </p>
      </div>

      {/* Tabs & Controls Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0f1420] border border-slate-800 shadow-xl space-y-5">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => { setActiveTab('visual'); setResult(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'visual'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Visual & Art Concepts</span>
          </button>

          <button
            onClick={() => { setActiveTab('branding'); setResult(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'branding'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Brand Identity & Colors</span>
          </button>

          <button
            onClick={() => { setActiveTab('youtube'); setResult(null); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'youtube'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Viral Studio</span>
          </button>
        </div>

        {/* Input prompt */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {activeTab === 'visual' && 'Describe the Visual Scene or Art Piece'}
            {activeTab === 'branding' && 'Describe Your Startup, Product, or Brand Vision'}
            {activeTab === 'youtube' && 'Describe Your Video Idea or Topic'}
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              activeTab === 'visual'
                ? "e.g. Glowing neon cybernetic falcon perched atop an amber skyscraper in high rain, volumetric lighting"
                : activeTab === 'branding'
                ? "e.g. JUGAAD AI — A smart, affordable AI platform helping students and solo founders solve tech problems"
                : "e.g. How I Built a Fullstack AI Startup with $0 and 1 Laptop in 30 Days"
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-500/60 leading-relaxed"
          />
        </div>

        {/* Style Presets & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {activeTab === 'visual' ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400">Style:</span>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-pink-500/40"
              >
                {styleOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ) : <div />}

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/20 disabled:opacity-40 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Creating Magic...' : 'Generate Assets'}</span>
          </button>
        </div>
      </div>

      {/* Output Presentation */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-pink-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generated Creative Deliverable</span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
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
