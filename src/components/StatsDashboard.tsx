import { Activity, MessageSquare, Clock, Zap, CheckCircle2, Loader2, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useModelStore } from '../store/modelStore';
import { useLayoutStore } from '../store/layoutStore';
import { getModelById } from '../models';
import type { ModelStatus } from '../types';
import { Tooltip } from './Tooltip';
import { useState } from 'react';

interface StatsDashboardProps {
  modelStatus: ModelStatus;
}

export function StatsDashboard({ modelStatus }: StatsDashboardProps) {
  const { sessionStats } = useChatStore();
  const { selectedModelId } = useModelStore();
  const { statsPanelCollapsed, toggleStatsPanel } = useLayoutStore();
  const [isStatusHovered, setIsStatusHovered] = useState(false);

  const currentModel = getModelById(selectedModelId);

  const getStatusConfig = () => {
    if (modelStatus.error) {
      return {
        type: 'error',
        icon: AlertCircle,
        title: 'Model Error',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-300',
        iconColor: 'text-red-500 dark:text-red-400',
        description: modelStatus.error,
        details: [
          'The model failed to load properly',
          'Check your GPU compatibility and browser support',
          'Try refreshing the page or selecting a different model',
        ],
      };
    }

    if (modelStatus.isLoading) {
      const percent = Math.round(modelStatus.progress * 100);
      return {
        type: 'loading',
        icon: Loader2,
        title: 'Model Loading',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        textColor: 'text-amber-700 dark:text-amber-300',
        iconColor: 'text-amber-500 dark:text-amber-400',
        description: `Downloading and initializing model... ${percent}%`,
        details: [
          `Model: ${currentModel?.displayName || selectedModelId}`,
          `Progress: ${percent}% complete`,
          `Size: ~${currentModel?.vramRequired || 'Unknown'} required`,
          'This may take several minutes on first load',
        ],
      };
    }

    if (modelStatus.isReady) {
      return {
        type: 'ready',
        icon: CheckCircle2,
        title: 'Model Ready',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-300',
        iconColor: 'text-green-500 dark:text-green-400',
        description: `${currentModel?.displayName || selectedModelId} is loaded and ready`,
        details: [
          `Model: ${currentModel?.displayName || selectedModelId}`,
          `Size: ${currentModel?.size || 'Unknown'}`,
          `Context: ${currentModel?.contextLength || 'Unknown'}`,
          `VRAM: ${currentModel?.vramRequired || 'Unknown'}`,
          'Ready to process messages',
        ],
      };
    }

    return {
      type: 'idle',
      icon: Info,
      title: 'Model Pending',
      bgColor: 'bg-slate-50 dark:bg-slate-700',
      borderColor: 'border-slate-200 dark:border-slate-600',
      textColor: 'text-slate-700 dark:text-slate-300',
      iconColor: 'text-slate-500 dark:text-slate-400',
      description: 'Waiting for model to initialize',
      details: [
        `Selected: ${currentModel?.displayName || selectedModelId}`,
        'Model will load automatically',
        'Ensure WebGPU is enabled in your browser',
      ],
    };
  };

  const statusConfig = getStatusConfig();

  const stats = [
    {
      icon: MessageSquare,
      label: 'Messages',
      value: sessionStats.totalMessages.toString(),
      color: 'text-blue-500',
      tooltip: 'Total number of messages in this session',
    },
    {
      icon: Zap,
      label: 'Total Tokens',
      value: sessionStats.totalTokens.toString(),
      color: 'text-emerald-500',
      tooltip: 'Total tokens generated across all messages. 1 token ≈ 0.75 words',
    },
    {
      icon: Activity,
      label: 'Avg Speed',
      value: sessionStats.averageTokensPerSecond > 0
        ? `${sessionStats.averageTokensPerSecond.toFixed(2)} tok/s`
        : '0 tok/s',
      color: 'text-purple-500',
      tooltip: 'Average generation speed. Higher is better. Depends on GPU capability.',
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: `${(sessionStats.totalGenerationTime / 1000).toFixed(2)}s`,
      color: 'text-orange-500',
      tooltip: 'Total time spent generating responses in this session',
    },
  ];

  return (
    <div id="stats-dashboard" className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Statistics</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              modelStatus.isReady
                ? 'bg-emerald-500'
                : modelStatus.isLoading
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {modelStatus.isReady
              ? 'Ready'
              : modelStatus.isLoading
              ? `Loading ${Math.round(modelStatus.progress * 100)}%`
              : 'Not loaded'}
          </span>
          <button
            onClick={toggleStatsPanel}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label={statsPanelCollapsed ? 'Expand' : 'Collapse'}
          >
            {statsPanelCollapsed ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {!statsPanelCollapsed && (
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      {stat.label}
                      <Tooltip content={stat.tooltip} />
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!statsPanelCollapsed && (
        <div className="relative mt-4">
        <div
          className={`px-4 py-3 ${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-lg cursor-help flex items-center gap-3 transition-all duration-150 hover:shadow-md`}
          onMouseEnter={() => setIsStatusHovered(true)}
          onMouseLeave={() => setIsStatusHovered(false)}
        >
          <statusConfig.icon
            className={`w-5 h-5 ${statusConfig.iconColor} flex-shrink-0 ${
              statusConfig.type === 'loading' ? 'animate-spin' : ''
            }`}
          />
          <span className={`text-sm font-semibold ${statusConfig.textColor}`}>
            {statusConfig.title}
          </span>
          <Info className={`w-5 h-5 ${statusConfig.iconColor} ml-auto flex-shrink-0`} />
        </div>

        {isStatusHovered && (
          <div className={`absolute left-0 right-0 top-full mt-2 p-5 ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-xl shadow-2xl z-10 animate-in fade-in slide-in-from-top-2 duration-200`}>
            <div className="flex items-start gap-4">
              <statusConfig.icon
                className={`w-6 h-6 ${statusConfig.iconColor} flex-shrink-0 mt-1`}
              />
              <div className="flex-1 min-w-0">
                <h4 className={`text-base font-bold ${statusConfig.textColor} mb-3`}>
                  {statusConfig.title}
                </h4>
                <p className={`text-sm ${statusConfig.textColor} leading-relaxed mb-4 font-medium`}>
                  {statusConfig.description}
                </p>
                <div className={`pt-4 border-t-2 ${statusConfig.borderColor}`}>
                  <ul className="space-y-2.5">
                    {statusConfig.details.map((detail, index) => (
                      <li key={index} className={`text-sm ${statusConfig.textColor} flex items-start gap-2.5 leading-relaxed`}>
                        <span className="text-current opacity-60 mt-0.5 font-bold">•</span>
                        <span className="flex-1">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
