import { describe, expect, it } from 'vitest';
import { levels } from './content';
import { currentLevelIndex, nextClearedLevels } from './level';

describe('currentLevelIndex', () => {
  it('follows clearedLevels when the ramp is on', () => {
    expect(currentLevelIndex(0, true, 10)).toBe(0);
    expect(currentLevelIndex(3, true, 10)).toBe(3);
  });

  it('clamps to the last level', () => {
    expect(currentLevelIndex(20, true, 10)).toBe(9);
  });

  it('shows the top level when the ramp is off (free reading)', () => {
    expect(currentLevelIndex(0, false, 10)).toBe(9);
  });
});

describe('nextClearedLevels', () => {
  const firstTarget = levels[0].target * 60;

  it('advances by one when a session clears the current target', () => {
    expect(nextClearedLevels(0, { cleared: true, target: firstTarget }, levels)).toBe(1);
  });

  it('does not advance when the session was not cleared', () => {
    expect(nextClearedLevels(0, { cleared: false, target: firstTarget }, levels)).toBe(0);
  });

  it('does not advance for free reading (target 0)', () => {
    expect(nextClearedLevels(0, { cleared: true, target: 0 }, levels)).toBe(0);
  });

  it('caps at the number of levels', () => {
    const lastTarget = levels[levels.length - 1].target * 60;
    expect(nextClearedLevels(10, { cleared: true, target: lastTarget }, levels)).toBe(10);
  });
});
