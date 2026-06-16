import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import dbModule from '../../../../../lib/db/index.js';
import { testimonialUpdateSchema } from '../../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../../lib/admin.js';

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

async function updateTestimonial(id, values) {
  const [row] = await db
    .update(schema.testimonials)
    .set(values)
    .where(eq(schema.testimonials.id, id))
    .returning({
      id: schema.testimonials.id,
      authorName: schema.testimonials.authorName,
      authorRole: schema.testimonials.authorRole,
      body: schema.testimonials.body,
      sortOrder: schema.testimonials.sortOrder,
      published: schema.testimonials.published,
      createdAt: schema.testimonials.createdAt,
    });

  return row || null;
}

export async function PATCH(request, { params }) {
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

  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success || parsed.data.id !== params.id) {
    return jsonError('Date invalide', 400);
  }

  const values = {};
  if (parsed.data.authorName !== undefined) {
    values.authorName = parsed.data.authorName;
  }
  if (parsed.data.authorRole !== undefined) {
    values.authorRole = parsed.data.authorRole;
  }
  if (parsed.data.body !== undefined) {
    values.body = parsed.data.body;
  }
  if (parsed.data.sortOrder !== undefined) {
    values.sortOrder = parsed.data.sortOrder;
  }
  if (parsed.data.published !== undefined) {
    values.published = parsed.data.published;
  }

  if (Object.keys(values).length === 0) {
    return jsonError('Date invalide', 400);
  }

  const row = await updateTestimonial(params.id, values);
  if (!row) {
    return jsonError('Testimonial negăsit', 404);
  }

  return NextResponse.json(
    {
      ok: true,
      testimonial: normalize(row),
    },
    { status: 200 },
  );
}

export async function DELETE(_request, { params }) {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  const [row] = await db
    .delete(schema.testimonials)
    .where(eq(schema.testimonials.id, params.id))
    .returning({ id: schema.testimonials.id });

  if (!row) {
    return jsonError('Testimonial negăsit', 404);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
