import { beforeEach, describe, expect, it } from 'vitest';
import type { ReadingText, Session } from '@/types/domain';
import { levels } from './content';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  } as Storage;
}

const sampleText: ReadingText = {
  id: 'u1',
  custom: true,
  title: 'My text',
  kicker: 'Your text',
  body: ['hello there'],
  minutes: 2,
};

const NOW = new Date(2026, 2, 10, 12, 0, 0);

describe('localStorage repository', () => {
  let repo: Repository;
  let storage: Storage;

  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });

  it('returns sensible defaults when nothing is stored', () => {
    const state = repo.getState();
    expect(state.version).toBe(1);
    expect(state.settings.theme).toBe('paper');
    expect(state.library).toEqual([]);
    expect(state.progress.streak).toBe(0);
  });

  it('falls back to defaults on corrupt JSON', () => {
    storage.setItem('linger-v1', 'not json at all');
    expect(repo.getState().progress.streak).toBe(0);
  });

  it('falls back to defaults on a valid-JSON but wrong shape', () => {
    storage.setItem('linger-v1', JSON.stringify({ version: 1 }));
    expect(repo.getState().settings.theme).toBe('paper');
  });

  it('adds and removes a library text', () => {
    expect(repo.addText(sampleText).library).toHaveLength(1);
    expect(repo.getState().library[0].title).toBe('My text');
    expect(repo.removeText('u1').library).toHaveLength(0);
  });

  it('records a cleared session: totals, streak, and a level advance', () => {
    const target = levels[0].target * 60;
    const session: Session = {
      textId: 'finish',
      title: 'Why You Cannot Finish Things',
      at: 1,
      seconds: 600,
      longest: target + 30,
      breaks: 0,
      cleared: true,
      target,
      recall: 'Staying is a skill.',
    };

    const next = repo.completeSession(session, NOW);

    expect(next.progress.sessions).toHaveLength(1);
    expect(next.progress.longestEver).toBe(target + 30);
    expect(next.progress.totalSeconds).toBe(600);
    expect(next.progress.streak).toBe(1);
    expect(next.progress.clearedLevels).toBe(1);
    expect(next.progress.lastReadDay).toBe('2026-03-10');
  });

  it('does not advance the level for an uncleared session', () => {
    const session: Session = {
      textId: 'finish',
      title: 'A read',
      at: 2,
      seconds: 120,
      longest: 90,
      breaks: 2,
      cleared: false,
      target: levels[0].target * 60,
      recall: '',
    };
    expect(repo.completeSession(session, NOW).progress.clearedLevels).toBe(0);
  });
});
