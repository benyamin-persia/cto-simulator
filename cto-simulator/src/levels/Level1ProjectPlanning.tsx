/**
 * Level 1 – Project Planning (full implementation).
 * Steps: 1) Select startup type, 2) Choose SMART goal, 3) Identify stakeholders, 4) Order WBS tasks (drag and drop).
 * Each step gives feedback and XP; completing all steps completes the level.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useGameStore } from '../store/gameStore';
import { LevelContainer } from '../components/LevelContainer';
import { ScenarioCard } from '../components/ScenarioCard';
import { DecisionButton } from '../components/DecisionButton';
import { ResultPanel } from '../components/ResultPanel';
import {
  STARTUP_TYPES,
  SMART_GOAL_OPTIONS,
  STAKEHOLDER_OPTIONS,
  REVIEW_SCHEDULE_OPTIONS,
  USER_STORY_OPTIONS,
  LEVEL1_WBS_CORRECT_ORDER,
} from '../data/levels';
import { LevelBriefing } from '../components/LevelBriefing';
import { textWithTooltips } from '../components/TextWithTooltips';
import { LEVEL1_BRIEFING } from '../data/briefings';

const STEP_XP = { startupType: 25, smartGoal: 25, stakeholders: 25, riskReview: 20, userStory: 20, wbs: 25 };

type Step = 'startupType' | 'smartGoal' | 'stakeholders' | 'riskReview' | 'userStory' | 'wbs' | 'done';

const PLANNING_PHASE_COUNT = 6;

/** Shuffle array (Fisher–Yates) so the correct answer isn’t always first. */
function shuffleOptions<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function SortableWBSItem({ id, text }: { id: string; text: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 ${
        isDragging ? 'opacity-80 shadow-lg' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <span className="text-[var(--text-muted)]">⋮⋮</span>
      <span className="text-[var(--text-primary)]">{text}</span>
    </div>
  );
}

export function Level1ProjectPlanning() {
  const navigate = useNavigate();
  const { addXp, completeLevel, recordDecisions, setStartupHealth } = useGameStore();

  const [showBriefing, setShowBriefing] = useState(true);
  const [step, setStep] = useState<Step>('startupType');
  const [startupType, setStartupType] = useState<string | null>(null);
  const [smartGoalId, setSmartGoalId] = useState<string | null>(null);
  const [stakeholders, setStakeholders] = useState<Set<string>>(new Set());
  const [wbsOrder, setWbsOrder] = useState<string[]>(() => [...LEVEL1_WBS_CORRECT_ORDER].sort(() => Math.random() - 0.5));
  const [feedback, setFeedback] = useState<{
    message: string;
    xp?: number;
    variant?: 'info' | 'success' | 'warning' | 'error';
    rememberTip?: string;
  } | null>(null);
  const [shuffledSmartGoalOptions, setShuffledSmartGoalOptions] = useState<
    { id: string; text: string; correct: boolean }[]
  >([]);
  const [shuffledRiskOptions, setShuffledRiskOptions] = useState<
    { id: string; label: string; correct: boolean }[]
  >([]);
  const [shuffledUserStoryOptions, setShuffledUserStoryOptions] = useState<
    { id: string; text: string; correct: boolean }[]
  >([]);
  const [riskReviewId, setRiskReviewId] = useState<string | null>(null);
  const [userStoryId, setUserStoryId] = useState<string | null>(null);
  const feedbackBlockRef = useRef<HTMLDivElement>(null);

  // When entering each step, shuffle options so the correct answer isn’t always first
  useEffect(() => {
    if (step === 'smartGoal') setShuffledSmartGoalOptions(shuffleOptions(SMART_GOAL_OPTIONS));
    if (step === 'riskReview') setShuffledRiskOptions(shuffleOptions([...REVIEW_SCHEDULE_OPTIONS]));
    if (step === 'userStory') setShuffledUserStoryOptions(shuffleOptions(USER_STORY_OPTIONS));
  }, [step]);

  // Scroll feedback + Next button into view when feedback appears so the user always sees the action
  useEffect(() => {
    if (feedback) feedbackBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [feedback]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleStartupType = useCallback(
    (typeId: string) => {
      setStartupType(typeId);
      addXp(STEP_XP.startupType);
      setFeedback({
        message: 'Good choice. Defining your startup type helps align the team and stakeholders on scope and priorities.',
        xp: STEP_XP.startupType,
        variant: 'success',
        rememberTip: 'One type = clear scope. Pick SaaS, E‑commerce, Marketplace, or DevTools — and stick to it so everyone knows what you\'re building.',
      });
    },
    [addXp]
  );

  const handleSmartGoal = useCallback(
    (optionId: string) => {
      const option = SMART_GOAL_OPTIONS.find((o) => o.id === optionId);
      setSmartGoalId(optionId);
      if (option?.correct) {
        addXp(STEP_XP.smartGoal);
        setFeedback({
          message: 'Correct. A SMART goal is Specific, Measurable, Achievable, Relevant, and Time-bound. This one has a clear metric (20%), timeframe (Q2), and measurable outcome.',
          xp: STEP_XP.smartGoal,
          variant: 'success',
          rememberTip: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound. Ask: "Can I put a number on it? Is there a deadline?"',
        });
      } else {
        setStartupHealth(-5);
        setFeedback({
          message: 'This goal is too vague. SMART goals need a clear metric, deadline, and measurable outcome. Try the option that includes "20%", "Q2", and "measurable KPIs".',
          variant: 'warning',
          rememberTip: 'SMART = Specific, Measurable, Achievable, Relevant, Time-bound. Ask: "Can I put a number on it? Is there a deadline?"',
        });
      }
    },
    [addXp, setStartupHealth]
  );

  const handleStakeholdersToggle = useCallback((id: string) => {
    setStakeholders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleStakeholdersSubmit = useCallback(() => {
    const correctIds = new Set<string>(STAKEHOLDER_OPTIONS.filter((o) => o.correct).map((o) => o.id));
    const selectedCorrect = [...stakeholders].filter((s) => correctIds.has(s));
    const selectedWrong = [...stakeholders].filter((s) => !correctIds.has(s));
    if (selectedWrong.length === 0 && selectedCorrect.length === correctIds.size) {
      addXp(STEP_XP.stakeholders);
      setFeedback({
        message: 'Correct. Investors, end users, and your engineering/product team are key stakeholders. Competitors are not stakeholders you manage—they are external forces.',
        xp: STEP_XP.stakeholders,
        variant: 'success',
        rememberTip: 'Stakeholders = who cares or who can affect the project. Think: Investors, Users, Team. Competitors are outside — you don\'t manage them.',
      });
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: 'Stakeholders are parties with an interest in the project. Include: Investors, End users, Engineering & product team. Do not include competitors.',
        variant: 'warning',
        rememberTip: 'Stakeholders = who cares or who can affect the project. Think: Investors, Users, Team. Competitors are outside — you don\'t manage them.',
      });
    }
  }, [stakeholders, addXp, setStartupHealth]);

  const handleRiskReview = useCallback(
    (optionId: string) => {
      const option = REVIEW_SCHEDULE_OPTIONS.find((o) => o.id === optionId);
      setRiskReviewId(optionId);
      if (option?.correct) {
        addXp(STEP_XP.riskReview);
        setFeedback({
          message: 'Correct. Per the project planning framework, risk assessment is reviewed quarterly so risks stay visible and mitigation stays on track.',
          xp: STEP_XP.riskReview,
          variant: 'success',
          rememberTip: 'Review schedule: Monthly = timeline & resources; Quarterly = risk assessment; Semi-annual = business alignment.',
        });
      } else {
        setStartupHealth(-5);
        setFeedback({
          message: 'Not quite. The framework recommends reviewing risk assessment quarterly. Timeline and resources are reviewed monthly; business alignment semi-annually.',
          variant: 'warning',
          rememberTip: 'Review schedule: Monthly = timeline & resources; Quarterly = risk assessment; Semi-annual = business alignment.',
        });
      }
    },
    [addXp, setStartupHealth]
  );

  const handleUserStory = useCallback(
    (optionId: string) => {
      const option = USER_STORY_OPTIONS.find((o) => o.id === optionId);
      setUserStoryId(optionId);
      if (option?.correct) {
        addXp(STEP_XP.userStory);
        setFeedback({
          message: 'Correct. A good user story follows: "As a [role], I want [something] so that [benefit]." This one has a clear role, action, and reason.',
          xp: STEP_XP.userStory,
          variant: 'success',
          rememberTip: 'User story = As a [user], I want [X] so that [benefit]. Keeps scope clear and testable.',
        });
      } else {
        setStartupHealth(-5);
        setFeedback({
          message: 'A well-formed user story has: a role (As a…), a concrete action (I want…), and a benefit (so that…). Pick the one that includes all three.',
          variant: 'warning',
          rememberTip: 'User story = As a [user], I want [X] so that [benefit]. Keeps scope clear and testable.',
        });
      }
    },
    [addXp, setStartupHealth]
  );

  const handleWbsDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setWbsOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleWbsCheck = useCallback(() => {
    const correct =
      wbsOrder.length === LEVEL1_WBS_CORRECT_ORDER.length &&
      wbsOrder.every((task, i) => task === LEVEL1_WBS_CORRECT_ORDER[i]);
    if (correct) {
      addXp(STEP_XP.wbs);
      setFeedback({
        message: 'Correct order. A proper WBS follows: research → requirements → design → development → testing → deployment. This sequence reduces rework and aligns the team.',
        xp: STEP_XP.wbs,
        variant: 'success',
        rememberTip: 'WBS order: Research → Requirements → Design → Build → Test → Deploy. Never skip research or design — or you pay later.',
      });
      recordDecisions(1, {
        startupType,
        smartGoalId,
        stakeholders: [...stakeholders],
        riskReviewId,
        userStoryId,
        wbsOrder,
      });
      completeLevel(1);
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: 'Not quite. The correct order is: Market research → Define requirements → Design architecture → Development → Testing & QA → Deployment & launch. Reorder and try again.',
        variant: 'warning',
        rememberTip: 'WBS order: Research → Requirements → Design → Build → Test → Deploy. Never skip research or design — or you pay later.',
      });
    }
  }, [wbsOrder, addXp, setStartupHealth, recordDecisions, completeLevel, startupType, smartGoalId, stakeholders, riskReviewId, userStoryId]);

  const handleNextFromFeedback = useCallback(() => {
    if (!feedback) return;
    if (step === 'startupType') {
      setStep('smartGoal');
      setShuffledSmartGoalOptions(shuffleOptions(SMART_GOAL_OPTIONS));
      setFeedback(null);
    } else if (step === 'smartGoal') {
      setStep('stakeholders');
      setFeedback(null);
    } else if (step === 'stakeholders') {
      setStep('riskReview');
      setShuffledRiskOptions(shuffleOptions([...REVIEW_SCHEDULE_OPTIONS]));
      setFeedback(null);
    } else if (step === 'riskReview') {
      setStep('userStory');
      setShuffledUserStoryOptions(shuffleOptions(USER_STORY_OPTIONS));
      setFeedback(null);
    } else if (step === 'userStory') {
      setStep('wbs');
      setFeedback(null);
    } else if (step === 'wbs') {
      if (feedback.variant === 'success') {
        setFeedback(null);
        navigate('/level/2');
      } else {
        setFeedback(null);
      }
    }
  }, [feedback, step, navigate]);

  if (showBriefing) {
    return (
      <LevelBriefing
        levelId={1}
        levelTitle="Level 1 – Project Planning"
        intro="6 phases. You learn by playing and from feedback."
        slides={LEVEL1_BRIEFING}
        onStart={() => setShowBriefing(false)}
        allowSkip={true}
      />
    );
  }

  return (
    <LevelContainer title="Level 1 – Project Planning" levelId={1}>
      <div className="mb-2">
        <button
          type="button"
          onClick={() => setShowBriefing(true)}
          className="text-sm text-[var(--accent-neon)] hover:underline"
        >
          📖 Review briefing
        </button>
      </div>
      <AnimatePresence mode="wait">
        {step === 'startupType' && (
          <motion.div
            key="startupType"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ScenarioCard title={textWithTooltips(`Phase 1 of ${PLANNING_PHASE_COUNT}: Choose your startup type`)}>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips('Your role: CTO of a new startup. Select the type of product you are building.')}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {STARTUP_TYPES.map((t) => (
                  <DecisionButton
                    key={t.id}
                    label={textWithTooltips(t.label)}
                    description={textWithTooltips(t.description)}
                    onClick={() => handleStartupType(t.id)}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback.message}
                  xpGained={feedback.xp}
                  variant={feedback.variant}
                  rememberTip={feedback.rememberTip}
                />
                <button
                  type="button"
                  onClick={handleNextFromFeedback}
                  className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                >
                  Next phase
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'smartGoal' && (
          <motion.div
            key="smartGoal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ScenarioCard title={textWithTooltips(`Phase 2 of ${PLANNING_PHASE_COUNT}: Select the SMART goal`)}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: What makes a goal SMART</strong>
                <p>SMART stands for: <strong>S</strong>pecific, <strong>M</strong>easurable, <strong>A</strong>chievable, <strong>R</strong>elevant, <strong>T</strong>ime-bound.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Specific:</strong> Clear and concrete — not "improve performance" but "reduce API response time for the dashboard."</li>
                  <li><strong>Measurable:</strong> You can put a number on it (e.g. "20% increase in sign-ups", "response time under 200 ms").</li>
                  <li><strong>Achievable:</strong> Realistic given resources and constraints.</li>
                  <li><strong>Relevant:</strong> Aligned with business or product priorities.</li>
                  <li><strong>Time-bound:</strong> Has a deadline (e.g. "by Q2", "by end of March").</li>
                </ul>
                <p>A well-formed SMART goal includes a <em>clear metric</em> and a <em>timeframe</em>. Vague goals like "grow the product" or "make things better" are not SMART because they are not measurable or time-bound.</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips('Which of the following is a well-formed SMART goal?')}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledSmartGoalOptions.length > 0 ? shuffledSmartGoalOptions : [...SMART_GOAL_OPTIONS]).map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.text)}
                    onClick={() => handleSmartGoal(o.id)}
                    variant={smartGoalId === o.id ? (o.correct ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback.message}
                  xpGained={feedback.xp}
                  variant={feedback.variant}
                  rememberTip={feedback.rememberTip}
                />
                <button
                  type="button"
                  onClick={handleNextFromFeedback}
                  className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                >
                  Next phase
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'stakeholders' && (
          <motion.div
            key="stakeholders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ScenarioCard title={textWithTooltips(`Phase 3 of ${PLANNING_PHASE_COUNT}: Identify key stakeholders`)}>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips('Select all parties that are stakeholders in your project (who have a direct interest or influence).')}
              </p>
              <div className="flex flex-col gap-2">
                {STAKEHOLDER_OPTIONS.map((o) => (
                  <label
                    key={o.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3 hover:border-[var(--accent-neon-dim)]"
                  >
                    <input
                      type="checkbox"
                      checked={stakeholders.has(o.id)}
                      onChange={() => handleStakeholdersToggle(o.id)}
                      className="h-4 w-4 rounded border-[var(--border-subtle)] text-[var(--accent-neon)]"
                    />
                    <span className="text-[var(--text-primary)]">{textWithTooltips(o.label)}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={handleStakeholdersSubmit}
                className="mt-4 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
              >
                Submit
              </button>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback.message}
                  xpGained={feedback.xp}
                  variant={feedback.variant}
                  rememberTip={feedback.rememberTip}
                />
                <button
                  type="button"
                  onClick={handleNextFromFeedback}
                  className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                >
                  Next phase
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'riskReview' && (
          <motion.div
            key="riskReview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ScenarioCard title={textWithTooltips(`Phase 4 of ${PLANNING_PHASE_COUNT}: When to review risk assessment?`)}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: Review cadences and what each is for</strong>
                <p>Project planning uses different <em>review cadences</em> for different purposes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Monthly reviews</strong> focus on <em>timeline and resources</em>: Are we on track? Do we need to adjust schedules or allocation? This is where you catch slippage early.</li>
                  <li><strong>Quarterly reviews</strong> are when you do a formal <em>risk assessment</em>: What could go wrong? What has changed? Update risk registers, mitigation plans, and priorities. Risk is re-evaluated on a quarterly cycle so it stays current without overwhelming the team.</li>
                  <li><strong>Semi-annual reviews</strong> look at <em>business alignment</em>: Does the project still match strategy? Should scope or goals change? This is higher-level than day-to-day execution.</li>
                </ul>
                <p>So: <strong>risk assessment</strong> is typically done on a <strong>quarterly</strong> schedule, not monthly (too frequent) or only semi-annually (too rare for risks).</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips('The project planning framework recommends a regular review schedule. When should you review risk assessment?')}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledRiskOptions.length > 0 ? shuffledRiskOptions : [...REVIEW_SCHEDULE_OPTIONS]).map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.label)}
                    onClick={() => handleRiskReview(o.id)}
                    variant={riskReviewId === o.id ? (o.correct ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback.message}
                  xpGained={feedback.xp}
                  variant={feedback.variant}
                  rememberTip={feedback.rememberTip}
                />
                <button
                  type="button"
                  onClick={handleNextFromFeedback}
                  className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                >
                  Next phase
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'userStory' && (
          <motion.div
            key="userStory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ScenarioCard title={textWithTooltips(`Phase 5 of ${PLANNING_PHASE_COUNT}: Which is a well-formed user story?`)}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: User story format and why it matters</strong>
                <p>A <strong>user story</strong> describes a single capability from the user’s perspective. The standard format is:</p>
                <p className="font-medium">"As a [role], I want [action] so that [benefit]."</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Role:</strong> Who is the user? (e.g. "a logged-in customer", "an admin")</li>
                  <li><strong>Action:</strong> What do they want to do? (e.g. "filter orders by date")</li>
                  <li><strong>Benefit:</strong> Why does it matter? (e.g. "so that I can find last month’s orders quickly")</li>
                </ul>
                <p>All three parts must be <em>clear and specific</em>. Vague or incomplete stories (e.g. "make the app better" or missing the "so that" part) are not well-formed. A good user story is testable: you can tell when it’s done.</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips('Which option is a well-formed user story?')}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledUserStoryOptions.length > 0 ? shuffledUserStoryOptions : [...USER_STORY_OPTIONS]).map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.text)}
                    onClick={() => handleUserStory(o.id)}
                    variant={userStoryId === o.id ? (o.correct ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback.message}
                  xpGained={feedback.xp}
                  variant={feedback.variant}
                  rememberTip={feedback.rememberTip}
                />
                <button
                  type="button"
                  onClick={handleNextFromFeedback}
                  className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                >
                  Next phase
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'wbs' && (
          <motion.div
            key="wbs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <ScenarioCard title={textWithTooltips(`Phase 6 of ${PLANNING_PHASE_COUNT}: Order the WBS (Work Breakdown Structure)`)}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: Typical order of project phases (WBS)</strong>
                <p>A <strong>Work Breakdown Structure (WBS)</strong> breaks the project into ordered phases. For a typical software project, the logical order is:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Research:</strong> Understand the problem, users, and options. Don’t skip this — building the wrong thing is costly.</li>
                  <li><strong>Requirements:</strong> Define what the system must do (functional and non-functional).</li>
                  <li><strong>Design:</strong> Architecture, data model, APIs. Deciding how to build before coding avoids rework.</li>
                  <li><strong>Build:</strong> Implement the solution.</li>
                  <li><strong>Test:</strong> Verify behavior, quality, and performance.</li>
                  <li><strong>Deploy:</strong> Release to users and operate the system.</li>
                </ul>
                <p>You must do <em>Research</em> and <em>Design</em> before <em>Build</em>; testing comes before deployment. Getting the order wrong (e.g. Build before Design, or Deploy before Test) leads to rework, bugs in production, or building the wrong product.</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips('Drag and drop the tasks into the correct order for a typical software project.')}
              </p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleWbsDragEnd}
              >
                <SortableContext
                  items={wbsOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {wbsOrder.map((task) => (
                      <SortableWBSItem key={task} id={task} text={task} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <button
                type="button"
                onClick={handleWbsCheck}
                className="mt-4 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
              >
                Check order
              </button>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel
                  message={feedback.message}
                  xpGained={feedback.xp}
                  variant={feedback.variant}
                  rememberTip={feedback.rememberTip}
                />
                <button
                  type="button"
                  onClick={handleNextFromFeedback}
                  className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90"
                >
                  {feedback.variant === 'success' ? 'Complete level' : 'Try again'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LevelContainer>
  );
}
