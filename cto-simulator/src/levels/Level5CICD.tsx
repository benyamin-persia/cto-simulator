/**
 * Level 5 – CI/CD Pipeline (Ch 5: DevOps and CI/CD).
 * Order pipeline stages: Source → Build → Test → Security → Deploy (per curriculum).
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { LevelBriefing } from '../components/LevelBriefing';
import { LevelContainer } from '../components/LevelContainer';
import { ScenarioCard } from '../components/ScenarioCard';
import { ResultPanel } from '../components/ResultPanel';
import { textWithTooltips } from '../components/TextWithTooltips';
import { LEVEL5_BRIEFING } from '../data/briefings';
import { LEVEL5_PIPELINE_CORRECT_ORDER } from '../data/levels';

const PIPELINE_XP = 100;

function SortablePipelineItem({ id, text }: { id: string; text: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-3"
      {...attributes}
      {...listeners}
    >
      <span className="text-[var(--text-muted)]">⋮⋮</span>
      <span className="text-[var(--text-primary)]">{text}</span>
    </div>
  );
}

export function Level5CICD() {
  const navigate = useNavigate();
  const { addXp, completeLevel, recordDecisions, setStartupHealth } = useGameStore();
  const [showBriefing, setShowBriefing] = useState(true);
  const [pipelineOrder, setPipelineOrder] = useState<string[]>(() =>
    [...LEVEL5_PIPELINE_CORRECT_ORDER].sort(() => Math.random() - 0.5)
  );
  const [feedback, setFeedback] = useState<{ message: string; xp?: number; variant?: 'info' | 'success' | 'warning' | 'error'; rememberTip?: string } | null>(null);
  const feedbackBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback) feedbackBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [feedback]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setPipelineOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleCheck = useCallback(() => {
    const correct =
      pipelineOrder.length === LEVEL5_PIPELINE_CORRECT_ORDER.length &&
      pipelineOrder.every((item, i) => item === LEVEL5_PIPELINE_CORRECT_ORDER[i]);
    if (correct) {
      addXp(PIPELINE_XP);
      completeLevel(5);
      recordDecisions(5, { pipelineOrder });
      setFeedback({
        message: 'Correct. Order: Source control → Build → Test → Security scan → Deploy. Quality gates (e.g. tests must pass) before deploy.',
        xp: PIPELINE_XP,
        variant: 'success',
        rememberTip: 'CI/CD: SCM → Build → Test → Security → Deploy. Treat the pipeline as a product — maintain it.',
      });
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: 'Not quite. Correct order: 1) Source control (commit) 2) Build & package 3) Run tests 4) Security scan 5) Deploy. You must build and test before deploying.',
        variant: 'warning',
        rememberTip: 'Never deploy without building and testing first. Security scan before deploy.',
      });
    }
  }, [pipelineOrder, addXp, setStartupHealth, completeLevel, recordDecisions]);

  if (showBriefing) {
    return (
      <LevelBriefing
        levelId={5}
        levelTitle="Level 5 – CI/CD Pipeline"
        intro="Order the pipeline. You learn by doing."
        slides={LEVEL5_BRIEFING}
        onStart={() => setShowBriefing(false)}
        allowSkip={true}
      />
    );
  }

  return (
    <LevelContainer title="Level 5 – CI/CD Pipeline" levelId={5}>
      <button type="button" onClick={() => setShowBriefing(true)} className="mb-2 text-sm text-[var(--accent-neon)] hover:underline">📖 Review briefing</button>
      {feedback?.variant === 'success' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
          <button type="button" onClick={() => navigate('/level/6')} className="rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Next level</button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <ScenarioCard title={textWithTooltips('Phase 1 of 1: Order the CI/CD pipeline')}>
            <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
              <strong className="text-[var(--accent-neon)]">Learn first: CI/CD pipeline order and why it matters</strong>
              <p>A <strong>CI/CD pipeline</strong> automates building, testing, and deploying code. The stages must run in a fixed order so you never deploy broken or untested code.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>1. Source control (e.g. commit/push)</strong> — Code is committed and pushed. The pipeline is triggered from this point. Everything that follows is based on this snapshot.</li>
                <li><strong>2. Build & package</strong> — Compile code, install dependencies, and produce an artifact (e.g. a JAR, Docker image, or bundle). If the build fails, stop; don’t test or deploy.</li>
                <li><strong>3. Run tests</strong> — Unit tests, integration tests, etc. If tests fail, the code is not ready for production. Deployment must happen only after tests pass.</li>
                <li><strong>4. Security scan</strong> — Scan dependencies and/or the image for known vulnerabilities. Fix or accept risks before deploying.</li>
                <li><strong>5. Deploy</strong> — Release the built and tested artifact to the target environment. This step must come <em>last</em>: never deploy before building and testing.</li>
              </ul>
              <p>Correct order: <strong>Source → Build → Test → Security → Deploy.</strong> Skipping or reordering (e.g. deploy before tests) risks putting broken or insecure code into production.</p>
            </div>
            <p className="mb-4 text-[var(--text-muted)]">
              {textWithTooltips('Drag and drop the stages into the correct order. You must build and test before deploying.')}
            </p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={pipelineOrder} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                  {pipelineOrder.map((item) => (
                    <SortablePipelineItem key={item} id={item} text={item} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <button type="button" onClick={handleCheck} className="mt-4 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Check order</button>
          </ScenarioCard>
          {feedback && (
            <div ref={feedbackBlockRef} className="scroll-mt-4">
              <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
              <button type="button" onClick={() => setFeedback(null)} className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Try again</button>
            </div>
          )}
        </motion.div>
      )}
    </LevelContainer>
  );
}
