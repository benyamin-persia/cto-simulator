/**
 * Level 2 – Architecture Decision.
 * To pass, you must complete all three architecture phases: Monolith, Microservices, Serverless.
 * Each phase: one scenario; the correct answer is the option for that architecture.
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
import { LEVEL2_BRIEFING } from '../data/briefings';

type ArchId = 'monolith' | 'microservices' | 'serverless';

/** Order of phases: you must pass Monolith, then Microservices, then Serverless to complete the level. */
const PHASES: { id: ArchId; label: string; description: string }[] = [
  { id: 'monolith', label: 'Monolith', description: 'One app, one deployment' },
  { id: 'microservices', label: 'Microservices', description: 'Many small services' },
  { id: 'serverless', label: 'Serverless', description: 'Functions on demand' },
];

/** Pool of creative scenarios — each playthrough gets 3 random ones so questions feel fresh. */
const SCENARIO_POOL: {
  question: string;
  options: { id: ArchId; label: string }[];
  feedback: Record<ArchId, string>;
}[] = [
  {
    question: 'Black Friday: checkout traffic is 10× normal. What happens with YOUR architecture?',
    options: [
      { id: 'monolith', label: 'You scale the entire app; the admin and reporting modules scale too (waste).' },
      { id: 'microservices', label: 'You scale only the checkout and payment services.' },
      { id: 'serverless', label: 'Checkout functions auto-scale; you pay per request; idle drops to zero.' },
    ],
    feedback: {
      monolith: 'Monolith: you scale everything. Fine for small teams; painful when one part is hot. +30 XP.',
      microservices: 'Right: scale only the services under load. +30 XP.',
      serverless: 'Right: functions scale automatically; pay per use. +30 XP.',
    },
  },
  {
    question: 'A team wants to ship their feature without waiting for the big release. With YOUR architecture?',
    options: [
      { id: 'monolith', label: 'They wait — one codebase, one deployment train.' },
      { id: 'microservices', label: 'They deploy their service on their own schedule.' },
      { id: 'serverless', label: 'They deploy a new or updated function; no shared release.' },
    ],
    feedback: {
      monolith: 'With a monolith, everyone deploys together. +30 XP.',
      microservices: 'Right: teams own their services and release independently. +30 XP.',
      serverless: 'Right: each function is deployed separately. +30 XP.',
    },
  },
  {
    question: 'The auth service crashes at 3am. What’s the impact with YOUR architecture?',
    options: [
      { id: 'monolith', label: 'The whole app can go down; one codebase, one process.' },
      { id: 'microservices', label: 'Only auth is affected; other services can keep serving (degraded).' },
      { id: 'serverless', label: 'Only that function fails; the rest of the system keeps running.' },
    ],
    feedback: {
      monolith: 'Monolith: one bug can take down everything. +30 XP.',
      microservices: 'Right: fault isolation — one service can fail without killing the system. +30 XP.',
      serverless: 'Right: function-level isolation. +30 XP.',
    },
  },
  {
    question: 'You want to add a Python ML service; the rest of the stack is Java. With YOUR architecture?',
    options: [
      { id: 'monolith', label: 'Hard: one codebase usually means one language; big refactor or separate app.' },
      { id: 'microservices', label: 'Natural: add a new service in Python; others stay in Java.' },
      { id: 'serverless', label: 'Natural: add a new function in Python; each function can use different runtimes.' },
    ],
    feedback: {
      monolith: 'Monoliths tend to be single-language; mixing is possible but messy. +30 XP.',
      microservices: 'Right: polyglot — each service can use the best tech for the job. +30 XP.',
      serverless: 'Right: different functions can use different runtimes (e.g. Python, Node). +30 XP.',
    },
  },
  {
    question: 'Traffic is low most of the time; spikes only during campaigns. With YOUR architecture?',
    options: [
      { id: 'monolith', label: 'You keep a fixed number of servers running; simple, but you pay even when idle.' },
      { id: 'microservices', label: 'You can scale down underused services, but you still manage servers.' },
      { id: 'serverless', label: 'You pay only when code runs; near-zero cost when there’s no traffic.' },
    ],
    feedback: {
      monolith: 'Monolith: fixed capacity; you pay for peak or risk overload. +30 XP.',
      microservices: 'Right: scale down when quiet, but you still own the boxes. +30 XP.',
      serverless: 'Right: pay per execution; idle cost is minimal. Watch cold starts. +30 XP.',
    },
  },
  {
    question: 'A bug in "send email" is hard to reproduce. With YOUR architecture, how do you debug?',
    options: [
      { id: 'monolith', label: 'Single process: attach a debugger, set breakpoints; straightforward but one big app.' },
      { id: 'microservices', label: 'Distributed: trace across services; need good logging and tracing.' },
      { id: 'serverless', label: 'Stateless functions: rely on logs and traces; can’t attach a debugger to production.' },
    ],
    feedback: {
      monolith: 'Monolith: simpler debugging — one process, one deploy. +30 XP.',
      microservices: 'Right: debugging is cross-service; invest in observability. +30 XP.',
      serverless: 'Right: debug via logs/traces; local replay for complex cases. +30 XP.',
    },
  },
  {
    question: 'The product team wants a "rare report" that runs once a month. With YOUR architecture?',
    options: [
      { id: 'monolith', label: 'You add a route or job in the main app; it runs when called; always deployed.' },
      { id: 'microservices', label: 'You add a small report service; it can scale to zero when not used (if your stack allows).' },
      { id: 'serverless', label: 'You add a scheduled function; it runs on a cron; you pay only for that run (cold start possible).' },
    ],
    feedback: {
      monolith: 'Monolith: easy to add; the whole app is always running anyway. +30 XP.',
      microservices: 'Right: a dedicated service; scale to zero if your platform supports it. +30 XP.',
      serverless: 'Right: scheduled functions fit "run rarely" well; pay per run. Cold start may delay first run. +30 XP.',
    },
  },
  {
    question: 'Two features need the same customer data at the same time and must stay consistent. With YOUR architecture?',
    options: [
      { id: 'monolith', label: 'Easier: one database, one transaction boundary; ACID across the app.' },
      { id: 'microservices', label: 'Harder: each service may have its own DB; you need sagas or eventual consistency.' },
      { id: 'serverless', label: 'Depends: shared DB possible but not inherent; consistency is your design choice.' },
    ],
    feedback: {
      monolith: 'Right: monoliths simplify transactions — one DB, one process. +30 XP.',
      microservices: 'Right: distributed data is hard; design for eventual consistency or distributed transactions. +30 XP.',
      serverless: 'Right: serverless doesn’t dictate data; you choose shared vs per-function storage. +30 XP.',
    },
  },
];

/** Pick 3 random scenario indices (one per phase; may repeat). */
function pickRandomScenarioIndices(): number[] {
  return [
    Math.floor(Math.random() * SCENARIO_POOL.length),
    Math.floor(Math.random() * SCENARIO_POOL.length),
    Math.floor(Math.random() * SCENARIO_POOL.length),
  ];
}

const SCENARIO_XP = 30;

/** Shuffle array (Fisher–Yates) so correct answer isn’t always first. */
function shuffleOptions<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Level2Architecture() {
  const navigate = useNavigate();
  const { addXp, completeLevel, recordDecisions } = useGameStore();
  const [showBriefing, setShowBriefing] = useState(true);
  const [step, setStep] = useState<0 | 1 | 2 | 'done'>(0);
  const [scenarioAnswer, setScenarioAnswer] = useState<ArchId | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [rememberTip, setRememberTip] = useState<string | undefined>(undefined);
  const [shuffledOptions, setShuffledOptions] = useState<{ id: ArchId; label: string }[]>([]);
  const [scenarioIndices] = useState(() => pickRandomScenarioIndices());
  const feedbackBlockRef = useRef<HTMLDivElement>(null);

  const currentScenarios = scenarioIndices.map((i) => SCENARIO_POOL[i]);
  const requiredArch = step !== 'done' ? PHASES[step].id : null;

  useEffect(() => {
    if (step === 0 || step === 1 || step === 2) {
      setShuffledOptions(shuffleOptions(currentScenarios[step].options));
    }
  }, [step]);

  useEffect(() => {
    if (feedback) feedbackBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [feedback]);

  const handleScenarioAnswer = (optionId: ArchId) => {
    if (step === 'done' || !currentScenarios[step]) return;
    setScenarioAnswer(optionId);
    const scenario = currentScenarios[step];
    const isCorrect = optionId === requiredArch;
    const message = isCorrect ? scenario.feedback[optionId] : `For ${PHASES[step].label} the correct outcome is: ${scenario.feedback[requiredArch!]}. Try again.`;
    setFeedback(message);
    if (isCorrect) addXp(SCENARIO_XP);
  };

  const handleNextFromFeedback = () => {
    setFeedback(null);
    setScenarioAnswer(null);
    if (step === 0) {
      setStep(1);
      setShuffledOptions(shuffleOptions(currentScenarios[1].options));
    } else if (step === 1) {
      setStep(2);
      setShuffledOptions(shuffleOptions(currentScenarios[2].options));
    } else if (step === 2) {
      recordDecisions(2, { passedPhases: ['monolith', 'microservices', 'serverless'] });
      completeLevel(2);
      setStep('done');
      setFeedback('Level 2 complete. You passed all three architectures: Monolith, Microservices, and Serverless. You can now go to Database design.');
      setRememberTip('Next: database design. Same idea — choices and consequences.');
    }
  };

  const handleNextToLevel3 = () => {
    navigate('/level/3');
  };

  if (showBriefing) {
    return (
      <LevelBriefing
        levelId={2}
        levelTitle="Level 2 – Architecture Decision"
        intro="3 phases. Pick the outcome that matches each architecture. You learn by playing."
        slides={LEVEL2_BRIEFING}
        onStart={() => setShowBriefing(false)}
        allowSkip={true}
      />
    );
  }

  return (
    <LevelContainer title="Level 2 – Architecture Decision" levelId={2}>
      <button
        type="button"
        onClick={() => setShowBriefing(true)}
        className="mb-2 text-sm text-[var(--accent-neon)] hover:underline"
      >
        📖 Review briefing
      </button>

      <AnimatePresence mode="wait">
        {(step === 0 || step === 1 || step === 2) && currentScenarios[step] && (
          <motion.div key={`s-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <ScenarioCard title={textWithTooltips(`Phase ${step + 1} of 3: ${PHASES[step].label}`)}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: Monolith vs Microservices vs Serverless</strong>
                <p><strong>Monolith:</strong> {textWithTooltips('One application, one codebase, one deploy. All features run in a single process. You scale by running more copies of the whole app (scale up or scale out). If one part fails or gets overloaded, the whole system is affected. Good for: small teams, simple ops, fast early development. Drawback: tight coupling; one deploy touches everything; scaling is all-or-nothing.')}</p>
                <p><strong>Microservices:</strong> {textWithTooltips('The system is split into many small services, each deployable and scalable independently. Teams can own different services and use different tech stacks. Failures can be isolated to one service. Tradeoffs: distributed complexity (network, discovery, data consistency), more operational overhead, and you need to design for partial failure.')}</p>
                <p><strong>Serverless:</strong> {textWithTooltips('You run code in small units (functions) without managing servers. The cloud runs and scales them; you pay per invocation and resource use. No servers to patch or size; great for sporadic or variable load. Drawbacks: cold starts (first request after idle can be slow), limits on execution time and memory, and vendor lock-in. Pick the option that describes what happens with this phase\'s architecture (Monolith / Microservices / Serverless).')}</p>
              </div>
              <p className="mb-4 text-[var(--text-primary)] font-medium">
                {textWithTooltips(currentScenarios[step].question)}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledOptions.length > 0 ? shuffledOptions : currentScenarios[step].options).map((opt) => (
                  <DecisionButton
                    key={opt.id}
                    label={textWithTooltips(opt.label)}
                    onClick={() => handleScenarioAnswer(opt.id)}
                    variant={scenarioAnswer === opt.id ? (opt.id === requiredArch ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback}
                  xpGained={scenarioAnswer === requiredArch ? SCENARIO_XP : undefined}
                  variant={scenarioAnswer === requiredArch ? 'success' : 'warning'}
                />
                {scenarioAnswer === requiredArch && (
                  <button
                    type="button"
                    onClick={handleNextFromFeedback}
                    className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                  >
                    {step === 2 ? 'Complete level' : 'Next phase'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === 'done' && feedback && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <ResultPanel message={feedback} variant="success" rememberTip={rememberTip} />
            <button
              type="button"
              onClick={handleNextToLevel3}
              className="rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
            >
              Next level
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LevelContainer>
  );
}
