/**
 * Central type definitions for the CTO Simulator game.
 * Used by store, levels, and components for type safety.
 */

export type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

export interface LevelConfig {
  id: LevelId;
  title: string;
  shortTitle: string;
  description: string;
  /** XP awarded when level is completed (bonus). Step XP is defined per level. */
  completionXp: number;
  /** Whether this level is unlocked (previous completed or id === 1). */
  unlocked: boolean;
  completed: boolean;
}

export interface GameState {
  totalXp: number;
  currentLevelId: LevelId;
  startupHealth: number; // 0-100, affected by decisions
  levels: Record<LevelId, LevelConfig>;
  /** Decisions made per level for final summary (e.g. { 1: { startupType: 'SaaS', ... } }). */
  decisionsByLevel: Record<LevelId, Record<string, unknown>>;
  /** Per-level reset key; bump to force level component to remount when level is reset. Omitted in older persisted state. */
  levelResetKey?: Partial<Record<LevelId, number>>;
}

/** Startup health at game start. 100 = full health; wrong decisions reduce it. */
export const INITIAL_HEALTH = 100;
export const MAX_HEALTH = 100;
export const MIN_HEALTH = 0;

/** XP required to "unlock" next level is implicit: complete previous level. */
export const DEFAULT_LEVELS: Record<LevelId, Omit<LevelConfig, 'unlocked' | 'completed'>> = {
  1: { id: 1, title: 'Project Planning', shortTitle: 'Planning', description: 'Define goals, stakeholders, and WBS.', completionXp: 100 },
  2: { id: 2, title: 'Architecture Decision', shortTitle: 'Architecture', description: 'Choose monolith, microservices, or serverless.', completionXp: 120 },
  3: { id: 3, title: 'Database Design', shortTitle: 'Database', description: 'Relational vs NoSQL, indexing, normalization.', completionXp: 120 },
  4: { id: 4, title: 'Git Conflict Simulation', shortTitle: 'Git', description: 'Resolve merge conflicts and use Git commands.', completionXp: 100 },
  5: { id: 5, title: 'CI/CD Pipeline Builder', shortTitle: 'CI/CD', description: 'Order pipeline stages correctly.', completionXp: 130 },
  6: { id: 6, title: 'Documentation Review', shortTitle: 'Docs', description: 'Complete README and API docs.', completionXp: 100 },
};
