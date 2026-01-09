import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
  sidebarWidth: number;
  sidebarOpen: boolean;
  minSidebarWidth: number;
  maxSidebarWidth: number;
  statsPanelCollapsed: boolean;
  parametersPanelCollapsed: boolean;
  benchmarkPanelCollapsed: boolean;
  setSidebarWidth: (width: number) => void;
  setSidebarOpen: (open: boolean) => void;
  resetSidebarWidth: () => void;
  toggleStatsPanel: () => void;
  toggleParametersPanel: () => void;
  toggleBenchmarkPanel: () => void;
}

const DEFAULT_SIDEBAR_WIDTH = 384;
const MIN_SIDEBAR_WIDTH = 280;
const MAX_SIDEBAR_WIDTH = 600;

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      sidebarOpen: true,
      minSidebarWidth: MIN_SIDEBAR_WIDTH,
      maxSidebarWidth: MAX_SIDEBAR_WIDTH,
      statsPanelCollapsed: false,
      parametersPanelCollapsed: false,
      benchmarkPanelCollapsed: false,

      setSidebarWidth: (width: number) => {
        const clampedWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, width)
        );
        set({ sidebarWidth: clampedWidth });
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      resetSidebarWidth: () => {
        set({ sidebarWidth: DEFAULT_SIDEBAR_WIDTH });
      },

      toggleStatsPanel: () => {
        set((state) => ({ statsPanelCollapsed: !state.statsPanelCollapsed }));
      },

      toggleParametersPanel: () => {
        set((state) => ({ parametersPanelCollapsed: !state.parametersPanelCollapsed }));
      },

      toggleBenchmarkPanel: () => {
        set((state) => ({ benchmarkPanelCollapsed: !state.benchmarkPanelCollapsed }));
      },
    }),
    {
      name: 'layout-storage',
    }
  )
);
