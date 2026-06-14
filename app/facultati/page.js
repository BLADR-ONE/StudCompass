import Link from 'next/link';
import { and, eq, exists, inArray, sql } from 'drizzle-orm';
import dbModule from '../../lib/db/index.js';
import FilterBar from '../../components/faculty/FilterBar.js';
import FacultyCard from '../../components/faculty/FacultyCard.js';
import Button from '../../components/ui/Button.js';
import { CompassRose } from '../../components/layout/Brand.js';

const { db, schema } = dbModule;

export const metadata = {
  title: 'Facultăți',
  description:
    'Catalogul StudCompass: facultăți din toată România, cu recenzii de la studenți, costuri și date de admitere. Filtrează după oraș și domeniul de studiu.',
};

function firstParam(value) {
  return Array.isArray(value) ? value[0] : value;
}

function listParam(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  return value ? [value] : [];
}

function parseFilters(params) {
  return {
    city: firstParam(params.city) || '',
    domains: listParam(params.domain),
    multiCampus: firstParam(params.multiCampus) === '1',
  };
}

async function getCatalog(filters) {
  if (!db) {
    return null;
  }

  try {
    const conditions = [];
    if (filters.city) {
      conditions.push(eq(schema.faculties.city, filters.city));
    }
    if (filters.multiCampus) {
      conditions.push(eq(schema.faculties.multiCampus, true));
    }
    if (filters.domains.length > 0) {
      conditions.push(
        exists(
          db
            .select({ one: sql`1` })
            .from(schema.facultyDomains)
            .innerJoin(
              schema.domains,
              eq(schema.facultyDomains.domainId, schema.domains.id),
            )
            .where(
              and(
                eq(schema.facultyDomains.facultyId, schema.faculties.id),
                inArray(schema.domains.slug, filters.domains),
              ),
            ),
        ),
      );
    }

    const avgRating = sql`avg(${schema.reviews.rating}) filter (where ${schema.reviews.hiddenAt} is null)`;
    const reviewCount = sql`count(${schema.reviews.id}) filter (where ${schema.reviews.hiddenAt} is null)`;

    const rows = await db
      .select({
        id: schema.faculties.id,
        slug: schema.faculties.slug,
        name: schema.faculties.name,
        city: schema.faculties.city,
        coverUrl: schema.faculties.coverUrl,
        emblemUrl: schema.faculties.emblemUrl,
        multiCampus: schema.faculties.multiCampus,
        avgRating: avgRating.as('avg_rating'),
        reviewCount: reviewCount.as('review_count'),
      })
      .from(schema.faculties)
      .leftJoin(
        schema.reviews,
        eq(schema.reviews.facultyId, schema.faculties.id),
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(schema.faculties.id)
      .orderBy(
        sql`avg_rating desc nulls last`,
        sql`review_count desc`,
        schema.faculties.name,
      );

    /* Domain badges for the returned cards, one extra query. */
    const domainsByFaculty = new Map();
    if (rows.length > 0) {
      const links = await db
        .select({
          facultyId: schema.facultyDomains.facultyId,
          name: schema.domains.name,
        })
        .from(schema.facultyDomains)
        .innerJoin(
          schema.domains,
          eq(schema.facultyDomains.domainId, schema.domains.id),
        )
        .where(
          inArray(
            schema.facultyDomains.facultyId,
            rows.map((row) => row.id),
          ),
        )
        .orderBy(schema.domains.name);

      for (const link of links) {
        const list = domainsByFaculty.get(link.facultyId) || [];
        list.push(link.name);
        domainsByFaculty.set(link.facultyId, list);
      }
    }

    const [cityRows, domainRows] = await Promise.all([
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
      faculties: rows.map((row) => ({
        slug: row.slug,
        name: row.name,
        city: row.city,
        coverUrl: row.coverUrl,
        emblemUrl: row.emblemUrl,
        multiCampus: row.multiCampus,
        avgRating: row.avgRating == null ? null : Number(row.avgRating),
        reviewCount: row.reviewCount == null ? 0 : Number(row.reviewCount),
        domains: domainsByFaculty.get(row.id) || [],
      })),
      cities: cityRows.map((row) => row.city),
      domains: domainRows,
    };
  } catch {
    /* Unreachable database — fall back to the designed offline state. */
    return null;
  }
}

function ChapterHeader({ subtitle }) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="texture-doodle" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
      />
      <CompassRose className="pointer-events-none absolute -right-28 -top-24 hidden size-[22rem] text-primary/[0.08] lg:block dark:text-primary-soft/10" />

      <div className="wrap relative pb-12 pt-14 sm:pt-20">
        <p className="eyebrow animate-rise" style={{ animationDelay: '60ms' }}>
          Catalogul facultăților
        </p>
        <h1
          className="animate-rise mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl"
          style={{ animationDelay: '160ms' }}
        >
          Alege-ți{' '}
          <em className="wonky italic text-primary-strong dark:text-primary-soft">
            punctul de plecare
          </em>
          .
        </h1>
        <p
          className="animate-rise mt-5 max-w-xl text-pretty leading-relaxed text-text-muted sm:text-lg"
          style={{ animationDelay: '280ms' }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}

function OfflineState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-16 text-center sm:py-20">
      <CompassRose className="pointer-events-none absolute -bottom-24 -left-16 size-72 text-primary/[0.08] dark:text-primary-soft/10" />
      <CompassRose className="pointer-events-none absolute -right-20 -top-24 size-80 text-primary/[0.08] dark:text-primary-soft/10" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-display text-2xl font-semibold">
          Catalogul se desenează chiar acum.
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
          Harta facultăților nu e conectată momentan. Revino în curând — sau
          descoperă-ți direcția cu testul de carieră până atunci.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Button href="/account/personalityTest" variant="primary">
            Fă testul de carieră
          </Button>
          <Link
            href="/"
            className="text-sm font-semibold text-primary-strong underline-offset-4 transition-colors hover:underline dark:text-primary-soft"
          >
            sau întoarce-te acasă →
          </Link>
        </div>
      </div>
    </div>
  );
}

function NoResults() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-14 text-center sm:py-16">
      <CompassRose className="pointer-events-none absolute -right-20 -top-24 size-72 text-primary/[0.08] dark:text-primary-soft/10" />
      <div className="relative mx-auto max-w-md">
        <h2 className="font-display text-2xl font-semibold">
          Nimic în această zonă a hărții.
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
          Nicio facultate nu se potrivește cu filtrele alese. Lărgește puțin
          căutarea — drumul bun e uneori cu un oraș mai încolo.
        </p>
        <div className="mt-7">
          <Button href="/facultati" variant="ghost">
            Arată tot catalogul
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function FacultiesPage({ searchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const catalog = await getCatalog(filters);

  return (
    <>
      <ChapterHeader
        subtitle="Toate facultățile de pe hartă, cu recenzii sincere, costuri și date de admitere. Filtrează după oraș și domeniu — apoi pornește."
      />

      <section className="pb-24 sm:pb-28">
        <div className="wrap">
          {catalog ? (
            <>
              <FilterBar
                cities={catalog.cities}
                domains={catalog.domains}
                city={filters.city}
                selectedDomains={filters.domains}
                multiCampus={filters.multiCampus}
              />

              <p
                aria-live="polite"
                className="mt-6 text-sm font-medium text-text-muted"
              >
                {catalog.faculties.length === 0
                  ? 'Niciun reper găsit'
                  : catalog.faculties.length === 1
                    ? 'Un singur reper pe hartă'
                    : `${catalog.faculties.length} repere pe hartă`}
              </p>

              {catalog.faculties.length > 0 ? (
                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catalog.faculties.map((faculty) => (
                    <FacultyCard key={faculty.slug} faculty={faculty} />
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <NoResults />
                </div>
              )}
            </>
          ) : (
            <OfflineState />
          )}
        </div>
      </section>
    </>
  );
}
