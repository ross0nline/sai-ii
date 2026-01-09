import { useState } from 'react';
import { Play, Trash2, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useBenchmarkStore } from '../store/benchmarkStore';
import { useChatStore } from '../store/chatStore';
import { useLayoutStore } from '../store/layoutStore';
import { BENCHMARK_PROMPTS } from '../constants';
import { useWebLLM } from '../hooks/useWebLLM';
import type { BenchmarkResult, Message } from '../types';

export function BenchmarkPanel() {
  const { modelStatus, generate } = useWebLLM();
  const { currentParams } = useChatStore();
  const { benchmarkPanelCollapsed, toggleBenchmarkPanel } = useLayoutStore();
  const {
    results,
    isRunning,
    currentProgress,
    totalRuns,
    addResult,
    setIsRunning,
    setProgress,
    clearResults,
    getStats,
  } = useBenchmarkStore();

  const [iterations, setIterations] = useState(3);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([
    BENCHMARK_PROMPTS[0],
  ]);

  const runBenchmark = async () => {
    if (!modelStatus.isReady || isRunning) return;

    setIsRunning(true);
    clearResults();

    const totalTests = selectedPrompts.length * iterations;
    let completed = 0;

    for (const prompt of selectedPrompts) {
      for (let i = 0; i < iterations; i++) {
        try {
          const { response, tokensGenerated, timeMs } = await generate(
            [{ role: 'user', content: prompt }],
            currentParams
          );

          const tokensPerSecond = (tokensGenerated / timeMs) * 1000;

          const result: BenchmarkResult = {
            id: `${Date.now()}-${Math.random()}`,
            prompt,
            response,
            tokensPerSecond,
            tokensGenerated,
            generationTimeMs: timeMs,
            timestamp: Date.now(),
            params: currentParams,
          };

          addResult(result);
          completed++;
          setProgress(completed, totalTests);
        } catch (error) {
          console.error('Benchmark error:', error);
        }
      }
    }

    setIsRunning(false);
  };

  const stats = getStats();

  const togglePrompt = (prompt: string) => {
    setSelectedPrompts((prev) =>
      prev.includes(prompt)
        ? prev.filter((p) => p !== prompt)
        : [...prev, prompt]
    );
  };

  return (
    <div id="benchmark-panel" className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Benchmark Suite
          </h3>
          <button
            onClick={toggleBenchmarkPanel}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label={benchmarkPanelCollapsed ? 'Expand' : 'Collapse'}
          >
            {benchmarkPanelCollapsed ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        {!benchmarkPanelCollapsed && (
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Iterations: {iterations}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Test Prompts
            </label>
            <div className="space-y-2">
              {BENCHMARK_PROMPTS.map((prompt) => (
                <label
                  key={prompt}
                  className="flex items-start gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPrompts.includes(prompt)}
                    onChange={() => togglePrompt(prompt)}
                    disabled={isRunning}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{prompt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={runBenchmark}
              disabled={
                !modelStatus.isReady ||
                isRunning ||
                selectedPrompts.length === 0
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              {isRunning
                ? `Running ${currentProgress}/${totalRuns}`
                : 'Run Benchmark'}
            </button>

            {results.length > 0 && (
              <button
                onClick={clearResults}
                disabled={isRunning}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                title="Clear results"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          </div>
        )}
      </div>

      {!benchmarkPanelCollapsed && results.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h4 className="text-md font-semibold text-slate-900 dark:text-white">
              Results ({stats.totalRuns} runs)
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-xs text-slate-500 dark:text-slate-400">Mean</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stats.meanTokensPerSec.toFixed(2)} tok/s
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-xs text-slate-500 dark:text-slate-400">Median</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stats.medianTokensPerSec.toFixed(2)} tok/s
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-xs text-slate-500 dark:text-slate-400">Std Dev</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stats.stdDevTokensPerSec.toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="text-xs text-slate-500 dark:text-slate-400">Range</div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {stats.minTokensPerSec.toFixed(1)}-{stats.maxTokensPerSec.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
