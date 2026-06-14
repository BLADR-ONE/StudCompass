import { Filter } from 'bad-words';
import { NextResponse } from 'next/server';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { auth } from '../../../lib/auth.js';
import dbModule from '../../../lib/db/index.js';
import { messageCreateSchema, facultySlugSchema } from '../../../lib/validate.js';

const { db, schema } = dbModule;
const profanityFilter = new Filter();

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

function mapMessage(row) {
  return {
    id: row.id,
    authorName: row.authorName || 'Anonim',
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

  if (!parsedSlug.success) {
    return errorResponse('Validation error', 400);
  }

  const faculty = await getFaculty(parsedSlug.data);
  if (!faculty) {
    return errorResponse('Faculty not found', 404);
  }

  const rows = await db
    .select({
      id: schema.messages.id,
      body: schema.messages.body,
      createdAt: schema.messages.createdAt,
      authorName: schema.users.name,
    })
    .from(schema.messages)
    .innerJoin(schema.users, eq(schema.messages.userId, schema.users.id))
    .where(
      and(
        eq(schema.messages.facultyId, faculty.id),
        isNull(schema.messages.hiddenAt),
      ),
    )
    .orderBy(desc(schema.messages.createdAt))
    .limit(100);

  return NextResponse.json(
    {
      messages: rows.map(mapMessage),
    },
    { status: 200 },
  );
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

  const parsed = messageCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Validation error', 400);
  }

  const faculty = await getFaculty(parsed.data.faculty);
  if (!faculty) {
    return errorResponse('Faculty not found', 404);
  }

  const cleanBody = profanityFilter.clean(parsed.data.body);

  await db.insert(schema.messages).values({
    facultyId: faculty.id,
    userId: session.user.id,
    body: cleanBody,
    hiddenAt: null,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
