/**
 * LevelContainer: wrapper for level content. Provides consistent padding, title, and optional per-level reset.
 * Used by each level page to wrap ScenarioCards and gameplay UI.
 * When levelId is passed, a "Reset this level" button is shown so the user can clear completion and replay that level only.
 */

import type { ReactNode } from 'react';
import { useGameStore } from '../store/gameStore';
import type { LevelId } from '../types/game';

interface LevelContainerProps {
  title: string;
  /** When set, shows a "Reset this level" button that clears this level's completion and decisions and remounts the level. */
  levelId?: LevelId;
  children: ReactNode;
}

export function LevelContainer({ title, levelId, children }: LevelContainerProps) {
  const resetLevel = useGameStore((s) => s.resetLevel);

  const handleResetLevel = () => {
    if (levelId != null) resetLevel(levelId);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
        {levelId != null && (
          <button
            type="button"
            onClick={handleResetLevel}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:border-[var(--accent-neon)]/50 hover:text-[var(--text-primary)]"
            title="Clear this level's progress and play it again. Other levels are unchanged."
          >
            Reset this level
          </button>
        )}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
