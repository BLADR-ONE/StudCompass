import { NextResponse } from 'next/server';
import { asc, desc, eq } from 'drizzle-orm';
import dbModule from '../../../../lib/db/index.js';
import {
  testimonialCreateSchema,
  testimonialReorderSchema,
} from '../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

function normalize(row) {
  return {
    id: row.id,
    authorName: row.authorName,
    authorRole: row.authorRole,
    body: row.body,
    sortOrder: row.sortOrder,
    published: Boolean(row.published),
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
  };
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
      id: schema.testimonials.id,
      authorName: schema.testimonials.authorName,
      authorRole: schema.testimonials.authorRole,
      body: schema.testimonials.body,
      sortOrder: schema.testimonials.sortOrder,
      published: schema.testimonials.published,
      createdAt: schema.testimonials.createdAt,
    })
    .from(schema.testimonials)
    .orderBy(asc(schema.testimonials.sortOrder), desc(schema.testimonials.createdAt));

  return NextResponse.json(
    {
      ok: true,
      testimonials: rows.map(normalize),
    },
    { status: 200 },
  );
}

export async function POST(request) {
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

  const parsed = testimonialCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const [created] = await db
    .insert(schema.testimonials)
    .values({
      authorName: parsed.data.authorName,
      authorRole: parsed.data.authorRole,
      body: parsed.data.body,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    })
    .returning({
      id: schema.testimonials.id,
      authorName: schema.testimonials.authorName,
      authorRole: schema.testimonials.authorRole,
      body: schema.testimonials.body,
      sortOrder: schema.testimonials.sortOrder,
      published: schema.testimonials.published,
      createdAt: schema.testimonials.createdAt,
    });

  return NextResponse.json(
    {
      ok: true,
      testimonial: normalize(created),
    },
    { status: 201 },
  );
}

export async function PATCH(request) {
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

  const parsed = testimonialReorderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const updated = [];
  for (const item of parsed.data.items) {
    const [row] = await db
      .update(schema.testimonials)
      .set({ sortOrder: item.sortOrder })
      .where(eq(schema.testimonials.id, item.id))
      .returning({
        id: schema.testimonials.id,
        authorName: schema.testimonials.authorName,
        authorRole: schema.testimonials.authorRole,
        body: schema.testimonials.body,
        sortOrder: schema.testimonials.sortOrder,
        published: schema.testimonials.published,
        createdAt: schema.testimonials.createdAt,
      });

    if (!row) {
      return jsonError('Testimonial negăsit', 404);
    }

    updated.push(normalize(row));
  }

  return NextResponse.json(
    {
      ok: true,
      testimonials: updated,
    },
    { status: 200 },
  );
}
