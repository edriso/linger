import type { ReadingText } from '@/types/domain';
import { WORDS_PER_MINUTE } from './constants';

/*
 * Pure helpers for turning pasted text into a clean, readable shape.
 * Cross-origin URL fetch is CORS-blocked in a static app, so pasting plain
 * text is the reliable path. We normalize it into paragraphs here.
 */

/**
 * Splits raw pasted text into paragraphs: break on blank lines, collapse the
 * single newlines and stray whitespace inside a paragraph, and drop empties.
 */
export function normalizeParagraphs(raw: string): string[] {
  return raw
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function estimateMinutesFromWords(words: number): number {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** The reading-time estimate for a piece, using its stored value if present. */
export function estimateMinutes(text: ReadingText): number {
  if (text.minutes) {
    return text.minutes;
  }
  return estimateMinutesFromWords(wordCount(text.body.join(' ')));
}

/** Builds a library text from the paste-sheet inputs. `id` is passed in. */
export function makeCustomText(input: { id: string; title: string; body: string }): ReadingText {
  const paragraphs = normalizeParagraphs(input.body);
  const words = wordCount(input.body);
  return {
    id: input.id,
    custom: true,
    title: input.title.trim() || 'Untitled',
    kicker: 'Your text',
    body: paragraphs.length > 0 ? paragraphs : [input.body.trim()],
    minutes: estimateMinutesFromWords(words),
  };
}
