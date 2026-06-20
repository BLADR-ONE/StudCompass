import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import dbModule from './db/index.js';
import { sendVerificationEmail, sendExistingAccountEmail } from './email.js';

const { db, schema } = dbModule;

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getExpiresAt() {
  return new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
}

function createTokenValue() {
  return crypto.randomBytes(32).toString('hex');
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export async function createVerificationToken(email) {
  if (!db) {
    return { ok: false, error: 'database_unavailable' };
  }

  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { ok: false, error: 'invalid_email' };
  }

  const token = createTokenValue();
  const expires = getExpiresAt();

  await db
    .insert(schema.verificationTokens)
    .values({
      identifier: normalizedEmail,
      token,
      expires,
    })
    .onConflictDoUpdate({
      target: schema.verificationTokens.identifier,
      set: {
        token,
        expires,
      },
    });

  return {
    ok: true,
    token,
    expires,
  };
}

export async function sendAccountVerificationEmail({ email, name }) {
  const tokenResult = await createVerificationToken(email);
  if (!tokenResult.ok) {
    return tokenResult;
  }

  const emailResult = await sendVerificationEmail({
    to: normalizeEmail(email),
    name,
    token: tokenResult.token,
  });

  if (!emailResult.ok) {
    return {
      ok: false,
      error: emailResult.error,
      token: tokenResult.token,
      expires: tokenResult.expires,
    };
  }

  return {
    ok: true,
    token: tokenResult.token,
    expires: tokenResult.expires,
  };
}

/**
 * Sends a generic "you already have an account" notice to the given email.
 * Used by /api/register to avoid leaking whether an email is registered
 * (the route returns 201 either way; the real owner gets this quiet nudge).
 * Does NOT include name, role, or any detail that reveals account state.
 */
export async function sendExistingAccountNotice({ email }) {
  const emailResult = await sendExistingAccountEmail({
    to: normalizeEmail(email),
  });

  return emailResult;
}

export async function verifyEmailToken(token) {
  if (!db) {
    return { ok: false, error: 'database_unavailable' };
  }

  const normalizedToken = String(token || '').trim();
  if (!normalizedToken) {
    return { ok: false, error: 'invalid_token' };
  }

  const [row] = await db
    .select()
    .from(schema.verificationTokens)
    .where(eq(schema.verificationTokens.token, normalizedToken))
    .limit(1);

  if (!row) {
    return { ok: false, error: 'invalid_token' };
  }

  const expiresAt = row.expires ? new Date(row.expires) : null;
  if (expiresAt && expiresAt.getTime() < Date.now()) {
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.token, normalizedToken));

    return { ok: false, error: 'expired_token' };
  }

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
    })
    .from(schema.users)
    .where(eq(schema.users.email, row.identifier))
    .limit(1);

  if (!user) {
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.token, normalizedToken));

    return { ok: false, error: 'unknown_user' };
  }

  await db
    .update(schema.users)
    .set({ emailVerified: new Date() })
    .where(eq(schema.users.id, user.id));

  await db
    .delete(schema.verificationTokens)
    .where(eq(schema.verificationTokens.token, normalizedToken));

  return {
    ok: true,
    email: user.email,
    name: user.name,
  };
}
