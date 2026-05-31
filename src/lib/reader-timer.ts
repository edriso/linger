/*
 * Pure reader timer + focus-guard state machine.
 *
 * It tracks total reading time and the current "unbroken" stretch. Leaving the
 * tab breaks the unbroken stretch (reset to 0, count an exit, pause), which is
 * the core reflex being retrained: not leaving. Driven by a hook; kept pure so
 * the focus-guard behavior can be tested without a browser.
 */

export interface ReaderState {
  // Total seconds read this session.
  elapsed: number;
  // The current unbroken stretch, in seconds.
  unbroken: number;
  // The longest unbroken stretch reached this session.
  longest: number;
  // How many times the reader left the tab (exits).
  breaks: number;
  running: boolean;
  done: boolean;
}

export function initReader(): ReaderState {
  return { elapsed: 0, unbroken: 0, longest: 0, breaks: 0, running: true, done: false };
}

/**
 * Advances the timer by one second. Completes the session once the unbroken
 * stretch reaches the target.
 */
export function tickReader(state: ReaderState, target: number): ReaderState {
  if (!state.running || state.done) {
    return state;
  }
  const unbroken = state.unbroken + 1;
  const longest = Math.max(state.longest, unbroken);
  const elapsed = state.elapsed + 1;
  const done = target > 0 && unbroken >= target;
  return { elapsed, unbroken, longest, breaks: state.breaks, running: !done, done };
}

/** The reader left the tab: break the unbroken stretch, count an exit, pause. */
export function registerLeave(state: ReaderState): ReaderState {
  if (state.done) {
    return state;
  }
  return { ...state, running: false, unbroken: 0, breaks: state.breaks + 1 };
}

/** The reader came back to the tab: resume (unless already finished). */
export function registerReturn(state: ReaderState): ReaderState {
  if (state.done) {
    return state;
  }
  return { ...state, running: true };
}

/** Manual pause / resume. */
export function togglePause(state: ReaderState): ReaderState {
  if (state.done) {
    return state;
  }
  return { ...state, running: !state.running };
}

/** Finish the session early ("Finish & reflect"). */
export function finishReading(state: ReaderState): ReaderState {
  return { ...state, running: false, done: true };
}
