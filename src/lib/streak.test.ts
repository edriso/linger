import { describe, expect, it } from 'vitest';
import { nextStreak } from './streak';

// A fixed local date: 10 March 2026, midday. Day key is "2026-03-10".
const NOW = new Date(2026, 2, 10, 12, 0, 0);

describe('nextStreak', () => {
  it('starts a streak at 1 on the first ever read', () => {
    expect(nextStreak({ streak: 0, lastReadDay: null }, NOW)).toBe(1);
  });

  it('does not change when already read today', () => {
    expect(nextStreak({ streak: 4, lastReadDay: '2026-03-10' }, NOW)).toBe(4);
  });

  it('continues the streak when the last read was yesterday', () => {
    expect(nextStreak({ streak: 4, lastReadDay: '2026-03-09' }, NOW)).toBe(5);
  });

  it('resets to 1 after a missed day', () => {
    expect(nextStreak({ streak: 4, lastReadDay: '2026-03-08' }, NOW)).toBe(1);
  });
});
