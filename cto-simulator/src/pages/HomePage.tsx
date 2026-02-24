/**
 * HomePage: landing screen. "Start game" sends user to Level 1.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 text-4xl font-bold text-[var(--text-primary)]">
          CTO Simulator
        </h1>
        <p className="mb-4 text-[var(--text-muted)]">
          Launch your startup. Make decisions. Learn software engineering.
        </p>
        <p className="mb-8 text-sm text-[var(--accent-neon)]">
          Each level teaches you first — then you play. Learn by doing.
        </p>
        <motion.button
          type="button"
          onClick={() => navigate('/level/1')}
          className="rounded-xl bg-[var(--accent-neon)] px-8 py-4 text-lg font-semibold text-[var(--bg-primary)] hover:opacity-90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Start game
        </motion.button>
      </motion.div>
    </div>
  );
}
