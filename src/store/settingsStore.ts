import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatBubbleColors {
  userBg: string;
  userText: string;
  assistantBg: string;
  assistantText: string;
}

interface SettingsState {
  aiName: string;
  chatBubbleColors: ChatBubbleColors;
  showChattyBot: boolean;
  setAiName: (name: string) => void;
  setChatBubbleColors: (colors: Partial<ChatBubbleColors>) => void;
  resetChatBubbleColors: () => void;
  setShowChattyBot: (show: boolean) => void;
}

const DEFAULT_LIGHT_COLORS: ChatBubbleColors = {
  userBg: 'bg-blue-500',
  userText: 'text-white',
  assistantBg: 'bg-slate-100',
  assistantText: 'text-slate-900',
};

const DEFAULT_DARK_COLORS: ChatBubbleColors = {
  userBg: 'bg-blue-600',
  userText: 'text-white',
  assistantBg: 'bg-slate-700',
  assistantText: 'text-slate-100',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      aiName: 'Assistant',
      chatBubbleColors: DEFAULT_LIGHT_COLORS,
      showChattyBot: true,

      setAiName: (name: string) => set({ aiName: name }),

      setChatBubbleColors: (colors: Partial<ChatBubbleColors>) =>
        set({
          chatBubbleColors: {
            ...get().chatBubbleColors,
            ...colors
          }
        }),

      resetChatBubbleColors: () => {
        const isDark = document.documentElement.classList.contains('dark');
        set({ chatBubbleColors: isDark ? DEFAULT_DARK_COLORS : DEFAULT_LIGHT_COLORS });
      },

      setShowChattyBot: (show: boolean) => set({ showChattyBot: show }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

export { DEFAULT_LIGHT_COLORS, DEFAULT_DARK_COLORS };
