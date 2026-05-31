/*
 * Linger content, ported faithfully from the design prototype.
 *
 * The starter shelf is original, on-theme writing (accurate and
 * copyright-clean) so the app is useful on first open. Evidence is drawn from
 * the neuroscience of reading (the reading brain is built, not innate; cf.
 * Maryanne Wolf). It is general guidance, not a productivity cudgel.
 */
import type { ReadingText } from '@/types/domain';

export interface Level {
  lvl: number;
  // Minutes of unbroken reading needed to clear the level.
  target: number;
  name: string;
}

// ---- The "couch-to-5k for attention" ramp ---------------------------------
export const levels: Level[] = [
  { lvl: 1, target: 8, name: 'First page' },
  { lvl: 2, target: 10, name: 'Settling in' },
  { lvl: 3, target: 12, name: 'Finding rhythm' },
  { lvl: 4, target: 15, name: 'Holding still' },
  { lvl: 5, target: 18, name: 'Going under' },
  { lvl: 6, target: 22, name: 'Lost in it' },
  { lvl: 7, target: 26, name: 'Deep water' },
  { lvl: 8, target: 30, name: 'Sustained' },
  { lvl: 9, target: 38, name: 'Long-form' },
  { lvl: 10, target: 45, name: 'Deep diver' },
];

// ---- Recall prompts (rotate) ----------------------------------------------
export const recallPrompts: string[] = [
  'In a line or two, what stuck with you?',
  "What's one idea you want to keep?",
  'What surprised you, or pushed back on what you thought?',
  'If you told a friend one sentence about this, what would it be?',
  'What will you still remember tomorrow?',
];

// ---- Field notes (calm, evidence-based) -----------------------------------
export const notes: string[] = [
  "The reading brain isn't something you're born with, it's built, and what's built can be rebuilt.",
  'Attention is trainable. Every unbroken page is a rep.',
  'Boredom is the doorway to depth, not a problem to swipe away.',
  'You rarely need more time to read. You need fewer exits.',
  'Short-form feeds train the mind to leave. Reading trains it to stay.',
];

export const copy = {
  tagline: 'Stay with the page.',
  intro:
    'Short-form feeds trained your attention to leave. Reading trains it to stay. Start small, read unbroken, build the muscle back.',
  leftNote: 'You stepped away. The page waited for you.',
  safety:
    "Linger is a gentle attention trainer, not a productivity cudgel. Some days you'll read less. That's fine, show up, read one unbroken stretch, and let that be enough.",
};

// ---- Starter shelf: original, on-theme reads ------------------------------
export const shelf: ReadingText[] = [
  {
    id: 'finish',
    custom: false,
    title: "Why You Can't Finish Things",
    kicker: 'On the vanished art of staying',
    minutes: 3,
    body: [
      "You used to be able to read a book. A whole one, in long sittings, the world falling away around the page. Somewhere in the last few years that ability quietly left, and you didn't notice it go. Now you open something you genuinely want to read and, four paragraphs in, your hand is already reaching for the phone you put face-down precisely so you wouldn't reach for it.",
      'This is not a character flaw. It is a trained reflex, and it was trained on purpose.',
      'Every feed you scroll is an exquisitely tuned machine for teaching one lesson: that the next thing is always one flick away, that boredom is intolerable, that attention should be spent in two-second bursts and then moved along. You have practiced leaving, leaving a video, a thought, a moment, thousands of times a day, for years. Of course you are good at it now. You have rehearsed it more than almost anything else you do.',
      'The trouble is that the deep, sustained, single-stream attention reading asks of you is the exact opposite skill. It is the skill of staying. And like any skill you stop practicing, it has gone soft.',
      'Here is the part worth holding onto: it has gone soft, not gone. The same plasticity that let the feed reshape your attention will let you reshape it back. Not through willpower or shame, and certainly not through another app that buzzes at you. Through reps. Through sitting with one text, for one unbroken stretch, and then a slightly longer one, until staying feels less like effort and more like relief.',
      "You don't have to read a whole book today. You have to read the next page without leaving. That's the whole job. Begin there.",
    ],
  },
  {
    id: 'boredom',
    custom: false,
    title: 'In Praise of Boredom',
    kicker: 'The doorway we keep slamming shut',
    minutes: 5,
    body: [
      'There is a particular feeling that arrives a few minutes into anything demanding. A restlessness, a faint static under the skin, a sense that something more interesting must be happening elsewhere. We have a name for it, boredom, and we treat it as an emergency. The modern reflex is to end it instantly, and we carry, at all times, a device engineered to end it.',
      'But boredom is not an emergency. It is a threshold.',
      "Watch what actually happens when you don't reach for the phone. The restlessness rises, crests, and, if you let it, breaks. On the other side of it is something quieter and far more valuable: the mind settling into the thing in front of it. Depth lives just past boredom. It always has. The reason deep work and deep reading feel so rare now is not that we lack the time, but that we no longer cross the threshold. We flinch at the first wave and swipe it away, again and again, and never find out what was on the other side.",
      "Children know this instinctively, before we train it out of them. A bored child, left alone long enough, doesn't stay bored, they invent, they build, they disappear into a game of their own making. Boredom was the raw material. The emptiness was the point. It was the space in which something could finally happen.",
      'We have lost our tolerance for that emptiness, and with it, much of what the emptiness used to produce. The daydream in the queue. The idea in the shower. The slow unspooling of a thought with nowhere to be. These were never wasted moments; they were where the mind did its real work, off the clock, in the margins.',
      "Reading asks you to befriend boredom again. There will be a paragraph that doesn't grip you, a stretch where your attention frays, a moment where the easy thing would be to leave. Stay anyway. Treat the restlessness not as a signal to escape but as a sign you've arrived at the threshold. Breathe once. Keep your eyes on the line. The wave will break, and the page will open up beneath you.",
      'This is the muscle. Not the reading itself, exactly, but the staying through the dull patch on the way to the deep one. Build that, and you get back more than the ability to read. You get back the parts of your inner life that only grow in unhurried, uninterrupted, gloriously boring time.',
    ],
  },
  {
    id: 'brain',
    custom: false,
    title: 'The Brain That Reads',
    kicker: 'On a circuit you built, and can build again',
    minutes: 7,
    body: [
      'Reading is not natural. We tend to forget this, because for most of us it happened so early and so thoroughly that it feels as innate as walking or speech. But speech is wired into us by hundreds of thousands of years of evolution; reading is not. There is no reading gene, no region of the brain that arrived pre-built for the task. Writing is only a few thousand years old, far too recent to have shaped our biology.',
      'So when a child learns to read, something remarkable happens: the brain improvises. It borrows circuits evolved for other things, vision, language, memory, the recognition of objects, and stitches them together into a new, custom-made network that did not exist before. Every literate person is, in a real and physical sense, walking around with a structure in their head that they built. The reading brain is an achievement, not an inheritance.',
      'This is wonderful news and sobering news at once. Wonderful, because it means the brain is far more malleable than we assume, that experience can lay down genuinely new architecture. Sobering, because anything built by experience can also be reshaped by experience. A circuit maintained by use is weakened by disuse. The reading brain is not a monument; it is a garden. Stop tending it and it does not vanish overnight, but it does grow over.',
      'What we are doing to that garden right now is worth taking seriously. The average person spends hours a day in a mode of reading, if you can call it that, defined by skimming, scanning, hopping between fragments, never resting long on any single line. This is not the deep reading the circuit was trained for. It is a shallow, restless, F-shaped sweep across a screen, optimized for extracting the gist and moving on. Do it long enough and it becomes the default. The deep mode does not disappear; it just gets harder to drop into, like a path through a field that grows faint when no one walks it.',
      'Researchers who study this describe a kind of impoverishment of the deeper reading processes: the inference, the critical analysis, the empathy, the slow construction of meaning that happens when you give a difficult text the time it needs. These are not frills. They are close to the center of what it means to think well, and to understand another mind that is not your own. They are also, conveniently, exactly the capacities that a culture of frictionless distraction does not want you to have.',
      'But the same plasticity cuts both ways. The brain that can be shaped toward distraction can be shaped back toward depth, and the method is not mysterious. You walk the faint path until it is a path again. You read, really read, slowly, without exits, a little each day. You let the difficult passage be difficult. You resist the urge to look up, look away, look at something else. And gradually the circuit reconsolidates. Staying gets easier. The deep mode, once so hard to reach, starts to feel like home again.',
      'There is no app, including this one, that can do the reps for you. What a tool can do is hold the door open: clear away the distraction, mark the time, ask you to come back tomorrow. The walking is yours. But that is also the good news, it was always yours. You built this brain once, page by page, when you were small. You can tend it back to health the same way. Begin with the next paragraph. Then the one after that.',
    ],
  },
];
