import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useHelpStore } from '../store/helpStore';

const tips = [
  {
    title: 'Lower temperature for coding',
    description: 'Use 0.3-0.5 temperature for precise tasks like code generation',
  },
  {
    title: 'Higher temperature for creativity',
    description: 'Use 0.9-1.2 temperature for creative writing and brainstorming',
  },
  {
    title: 'Adjust max tokens for speed',
    description: 'Lower max tokens = faster responses. 256 is good for quick answers',
  },
  {
    title: 'Use repetition penalty',
    description: 'Set to 1.1-1.3 to avoid repetitive outputs',
  },
  {
    title: 'Benchmark your system',
    description: 'Run 5-10 iterations to understand your hardware performance',
  },
];

export function QuickTips() {
  const { showQuickTips, toggleQuickTips } = useHelpStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!showQuickTips) return null;

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-blue-200 dark:border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-slate-800 dark:text-white">Quick Tips</h4>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-blue-100 dark:hover:bg-slate-600 rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          <button
            onClick={toggleQuickTips}
            className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-600 rounded transition-colors"
          >
            Hide
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-600 shadow-sm"
            >
              <h5 className="text-sm font-medium text-slate-800 dark:text-white mb-1">
                {tip.title}
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400">{tip.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
