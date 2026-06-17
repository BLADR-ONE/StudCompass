import { asc, desc, eq } from 'drizzle-orm';
import dbModule from './db/index.js';

const { db, schema } = dbModule;

export const DEFAULT_HEADER_IMAGE = 'homeold.jpg';
export const HEADER_IMAGE_HISTORY_LIMIT = 4;

const HEADER_IMAGE_HISTORY_KEY = 'header_image_history';

function isDataUri(value) {
  return /^data:image\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/i.test(value);
}

function isPresetHeaderImage(value) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]*\.[A-Za-z0-9]+$/.test(value);
}

export function normalizeHeaderImage(value) {
  const image = String(value || '').trim();
  if (!image) {
    return DEFAULT_HEADER_IMAGE;
  }

  if (isDataUri(image) || isPresetHeaderImage(image)) {
    return image;
  }

  return DEFAULT_HEADER_IMAGE;
}

export function parseRecentHeaderImages(value) {
  if (!value) {
    return [];
  }

  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const seen = new Set();
  const images = [];
  for (const item of parsed) {
    const image = normalizeHeaderImage(item);
    if (seen.has(image)) {
      continue;
    }
    seen.add(image);
    images.push(image);
    if (images.length >= HEADER_IMAGE_HISTORY_LIMIT) {
      break;
    }
  }

  return images;
}

export function buildSiteSettings(rows) {
  const settings = {
    headerImage: DEFAULT_HEADER_IMAGE,
    recentHeaderImages: [DEFAULT_HEADER_IMAGE],
  };

  for (const row of rows) {
    if (row.key === 'header_image' && row.value) {
      settings.headerImage = normalizeHeaderImage(row.value);
    }

    if (row.key === HEADER_IMAGE_HISTORY_KEY && row.value) {
      settings.recentHeaderImages = parseRecentHeaderImages(row.value);
    }
  }

  if (!settings.recentHeaderImages.includes(settings.headerImage)) {
    settings.recentHeaderImages = [settings.headerImage, ...settings.recentHeaderImages];
  }

  settings.recentHeaderImages = [
    ...new Set(settings.recentHeaderImages.map((image) => normalizeHeaderImage(image))),
  ].slice(0, HEADER_IMAGE_HISTORY_LIMIT);

  if (settings.recentHeaderImages.length === 0) {
    settings.recentHeaderImages = [settings.headerImage];
  }

  return settings;
}

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

    const settings = buildSiteSettings(rows);
    return { headerImage: settings.headerImage };
  } catch {
    return fallback;
  }
}

export async function getSiteSettingsDetails() {
  const fallback = {
    headerImage: DEFAULT_HEADER_IMAGE,
    recentHeaderImages: [DEFAULT_HEADER_IMAGE],
  };

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

    return buildSiteSettings(rows);
  } catch {
    return fallback;
  }
}
