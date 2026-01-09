export interface ModelInfo {
  id: string;
  displayName: string;
  size: string;
  quantization: string;
  category: 'recommended' | 'coding' | 'math' | 'general' | 'large' | 'multilingual';
  vramRequired: string;
  description: string;
  contextLength: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'gemma-2-2b-it-q4f32_1-MLC',
    displayName: 'Gemma 2 2B',
    size: '2B',
    quantization: 'q4f32',
    category: 'recommended',
    vramRequired: '2-3 GB',
    description: 'Fast and efficient general-purpose model',
    contextLength: '8K',
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f32_1-MLC',
    displayName: 'Llama 3.2 1B',
    size: '1B',
    quantization: 'q4f32',
    category: 'recommended',
    vramRequired: '1-2 GB',
    description: 'Smallest Llama model, very fast',
    contextLength: '128K',
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f32_1-MLC',
    displayName: 'Llama 3.2 3B',
    size: '3B',
    quantization: 'q4f32',
    category: 'recommended',
    vramRequired: '3-4 GB',
    description: 'Balanced performance and quality',
    contextLength: '128K',
  },
  {
    id: 'SmolLM2-360M-Instruct-q4f32_1-MLC',
    displayName: 'SmolLM2 360M',
    size: '360M',
    quantization: 'q4f32',
    category: 'recommended',
    vramRequired: '<1 GB',
    description: 'Smallest model, blazing fast',
    contextLength: '8K',
  },
  {
    id: 'SmolLM2-1.7B-Instruct-q4f32_1-MLC',
    displayName: 'SmolLM2 1.7B',
    size: '1.7B',
    quantization: 'q4f32',
    category: 'recommended',
    vramRequired: '1-2 GB',
    description: 'Compact and efficient',
    contextLength: '8K',
  },
  {
    id: 'Qwen2.5-Coder-1.5B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 Coder 1.5B',
    size: '1.5B',
    quantization: 'q4f32',
    category: 'coding',
    vramRequired: '1-2 GB',
    description: 'Optimized for code generation',
    contextLength: '32K',
  },
  {
    id: 'Qwen2.5-Coder-3B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 Coder 3B',
    size: '3B',
    quantization: 'q4f32',
    category: 'coding',
    vramRequired: '3-4 GB',
    description: 'Advanced code generation',
    contextLength: '32K',
  },
  {
    id: 'Qwen2.5-Coder-7B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 Coder 7B',
    size: '7B',
    quantization: 'q4f32',
    category: 'coding',
    vramRequired: '6-8 GB',
    description: 'Professional code generation',
    contextLength: '32K',
  },
  {
    id: 'Qwen2.5-Math-1.5B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 Math 1.5B',
    size: '1.5B',
    quantization: 'q4f32',
    category: 'math',
    vramRequired: '1-2 GB',
    description: 'Specialized for mathematics',
    contextLength: '4K',
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 1.5B',
    size: '1.5B',
    quantization: 'q4f32',
    category: 'general',
    vramRequired: '1-2 GB',
    description: 'Versatile general-purpose model',
    contextLength: '32K',
  },
  {
    id: 'Qwen2.5-3B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 3B',
    size: '3B',
    quantization: 'q4f32',
    category: 'general',
    vramRequired: '3-4 GB',
    description: 'Strong general performance',
    contextLength: '32K',
  },
  {
    id: 'Qwen2.5-7B-Instruct-q4f32_1-MLC',
    displayName: 'Qwen2.5 7B',
    size: '7B',
    quantization: 'q4f32',
    category: 'general',
    vramRequired: '6-8 GB',
    description: 'High-quality responses',
    contextLength: '32K',
  },
  {
    id: 'Llama-3.1-8B-Instruct-q4f32_1-MLC',
    displayName: 'Llama 3.1 8B',
    size: '8B',
    quantization: 'q4f32',
    category: 'large',
    vramRequired: '7-9 GB',
    description: 'Powerful general-purpose model',
    contextLength: '128K',
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-7B-q4f32_1-MLC',
    displayName: 'DeepSeek R1 Qwen 7B',
    size: '7B',
    quantization: 'q4f32',
    category: 'large',
    vramRequired: '6-8 GB',
    description: 'Advanced reasoning capabilities',
    contextLength: '32K',
  },
  {
    id: 'DeepSeek-R1-Distill-Llama-8B-q4f32_1-MLC',
    displayName: 'DeepSeek R1 Llama 8B',
    size: '8B',
    quantization: 'q4f32',
    category: 'large',
    vramRequired: '7-9 GB',
    description: 'Enhanced reasoning and analysis',
    contextLength: '128K',
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f32_1-MLC',
    displayName: 'Phi 3.5 Mini',
    size: '3.8B',
    quantization: 'q4f32',
    category: 'general',
    vramRequired: '3-4 GB',
    description: 'Compact yet capable',
    contextLength: '128K',
  },
  {
    id: 'Mistral-7B-Instruct-v0.3-q4f32_1-MLC',
    displayName: 'Mistral 7B v0.3',
    size: '7B',
    quantization: 'q4f32',
    category: 'large',
    vramRequired: '6-8 GB',
    description: 'Strong instruction following',
    contextLength: '32K',
  },
  {
    id: 'Hermes-3-Llama-3.1-8B-q4f32_1-MLC',
    displayName: 'Hermes 3 Llama 8B',
    size: '8B',
    quantization: 'q4f32',
    category: 'large',
    vramRequired: '7-9 GB',
    description: 'Function calling specialist',
    contextLength: '128K',
  },
  {
    id: 'gemma-2-2b-jpn-it-q4f32_1-MLC',
    displayName: 'Gemma 2 2B Japanese',
    size: '2B',
    quantization: 'q4f32',
    category: 'multilingual',
    vramRequired: '2-3 GB',
    description: 'Japanese language support',
    contextLength: '8K',
  },
];

export function getModelsByCategory(category: ModelInfo['category']): ModelInfo[] {
  return AVAILABLE_MODELS.filter(model => model.category === category);
}

export function getModelById(id: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find(model => model.id === id);
}

export function getRecommendedModels(): ModelInfo[] {
  return getModelsByCategory('recommended');
}

export const MODEL_CATEGORIES = [
  { value: 'recommended', label: 'Recommended', icon: '⭐' },
  { value: 'coding', label: 'Code Specialized', icon: '💻' },
  { value: 'math', label: 'Math Specialized', icon: '🔢' },
  { value: 'general', label: 'General Purpose', icon: '🌐' },
  { value: 'large', label: 'Large Models (7B+)', icon: '🚀' },
  { value: 'multilingual', label: 'Multilingual', icon: '🌍' },
] as const;
