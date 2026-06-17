import { NextResponse } from 'next/server';
import dbModule from '../../../../lib/db/index.js';
import { siteSettingsSchema } from '../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';
import {
  getSiteSettingsDetails,
} from '../../../../lib/content.js';
import {
  HEADER_IMAGE_HISTORY_LIMIT,
  normalizeHeaderImage,
} from '../../../../lib/site-constants.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

export async function GET() {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  const settings = await getSiteSettingsDetails();

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

  const headerImage = normalizeHeaderImage(parsed.data.headerImage);
  const currentSettings = await getSiteSettingsDetails();
  const recentHeaderImages = [
    headerImage,
    ...(currentSettings.recentHeaderImages || []),
  ]
    .map((value) => normalizeHeaderImage(value))
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, HEADER_IMAGE_HISTORY_LIMIT);

  await db.transaction(async (tx) => {
    await tx
      .insert(schema.siteSettings)
      .values({
        key: 'header_image',
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
        key: 'header_image_history',
        value: JSON.stringify(recentHeaderImages),
      })
      .onConflictDoUpdate({
        target: schema.siteSettings.key,
        set: {
          value: JSON.stringify(recentHeaderImages),
          updatedAt: new Date(),
        },
      });
  });

  return NextResponse.json(
    {
      ok: true,
      settings: {
        headerImage,
        recentHeaderImages,
      },
    },
    { status: 200 },
  );
}
