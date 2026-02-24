/**
 * Level 3 – Database Design.
 * Covers: Relational vs NoSQL (doc 2.2), Normalization (1NF–BCNF), Indexing.
 * Full gameplay so the curriculum content is visible and testable in the game.
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
import { LEVEL3_BRIEFING } from '../data/briefings';
import {
  LEVEL3_DB_TYPE_OPTIONS,
  LEVEL3_DB_SCENARIOS,
  LEVEL3_NORMALIZATION_OPTIONS,
  LEVEL3_NORMALIZATION_QUESTIONS,
  LEVEL3_INDEX_OPTIONS,
  LEVEL3_INDEX_QUESTION,
  pickRandomIndices,
} from '../data/levels';

const STEP_XP = { dbType: 35, normalization: 35, indexing: 35 };

type Step = 'dbType' | 'normalization' | 'indexing' | 'done';

/** Shuffle array (Fisher–Yates) so correct answer isn’t always first. */
function shuffleOptions<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function Level3Database() {
  const navigate = useNavigate();
  const { addXp, completeLevel, recordDecisions, setStartupHealth } = useGameStore();
  const [showBriefing, setShowBriefing] = useState(true);
  const [step, setStep] = useState<Step>('dbType');
  const [dbTypeAnswer, setDbTypeAnswer] = useState<string | null>(null);
  const [normAnswer, setNormAnswer] = useState<string | null>(null);
  const [indexAnswer, setIndexAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; xp?: number; variant?: 'info' | 'success' | 'warning' | 'error'; rememberTip?: string } | null>(null);
  /** Ref for the feedback + Next button block so we can scroll it into view when feedback appears (keeps button visible). */
  const feedbackBlockRef = useRef<HTMLDivElement>(null);

  const [shuffledDb, setShuffledDb] = useState<typeof LEVEL3_DB_TYPE_OPTIONS[number][]>([]);
  const [shuffledNorm, setShuffledNorm] = useState<typeof LEVEL3_NORMALIZATION_OPTIONS[number][]>([]);
  const [shuffledIndex, setShuffledIndex] = useState<typeof LEVEL3_INDEX_OPTIONS[number][]>([]);
  const [pickedDbIndex] = useState(() => pickRandomIndices(LEVEL3_DB_SCENARIOS.length, 1)[0]);
  const [pickedNormIndex] = useState(() => pickRandomIndices(LEVEL3_NORMALIZATION_QUESTIONS.length, 1)[0]);

  const currentDbScenario = LEVEL3_DB_SCENARIOS[pickedDbIndex];
  const currentNormQuestion = LEVEL3_NORMALIZATION_QUESTIONS[pickedNormIndex];

  useEffect(() => {
    if (step === 'dbType') setShuffledDb(shuffleOptions(LEVEL3_DB_TYPE_OPTIONS));
    if (step === 'normalization') setShuffledNorm(shuffleOptions(LEVEL3_NORMALIZATION_OPTIONS));
    if (step === 'indexing') setShuffledIndex(shuffleOptions(LEVEL3_INDEX_OPTIONS));
  }, [step]);

  /** When feedback is shown, scroll the feedback + Next button into view so the user always sees the action. */
  useEffect(() => {
    if (feedback) {
      feedbackBlockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [feedback]);

  const handleDbType = (optionId: string) => {
    setDbTypeAnswer(optionId);
    const correct = optionId === currentDbScenario.correctId;
    if (correct) {
      addXp(STEP_XP.dbType);
      setFeedback({
        message: 'Correct. Relational databases (PostgreSQL, MySQL) give you tables, ACID transactions, and strong consistency — ideal for complex queries and structured data. NoSQL fits flexible schema and horizontal scaling.',
        xp: STEP_XP.dbType,
        variant: 'success',
        rememberTip: 'Relational = tables, ACID, complex queries, transactions. NoSQL = flexible schema, horizontal scaling, big data, real-time.',
      });
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: 'For complex queries and transactions you want a Relational database (tables, ACID). NoSQL is better for flexible schema, horizontal scaling, and high write throughput.',
        variant: 'warning',
        rememberTip: 'Relational = tables, ACID, complex queries. NoSQL = flexible schema, horizontal scaling.',
      });
    }
  };

  const handleNormalization = (optionId: string) => {
    setNormAnswer(optionId);
    const correct = optionId === currentNormQuestion.correctId;
    if (correct) {
      addXp(STEP_XP.normalization);
      setFeedback({
        message: 'Correct. 3NF = 2NF plus no transitive dependencies. 1NF = atomic values, no repeating groups; 2NF = 1NF + no partial dependencies; BCNF = stricter 3NF.',
        xp: STEP_XP.normalization,
        variant: 'success',
        rememberTip: '1NF: atomic, no repeating groups. 2NF: 1NF + no partial deps. 3NF: 2NF + no transitive deps. BCNF: stricter 3NF.',
      });
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: currentNormQuestion.correctId === '3nf'
          ? 'The form described by "2NF + no transitive dependencies" is 3NF. 1NF = atomic, no repeating groups.'
          : 'The form with atomic values and no repeating groups is 1NF. 2NF adds no partial dependencies.',
        variant: 'warning',
        rememberTip: '1NF: atomic, no repeating groups. 2NF: 1NF + no partial deps. 3NF: 2NF + no transitive deps.',
      });
    }
  };

  const handleIndexing = (optionId: string) => {
    setIndexAnswer(optionId);
    const option = LEVEL3_INDEX_OPTIONS.find((o) => o.id === optionId);
    if (option?.correct) {
      addXp(STEP_XP.indexing);
      setFeedback({
        message: 'Correct. Index often-queried columns (like email for login) to speed up lookups. Consider impact on write performance; monitor and maintain indexes.',
        xp: STEP_XP.indexing,
        variant: 'success',
        rememberTip: 'Do: index often-queried columns; monitor usage. Consider: impact on write performance.',
      });
    } else {
      setStartupHealth(-5);
      setFeedback({
        message: 'You should index the column you filter by (email) so login lookups are fast. Index types include single-column, composite, unique, partial.',
        variant: 'warning',
        rememberTip: 'Index often-queried columns. Avoid full table scans for hot paths like login.',
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (step === 'dbType') {
      setStep('normalization');
    } else if (step === 'normalization') {
      setStep('indexing');
    } else if (step === 'indexing') {
      recordDecisions(3, { dbType: dbTypeAnswer, normalization: normAnswer, indexing: indexAnswer });
      completeLevel(3);
      setStep('done');
      setFeedback({
        message: 'Level 3 complete. You chose the right database type, identified 3NF, and applied indexing — all from the Database Design section of the curriculum.',
        variant: 'success',
        rememberTip: 'Relational vs NoSQL, normal forms (1NF–BCNF), and indexing are core to good database design.',
      });
    }
  };

  const handleNextToLevel4 = () => {
    navigate('/level/4');
  };

  if (showBriefing) {
    return (
      <LevelBriefing
        levelId={3}
        levelTitle="Level 3 – Database Design"
        intro="3 phases. You learn by playing and from feedback."
        slides={LEVEL3_BRIEFING}
        onStart={() => setShowBriefing(false)}
        allowSkip={true}
      />
    );
  }

  return (
    <LevelContainer title="Level 3 – Database Design" levelId={3}>
      <button
        type="button"
        onClick={() => setShowBriefing(true)}
        className="mb-2 text-sm text-[var(--accent-neon)] hover:underline"
      >
        📖 Review briefing
      </button>

      <AnimatePresence mode="wait">
        {step === 'dbType' && (
          <motion.div key="dbType" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <ScenarioCard title={textWithTooltips('Phase 1 of 3: Relational vs NoSQL')}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: Relational vs NoSQL</strong>
                <p><strong>Relational databases</strong> (e.g. PostgreSQL, MySQL): Data is stored in <em>tables</em> with rows and columns; relationships use foreign keys. They give you <em>ACID transactions</em> (Atomicity, Consistency, Isolation, Durability), so multi-step operations either all succeed or all roll back. Best for: complex queries (JOINs, aggregations), reporting, and any data that must stay strictly consistent (e.g. payments, inventory).</p>
                <p><strong>NoSQL databases</strong> (e.g. MongoDB, Cassandra): Data can be <em>document-based</em>, key-value, or wide-column; schema is flexible (you can add fields without migrations). They scale <em>horizontally</em> (add more machines) and suit high write throughput, big data, and real-time feeds. Best for: rapidly changing schema, very large or distributed data, and when you need scale-out more than complex relational queries.</p>
                <p>Choose <strong>Relational</strong> when you need strong consistency, transactions, and complex queries. Choose <strong>NoSQL</strong> when you need flexible schema, horizontal scaling, or very high write volume.</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips(currentDbScenario.question)}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledDb.length > 0 ? shuffledDb : [...LEVEL3_DB_TYPE_OPTIONS]).map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.label)}
                    description={textWithTooltips(o.description)}
                    onClick={() => handleDbType(o.id)}
                    variant={dbTypeAnswer === o.id ? (o.id === currentDbScenario.correctId ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
                <button type="button" onClick={handleNext} className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Next phase</button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'normalization' && (
          <motion.div key="normalization" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <ScenarioCard title={textWithTooltips('Phase 2 of 3: Normalization (normal forms)')}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: Normal forms (what each one means)</strong>
                <p><strong>1NF (First Normal Form):</strong> Every column must hold <em>atomic values</em> (one value per cell — no lists or composite values like "John, Jane" in one cell). There must be <em>no repeating groups</em> (e.g. don’t have Phone1, Phone2, Phone3; use one row per phone or a separate table). So: one value per cell, and each row is uniquely identifiable.</p>
                <p><strong>2NF (Second Normal Form):</strong> The table must already be in 1NF. In addition, there must be <em>no partial dependencies</em>: every non-key attribute must depend on the <em>whole</em> primary key, not just part of it. If the key is composite (e.g. OrderID + ProductID), and "ProductName" depends only on ProductID, that’s partial — move ProductName to a Product table.</p>
                <p><strong>3NF (Third Normal Form):</strong> The table must be in 2NF. There must be <em>no transitive dependencies</em>: no non-key attribute may depend on another non-key attribute. Example: if you have CustomerID → City → Region, then Region depends on City (transitive). Move Region to a table keyed by City, or store only City and derive Region elsewhere.</p>
                <p><strong>BCNF (Boyce–Codd Normal Form):</strong> Stricter than 3NF. Every <em>determinant</em> (any attribute that uniquely determines another) must be a candidate key. BCNF removes the remaining anomalies that 3NF can still allow when a non-key attribute determines another attribute.</p>
                <p>Summary: <strong>1NF</strong> = atomic values, no repeating groups. <strong>2NF</strong> = 1NF + no partial dependencies. <strong>3NF</strong> = 2NF + no transitive dependencies. <strong>BCNF</strong> = stricter 3NF (every determinant is a candidate key).</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips(currentNormQuestion.question)}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledNorm.length > 0 ? shuffledNorm : [...LEVEL3_NORMALIZATION_OPTIONS]).map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.label)}
                    description={textWithTooltips(o.description)}
                    onClick={() => handleNormalization(o.id)}
                    variant={normAnswer === o.id ? (o.id === currentNormQuestion.correctId ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
                <button type="button" onClick={handleNext} className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Next phase</button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'indexing' && (
          <motion.div key="indexing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <ScenarioCard title={textWithTooltips('Phase 3 of 3: Indexing and optimization')}>
              <div className="mb-4 rounded-lg border border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/5 p-4 text-sm text-[var(--text-primary)] space-y-3">
                <strong className="text-[var(--accent-neon)]">Learn first: When and how to use indexes</strong>
                <p>An <strong>index</strong> is a structure the database uses to find rows quickly (like a book index). You should <strong>index columns that appear in WHERE, JOIN, and ORDER BY</strong> — for example <code className="rounded bg-[var(--bg-secondary)] px-1">WHERE email = ?</code> or <code className="rounded bg-[var(--bg-secondary)] px-1">WHERE user_id = ?</code>. That speeds up lookups (e.g. login by email, orders by user).</p>
                <p><strong>Don’t index everything.</strong> Each index costs space and slows down <em>writes</em> (INSERT/UPDATE/DELETE), because the database must update the index too. Index only columns that are actually used in queries. Avoid indexing very low-cardinality columns (e.g. a "status" with only 2–3 values) unless you filter on them often.</p>
                <p>Good practice: index columns you filter or join on frequently; monitor which indexes are used (and which are unused); consider composite indexes for multi-column conditions. Wrong: indexing every column "just in case" — that hurts write performance and wastes space.</p>
              </div>
              <p className="mb-4 text-[var(--text-muted)]">
                {textWithTooltips(LEVEL3_INDEX_QUESTION.question)}
              </p>
              <div className="flex flex-col gap-3">
                {(shuffledIndex.length > 0 ? shuffledIndex : [...LEVEL3_INDEX_OPTIONS]).map((o) => (
                  <DecisionButton
                    key={o.id}
                    label={textWithTooltips(o.label)}
                    description={textWithTooltips(o.description)}
                    onClick={() => handleIndexing(o.id)}
                    variant={indexAnswer === o.id ? (o.correct ? 'correct' : 'incorrect') : 'default'}
                  />
                ))}
              </div>
            </ScenarioCard>
            {feedback && (
              <div ref={feedbackBlockRef} className="scroll-mt-4">
                <ResultPanel message={feedback.message} xpGained={feedback.xp} variant={feedback.variant} rememberTip={feedback.rememberTip} />
                <button type="button" onClick={handleNext} className="mt-3 rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">
                  {step === 'indexing' ? 'Complete level' : 'Next'}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 'done' && feedback && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <ResultPanel message={feedback.message} variant={feedback.variant} rememberTip={feedback.rememberTip} />
            <button type="button" onClick={handleNextToLevel4} className="rounded-lg bg-[var(--accent-neon)] px-4 py-2 font-medium text-[var(--bg-primary)] hover:opacity-90">Next level</button>
          </motion.div>
        )}
      </AnimatePresence>
    </LevelContainer>
  );
}
