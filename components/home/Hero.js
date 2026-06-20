import Image from 'next/image';
import Button from '../ui/Button.js';
import { CompassRose } from '../layout/Brand.js';
import ScrollCue from '../ui/ScrollCue.js';
import { DEFAULT_HEADER_IMAGE } from '../../lib/site-constants.js';

const TRUST_POINTS = [
  'Recenzii reale de la studenți',
  'Filtre pe orașe și domenii',
  'Complet gratuit',
];

export default function Hero({ headerImage = DEFAULT_HEADER_IMAGE }) {
  const headerSrc =
    typeof headerImage === 'string' && headerImage.startsWith('data:')
      ? headerImage
      : `/assets/${headerImage}`;

  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-bg">
      {/* The road ahead — the photo is settings-driven (admin "Imagine antet"),
          falling back to the default header image. */}
      <Image
        src={headerSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-[center_62%]"
      />

      {/* Ink veil, heavier on the text side. Kept deep-teal in both themes so
          the white headline stays legible over the photo — uses the brand ink
          token rather than a hardcoded hex. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/65 to-ink/15"
      />
      {/* Deepened floor + corner falloff so the composition feels lit from the
          upper-left and grounded at the base. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,transparent_38%,rgb(8_22_22/0.55)_100%)]"
      />
      {/* Top vignette for navbar legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/75 to-transparent"
      />

      {/* Signature compass — given real presence: a warm beacon glow behind it,
          slow spin kept, slow beacon pulse on the glow. Decorative + hidden. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-16 hidden lg:block"
      >
        <span className="beacon-glow animate-beacon absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2" />
        <CompassRose className="animate-spin-slow relative size-[30rem] text-mint/25" />
        <CompassRose className="animate-spin-slow absolute inset-0 size-[30rem] text-highlight/10 [animation-direction:reverse] [animation-duration:140s]" />
      </div>

      <div className="wrap relative py-32">
        <div className="max-w-3xl">
          <p
            className="eyebrow animate-lift !text-mint"
            style={{ animationDelay: '80ms' }}
          >
            Busola ta pentru studii
          </p>

          <h1
            className="animate-lift mt-7 text-balance font-display text-[length:var(--text-hero)] font-semibold leading-[0.98] tracking-[-0.03em] text-white"
            style={{ animationDelay: '180ms' }}
          >
            Primul pas spre{' '}
            <em className="wonky italic text-highlight">viitorul tău</em>.
          </h1>

          <p
            className="animate-lift mt-7 max-w-xl text-pretty text-base leading-relaxed text-mint/85 sm:text-lg"
            style={{ animationDelay: '320ms' }}
          >
            Îți cauți drumul? StudCompass adună facultățile din România într-un
            singur loc — cu recenzii sincere de la studenți, filtre pe orașe și
            domenii și un test de carieră care te ajută să te descoperi. Ia-ți
            viitorul în propriile mâini.
          </p>

          <div
            className="animate-lift mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '460ms' }}
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

          {/* Trust strip — promoted from inline text into a frosted glass plate
              so it reads as a deliberate badge of credibility over the photo. */}
          <ul
            className="animate-lift mt-12 inline-flex flex-wrap items-center gap-x-6 gap-y-2.5 rounded-2xl border border-mint/15 bg-ink/35 px-5 py-3.5 text-sm text-mint/85 backdrop-blur-md"
            style={{ animationDelay: '600ms' }}
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
      <ScrollCue />
    </section>
  );
}
