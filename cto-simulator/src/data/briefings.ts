/**
 * Briefings: minimal action-only intros. You learn by playing the phases and feedback — not by reading.
 * One short slide per level. Skip or Start gets you into the game.
 */

import type { BriefingSlide } from '../components/LevelBriefing';

export const LEVEL1_BRIEFING: BriefingSlide[] = [
  {
    title: 'Level 1 – Planning',
    body: `6 phases. You’ll choose startup type, SMART goal, stakeholders, risk review, user story, and WBS order. Learn from the feedback after each choice.`,
    tip: 'Start — you learn by doing.',
  },
];

export const LEVEL2_BRIEFING: BriefingSlide[] = [
  {
    title: 'Level 2 – Architecture',
    body: `3 phases: Monolith, Microservices, Serverless. For each phase, pick the option that describes what happens with that architecture. Pass all three to complete.`,
    tip: 'Start — you learn by doing.',
  },
];

export const LEVEL3_BRIEFING: BriefingSlide[] = [
  {
    title: 'Level 3 – Database',
    body: `3 phases: DB type (Relational vs NoSQL), normalization, indexing. Answer the question in each phase. Feedback teaches you the rest.`,
    tip: 'Start — you learn by doing.',
  },
];

export const LEVEL4_BRIEFING: BriefingSlide[] = [
  {
    title: 'Level 4 – Git',
    body: `3 phases: pick the right Git command for each question (commit, push, pull, status, branch, etc.). You’ll get 3 random questions per play.`,
    tip: 'Start — you learn by doing.',
  },
];

export const LEVEL5_BRIEFING: BriefingSlide[] = [
  {
    title: 'Level 5 – CI/CD',
    body: `1 phase: drag the pipeline stages into the correct order (Source → Build → Test → Security → Deploy). Check order to see if you’re right.`,
    tip: 'Start — you learn by doing.',
  },
];

export const LEVEL6_BRIEFING: BriefingSlide[] = [
  {
    title: 'Level 6 – Documentation',
    body: `1 phase: tick every section that should be in a good README. Submit to see what you missed. Feedback teaches the rest.`,
    tip: 'Start — you learn by doing.',
  },
];
