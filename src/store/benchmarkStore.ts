import { create } from 'zustand';
import type { BenchmarkResult, BenchmarkStats } from '../types';

interface BenchmarkState {
  results: BenchmarkResult[];
  isRunning: boolean;
  currentProgress: number;
  totalRuns: number;

  addResult: (result: BenchmarkResult) => void;
  setIsRunning: (isRunning: boolean) => void;
  setProgress: (current: number, total: number) => void;
  clearResults: () => void;
  getStats: () => BenchmarkStats;
}

export const useBenchmarkStore = create<BenchmarkState>((set, get) => ({
  results: [],
  isRunning: false,
  currentProgress: 0,
  totalRuns: 0,

  addResult: (result) =>
    set((state) => ({
      results: [...state.results, result],
    })),

  setIsRunning: (isRunning) => set({ isRunning }),

  setProgress: (current, total) =>
    set({
      currentProgress: current,
      totalRuns: total,
    }),

  clearResults: () =>
    set({
      results: [],
      currentProgress: 0,
      totalRuns: 0,
    }),

  getStats: () => {
    const { results } = get();
    if (results.length === 0) {
      return {
        totalRuns: 0,
        meanTokensPerSec: 0,
        medianTokensPerSec: 0,
        stdDevTokensPerSec: 0,
        minTokensPerSec: 0,
        maxTokensPerSec: 0,
        results: [],
      };
    }

    const tokensPerSecValues = results.map((r) => r.tokensPerSecond);
    const sorted = [...tokensPerSecValues].sort((a, b) => a - b);

    const mean =
      tokensPerSecValues.reduce((sum, val) => sum + val, 0) /
      tokensPerSecValues.length;

    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const variance =
      tokensPerSecValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      tokensPerSecValues.length;
    const stdDev = Math.sqrt(variance);

    const min = Math.min(...tokensPerSecValues);
    const max = Math.max(...tokensPerSecValues);

    return {
      totalRuns: results.length,
      meanTokensPerSec: mean,
      medianTokensPerSec: median,
      stdDevTokensPerSec: stdDev,
      minTokensPerSec: min,
      maxTokensPerSec: max,
      results,
    };
  },
}));
