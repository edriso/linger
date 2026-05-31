import { describe, expect, it } from 'vitest';
import type { ReadingText } from '@/types/domain';
import {
  estimateMinutes,
  estimateMinutesFromWords,
  makeCustomText,
  normalizeParagraphs,
  wordCount,
} from './text';

describe('normalizeParagraphs', () => {
  it('splits on blank lines', () => {
    expect(normalizeParagraphs('First para.\n\nSecond para.')).toEqual([
      'First para.',
      'Second para.',
    ]);
  });

  it('collapses single newlines and stray whitespace inside a paragraph', () => {
    expect(normalizeParagraphs('a line\nbroken here\n\nnext')).toEqual([
      'a line broken here',
      'next',
    ]);
  });

  it('trims and drops empty paragraphs', () => {
    expect(normalizeParagraphs('\n\n  only  \n\n\n')).toEqual(['only']);
  });
});

describe('wordCount', () => {
  it('counts words, ignoring extra whitespace', () => {
    expect(wordCount('  hello   there  friend ')).toBe(3);
  });

  it('is zero for empty text', () => {
    expect(wordCount('   ')).toBe(0);
  });
});

describe('estimateMinutesFromWords', () => {
  it('rounds to whole minutes with a floor of 1', () => {
    expect(estimateMinutesFromWords(10)).toBe(1);
    expect(estimateMinutesFromWords(220)).toBe(1);
    expect(estimateMinutesFromWords(660)).toBe(3);
  });
});

describe('estimateMinutes', () => {
  it('uses the stored minutes when present', () => {
    const text: ReadingText = {
      id: 'x',
      custom: false,
      title: 't',
      kicker: 'k',
      body: ['hi'],
      minutes: 5,
    };
    expect(estimateMinutes(text)).toBe(5);
  });

  it('computes from the body when minutes are missing', () => {
    const body = ['word '.repeat(220).trim()];
    const text: ReadingText = { id: 'x', custom: true, title: 't', kicker: 'k', body };
    expect(estimateMinutes(text)).toBe(1);
  });
});

describe('makeCustomText', () => {
  it('builds a custom text with a default title and normalized paragraphs', () => {
    const text = makeCustomText({ id: 'u1', title: '   ', body: 'one\n\ntwo' });
    expect(text.id).toBe('u1');
    expect(text.custom).toBe(true);
    expect(text.title).toBe('Untitled');
    expect(text.body).toEqual(['one', 'two']);
    expect(text.minutes).toBeGreaterThanOrEqual(1);
  });
});
