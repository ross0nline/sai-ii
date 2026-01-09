import { X, Settings, Palette } from 'lucide-react';
import { useState } from 'react';
import { useSettingsStore, DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS } from '../store/settingsStore';
import { useThemeStore } from '../store/themeStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  {
    name: 'Default Light',
    colors: DEFAULT_LIGHT_COLORS,
    theme: 'light' as const,
  },
  {
    name: 'Default Dark',
    colors: DEFAULT_DARK_COLORS,
    theme: 'dark' as const,
  },
  {
    name: 'High Contrast (Light)',
    colors: {
      userBg: 'bg-indigo-600',
      userText: 'text-white',
      assistantBg: 'bg-white',
      assistantText: 'text-slate-900',
    },
    theme: 'light' as const,
  },
  {
    name: 'High Contrast (Dark)',
    colors: {
      userBg: 'bg-indigo-500',
      userText: 'text-white',
      assistantBg: 'bg-slate-800',
      assistantText: 'text-slate-50',
    },
    theme: 'dark' as const,
  },
  {
    name: 'Warm (Light)',
    colors: {
      userBg: 'bg-orange-500',
      userText: 'text-white',
      assistantBg: 'bg-amber-50',
      assistantText: 'text-slate-900',
    },
    theme: 'light' as const,
  },
  {
    name: 'Warm (Dark)',
    colors: {
      userBg: 'bg-orange-600',
      userText: 'text-white',
      assistantBg: 'bg-slate-800',
      assistantText: 'text-amber-50',
    },
    theme: 'dark' as const,
  },
  {
    name: 'Cool (Light)',
    colors: {
      userBg: 'bg-cyan-600',
      userText: 'text-white',
      assistantBg: 'bg-cyan-50',
      assistantText: 'text-slate-900',
    },
    theme: 'light' as const,
  },
  {
    name: 'Cool (Dark)',
    colors: {
      userBg: 'bg-cyan-600',
      userText: 'text-white',
      assistantBg: 'bg-slate-800',
      assistantText: 'text-cyan-50',
    },
    theme: 'dark' as const,
  },
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { aiName, setAiName, chatBubbleColors, setChatBubbleColors, resetChatBubbleColors, showChattyBot, setShowChattyBot } = useSettingsStore();
  const { getEffectiveTheme } = useThemeStore();
  const [tempName, setTempName] = useState(aiName);
  const currentTheme = getEffectiveTheme();

  if (!isOpen) return null;

  const handleSave = () => {
    setAiName(tempName.trim() || 'Assistant');
    onClose();
  };

  const handleReset = () => {
    setTempName('Assistant');
    setAiName('Assistant');
  };

  const handleColorPresetSelect = (presetColors: typeof DEFAULT_LIGHT_COLORS) => {
    setChatBubbleColors(presetColors);
  };

  const handleResetColors = () => {
    resetChatBubbleColors();
  };

  const filteredPresets = COLOR_PRESETS.filter(preset => preset.theme === currentTheme);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Personalization
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  AI Assistant Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Assistant"
                  maxLength={50}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Customize the name displayed for AI responses in the chat
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Display Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Show Chatty Bot
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Display the floating robot assistant that provides helpful tips and feedback
                  </p>
                </div>
                <button
                  onClick={() => setShowChattyBot(!showChattyBot)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showChattyBot ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showChattyBot ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Chat Bubble Colors
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Choose a color scheme for better readability in {currentTheme} mode
            </p>

            <div className="space-y-3">
              {filteredPresets.map((preset) => {
                const isSelected =
                  chatBubbleColors.userBg === preset.colors.userBg &&
                  chatBubbleColors.assistantBg === preset.colors.assistantBg;

                return (
                  <button
                    key={preset.name}
                    onClick={() => handleColorPresetSelect(preset.colors)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <span className="text-blue-500 dark:text-blue-400 text-sm font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded ${preset.colors.userBg} border border-slate-300 dark:border-slate-600`} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">User</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className={`w-8 h-8 rounded ${preset.colors.assistantBg} border border-slate-300 dark:border-slate-600`} />
                        <span className="text-xs text-slate-600 dark:text-slate-400">AI</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleResetColors}
              className="mt-4 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Reset Colors
            </button>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
