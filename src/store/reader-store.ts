import { create } from 'zustand';
import type { ReadingText } from '@/types/domain';

interface ReaderStoreState {
  // The text currently open in the full-screen Reader, or null if closed.
  activeText: ReadingText | null;
  open: (text: ReadingText) => void;
  close: () => void;
}

/** Tracks which text (if any) is open in the Reader. */
export const useReaderStore = create<ReaderStoreState>((set) => ({
  activeText: null,
  open: (text) => set({ activeText: text }),
  close: () => set({ activeText: null }),
}));
