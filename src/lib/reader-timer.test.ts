import { describe, expect, it } from 'vitest';
import {
  finishReading,
  initReader,
  type ReaderState,
  registerLeave,
  registerReturn,
  tickReader,
  togglePause,
} from './reader-timer';

function state(overrides: Partial<ReaderState> = {}): ReaderState {
  return {
    elapsed: 0,
    unbroken: 0,
    longest: 0,
    breaks: 0,
    running: true,
    done: false,
    ...overrides,
  };
}

describe('reader-timer', () => {
  it('starts running with everything at zero', () => {
    expect(initReader()).toEqual({
      elapsed: 0,
      unbroken: 0,
      longest: 0,
      breaks: 0,
      running: true,
      done: false,
    });
  });

  it('counts up elapsed, unbroken, and longest on each tick', () => {
    const next = tickReader(state({ unbroken: 3, longest: 3, elapsed: 3 }), 60);
    expect(next).toMatchObject({ elapsed: 4, unbroken: 4, longest: 4, done: false });
  });

  it('keeps the longest stretch even after the current one resets', () => {
    // Leave (which pauses and resets), return (which resumes), then tick.
    const afterLeave = registerLeave(state({ unbroken: 9, longest: 9, elapsed: 9 }));
    const afterReturn = registerReturn(afterLeave);
    const next = tickReader(afterReturn, 60);
    // unbroken restarts at 1, but longest stays at 9.
    expect(next.unbroken).toBe(1);
    expect(next.longest).toBe(9);
  });

  it('completes once the unbroken stretch reaches the target', () => {
    const next = tickReader(state({ unbroken: 4, longest: 4, elapsed: 4 }), 5);
    expect(next.unbroken).toBe(5);
    expect(next.done).toBe(true);
    expect(next.running).toBe(false);
  });

  it('does not tick when paused or finished', () => {
    const paused = state({ running: false });
    expect(tickReader(paused, 60)).toBe(paused);
    const finished = state({ done: true });
    expect(tickReader(finished, 60)).toBe(finished);
  });

  describe('focus-guard', () => {
    it('leaving the tab breaks the unbroken stretch, counts an exit, and pauses', () => {
      const next = registerLeave(state({ unbroken: 12, longest: 12, breaks: 1 }));
      expect(next.unbroken).toBe(0);
      expect(next.breaks).toBe(2);
      expect(next.running).toBe(false);
    });

    it('returning to the tab resumes', () => {
      const next = registerReturn(state({ running: false }));
      expect(next.running).toBe(true);
    });

    it('does nothing on leave or return once finished', () => {
      const finished = state({ done: true });
      expect(registerLeave(finished)).toBe(finished);
      expect(registerReturn(finished)).toBe(finished);
    });
  });

  it('toggles pause', () => {
    expect(togglePause(state({ running: true })).running).toBe(false);
    expect(togglePause(state({ running: false })).running).toBe(true);
  });

  it('finishes early', () => {
    const next = finishReading(state({ unbroken: 30 }));
    expect(next.done).toBe(true);
    expect(next.running).toBe(false);
  });
});
