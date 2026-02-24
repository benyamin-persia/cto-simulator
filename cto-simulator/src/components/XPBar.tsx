/**
 * XPBar: shows total XP and optional label.
 * Used in the top bar of the game layout.
 */

import { motion } from 'framer-motion';

interface XPBarProps {
  xp: number;
  showLabel?: boolean;
}

export function XPBar({ xp, showLabel = true }: XPBarProps) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-lg bg-[var(--bg-card)] px-3 py-2 border border-[var(--border-subtle)]"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm font-medium text-[var(--accent-neon)]">XP</span>
      <span className="text-lg font-bold tabular-nums text-[var(--text-primary)]">{xp}</span>
      {showLabel && <span className="text-xs text-[var(--text-muted)]">points</span>}
    </motion.div>
  );
}
