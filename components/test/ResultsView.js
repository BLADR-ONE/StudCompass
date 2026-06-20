'use client';

import { useEffect, useState } from 'react';
import Badge from '../ui/Badge.js';
import Button from '../ui/Button.js';
import { Constellation, TrailWeave } from '../layout/Brand.js';
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

  const dominantPercent = Math.max(
    0,
    Math.min(100, Math.round((dominant.score / MAX_PER_DIMENSION) * 100)),
  );

  const exploreSlugs = EXPLORE_DOMAINS[dominant.key] || [];
  const exploreHref =
    exploreSlugs.length > 0
      ? `/facultati?${exploreSlugs.map((slug) => `domain=${slug}`).join('&')}`
      : '/facultati';

  return (
    /* animate-lift = deeper hero entrance; shadow-glow = focal elevation beacon */
    <section className="animate-lift overflow-hidden rounded-3xl border border-border/50 bg-surface-raised shadow-glow">
      {/* Night-map header: the moment the needle settles. */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-strong via-night-mid to-night-deep px-7 pb-10 pt-12 sm:px-12 sm:pb-14 sm:pt-16">
        <div aria-hidden="true" className="texture-doodle-night" />

        {/* Section-scale Constellation anchors the entire header as a discovery motif */}
        <Constellation className="animate-twinkle pointer-events-none absolute -right-16 -top-16 size-[28rem] text-mint/10 sm:size-[34rem]" />

        {/* Accent beacon glow behind the constellation — one focal pulse */}
        <span
          aria-hidden="true"
          className="beacon-glow animate-beacon pointer-events-none absolute right-8 top-8 size-80 opacity-30"
        />

        {/* TrailWeave as a subtle secondary motif in the lower-left corner */}
        <TrailWeave className="animate-trail-draw pointer-events-none absolute -bottom-10 -left-10 size-56 text-mint/[0.07]" />

        <div className="relative max-w-xl">
          <p className="eyebrow !text-mint">Busola s-a aliniat</p>

          {/* Dominant score as a large confident number — the compass reading */}
          <div className="mt-6 flex items-end gap-4">
            <p
              className="wonky font-display font-semibold italic leading-none text-highlight"
              style={{ fontSize: 'clamp(3.2rem, 6vw, 4.8rem)' }}
            >
              {dominant.label}
            </p>
            <span
              className="mb-1 font-display text-[2.4rem] font-semibold tabular-nums leading-none text-mint/60"
              aria-label={`${dominantPercent} la sută`}
            >
              {dominantPercent}
              <span className="ml-0.5 text-[1.3rem] font-medium opacity-70">%</span>
            </span>
          </div>

          <p className="mt-5 text-pretty text-base leading-relaxed text-mint/85">
            {dominant.blurb}
          </p>
        </div>
      </header>

      <div className="p-6 sm:p-8">
        {/* All six directions, ranked — staggered entrance so the list fans in. */}
        <h3 className="font-display text-xl font-semibold">
          Toate direcțiile tale
        </h3>
        <ul className="mt-5 space-y-5">
          {ranked.map(({ key, label, score }, index) => {
            const percent = Math.max(
              0,
              Math.min(100, Math.round((score / MAX_PER_DIMENSION) * 100)),
            );
            const isDominant = index === 0;
            return (
              <li
                key={key}
                className="reveal-stagger"
                style={{ '--i': index }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={`font-semibold ${
                      isDominant
                        ? 'text-base text-text'
                        : 'text-sm text-text-muted'
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`tabular-nums ${
                      isDominant
                        ? 'text-sm font-bold text-text'
                        : 'text-xs font-medium text-text-muted'
                    }`}
                  >
                    {score}
                    <span className="font-normal opacity-50"> / {MAX_PER_DIMENSION}</span>
                  </span>
                </div>
                <div
                  className={`mt-1.5 overflow-hidden rounded-full bg-border/60 ${
                    isDominant ? 'h-3' : 'h-2'
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-[width] ease-out ${
                      isDominant
                        ? 'bg-gradient-to-r from-accent to-highlight duration-1000'
                        : 'bg-gradient-to-r from-primary to-primary-soft duration-700'
                    }`}
                    style={{
                      width: drawn ? `${percent}%` : '0%',
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {/* Trades that sit in the dominant direction. */}
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          Meserii în direcția ta
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {dominant.jobs.map((job, i) => (
            <span key={job} className="reveal-stagger" style={{ '--i': i }}>
              <Badge tone="primary">{job}</Badge>
            </span>
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
