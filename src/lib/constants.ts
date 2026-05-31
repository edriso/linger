import type { ReadFontId, Theme } from '@/types/domain';

/** Reading font choices, mapped to their CSS font stacks. */
export const READ_FONTS: Record<ReadFontId, string> = {
  Literata: "'Literata', Georgia, serif",
  Newsreader: "'Newsreader', Georgia, serif",
  'System sans': "'Hanken Grotesk', system-ui, sans-serif",
};

export const READ_FONT_OPTIONS: ReadFontId[] = ['Literata', 'Newsreader', 'System sans'];

export const FONT_SIZE = { min: 17, max: 24, step: 1 };

// The line-width slider value plus this base gives the CSS measure, in rem.
export const MEASURE = { min: 28, max: 48, step: 2, base: 22 };

export const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'paper', label: 'Paper' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
];

// A pasted read needs at least this many characters to be worth saving.
export const MIN_PASTE_LENGTH = 40;

// Reading-time estimate: average adult reads roughly this many words a minute.
export const WORDS_PER_MINUTE = 220;
