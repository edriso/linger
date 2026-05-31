import type { ReadingText } from '@/types/domain';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Reader } from './reader';

const text: ReadingText = {
  id: 'finish',
  custom: false,
  title: 'A Short Read',
  kicker: 'On staying',
  body: ['First paragraph.', 'Second paragraph.'],
  minutes: 1,
};

let hiddenValue = false;
beforeAll(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hiddenValue });
});

function setTabHidden(value: boolean) {
  hiddenValue = value;
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
}

describe('Reader', () => {
  afterEach(() => {
    hiddenValue = false;
  });

  it('reaches the target and moves to recall', () => {
    vi.useFakeTimers();
    render(<Reader text={text} target={2} onClose={() => {}} onComplete={() => {}} />);

    // Two one-second ticks reach the 2-second target.
    for (let i = 0; i < 2; i += 1) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText('You stayed.')).toBeInTheDocument();
    vi.useRealTimers();
  });

  describe('focus-guard', () => {
    beforeEach(() => {
      hiddenValue = false;
    });

    it('pauses when the tab is hidden and welcomes you back when it returns', () => {
      render(<Reader text={text} target={600} onClose={() => {}} onComplete={() => {}} />);

      setTabHidden(true);
      expect(screen.getByText('Paused.')).toBeInTheDocument();

      setTabHidden(false);
      expect(screen.getByText(/The page waited for you/)).toBeInTheDocument();
    });
  });
});
