/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { DeepResearchView } from './components/DeepResearchView';
import { AgentView } from './components/AgentView';
import { StudyStudio } from './components/StudyStudio';
import { DataAnalystView } from './components/DataAnalystView';
import { CreativeStudio } from './components/CreativeStudio';
import { MemoryManager } from './components/MemoryManager';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LandingPage } from './components/LandingPage';
import { 
  AppMode, 
  ChatSession, 
  Message, 
  Memory, 
  Project, 
  Settings, 
  Language, 
  AttachedFile 
} from './types';
import { 
  streamChat, 
  getMemories, 
  addMemory, 
  deleteMemory, 
  clearAllMemories,
  getProjects,
  createProject,
  deleteProject,
  getSettings,
  updateSettings,
  checkServerHealth
} from './lib/api';

const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  personality: 'jugaad_master',
  customInstructions: '',
  memoryEnabled: true,
  temperature: 0.7,
  theme: 'dark',
  voiceSpeed: 1.0,
  voiceName: 'Default'
};

export default function App() {
  // Navigation & View mode
  const [currentMode, setCurrentMode] = useState<AppMode>('chat');
  const [jugaadMode, setJugaadMode] = useState<boolean>(true);
  const [webSearch, setWebSearch] = useState<boolean>(false);
  const [deepResearch, setDeepResearch] = useState<boolean>(false);
  const [agentMode, setAgentMode] = useState<boolean>(false);

  // App UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMemoriesOpen, setIsMemoriesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Chat Data
  const [chats, setChats] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('jugaad_chats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Memories & Projects
  const [memories, setMemories] = useState<Memory[]>([]);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Initial load
  useEffect(() => {
    // Check first visit for onboarding
    const hasVisited = localStorage.getItem('jugaad_onboarding_done');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
    }

    // Load memories, projects, and settings from server
    getMemories().then(data => {
      if (data && data.memories) {
        setMemories(data.memories);
        setMemoryEnabled(data.memoryEnabled);
      }
    }).catch(() => {});

    getProjects().then(projs => {
      if (projs) setProjects(projs);
    }).catch(() => {});

    getSettings().then(st => {
      if (st) setSettings(st);
    }).catch(() => {});

    checkServerHealth();
  }, []);

  // Sync chats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jugaad_chats', JSON.stringify(chats));
    } catch (e) {}
  }, [chats]);

  // Handle active chat selection
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    const found = chats.find(c => c.id === id);
    if (found) {
      setMessages(found.messages || []);
      setCurrentMode(found.mode || 'chat');
      setActiveProjectId(found.projectId || null);
    }
  };

  // Create New Chat
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setCurrentMode('chat');
  };

  // Delete Chat
  const handleDeleteChat = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages([]);
    }
  };

  // Pin Chat
  const handleTogglePinChat = (id: string) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  // Send Message
  const handleSendMessage = async (
    text: string,
    images: Array<{ data: string; mimeType: string }> = [],
    files: AttachedFile[] = []
  ) => {
    if (!text.trim() && images.length === 0 && files.length === 0) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      images,
      files,
      jugaadMode
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Placeholder assistant message for streaming
    const assistantMsgId = `asst-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolActivity: jugaadMode 
        ? '⚡ Formulating smartest practical Jugaad solution...' 
        : webSearch 
        ? '🌐 Querying live web sources via Google Search...' 
        : undefined,
      jugaadMode
    };

    setMessages([...newMessages, assistantMsg]);

    let accumulatedContent = '';

    await streamChat({
      messages: newMessages,
      jugaadMode,
      webSearch,
      deepResearch,
      agentMode,
      personality: settings.personality,
      language: settings.language,
      customInstructions: settings.customInstructions,
      projectId: activeProjectId,
      images,
      files: files.map(f => ({ name: f.name, type: f.type, content: f.content })),
      onChunk: (chunk: string) => {
        accumulatedContent += chunk;
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedContent, toolActivity: undefined } : m));
      },
      onSources: (sources) => {
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, sources } : m));
      },
      onError: (err) => {
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: `I encountered an issue: ${err}. Please try again.` } : m));
        setIsLoading(false);
      },
      onDone: () => {
        setIsLoading(false);

        // Update or create chat session
        const updatedChatList = [...chats];
        const currentTitle = text.length > 30 ? text.substring(0, 30) + '...' : text || 'Multimodal Query';

        if (activeChatId) {
          const idx = updatedChatList.findIndex(c => c.id === activeChatId);
          if (idx !== -1) {
            updatedChatList[idx] = {
              ...updatedChatList[idx],
              messages: [...newMessages, { ...assistantMsg, content: accumulatedContent, toolActivity: undefined }],
              updatedAt: new Date().toISOString()
            };
            setChats(updatedChatList);
          }
        } else {
          const newChatId = `chat-${Date.now()}`;
          const newSession: ChatSession = {
            id: newChatId,
            title: currentTitle,
            projectId: activeProjectId,
            mode: currentMode,
            pinned: false,
            messages: [...newMessages, { ...assistantMsg, content: accumulatedContent, toolActivity: undefined }],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setChats([newSession, ...updatedChatList]);
          setActiveChatId(newChatId);
        }
      }
    });
  };

  // Quick prompt select from empty state
  const handleSelectPrompt = (promptText: string, isJugaad = false) => {
    if (isJugaad) setJugaadMode(true);
    handleSendMessage(promptText);
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, lastUserMessage.images, lastUserMessage.files);
    }
  };

  // Explain code helper
  const handleExplainCode = (code: string) => {
    handleSendMessage(`Explain this code step-by-step and highlight key patterns:\n\`\`\`\n${code}\n\`\`\``);
  };

  // Optimize code helper
  const handleOptimizeCode = (code: string) => {
    handleSendMessage(`Optimize this code for execution speed, readability, and edge-case handling:\n\`\`\`\n${code}\n\`\`\``);
  };

  // Voice Assistant toggle
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = settings.language === 'ur' ? 'ur-PK' : 'en-US';
      recognition.onstart = () => setIsVoiceActive(true);
      recognition.onend = () => setIsVoiceActive(false);
      recognition.onerror = () => setIsVoiceActive(false);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          handleSendMessage(transcript);
        }
      };
      recognition.start();
    } catch (e) {
      setIsVoiceActive(false);
    }
  };

  // Memories handlers
  const handleAddMemory = async (content: string, category = 'preference') => {
    const mem = await addMemory(content, category);
    if (mem) setMemories(prev => [mem, ...prev]);
  };

  const handleDeleteMemory = async (id: string) => {
    await deleteMemory(id);
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const handleClearAllMemories = async () => {
    await clearAllMemories();
    setMemories([]);
  };

  const handleToggleMemoryEnabled = async (enabled: boolean) => {
    setMemoryEnabled(enabled);
    await updateSettings({ memoryEnabled: enabled });
  };

  // Project handlers
  const handleCreateProject = async () => {
    const title = prompt('Enter workspace project title:');
    if (!title) return;
    const proj = await createProject(title);
    if (proj) {
      setProjects(prev => [proj, ...prev]);
      setActiveProjectId(proj.id);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080a0f] text-slate-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          if (mode === 'jugaad') setJugaadMode(true);
        }}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onTogglePinChat={handleTogglePinChat}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        onCreateProject={handleCreateProject}
        onOpenMemories={() => setIsMemoriesOpen(true)}
        onOpenLanding={() => setCurrentMode('landing')}
        memoryCount={memories.length}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentMode={currentMode}
          onSelectMode={(mode) => {
            setCurrentMode(mode);
            if (mode === 'jugaad') setJugaadMode(true);
          }}
          jugaadMode={jugaadMode}
          onToggleJugaad={() => setJugaadMode(!jugaadMode)}
          language={settings.language}
          onChangeLanguage={async (lang: Language) => {
            setSettings(prev => ({ ...prev, language: lang }));
            await updateSettings({ language: lang });
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          isVoiceActive={isVoiceActive}
          onToggleVoice={handleToggleVoice}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Main Body based on Mode */}
        {currentMode === 'landing' ? (
          <LandingPage
            onStartApp={(mode = 'chat') => {
              setCurrentMode(mode);
              if (mode === 'jugaad') setJugaadMode(true);
            }}
            onOpenAbout={() => setIsAboutOpen(true)}
          />
        ) : currentMode === 'deep_research' ? (
          <DeepResearchView onBackToChat={() => setCurrentMode('chat')} />
        ) : currentMode === 'agent' ? (
          <AgentView />
        ) : currentMode === 'study' ? (
          <StudyStudio />
        ) : currentMode === 'data_analyst' ? (
          <DataAnalystView />
        ) : currentMode === 'creative' ? (
          <CreativeStudio />
        ) : (
          /* Chat & Jugaad Mode View */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onSelectPrompt={handleSelectPrompt}
              onRegenerate={handleRegenerate}
              onExplainCode={handleExplainCode}
              onOptimizeCode={handleOptimizeCode}
            />

            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              jugaadMode={jugaadMode}
              onToggleJugaad={() => setJugaadMode(!jugaadMode)}
              webSearch={webSearch}
              onToggleWebSearch={() => setWebSearch(!webSearch)}
              deepResearch={deepResearch}
              onToggleDeepResearch={() => setDeepResearch(!deepResearch)}
              agentMode={agentMode}
              onToggleAgentMode={() => setAgentMode(!agentMode)}
              placeholder={
                jugaadMode
                  ? "Describe your problem: limited budget, limited time, or practical alternative needed..."
                  : "Message JUGAAD AI..."
              }
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <MemoryManager
        isOpen={isMemoriesOpen}
        onClose={() => setIsMemoriesOpen(false)}
        memories={memories}
        memoryEnabled={memoryEnabled}
        onToggleMemoryEnabled={handleToggleMemoryEnabled}
        onAddMemory={handleAddMemory}
        onDeleteMemory={handleDeleteMemory}
        onClearAllMemories={handleClearAllMemories}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={async (updated) => {
          setSettings(prev => ({ ...prev, ...updated }));
          await updateSettings(updated);
        }}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          localStorage.setItem('jugaad_onboarding_done', 'true');
        }}
        onSavePreferences={async (prefs) => {
          setSettings(prev => ({
            ...prev,
            language: prefs.language,
            personality: prefs.personality,
            memoryEnabled: prefs.memoryEnabled
          }));
          await updateSettings({
            language: prefs.language,
            personality: prefs.personality,
            memoryEnabled: prefs.memoryEnabled
          });
          localStorage.setItem('jugaad_onboarding_done', 'true');
        }}
      />
    </div>
  );
}
