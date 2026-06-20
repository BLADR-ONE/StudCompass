import { Constellation, Meridian, GitHubIcon } from '../../components/layout/Brand.js';
import ContactForm from '../../components/about/ContactForm.js';
import DeveloperHero from '../../components/about/DeveloperHero.js';
import CreditCard from '../../components/about/CreditCard.js';
import { getSiteSettings } from '../../lib/content.js';
import { getDefaultHeaderImage } from '../../lib/site-constants.js';

export const metadata = {
  title: 'Despre mine',
  description:
    'StudCompass este busola pentru elevii și studenții din România care vor să compare facultăți, să citească recenzii și să-și clarifice traseul academic și profesional.',
};

const CONTACT_EMAIL = 'contact@studcompass.ro';
const OWNER_HANDLE = 'BLADR-ONE';
const OWNER_PROFILE_URL = `https://github.com/${OWNER_HANDLE}`;
const OWNER_FALLBACK = {
  name: 'Rafael-Matei Ureche',
  bio: 'Creatorul StudCompass, construit din dorința de a face alegerea unei facultăți mai clară și mai puțin haotică.',
  avatar_url: 'https://github.com/BLADR-ONE.png',
  public_repos: 0,
  followers: 0,
  html_url: OWNER_PROFILE_URL,
};

async function getOwnerProfile() {
  try {
    const response = await fetch(`https://api.github.com/users/${OWNER_HANDLE}`, {
      next: { revalidate: 86400 },
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'StudCompass',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub profile request failed with ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.name || OWNER_FALLBACK.name,
      bio: data.bio || OWNER_FALLBACK.bio,
      avatar_url: data.avatar_url || OWNER_FALLBACK.avatar_url,
      public_repos:
        typeof data.public_repos === 'number'
          ? data.public_repos
          : OWNER_FALLBACK.public_repos,
      followers:
        typeof data.followers === 'number' ? data.followers : OWNER_FALLBACK.followers,
      html_url: data.html_url || OWNER_FALLBACK.html_url,
    };
  } catch {
    return OWNER_FALLBACK;
  }
}

/* Facts presented as map coordinates. */
const ROUTE_FACTS = [
  {
    label: 'Pentru cine',
    value: 'Elevi, liceeni și studenți care vor să aleagă mai sigur',
  },
  {
    label: 'Ce rezolvă',
    value: 'Reduce zgomotul din jurul facultăților și compară opțiunile pe bune',
  },
  {
    label: 'Cum funcționează',
    value: 'Recenzii, filtre utile și un test de personalitate care îți restrânge traseul',
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

export default async function AboutPage() {
  const [owner, settings] = await Promise.all([
    getOwnerProfile(),
    getSiteSettings(),
  ]);
  const headerImage =
    settings.headerImages?.about || getDefaultHeaderImage('about');

  return (
    <>
      {/* ----------------------------------------------------------------
          Lead — the featured developer banner (the page's opening)
      ---------------------------------------------------------------- */}
      <DeveloperHero
        owner={owner}
        eyebrow="Despre noi"
        headerImage={headerImage}
      />

      {/* ----------------------------------------------------------------
          Mission — what the project is and who it's for
      ---------------------------------------------------------------- */}
      <section className="pb-24 pt-12 sm:pb-28 sm:pt-14">
        <div className="wrap">
          <div className="max-w-2xl">
            <p className="eyebrow">Misiunea</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-semibold sm:text-4xl">
              Busola care te ajută să alegi{' '}
              <em className="wonky italic text-highlight">facultatea potrivită</em>.
            </h2>
            <div className="mt-5 space-y-5 text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
              <p>
                StudCompass este o platformă pentru elevii și studenții din
                România care vor să compare facultăți fără să se piardă printre
                opinii contradictorii, reclame și liste greu de citit.
              </p>
              <p>
                Îți adună într-un singur loc recenzii, filtre utile și un test
                de personalitate ca să vezi mai repede ce facultăți și ce
                direcții profesionale ți se potrivesc.
              </p>
            </div>

            <p className="mt-9 inline-flex items-center gap-2.5 text-sm font-semibold text-text-muted">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-r from-accent to-highlight"
              />
              <HeartIcon className="size-3.5 -translate-y-px text-accent" />
              <span>Gândit pentru decizii mai clare</span>
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          Route facts — details drawn as waypoints
      ---------------------------------------------------------------- */}
      <section className="pb-24">
        <div className="wrap">
          <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
            <div
              aria-hidden="true"
              className="absolute -top-7 left-[16%] right-[16%] hidden border-t-2 border-dashed border-primary-soft/40 md:block"
            />
            {ROUTE_FACTS.map(({ label, value }) => (
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
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          #contact — the night-map correspondence band
      ---------------------------------------------------------------- */}
      <section id="contact" className="scroll-mt-24 pb-24 sm:pb-28">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-strong via-night-mid to-night-deep px-6 py-14 sm:px-12 sm:py-16">
            <div aria-hidden="true" className="texture-doodle-night" />
            <Constellation className="animate-twinkle pointer-events-none absolute -right-20 -top-24 size-96 text-mint/15" />
            <Meridian className="animate-drift-slow pointer-events-none absolute -bottom-28 -left-24 size-80 text-mint/[0.09]" />

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
                      href={owner.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2.5 text-sm text-mint/75 transition-colors hover:text-white"
                    >
                      <GitHubIcon className="size-4" />
                      GitHub: {owner.name}
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

      {/* ----------------------------------------------------------------
          Credit — modest, wide banner for an earlier contributor
      ---------------------------------------------------------------- */}
      <section className="pb-24 pt-0">
        <div className="wrap">
          <CreditCard name="Toma Aris" handle="IRules" />
        </div>
      </section>
    </>
  );
}
