import { NextResponse } from 'next/server';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { auth } from '../../../lib/auth.js';
import dbModule from '../../../lib/db/index.js';
import { facultySlugSchema, reviewUpsertSchema } from '../../../lib/validate.js';

const { db, schema } = dbModule;

function errorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

async function getFaculty(slug) {
  const [faculty] = await db
    .select({ id: schema.faculties.id })
    .from(schema.faculties)
    .where(eq(schema.faculties.slug, slug))
    .limit(1);

  return faculty || null;
}

function normalizeBody(body) {
  return body.length > 0 ? body : null;
}

function mapReview(row) {
  return {
    id: row.id,
    authorName: row.authorName || 'Anonim',
    rating: row.rating,
    body: row.body,
    createdAt: row.createdAt,
  };
}

export async function GET(request) {
  if (!db) {
    return errorResponse('Database unavailable', 503);
  }

  const { searchParams } = new URL(request.url);
  const parsedSlug = facultySlugSchema.safeParse(searchParams.get('faculty'));
  const rawOffset = searchParams.get('offset') ?? searchParams.get('cursor');
  let offset = 0;

  if (!parsedSlug.success) {
    return errorResponse('Validation error', 400);
  }

  if (rawOffset != null) {
    const parsedOffset = Number.parseInt(rawOffset, 10);
    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return errorResponse('Validation error', 400);
    }
    offset = parsedOffset;
  }

  try {
    const faculty = await getFaculty(parsedSlug.data);
    if (!faculty) {
      return errorResponse('Faculty not found', 404);
    }

    const filter = and(
      eq(schema.reviews.facultyId, faculty.id),
      isNull(schema.reviews.hiddenAt),
    );

    const [stats] = await db
      .select({
        count: sql`count(*)::int`,
        avg: sql`coalesce(avg(${schema.reviews.rating}), 0)`,
      })
      .from(schema.reviews)
      .where(filter);

    const rows = await db
      .select({
        id: schema.reviews.id,
        rating: schema.reviews.rating,
        body: schema.reviews.body,
        createdAt: schema.reviews.createdAt,
        authorName: schema.users.name,
      })
      .from(schema.reviews)
      .innerJoin(schema.users, eq(schema.reviews.userId, schema.users.id))
      .where(filter)
      .orderBy(desc(schema.reviews.createdAt))
      .limit(50)
      .offset(offset);

    return NextResponse.json(
      {
        reviews: rows.map(mapReview),
        avg: Number(stats?.avg || 0),
        count: Number(stats?.count || 0),
      },
      { status: 200 },
    );
  } catch {
    return errorResponse('Eroare la încărcarea recenziilor', 500);
  }
}

export async function POST(request) {
  if (!db) {
    return errorResponse('Database unavailable', 503);
  }

  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse('Unauthorized', 401);
  }
  if (session.user.banned) {
    return errorResponse('Banned users cannot modify content', 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const parsed = reviewUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Validation error', 400);
  }

  const { faculty: facultySlug, rating, body: reviewBody } = parsed.data;
  try {
    const faculty = await getFaculty(facultySlug);
    if (!faculty) {
      return errorResponse('Faculty not found', 404);
    }

    await db
      .insert(schema.reviews)
      .values({
        facultyId: faculty.id,
        userId: session.user.id,
        rating,
        body: normalizeBody(reviewBody),
        hiddenAt: null,
      })
      .onConflictDoUpdate({
        target: [schema.reviews.facultyId, schema.reviews.userId],
        set: {
          rating,
          body: normalizeBody(reviewBody),
          hiddenAt: null,
        },
      });
  } catch {
    return errorResponse('Eroare la salvarea recenziei', 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
