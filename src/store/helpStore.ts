import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type HelpTab = 'getting-started' | 'parameters' | 'statistics' | 'benchmarking' | 'troubleshooting';

interface HelpState {
  isHelpOpen: boolean;
  currentTab: HelpTab;
  hasSeenWelcome: boolean;
  hasCompletedTour: boolean;
  showQuickTips: boolean;
  setHelpOpen: (open: boolean) => void;
  setCurrentTab: (tab: HelpTab) => void;
  markWelcomeSeen: () => void;
  markTourCompleted: () => void;
  toggleQuickTips: () => void;
  resetTour: () => void;
}

export const useHelpStore = create<HelpState>()(
  persist(
    (set) => ({
      isHelpOpen: false,
      currentTab: 'getting-started',
      hasSeenWelcome: false,
      hasCompletedTour: false,
      showQuickTips: true,
      setHelpOpen: (open) => set({ isHelpOpen: open }),
      setCurrentTab: (tab) => set({ currentTab: tab }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),
      markTourCompleted: () => set({ hasCompletedTour: true }),
      toggleQuickTips: () => set((state) => ({ showQuickTips: !state.showQuickTips })),
      resetTour: () => set({ hasSeenWelcome: false, hasCompletedTour: false }),
    }),
    {
      name: 'inference-lab-help',
      partialize: (state) => ({
        hasSeenWelcome: state.hasSeenWelcome,
        hasCompletedTour: state.hasCompletedTour,
        showQuickTips: state.showQuickTips,
      }),
    }
  )
);
