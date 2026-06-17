import { eq } from 'drizzle-orm';
import { auth } from '../../../lib/auth.js';
import dbModule from '../../../lib/db/index.js';
import Badge from '../../../components/ui/Badge.js';
import { CompassRose } from '../../../components/layout/Brand.js';
import ProfileCard from '../../../components/account/ProfileCard.js';
import PreferencesCard from '../../../components/account/PreferencesCard.js';
import PersonalityCard from '../../../components/account/PersonalityCard.js';
import SignOutButton from '../../../components/account/SignOutButton.js';

const { db, schema } = dbModule;

export const metadata = {
  title: 'Contul meu',
  description:
    'Jurnalul tău StudCompass: numele de călător, direcțiile preferate și rezultatul testului de carieră.',
};

/* Static fallbacks: the logbook stays fully usable without a database. */
const FALLBACK_DOMAINS = [
  { slug: 'arhitectura-si-constructii', name: 'Arhitectură și construcții' },
  { slug: 'arte-si-design', name: 'Arte și design' },
  { slug: 'biologie-si-mediu', name: 'Biologie și mediu' },
  { slug: 'drept-si-stiinte-sociale', name: 'Drept și științe sociale' },
  { slug: 'informatica-si-it', name: 'Informatică și IT' },
  { slug: 'inginerie', name: 'Inginerie' },
  { slug: 'medicina-si-sanatate', name: 'Medicină și sănătate' },
  {
    slug: 'psihologie-si-stiinte-ale-comunicarii',
    name: 'Psihologie și comunicare',
  },
  { slug: 'stiinte-ale-educatiei', name: 'Științe ale educației' },
  { slug: 'stiinte-ale-naturii', name: 'Științe ale naturii' },
  { slug: 'stiinte-economice', name: 'Științe economice' },
  { slug: 'stiinte-umaniste', name: 'Științe umaniste' },
];

const FALLBACK_CITIES = [
  'București',
  'Brașov',
  'Cluj-Napoca',
  'Constanța',
  'Craiova',
  'Galați',
  'Iași',
  'Oradea',
  'Pitești',
  'Sibiu',
  'Timișoara',
  'Târgu Mureș',
];

async function getLogbook(userId) {
  const fallback = {
    user: null,
    cities: FALLBACK_CITIES,
    domains: FALLBACK_DOMAINS,
  };

  if (!db || !userId) {
    return fallback;
  }

  try {
    const [userRows, cityRows, domainRows] = await Promise.all([
      db
        .select({
          name: schema.users.name,
          email: schema.users.email,
          preferences: schema.users.preferences,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1),
      db
        .selectDistinct({ city: schema.faculties.city })
        .from(schema.faculties)
        .orderBy(schema.faculties.city),
      db
        .select({ slug: schema.domains.slug, name: schema.domains.name })
        .from(schema.domains)
        .orderBy(schema.domains.name),
    ]);

    return {
      user: userRows[0] || null,
      cities:
        cityRows.length > 0 ? cityRows.map((row) => row.city) : FALLBACK_CITIES,
      domains: domainRows.length > 0 ? domainRows : FALLBACK_DOMAINS,
    };
  } catch {
    /* Unreachable database — session data still fills the logbook. */
    return fallback;
  }
}

/* The traveler logbook: identity, preferred directions, inner compass. */
export default async function AccountPage() {
  const session = await auth();
  const { user, cities, domains } = await getLogbook(session?.user?.id);

  const name = user?.name || session?.user?.name || '';
  const email = user?.email || session?.user?.email || '';
  const role = session?.user?.role || 'user';
  const roleLabel = role === 'admin' ? 'Administrator' : role;
  const preferences = user?.preferences || {};
  const preferredCity =
    typeof preferences.city === 'string' ? preferences.city : '';
  const preferredDomains = Array.isArray(preferences.domains)
    ? preferences.domains.filter((item) => typeof item === 'string')
    : [];
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : null;
  const initial = (name || email || '?').charAt(0).toUpperCase();

  /* Keep a saved city selectable even if it left the catalog. */
  const cityOptions =
    preferredCity && !cities.includes(preferredCity)
      ? [...cities, preferredCity].sort((a, b) => a.localeCompare(b, 'ro'))
      : cities;

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
            Jurnal de călătorie
          </p>
          <h1
            className="animate-rise mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl"
            style={{ animationDelay: '160ms' }}
          >
            Carnetul tău de{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              drum
            </em>
            .
          </h1>
          <p
            className="animate-rise mt-5 max-w-xl text-pretty leading-relaxed text-text-muted sm:text-lg"
            style={{ animationDelay: '280ms' }}
          >
            Numele tău, direcțiile preferate și busola interioară — tot ce ai
            descoperit până acum, într-un singur loc.
          </p>
        </div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className="wrap">
          {/* Identity strip */}
          <div className="animate-pop flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-surface-raised p-5 shadow-card sm:p-6">
            <span
              aria-hidden="true"
              className="wonky flex size-14 flex-none items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-semibold italic text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft"
            >
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold">
                {name || 'Călător fără nume'}
              </p>
              {email && (
                <p className="truncate text-sm text-text-muted">{email}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  tone={role === 'admin' ? 'primary' : 'neutral'}
                  className={
                    role === 'admin'
                      ? 'border-orange-500 bg-orange-500 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]'
                      : ''
                  }
                >
                  {roleLabel}
                </Badge>
                {memberSince && (
                  <Badge tone="primary" className="hidden sm:inline-flex">
                    Călător din {memberSince}
                  </Badge>
                )}
              </div>
            </div>
            <SignOutButton className="ml-auto" />
          </div>

          {/* The logbook spreads */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="grid gap-6">
              <ProfileCard initialName={name} />
              <PreferencesCard
                cities={cityOptions}
                domains={domains}
                initialCity={preferredCity}
                initialDomains={preferredDomains}
              />
            </div>
            <PersonalityCard />
          </div>
        </div>
      </section>
    </>
  );
}
