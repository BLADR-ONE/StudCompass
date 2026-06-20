import Link from 'next/link';
import Button from '../ui/Button.js';
import { Constellation, TrailWeave } from '../layout/Brand.js';
import Reveal from '../ui/Reveal.js';

export default function CtaBand() {
  return (
    <section className="pb-24 pt-4 sm:pb-28">
      <div className="wrap">
        {/* Always the night map, in both themes — a deliberate full-stop. */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-strong via-night-mid to-night-deep px-6 py-20 text-center shadow-glow ring-1 ring-mint/10 sm:px-12 sm:py-24">
          <div aria-hidden="true" className="texture-doodle-night" />
          <Constellation className="animate-twinkle pointer-events-none absolute -right-20 -top-24 size-[28rem] text-mint/15" />
          <TrailWeave className="animate-drift-slow pointer-events-none absolute -bottom-28 -left-24 size-96 text-mint/[0.1]" />
          {/* Warm accent beacon behind the CTA — the climax of the page. */}
          <span
            aria-hidden="true"
            className="beacon-glow animate-beacon absolute bottom-2 left-1/2 size-[26rem] -translate-x-1/2"
          />

          <Reveal variant="fade-up" className="relative mx-auto max-w-2xl">
            <p className="eyebrow justify-center !text-mint">
              Testul de carieră
            </p>
            <h2 className="mt-5 text-balance font-display text-[length:var(--text-display)] font-semibold leading-[1.02] tracking-[-0.028em] text-white">
              Nu știi încotro{' '}
              <em className="wonky italic text-highlight">s-o iei</em>?
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-mint/80 sm:text-lg">
              120 de întrebări, vreo 15 minute — și testul de carieră
              StudCompass îți conturează domeniile în care te-ai simți ca
              acasă.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
              <Button
                href="/account/personalityTest"
                variant="accent"
                size="lg"
                className="group"
              >
                Începe testul de carieră
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    d="M2 8h11m0 0L8.5 3.5M13 8l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Link
                href="/facultati"
                className="text-sm font-semibold text-mint underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                sau explorează facultățile →
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
