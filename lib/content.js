import { asc, desc, eq } from 'drizzle-orm';
import {
  DEFAULT_HEADER_IMAGE,
  HEADER_IMAGE_HISTORY_LIMIT,
  HEADER_IMAGE_PAGE_CONFIGS,
  getDefaultHeaderImage,
  normalizeHeaderImage,
} from './site-constants.js';
import dbModule from './db/index.js';

const { db, schema } = dbModule;

const HEADER_IMAGE_KEY = 'header_image';
const HEADER_IMAGES_KEY = 'header_images';
const HEADER_IMAGE_HISTORY_KEY = 'header_image_history';
const HEADER_IMAGE_HISTORIES_KEY = 'header_image_histories';

export { DEFAULT_HEADER_IMAGE, HEADER_IMAGE_HISTORY_LIMIT, normalizeHeaderImage };

function createDefaultHeaderImageMap() {
  return Object.fromEntries(
    HEADER_IMAGE_PAGE_CONFIGS.map(({ slug }) => [slug, getDefaultHeaderImage(slug)]),
  );
}

function createDefaultRecentHeaderImagesMap() {
  return Object.fromEntries(
    HEADER_IMAGE_PAGE_CONFIGS.map(({ slug }) => [slug, [getDefaultHeaderImage(slug)]]),
  );
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

function parseHeaderImageMap(value) {
  if (!value) {
    return {};
  }

  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {};
  }

  const images = {};
  for (const { slug } of HEADER_IMAGE_PAGE_CONFIGS) {
    if (parsed[slug] == null) {
      continue;
    }
    images[slug] = normalizeHeaderImage(parsed[slug], getDefaultHeaderImage(slug));
  }

  return images;
}

function parseRecentHeaderImagesMap(value) {
  if (!value) {
    return {};
  }

  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {};
  }

  const histories = {};
  for (const { slug } of HEADER_IMAGE_PAGE_CONFIGS) {
    if (!Array.isArray(parsed[slug])) {
      continue;
    }
    histories[slug] = parseRecentHeaderImages(parsed[slug]);
  }

  return histories;
}

export function buildSiteSettings(rows) {
  const settings = {
    headerImage: DEFAULT_HEADER_IMAGE,
    headerImages: createDefaultHeaderImageMap(),
    recentHeaderImages: [DEFAULT_HEADER_IMAGE],
    recentHeaderImagesByPage: createDefaultRecentHeaderImagesMap(),
  };
  let hasLegacyHomeHistory = false;
  let hasPageHistories = false;

  for (const row of rows) {
    if (row.key === HEADER_IMAGE_KEY && row.value) {
      const image = normalizeHeaderImage(row.value, getDefaultHeaderImage('home'));
      settings.headerImages.home = image;
      settings.headerImage = image;
    }

    if (row.key === HEADER_IMAGES_KEY && row.value) {
      settings.headerImages = {
        ...settings.headerImages,
        ...parseHeaderImageMap(row.value),
      };
    }

    if (row.key === HEADER_IMAGE_HISTORY_KEY && row.value) {
      settings.recentHeaderImages = parseRecentHeaderImages(row.value);
      hasLegacyHomeHistory = true;
    }

    if (row.key === HEADER_IMAGE_HISTORIES_KEY && row.value) {
      settings.recentHeaderImagesByPage = {
        ...settings.recentHeaderImagesByPage,
        ...parseRecentHeaderImagesMap(row.value),
      };
      hasPageHistories = true;
    }
  }

  if (hasLegacyHomeHistory && !hasPageHistories) {
    settings.recentHeaderImagesByPage.home = settings.recentHeaderImages;
  }

  for (const { slug } of HEADER_IMAGE_PAGE_CONFIGS) {
    const fallbackImage = getDefaultHeaderImage(slug);
    const currentImage = normalizeHeaderImage(
      settings.headerImages[slug],
      fallbackImage,
    );
    settings.headerImages[slug] = currentImage;

    const existingRecent = settings.recentHeaderImagesByPage[slug];
    const recentImages = Array.isArray(existingRecent) ? existingRecent : [];
    const normalizedRecent = [
      currentImage,
      ...recentImages.map((image) => normalizeHeaderImage(image, fallbackImage)),
    ];

    settings.recentHeaderImagesByPage[slug] = [
      ...new Set(normalizedRecent),
    ].slice(0, HEADER_IMAGE_HISTORY_LIMIT);

    if (settings.recentHeaderImagesByPage[slug].length === 0) {
      settings.recentHeaderImagesByPage[slug] = [currentImage];
    }
  }

  settings.headerImage = settings.headerImages.home;
  settings.recentHeaderImages = settings.recentHeaderImagesByPage.home;

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
  const fallback = buildSiteSettings([]);

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

export async function getSiteSettingsDetails() {
  const fallback = buildSiteSettings([]);

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
