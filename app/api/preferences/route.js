import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '../../../lib/auth.js';
import dbModule from '../../../lib/db/index.js';
import { preferencesSchema } from '../../../lib/validate.js';

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

  const parsed = preferencesSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Validation error', 400);
  }

  const [user] = await db
    .select({ preferences: schema.users.preferences })
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);

  if (!user) {
    return errorResponse('User not found', 404);
  }

  const nextPreferences = {
    ...(user.preferences || {}),
    ...(parsed.data.city !== undefined ? { city: parsed.data.city } : {}),
    ...(parsed.data.domains !== undefined
      ? { domains: parsed.data.domains }
      : {}),
  };

  await db
    .update(schema.users)
    .set({
      preferences: nextPreferences,
    })
    .where(eq(schema.users.id, session.user.id));

  return NextResponse.json({ ok: true }, { status: 200 });
}
