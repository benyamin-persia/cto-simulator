/**
 * Sidebar: level navigation. Shows all 6 levels with mission brief; current level highlighted, locked levels disabled.
 * Mission brief = one-line summary of what you must pass for that level.
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { LEVEL_ORDER, LEVEL_MISSION_BRIEFS } from '../data/levels';
import { textWithTooltips } from './TextWithTooltips';

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { levels, currentLevelId } = useGameStore();

  return (
    <aside className="flex w-56 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-subtle)] p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Levels
        </h2>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {LEVEL_ORDER.map((id) => {
          const level = levels[id];
          const completed = level?.completed ?? false;
          const isCurrent = currentLevelId === id;
          const missionBrief = LEVEL_MISSION_BRIEFS[id];

          return (
            <NavLink
              key={id}
              to={`/level/${id}`}
              onClick={onNavigate}
              title={missionBrief}
              className={({ isActive }) =>
                `flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm no-underline transition-colors ${
                  isActive || isCurrent
                    ? 'bg-[var(--accent-neon)]/15 text-[var(--accent-neon)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`
              }
            >
              <motion.span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-card)] font-mono text-xs"
                initial={false}
                animate={{ scale: 1 }}
              >
                {id}
              </motion.span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate">{level?.shortTitle ?? `Level ${id}`}</span>
                  {completed && (
                    <span className="text-[var(--accent-success)] shrink-0" title="Completed">
                      ✓
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                  {textWithTooltips(missionBrief)}
                </p>
              </div>
            </NavLink>
          );
        })}
        <NavLink
          to="/final"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm no-underline transition-colors ${
              isActive ? 'bg-[var(--accent-neon)]/15 text-[var(--accent-neon)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`
          }
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-card)] font-mono text-xs">★</span>
          <span className="flex-1 truncate">Summary</span>
        </NavLink>
      </nav>
      <div className="border-t border-[var(--border-subtle)] p-2">
        <kbd className="text-xs text-[var(--text-muted)]" title="Reset game and go to Level 1">
          Ctrl+Shift+R reset
        </kbd>
      </div>
    </aside>
  );
}
