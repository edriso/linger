import type { Session } from '@/types/domain';
import type { Level } from './content';

/*
 * Pure ramp logic: which level you are on, and whether a finished session
 * clears the current target and advances you.
 */

/** The index into the levels array for the current level. */
export function currentLevelIndex(
  clearedLevels: number,
  guidedRamp: boolean,
  totalLevels: number,
): number {
  if (!guidedRamp) {
    // Free reading: always show the longest target so there is no pressure.
    return totalLevels - 1;
  }
  return Math.min(clearedLevels, totalLevels - 1);
}

export function currentLevel(clearedLevels: number, guidedRamp: boolean, levels: Level[]): Level {
  return levels[currentLevelIndex(clearedLevels, guidedRamp, levels.length)];
}

/**
 * The new clearedLevels count after a session. Advances by one only when the
 * session was cleared against (at least) the current level's target.
 */
export function nextClearedLevels(
  clearedLevels: number,
  session: Pick<Session, 'cleared' | 'target'>,
  levels: Level[],
): number {
  const index = Math.min(clearedLevels, levels.length - 1);
  const currentTargetSeconds = levels[index].target * 60;
  if (session.cleared && session.target >= currentTargetSeconds) {
    return Math.min(clearedLevels + 1, levels.length);
  }
  return clearedLevels;
}
