import Image from 'next/image';
import { CompassRose, GitHubIcon } from '../../components/layout/Brand.js';
import ContactForm from '../../components/about/ContactForm.js';
import aboutImage from '../../public/assets/about.jpg';

export const metadata = {
  title: 'Despre noi',
  description:
    'Povestea StudCompass: doi elevi din Baia Mare, pasionați de informatică, au desenat o hartă a facultăților din România. Află cine suntem și scrie-ne.',
};

const CONTACT_EMAIL = 'contact@studcompass.ro';

/* Ported facts from v1 (pages/about.js), presented as map coordinates. */
const ROUTE_FACTS = [
  {
    label: 'Punct de plecare',
    value: 'Colegiul Național „Gheorghe Șincai"',
  },
  {
    label: 'Coordonate',
    value: 'Baia Mare, Maramureș',
    detail: '47.65° N · 23.57° E',
  },
  {
    label: 'Echipaj',
    value: 'Doi elevi pasionați de informatică',
  },
];

const TEAM = [
  {
    name: 'Toma Aris',
    role: 'Elev · Colegiul Național „Gheorghe Șincai"',
    github: null,
  },
  {
    name: 'Ureche Rafael',
    role: 'Elev · Colegiul Național „Gheorghe Șincai"',
    github: 'BLADR-ONE',
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
          Mission spread — the "legend" chapter of the atlas
      ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="texture-doodle" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
        />

        <div className="wrap relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow animate-rise" style={{ animationDelay: '60ms' }}>
              Despre noi
            </p>
            <h1
              className="animate-rise mt-5 text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl lg:text-[3.4rem]"
              style={{ animationDelay: '160ms' }}
            >
              Doi elevi, o singură{' '}
              <em className="wonky italic text-primary-strong dark:text-primary-soft">
                busolă
              </em>
              .
            </h1>

            <div
              className="animate-rise mt-7 space-y-5 text-pretty leading-relaxed text-text-muted sm:text-lg"
              style={{ animationDelay: '280ms' }}
            >
              <p>
                Suntem o echipă de doi elevi de la Colegiul Național „Gheorghe
                Șincai" din Baia Mare, Maramureș — amândoi pasionați de
                informatică.
              </p>
              <p>
                Am construit StudCompass ca să demonstrăm cât de utilă poate fi
                informatica atunci când îți cauți traseul în viață: o hartă a
                facultăților din România, desenată de doi oameni care abia își
                trasează propriul drum.
              </p>
            </div>

            <p
              className="animate-rise mt-9 inline-flex items-center gap-2.5 text-sm font-semibold text-text-muted"
              style={{ animationDelay: '400ms' }}
            >
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-r from-accent to-highlight"
              />
              Made with{' '}
              <HeartIcon className="size-3.5 -translate-y-px text-accent" />
              <span className="sr-only">dragoste</span> by StudCompass
            </p>
          </div>

          {/* Photo plate — a pinned snapshot on the map */}
          <div className="animate-pop relative mx-auto w-full max-w-md lg:max-w-none">
            <CompassRose className="pointer-events-none absolute -right-16 -top-20 size-64 text-primary/10 dark:text-primary-soft/10" />
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 size-full rounded-[2rem] border-2 border-dashed border-primary-soft/40"
            />
            <figure className="relative rotate-[1.5deg] overflow-hidden rounded-[2rem] border border-border shadow-lift transition-transform duration-500 hover:rotate-0">
              <Image
                src={aboutImage}
                alt="Studenți la cursuri — drumul prin facultate"
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 28rem, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 to-transparent"
              />
              <figcaption className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.22em] text-mint/90">
                Fig. 1 — de aici pornim
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          Route facts — ported details, drawn as waypoints
      ---------------------------------------------------------------- */}
      <section className="pb-24">
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
          The cartographers
      ---------------------------------------------------------------- */}
      <section className="pb-24">
        <div className="wrap">
          <div className="max-w-xl">
            <p className="eyebrow">Cartografii</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-semibold sm:text-4xl">
              Cine ține creionul pe hartă
            </h2>
            <p className="mt-4 text-pretty text-text-muted sm:text-lg">
              Vrei să ne contactezi? Ne găsești pe următoarele platforme — sau
              ne scrii direct, mai jos.
            </p>
          </div>

          <div className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {TEAM.map(({ name, role, github }) => {
              const cardClass =
                'group flex flex-col rounded-3xl border border-border bg-surface-raised p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-soft/60 hover:shadow-lift';
              const inner = (
                <>
                  <span
                    aria-hidden="true"
                    className="wonky flex size-14 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft"
                  >
                    {name.charAt(0)}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold transition-colors group-hover:text-primary-strong dark:group-hover:text-primary-soft">
                    {name}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{role}</p>
                  {github && (
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-strong dark:text-primary-soft">
                      <GitHubIcon className="size-4" />
                      github.com/{github}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  )}
                </>
              );

              return github ? (
                <a
                  key={name}
                  href={`https://github.com/${github}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              ) : (
                <div key={name} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
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
                  {TEAM.filter((member) => member.github).map(
                    ({ name, github }) => (
                      <li key={github}>
                        <a
                          href={`https://github.com/${github}`}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-2.5 text-sm text-mint/75 transition-colors hover:text-white"
                        >
                          <GitHubIcon className="size-4" />
                          GitHub: {name}
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </a>
                      </li>
                    ),
                  )}
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
