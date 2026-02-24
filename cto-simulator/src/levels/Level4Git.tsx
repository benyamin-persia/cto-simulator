/**
 * Level 4 – Git (Ch 3: Development Environment Setup).
 * Covers: Git commands (clone, status, add, commit, push, pull) from the curriculum.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { LevelBriefing } from '../components/LevelBriefing';
import { LevelContainer } from '../components/LevelContainer';
import { ScenarioCard } from '../components/ScenarioCard';
import { DecisionButton } from '../components/DecisionButton';
import { ResultPanel } from '../components/ResultPanel';
import { textWithTooltips } from '../components/TextWithTooltips';
import { LEVEL4_BRIEFING } from '../data/briefings';
import { LEVEL4_GIT_QUESTIONS, pickRandomIndices } from '../data/levels';

const XP_PER_QUESTION = 30;
const QUESTIONS_PER_PLAY = 3;

function shuffleOptions<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Level4Git() {
  const navigate = useNavigate();
  const { addXp, completeLevel, recordDecisions, setStartupHealth } = useGameStore();
  const [showBriefing, setShowBriefing] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionIndices] = useState<number[]>(() => pickRandomIndices(LEVEL4_GIT_QUESTIONS.length, QUESTIONS_PER_PLAY));
  const [shuffled, setShuffled] = useState<Record<number, typeof LEVEL4_GIT_QUESTIONS[0]['options']>>({});
  const [feedback, setFeedback] = useState<{ message: string; xp?: number; variant?: 'info' | 'success' | 'warning' | 'error'; rememberTip?: string } | null>(null);
  const feedbackBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    questionIndices.forEach((qIdx, stepIdx) => {
      setShuffled((prev) => ({ ...prev, [stepIdx]: shuffleOptions(LEVEL4_GIT_QUESTIONS[qIdx].options) }));
    });
  }, [questionIndices.join(',')]);

  useEffect(() => {
    if (feedback) feedbackBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [feedback]);

  const currentQ = step < questionIndices.length ? LEVEL4_GIT_QUESTIONS[questionIndices[step]] : null;
  const shuffledOpts = shuffled[step]?.length ? shuffled[step] : currentQ?.options ?? [];
  const selectedId = answers[step];
  const correctId = currentQ?.options.find((o) => o.correct)?.id;

  const handleAnswer = (optionId: string) => {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [step]: optionId }));
    const correct = optionId === correctId;
    if (correct) {
      addXp(XP_PER_QUESTION);
      setFeedback({
        message: 'Correct. This is the right Git command for that step in the workflow.',
        xp: XP_PER_QUESTION,
        variant: 'success',
        rememberTip: 'Workflow: clone → edit → git add → git commit -m "..." → git push. Use git pull to get latest.',
      });
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: `Not quite. The correct command for this step is: ${currentQ.options.find((o) => o.correct)?.label}.`,
        variant: 'warning',
        rememberTip: 'commit = save locally; push = send to remote; pull = get from remote.',
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (step < questionIndices.length - 1) {
      setStep((s) => s + 1);
    } else {
      recordDecisions(4, { gitAnswers: answers });
      completeLevel(4);
      navigate('/level/5');
    }
  };

  if (showBriefing) {
    return (
      <LevelBriefing
        levelId={4}
        levelTitle="Level 4 – Git"
        intro="3 questions. Pick the right Git command. You learn by doing."
        slides={LEVEL4_BRIEFING}
        onStart={() => setShowBriefing(false)}
        allowSkip={true}
      />
    );
  }

  if (step >= questionIndices.length && !feedback) {
    return (
      <LevelContainer title="Level 4 – Git" levelId={4}>
        <button type="button" onClick={() => setShowBriefing(true)} className="mb-2 text-sm text-[var(--accent-neon)] hover:underline">📖 Review briefing</button>
        <p className="text-[var(--text-muted)]">Level complete. <button type="button" onClick={() => navigate('/level/5')} className="text-[var(--accent-neon)] hover:underline">Go to Level 5</button></p>
      </LevelContainer>
    );
  }

  return (
    <LevelContainer title="Level 4 – Git" levelId={4}>
      <button type="button" onClick={() => setShowBriefing(true)} className="mb-2 text-sm text-[var(--accent-neon)] hover:underline">📖 Review briefing</button>
      <AnimatePresence mode="wait">
        {currentQ && (
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <ScenarioCard title={textWithTooltips(`Phase ${step + 1} of ${questionIndices.length}: Git command`)}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: Essential Git commands and what they do</strong>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>git commit</strong> — Saves a snapshot of your staged changes <em>locally</em>. Nothing is sent to the server yet. You’re recording "this is a checkpoint in my project history."</li>
                  <li><strong>git push</strong> — Sends your local commits to the <em>remote</em> repository (e.g. GitHub, GitLab). Use this after commit when you want to share or back up your work.</li>
                  <li><strong>git pull</strong> — Fetches the latest changes from the remote and merges them into your current branch. Use it to get updates from others (or from another machine) before you keep working.</li>
                  <li><strong>git status</strong> — Shows which files are modified, staged, or untracked. It does not change any files; it only reports the current state of your working directory and staging area.</li>
                  <li><strong>git checkout -b &lt;branch&gt;</strong> — Creates a new branch with the given name and switches to it in one step. You use this when starting a new feature or fix so your work is isolated from the main branch.</li>
                </ul>
                <p>Summary: commit = save locally; push = send to remote; pull = get latest; status = see changes; checkout -b = create and switch to a new branch.</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">{textWithTooltips(currentQ.question)}</p>
              <div className="flex flex-col gap-3">
                {shuffledOpts.map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.label)}
                    onClick={() => handleAnswer(o.id)}
                    variant={selectedId === o.id ? (o.correct ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
                <button type="button" onClick={handleNext} className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">
                  {step < questionIndices.length - 1 ? 'Next phase' : 'Complete level'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LevelContainer>
  );
}
