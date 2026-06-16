import { asc, desc, eq } from 'drizzle-orm';
import dbModule from './db/index.js';

const { db, schema } = dbModule;

export const DEFAULT_HEADER_IMAGE = 'homeold.jpg';

export async function getPublishedTestimonials(limit = 6) {
  if (!db) {
    return [];
  }

  try {
    const rows = await db
      .select({
        id: schema.testimonials.id,
        authorName: schema.testimonials.authorName,
        authorRole: schema.testimonials.authorRole,
        body: schema.testimonials.body,
        sortOrder: schema.testimonials.sortOrder,
        createdAt: schema.testimonials.createdAt,
      })
      .from(schema.testimonials)
      .where(eq(schema.testimonials.published, true))
      .orderBy(asc(schema.testimonials.sortOrder), desc(schema.testimonials.createdAt))
      .limit(limit);

    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    }));
  } catch {
    return [];
  }
}

export async function getSiteSettings() {
  const fallback = { headerImage: DEFAULT_HEADER_IMAGE };

  if (!db) {
    return fallback;
  }

  try {
    const rows = await db
      .select({
        key: schema.siteSettings.key,
        value: schema.siteSettings.value,
      })
      .from(schema.siteSettings);

    const settings = { ...fallback };
    for (const row of rows) {
      if (row.key === 'header_image' && row.value) {
        settings.headerImage = row.value;
      }
    }

    return settings;
  } catch {
    return fallback;
  }
}
