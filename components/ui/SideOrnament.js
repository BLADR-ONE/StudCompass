'use client';

import { PlumbLine, BeadCord, SoundingLine } from '../layout/Brand.js';
import { useScrollProgress } from '../../lib/useScrollProgress.js';

/*
 * SideOrnament — a vertical, scroll-reactive survey cord hung in a section's
 * side gutter. A thin plumb / sounding line whose cord DRAWS DOWN and whose
 * weighted bob/beads DROP and settle as the section scrolls through the
 * viewport, with a gentle pendulum sway that never rests fully still. It leans
 * the cartographer identity (surveyor's plumb-bob, beaded measuring chain,
 * leadsman's sounding line) rather than literal "balls on a string".
 *
 * Pure presentational glue, exactly like MotifScroll: it wraps one of the
 * hand-drawn plumb SVGs (safe-anywhere presentational components) and ties it to
 * scroll position. It NEVER imports server data, so a Server-Component section
 * can drop `<SideOrnament .../>` straight in without becoming a client page —
 * only this island is `'use client'`.
 *
 * SSR / reduced-motion / no-JS safe: useScrollProgress no-ops under
 * prefers-reduced-motion or without rAF/IntersectionObserver and leaves
 * --motif-progress unset; the CSS contract then pins the resting pose (cord
 * drawn, bob settled, no swing). The ornament is visible by default and scroll
 * only ENHANCES it — visibility is never gated on scroll.
 *
 * Horizontal-overflow safety is the caller's job too, but this component is
 * defensive: it ships `hidden lg:block` (wide-screen flourish only) and
 * pointer-events-none, and it MUST be placed inside a `relative` +
 * overflow-clipped section so its `absolute` position can never add page scroll.
 *
 * Props:
 *   variant  'plumb' | 'bead' | 'sounding'  (which cord; default 'plumb')
 *   side     'left' | 'right'               (which gutter; default 'left')
 *   tone     extra color/opacity classes for the cord (currentColor based)
 *   className extra positioning classes (top offset, height) — merged last
 */
const ORNAMENTS = {
  plumb: PlumbLine,
  bead: BeadCord,
  sounding: SoundingLine,
};

export default function SideOrnament({
  variant = 'plumb',
  side = 'left',
  tone = 'text-primary/[0.16] dark:text-primary-soft/[0.18]',
  className = '',
}) {
  const Ornament = ORNAMENTS[variant] || PlumbLine;
  const { ref } = useScrollProgress();

  /* Sit in the page gutter, hung from near the section top. The cord is only
     ~36px wide and just its centre line is inked, so it reads as a thin thread
     tucked beside the content column, never over it. Shown only from `xl`
     (1280px): below that the centred .wrap (max-w-74rem ≈ 1184px) leaves too
     little gutter, so the flourish stays a wide-screen-only accent and can never
     crowd the text column. The offsets grow with width to hug the true gutter. */
  const sideClass =
    side === 'right'
      ? 'right-3 2xl:right-8'
      : 'left-3 2xl:left-8';

  return (
    <span
      ref={ref}
      data-ornament={variant}
      aria-hidden="true"
      className={`pointer-events-none absolute top-0 hidden w-9 select-none xl:block ${sideClass} ${tone} ${className}`}
    >
      {/* Fixed cord size (w/h match the 40×320 viewBox ratio), pinned to the
          section top by the span's `top-0`. The SVG never stretches to the full
          section height — it hangs a fixed ~18rem down the gutter. */}
      <Ornament className="block h-72 w-9" />
    </span>
  );
}
