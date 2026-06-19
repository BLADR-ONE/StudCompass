'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Spinner from '../ui/Spinner.js';
import { CompassRose } from '../layout/Brand.js';
import { trackAnalyticsEvent } from '../../lib/analytics.js';
import QuestionCard, { ANSWER_SELECTED } from './QuestionCard.js';
import ResultsView from './ResultsView.js';
import RouteProgress from './RouteProgress.js';
import {
  ANSWER_OPTIONS,
  QUESTIONS,
  STEP_COUNT,
  STEP_SIZE,
  TOTAL_QUESTIONS,
} from './test-data.js';

const DRAFT_KEY = 'sc_test_draft';

/* Review-screen ink legend: same three tones as the answer marks. */
const REVIEW_DOTS = {
  2: 'bg-primary',
  1: 'border-2 border-primary/50 bg-primary/15',
  0: 'bg-text/80',
};

function emptyAnswers() {
  return Array(TOTAL_QUESTIONS).fill(null);
}

function readDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (
      !Array.isArray(parsed?.answers) ||
      parsed.answers.length !== TOTAL_QUESTIONS
    ) {
      return null;
    }
    const answers = parsed.answers.map((value) =>
      value === 0 || value === 1 || value === 2 ? value : null,
    );
    return answers.some((value) => value !== null) ? { answers } : null;
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* Private mode etc. — the draft simply isn't kept. */
  }
}

/* The whole expedition: intro → 12 stages of 10 questions → review →
   compass reading. The draft autosaves to localStorage on every mark. */
export default function TestJourney() {
  const [phase, setPhase] = useState('boot'); // boot|intro|quiz|review|done|offline
  const [answers, setAnswers] = useState(emptyAnswers);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [missing, setMissing] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [scores, setScores] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const topRef = useRef(null);

  /* Restore the saved trail, if any. */
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setAnswers(draft.answers);
      setHasDraft(true);
    }
    setPhase('intro');
  }, []);

  /* Autosave while walking. */
  useEffect(() => {
    if (phase !== 'quiz' && phase !== 'review') {
      return;
    }
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          v: 1,
          answers,
          step,
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* Storage unavailable — keep going without the draft. */
    }
  }, [answers, step, phase]);

  /* Each stage starts at the top of the journey. */
  useEffect(() => {
    if (
      phase === 'quiz' ||
      phase === 'review' ||
      phase === 'done' ||
      phase === 'offline'
    ) {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step, phase]);

  const answeredCount = useMemo(
    () => answers.filter((value) => value !== null).length,
    [answers],
  );

  const stageComplete = useMemo(
    () =>
      Array.from({ length: STEP_COUNT }, (_, stage) =>
        answers
          .slice(stage * STEP_SIZE, (stage + 1) * STEP_SIZE)
          .every((value) => value !== null),
      ),
    [answers],
  );

  const startFresh = () => {
    clearDraft();
    setAnswers(emptyAnswers());
    setStep(0);
    setFurthest(0);
    setMissing([]);
    setSubmitError('');
    setPhase('quiz');
  };

  const resumeJourney = () => {
    const firstIncomplete = stageComplete.findIndex((complete) => !complete);
    setMissing([]);
    setSubmitError('');
    if (firstIncomplete === -1) {
      setFurthest(STEP_COUNT - 1);
      setStep(STEP_COUNT - 1);
      setPhase('review');
    } else {
      setFurthest(firstIncomplete);
      setStep(firstIncomplete);
      setPhase('quiz');
    }
  };

  const setAnswer = (index, value) => {
    setAnswers((prev) => {
      const next = prev.slice();
      next[index] = value;
      return next;
    });
    setMissing((prev) => prev.filter((item) => item !== index));
  };

  const jumpTo = (stage) => {
    setMissing([]);
    setStep(stage);
    setPhase('quiz');
  };

  const goBack = () => {
    setMissing([]);
    if (step === 0) {
      setPhase('intro');
      setHasDraft(answers.some((value) => value !== null));
    } else {
      setStep(step - 1);
    }
  };

  const goNext = () => {
    const start = step * STEP_SIZE;
    const gaps = [];
    for (let i = start; i < start + STEP_SIZE; i += 1) {
      if (answers[i] === null) {
        gaps.push(i);
      }
    }
    if (gaps.length > 0) {
      setMissing(gaps);
      document
        .getElementById(`question-${gaps[0]}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setMissing([]);
    if (step === STEP_COUNT - 1) {
      setFurthest(STEP_COUNT - 1);
      setPhase('review');
    } else {
      const next = step + 1;
      setStep(next);
      setFurthest((value) => Math.max(value, next));
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (res.status === 503) {
        setPhase('offline');
        return;
      }
      if (!res.ok) {
        setSubmitError(
          'Răspunsurile nu au ajuns la arhivă. Mai încearcă o dată — traseul tău rămâne salvat în acest browser.',
        );
        return;
      }
      const data = await res.json();
      clearDraft();
      trackAnalyticsEvent('test_completed');
      setScores(data.scores || null);
      setPhase('done');
    } catch {
      setSubmitError(
        'Nu am putut contacta arhiva. Verifică-ți conexiunea și mai încearcă o dată — răspunsurile tale sunt în siguranță.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------ */

  if (phase === 'boot') {
    return (
      <div className="flex min-h-64 items-center justify-center text-text-muted">
        <Spinner />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      {phase === 'intro' && (
        <section className="animate-pop relative overflow-hidden rounded-3xl border border-border bg-surface-raised p-6 shadow-card sm:p-10">
          <CompassRose className="pointer-events-none absolute -right-24 -top-28 size-80 text-primary/[0.06] dark:text-primary-soft/[0.07]" />

          <div className="relative max-w-xl">
            <p className="eyebrow">
              {hasDraft ? 'Expediție în desfășurare' : 'Înainte de plecare'}
            </p>
            <h2 className="mt-4 text-balance font-display text-2xl font-semibold sm:text-3xl">
              {hasDraft ? (
                <>
                  Ai notat deja{' '}
                  <em className="wonky italic text-primary-strong dark:text-primary-soft">
                    {answeredCount} din {TOTAL_QUESTIONS}
                  </em>{' '}
                  răspunsuri.
                </>
              ) : (
                <>
                  Busola așteaptă{' '}
                  <em className="wonky italic text-primary-strong dark:text-primary-soft">
                    primele repere
                  </em>
                  .
                </>
              )}
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-text-muted">
              Tot ce trebuie să faci este să răspunzi la 120 de întrebări care
              încep cu «Ți-ar plăcea să…?». Nu există răspunsuri corecte sau
              greșite — doar direcții.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="primary">120 de întrebări</Badge>
              <Badge tone="primary">12 etape</Badge>
              <Badge tone="primary">~15 minute</Badge>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-border p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Cum notezi răspunsurile
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ANSWER_OPTIONS.map((option) => (
                  <span
                    key={option.value}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${ANSWER_SELECTED[option.value]}`}
                  >
                    {option.label}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-text-muted">
                Răspunsurile se salvează automat în acest browser — poți pleca
                oricând și continua mai târziu.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {hasDraft ? (
                <>
                  <Button variant="accent" size="lg" onClick={resumeJourney}>
                    Continuă de unde ai rămas
                  </Button>
                  <Button variant="ghost" size="lg" onClick={startFresh}>
                    Ia-o de la capăt
                  </Button>
                </>
              ) : (
                <Button variant="accent" size="lg" onClick={startFresh}>
                  Pornește expediția
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {phase === 'quiz' && (
        <section>
          <header>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="eyebrow">
                Etapa {step + 1} din {STEP_COUNT}
              </p>
              <span className="text-xs font-medium tabular-nums text-text-muted">
                {answeredCount} / {TOTAL_QUESTIONS} răspunsuri notate
              </span>
            </div>
            <RouteProgress
              className="mt-5"
              stages={stageComplete}
              current={step}
              furthest={furthest}
              onJump={jumpTo}
            />
            <h2 className="mt-8 font-display text-2xl font-semibold sm:text-3xl">
              Ți-ar plăcea{' '}
              <em className="wonky italic text-primary-strong dark:text-primary-soft">
                să…
              </em>
            </h2>
          </header>

          <div key={step} className="animate-pop mt-6 space-y-4">
            {QUESTIONS.slice(step * STEP_SIZE, (step + 1) * STEP_SIZE).map(
              (question, offset) => {
                const index = step * STEP_SIZE + offset;
                return (
                  <QuestionCard
                    key={index}
                    index={index}
                    question={question}
                    value={answers[index]}
                    missing={missing.includes(index)}
                    onChange={(value) => setAnswer(index, value)}
                  />
                );
              },
            )}
          </div>

          <div aria-live="polite" className="mt-6 empty:hidden">
            {missing.length > 0 && (
              <p className="rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-medium text-accent-strong dark:text-[#f8a060]">
                {missing.length === 1
                  ? 'Mai e un răspuns de notat în această etapă'
                  : `Mai sunt ${missing.length} răspunsuri de notat în această etapă`}{' '}
                — busola are nevoie de toate reperele.
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" onClick={goBack}>
              Înapoi
            </Button>
            <Button variant="primary" onClick={goNext}>
              {step === STEP_COUNT - 1 ? 'Verifică traseul' : 'Etapa următoare'}
            </Button>
          </div>
        </section>
      )}

      {phase === 'review' && (
        <section className="animate-pop">
          <p className="eyebrow">Ultima verificare</p>
          <h2 className="mt-4 text-balance font-display text-2xl font-semibold sm:text-3xl">
            Traseu complet — mai arunci{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              o privire
            </em>
            ?
          </h2>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-text-muted">
            Poți ajusta orice etapă înainte de a trimite. Când ești gata,
            aliniem busola.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-muted">
            {ANSWER_OPTIONS.map((option) => (
              <span key={option.value} className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`inline-flex size-2.5 rounded-full ${REVIEW_DOTS[option.value]}`}
                />
                {option.label}
              </span>
            ))}
          </div>

          <ol className="mt-4 space-y-2.5">
            {stageComplete.map((_, stage) => (
              <li
                key={stage}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-border bg-surface-raised px-4 py-3 shadow-card sm:px-5"
              >
                <span className="font-display text-sm font-semibold">
                  Etapa {stage + 1}
                </span>
                <span className="text-xs tabular-nums text-text-muted">
                  întrebările {stage * STEP_SIZE + 1}–
                  {(stage + 1) * STEP_SIZE}
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  {answers
                    .slice(stage * STEP_SIZE, (stage + 1) * STEP_SIZE)
                    .map((value, offset) => (
                      <span
                        key={offset}
                        aria-hidden="true"
                        className={`inline-flex size-2.5 rounded-full ${
                          REVIEW_DOTS[value] || 'border border-border'
                        }`}
                      />
                    ))}
                </span>
                <button
                  type="button"
                  onClick={() => jumpTo(stage)}
                  className="text-sm font-semibold text-primary-strong underline-offset-4 transition-colors hover:underline dark:text-primary-soft"
                >
                  Modifică
                </button>
              </li>
            ))}
          </ol>

          {submitError && (
            <p
              role="alert"
              className="mt-6 rounded-2xl border border-rust/40 bg-rust/10 px-4 py-3 text-sm font-medium text-rust dark:text-rust-soft"
            >
              {submitError}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              variant="accent"
              size="lg"
              loading={submitting}
              onClick={submit}
            >
              Aliniază busola
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => jumpTo(STEP_COUNT - 1)}
            >
              Înapoi la întrebări
            </Button>
          </div>
        </section>
      )}

      {phase === 'offline' && (
        <section className="animate-pop relative overflow-hidden rounded-3xl border-2 border-dashed border-border px-6 py-14 text-center">
          <CompassRose className="pointer-events-none absolute -bottom-24 -left-20 size-64 text-primary/[0.06] dark:text-primary-soft/[0.07]" />

          <div className="relative mx-auto max-w-md">
            <p className="eyebrow justify-center">Pauză de semnal</p>
            <h2 className="mt-4 font-display text-2xl font-semibold">
              Arhiva e momentan închisă.
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
              Răspunsurile tale nu s-au pierdut — traseul complet rămâne salvat
              în acest browser. Mai încearcă în câteva minute.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="primary" loading={submitting} onClick={submit}>
                Încearcă din nou
              </Button>
              <Button variant="ghost" href="/account">
                Înapoi la jurnal
              </Button>
            </div>
          </div>
        </section>
      )}

      {phase === 'done' && <ResultsView scores={scores} />}
    </div>
  );
}
