import { create } from 'zustand';
import type { Message, InferenceParams, SessionStats } from '../types';
import { DEFAULT_PARAMS } from '../constants';

interface ChatState {
  messages: Message[];
  currentParams: InferenceParams;
  systemPrompt: string;
  isGenerating: boolean;
  sessionStats: SessionStats;

  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  removeLastMessage: () => void;
  setParams: (params: Partial<InferenceParams>) => void;
  setSystemPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  updateSessionStats: (stats: Partial<SessionStats>) => void;
  clearMessages: () => void;
  resetSession: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentParams: DEFAULT_PARAMS,
  systemPrompt: 'You are a helpful AI assistant.',
  isGenerating: false,
  sessionStats: {
    totalMessages: 0,
    totalTokens: 0,
    totalGenerationTime: 0,
    averageTokensPerSecond: 0,
    sessionStartTime: Date.now(),
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      sessionStats: {
        ...state.sessionStats,
        totalMessages: state.sessionStats.totalMessages + 1,
      },
    })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0) {
        messages[messages.length - 1] = {
          ...messages[messages.length - 1],
          content,
        };
      }
      return { messages };
    }),

  removeLastMessage: () =>
    set((state) => ({
      messages: state.messages.slice(0, -1),
    })),

  setParams: (params) =>
    set((state) => ({
      currentParams: { ...state.currentParams, ...params },
    })),

  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  updateSessionStats: (stats) =>
    set((state) => {
      const newStats = { ...state.sessionStats, ...stats };
      if (newStats.totalGenerationTime > 0 && newStats.totalTokens > 0) {
        newStats.averageTokensPerSecond =
          (newStats.totalTokens / newStats.totalGenerationTime) * 1000;
      }
      return { sessionStats: newStats };
    }),

  clearMessages: () =>
    set({
      messages: [],
      sessionStats: {
        totalMessages: 0,
        totalTokens: 0,
        totalGenerationTime: 0,
        averageTokensPerSecond: 0,
        sessionStartTime: Date.now(),
      },
    }),

  resetSession: () =>
    set({
      messages: [],
      currentParams: DEFAULT_PARAMS,
      systemPrompt: 'You are a helpful AI assistant.',
      isGenerating: false,
      sessionStats: {
        totalMessages: 0,
        totalTokens: 0,
        totalGenerationTime: 0,
        averageTokensPerSecond: 0,
        sessionStartTime: Date.now(),
      },
    }),
}));
