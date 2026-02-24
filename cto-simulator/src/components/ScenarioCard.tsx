/**
 * ScenarioCard: reusable card for presenting a level scenario or question.
 * Wraps content in a styled container with optional title and subtle animation.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScenarioCardProps {
  /** Card title; can be string or ReactNode (e.g. textWithTooltips("...")) for keyword tooltips. */
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ScenarioCard({ title, children, className = '' }: ScenarioCardProps) {
  return (
    <motion.div
      className={`rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}
