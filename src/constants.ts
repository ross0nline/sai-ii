import type { Preset, InferenceParams } from './types';

export const MODEL_NAME = 'gemma-2-2b-it-q4f32_1-MLC';

export const DEFAULT_PARAMS: InferenceParams = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxTokens: 512,
  repetitionPenalty: 1.1,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  stopSequences: [],
  seed: undefined,
};

export const PRESETS: Preset[] = [
  {
    name: 'balanced',
    label: 'Balanced',
    params: {
      ...DEFAULT_PARAMS,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  },
  {
    name: 'creative',
    label: 'Creative',
    params: {
      ...DEFAULT_PARAMS,
      temperature: 0.9,
      topP: 0.98,
      topK: 50,
    },
  },
  {
    name: 'precise',
    label: 'Precise',
    params: {
      ...DEFAULT_PARAMS,
      temperature: 0.3,
      topP: 0.85,
      topK: 20,
    },
  },
  {
    name: 'fast',
    label: 'Fast',
    params: {
      ...DEFAULT_PARAMS,
      temperature: 0.7,
      topP: 0.9,
      topK: 30,
      maxTokens: 256,
    },
  },
];

export const DEFAULT_SYSTEM_PROMPT = 'You are a helpful AI assistant.';

export const BENCHMARK_PROMPTS = [
  'Explain quantum computing in simple terms.',
  'Write a short story about a robot learning to paint.',
  'What are the key principles of machine learning?',
  'Describe the process of photosynthesis.',
  'How does blockchain technology work?',
];
