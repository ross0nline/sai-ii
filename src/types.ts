export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  tokensGenerated?: number;
  generationTimeMs?: number;
  tokensPerSecond?: number;
  parameters?: InferenceParams;
}

export interface InferenceParams {
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
  repetitionPenalty: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  seed?: number;
}

export interface ModelStatus {
  isLoading: boolean;
  isReady: boolean;
  progress: number;
  error: string | null;
  modelName: string;
  downloadStatus?: 'idle' | 'downloading' | 'loading' | 'ready' | 'error';
}

export interface SessionStats {
  totalMessages: number;
  totalTokens: number;
  totalGenerationTime: number;
  averageTokensPerSecond: number;
  sessionStartTime: number;
}

export interface BenchmarkConfig {
  prompts: string[];
  iterations: number;
  params: InferenceParams;
}

export interface BenchmarkResult {
  id: string;
  prompt: string;
  response: string;
  tokensPerSecond: number;
  tokensGenerated: number;
  generationTimeMs: number;
  timestamp: number;
  params: InferenceParams;
}

export interface BenchmarkStats {
  totalRuns: number;
  meanTokensPerSec: number;
  medianTokensPerSec: number;
  stdDevTokensPerSec: number;
  minTokensPerSec: number;
  maxTokensPerSec: number;
  results: BenchmarkResult[];
}

export type PresetName = 'balanced' | 'creative' | 'precise' | 'fast';

export interface Preset {
  name: PresetName;
  label: string;
  params: InferenceParams;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  params: InferenceParams;
  stats: SessionStats;
  createdAt: number;
  updatedAt: number;
}
