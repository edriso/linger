import { addDays, todayKey } from './date';

/*
 * Pure streak logic. The streak counts consecutive days with at least one
 * reading session. Kept out of components so it is easy to test.
 */

interface StreakInput {
  streak: number;
  lastReadDay: string | null;
}

/**
 * The streak value after reading happens `now`.
 * - Already read today: unchanged (one bump per day).
 * - Last read yesterday: +1 (the streak continues).
 * - A bigger gap, or the first ever read: resets to 1.
 */
export function nextStreak(input: StreakInput, now: Date): number {
  const today = todayKey(now);
  const yesterday = todayKey(addDays(now, -1));

  if (input.lastReadDay === today) {
    return input.streak;
  }
  if (input.lastReadDay === yesterday) {
    return input.streak + 1;
  }
  return 1;
}
