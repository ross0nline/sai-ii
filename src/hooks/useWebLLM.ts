import { useEffect, useRef, useState } from 'react';
import * as webllm from '@mlc-ai/web-llm';
import type { InferenceParams, ModelStatus } from '../types';
import { useModelStore } from '../store/modelStore';

export function useWebLLM() {
  const engineRef = useRef<webllm.MLCEngine | null>(null);
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const shouldLoadModel = useModelStore((state) => state.shouldLoadModel);
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    isLoading: false,
    isReady: false,
    progress: 0,
    error: null,
    modelName: selectedModelId,
    downloadStatus: 'idle',
  });

  useEffect(() => {
    let mounted = true;

    const initEngine = async () => {
      if (!shouldLoadModel) {
        console.log('Model loading is disabled. User must manually load the model.');
        return;
      }

      if (engineRef.current) {
        engineRef.current = null;
      }

      try {
        console.log('Checking WebGPU support...');
        console.log('navigator.gpu:', navigator.gpu);
        console.log('User Agent:', navigator.userAgent);
        console.log('Is in iframe:', window.self !== window.top);

        if (!navigator.gpu) {
          const isChrome = navigator.userAgent.includes('Chrome');
          const chromeVersion = isChrome ? navigator.userAgent.match(/Chrome\/(\d+)/)?.[1] : null;
          const isInIframe = window.self !== window.top;

          let detailedError = 'WebGPU is not available. ';

          if (isInIframe) {
            detailedError += 'This might be because the app is running in a preview iframe. WebGPU requires specific permissions that may not be available in preview environments. Try opening the app in a new tab or deploying it to test locally.';
          } else if (isChrome && chromeVersion && parseInt(chromeVersion) < 113) {
            detailedError += `Your Chrome version (${chromeVersion}) is too old. Please update to Chrome 113 or later.`;
          } else if (isChrome) {
            detailedError += 'WebGPU might be disabled. Check chrome://flags and enable "Unsafe WebGPU" if available.';
          } else {
            detailedError += 'Please use Chrome/Edge (version 113+) or Safari on iOS 17+ for WebGPU support.';
          }

          throw new Error(detailedError);
        }

        setModelStatus((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
          modelName: selectedModelId,
          downloadStatus: 'downloading',
        }));

        console.log(`Initializing model: ${selectedModelId}`);
        console.log('📦 WebLLM uses IndexedDB to cache model files');
        console.log('💾 Cached models persist across page reloads and will load faster');
        console.log('🔄 First load will download the model, subsequent loads use the cache');

        let lastProgressText = '';

        const engine = await webllm.CreateMLCEngine(selectedModelId, {
          initProgressCallback: (progress) => {
            if (mounted) {
              const progressText = progress.text || '';

              if (progressText !== lastProgressText) {
                console.log(`Progress: ${(progress.progress * 100).toFixed(1)}% - ${progressText}`);
                lastProgressText = progressText;
              }

              setModelStatus((prev) => ({
                ...prev,
                progress: progress.progress,
                downloadStatus: progress.progress < 1 ? 'downloading' : 'loading',
              }));
            }
          },
        });

        if (mounted) {
          engineRef.current = engine;
          console.log(`✅ Model ${selectedModelId} is ready to use`);
          console.log('💡 Model files are now cached in IndexedDB for faster future loads');

          setModelStatus({
            isLoading: false,
            isReady: true,
            progress: 1,
            error: null,
            modelName: selectedModelId,
            downloadStatus: 'ready',
          });
        }
      } catch (error) {
        if (mounted) {
          console.error('WebLLM initialization error:', error);

          let errorMessage = 'Failed to load model';

          if (error instanceof Error) {
            errorMessage = error.message;

            if (error.message.includes('WebGPU')) {
              errorMessage = 'WebGPU is not supported on this device. Please use a device with WebGPU support (Chrome/Edge on desktop, or Safari on iOS 17+).';
            } else if (error.message.includes('storage') || error.message.includes('quota')) {
              errorMessage = 'Insufficient storage space. Please free up some space and try again.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
              errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (error.message.includes('CORS')) {
              errorMessage = 'Network access blocked. Please check your browser settings.';
            }
          }

          setModelStatus({
            isLoading: false,
            isReady: false,
            progress: 0,
            error: errorMessage,
            modelName: selectedModelId,
            downloadStatus: 'error',
          });
        }
      }
    };

    initEngine();

    return () => {
      mounted = false;
    };
  }, [selectedModelId, shouldLoadModel]);

  const generateStream = async (
    messages: Array<{ role: string; content: string }>,
    params: InferenceParams,
    onToken: (token: string) => void,
    onComplete: (stats: { tokensGenerated: number; timeMs: number }) => void
  ) => {
    if (!engineRef.current || !modelStatus.isReady) {
      throw new Error('Model not ready');
    }

    const startTime = performance.now();
    let tokensGenerated = 0;

    const chunks = await engineRef.current.chat.completions.create({
      messages: messages as webllm.ChatCompletionMessageParam[],
      temperature: params.temperature,
      top_p: params.topP,
      max_tokens: params.maxTokens,
      frequency_penalty: params.frequencyPenalty,
      presence_penalty: params.presencePenalty,
      stream: true,
      stream_options: { include_usage: true },
    });

    for await (const chunk of chunks) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        tokensGenerated++;
        onToken(content);
      }
    }

    const endTime = performance.now();
    const timeMs = endTime - startTime;

    onComplete({ tokensGenerated, timeMs });
  };

  const generate = async (
    messages: Array<{ role: string; content: string }>,
    params: InferenceParams
  ): Promise<{ response: string; tokensGenerated: number; timeMs: number }> => {
    if (!engineRef.current || !modelStatus.isReady) {
      throw new Error('Model not ready');
    }

    const startTime = performance.now();

    const response = await engineRef.current.chat.completions.create({
      messages: messages as webllm.ChatCompletionMessageParam[],
      temperature: params.temperature,
      top_p: params.topP,
      max_tokens: params.maxTokens,
      frequency_penalty: params.frequencyPenalty,
      presence_penalty: params.presencePenalty,
      stream: false,
    });

    const endTime = performance.now();
    const timeMs = endTime - startTime;

    const content = response.choices[0]?.message?.content || '';
    const tokensGenerated = response.usage?.completion_tokens || 0;

    return { response: content, tokensGenerated, timeMs };
  };

  return {
    modelStatus,
    generateStream,
    generate,
  };
}
