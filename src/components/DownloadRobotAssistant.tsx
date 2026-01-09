import { Bot } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRobotQuotesStore } from '../store/robotQuotesStore';
import { useBenchmarkStore } from '../store/benchmarkStore';
import { useSettingsStore } from '../store/settingsStore';
import type { ModelStatus } from '../types';

interface DownloadRobotAssistantProps {
  modelStatus: ModelStatus;
}

export function DownloadRobotAssistant({ modelStatus }: DownloadRobotAssistantProps) {
  const {
    fetchQuotes,
    getNextQuote,
    getNextIdleQuote,
    incrementClickCount,
    resetClickCount,
    setShowingCustomMessage,
    showingCustomMessage,
    quotes
  } = useRobotQuotesStore();

  const { isRunning: isBenchmarkRunning, currentProgress, totalRuns, getStats } = useBenchmarkStore();
  const { showChattyBot } = useSettingsStore();

  const [displayText, setDisplayText] = useState('Click me to get started!');
  const [isBouncing, setIsBouncing] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const robotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    if (position === null) {
      const centerX = window.innerWidth / 2;
      const headerHeight = 80;
      setPosition({ x: centerX, y: headerHeight });
    }
  }, [position]);

  const updateProgressText = useCallback(() => {
    const progress = Math.round(modelStatus.progress * 100);
    const progressTexts = [
      `Downloading... ${progress}% complete`,
      `Loading model... ${progress}%`,
      `Almost there... ${progress}%`,
      `Hang tight! ${progress}% done`,
    ];
    const randomText = progressTexts[Math.floor(Math.random() * progressTexts.length)];
    setDisplayText(randomText);
  }, [modelStatus.progress]);

  const updateBenchmarkText = useCallback(() => {
    if (isBenchmarkRunning) {
      setDisplayText(`Running benchmark... ${currentProgress}/${totalRuns}`);
    } else {
      const stats = getStats();
      if (stats.totalRuns > 0) {
        setDisplayText(`Benchmark complete! Mean: ${stats.meanTokensPerSec.toFixed(1)} tokens/sec`);
      }
    }
  }, [isBenchmarkRunning, currentProgress, totalRuns, getStats]);

  const updateIdleText = useCallback(() => {
    const idleMessage = getNextIdleQuote();
    setDisplayText(idleMessage);
  }, [getNextIdleQuote]);

  useEffect(() => {
    if (modelStatus.downloadStatus === 'downloading' || modelStatus.downloadStatus === 'loading') {
      if (!showingCustomMessage) {
        updateProgressText();
      }
    } else if (isBenchmarkRunning) {
      if (!showingCustomMessage) {
        updateBenchmarkText();
      }
    } else if (modelStatus.downloadStatus === 'ready' && !showingCustomMessage) {
      updateIdleText();
    }
  }, [modelStatus.downloadStatus, modelStatus.progress, showingCustomMessage, isBenchmarkRunning, currentProgress, totalRuns, updateProgressText, updateBenchmarkText, updateIdleText, resetClickCount]);

  useEffect(() => {
    if (!showingCustomMessage) {
      if (modelStatus.downloadStatus === 'downloading' || modelStatus.downloadStatus === 'loading') {
        const interval = setInterval(() => {
          updateProgressText();
        }, 1000);
        return () => clearInterval(interval);
      } else if (isBenchmarkRunning) {
        const interval = setInterval(() => {
          updateBenchmarkText();
        }, 500);
        return () => clearInterval(interval);
      } else if (modelStatus.downloadStatus === 'ready') {
        // Update idle text every 5 seconds when model is ready
        const interval = setInterval(() => {
          updateIdleText();
        }, 5000);
        return () => clearInterval(interval);
      }
    }
  }, [showingCustomMessage, modelStatus.downloadStatus, isBenchmarkRunning, updateProgressText, updateBenchmarkText, updateIdleText]);

  const handleClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    let nextQuote: string | null = null;

    // Use download quotes only when downloading, idle quotes when ready
    if (modelStatus.downloadStatus === 'downloading' || modelStatus.downloadStatus === 'loading') {
      nextQuote = getNextQuote();
    } else {
      nextQuote = getNextIdleQuote();
    }

    if (nextQuote) {
      setDisplayText(nextQuote);
      setShowingCustomMessage(true);
      incrementClickCount();

      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }

      messageTimeoutRef.current = setTimeout(() => {
        setShowingCustomMessage(false);
        if (modelStatus.downloadStatus === 'downloading' || modelStatus.downloadStatus === 'loading') {
          updateProgressText();
        } else if (isBenchmarkRunning) {
          updateBenchmarkText();
        } else {
          updateIdleText();
        }
      }, 4000);
    }
  };

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && position) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (robotRef.current && position) {
      const rect = robotRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
      setIsDragging(true);
    }
  };

  if (position === null || !showChattyBot) return null;

  return (
    <div
      ref={robotRef}
      className="fixed flex items-end gap-3 z-50 animate-fade-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="relative bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 px-4 py-3 rounded-2xl shadow-2xl max-w-sm animate-float border-2 border-blue-200 dark:border-blue-600">
        <div className="absolute -bottom-2 right-12 w-4 h-4 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-blue-200 dark:border-blue-600 transform rotate-45"></div>
        <p className="text-sm font-medium leading-relaxed">
          {displayText}
        </p>
      </div>

      <button
        onMouseDown={handleMouseDown}
        onClick={() => {
          if (!isDragging) {
            handleClick();
          }
        }}
        className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95 ${
          isBouncing ? 'animate-bounce-once' : ''
        } ${isDragging ? '' : 'animate-wiggle'}`}
        title="Drag me around or click for quotes!"
      >
        <Bot className="w-8 h-8 animate-pulse-subtle" />
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
      </button>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-3deg);
          }
          75% {
            transform: rotate(3deg);
          }
        }

        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-15px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-7px);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }

        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
