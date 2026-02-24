/**
 * GameLayout: main shell for the game. Includes top bar (level title, Tooltips toggle), sidebar (XP + health %), and outlet for level content.
 * Smooth transitions between screens via Framer Motion on the outlet.
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { Sidebar } from './Sidebar';

export function GameLayout() {
  const navigate = useNavigate();
  const { currentLevelId, levels, tooltipsEnabled, setTooltipsEnabled, sidebarVisible, setSidebarVisible, sidebarOpen } = useGameStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const tooltipsOn = tooltipsEnabled !== false;
  const location = useLocation();
  const isFinal = location.pathname === '/final';
  const currentLevel = levels[currentLevelId];

  const sidebarShown = sidebarVisible !== false;
  // Sidebar: completely hidden (0) when !sidebarVisible; when visible, expanded (224) or collapsed to numbers (56)
  const sidebarWidth = !sidebarShown ? 0 : (sidebarOpen !== false ? 224 : 56);

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)]">
      {/* Top bar: current level name only; XP and health % live in sidebar */}
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-6 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">Level</span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {isFinal ? 'Summary' : (currentLevel?.title ?? currentLevelId)}
          </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSidebarVisible(!sidebarShown)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              sidebarShown ? 'bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]' : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
            }`}
            title={sidebarShown ? 'Hide levels panel completely' : 'Show levels panel'}
            aria-expanded={sidebarShown}
            aria-label={sidebarShown ? 'Hide levels panel' : 'Show levels panel'}
          >
            {sidebarShown ? 'Hide levels' : 'Show levels'}
          </button>
          <button
            type="button"
            onClick={() => setTooltipsEnabled(!tooltipsOn)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tooltipsOn ? 'bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]' : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
            }`}
            title="Toggle keyword tooltips (click highlighted terms to show definitions)"
            aria-label={tooltipsOn ? 'Turn tooltips off' : 'Turn tooltips on'}
          >
            Tooltips {tooltipsOn ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
            title="Sign out (progress is saved per user)"
            aria-label="Sign out"
          >
            Logout {currentUser ? `(${currentUser})` : ''}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <motion.div
          className="flex shrink-0 overflow-hidden"
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ type: 'tween', duration: 0.2 }}
          aria-hidden={!sidebarShown}
        >
          <Sidebar />
        </motion.div>
        <main className="flex-1 overflow-hidden">
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
