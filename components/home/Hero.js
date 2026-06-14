import Image from 'next/image';
import Button from '../ui/Button.js';
import { CompassRose } from '../layout/Brand.js';
import heroImage from '../../public/assets/journey.jpg';

const TRUST_POINTS = [
  'Recenzii reale de la studenți',
  'Filtre pe orașe și domenii',
  'Complet gratuit',
];

export default function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
      {/* The road ahead — sunrise oranges echo the accent palette. */}
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[center_62%]"
      />

      {/* Ink veil, heavier on the text side */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0c2022]/95 via-[#0c2022]/60 to-[#0c2022]/10"
      />
      {/* Top vignette for navbar legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0c2022]/70 to-transparent"
      />
      {/* Seamless hand-off into the page background, both themes */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg to-transparent"
      />

      <CompassRose className="animate-spin-slow pointer-events-none absolute -right-24 top-24 hidden size-[26rem] text-mint/15 lg:block" />

      <div className="wrap relative py-32">
        <div className="max-w-2xl">
          <p
            className="eyebrow animate-rise !text-mint"
            style={{ animationDelay: '80ms' }}
          >
            Busola ta pentru studii
          </p>

          <h1
            className="animate-rise mt-6 text-balance font-display text-[clamp(2.9rem,7vw,5.25rem)] font-semibold leading-[1.02] text-white"
            style={{ animationDelay: '180ms' }}
          >
            Primul pas spre{' '}
            <em className="wonky italic text-highlight">viitorul tău</em>.
          </h1>

          <p
            className="animate-rise mt-7 max-w-xl text-pretty text-base leading-relaxed text-mint/85 sm:text-lg"
            style={{ animationDelay: '300ms' }}
          >
            Îți cauți drumul? StudCompass adună facultățile din România într-un
            singur loc — cu recenzii sincere de la studenți, filtre pe orașe și
            domenii și un test de carieră care te ajută să te descoperi. Ia-ți
            viitorul în propriile mâini.
          </p>

          <div
            className="animate-rise mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '420ms' }}
          >
            <Button href="/facultati" variant="primary" size="lg">
              Explorează facultățile
            </Button>
            <Button
              href="/account/personalityTest"
              variant="accent"
              size="lg"
              className="group"
            >
              Fă testul de carieră
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
          </div>

          <ul
            className="animate-rise mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mint/65"
            style={{ animationDelay: '540ms' }}
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 rotate-45 bg-highlight"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="animate-bob size-6 text-mint/70"
        >
          <path
            d="M5 9l7 7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
