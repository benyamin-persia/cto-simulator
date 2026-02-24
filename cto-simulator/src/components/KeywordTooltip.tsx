/**
 * KeywordTooltip: wraps a keyword and shows its definition on click only (not on hover).
 * Click the keyword again to toggle off, or click anywhere else (outside the keyword and tooltip) to close.
 * No close button — close by clicking elsewhere or re-clicking the keyword.
 * Accessibility: trigger has role="button", tabIndex={0}, aria-label, aria-expanded; tooltip has role="tooltip".
 */

import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGameStore } from '../store/gameStore';

interface KeywordTooltipProps {
  /** The term as shown in the text (e.g. "SaaS") */
  term: string;
  /** Definition to show in the tooltip (from glossary) */
  definition: string;
  /** Optional class for the trigger span */
  className?: string;
}

const TOOLTIP_OFFSET = 6;
const TOOLTIP_WIDTH = 256;

export function KeywordTooltip({ term, definition, className = '' }: KeywordTooltipProps) {
  const tooltipsEnabled = useGameStore((s) => s.tooltipsEnabled !== false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = rect.left + rect.width / 2;
    const top = rect.top;
    setPosition({
      left: Math.max(TOOLTIP_WIDTH / 2, Math.min(window.innerWidth - TOOLTIP_WIDTH / 2, left)),
      top: top - TOOLTIP_OFFSET,
    });
  };

  useLayoutEffect(() => {
    if (!visible || !triggerRef.current) return;
    updatePosition();
  }, [visible, term, definition]);

  useEffect(() => {
    if (!visible) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [visible]);

  /* Close when user clicks outside the trigger or the tooltip (click-outside to close). */
  useEffect(() => {
    if (!visible) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (trigger?.contains(target) || tooltip?.contains(target)) return;
      setVisible(false);
    };
    /* Use mousedown so the click that opened the tooltip doesn't immediately close it (trigger click runs first). */
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible]);

  const tooltipContent =
    visible && position ? (
      <span
        ref={tooltipRef}
        className="fixed w-64 rounded-lg bg-[var(--accent-neon)] px-3 py-2 text-left text-xs text-[var(--bg-primary)] shadow-xl"
        style={{
          left: position.left,
          top: position.top,
          transform: 'translate(-50%, -100%)',
          zIndex: 2147483647,
        }}
        role="tooltip"
      >
        {definition}
      </span>
    ) : null;

  /* Visual keyword text (accent color); when tooltips off, this is all we show. */
  const styledKeyword = <span className="cursor-pointer text-[var(--accent-neon)]">{term}</span>;

  if (!tooltipsEnabled) {
    return <span className={`inline ${className}`}>{styledKeyword}</span>;
  }

  /* Single trigger: has ref, click, keyboard, and all ARIA so the interactive element = accessible element. */
  return (
    <>
      <span
        ref={triggerRef}
        className={`relative inline cursor-pointer ${className}`}
        role="button"
        tabIndex={0}
        aria-label={`${term}: ${definition}. Click to show definition.`}
        aria-expanded={visible}
        onClick={() => setVisible((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setVisible((v) => !v);
          }
        }}
      >
        {styledKeyword}
      </span>
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
}
