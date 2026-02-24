/**
 * ResultPanel: shows consequence/feedback after a decision.
 * Displays message (with keyword tooltips), optional XP, optional "how to remember" tip.
 */

import { motion } from 'framer-motion';
import { textWithTooltips } from './TextWithTooltips';

interface ResultPanelProps {
  message: string;
  xpGained?: number;
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Short memory aid / key takeaway so the user can remember this step. */
  rememberTip?: string;
}

export function ResultPanel({ message, xpGained, variant = 'info', rememberTip }: ResultPanelProps) {
  const borderColor =
    variant === 'success'
      ? 'var(--accent-success)'
      : variant === 'warning'
        ? 'var(--accent-warning)'
        : variant === 'error'
          ? 'var(--accent-danger)'
          : 'var(--accent-neon)';

  return (
    <motion.div
      className="rounded-lg border-l-4 bg-[var(--bg-secondary)] p-4"
      style={{ borderLeftColor: borderColor }}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-[var(--text-primary)]">{textWithTooltips(message)}</p>
      {xpGained !== undefined && xpGained > 0 && (
        <p className="mt-2 text-sm font-medium text-[var(--accent-neon)]">+{xpGained} XP</p>
      )}
      {rememberTip && (
        <div className="mt-3 rounded-md border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-neon)]">
            How to remember
          </p>
          <p className="mt-1 text-sm text-[var(--text-primary)]">{textWithTooltips(rememberTip)}</p>
        </div>
      )}
    </motion.div>
  );
}
