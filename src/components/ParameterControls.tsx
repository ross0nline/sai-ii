import { ChevronDown, ChevronUp } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useLayoutStore } from '../store/layoutStore';
import { PRESETS } from '../constants';
import type { PresetName } from '../types';
import { Tooltip } from './Tooltip';

export function ParameterControls() {
  const { currentParams, setParams } = useChatStore();
  const { parametersPanelCollapsed, toggleParametersPanel } = useLayoutStore();

  const applyPreset = (presetName: PresetName) => {
    const preset = PRESETS.find((p) => p.name === presetName);
    if (preset) {
      setParams(preset.params);
    }
  };

  return (
    <div id="parameter-controls" className="space-y-6 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Parameters</h3>
          <button
            onClick={toggleParametersPanel}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label={parametersPanelCollapsed ? 'Expand' : 'Collapse'}
          >
            {parametersPanelCollapsed ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        {!parametersPanelCollapsed && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Presets
              </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.name)}
                className="px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Temperature: {currentParams.temperature.toFixed(2)}
              <Tooltip content="Controls output randomness and creativity. Lower values (0.1-0.5) produce more focused and deterministic responses, ideal for factual tasks. Higher values (0.7-1.5) increase creativity and variation, better for creative writing. Range: 0.0-2.0." />
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={currentParams.temperature}
              onChange={(e) => setParams({ temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Top P: {currentParams.topP.toFixed(2)}
              <Tooltip content="Nucleus sampling parameter that limits token selection to those with cumulative probability up to P. Lower values (0.1-0.5) focus on most likely tokens for consistent output. Higher values (0.9-1.0) allow more diverse token selection. Typically used as an alternative to temperature." />
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={currentParams.topP}
              onChange={(e) => setParams({ topP: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Top K: {currentParams.topK}
              <Tooltip content="Restricts token selection to the K most probable candidates at each step. Lower values (10-30) produce more predictable, focused output. Higher values (50-100) allow greater vocabulary diversity and creative expression. Works in conjunction with temperature and top-p sampling." />
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={currentParams.topK}
              onChange={(e) => setParams({ topK: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Max Tokens: {currentParams.maxTokens}
              <Tooltip content="Maximum number of tokens the model can generate in a single response. Approximately 1 token equals 0.75 words (4 characters). Lower values (64-256) generate faster, concise responses. Higher values (512-2048) allow longer, more detailed outputs but take more time to generate." />
            </label>
            <input
              type="range"
              min="64"
              max="2048"
              step="64"
              value={currentParams.maxTokens}
              onChange={(e) => setParams({ maxTokens: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Repetition Penalty: {currentParams.repetitionPenalty.toFixed(2)}
              <Tooltip content="Penalizes tokens that have already appeared in the generated text to reduce repetitive output. Values of 1.0 apply no penalty. Range 1.1-1.3 is recommended for most use cases. Higher values (1.5+) strongly discourage repetition but may affect coherence." />
            </label>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={currentParams.repetitionPenalty}
              onChange={(e) =>
                setParams({ repetitionPenalty: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Frequency Penalty: {currentParams.frequencyPenalty.toFixed(2)}
              <Tooltip content="Reduces the probability of tokens based on their frequency in the generated text. Higher values (0.5-2.0) encourage more diverse vocabulary by penalizing commonly used words. Value of 0.0 applies no penalty. Useful for avoiding monotonous or repetitive word choices in longer responses." />
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={currentParams.frequencyPenalty}
              onChange={(e) =>
                setParams({ frequencyPenalty: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Presence Penalty: {currentParams.presencePenalty.toFixed(2)}
              <Tooltip content="Applies a one-time penalty to tokens that have appeared anywhere in the generated text, regardless of frequency. Higher values (0.5-2.0) encourage the model to explore new topics and concepts rather than revisiting the same themes. Value of 0.0 applies no penalty. Particularly effective for maintaining topic diversity in longer responses." />
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={currentParams.presencePenalty}
              onChange={(e) =>
                setParams({ presencePenalty: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
