import { NextResponse } from 'next/server';
import { auth } from './auth.js';

export function jsonError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      session: null,
      error: jsonError('Neautorizat', 401),
    };
  }

  if (session.user.banned) {
    return {
      session,
      error: jsonError('Utilizatorii blocați nu pot modifica conținutul', 403),
    };
  }

  if (session.user.role !== 'admin') {
    return {
      session,
      error: jsonError('Interzis', 403),
    };
  }

  return {
    session,
    error: null,
  };
}
