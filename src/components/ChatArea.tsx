import React, { useRef, useEffect, useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Globe, 
  Compass, 
  Bot, 
  FileText, 
  ArrowRight,
  Code,
  BookOpen,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  RotateCw
} from 'lucide-react';
import { Message, Source, AttachedFile } from '../types';
import { MarkdownView } from './MarkdownView';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSelectPrompt: (prompt: string, jugaadMode?: boolean) => void;
  onRegenerate?: () => void;
  onExplainCode?: (code: string) => void;
  onOptimizeCode?: (code: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSelectPrompt,
  onRegenerate,
  onExplainCode,
  onOptimizeCode
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown hashes/backticks for voice
    const cleanText = text.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 ? (
        <div className="max-w-3xl mx-auto py-8 sm:py-14 text-center">
          {/* Logo Badge */}
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/30 mb-5 glow-amber animate-bounce-subtle">
            <Zap className="w-10 h-10 text-amber-400 fill-amber-400/20" />
          </div>

          {/* Heading and Brand Tagline */}
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight mb-2">
            JUGAAD AI
          </h1>
          <p className="text-base sm:text-xl font-medium text-amber-300/90 tracking-wide mb-2">
            “A Smart Solution for Every Problem.”
          </p>
          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-widest uppercase mb-10">
            Crafted by <span className="text-slate-200 font-semibold">Wajhad Bozdar</span>
          </p>

          {/* Quick Start Prompt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
            {/* Jugaad Mode Prompt */}
            <div
              onClick={() => onSelectPrompt("I need to build and host a modern web app, but I have $0 budget. Give me the smartest practical Jugaad plan.", true)}
              className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Zap className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-amber-400/90 bg-amber-400/10 px-1.5 py-0.5 rounded font-bold">
                  JUGAAD MODE
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition">
                Zero-Budget Web Launch
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                "Build & host a modern fullstack web app with $0 budget using free tiers and workarounds."
              </p>
            </div>

            {/* Deep Research Prompt */}
            <div
              onClick={() => onSelectPrompt("Research the top web development and AI opportunities in Pakistan in 2026, comparing top competitors and salaries.")}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                  RESEARCH
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                Deep Market Intelligence
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                "Research tech opportunities in Pakistan for 2026 with verified web citations and data."
              </p>
            </div>

            {/* Coding Assistant */}
            <div
              onClick={() => onSelectPrompt("Write a TypeScript Express API route with JWT authentication, rate limiting, and input validation. Make it runnable.")}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                  <Code className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-violet-400/90 bg-violet-400/10 px-1.5 py-0.5 rounded">
                  CODING
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-violet-300 transition">
                Secure Express API
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                "Generate production-ready TypeScript backend code with sandboxed execution."
              </p>
            </div>

            {/* Study Mode Prompt */}
            <div
              onClick={() => onSelectPrompt("Explain Quantum Computing and Qubits in simple terms with everyday analogies, followed by 3 quiz questions.")}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-indigo-400/90 bg-indigo-400/10 px-1.5 py-0.5 rounded">
                  STUDY
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition">
                Interactive Study Mentor
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                "Explain Quantum Computing simply with analogies, flashcards, and a quick quiz."
              </p>
            </div>

            {/* Autonomous Agent Prompt */}
            <div
              onClick={() => onSelectPrompt("Find 10 Pakistani universities offering BS Computer Science, compare their fees and admission requirements, and create a report.")}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Bot className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  AGENT
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-emerald-300 transition">
                University Comparison Agent
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                "Autonomous task planner: compare BS CS universities, admission criteria, and costs."
              </p>
            </div>

            {/* Multilingual / Roman Urdu Prompt */}
            <div
              onClick={() => onSelectPrompt("Mujhe ek startup shuru karni hai kam paise mein. Best strategy kya hogi?")}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-rose-400/90 bg-rose-400/10 px-1.5 py-0.5 rounded">
                  ROMAN URDU
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-rose-300 transition">
                Roman Urdu & Multilingual
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                "Mujhe ek startup shuru karni hai kam paise mein. Best Jugaad aur free tools batayein."
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Conversation Message Feed */
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-2 mb-1.5 px-1">
                {msg.role === 'user' ? (
                  <span className="text-[11px] font-medium text-slate-400">You</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-[12px] font-bold text-amber-300">JUGAAD AI</span>
                    {msg.jugaadMode && (
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        JUGAAD MODE
                      </span>
                    )}
                  </div>
                )}
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>

              {/* Message Content Bubble */}
              <div
                className={`rounded-2xl px-4 py-3.5 max-w-full sm:max-w-[90%] shadow-md leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-600/20 border border-amber-500/30 text-slate-100'
                    : 'bg-[#0f1420] border border-slate-800 text-slate-200 w-full'
                }`}
              >
                {/* User Attachments Preview */}
                {msg.images && msg.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {msg.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.data.startsWith('data:') ? img.data : `data:${img.mimeType};base64,${img.data}`}
                        alt="Uploaded context"
                        className="max-h-48 rounded-lg border border-slate-700 object-cover shadow"
                      />
                    ))}
                  </div>
                )}

                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {msg.files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-xs text-slate-300"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>{f.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Assistant Tool Activity Indicator */}
                {msg.toolActivity && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{msg.toolActivity}</span>
                  </div>
                )}

                {/* Markdown Text */}
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{msg.content}</p>
                ) : (
                  <MarkdownView
                    content={msg.content}
                    onExplainCode={onExplainCode}
                    onOptimizeCode={onOptimizeCode}
                  />
                )}

                {/* Live Grounding Web Citations / Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-400">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Web Sources & Verified Citations ({msg.sources.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition group"
                        >
                          <span className="w-4 h-4 rounded bg-cyan-950/80 text-cyan-400 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <div className="truncate flex-1">
                            <p className="font-medium truncate">{src.title}</p>
                            <p className="text-[10px] text-slate-500 truncate">{src.uri}</p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Controls for Assistant Messages */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-800/60 text-slate-400 text-xs">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition"
                      title={speakingId === msg.id ? "Stop voice reading" : "Read response aloud"}
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {onRegenerate && msg.id === messages[messages.length - 1]?.id && (
                      <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition"
                        title="Regenerate response"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="flex items-center gap-0.5 ml-auto text-slate-500">
                      <button className="p-1 hover:text-slate-300" title="Good response">
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:text-slate-300" title="Poor response">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1 px-1">
                <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Zap className="w-3 h-3 text-amber-400 animate-spin" />
                </div>
                <span className="text-[12px] font-bold text-amber-300">JUGAAD AI</span>
                <span className="text-[10px] text-slate-400 animate-pulse">is thinking...</span>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#0f1420] border border-slate-800 text-slate-400 text-sm flex items-center gap-2">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Synthesizing smart practical solution...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      )}
    </div>
  );
};
