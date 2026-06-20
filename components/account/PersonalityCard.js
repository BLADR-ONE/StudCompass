'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import Spinner from '../ui/Spinner.js';
import { Horizon, Switchback } from '../layout/Brand.js';

/* RIASEC profiles, ported from the legacy account page (modern diacritics). */
const DIMENSIONS = {
  realist: {
    label: 'Realist',
    blurb:
      'Spirit practic și ingeniozitate tehnică: îți place să construiești, să repari și să lucrezi cu unelte, mașini sau în aer liber.',
    jobs: [
      'Inginer mecanic',
      'Constructor',
      'Electrician',
      'Polițist',
      'Tehnician dentar',
      'Arheolog',
    ],
  },
  investigativ: {
    label: 'Investigativ',
    blurb:
      'Analitic și curios: rezolvi sarcini abstracte și vrei să înțelegi lumea. Te atrag cercetarea, științele și problemele grele.',
    jobs: [
      'Informatician',
      'Economist',
      'Chimist',
      'Fizician',
      'Farmacist',
      'Psiholog',
    ],
  },
  artistic: {
    label: 'Artistic',
    blurb:
      'Imaginație și sensibilitate: preferi activitățile libere, nestructurate, în care te poți exprima — adesea prin artă.',
    jobs: ['Arhitect', 'Fotograf', 'Designer', 'Actor', 'Editor', 'Jurnalist'],
  },
  social: {
    label: 'Social',
    blurb:
      'Cooperant și generos, cu abilități verbale: te atrag activitățile care presupun relaționare, informare și sprijinirea celorlalți.',
    jobs: [
      'Profesor',
      'Medic',
      'Psiholog',
      'Asistent social',
      'Logoped',
      'Mass-media',
    ],
  },
  intreprinzator: {
    label: 'Întreprinzător',
    blurb:
      'Entuziast și încrezător: îți place să conduci, să convingi și să-ți asumi inițiativa. Cauți statut și impact.',
    jobs: [
      'Manager',
      'Procuror',
      'Relații cu publicul',
      'Agent de turism',
      'Jurnalist',
    ],
  },
  conventional: {
    label: 'Convențional',
    blurb:
      'Stabil, ordonat și atent la detalii: preferi activitățile clare, cu reguli, în care datele și informațiile stau la locul lor.',
    jobs: [
      'Contabil',
      'Analist financiar',
      'Bibliotecar',
      'Asistent administrativ',
      'Casier',
    ],
  },
};

const ORDER = [
  'realist',
  'investigativ',
  'artistic',
  'social',
  'intreprinzator',
  'conventional',
];

/* 120 answers ÷ 6 dimensions = 20 questions, each scored 0–2. */
const MAX_PER_DIMENSION = 40;

const dateFormatter = new Intl.DateTimeFormat('ro-RO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-strong via-night-mid to-night-deep p-8 text-center shadow-card sm:p-10">
      <div aria-hidden="true" className="texture-doodle-night" />
      <Horizon className="animate-sway pointer-events-none absolute -right-16 -top-20 size-72 text-mint/15" />

      <div className="relative mx-auto max-w-sm">
        <p className="eyebrow justify-center !text-mint">Testul de carieră</p>
        <h2 className="mt-4 text-balance font-display text-2xl font-semibold text-white">
          Busola ta interioară e încă{' '}
          <em className="wonky italic text-highlight">nealiniată</em>.
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-mint/80">
          120 de întrebări, vreo 15 minute — și jurnalul tău primește o hartă a
          domeniilor în care te-ai simți ca acasă.
        </p>
        <Button
          href="/account/personalityTest"
          variant="accent"
          size="lg"
          className="mt-6"
        >
          Începe testul de carieră
        </Button>
      </div>
    </div>
  );
}

function UnavailableState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border px-6 py-12 text-center">
      <h2 className="font-display text-xl font-semibold">Busola interioară</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
        Rezultatul testului nu poate fi citit momentan. Mai încearcă puțin mai
        târziu.
      </p>
      <Button
        href="/account/personalityTest"
        variant="ghost"
        className="mt-5"
      >
        Mergi la testul de carieră
      </Button>
    </div>
  );
}

/* The compass reading: latest result from GET /api/personality, drawn as
   ranked dimension bars — the dominant one gets the highlight gradient. */
export default function PersonalityCard() {
  const [state, setState] = useState({ status: 'loading', result: null });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/personality');
        if (cancelled) {
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setState({ status: 'ready', result: data.result });
          }
        } else if (res.status === 404) {
          setState({ status: 'empty', result: null });
        } else {
          setState({ status: 'unavailable', result: null });
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'unavailable', result: null });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Let the bars sweep in once the reading lands. */
  useEffect(() => {
    if (state.status !== 'ready') {
      return undefined;
    }
    const raf = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, [state.status]);

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-border bg-surface-raised p-16 text-text-muted shadow-card">
        <Spinner />
      </div>
    );
  }

  if (state.status === 'empty') {
    return <EmptyState />;
  }

  if (state.status === 'unavailable') {
    return <UnavailableState />;
  }

  const scores = state.result?.scores || {};
  const ranked = ORDER.map((key) => ({
    key,
    ...DIMENSIONS[key],
    score: Number(scores[key]) || 0,
  })).sort((a, b) => b.score - a.score);
  const dominant = ranked[0];
  const measuredOn = formatDate(state.result?.createdAt);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-card">
      <div className="relative overflow-hidden border-b border-dashed border-border p-6 sm:p-7">
        <Switchback className="animate-drift-slow pointer-events-none absolute -right-16 -top-20 size-64 text-primary/[0.11] dark:text-primary-soft/[0.12]" />

        <div className="relative">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-2xl font-semibold">
              Busola interioară
            </h2>
            {measuredOn && (
              <span className="text-xs text-text-muted">
                citită pe {measuredOn}
              </span>
            )}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Profil dominant
          </p>
          <p className="wonky mt-1.5 font-display text-5xl font-semibold italic text-primary-strong dark:text-primary-soft">
            {dominant.label}
          </p>
          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-text-muted">
            {dominant.blurb}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {dominant.jobs.map((job) => (
              <Badge key={job} tone="primary">
                {job}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <ul className="space-y-4">
          {ranked.map(({ key, label, score }, index) => {
            const percent = Math.max(
              0,
              Math.min(100, Math.round((score / MAX_PER_DIMENSION) * 100)),
            );
            const isDominant = index === 0;
            return (
              <li
                key={key}
                style={{ '--i': index }}
                className="reveal-stagger"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      isDominant ? 'text-text' : 'text-text-muted'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      isDominant
                        ? 'text-accent dark:text-highlight'
                        : 'text-text-muted'
                    }`}
                  >
                    {score} / {MAX_PER_DIMENSION}
                  </span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-border/50">
                  <div
                    className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                      isDominant
                        ? 'bg-gradient-to-r from-accent to-highlight'
                        : 'bg-gradient-to-r from-primary to-primary-soft'
                    }`}
                    style={{
                      width: drawn ? `${percent}%` : '0%',
                      transitionDelay: `${index * 90}ms`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href="/account/personalityTest"
          className="mt-7 inline-block text-sm font-semibold text-primary-strong underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:underline dark:text-primary-soft"
        >
          Refă testul de carieră →
        </Link>
      </div>
    </div>
  );
}
