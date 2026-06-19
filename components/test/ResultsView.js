'use client';

import { useEffect, useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import { CompassRose } from '../layout/Brand.js';
import {
  DIMENSIONS,
  DIMENSION_KEYS,
  EXPLORE_DOMAINS,
  MAX_PER_DIMENSION,
} from './test-data.js';

/* The fresh compass reading: night-map celebration of the dominant profile,
   then all six dimensions drawn as ranked bars — the same idiom as the
   "Busola interioară" card in the travel journal. */
export default function ResultsView({ scores }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const ranked = DIMENSION_KEYS.map((key, order) => ({
    key,
    order,
    ...DIMENSIONS[key],
    score: Number(scores?.[key]) || 0,
  })).sort((a, b) => b.score - a.score || a.order - b.order);
  const dominant = ranked[0];

  const exploreSlugs = EXPLORE_DOMAINS[dominant.key] || [];
  const exploreHref =
    exploreSlugs.length > 0
      ? `/facultati?${exploreSlugs.map((slug) => `domain=${slug}`).join('&')}`
      : '/facultati';

  return (
    <section className="animate-pop overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-lift">
      {/* Night-map header: the moment the needle settles. */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-strong via-night-mid to-night-deep p-7 sm:p-10">
        <div aria-hidden="true" className="texture-doodle-night" />
        <CompassRose className="animate-spin-slow pointer-events-none absolute -right-20 -top-24 size-80 text-mint/10" />

        <div className="relative max-w-lg">
          <p className="eyebrow !text-mint">Busola s-a aliniat</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-mint/70">
            Profilul tău dominant
          </p>
          <p className="wonky mt-2 font-display text-5xl font-semibold italic text-highlight sm:text-6xl">
            {dominant.label}
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-mint/80">
            {dominant.blurb}
          </p>
        </div>
      </header>

      <div className="p-6 sm:p-8">
        {/* All six directions, ranked. */}
        <h3 className="font-display text-lg font-semibold">
          Toate direcțiile tale
        </h3>
        <ul className="mt-5 space-y-4">
          {ranked.map(({ key, label, score }, index) => {
            const percent = Math.max(
              0,
              Math.min(100, Math.round((score / MAX_PER_DIMENSION) * 100)),
            );
            const isDominant = index === 0;
            return (
              <li key={key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      isDominant ? 'text-text' : 'text-text-muted'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-xs font-medium tabular-nums text-text-muted">
                    {score} / {MAX_PER_DIMENSION}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-border/60">
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

        {/* Trades that sit in the dominant direction. */}
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Meserii în direcția ta
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dominant.jobs.map((job) => (
            <Badge key={job} tone="primary">
              {job}
            </Badge>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-dashed border-border pt-6">
          <Button href={exploreHref} variant="accent" size="lg">
            Explorează domeniile potrivite
          </Button>
          <Button href="/account" variant="ghost" size="lg">
            Vezi jurnalul tău
          </Button>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          Rezultatul e salvat în jurnalul tău de călătorie — îl găsești oricând
          în cont.
        </p>
      </div>
    </section>
  );
}
