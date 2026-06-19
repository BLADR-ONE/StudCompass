import { NextResponse } from 'next/server';
import dbModule from '../../../../lib/db/index.js';
import { siteSettingsSchema } from '../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';
import {
  HEADER_IMAGE_HISTORY_LIMIT,
  HEADER_IMAGE_PAGE_CONFIGS,
  getDefaultHeaderImage,
  normalizeHeaderImage,
} from '../../../../lib/site-constants.js';
import { getSiteSettings } from '../../../../lib/content.js';

const { db, schema } = dbModule;
const HEADER_IMAGE_PAGE_SLUGS = HEADER_IMAGE_PAGE_CONFIGS.map(({ slug }) => slug);
const HEADER_IMAGE_KEY = 'header_image';
const HEADER_IMAGES_KEY = 'header_images';
const HEADER_IMAGE_HISTORY_KEY = 'header_image_history';
const HEADER_IMAGE_HISTORIES_KEY = 'header_image_histories';

export const runtime = 'nodejs';

function normalizeRecentImages(current, recent, fallbackImage) {
  const images = [
    current,
    ...(Array.isArray(recent) ? recent : []),
  ].map((value) => normalizeHeaderImage(value, fallbackImage));

  const unique = [...new Set(images)].slice(0, HEADER_IMAGE_HISTORY_LIMIT);
  return unique.length > 0 ? unique : [current];
}

export async function GET() {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  const settings = await getSiteSettings();

  return NextResponse.json(
    {
      ok: true,
      settings,
    },
    { status: 200 },
  );
}

export async function PUT(request) {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Corp JSON invalid', 400);
  }

  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const currentSettings = await getSiteSettings();
  const nextHeaderImages = {
    ...(currentSettings.headerImages || {}),
  };
  const nextRecentHeaderImagesByPage = {
    ...(currentSettings.recentHeaderImagesByPage || {}),
  };

  const requestedImages =
    parsed.data.headerImage !== undefined
      ? {
          home: parsed.data.headerImage,
          ...(parsed.data.headerImages || {}),
        }
      : {
          ...(parsed.data.headerImages || {}),
        };

  for (const slug of HEADER_IMAGE_PAGE_SLUGS) {
    const fallbackImage = getDefaultHeaderImage(slug);
    const sourceImage =
      requestedImages[slug] !== undefined
        ? requestedImages[slug]
        : currentSettings.headerImages?.[slug];
    const image = normalizeHeaderImage(sourceImage, fallbackImage);
    nextHeaderImages[slug] = image;
    nextRecentHeaderImagesByPage[slug] = normalizeRecentImages(
      image,
      currentSettings.recentHeaderImagesByPage?.[slug],
      fallbackImage,
    );
  }

  const headerImage = nextHeaderImages.home || getDefaultHeaderImage('home');
  const recentHeaderImages = nextRecentHeaderImagesByPage.home || [
    headerImage,
  ];
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(schema.siteSettings)
        .values({
          key: HEADER_IMAGE_KEY,
          value: headerImage,
        })
        .onConflictDoUpdate({
          target: schema.siteSettings.key,
          set: {
            value: headerImage,
            updatedAt: new Date(),
          },
        });

      await tx
        .insert(schema.siteSettings)
        .values({
          key: HEADER_IMAGE_HISTORY_KEY,
          value: JSON.stringify(recentHeaderImages),
        })
        .onConflictDoUpdate({
          target: schema.siteSettings.key,
          set: {
            value: JSON.stringify(recentHeaderImages),
            updatedAt: new Date(),
          },
        });

      await tx
        .insert(schema.siteSettings)
        .values({
          key: HEADER_IMAGES_KEY,
          value: JSON.stringify(nextHeaderImages),
        })
        .onConflictDoUpdate({
          target: schema.siteSettings.key,
          set: {
            value: JSON.stringify(nextHeaderImages),
            updatedAt: new Date(),
          },
        });

      await tx
        .insert(schema.siteSettings)
        .values({
          key: HEADER_IMAGE_HISTORIES_KEY,
          value: JSON.stringify(nextRecentHeaderImagesByPage),
        })
        .onConflictDoUpdate({
          target: schema.siteSettings.key,
          set: {
            value: JSON.stringify(nextRecentHeaderImagesByPage),
            updatedAt: new Date(),
          },
        });
    });
  } catch {
    return jsonError('Eroare la salvarea setărilor', 500);
  }

  return NextResponse.json(
    {
      ok: true,
      settings: {
        headerImage,
        headerImages: nextHeaderImages,
        recentHeaderImages,
        recentHeaderImagesByPage: nextRecentHeaderImagesByPage,
      },
    },
    { status: 200 },
  );
}
