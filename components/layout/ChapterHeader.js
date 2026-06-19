import { CompassRose } from './Brand.js';

export default function ChapterHeader({
  eyebrow,
  title,
  subtitle,
  heroMode = false,
}) {
  const shellClass = heroMode
    ? 'pb-16 pt-28 sm:pb-20 sm:pt-36'
    : 'pb-10 pt-14 sm:pt-20';
  const compassClass = heroMode
    ? 'pointer-events-none absolute -bottom-24 -right-24 hidden size-[22rem] text-primary/[0.08] dark:text-primary-soft/10 lg:block'
    : 'pointer-events-none absolute -right-28 -top-24 hidden size-[22rem] text-primary/[0.08] dark:text-primary-soft/10 lg:block';

  return (
    <section className="relative overflow-hidden bg-bg">
      <div aria-hidden="true" className="texture-doodle" />
      <CompassRose className={compassClass} />

      <div className={`wrap relative ${shellClass}`}>
        <p className="eyebrow animate-rise" style={{ animationDelay: '60ms' }}>
          {eyebrow}
        </p>
        <h1
          className="animate-rise mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl"
          style={{ animationDelay: '160ms' }}
        >
          {title}
        </h1>
        <p
          className="animate-rise mt-5 max-w-xl text-pretty leading-relaxed text-text-muted sm:text-lg"
          style={{ animationDelay: '280ms' }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
