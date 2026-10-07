import React, { useState } from 'react';
import { Copy, Check, Play, Loader2, Sparkles, Wand2, Terminal } from 'lucide-react';
import { executeCode } from '../lib/api';

interface CodeBlockProps {
  code: string;
  language: string;
  onExplain?: (code: string) => void;
  onOptimize?: (code: string) => void;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  onExplain,
  onOptimize
}) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const normalizedLang = (language || 'javascript').toLowerCase();
  const isHtml = normalizedLang === 'html' || normalizedLang === 'svg';
  const isRunnable = ['javascript', 'js', 'typescript', 'ts', 'python', 'py'].includes(normalizedLang) || isHtml;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    if (isHtml) {
      setActiveTab('preview');
      return;
    }

    setIsRunning(true);
    setOutput(null);
    setError(null);
    setShowConsole(true);

    try {
      const res = await executeCode(code, normalizedLang);
      if (res.success) {
        setOutput(res.output || 'Program ran successfully (0 exit status).');
        setExecutionTime(res.executionTime);
      } else {
        setError(res.error || 'Execution encountered an error.');
        setExecutionTime(res.executionTime);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to execution sandbox.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-lg text-xs md:text-sm">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider">
            {normalizedLang}
          </span>
          {isHtml && (
            <div className="flex bg-slate-900 rounded-lg p-0.5 ml-2 border border-slate-700/50">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  activeTab === 'code' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Source
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  activeTab === 'preview' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Preview
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onExplain && (
            <button
              onClick={() => onExplain(code)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition text-xs"
              title="Explain this code"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Explain</span>
            </button>
          )}

          {onOptimize && (
            <button
              onClick={() => onOptimize(code)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition text-xs"
              title="Optimize for performance & memory"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Optimize</span>
            </button>
          )}

          {isRunnable && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition text-xs font-medium disabled:opacity-50"
              title="Execute in isolated sandbox"
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isHtml ? 'Preview' : 'Run Sandbox'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Body or HTML Preview */}
      {isHtml && activeTab === 'preview' ? (
        <div className="p-3 bg-white min-h-[160px] rounded-b-xl">
          <iframe
            srcDoc={code}
            title="Preview"
            sandbox="allow-scripts"
            className="w-full min-h-[220px] border-0"
          />
        </div>
      ) : (
        <div className="p-4 overflow-x-auto max-h-[500px]">
          <pre className="font-mono text-slate-200 leading-relaxed whitespace-pre font-normal">
            <code>{code}</code>
          </pre>
        </div>
      )}

      {/* Execution Console Output Drawer */}
      {showConsole && (output !== null || error !== null) && (
        <div className="border-t border-slate-800 bg-[#090d14] p-3">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-medium text-slate-300">Sandbox Terminal</span>
              {executionTime && (
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">
                  {executionTime}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowConsole(false)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              Close
            </button>
          </div>

          {error ? (
            <pre className="font-mono text-xs text-red-400 whitespace-pre-wrap bg-red-950/20 p-2 rounded border border-red-900/40">
              {error}
            </pre>
          ) : (
            <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap bg-emerald-950/20 p-2 rounded border border-emerald-900/40">
              {output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
