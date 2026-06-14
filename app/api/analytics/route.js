import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import dbModule from '../../../lib/db/index.js';

const { db, schema } = dbModule;

const analyticsSchema = z.object({
  eventType: z.enum(['page_view', 'card_click', 'cta_click', 'test_completed']),
  faculty: z.string().trim().min(1).max(120).optional(),
  visitorId: z.string().trim().min(8).max(120),
});

export async function POST(request) {
  if (!db) {
    return NextResponse.json(
      { error: 'Database unavailable' },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = analyticsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation error' }, { status: 400 });
  }

  const { eventType, faculty, visitorId } = parsed.data;

  let facultyId = null;
  if (faculty) {
    const [facultyRow] = await db
      .select({ id: schema.faculties.id })
      .from(schema.faculties)
      .where(eq(schema.faculties.slug, faculty))
      .limit(1);
    facultyId = facultyRow?.id || null;
  }

  await db.insert(schema.analyticsEvents).values({
    eventType,
    facultyId,
    visitorId,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
