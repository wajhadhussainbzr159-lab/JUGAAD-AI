import React, { useRef, useState, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  MicOff, 
  Zap, 
  Globe, 
  Compass, 
  Bot, 
  X, 
  FileText, 
  Loader2 
} from 'lucide-react';
import { AttachedFile } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, images?: Array<{ data: string; mimeType: string }>, files?: AttachedFile[]) => void;
  isLoading: boolean;
  jugaadMode: boolean;
  onToggleJugaad: () => void;
  webSearch: boolean;
  onToggleWebSearch: () => void;
  deepResearch: boolean;
  onToggleDeepResearch: () => void;
  agentMode: boolean;
  onToggleAgentMode: () => void;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  jugaadMode,
  onToggleJugaad,
  webSearch,
  onToggleWebSearch,
  deepResearch,
  onToggleDeepResearch,
  agentMode,
  onToggleAgentMode,
  placeholder = "Ask anything, describe your problem, or request a Jugaad solution..."
}) => {
  const [text, setText] = useState('');
  const [attachedImages, setAttachedImages] = useState<Array<{ data: string; mimeType: string; name: string }>>([]);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  // Speech Recognition
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(prev => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsRecording(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if ((!text.trim() && attachedImages.length === 0 && attachedFiles.length === 0) || isLoading) {
      return;
    }

    const imagesPayload = attachedImages.map(img => ({
      data: img.data,
      mimeType: img.mimeType
    }));

    onSendMessage(text.trim(), imagesPayload, attachedFiles);

    setText('');
    setAttachedImages([]);
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImages(prev => [
          ...prev,
          {
            data: reader.result as string,
            mimeType: file.type,
            name: file.name
          }
        ]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const content = typeof reader.result === 'string' ? reader.result : '';
        setAttachedFiles(prev => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type || 'text/plain',
            content: content
          }
        ]);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 pb-3">
      {/* Container with rounded border and subtle glow */}
      <div className="relative rounded-2xl bg-[#0f1420]/95 border border-slate-800 shadow-2xl backdrop-blur-xl focus-within:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
        {/* Attachment Previews */}
        {(attachedImages.length > 0 || attachedFiles.length > 0) && (
          <div className="flex flex-wrap gap-2 p-3 border-b border-slate-800/80 bg-slate-900/60 rounded-t-2xl">
            {attachedImages.map((img, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-700 w-16 h-16 bg-slate-950">
                <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setAttachedImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200">
                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button
                  onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                  className="p-0.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-500 resize-none focus:outline-none min-h-[44px] max-h-[180px] leading-relaxed"
          />
        </div>

        {/* Bottom Toolbar & Action Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2.5 pt-1 border-t border-slate-800/60">
          {/* Left: Mode toggles */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Jugaad Mode Toggle */}
            <button
              type="button"
              onClick={onToggleJugaad}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                jugaadMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 glow-amber'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Activate Jugaad Mode: Maximum practical & cost-optimized solutions"
            >
              <Zap className={`w-3.5 h-3.5 ${jugaadMode ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
              <span>Jugaad Mode</span>
            </button>

            {/* Web Search Toggle */}
            <button
              type="button"
              onClick={onToggleWebSearch}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                webSearch
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Search the live web with Google Search"
            >
              <Globe className={`w-3.5 h-3.5 ${webSearch ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Web Search</span>
            </button>

            {/* Deep Research Toggle */}
            <button
              type="button"
              onClick={onToggleDeepResearch}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                deepResearch
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Multi-stage Deep Research investigation"
            >
              <Compass className={`w-3.5 h-3.5 ${deepResearch ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Deep Research</span>
            </button>

            {/* Agent Mode Toggle */}
            <button
              type="button"
              onClick={onToggleAgentMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                agentMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Autonomous multi-step agent planner"
            >
              <Bot className={`w-3.5 h-3.5 ${agentMode ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Agent Mode</span>
            </button>
          </div>

          {/* Right: Attachments, Voice, Send */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt,.csv,.json,.xlsx"
              multiple
              className="hidden"
            />

            {/* Attach Image */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Upload images / screenshots for visual analysis"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Attach Document */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Attach documents (PDF, DOC, CSV, TXT)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-xl transition ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Voice input (Speech to Text)'}
            >
              {isRecording ? <Mic className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || (!text.trim() && attachedImages.length === 0 && attachedFiles.length === 0)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition disabled:opacity-40 disabled:hover:from-amber-500 disabled:cursor-not-allowed shadow-md shadow-amber-500/20"
              title="Send message (Enter)"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
