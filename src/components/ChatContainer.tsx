import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { SuggestedPrompts } from './SuggestedPrompts';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
  isGenerating?: boolean;
  onSendMessage?: (message: string) => void;
  onRegenerate?: () => void;
}

export function ChatContainer({ messages, isGenerating, onSendMessage, onRegenerate }: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  // Auto-scroll when messages change, always scroll during generation
  useEffect(() => {
    if (isGenerating || !userHasScrolled) {
      scrollToBottom('auto');
    }
  }, [messages, userHasScrolled, isGenerating]);

  // Reset scroll tracking when user sends a new message
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.role === 'user') {
      setUserHasScrolled(false);
    }
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      setShowScrollButton(!isNearBottom && messages.length > 0);

      if (isNearBottom) {
        setUserHasScrolled(false);
      } else {
        setUserHasScrolled(true);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  const lastAssistantMessageIndex = messages.map((m, i) => ({ msg: m, idx: i }))
    .reverse()
    .find(({ msg }) => msg.role === 'assistant')?.idx;

  if (messages.length === 0) {
    return (
      <SuggestedPrompts onSelectPrompt={onSendMessage || (() => {})} />
    );
  }

  return (
    <div className="flex-1 relative flex flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 min-h-0"></div>
        <div className="py-4">
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              onRegenerate={index === lastAssistantMessageIndex ? onRegenerate : undefined}
              isLastAssistantMessage={index === lastAssistantMessageIndex}
            />
          ))}
          {isGenerating && messages[messages.length - 1]?.role === 'user' && (
            <TypingIndicator />
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={() => {
            scrollToBottom('smooth');
            setUserHasScrolled(false);
          }}
          className="absolute bottom-6 right-6 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-3 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
