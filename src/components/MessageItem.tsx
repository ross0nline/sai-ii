import { memo, useState } from 'react';
import { User, Bot, Info, Copy, Check, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Message } from '../types';
import { useSettingsStore } from '../store/settingsStore';

interface MessageItemProps {
  message: Message;
  onRegenerate?: () => void;
  isLastAssistantMessage?: boolean;
}

export const MessageItem = memo(({ message, onRegenerate, isLastAssistantMessage }: MessageItemProps) => {
  const [copied, setCopied] = useState(false);
  const { aiName, chatBubbleColors } = useSettingsStore();
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex gap-4 p-6 max-w-4xl mx-auto animate-fade-in">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
          <Info className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-block bg-blue-50 dark:bg-blue-900/30 rounded-3xl px-6 py-4 border border-blue-200 dark:border-blue-800">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
              System
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap break-words">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-4 p-6 max-w-4xl mx-auto hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors animate-fade-in">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
            : 'bg-gradient-to-br from-emerald-500 to-teal-500'
        }`}
      >
        {isUser ? (
          <User className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {isUser ? 'You' : aiName}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>

            {!isUser && isLastAssistantMessage && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            )}
          </div>
        </div>

        <div className={`inline-block max-w-full rounded-3xl px-6 py-4 shadow-md ${
          isUser
            ? `${chatBubbleColors.userBg} ${chatBubbleColors.userText}`
            : `${chatBubbleColors.assistantBg} border border-slate-200 dark:border-slate-700`
        }`}>
          {isUser ? (
            <div className="text-[15px] whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            <div className={`prose prose-sm dark:prose-invert max-w-none ${chatBubbleColors.assistantText} prose-headings:${chatBubbleColors.assistantText} prose-p:${chatBubbleColors.assistantText} prose-li:${chatBubbleColors.assistantText} prose-strong:${chatBubbleColors.assistantText} prose-pre:bg-slate-900 prose-pre:text-slate-100 dark:prose-pre:bg-slate-950 dark:prose-pre:text-slate-100 prose-code:text-cyan-600 dark:prose-code:text-cyan-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-a:text-blue-600 dark:prose-a:text-blue-400`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {message.metadata && !isUser && (
          <div className="mt-3 flex items-center gap-3">
            {message.metadata.tokensPerSecond && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {message.metadata.tokensPerSecond.toFixed(1)} tok/s
                </span>
              </div>
            )}
            {message.metadata.tokensGenerated && (
              <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {message.metadata.tokensGenerated} tokens
                </span>
              </div>
            )}
            {message.metadata.generationTimeMs && (
              <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {(message.metadata.generationTimeMs / 1000).toFixed(2)}s
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';
