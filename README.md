# Linger

A calm, frontend-only web app that helps you rebuild the deep, sustained
attention that short-form video erodes. Tagline: **"Stay with the page."**
Feeds train the mind to leave; reading trains it to stay. Linger is a
**couch-to-5k for attention**, built around undistracted reading: start small,
read unbroken, and build the muscle back.

It is not an e-reader, a read-later list, or a website blocker. It is a trainer.
There is no backend, no account, and no network calls. Everything is stored on
your own device and the app works fully offline.

---

## What you can do

- **Read** (home): your current level on the ramp, a way into a piece, honest
  stats (longest unbroken read, total read, day streak), a couple of shelf
  suggestions, and a rotating field note.
- **Library**: paste your own long read (saved on your device) or pick from a
  built-in shelf of three short, original, on-theme essays.
- **Progress**: the 10-level ramp (cleared levels checked, current highlighted)
  and a reading log with the recall note you saved.
- **The Reader**: a full-screen, distraction-free reading view. A quiet bar
  fills as your unbroken stretch grows toward the level target. When you finish
  the target (or tap "Finish & reflect"), you write one line of recall.

**The focus-guard (the core idea).** Leaving the tab breaks your unbroken
stretch: it resets to zero, counts an exit, and pauses. When you come back, a
gentle note says "You stepped away. The page waited for you." It is never
punitive. The reflex being retrained is simply not leaving.

The content is evidence-based but gentle: the reading brain is built, not innate,
and what disuse weakens, use can rebuild. It is general guidance, not a
productivity cudgel.

---

## Tech stack

- **React 19 + TypeScript** (strict), built with **Vite**
- **Tailwind CSS v4** (configured in CSS with `@theme`, no `tailwind.config.js`)
- **Zustand** for state, **React Router** for the three routes
- **React Hook Form + Zod** for the paste-text and recall inputs, and for
  validating saved data
- **vite-plugin-pwa** so the app is installable and works offline
- **Vitest** + **Testing Library** for unit and component tests, **Playwright**
  for browser tests

---

## Getting started

You need **Node 20 or newer** and **pnpm** (install pnpm with `npm install -g pnpm`).

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:5173>. That is the whole setup. There is nothing
else to configure because there is no backend.

---

## Commands

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                 |
| `pnpm build`     | Type-check and build for production       |
| `pnpm preview`   | Preview the production build locally      |
| `pnpm lint`      | Run ESLint (must pass with zero warnings) |
| `pnpm format`    | Format every file with Prettier           |
| `pnpm typecheck` | Type-check without building               |
| `pnpm test`      | Run the unit and component tests (Vitest) |
| `pnpm test:e2e`  | Run the browser tests (Playwright)        |

To run the browser tests the first time, install the browser once with
`pnpm test:e2e:install`, then run `pnpm test:e2e`.

---

## How it is built

```
src/
├── components/   Presentational pieces (icon, ring, card, button, layout, overlay, sheet)
├── features/     One folder per area: read, library, progress, reader, settings
├── store/        Zustand stores (saved app state, and the open Reader)
├── hooks/        Small reusable hooks (interval, reader session, reading theme)
├── lib/          Pure logic and data: repository, dates, format, text, streak, level, reader-timer, content
├── types/        Zod schemas and the types they produce
└── styles/       The theme and layout CSS
```

A few ideas worth knowing:

- **All saving goes through one seam.** `lib/repository.ts` is a small typed
  interface (`getState`, `saveState`, `addText`, `removeText`, `completeSession`)
  backed by localStorage. Components and the store never touch storage directly,
  which is how a Dexie/IndexedDB version could slot in later. Saved data is
  parsed with Zod, so an old or broken shape safely falls back to defaults.
- **The tricky logic is pure and tested.** The reader timer and focus-guard
  (`lib/reader-timer.ts`), level advancement (`lib/level.ts`), the streak
  (`lib/streak.ts`), and the text normalizer (`lib/text.ts`) are plain functions
  with no React inside, so they are easy to test.
- **Pasted text becomes paragraphs.** We split on blank lines, collapse the
  newlines inside a paragraph, and trim. Reading time is roughly words / 220.
  Live URL fetching is not offered because cross-origin fetch is blocked in a
  static app; pasting plain text is the reliable path.
- **The Reader is sacred.** Nothing blinks or pulses while you read. The chrome
  is a thin top bar, a quiet header, and a slim bottom control bar.

---

## Accessibility and motion

- Every control is keyboard-operable with a visible focus ring.
- The Reader and the paste sheet trap focus and close on Escape; icon buttons
  have labels.
- The app honors `prefers-reduced-motion` (animations collapse to near zero) and
  `prefers-color-scheme`. You can switch theme (paper, dark, auto), reading font,
  text size, and line width in Settings, and the Reader stays genuinely
  comfortable to read in.

---

## A note on care

Linger is a gentle attention trainer, not a productivity cudgel. Some days you
will read less. That is fine: show up, read one unbroken stretch, and let that
be enough.

---

## License

MIT.
