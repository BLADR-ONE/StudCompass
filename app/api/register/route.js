import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import dbModule from '../../../lib/db/index.js';
import { registerSchema } from '../../../lib/validate.js';
import { isUniqueViolation } from '../../../lib/db-errors.js';
import { sendAccountVerificationEmail, sendExistingAccountNotice } from '../../../lib/verification.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

export async function POST(request) {
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation error' }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.insert(schema.users).values({
      name,
      email,
      passwordHash,
      role: 'user',
    });
  } catch (error) {
    if (isUniqueViolation(error, 'users_email')) {
      // Do NOT return 409 — that leaks whether this email is registered.
      // Instead, send a quiet "you already have an account" notice so a real
      // user who forgot they're registered gets feedback, then return the same
      // 201 shape as a real new registration so attackers can't probe the DB.
      let notice;
      try {
        notice = await sendExistingAccountNotice({ email });
      } catch {
        notice = { ok: false, error: 'email_send_failed' };
      }
      return NextResponse.json(
        {
          ok: true,
          verificationEmailSent: notice.ok,
          verificationError: notice.ok ? null : notice.error,
        },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { error: 'Nu am putut crea contul. Încearcă din nou mai târziu.' },
      { status: 500 },
    );
  }

  let verification;
  try {
    verification = await sendAccountVerificationEmail({ email, name });
  } catch {
    verification = { ok: false, error: 'email_send_failed' };
  }

  return NextResponse.json(
    {
      ok: true,
      verificationEmailSent: verification.ok,
      verificationError: verification.ok ? null : verification.error,
    },
    { status: 201 },
  );
}
