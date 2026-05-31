import {
  type PersistedState,
  persistedStateSchema,
  type ReadingText,
  type Session,
} from '@/types/domain';
import { levels } from './content';
import { todayKey } from './date';
import { nextClearedLevels } from './level';
import { nextStreak } from './streak';

/*
 * The persistence seam. Components and the store never touch storage directly,
 * they go through this typed interface. It is backed by localStorage today; a
 * Dexie/IndexedDB version could slot in behind the same interface later (the
 * methods are written so an async implementation would be a small change).
 *
 * Persisted data is parsed with Zod, so a corrupt or out-of-date shape safely
 * falls back to sensible defaults instead of crashing.
 */

const STORAGE_KEY = 'linger-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: {
      theme: 'paper',
      readFont: 'Literata',
      fontSize: 20,
      measure: 38,
      guidedRamp: true,
    },
    library: [],
    progress: {
      sessions: [],
      clearedLevels: 0,
      longestEver: 0,
      totalSeconds: 0,
      streak: 0,
      lastReadDay: null,
    },
  };
}

export interface Repository {
  getState(): PersistedState;
  saveState(state: PersistedState): void;
  addText(text: ReadingText): PersistedState;
  removeText(id: string): PersistedState;
  completeSession(session: Session, now: Date): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function getState(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }

  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota). The app still works
      // for the current session; we just cannot persist.
    }
  }

  function addText(text: ReadingText): PersistedState {
    const current = getState();
    const next: PersistedState = { ...current, library: [...current.library, text] };
    saveState(next);
    return next;
  }

  function removeText(id: string): PersistedState {
    const current = getState();
    const next: PersistedState = {
      ...current,
      library: current.library.filter((text) => text.id !== id),
    };
    saveState(next);
    return next;
  }

  function completeSession(session: Session, now: Date): PersistedState {
    const current = getState();
    const progress = current.progress;
    const next: PersistedState = {
      ...current,
      progress: {
        sessions: [...progress.sessions, session],
        clearedLevels: nextClearedLevels(progress.clearedLevels, session, levels),
        longestEver: Math.max(progress.longestEver, session.longest),
        totalSeconds: progress.totalSeconds + session.seconds,
        streak: nextStreak(progress, now),
        lastReadDay: todayKey(now),
      },
    };
    saveState(next);
    return next;
  }

  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }

  return { getState, saveState, addText, removeText, completeSession, clear };
}

/** The app-wide repository instance, backed by the browser's localStorage. */
export const repository: Repository = createLocalStorageRepository();
