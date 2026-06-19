import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import dbModule from '../../../../lib/db/index.js';
import { verificationEmailSchema } from '../../../../lib/validate.js';
import { sendAccountVerificationEmail } from '../../../../lib/verification.js';

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
  let user;
  try {
    [user] = await db
      .select({
        email: schema.users.email,
        name: schema.users.name,
        emailVerified: schema.users.emailVerified,
      })
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
  } catch {
    return errorResponse('Nu am putut procesa cererea. Încearcă mai târziu.', 500);
  }

  if (!user) {
    console.warn('[verify/resend] Account not found for email:', email);
    return NextResponse.json(
      {
        ok: true,
        verificationEmailSent: true,
        message: 'Am retrimis emailul de verificare.',
      },
      { status: 200 },
    );
  }

  if (user.emailVerified) {
    return NextResponse.json(
      {
        ok: true,
        alreadyVerified: true,
        message: 'Adresa este deja verificată.',
      },
      { status: 200 },
    );
  }

  let verification;
  try {
    verification = await sendAccountVerificationEmail({
      email: user.email,
      name: user.name || '',
    });
  } catch {
    return errorResponse(
      'Nu am putut retrimite emailul de verificare. Încearcă din nou puțin mai târziu.',
      503,
    );
  }

  if (!verification.ok) {
    return errorResponse(
      'Nu am putut retrimite emailul de verificare. Încearcă din nou puțin mai târziu.',
      503,
    );
  }

  return NextResponse.json(
    {
      ok: true,
      verificationEmailSent: true,
      message: 'Am retrimis emailul de verificare.',
    },
    { status: 200 },
  );
}
