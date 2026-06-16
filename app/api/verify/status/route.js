import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import dbModule from '../../../../lib/db/index.js';
import { verificationEmailSchema } from '../../../../lib/validate.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

function errorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
  if (!db) {
    return errorResponse('Baza de date nu este disponibilă', 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Corp JSON invalid', 400);
  }

  const parsed = verificationEmailSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Email invalid', 400);
  }

  const { email } = parsed.data;
  const [user] = await db
    .select({
      email: schema.users.email,
      emailVerified: schema.users.emailVerified,
    })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  return NextResponse.json(
    {
      ok: true,
      exists: Boolean(user),
      verified: Boolean(user?.emailVerified),
    },
    { status: 200 },
  );
}
