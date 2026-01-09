import { Trash2, Download, Bot, HelpCircle, Settings, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { useBenchmarkStore } from '../store/benchmarkStore';
import { useHelpStore } from '../store/helpStore';
import { useModelStore } from '../store/modelStore';
import { getModelById } from '../models';
import { ModelSelector } from './ModelSelector';
import { RobotMenu } from './RobotMenu';
import { SettingsModal } from './SettingsModal';
import type { ModelStatus } from '../types';

interface HeaderProps {
  modelStatus: ModelStatus;
}

const getCategoryUseCase = (category: string): string => {
  const useCases: Record<string, string> = {
    recommended: 'Balanced performance for everyday tasks',
    coding: 'Code generation, debugging, and technical documentation',
    math: 'Mathematical reasoning, equations, and problem solving',
    general: 'Versatile AI assistant for diverse applications',
    large: 'Complex reasoning, analysis, and advanced tasks',
    multilingual: 'Multi-language support and translation',
  };
  return useCases[category] || 'Advanced AI capabilities';
};

export function Header({ modelStatus }: HeaderProps) {
  const { messages, clearMessages } = useChatStore();
  const { results } = useBenchmarkStore();
  const { setHelpOpen } = useHelpStore();
  const { selectedModelId } = useModelStore();
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const robotButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimationFrame((prev) => {
        if (prev >= 20) {
          setIsAnimating(false);
          setIsMenuOpen(true);
          return 0;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleLogoClick = () => {
    if (!isAnimating && !isMenuOpen) {
      setIsAnimating(true);
      setAnimationFrame(1);
    } else if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const getRobotTransform = (frame: number): string => {
    if (frame === 0) return 'rotate(0deg) scale(1) translateY(0)';

    if (frame <= 5) {
      const rotation = frame % 2 === 0 ? 15 : -15;
      return `rotate(${rotation}deg) scale(1) translateY(0)`;
    }

    if (frame <= 10) {
      const bounce = frame % 2 === 0 ? -8 : 0;
      return `rotate(0deg) scale(${frame % 2 === 0 ? 1.1 : 1}) translateY(${bounce}px)`;
    }

    if (frame <= 14) {
      const rotation = (frame - 10) * 90;
      return `rotate(${rotation}deg) scale(1.1) translateY(0)`;
    }

    const celebration = frame % 2 === 0 ? 1.2 : 1.1;
    const wiggle = frame % 2 === 0 ? -5 : 5;
    return `rotate(${wiggle}deg) scale(${celebration}) translateY(-5px)`;
  };

  const currentModel = getModelById(selectedModelId);
  const showModelInfo = isAnimating && animationFrame >= 15;

  const exportSession = () => {
    const data = {
      messages,
      benchmarkResults: results,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inference-lab-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsMobileMenuOpen(false);
  };

  const getHeaderBackground = () => {
    const { downloadStatus, progress, error } = modelStatus;

    if (error || downloadStatus === 'error') {
      return {
        background: 'linear-gradient(to right, rgb(220 38 38), rgb(185 28 28))',
      };
    }

    if (downloadStatus === 'downloading') {
      const progressPercent = Math.round(progress * 100);
      return {
        background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${progressPercent}%, rgb(37 99 235) ${progressPercent}%, rgb(29 78 216) 100%)`,
      };
    }

    if (downloadStatus === 'ready' && progress === 1) {
      return {
        background: 'linear-gradient(to right, rgb(34 197 94), rgb(22 163 74))',
      };
    }

    return {
      background: 'linear-gradient(to right, rgb(37 99 235), rgb(29 78 216))',
    };
  };

  return (
    <header
      className="text-white px-4 sm:px-6 py-3 sm:py-4 shadow-lg transition-all duration-500"
      style={getHeaderBackground()}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="relative flex-shrink-0">
          <button
            ref={robotButtonRef}
            onClick={handleLogoClick}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-90 transition-opacity group"
          >
            <div className="bg-white/10 p-1.5 sm:p-2 rounded-lg group-hover:bg-white/20 transition-colors">
              <Bot
                className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-150"
                style={{ transform: getRobotTransform(animationFrame) }}
              />
            </div>
            <div className="text-left hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold transition-all duration-300">
                {showModelInfo && currentModel
                  ? `${currentModel.displayName} (${currentModel.size})`
                  : 'Sovereign AI HQ'}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 transition-all duration-300">
                {showModelInfo && currentModel
                  ? getCategoryUseCase(currentModel.category)
                  : 'A Local AI Suite for Developers'}
              </p>
            </div>
            {/* Mobile: Show abbreviated title */}
            <div className="text-left block sm:hidden">
              <h1 className="text-base font-bold">Sovereign AI</h1>
            </div>
          </button>
          <RobotMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            triggerRef={robotButtonRef}
          />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ModelSelector modelStatus={modelStatus} />

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>

          <button
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Help & Guide (Press ?)"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help</span>
          </button>

          {(messages.length > 0 || results.length > 0) && (
            <button
              onClick={exportSession}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Export session"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          )}

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear messages"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>

        {/* Mobile: Hamburger Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute top-full right-4 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-2">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                <ModelSelector modelStatus={modelStatus} />
              </div>
              
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  setHelpOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help & Guide</span>
              </button>

              {(messages.length > 0 || results.length > 0) && (
                <button
                  onClick={exportSession}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Session</span>
                </button>
              )}

              {messages.length > 0 && (
                <button
                  onClick={() => {
                    clearMessages();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear Messages</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </header>
  );
}