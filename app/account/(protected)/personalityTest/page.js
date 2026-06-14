import { CompassRose } from '../../../../components/layout/Brand.js';
import TestJourney from '../../../../components/test/TestJourney.js';

export const metadata = {
  title: 'Testul de carieră',
  description:
    'Răspunde la cele 120 de întrebări «Ți-ar plăcea să…?» și află spre ce domenii de studiu arată busola ta interioară.',
};

/* The career-test expedition: 120 questions in 12 stages on the map. */
export default function PersonalityTestPage() {
  return (
    <>
      {/* Chapter header */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="texture-doodle" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
        />
        <CompassRose className="pointer-events-none absolute -right-28 -top-24 hidden size-[22rem] text-primary/[0.08] lg:block dark:text-primary-soft/10" />

        <div className="wrap relative pb-10 pt-14 sm:pt-20">
          <p className="eyebrow animate-rise" style={{ animationDelay: '60ms' }}>
            Expediția interioară
          </p>
          <h1
            className="animate-rise mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl"
            style={{ animationDelay: '160ms' }}
          >
            120 de întrebări, o singură{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              direcție
            </em>
            .
          </h1>
          <p
            className="animate-rise mt-5 max-w-xl text-pretty leading-relaxed text-text-muted sm:text-lg"
            style={{ animationDelay: '280ms' }}
          >
            Răspunde sincer la fiecare «Ți-ar plăcea să…?» — la capătul
            traseului, busola ta interioară arată spre domeniile în care te-ai
            simți acasă.
          </p>
        </div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className="wrap">
          <div className="max-w-3xl">
            <TestJourney />
          </div>
        </div>
      </section>
    </>
  );
}
