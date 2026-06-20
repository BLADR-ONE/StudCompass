import { ScaleBar } from './Brand.js';

export default function ChapterHeader({
  eyebrow,
  title,
  subtitle,
  heroMode = false,
}) {
  const shellClass = heroMode
    ? 'pb-16 pt-28 sm:pb-20 sm:pt-36'
    : 'pb-10 pt-14 sm:pt-20';
  const motifClass = heroMode
    ? 'animate-drift-slow pointer-events-none absolute -bottom-16 -right-24 hidden size-[24rem] text-primary/[0.09] dark:text-primary-soft/10 lg:block'
    : 'animate-drift-slow pointer-events-none absolute -right-28 -top-20 hidden size-[24rem] text-primary/[0.09] dark:text-primary-soft/10 lg:block';

  return (
    <section className="relative overflow-hidden bg-bg">
      <div aria-hidden="true" className="texture-doodle" />
      <ScaleBar className={motifClass} />
      {heroMode && (
        <span
          aria-hidden="true"
          className="beacon-glow-primary absolute -left-24 top-0 size-[26rem]"
        />
      )}
      {/* Bottom-blend so the header melts into the page background below
          instead of cutting a hard seam (both themes via --sc-bg token). */}
      <div aria-hidden="true" className="header-blend" />

      <div className={`wrap relative ${shellClass}`}>
        <p className="eyebrow animate-lift" style={{ animationDelay: '60ms' }}>
          {eyebrow}
        </p>
        <h1
          className="animate-lift mt-5 max-w-2xl text-balance font-display text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.028em]"
          style={{ animationDelay: '160ms' }}
        >
          {title}
        </h1>
        <p
          className="animate-lift mt-6 max-w-xl text-pretty leading-relaxed text-text-muted sm:text-lg"
          style={{ animationDelay: '280ms' }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
