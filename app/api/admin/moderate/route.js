import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import dbModule from '../../../../lib/db/index.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';
import { moderateSchema } from '../../../../lib/validate.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

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
    return jsonError('Baza de date nu este disponibilă', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('Corp JSON invalid', 400);
  }

  const parsed = moderateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const parsedId = z.string().uuid().safeParse(parsed.data.id);
  if (!parsedId.success) {
    return jsonError('Date invalide', 400);
  }

  const { action } = parsed.data;
  const id = parsedId.data;

  let updated = null;
  try {
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
      case 'delete_review':
        updated = await db
          .delete(schema.reviews)
          .where(eq(schema.reviews.id, id))
          .returning({ id: schema.reviews.id })
          .then((rows) => rows[0] || null);
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
      case 'delete_message':
        updated = await db
          .delete(schema.messages)
          .where(eq(schema.messages.id, id))
          .returning({ id: schema.messages.id })
          .then((rows) => rows[0] || null);
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
        return jsonError('Date invalide', 400);
    }
  } catch {
    return jsonError('Eroare la moderare', 500);
  }

  if (!updated) {
    return jsonError('Negăsit', 404);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
