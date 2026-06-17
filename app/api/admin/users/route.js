import { NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import dbModule from '../../../../lib/db/index.js';
import {
  adminUserDeleteSchema,
  adminUserRoleSchema,
} from '../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

async function getUserById(id) {
  const [user] = await db
    .select({
      id: schema.users.id,
      role: schema.users.role,
    })
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);

  return user || null;
}

async function countAdmins() {
  const [row] = await db
    .select({
      count: sql`count(*)::int`,
    })
    .from(schema.users)
    .where(eq(schema.users.role, 'admin'));

  return Number(row?.count || 0);
}

export async function PATCH(request) {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { session, error } = await requireAdminSession();
  if (error) {
    return error;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Corp JSON invalid', 400);
  }

  const parsed = adminUserRoleSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const target = await getUserById(parsed.data.id);
  if (!target) {
    return jsonError('Utilizator negăsit', 404);
  }

  if (target.id === session.user.id && parsed.data.role === 'user') {
    return jsonError('Nu îți poți modifica singur rolul', 403);
  }

  if (target.role === 'admin' && parsed.data.role === 'user') {
    const admins = await countAdmins();
    if (admins <= 1) {
      return jsonError('Trebuie să existe cel puțin un administrator', 403);
    }
  }

  const [updated] = await db
    .update(schema.users)
    .set({ role: parsed.data.role })
    .where(eq(schema.users.id, target.id))
    .returning({
      id: schema.users.id,
      role: schema.users.role,
      bannedAt: schema.users.bannedAt,
      createdAt: schema.users.createdAt,
    });

  if (!updated) {
    return jsonError('Utilizator negăsit', 404);
  }

  return NextResponse.json(
    {
      ok: true,
      user: {
        id: updated.id,
        role: updated.role,
        bannedAt: updated.bannedAt ? new Date(updated.bannedAt).toISOString() : null,
        createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : null,
      },
    },
    { status: 200 },
  );
}

export async function DELETE(request) {
  if (!db) {
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { session, error } = await requireAdminSession();
  if (error) {
    return error;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Corp JSON invalid', 400);
  }

  const parsed = adminUserDeleteSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const target = await getUserById(parsed.data.id);
  if (!target) {
    return jsonError('Utilizator negăsit', 404);
  }

  if (target.id === session.user.id) {
    return jsonError('Nu îți poți șterge propriul cont din această masă', 403);
  }

  if (target.role === 'admin') {
    const admins = await countAdmins();
    if (admins <= 1) {
      return jsonError('Trebuie să existe cel puțin un administrator', 403);
    }
  }

  await db.transaction(async (tx) => {
    await tx.delete(schema.reviews).where(eq(schema.reviews.userId, target.id));
    await tx.delete(schema.messages).where(eq(schema.messages.userId, target.id));
    await tx.delete(schema.accounts).where(eq(schema.accounts.userId, target.id));
    await tx.delete(schema.sessions).where(eq(schema.sessions.userId, target.id));
    await tx.delete(schema.users).where(eq(schema.users.id, target.id));
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
