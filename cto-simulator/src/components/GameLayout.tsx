/**
 * GameLayout: main shell for the game. Includes top bar (XP, level, health), sidebar, and outlet for level content.
 * Smooth transitions between screens via Framer Motion on the outlet.
 */

import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { XPBar } from './XPBar';
import { Sidebar } from './Sidebar';

export function GameLayout() {
  const { totalXp, currentLevelId, startupHealth, levels, tooltipsEnabled, setTooltipsEnabled } = useGameStore();
  const tooltipsOn = tooltipsEnabled !== false;
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isFinal = location.pathname === '/final';
  const currentLevel = levels[currentLevelId];

  useEffect(() => {
    // Keep focus on content: hide the sidebar again when the route changes.
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)]">
      {/* Top bar: XP, current level name, startup health */}
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-3">
        <div className="flex items-center gap-6">
          <XPBar xp={totalXp} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">Level</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {isFinal ? 'Summary' : (currentLevel?.title ?? currentLevelId)}
          </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setTooltipsEnabled(!tooltipsOn)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tooltipsOn ? 'bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]' : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
            }`}
            title="Toggle keyword tooltips (click highlighted terms to show definitions)"
          >
            Tooltips {tooltipsOn ? 'On' : 'Off'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-muted)]">Startup health</span>
          <div className="h-3 w-40 overflow-hidden rounded-full bg-[var(--bg-card)]">
            <motion.div
              className="h-full rounded-full bg-[var(--accent-neon)]"
              initial={false}
              animate={{ width: `${startupHealth}%` }}
              transition={{ duration: 0.5 }}
              style={{ width: `${startupHealth}%` }}
            />
          </div>
          <span className="text-sm font-medium tabular-nums text-[var(--text-primary)]">
            {startupHealth}%
          </span>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 z-30 flex transition-transform duration-300 ease-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[14rem]'
          }`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <Sidebar />
          <button
            type="button"
            onClick={() => setIsSidebarOpen((value) => !value)}
            className="mt-4 h-16 w-8 shrink-0 rounded-r-lg border border-l-0 border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-neon)]"
            aria-label={isSidebarOpen ? 'Hide levels menu' : 'Show levels menu'}
            aria-expanded={isSidebarOpen}
            title={isSidebarOpen ? 'Hide levels menu' : 'Show levels menu'}
          >
            {isSidebarOpen ? '‹' : '›'}
          </button>
        </div>

        <main
          className="flex-1 overflow-hidden pl-8"
          onPointerDown={() => {
            if (isSidebarOpen) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full min-h-0 flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
