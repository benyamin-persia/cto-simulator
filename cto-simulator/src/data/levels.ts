/**
 * Structured level configuration and content for each level.
 * Used by LevelContainer and individual level components.
 * Add new levels or steps here to extend the game.
 */

import type { LevelId } from '../types/game';

export const LEVEL_ORDER: LevelId[] = [1, 2, 3, 4, 5, 6];

/** One-line mission brief per level — what you must do to pass. Shown in sidebar. All levels use phases. */
export const LEVEL_MISSION_BRIEFS: Record<LevelId, string> = {
  1: 'Phases 1–6: startup type, SMART goal, stakeholders, risk review, user story, WBS order.',
  2: 'Phases 1–3: Monolith, Microservices, Serverless (one scenario each).',
  3: 'Phases 1–3: DB type (Relational/NoSQL), normalization, indexing.',
  4: 'Phases 1–3: 3 Git command questions (commit, push, pull, status, branch).',
  5: 'Phase 1: order pipeline (Source → Build → Test → Security → Deploy).',
  6: 'Phase 1: select all required README sections (overview, install, env, run, API).',
};

/** Level 1: correct WBS order (Work Breakdown Structure) for planning. */
export const LEVEL1_WBS_CORRECT_ORDER = [
  'Market research & feasibility',
  'Define requirements & scope',
  'Design system architecture',
  'Development & implementation',
  'Testing & QA',
  'Deployment & launch',
];

/** Level 1: startup type options. */
export const STARTUP_TYPES = [
  { id: 'saas', label: 'SaaS product', description: 'Subscription-based software' },
  { id: 'ecommerce', label: 'E-commerce', description: 'Online retail platform' },
  { id: 'marketplace', label: 'Marketplace', description: 'Two-sided platform' },
  { id: 'devtools', label: 'Developer tools', description: 'APIs, SDKs, dev products' },
] as const;

/** Level 1: SMART goal examples; one is fully SMART. */
export const SMART_GOAL_OPTIONS = [
  { id: 'a', text: 'Increase revenue by 20% in Q2 with measurable KPIs and a clear deadline.', correct: true },
  { id: 'b', text: 'Make the product better and get more users.', correct: false },
  { id: 'c', text: 'Someday we want to be the best in the market.', correct: false },
  { id: 'd', text: 'Improve performance a bit.', correct: false },
] as const;

/** Level 1: stakeholders to identify (all correct to select). */
export const STAKEHOLDER_OPTIONS = [
  { id: 'investors', label: 'Investors', correct: true },
  { id: 'users', label: 'End users', correct: true },
  { id: 'team', label: 'Engineering & product team', correct: true },
  { id: 'competitors', label: 'Competitors', correct: false },
] as const;

/** Level 1: when to review risk assessment (from doc: Regular Review Schedule — Quarterly = risk). */
export const REVIEW_SCHEDULE_OPTIONS = [
  { id: 'monthly', label: 'Monthly', correct: false },
  { id: 'quarterly', label: 'Quarterly', correct: true },
  { id: 'semi-annual', label: 'Semi-annual', correct: false },
  { id: 'never', label: 'Never', correct: false },
] as const;

/** Level 1: which is a well-formed user story (Agile: "As a [user], I want [X] so that [benefit]"). */
export const USER_STORY_OPTIONS = [
  { id: 'a', text: 'As a customer, I want to reset my password so that I can regain access when I forget it.', correct: true },
  { id: 'b', text: 'Make the login page better.', correct: false },
  { id: 'c', text: 'The system should allow users to do stuff.', correct: false },
  { id: 'd', text: 'Add a button somewhere for password.', correct: false },
] as const;

// ---------------------------------------------------------------------------
// Level 3 – Database Design (from Starting a New Programming Project doc)
// ---------------------------------------------------------------------------

/** Relational vs NoSQL: use case → correct choice. Structure, ACID, use cases per doc. */
export const LEVEL3_DB_TYPE_OPTIONS = [
  { id: 'relational', label: 'Relational', description: 'Tables, rows, columns; ACID; complex queries, transactions (e.g. PostgreSQL, MySQL)' },
  { id: 'nosql', label: 'NoSQL', description: 'Document, key-value; flexible schema, horizontal scaling; big data, real-time (e.g. MongoDB, Redis)' },
] as const;

/** DB type scenarios — randomly pick one per play for variety. */
export const LEVEL3_DB_SCENARIOS = [
  {
    question: 'Your app needs complex queries, transactions, and strongly structured data. Which database type fits best?',
    correctId: 'relational' as const,
  },
  {
    question: 'You need flexible schema and high write throughput for real-time events. Which database type fits best?',
    correctId: 'nosql' as const,
  },
] as const;

/** Normalization: which normal form is described? (1NF, 2NF, 3NF, BCNF per doc.) */
export const LEVEL3_NORMALIZATION_OPTIONS = [
  { id: '1nf', label: '1NF', description: 'Atomic values, no repeating groups', correct: false },
  { id: '2nf', label: '2NF', description: '1NF + no partial dependencies', correct: false },
  { id: '3nf', label: '3NF', description: '2NF + no transitive dependencies', correct: true },
  { id: 'bcnf', label: 'BCNF', description: 'Stricter 3NF', correct: false },
] as const;

/** Normalization questions — randomly pick one per play. */
export const LEVEL3_NORMALIZATION_QUESTIONS = [
  { question: 'Which normal form is described by: "2NF plus no transitive dependencies"?', correctId: '3nf' as const },
  { question: 'Which normal form requires atomic values and no repeating groups?', correctId: '1nf' as const },
] as const;

/** Indexing: index often-queried columns (doc: "Do: Index often-queried columns"). */
export const LEVEL3_INDEX_OPTIONS = [
  { id: 'email', label: 'Index the email column', description: 'Queries filter by email; index speeds lookups', correct: true },
  { id: 'id_only', label: 'Index only the primary key', description: 'No extra indexes', correct: false },
  { id: 'no_index', label: 'Avoid indexes to keep writes fast', description: 'No index on email', correct: false },
  { id: 'full_scan', label: 'Rely on full table scan', description: 'Scan every row for each login', correct: false },
] as const;

export const LEVEL3_INDEX_QUESTION = {
  question: 'Your users table is queried by email on every login. What should you do?',
};

// ---------------------------------------------------------------------------
// Level 4 – Git (Ch 3: Development Environment Setup)
// ---------------------------------------------------------------------------

/** Git questions pool — randomly pick 3 per play for variety. */
export const LEVEL4_GIT_QUESTIONS: {
  question: string;
  options: { id: string; label: string; correct: boolean }[];
}[] = [
  {
    question: 'How do you save a snapshot of your changes locally?',
    options: [
      { id: 'commit', label: 'git commit -m "message"', correct: true },
      { id: 'push', label: 'git push', correct: false },
      { id: 'add', label: 'git add .', correct: false },
      { id: 'clone', label: 'git clone <url>', correct: false },
    ],
  },
  {
    question: 'You changed files and want to send them to the remote (e.g. GitHub). What do you run after commit?',
    options: [
      { id: 'push', label: 'git push', correct: true },
      { id: 'pull', label: 'git pull', correct: false },
      { id: 'status', label: 'git status', correct: false },
      { id: 'merge', label: 'git merge', correct: false },
    ],
  },
  {
    question: 'How do you get the latest changes from the remote into your local repo?',
    options: [
      { id: 'pull', label: 'git pull', correct: true },
      { id: 'push', label: 'git push', correct: false },
      { id: 'clone', label: 'git clone <url>', correct: false },
      { id: 'fetch', label: 'git fetch only (no merge)', correct: false },
    ],
  },
  {
    question: 'Before committing, you want to see which files changed. Which command do you run?',
    options: [
      { id: 'status', label: 'git status', correct: true },
      { id: 'log', label: 'git log --oneline', correct: false },
      { id: 'diff', label: 'git diff', correct: false },
      { id: 'add', label: 'git add .', correct: false },
    ],
  },
  {
    question: 'You want to create and switch to a new branch called feature/login. What do you run?',
    options: [
      { id: 'checkout', label: 'git checkout -b feature/login', correct: true },
      { id: 'branch', label: 'git branch feature/login', correct: false },
      { id: 'clone', label: 'git clone feature/login', correct: false },
      { id: 'merge', label: 'git merge feature/login', correct: false },
    ],
  },
  {
    question: 'You just cloned a repo. What is the typical next step before you start editing?',
    options: [
      { id: 'edit', label: 'Edit files (no command needed yet)', correct: true },
      { id: 'push', label: 'git push', correct: false },
      { id: 'commit', label: 'git commit', correct: false },
      { id: 'pull', label: 'git pull (to sync)', correct: false },
    ],
  },
];

/** Pick 3 random indices from 0..length-1 without repeats. */
export function pickRandomIndices(length: number, count: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
}

// ---------------------------------------------------------------------------
// Level 5 – CI/CD Pipeline (Ch 5: DevOps and CI/CD)
// ---------------------------------------------------------------------------

/** Correct order per doc: SCM → Build → Test → Security → Deploy (simplified for game). */
export const LEVEL5_PIPELINE_CORRECT_ORDER = [
  'Source control (commit)',
  'Build & package',
  'Run tests',
  'Security scan',
  'Deploy',
];

// ---------------------------------------------------------------------------
// Level 6 – Documentation (Ch 6)
// ---------------------------------------------------------------------------

/** Which sections should a README include? (doc: overview, installation, usage, contributing, license). */
export const LEVEL6_README_OPTIONS = [
  { id: 'overview', label: 'Project overview and purpose', correct: true },
  { id: 'install', label: 'Installation and configuration', correct: true },
  { id: 'env', label: 'Environment variables (e.g. DATABASE_URL)', correct: true },
  { id: 'run', label: 'How to run the application', correct: true },
  { id: 'api', label: 'API overview or link to API docs', correct: true },
  { id: 'gossip', label: 'Office gossip', correct: false },
  { id: 'todo', label: 'Personal TODO list only', correct: false },
] as const;
