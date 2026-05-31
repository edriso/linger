import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  finishReading,
  initReader,
  type ReaderState,
  registerLeave,
  registerReturn,
  tickReader,
  togglePause,
} from '@/lib/reader-timer';
import { useInterval } from './use-interval';

export interface UseReaderSession {
  state: ReaderState;
  // Scroll position through the text, 0 to 1.
  scrollProgress: number;
  // Shows the gentle "you came back" note briefly after returning to the tab.
  leftNote: boolean;
  toggle: () => void;
  finishEarly: () => void;
  onScroll: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

const RETURN_NOTE_MS = 3200;

/**
 * Drives the pure reader timer with a one-second tick, wires the focus-guard to
 * the tab's visibility, and tracks scroll position. The timer functions are
 * pure, so the tricky focus-guard behavior is unit-tested separately.
 */
export function useReaderSession(target: number): UseReaderSession {
  const [state, setState] = useState<ReaderState>(() => initReader());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [leftNote, setLeftNote] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const noteTimer = useRef<number | null>(null);

  // Tick once a second while running. tickReader is pure, so calling it inside
  // the updater is safe (even under StrictMode's double invoke).
  useInterval(
    () => setState((current) => tickReader(current, target)),
    state.running && !state.done ? 1000 : null,
  );

  // Focus-guard: leaving the tab breaks the unbroken stretch; returning resumes
  // and shows a gentle note.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setState((current) => registerLeave(current));
      } else {
        setState((current) => registerReturn(current));
        setLeftNote(true);
        if (noteTimer.current !== null) {
          window.clearTimeout(noteTimer.current);
        }
        noteTimer.current = window.setTimeout(() => setLeftNote(false), RETURN_NOTE_MS);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (noteTimer.current !== null) {
        window.clearTimeout(noteTimer.current);
      }
    };
  }, []);

  const toggle = useCallback(() => setState((current) => togglePause(current)), []);
  const finishEarly = useCallback(() => setState((current) => finishReading(current)), []);

  const onScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    const max = element.scrollHeight - element.clientHeight;
    setScrollProgress(max > 0 ? Math.min(1, element.scrollTop / max) : 0);
  }, []);

  return { state, scrollProgress, leftNote, toggle, finishEarly, onScroll, scrollRef };
}
