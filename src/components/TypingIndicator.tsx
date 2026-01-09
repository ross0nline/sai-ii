import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-4 p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
        <Bot className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 rounded-3xl px-6 py-4 shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
