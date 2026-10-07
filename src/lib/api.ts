import { Message, Memory, Project, Settings, DeepResearchResult, AgentTaskResult } from '../types';

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    console.warn('Health check error:', err);
    return null;
  }
}

export async function streamChat({
  messages,
  jugaadMode = false,
  webSearch = false,
  deepResearch = false,
  agentMode = false,
  studyMode = false,
  studyLevel = 'intermediate',
  codingMode = false,
  personality = 'jugaad_master',
  language = 'en',
  customInstructions = '',
  projectId = null,
  images = [],
  files = [],
  onChunk,
  onSources,
  onError,
  onDone
}: {
  messages: Message[];
  jugaadMode?: boolean;
  webSearch?: boolean;
  deepResearch?: boolean;
  agentMode?: boolean;
  studyMode?: boolean;
  studyLevel?: string;
  codingMode?: boolean;
  personality?: string;
  language?: string;
  customInstructions?: string;
  projectId?: string | null;
  images?: Array<{ data: string; mimeType: string }>;
  files?: Array<{ name: string; type: string; content?: string }>;
  onChunk: (chunk: string) => void;
  onSources?: (sources: any[]) => void;
  onError: (err: string) => void;
  onDone: () => void;
}) {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        jugaadMode,
        webSearch,
        deepResearch,
        agentMode,
        studyMode,
        studyLevel,
        codingMode,
        personality,
        language,
        customInstructions,
        projectId,
        images,
        files
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      onError(errJson.error || `HTTP error ${response.status}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      onError('Unable to open response stream');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'chunk' && data.text) {
              onChunk(data.text);
              if (data.sources && onSources) {
                onSources(data.sources);
              }
            } else if (data.type === 'done') {
              if (data.sources && onSources) {
                onSources(data.sources);
              }
              onDone();
              return;
            } else if (data.type === 'error') {
              const friendlyError = typeof data.error === 'string' && (data.error.includes('429') || data.error.includes('quota'))
                ? "⚡ JUGAAD AI: High cloud traffic detected. I'm ready to find you a practical solution—please ask again with JUGAAD MODE enabled!"
                : (data.error || "I couldn't complete that request right now. Please try again.");
              onError(friendlyError);
              return;
            }
          } catch (e) {
            console.error('SSE JSON parse error:', e);
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    onError(err.message || 'Network stream failed');
  }
}

export async function runDeepResearch(query: string): Promise<DeepResearchResult> {
  const res = await fetch('/api/research/deep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Deep research failed');
  }
  return res.json();
}

export async function runAgentTask(task: string, userConfirmedAction = false): Promise<AgentTaskResult> {
  const res = await fetch('/api/agent/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, userConfirmedAction })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Agent task failed');
  }
  return res.json();
}

export async function executeCode(code: string, language: string) {
  const res = await fetch('/api/code/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  return res.json();
}

export async function analyzeData(dataSample: any, fileName?: string, userPrompt?: string) {
  const res = await fetch('/api/data/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataSample, fileName, userPrompt })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Data analysis failed');
  }
  return res.json();
}

export async function generateCreativeAsset(type: string, prompt: string, style?: string) {
  const res = await fetch('/api/creative/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, prompt, style })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Creative generation failed');
  }
  return res.json();
}

export async function getMemories(): Promise<{ memories: Memory[]; memoryEnabled: boolean }> {
  const res = await fetch('/api/memories');
  return res.json();
}

export async function addMemory(content: string, category = 'general'): Promise<Memory> {
  const res = await fetch('/api/memories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, category })
  });
  const data = await res.json();
  return data.memory;
}

export async function deleteMemory(id: string) {
  await fetch(`/api/memories/${id}`, { method: 'DELETE' });
}

export async function clearAllMemories() {
  await fetch('/api/memories/clear', { method: 'POST' });
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  const data = await res.json();
  return data.projects || [];
}

export async function createProject(title: string, description = '', instructions = ''): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, instructions })
  });
  const data = await res.json();
  return data.project;
}

export async function deleteProject(id: string) {
  await fetch(`/api/projects/${id}`, { method: 'DELETE' });
}

export async function getSettings(): Promise<Settings> {
  const res = await fetch('/api/settings');
  const data = await res.json();
  return data.settings;
}

export async function updateSettings(settings: Partial<Settings>) {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
}
