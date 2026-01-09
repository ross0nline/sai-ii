import { useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Lightbulb, Settings } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useHelpStore } from '../store/helpStore';

interface RobotMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export function RobotMenu({ isOpen, onClose, triggerRef }: RobotMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useThemeStore();
  const { showQuickTips, toggleQuickTips } = useHelpStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Settings className="w-4 h-4" />
          <span className="font-semibold text-sm">Settings</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                  theme === value
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              toggleQuickTips();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span className="flex-1 text-left">
              {showQuickTips ? 'Hide' : 'Show'} Quick Tips
            </span>
            <div
              className={`w-10 h-5 rounded-full transition-colors ${
                showQuickTips ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  showQuickTips ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
