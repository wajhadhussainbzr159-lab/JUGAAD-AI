export type Language = 'en' | 'ur' | 'roman_ur' | 'sd' | 'hi' | 'ar';

export type Personality = 
  | 'jugaad_master'
  | 'coding_expert'
  | 'teacher'
  | 'researcher'
  | 'creative'
  | 'business_advisor'
  | 'professional'
  | 'friendly';

export type AppMode = 
  | 'chat'
  | 'jugaad'
  | 'deep_research'
  | 'agent'
  | 'study'
  | 'coding'
  | 'data_analyst'
  | 'creative'
  | 'landing';

export interface Source {
  title: string;
  uri: string;
  snippet?: string;
}

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  content?: string;
  dataUrl?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: Source[];
  toolActivity?: string;
  isStreaming?: boolean;
  images?: Array<{ data: string; mimeType: string }>;
  files?: AttachedFile[];
  jugaadMode?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  projectId?: string | null;
  mode: AppMode;
  pinned: boolean;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  content: string;
  category?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  instructions: string;
  files: Array<{ name: string; size: number; type: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  language: Language;
  personality: Personality;
  customInstructions: string;
  memoryEnabled: boolean;
  temperature: number;
  theme: 'dark' | 'light';
  voiceSpeed: number;
  voiceName: string;
}

export interface DeepResearchResult {
  query: string;
  report: string;
  sources: Source[];
  stagesCompleted: string[];
  timestamp: string;
}

export interface AgentTaskResult {
  task: string;
  result: string;
  status: 'completed' | 'pending_confirmation' | 'failed';
  requiresConfirmation?: boolean;
  confirmationDetails?: string;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
