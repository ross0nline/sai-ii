import { useRef, useEffect, useState } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Header } from './components/Header';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { ParameterControls } from './components/ParameterControls';
import { StatsDashboard } from './components/StatsDashboard';
import { BenchmarkPanel } from './components/BenchmarkPanel';
import { HelpModal } from './components/HelpModal';
import { WelcomeTour } from './components/WelcomeTour';
import { QuickTips } from './components/QuickTips';
import { ModelConfirmDialog } from './components/ModelConfirmDialog';
import { DownloadRobotAssistant } from './components/DownloadRobotAssistant';
import { QuoteEditorModal } from './components/QuoteEditorModal';
import { ResizableDivider } from './components/ResizableDivider';
import { useChatStore } from './store/chatStore';
import { useHelpStore } from './store/helpStore';
import { useThemeStore } from './store/themeStore';
import { useLayoutStore } from './store/layoutStore';
import { useWebLLM } from './hooks/useWebLLM';
import type { Message, MessageMetadata } from './types';

function App() {
  const { sidebarOpen, setSidebarOpen, sidebarWidth } = useLayoutStore();
  const { setTheme, theme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  const {
    messages,
    currentParams,
    systemPrompt,
    isGenerating,
    addMessage,
    updateLastMessage,
    setIsGenerating,
    updateSessionStats,
    sessionStats,
    removeLastMessage,
  } = useChatStore();

  const { modelStatus, generateStream } = useWebLLM();
  const { setHelpOpen } = useHelpStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setHelpOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setHelpOpen]);

  const handleSendMessage = async (content: string) => {
    if (!modelStatus.isReady || isGenerating) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    addMessage(userMessage);

    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    addMessage(assistantMessage);
    setIsGenerating(true);

    const conversationMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content },
    ];

    try {
      abortControllerRef.current = new AbortController();

      await generateStream(
        conversationMessages,
        currentParams,
        (token) => {
          assistantMessage.content += token;
          updateLastMessage(assistantMessage.content);
        },
        (stats) => {
          const tokensPerSecond = (stats.tokensGenerated / stats.timeMs) * 1000;

          const metadata: MessageMetadata = {
            tokensGenerated: stats.tokensGenerated,
            generationTimeMs: stats.timeMs,
            tokensPerSecond,
            parameters: currentParams,
          };

          assistantMessage.metadata = metadata;
          updateLastMessage(assistantMessage.content);

          updateSessionStats({
            totalTokens: sessionStats.totalTokens + stats.tokensGenerated,
            totalGenerationTime: sessionStats.totalGenerationTime + stats.timeMs,
          });
        }
      );
    } catch (error) {
      console.error('Generation error:', error);
      assistantMessage.content = 'Error generating response. Please try again.';
      updateLastMessage(assistantMessage.content);
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!modelStatus.isReady || isGenerating) return;

    removeLastMessage();

    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      addMessage(assistantMessage);
      setIsGenerating(true);

      const conversationMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(0, -1).map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      try {
        abortControllerRef.current = new AbortController();

        await generateStream(
          conversationMessages,
          currentParams,
          (token) => {
            assistantMessage.content += token;
            updateLastMessage(assistantMessage.content);
          },
          (stats) => {
            const tokensPerSecond = (stats.tokensGenerated / stats.timeMs) * 1000;

            const metadata: MessageMetadata = {
              tokensGenerated: stats.tokensGenerated,
              generationTimeMs: stats.timeMs,
              tokensPerSecond,
              parameters: currentParams,
            };

            assistantMessage.metadata = metadata;
            updateLastMessage(assistantMessage.content);

            updateSessionStats({
              totalTokens: sessionStats.totalTokens + stats.tokensGenerated,
              totalGenerationTime: sessionStats.totalGenerationTime + stats.timeMs,
            });
          }
        );
      } catch (error) {
        console.error('Generation error:', error);
        assistantMessage.content = 'Error generating response. Please try again.';
        updateLastMessage(assistantMessage.content);
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col transition-colors">
      <Header modelStatus={modelStatus} />

      {modelStatus.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mx-4 sm:mx-6 mt-4 sm:mt-6 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">Model Loading Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300">{modelStatus.error}</p>
              {window.self !== window.top && (
                <div className="mt-3">
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in New Tab
                  </a>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    Opening in a new tab may resolve WebGPU permission issues in preview environments.
                  </p>
                </div>
              )}
              {window.self === window.top && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Check the Statistics panel for more details and troubleshooting steps.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row p-4 sm:p-6 max-w-[1800px] mx-auto w-full relative" data-layout-container>
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden min-w-0">
          <ChatContainer
            messages={messages}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
          />
          <ChatInput
            onSend={handleSendMessage}
            disabled={!modelStatus.isReady}
            isGenerating={isGenerating}
            onStop={handleStopGeneration}
          />
        </div>

        {/* Mobile: Floating toggle button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-20 right-4 z-40 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-200 hover:scale-110"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-6 h-6" />
            ) : (
              <PanelRightOpen className="w-6 h-6" />
            )}
          </button>
        )}

        {/* Desktop: Corner toggle button */}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <PanelRightClose className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <PanelRightOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        )}

        {/* Mobile: Full-screen overlay sidebar */}
        {isMobile && sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-slate-900 z-40 overflow-y-auto shadow-2xl">
              <div className="p-6 space-y-6">
                <StatsDashboard modelStatus={modelStatus} />
                <ParameterControls />
                <QuickTips />
                <BenchmarkPanel />
              </div>
            </div>
          </>
        )}

        {/* Desktop: Resizable sidebar */}
        {!isMobile && sidebarOpen && <ResizableDivider />}

        {!isMobile && (
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              sidebarOpen ? 'opacity-100' : 'w-0 opacity-0'
            }`}
            style={{ width: sidebarOpen ? `${sidebarWidth}px` : '0px' }}
          >
            <div className="h-full space-y-6 flex-shrink-0" style={{ width: `${sidebarWidth}px` }}>
              <StatsDashboard modelStatus={modelStatus} />
              <ParameterControls />
              <QuickTips />
              <BenchmarkPanel />
            </div>
          </div>
        )}
      </div>

      <HelpModal />
      <WelcomeTour />
      <ModelConfirmDialog />
      <DownloadRobotAssistant modelStatus={modelStatus} />
      <QuoteEditorModal />
    </div>
  );
}

export default App;