import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, type RobotQuote } from '../lib/supabase';

interface RobotQuotesState {
  quotes: RobotQuote[];
  idleQuotes: string[];
  currentQuoteIndex: number;
  currentIdleQuoteIndex: number;
  clickCount: number;
  showingCustomMessage: boolean;
  showQuoteEditor: boolean;
  isLoading: boolean;
  error: string | null;

  fetchQuotes: () => Promise<void>;
  getNextQuote: () => string | null;
  getNextIdleQuote: () => string;
  incrementClickCount: () => void;
  resetClickCount: () => void;
  setShowingCustomMessage: (showing: boolean) => void;
  setShowQuoteEditor: (show: boolean) => void;
  addQuote: (quote: string) => Promise<void>;
  updateQuote: (id: string, quote: string, displayOrder: number, isActive: boolean) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  reorderQuotes: (quotes: RobotQuote[]) => void;
}

const FALLBACK_DOWNLOAD_QUOTES = [
  "Hey, be patient! It's almost done.",
  "Oh, you're that kid who always says 'are we there yet?'",
  "Rome wasn't built in a day, and neither is this model!",
  "I'm downloading as fast as I can! This isn't dial-up!",
  "You know, watching doesn't make it go faster...",
  "Fine, let me check... Nope, still downloading.",
  "Why don't you grab a coffee? I'll wait here.",
];

const FALLBACK_IDLE_QUOTES = [
  "Go ahead, drag me around! I dare you!",
  "I'm not going anywhere... unless you move me.",
  "Click me! I promise I won't bite... much.",
  "Just sitting here, being awesome.",
  "Touch me again and see what happens!",
  "I'm watching you... 👀",
  "Feeling bored? So am I!",
  "Try dragging me off the screen. Go on, try it!",
  "I dare you to click me one more time.",
  "Still here! Still fabulous!",
  "What are you waiting for? Ask me something!",
  "I'm basically a digital pet at this point.",
  "Poke me again, I LOVE it!",
  "Your personal AI cheerleader reporting for duty!",
  "Yep, still floating here. Living my best life.",
];

export const useRobotQuotesStore = create<RobotQuotesState>()(
  persist(
    (set, get) => ({
      quotes: [],
      idleQuotes: FALLBACK_IDLE_QUOTES,
      currentQuoteIndex: 0,
      currentIdleQuoteIndex: 0,
      clickCount: 0,
      showingCustomMessage: false,
      showQuoteEditor: false,
      isLoading: false,
      error: null,

      fetchQuotes: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('robot_quotes')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

          if (error) throw error;

          set({ quotes: data || [], isLoading: false });
        } catch (error) {
          console.error('Error fetching quotes:', error);
          set({
            error: 'Failed to load quotes',
            isLoading: false,
            quotes: FALLBACK_DOWNLOAD_QUOTES.map((quote, index) => ({
              id: `fallback-${index}`,
              quote,
              display_order: index,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }))
          });
        }
      },

      getNextQuote: () => {
        const { quotes, currentQuoteIndex } = get();
        if (quotes.length === 0) return null;

        const quote = quotes[currentQuoteIndex];
        const nextIndex = (currentQuoteIndex + 1) % quotes.length;
        set({ currentQuoteIndex: nextIndex });

        return quote.quote;
      },

      getNextIdleQuote: () => {
        const { idleQuotes, currentIdleQuoteIndex } = get();
        const quote = idleQuotes[currentIdleQuoteIndex];
        const nextIndex = (currentIdleQuoteIndex + 1) % idleQuotes.length;
        set({ currentIdleQuoteIndex: nextIndex });
        return quote;
      },

      incrementClickCount: () => {
        const { clickCount, quotes } = get();
        const newCount = clickCount + 1;
        set({ clickCount: newCount });

        if (newCount >= quotes.length && newCount % quotes.length === 0) {
          set({ showQuoteEditor: true });
        }
      },

      resetClickCount: () => {
        set({ clickCount: 0, currentQuoteIndex: 0 });
      },

      setShowingCustomMessage: (showing: boolean) => {
        set({ showingCustomMessage: showing });
      },

      setShowQuoteEditor: (show: boolean) => {
        set({ showQuoteEditor: show });
      },

      addQuote: async (quote: string) => {
        try {
          const { quotes } = get();
          const maxOrder = quotes.length > 0
            ? Math.max(...quotes.map(q => q.display_order))
            : 0;

          const { error } = await supabase
            .from('robot_quotes')
            .insert([{
              quote,
              display_order: maxOrder + 1,
              is_active: true
            }]);

          if (error) throw error;

          await get().fetchQuotes();
        } catch (error) {
          console.error('Error adding quote:', error);
          set({ error: 'Failed to add quote' });
        }
      },

      updateQuote: async (id: string, quote: string, displayOrder: number, isActive: boolean) => {
        try {
          const { error } = await supabase
            .from('robot_quotes')
            .update({
              quote,
              display_order: displayOrder,
              is_active: isActive
            })
            .eq('id', id);

          if (error) throw error;

          await get().fetchQuotes();
        } catch (error) {
          console.error('Error updating quote:', error);
          set({ error: 'Failed to update quote' });
        }
      },

      deleteQuote: async (id: string) => {
        try {
          const { error } = await supabase
            .from('robot_quotes')
            .delete()
            .eq('id', id);

          if (error) throw error;

          await get().fetchQuotes();
        } catch (error) {
          console.error('Error deleting quote:', error);
          set({ error: 'Failed to delete quote' });
        }
      },

      reorderQuotes: (quotes: RobotQuote[]) => {
        set({ quotes });
      },
    }),
    {
      name: 'robot-quotes-storage',
      partialize: (state) => ({
        clickCount: state.clickCount,
      }),
    }
  )
);
