/**
 * Sidebar: level navigation. Shows all 6 levels with mission brief; current level highlighted, locked levels disabled.
 * Mission brief = one-line summary of what you must pass for that level.
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { LEVEL_ORDER, LEVEL_MISSION_BRIEFS } from '../data/levels';
import { textWithTooltips } from './TextWithTooltips';

export function Sidebar() {
  const { levels, currentLevelId, sidebarOpen, setSidebarOpen } = useGameStore();
  const expanded = sidebarOpen !== false;

  return (
    <aside
      className={`flex h-full flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] ${expanded ? 'w-56' : 'w-14'}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-2">
        {expanded ? (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Levels
            </h2>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              title="Collapse to numbers only (use header button to expand again)"
              aria-label="Collapse levels panel"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
            title="Expand levels panel"
            aria-label="Expand levels panel"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
            </svg>
          </button>
        )}
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {LEVEL_ORDER.map((id) => {
          const level = levels[id];
          const isCurrent = currentLevelId === id;
          const missionBrief = LEVEL_MISSION_BRIEFS[id];

          return (
            <NavLink
              key={id}
              to={`/level/${id}`}
              title={missionBrief}
              className={({ isActive }) =>
                `flex rounded-lg px-3 py-2.5 text-sm no-underline transition-colors ${
                  expanded ? 'items-start gap-3' : 'items-center justify-center'
                } ${
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
              {expanded && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{level?.shortTitle ?? `Level ${id}`}</span>
                    {level?.completed && (
                      <span className="text-[var(--accent-success)] shrink-0" title="Completed">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                    {textWithTooltips(missionBrief)}
                  </p>
                </div>
              )}
            </NavLink>
          );
        })}
        <NavLink
          to="/final"
          className={({ isActive }) =>
            `flex rounded-lg px-3 py-2.5 text-sm no-underline transition-colors ${
              expanded ? 'items-center gap-3' : 'items-center justify-center'
            } ${
              isActive ? 'bg-[var(--accent-neon)]/15 text-[var(--accent-neon)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`
          }
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--bg-card)] font-mono text-xs">★</span>
          {expanded && <span className="flex-1 truncate">Summary</span>}
        </NavLink>
      </nav>
      {expanded && (
        <div className="border-t border-[var(--border-subtle)] p-2">
          <kbd className="text-xs text-[var(--text-muted)]" title="Reset game and go to Level 1">
            Ctrl+Shift+R reset
          </kbd>
        </div>
      )}
    </aside>
  );
}
