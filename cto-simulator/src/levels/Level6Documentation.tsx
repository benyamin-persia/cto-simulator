/**
 * Level 6 – Documentation (Ch 6).
 * README must include: overview, installation, env vars, how to run, API overview (per curriculum).
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { LevelBriefing } from '../components/LevelBriefing';
import { LevelContainer } from '../components/LevelContainer';
import { ScenarioCard } from '../components/ScenarioCard';
import { ResultPanel } from '../components/ResultPanel';
import { textWithTooltips } from '../components/TextWithTooltips';
import { LEVEL6_BRIEFING } from '../data/briefings';
import { LEVEL6_README_OPTIONS } from '../data/levels';

const DOCS_XP = 100;

export function Level6Documentation() {
  const navigate = useNavigate();
  const { addXp, completeLevel, recordDecisions, setStartupHealth } = useGameStore();
  const [showBriefing, setShowBriefing] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ message: string; xp?: number; variant?: 'info' | 'success' | 'warning' | 'error'; rememberTip?: string } | null>(null);
  const feedbackBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback) feedbackBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [feedback]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const correctIds = new Set<string>(LEVEL6_README_OPTIONS.filter((o) => o.correct).map((o) => o.id));
    const selectedCorrect = [...selected].filter((id: string) => correctIds.has(id));
    const selectedWrong = [...selected].filter((id: string) => !correctIds.has(id));
    if (selectedWrong.length === 0 && selectedCorrect.length === correctIds.size) {
      addXp(DOCS_XP);
      completeLevel(6);
      recordDecisions(6, { readmeSections: [...selected] as string[] });
      setFeedback({
        message: 'Correct. A good README includes: project overview, installation and configuration, environment variables, how to run, and API overview. Documentation is a living artifact — keep it updated.',
        xp: DOCS_XP,
        variant: 'success',
        rememberTip: 'README: overview, installation, env vars, how to run, API docs. Document required variables.',
      });
    } else {
      setStartupHealth(-5);
      const missing = [...correctIds].filter((id) => !selected.has(id));
      const wrong = selectedWrong.length > 0 ? ' Do not include: ' + LEVEL6_README_OPTIONS.filter((o) => selectedWrong.includes(o.id as string)).map((o) => o.label).join(', ') + '.' : '';
      setFeedback({
        message: `README should include all essential sections.${missing.length ? ' Missing: ' + LEVEL6_README_OPTIONS.filter((o) => missing.includes(o.id)).map((o) => o.label).join(', ') + '.' : ''}${wrong}`,
        variant: 'warning',
        rememberTip: 'README: overview, installation, env vars, how to run, API overview. No gossip or personal TODO only.',
      });
    }
  }, [selected, addXp, setStartupHealth, completeLevel, recordDecisions]);

  if (showBriefing) {
    return (
      <LevelBriefing
        levelId={6}
        levelTitle="Level 6 – Documentation"
        intro="Tick what a README must include. Feedback teaches the rest."
        slides={LEVEL6_BRIEFING}
        onStart={() => setShowBriefing(false)}
        allowSkip={true}
      />
    );
  }

  return (
    <LevelContainer title="Level 6 – Documentation" levelId={6}>
      <button type="button" onClick={() => setShowBriefing(true)} className="mb-2 text-sm text-[var(--accent-neon)] hover:underline">📖 Review briefing</button>
      {feedback?.variant === 'success' ? (
        <motion.div ref={feedbackBlockRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 scroll-mt-4">
          <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
          <button type="button" onClick={() => navigate('/final')} className="rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">See summary</button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <ScenarioCard title={textWithTooltips('Phase 1 of 1: What should a README include?')}>
            <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
              <strong className="text-[var(--accent-neon)]">Learn first: What a good README should include</strong>
              <p>A <strong>README</strong> is the first place new developers (or users) look. It should explain what the project is and how to get it running without guessing.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Project overview</strong> — What the project does, who it’s for, and maybe a short feature list. So someone can tell in seconds whether this is the right repo.</li>
                <li><strong>Installation and configuration</strong> — Prerequisites (Node, Python, etc.), how to install dependencies (e.g. <code className="rounded bg-[var(--bg-secondary)] px-1">npm install</code>), and any one-time setup steps.</li>
                <li><strong>Environment variables</strong> — Which env vars the app needs (e.g. <code className="rounded bg-[var(--bg-secondary)] px-1">DATABASE_URL</code>, <code className="rounded bg-[var(--bg-secondary)] px-1">API_KEY</code>) and what they’re for. Don’t leave people to reverse-engineer from the code.</li>
                <li><strong>How to run the app</strong> — Commands to start the app in dev or production (e.g. <code className="rounded bg-[var(--bg-secondary)] px-1">npm run dev</code>, <code className="rounded bg-[var(--bg-secondary)] px-1">docker-compose up</code>).</li>
                <li><strong>API overview (or link to API docs)</strong> — If the project exposes an API, describe main endpoints or link to OpenAPI/Swagger docs so consumers know how to call it.</li>
              </ul>
              <p>Include these; leave out things that don’t belong in a README (e.g. internal gossip, unrelated to-do lists, or content that belongs in a separate doc).</p>
            </div>
            <p className="mb-4 text-[var(--text-muted)]">
              {textWithTooltips('Select all sections that belong in a good README. Leave out what does not.')}
            </p>
            <div className="flex flex-col gap-2">
              {LEVEL6_README_OPTIONS.map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 hover:border-[var(--accent-neon-dim)]"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(o.id)}
                    onChange={() => toggle(o.id)}
                    className="h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--accent-neon)]"
                  />
                  <span className="text-[var(--text-primary)]">{textWithTooltips(o.label)}</span>
                </label>
              ))}
            </div>
            <button type="button" onClick={handleSubmit} className="mt-4 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Submit</button>
          </ScenarioCard>
          {feedback && (
            <div ref={feedbackBlockRef} className="scroll-mt-4">
              <ResultPanel message={feedback.message} variant={feedback.variant} rememberTip={feedback.rememberTip} />
              <button type="button" onClick={() => setFeedback(null)} className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Try again</button>
            </div>
          )}
        </motion.div>
      )}
    </LevelContainer>
  );
}
