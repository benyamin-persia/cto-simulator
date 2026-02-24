/**
 * FinalScreen: shown when user visits /final (e.g. after completing Level 6 or from sidebar).
 * Displays total XP, summary of decisions, "Startup Successfully Launched" if all levels done, else progress.
 * Restart option clears localStorage state and redirects to Level 1.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LevelId } from '../types/game';
import { useGameStore } from '../store/gameStore';

export function FinalScreen() {
  const navigate = useNavigate();
  const { totalXp, levels, decisionsByLevel, resetGame } = useGameStore();

  const levelIds: LevelId[] = [1, 2, 3, 4, 5, 6];
  const allComplete = levelIds.every((id) => levels[id]?.completed);
  const completedCount = levelIds.filter((id) => levels[id]?.completed).length;

  const handleRestart = () => {
    resetGame();
    navigate('/level/1');
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <motion.div
        className="max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-8 text-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
          {allComplete ? 'Startup Successfully Launched' : 'Game progress'}
        </h1>
        <p className="mb-6 text-[var(--text-muted)]">
          {allComplete
            ? 'You completed all levels. Your startup is ready.'
            : `You completed ${completedCount} of 6 levels. Keep going to launch your startup.`}
        </p>

        <div className="mb-6 rounded-lg bg-[var(--bg-secondary)] p-4">
          <span className="text-sm text-[var(--text-muted)]">Total XP</span>
          <p className="text-3xl font-bold text-[var(--accent-neon)]">{totalXp}</p>
        </div>

        <div className="mb-6 text-left">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Curriculum (Starting a New Programming Project)
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--text-primary)]">
            <li><strong>Ch 1</strong> Project Planning → Level 1 (requirements, SMART, stakeholders, risk, user story, WBS)</li>
            <li><strong>Ch 2</strong> System Design → Level 2 (architecture), Level 3 (database)</li>
            <li><strong>Ch 3</strong> Dev environment (Git, IDE, env) → Level 4</li>
            <li><strong>Ch 4</strong> Jira & Agile → Level 1 (user story, briefing)</li>
            <li><strong>Ch 5</strong> CI/CD → Level 5</li>
            <li><strong>Ch 6</strong> Documentation → Level 6</li>
            <li><strong>Ch 7–8</strong> Practical exercises & resources → All levels + Level 6 briefing</li>
          </ul>
        </div>

        {Object.keys(decisionsByLevel).length > 0 && (
          <div className="mb-6 text-left">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Summary of decisions
            </h2>
            <pre className="max-h-40 overflow-auto rounded bg-[var(--bg-primary)] p-3 text-xs text-[var(--text-primary)]">
              {JSON.stringify(decisionsByLevel, null, 2)}
            </pre>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/level/1')}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
          >
            Back to levels
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
          >
            Restart game
          </button>
        </div>
      </motion.div>
    </div>
  );
}
