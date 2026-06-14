import { eq, sql } from 'drizzle-orm';
import dbModule from '../lib/db/index.js';
import Hero from '../components/home/Hero.js';
import HowItWorks from '../components/home/HowItWorks.js';
import FeaturedFaculties from '../components/home/FeaturedFaculties.js';
import TestimonialBand from '../components/home/TestimonialBand.js';
import CtaBand from '../components/home/CtaBand.js';
import PageViewTracker from '../components/home/PageViewTracker.js';

const { db, schema } = dbModule;

/* Refresh the featured list periodically once a database is configured. */
export const revalidate = 300;

async function getFeaturedFaculties() {
  if (!db) {
    return [];
  }

  const avgRating = sql`avg(${schema.reviews.rating}) filter (where ${schema.reviews.hiddenAt} is null)`;
  const reviewCount = sql`count(${schema.reviews.id}) filter (where ${schema.reviews.hiddenAt} is null)`;

  try {
    const rows = await db
      .select({
        slug: schema.faculties.slug,
        name: schema.faculties.name,
        city: schema.faculties.city,
        coverUrl: schema.faculties.coverUrl,
        emblemUrl: schema.faculties.emblemUrl,
        avgRating: avgRating.as('avg_rating'),
        reviewCount: reviewCount.as('review_count'),
      })
      .from(schema.faculties)
      .leftJoin(
        schema.reviews,
        eq(schema.reviews.facultyId, schema.faculties.id),
      )
      .groupBy(schema.faculties.id)
      .orderBy(
        sql`avg_rating desc nulls last`,
        sql`review_count desc`,
        schema.faculties.name,
      )
      .limit(4);

    return rows.map((row) => ({
      ...row,
      avgRating: row.avgRating == null ? null : Number(row.avgRating),
      reviewCount: row.reviewCount == null ? 0 : Number(row.reviewCount),
    }));
  } catch {
    /* Unreachable database — the empty state invites exploration instead. */
    return [];
  }
}

export default async function HomePage() {
  const faculties = await getFeaturedFaculties();

  return (
    <>
      <PageViewTracker />
      <Hero />
      <HowItWorks />
      <FeaturedFaculties faculties={faculties} />
      <TestimonialBand />
      <CtaBand />
    </>
  );
}
