import { NextResponse } from 'next/server';
import dbModule from '../../../../lib/db/index.js';
import { siteSettingsSchema } from '../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';
import { DEFAULT_HEADER_IMAGE } from '../../../../lib/content.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

function normalizeSettings(rows) {
  const settings = { headerImage: DEFAULT_HEADER_IMAGE };
  for (const row of rows) {
    if (row.key === 'header_image' && row.value) {
      settings.headerImage = row.value;
    }
  }
  return settings;
}

export async function GET() {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  const rows = await db
    .select({
      key: schema.siteSettings.key,
      value: schema.siteSettings.value,
      updatedAt: schema.siteSettings.updatedAt,
    })
    .from(schema.siteSettings);

  return NextResponse.json(
    {
      ok: true,
      settings: normalizeSettings(rows),
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

  const headerImage = parsed.data.headerImage;

  const [row] = await db
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
    })
    .returning({
      key: schema.siteSettings.key,
      value: schema.siteSettings.value,
      updatedAt: schema.siteSettings.updatedAt,
    });

  return NextResponse.json(
    {
      ok: true,
      settings: normalizeSettings([row]),
    },
    { status: 200 },
  );
}
