import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq, isNull, sql } from 'drizzle-orm';
import dbModule from '../../../lib/db/index.js';
import Badge from '../../../components/ui/Badge.js';
import Button from '../../../components/ui/Button.js';
import StarRating from '../../../components/ui/StarRating.js';
import Reviews from '../../../components/faculty/Reviews.js';
import Chat from '../../../components/faculty/Chat.js';
import Reveal from '../../../components/ui/Reveal.js';
import { Contour, WaypointGrid, Horizon, CompassRose, RiverDelta } from '../../../components/layout/Brand.js';
import MotifScroll from '../../../components/ui/MotifScroll.js';

const { db, schema } = dbModule;

const leiFormatter = new Intl.NumberFormat('ro-RO');

function formatDecimal(value, digits = 2) {
  return Number(value).toFixed(digits).replace('.', ',');
}

/* One cached lookup shared by generateMetadata and the page. */
const getFaculty = cache(async (slug) => {
  if (!db) {
    return { offline: true, faculty: null };
  }

  try {
    const [faculty] = await db
      .select()
      .from(schema.faculties)
      .where(eq(schema.faculties.slug, slug))
      .limit(1);
    return { offline: false, faculty: faculty || null };
  } catch {
    return { offline: true, faculty: null };
  }
});

async function getDetails(facultyId) {
  const empty = { programs: [], domains: [], avg: null, count: 0 };
  if (!db) {
    return empty;
  }

  try {
    const [programs, domains, [aggregate]] = await Promise.all([
      db
        .select({ id: schema.programs.id, name: schema.programs.name })
        .from(schema.programs)
        .where(eq(schema.programs.facultyId, facultyId))
        .orderBy(schema.programs.name),
      db
        .select({ slug: schema.domains.slug, name: schema.domains.name })
        .from(schema.facultyDomains)
        .innerJoin(
          schema.domains,
          eq(schema.facultyDomains.domainId, schema.domains.id),
        )
        .where(eq(schema.facultyDomains.facultyId, facultyId))
        .orderBy(schema.domains.name),
      db
        .select({
          avg: sql`avg(${schema.reviews.rating})`,
          count: sql`count(*)`,
        })
        .from(schema.reviews)
        .where(
          and(
            eq(schema.reviews.facultyId, facultyId),
            isNull(schema.reviews.hiddenAt),
          ),
        ),
    ]);

    return {
      programs,
      domains,
      avg: aggregate?.avg == null ? null : Number(aggregate.avg),
      count: aggregate?.count == null ? 0 : Number(aggregate.count),
    };
  } catch {
    return empty;
  }
}

export async function generateMetadata({ params }) {
  const { pid } = await params;
  const { faculty } = await getFaculty(pid);

  if (!faculty) {
    return { title: 'Facultate' };
  }

  return {
    title: faculty.name,
    description:
      faculty.description ||
      `${faculty.name} din ${faculty.city} — recenzii de la studenți, programe de studiu, costuri și date de admitere pe StudCompass.`,
  };
}

function HeroCover({ coverUrl, name }) {
  const isLocal = typeof coverUrl === 'string' && coverUrl.startsWith('/');

  if (!coverUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary-strong">
        <span
          aria-hidden="true"
          className="wonky font-display text-[8rem] font-semibold italic text-mint/30"
        >
          {(name || '?').charAt(0)}
        </span>
      </div>
    );
  }

  return isLocal ? (
    <Image
      src={coverUrl}
      alt=""
      fill
      priority
      sizes="(min-width: 1280px) 74rem, 100vw"
      className="object-cover"
    />
  ) : (
    <img
      src={coverUrl}
      alt=""
      className="absolute inset-0 size-full object-cover"
    />
  );
}

function ContactRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-8 flex-none items-center justify-center rounded-full bg-primary/10 text-primary-strong dark:bg-primary-soft/10 dark:text-primary-soft"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-text">
          {children}
        </p>
      </div>
    </div>
  );
}

const ICONS = {
  pin: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M8 14.5S3 9.9 3 6.5a5 5 0 1 1 10 0c0 3.4-5 8-5 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <path
        d="M3.6 2h2.2l1.1 3-1.5 1.2a9.4 9.4 0 0 0 4.4 4.4L11 9.1l3 1.1v2.2c0 .9-.7 1.6-1.6 1.6C6.9 13.7 2.3 9.1 2 3.6 2 2.7 2.7 2 3.6 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
      <rect
        x="1.75"
        y="3.25"
        width="12.5"
        height="9.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m2.5 5 5.5 4.25L13.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function OfflineState() {
  return (
    <section className="wrap py-20 sm:py-24">
      <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-16 text-center sm:py-20">
        <Contour className="animate-sway pointer-events-none absolute -bottom-20 -left-16 size-72 text-primary/[0.13] dark:text-primary-soft/[0.14]" />
        <WaypointGrid className="pointer-events-none absolute -right-20 -top-24 size-80 text-primary/[0.13] dark:text-primary-soft/[0.14]" />
        <div className="relative mx-auto max-w-md">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">
            Foaia asta de hartă nu se poate încărca.
          </h1>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
            Catalogul nu e conectat momentan, așa că detaliile facultății
            rămân deocamdată în ceață. Mai încearcă în câteva minute.
          </p>
          <div className="mt-7">
            <Button href="/facultati" variant="primary">
              Înapoi la catalog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function FacultyPage({ params }) {
  const { pid } = await params;
  const { offline, faculty } = await getFaculty(pid);

  if (offline) {
    return <OfflineState />;
  }
  if (!faculty) {
    notFound();
  }

  const details = await getDetails(faculty.id);

  const stats = [
    {
      label: 'Taxă anuală de studiu',
      value:
        faculty.tuitionCost != null
          ? `${leiFormatter.format(faculty.tuitionCost)} lei`
          : null,
      suffix: faculty.tuitionCost != null ? '/ an' : null,
    },
    {
      label: 'Medie minimă de admitere',
      value:
        faculty.minAdmissionGrade != null
          ? formatDecimal(faculty.minAdmissionGrade)
          : null,
    },
    {
      label: 'Indice locuri la buget',
      value:
        faculty.budgetSeatsIndex != null
          ? formatDecimal(faculty.budgetSeatsIndex, 1)
          : null,
    },
  ];

  const hasContact = faculty.address || faculty.phone || faculty.email;

  return (
    <>
      {/* --------------------------------------------------------------
          Map sheet hero: full-bleed cover plate + glass info panel
      -------------------------------------------------------------- */}
      <section className="wrap pt-5">
        <Link
          href="/facultati"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted transition-colors hover:text-text"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          Înapoi la catalog
        </Link>

        {/* Cover plate */}
        <div className="relative mt-4 h-[22rem] overflow-hidden rounded-[2.5rem] shadow-lift sm:h-[27rem] lg:h-[31rem]">
          <HeroCover coverUrl={faculty.coverUrl} name={faculty.name} />

          {/* Ink veil — gradient overlay for contrast */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/60 to-ink/10"
          />
          {/* Top vignette */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/75 to-transparent"
          />

          {/* Cartographer motif anchor — large CompassRose, parallax on scroll
              while it keeps its slow spin (parallax on the outer wrapper). */}
          <MotifScroll
            effect="parallax"
            speed={1.2}
            className="pointer-events-none absolute -right-24 -top-24 size-[28rem] text-mint/[0.16] sm:-right-16 sm:-top-16"
          >
            <CompassRose className="animate-spin-slow size-full" />
          </MotifScroll>
          <Horizon className="animate-sway pointer-events-none absolute -bottom-10 right-[10%] size-56 text-mint/[0.16]" />

          {/* Hero content — name block */}
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-5 p-6 sm:gap-7 sm:p-10">
            {/* Emblem seal */}
            <span className="flex size-20 flex-none items-center justify-center overflow-hidden rounded-2xl border-2 border-white/25 bg-white/10 shadow-lift backdrop-blur-sm sm:size-24">
              {faculty.emblemUrl ? (
                <img
                  src={faculty.emblemUrl}
                  alt=""
                  className="size-full object-contain p-2"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="wonky font-display text-4xl font-semibold italic text-white"
                >
                  {faculty.name.charAt(0)}
                </span>
              )}
            </span>

            <div className="min-w-0 pb-1 animate-lift">
              <p className="eyebrow !text-mint before:bg-gradient-to-r before:from-mint before:to-teal-soft">
                Fișa facultății
              </p>
              <h1 className="mt-3 text-balance font-display text-[length:var(--text-display)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                {faculty.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Glass passport strip — overlaps the bottom of the cover on large screens */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface-raised px-5 py-4 shadow-glow sm:px-6 lg:-mt-0 lg:rounded-3xl">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {details.count > 0 && details.avg != null ? (
              <>
                <StarRating value={details.avg} count={details.count} />
                <span
                  aria-hidden="true"
                  className="hidden size-1.5 rotate-45 bg-primary-soft/60 sm:block"
                />
                <span className="font-display text-lg font-semibold text-primary-strong dark:text-primary-soft">
                  {(Math.round(details.avg * 10) / 10).toFixed(1).replace('.', ',')}
                </span>
                <span className="text-xs text-text-muted">
                  din {details.count} {details.count === 1 ? 'recenzie' : 'recenzii'}
                </span>
              </>
            ) : (
              <span className="text-sm text-text-muted">Fără recenzii încă</span>
            )}
            <span
              aria-hidden="true"
              className="size-1.5 rotate-45 bg-primary-soft/60"
            />
            <Badge tone="primary">{faculty.city}</Badge>
            {faculty.multiCampus && (
              <Badge tone="highlight">Mai multe campusuri</Badge>
            )}
            {details.domains.map((domain) => (
              <Badge key={domain.slug} tone="neutral">
                {domain.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------
          Sheet body: description + programs | stats + contacts
      -------------------------------------------------------------- */}
      <section className="wrap mt-10 grid items-start gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
        <div>
          <p className="eyebrow">Despre facultate</p>
          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-text-muted sm:text-lg">
            {faculty.description ||
              'Descrierea acestei facultăți e încă pe drum spre hartă. Între timp, recenziile studenților de mai jos spun deja o bună parte din poveste.'}
          </p>

          <div className="mt-12">
            <p className="eyebrow">Programe de studiu</p>
            <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
              Trasee pe care le poți urma
            </h2>
            {details.programs.length > 0 ? (
              <Reveal
                stagger
                as="ul"
                className="mt-6 grid gap-3 sm:grid-cols-2"
              >
                {details.programs.map((program) => (
                  <li
                    key={program.id}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-surface-raised px-4 py-3.5 shadow-card transition-[transform,border-color,box-shadow] duration-300 ease-out-quint hover:-translate-y-0.5 hover:border-primary-soft/60 hover:shadow-lift"
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 flex-none rotate-45 bg-primary-soft transition-colors duration-300 group-hover:bg-accent"
                    />
                    <span className="text-sm font-medium">{program.name}</span>
                  </li>
                ))}
              </Reveal>
            ) : (
              <p className="mt-5 text-sm text-text-muted">
                Lista programelor de studiu apare aici imediat ce e
                cartografiată.
              </p>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="rounded-3xl border border-border bg-surface-raised p-6 shadow-card">
            <p className="eyebrow">Pe scurt</p>
            <dl className="mt-5 space-y-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={
                    index > 0 ? 'border-t border-dashed border-border pt-4' : ''
                  }
                >
                  <dt className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                    {stat.label}
                  </dt>
                  <dd className="mt-1.5">
                    {stat.value != null ? (
                      <span className="font-display text-2xl font-semibold">
                        {stat.value}
                        {stat.suffix && (
                          <span className="ml-1 text-sm font-normal text-text-muted">
                            {stat.suffix}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-sm text-text-muted">
                        în curs de cartografiere
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-border bg-surface-raised p-6 shadow-card">
            <p className="eyebrow">Contact</p>
            {hasContact ? (
              <div className="mt-5 space-y-4">
                {faculty.address && (
                  <ContactRow icon={ICONS.pin} label="Adresă">
                    {faculty.address}
                  </ContactRow>
                )}
                {faculty.phone && (
                  <ContactRow icon={ICONS.phone} label="Telefon">
                    <a
                      href={`tel:${faculty.phone.replace(/\s+/g, '')}`}
                      className="underline-offset-4 transition-colors hover:text-primary-strong hover:underline dark:hover:text-primary-soft"
                    >
                      {faculty.phone}
                    </a>
                  </ContactRow>
                )}
                {faculty.email && (
                  <ContactRow icon={ICONS.mail} label="E-mail">
                    <a
                      href={`mailto:${faculty.email}`}
                      className="underline-offset-4 transition-colors hover:text-primary-strong hover:underline dark:hover:text-primary-soft"
                    >
                      {faculty.email}
                    </a>
                  </ContactRow>
                )}
              </div>
            ) : (
              <p className="mt-5 text-sm text-text-muted">
                Datele de contact apar aici imediat ce sunt cartografiate.
              </p>
            )}

            {faculty.website && (
              <Button
                href={faculty.website}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                className="mt-6 w-full"
              >
                Vizitează site-ul oficial
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="size-3.5"
                >
                  <path
                    d="M4 12 12 4m0 0H5.5M12 4v6.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
          </div>
        </aside>
      </section>

      {/* --------------------------------------------------------------
          Community: reviews journal + public chat
      -------------------------------------------------------------- */}
      <section className="wrap mt-16 pb-24 sm:mt-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-strong via-night-mid to-night-deep px-6 py-10 sm:px-10 sm:py-12">
          <div aria-hidden="true" className="texture-doodle-night" />
          <MotifScroll
            effect="rotate"
            speed={0.9}
            className="pointer-events-none absolute -right-12 -top-12 size-72 text-mint/[0.16]"
          >
            <RiverDelta className="size-full" />
          </MotifScroll>
          <span aria-hidden="true" className="beacon-glow animate-beacon absolute -left-8 top-4 size-64 opacity-40" />
          <Reveal variant="fade-up" className="relative max-w-2xl">
            <p className="eyebrow !text-mint before:bg-gradient-to-r before:from-mint before:to-teal-soft">
              Vocea studenților
            </p>
            <h2 className="mt-4 text-balance font-display text-[length:var(--text-section)] font-semibold text-white">
              Recenzii și discuții
            </h2>
            <p className="mt-4 text-pretty text-mint/75 sm:text-lg">
              Părerile sincere ale celor care au trecut pe aici — și un chat
              public pentru întrebări rapide.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reviews facultySlug={faculty.slug} />
          <Chat facultySlug={faculty.slug} />
        </div>
      </section>
    </>
  );
}
