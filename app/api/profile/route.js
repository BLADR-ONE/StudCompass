import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '../../../lib/auth.js';
import dbModule from '../../../lib/db/index.js';
import { profileSchema } from '../../../lib/validate.js';

const { db, schema } = dbModule;

function errorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function PUT(request) {
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

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Validation error', 400);
  }

  const [updated] = await db
    .update(schema.users)
    .set({
      name: parsed.data.name,
    })
    .where(eq(schema.users.id, session.user.id))
    .returning({ id: schema.users.id });

  if (!updated) {
    return errorResponse('User not found', 404);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
