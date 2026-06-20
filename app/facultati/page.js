import Link from 'next/link';
import { and, eq, exists, ilike, inArray, sql } from 'drizzle-orm';
import dbModule from '../../lib/db/index.js';
import FilterBar from '../../components/faculty/FilterBar.js';
import FacultyCard from '../../components/faculty/FacultyCard.js';
import Button from '../../components/ui/Button.js';
import Reveal from '../../components/ui/Reveal.js';
import { WaypointGrid, Astrolabe, Sextant } from '../../components/layout/Brand.js';
import MotifScroll from '../../components/ui/MotifScroll.js';
import ChapterHeader from '../../components/layout/ChapterHeader.js';

const { db, schema } = dbModule;

export const metadata = {
  title: 'Facultăți',
  description:
    'Catalogul StudCompass: facultăți din toată România, cu recenzii de la studenți, costuri și date de admitere. Filtrează după oraș, domeniu și nume.',
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
    search: firstParam(params.search) || '',
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
    if (filters.search.trim()) {
      conditions.push(ilike(schema.faculties.name, `%${filters.search.trim()}%`));
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

function OfflineState() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border-2 border-dashed border-primary-soft/40 px-6 py-16 text-center sm:py-20">
      <WaypointGrid className="pointer-events-none absolute -bottom-20 -left-16 size-72 text-primary/[0.13] dark:text-primary-soft/[0.14]" />
      <MotifScroll
        effect="rotate"
        speed={1.1}
        className="pointer-events-none absolute -right-20 -top-24 size-80 text-primary/[0.12] dark:text-primary-soft/[0.14]"
      >
        <Astrolabe className="size-full" />
      </MotifScroll>
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
      <WaypointGrid className="pointer-events-none absolute -right-20 -top-24 size-72 text-primary/[0.13] dark:text-primary-soft/[0.14]" />
      <MotifScroll
        effect="rotate-rev"
        speed={0.9}
        className="pointer-events-none absolute -bottom-16 -left-16 size-64 text-primary/[0.12] dark:text-primary-soft/[0.13]"
      >
        <Sextant className="size-full" />
      </MotifScroll>
      <div className="relative mx-auto max-w-md">
        <h2 className="font-display text-2xl font-semibold">
          Nimic în această zonă a hărții.
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-text-muted">
          Nicio facultate nu se potrivește cu căutarea și filtrele alese.
          Lărgește puțin căutarea — drumul bun e uneori cu un oraș mai încolo.
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
        bold
        eyebrow="Catalogul facultăților"
        title={
          <>
            Alege-ți{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              punctul de plecare
            </em>
            .
          </>
        }
        subtitle="Toate facultățile de pe hartă, cu recenzii sincere, costuri și date de admitere. Filtrează după oraș, domeniu și nume — apoi pornește."
        heroMode
      />

      <section className="pb-24 pt-12 sm:pb-28 sm:pt-14">
        <div className="wrap">
          {catalog ? (
            <>
              <FilterBar
                cities={catalog.cities}
                domains={catalog.domains}
                city={filters.city}
                search={filters.search}
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
                <Reveal
                  stagger
                  className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {catalog.faculties.map((faculty) => (
                    <FacultyCard key={faculty.slug} faculty={faculty} />
                  ))}
                </Reveal>
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
