import { z } from 'zod';

export const THEME_IDS = ['paper', 'dark', 'auto'] as const;
export const themeSchema = z.enum(THEME_IDS);
export type Theme = z.infer<typeof themeSchema>;

export const READ_FONT_IDS = ['Literata', 'Newsreader', 'System sans'] as const;
export const readFontSchema = z.enum(READ_FONT_IDS);
export type ReadFontId = z.infer<typeof readFontSchema>;

/** Reading and look preferences. */
export const settingsSchema = z.object({
  theme: themeSchema,
  readFont: readFontSchema,
  fontSize: z.number().int().min(17).max(24),
  // Line-width slider value; the real CSS measure is this plus a base, in rem.
  measure: z.number().int().min(28).max(48),
  // When off, there are no level targets (free reading).
  guidedRamp: z.boolean(),
});
export type Settings = z.infer<typeof settingsSchema>;

/** A readable piece: a starter-shelf essay or a user's pasted text. */
export const readingTextSchema = z.object({
  id: z.string(),
  custom: z.boolean(),
  title: z.string(),
  kicker: z.string(),
  // The body is already normalized into paragraphs.
  body: z.array(z.string()),
  minutes: z.number().int().positive().optional(),
});
export type ReadingText = z.infer<typeof readingTextSchema>;

/** One completed reading session, stored in the log. */
export const sessionSchema = z.object({
  textId: z.string(),
  title: z.string(),
  at: z.number(),
  seconds: z.number().int().nonnegative(),
  longest: z.number().int().nonnegative(),
  breaks: z.number().int().nonnegative(),
  cleared: z.boolean(),
  // The target (in seconds) this session was read against.
  target: z.number().int().nonnegative(),
  recall: z.string(),
});
export type Session = z.infer<typeof sessionSchema>;

/** Training progress: the log plus the derived totals and the ramp position. */
export const progressSchema = z.object({
  sessions: z.array(sessionSchema),
  clearedLevels: z.number().int().nonnegative(),
  longestEver: z.number().int().nonnegative(),
  totalSeconds: z.number().int().nonnegative(),
  streak: z.number().int().nonnegative(),
  lastReadDay: z.string().nullable(),
});
export type Progress = z.infer<typeof progressSchema>;

/** Everything we persist, wrapped with a version for safe future migrations. */
export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  library: z.array(readingTextSchema),
  progress: progressSchema,
});
export type PersistedState = z.infer<typeof persistedStateSchema>;
