/**
 * LevelBriefing: "teach first" UI shown before a level.
 * Presents short, game-style lessons (slides) so the player learns the concepts, then clicks "Start mission" to play.
 * Current slide is persisted in sessionStorage so refresh keeps the user on the same tab.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { textWithTooltips } from './TextWithTooltips';

const BRIEFING_SLIDE_KEY = 'cto-briefing-slide';

export interface BriefingSlide {
  /** Short title for the slide (e.g. "SMART goals") */
  title: string;
  /** Main teaching content: can be a string or JSX for lists/examples */
  body: React.ReactNode;
  /** Optional tip or "remember" callout */
  tip?: string;
}

interface LevelBriefingProps {
  /** Level id (1–6) used to persist current slide per level so refresh stays on same tab. */
  levelId: number;
  /** Level title shown in the header (e.g. "Level 1 – Project Planning") */
  levelTitle: string;
  /** Intro line above the slides (e.g. "Your mission brief. Read this before you make decisions.") */
  intro?: string;
  /** Ordered list of slides. Player can Next/Prev through them. */
  slides: BriefingSlide[];
  /** Called when player clicks "Start mission" (after viewing slides). */
  onStart: () => void;
  /** Optional: show a "Skip briefing" for returning players (still recommend reading). */
  allowSkip?: boolean;
}

function getStoredSlideIndex(levelId: number, maxIndex: number): number {
  try {
    const key = `${BRIEFING_SLIDE_KEY}-${levelId}`;
    const stored = sessionStorage.getItem(key);
    if (stored == null) return 0;
    const n = parseInt(stored, 10);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, maxIndex);
  } catch {
    return 0;
  }
}

function setStoredSlideIndex(levelId: number, index: number): void {
  try {
    sessionStorage.setItem(`${BRIEFING_SLIDE_KEY}-${levelId}`, String(index));
  } catch {
    // ignore
  }
}

export function LevelBriefing({
  levelId,
  levelTitle,
  intro = "Your mission brief. Learn the basics, then you'll make the decisions.",
  slides,
  onStart,
  allowSkip = true,
}: LevelBriefingProps) {
  const maxIndex = Math.max(0, slides.length - 1);
  const [currentIndex, setCurrentIndex] = useState(() => getStoredSlideIndex(levelId, maxIndex));
  const slide = slides[currentIndex];

  useEffect(() => {
    setStoredSlideIndex(levelId, currentIndex);
  }, [levelId, currentIndex]);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === slides.length - 1;

  return (
    <div className="flex flex-1 flex-col overflow-auto p-6">
      <div className="mb-2 flex items-center gap-2 text-sm text-[var(--accent-neon)]">
        <span className="uppercase tracking-wider">Mission brief</span>
        <span className="text-[var(--text-muted)]">·</span>
        <span className="text-[var(--text-primary)]">{levelTitle}</span>
      </div>
      {intro && (
        <p className="mb-6 text-[var(--text-muted)]">{textWithTooltips(intro)}</p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-lg"
        >
          <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2">
            {textWithTooltips(slide.title)}
          </h2>
          <div className="prose prose-invert max-w-none text-[var(--text-primary)]">
            {typeof slide.body === 'string' ? (
              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                {slide.body
                  .split(/\n\n+/)
                  .map((paragraph, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {textWithTooltips(paragraph.trim())}
                    </p>
                  ))}
              </div>
            ) : (
              slide.body
            )}
          </div>
          {slide.tip && (
            <div className="mt-4 rounded-lg border border-[var(--accent-neon)]/40 bg-[var(--accent-neon)]/5 p-3 text-sm text-[var(--accent-neon)]">
              💡 {textWithTooltips(slide.tip)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-[var(--accent-neon)]' : 'w-2 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] disabled:opacity-40 hover:bg-[var(--bg-card)]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={isLast}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] disabled:opacity-40 hover:bg-[var(--bg-card)]"
          >
            Next
          </button>
        </div>
        <div className="flex gap-2">
          {allowSkip && (
            <button
              type="button"
              onClick={onStart}
              className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Skip briefing
            </button>
          )}
          <motion.button
            type="button"
            onClick={() => (isLast ? onStart() : setCurrentIndex((i) => i + 1))}
            className="rounded-lg bg-[var(--accent-neon)] px-6 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLast ? 'Start mission' : 'Next →'}
          </motion.button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
        Slide {currentIndex + 1} of {slides.length}
      </p>
    </div>
  );
}
