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
import { CompassRose } from '../../../components/layout/Brand.js';

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
        <CompassRose className="pointer-events-none absolute -bottom-24 -left-16 size-72 text-primary/[0.08] dark:text-primary-soft/10" />
        <CompassRose className="pointer-events-none absolute -right-20 -top-24 size-80 text-primary/[0.08] dark:text-primary-soft/10" />
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
          Map sheet hero: cover plate + emblem seal + name
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

        <div className="relative mt-4 h-[19rem] overflow-hidden rounded-[2.5rem] shadow-lift sm:h-[23rem] lg:h-[26rem]">
          <HeroCover coverUrl={faculty.coverUrl} name={faculty.name} />
          <CompassRose className="pointer-events-none absolute -right-16 -top-20 size-72 text-mint/10" />

          <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6 sm:gap-6 sm:p-10">
            <span className="flex size-16 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-lift sm:size-20">
              {faculty.emblemUrl ? (
                <img
                  src={faculty.emblemUrl}
                  alt=""
                  className="size-full object-contain p-1.5"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="wonky font-display text-3xl font-semibold italic text-primary-strong"
                >
                  {faculty.name.charAt(0)}
                </span>
              )}
            </span>
            <div className="min-w-0 pb-0.5">
              <p className="eyebrow !text-mint">Fișa facultății</p>
              <h1 className="mt-2 text-balance font-display text-2xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                {faculty.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Passport strip: rating, city, badges */}
      <section className="wrap">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-dashed border-border py-5">
          {details.count > 0 && details.avg != null ? (
            <StarRating value={details.avg} count={details.count} />
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
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {details.programs.map((program) => (
                  <li
                    key={program.id}
                    className="group flex items-center gap-3 rounded-2xl border border-border bg-surface-raised px-4 py-3.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-soft/60"
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 flex-none rotate-45 bg-primary-soft transition-colors duration-300 group-hover:bg-accent"
                    />
                    <span className="text-sm font-medium">{program.name}</span>
                  </li>
                ))}
              </ul>
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
        <div className="max-w-2xl">
          <p className="eyebrow">Vocea studenților</p>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold sm:text-4xl">
            Recenzii și discuții
          </h2>
          <p className="mt-4 text-pretty text-text-muted sm:text-lg">
            Părerile sincere ale celor care au trecut pe aici — și un chat
            public pentru întrebări rapide.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reviews facultySlug={faculty.slug} />
          <Chat facultySlug={faculty.slug} />
        </div>
      </section>
    </>
  );
}
