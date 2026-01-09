import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MODEL_NAME } from '../constants';

interface ModelStore {
  selectedModelId: string;
  isModelSelectorOpen: boolean;
  showSwitchConfirmation: boolean;
  pendingModelId: string | null;
  shouldLoadModel: boolean;
  setSelectedModelId: (modelId: string) => void;
  setModelSelectorOpen: (isOpen: boolean) => void;
  requestModelSwitch: (modelId: string) => void;
  confirmModelSwitch: () => void;
  cancelModelSwitch: () => void;
  setShouldLoadModel: (should: boolean) => void;
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      selectedModelId: MODEL_NAME,
      isModelSelectorOpen: false,
      showSwitchConfirmation: false,
      pendingModelId: null,
      shouldLoadModel: false,

      setSelectedModelId: (modelId: string) => {
        set({ selectedModelId: modelId });
      },

      setModelSelectorOpen: (isOpen: boolean) => {
        set({ isModelSelectorOpen: isOpen });
      },

      requestModelSwitch: (modelId: string) => {
        set({
          pendingModelId: modelId,
          showSwitchConfirmation: true,
        });
      },

      confirmModelSwitch: () => {
        const { pendingModelId } = get();
        if (pendingModelId) {
          set({
            selectedModelId: pendingModelId,
            showSwitchConfirmation: false,
            pendingModelId: null,
          });
        }
      },

      cancelModelSwitch: () => {
        set({
          showSwitchConfirmation: false,
          pendingModelId: null,
        });
      },

      setShouldLoadModel: (should: boolean) => {
        set({ shouldLoadModel: should });
      },
    }),
    {
      name: 'model-storage',
      partialize: (state) => ({ selectedModelId: state.selectedModelId }),
    }
  )
);
