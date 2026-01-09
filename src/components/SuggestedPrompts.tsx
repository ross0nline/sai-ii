import { Sparkles, Code, Lightbulb, MessageCircle, BookOpen, Zap } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    icon: Sparkles,
    title: 'Creative Writing',
    prompt: 'Write a short story about a robot learning to paint',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code,
    title: 'Code Help',
    prompt: 'Explain how async/await works in JavaScript with examples',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Explain Concepts',
    prompt: 'Explain quantum computing in simple terms',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: MessageCircle,
    title: 'Problem Solving',
    prompt: 'Help me brainstorm ideas for a sustainable tech project',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BookOpen,
    title: 'Learning',
    prompt: 'What are the key principles of machine learning?',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Quick Question',
    prompt: 'What is the difference between AI and machine learning?',
    gradient: 'from-rose-500 to-red-500',
  },
];

export function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            What can I help you with today?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Choose a starter prompt or type your own message below
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => onSelectPrompt(item.prompt)}
                className="group relative p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left border border-slate-200 dark:border-slate-700"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.prompt}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
