/**
 * DecisionButton: choice button for scenarios.
 * Supports correct/incorrect styling and optional disabled state.
 * label and description can be ReactNode for keyword tooltips.
 */

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DecisionButtonProps {
  label: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'correct' | 'incorrect';
  disabled?: boolean;
  description?: ReactNode;
}

export function DecisionButton({
  label,
  onClick,
  variant = 'default',
  disabled = false,
  description,
}: DecisionButtonProps) {
  const base =
    'w-full rounded-lg border px-4 py-3 text-left font-medium transition-all duration-200 ' +
    'focus:outline-none focus:ring-2 focus:ring-[var(--accent-neon)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] ';
  const variants = {
    default:
      'border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--accent-neon-dim)] hover:bg-[var(--bg-card)]',
    correct:
      'border-[var(--accent-success)] bg-[var(--accent-success)]/10 text-[var(--accent-success)]',
    incorrect:
      'border-[var(--accent-danger)] bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]',
  };

  return (
    <motion.button
      type="button"
      className={base + variants[variant]}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <span className="block">{label}</span>
      {description && <span className="mt-1 block text-sm opacity-80">{description}</span>}
    </motion.button>
  );
}
