import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '../../../../lib/auth.js';
import dbModule from '../../../../lib/db/index.js';
import { moderateSchema } from '../../../../lib/validate.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

function errorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

async function updateById(table, idColumn, id, values) {
  const [updated] = await db
    .update(table)
    .set(values)
    .where(eq(idColumn, id))
    .returning({ id: idColumn });

  return updated || null;
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
  if (session.user.role !== 'admin') {
    return errorResponse('Forbidden', 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  const parsed = moderateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Validation error', 400);
  }

  const { action, id } = parsed.data;

  let updated = null;
  switch (action) {
    case 'hide_review':
      updated = await updateById(schema.reviews, schema.reviews.id, id, {
        hiddenAt: new Date(),
      });
      break;
    case 'unhide_review':
      updated = await updateById(schema.reviews, schema.reviews.id, id, {
        hiddenAt: null,
      });
      break;
    case 'hide_message':
      updated = await updateById(schema.messages, schema.messages.id, id, {
        hiddenAt: new Date(),
      });
      break;
    case 'unhide_message':
      updated = await updateById(schema.messages, schema.messages.id, id, {
        hiddenAt: null,
      });
      break;
    case 'ban_user':
      updated = await updateById(schema.users, schema.users.id, id, {
        bannedAt: new Date(),
      });
      break;
    case 'unban_user':
      updated = await updateById(schema.users, schema.users.id, id, {
        bannedAt: null,
      });
      break;
    default:
      return errorResponse('Validation error', 400);
  }

  if (!updated) {
    return errorResponse('Not found', 404);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
