import Image from 'next/image';
import { CompassRose, GitHubIcon } from '../../components/layout/Brand.js';
import ContactForm from '../../components/about/ContactForm.js';
import aboutImage from '../../public/assets/about.jpg';

export const metadata = {
  title: 'Despre noi',
  description:
    'Povestea StudCompass: un proiect pasionat de informatică, gândit ca o hartă a facultăților din România. Află cine e în spatele busolei și scrie-ne.',
};

const CONTACT_EMAIL = 'contact@studcompass.ro';

/* Project author. */
const AUTHOR = {
  name: 'Ureche Rafael',
  alias: 'Bladr-One',
  role: 'Creator & dezvoltator',
  github: 'BLADR-ONE',
};

/* A single low-key contributor mention (left the project, with approval). */
const CONTRIBUTOR_NAME = 'Toma Aris';

/* Facts presented as map coordinates. */
const ROUTE_FACTS = [
  {
    label: 'Punct de plecare',
    value: 'O pasiune pentru informatică',
  },
  {
    label: 'Misiune',
    value: 'O hartă clară a facultăților din România',
  },
  {
    label: 'Echipaj',
    value: 'Un proiect dus la capăt de un singur om',
  },
];

function HeartIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M8 14.2 6.84 13.16C2.72 9.42.4 7.32.4 4.74.4 2.64 2.06 1 4.16 1c1.19 0 2.33.55 3.07 1.43L8 3.34l.77-.91A4.07 4.07 0 0 1 11.84 1c2.1 0 3.76 1.64 3.76 3.74 0 2.58-2.32 4.68-6.44 8.43L8 14.2Z"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* ----------------------------------------------------------------
          Mission hero — a full-bleed map cover, mirroring the home hero
      ---------------------------------------------------------------- */}
      <section className="relative flex min-h-svh items-center overflow-hidden">
        {/* The cover photo, treated as the page's opening landscape. */}
        <Image
          src={aboutImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[center_45%]"
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
              Despre noi
            </p>

            <h1
              className="animate-rise mt-6 text-balance font-display text-[clamp(2.7rem,6.5vw,4.75rem)] font-semibold leading-[1.03] text-white"
              style={{ animationDelay: '180ms' }}
            >
              Un om, o singură{' '}
              <em className="wonky italic text-highlight">busolă</em>.
            </h1>

            <div
              className="animate-rise mt-7 max-w-xl space-y-5 text-pretty text-base leading-relaxed text-mint/85 sm:text-lg"
              style={{ animationDelay: '300ms' }}
            >
              <p>
                StudCompass e proiectul unui pasionat de informatică, construit
                ca să demonstreze cât de utilă poate fi tehnologia atunci când
                îți cauți traseul în viață.
              </p>
              <p>
                E o hartă a facultăților din România, desenată de un om care
                abia își trasează propriul drum — și care speră să-ți fie de
                folos pe-al tău.
              </p>
            </div>

            <p
              className="animate-rise mt-10 inline-flex items-center gap-2.5 text-sm font-semibold text-mint/65"
              style={{ animationDelay: '420ms' }}
            >
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-r from-highlight to-mint"
              />
              Made with{' '}
              <HeartIcon className="size-3.5 -translate-y-px text-highlight" />
              <span className="sr-only">dragoste</span> by StudCompass
            </p>
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

      {/* ----------------------------------------------------------------
          Route facts — details drawn as waypoints
      ---------------------------------------------------------------- */}
      <section className="pb-24 pt-20 sm:pt-24">
        <div className="wrap">
          <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
            <div
              aria-hidden="true"
              className="absolute -top-7 left-[16%] right-[16%] hidden border-t-2 border-dashed border-primary-soft/40 md:block"
            />
            {ROUTE_FACTS.map(({ label, value, detail }) => (
              <li
                key={label}
                className="group relative rounded-3xl border border-border bg-surface-raised p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-soft/60 hover:shadow-lift"
              >
                <div
                  aria-hidden="true"
                  className="absolute -top-7 left-1/2 hidden size-3.5 -translate-x-1/2 rounded-full border-2 border-primary-soft bg-bg transition-colors duration-300 group-hover:bg-primary-soft md:block"
                />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--sc-eyebrow)">
                  {label}
                </p>
                <p className="mt-3 font-display text-lg font-semibold leading-snug">
                  {value}
                </p>
                {detail && (
                  <p className="mt-1.5 text-sm text-text-muted">{detail}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          The cartographer
      ---------------------------------------------------------------- */}
      <section className="pb-24">
        <div className="wrap">
          <div className="max-w-xl">
            <p className="eyebrow">Cartograful</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-semibold sm:text-4xl">
              Cine ține creionul pe hartă
            </h2>
            <p className="mt-4 text-pretty text-text-muted sm:text-lg">
              Vrei să ne contactezi? Mă găsești pe GitHub — sau îmi scrii
              direct, mai jos.
            </p>
          </div>

          <div className="mt-10 max-w-md">
            <a
              href={`https://github.com/${AUTHOR.github}`}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-3xl border border-border bg-surface-raised p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-soft/60 hover:shadow-lift"
            >
              <span
                aria-hidden="true"
                className="wonky flex size-14 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft"
              >
                {AUTHOR.name.charAt(0)}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold transition-colors group-hover:text-primary-strong dark:group-hover:text-primary-soft">
                {AUTHOR.name}
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                {AUTHOR.role} · {AUTHOR.alias}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong dark:text-primary-soft">
                <GitHubIcon className="size-4" />
                github.com/{AUTHOR.github}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </a>
          </div>

          {/* A single low-key contributor line. */}
          <p className="mt-7 text-sm text-text-muted">
            Cu o contribuție timpurie din partea lui {CONTRIBUTOR_NAME}.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          #contact — the night-map correspondence band
      ---------------------------------------------------------------- */}
      <section id="contact" className="scroll-mt-24 pb-24 sm:pb-28">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-strong via-[#1c4a44] to-[#0c2426] px-6 py-14 sm:px-12 sm:py-16">
            <div aria-hidden="true" className="texture-doodle-night" />
            <CompassRose className="animate-spin-slow pointer-events-none absolute -right-24 -top-28 size-96 text-mint/10" />
            <CompassRose className="pointer-events-none absolute -bottom-32 -left-24 size-80 text-mint/[0.07]" />

            <div className="relative grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <p className="eyebrow !text-mint">Contact</p>
                <h2 className="mt-5 text-balance font-display text-3xl font-semibold text-white sm:text-4xl">
                  Hai să ținem{' '}
                  <em className="wonky italic text-highlight">legătura</em>.
                </h2>
                <p className="mt-5 text-pretty leading-relaxed text-mint/80">
                  O idee, o întrebare sau o facultate care lipsește de pe
                  hartă? Orice semnal ne ajută să desenăm mai bine.
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-mint/20 bg-white/[0.05] px-5 py-3.5 font-semibold text-mint transition-colors hover:border-mint/45 hover:text-white"
                >
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="size-5"
                  >
                    <rect
                      x="1.5"
                      y="3.5"
                      width="17"
                      height="13"
                      rx="2.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m2.5 5.5 7.5 6 7.5-6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {CONTACT_EMAIL}
                </a>

                <ul className="mt-8 space-y-3 border-t border-dashed border-mint/20 pt-6">
                  <li>
                    <a
                      href={`https://github.com/${AUTHOR.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2.5 text-sm text-mint/75 transition-colors hover:text-white"
                    >
                      <GitHubIcon className="size-4" />
                      GitHub: {AUTHOR.name}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <ContactForm email={CONTACT_EMAIL} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
