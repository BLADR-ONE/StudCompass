import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import dbModule from '../../../../lib/db/index.js';
import { requireAdminSession } from '../../../../lib/admin.js';

const { db } = dbModule;

export const runtime = 'nodejs';

const eventTypes = ['page_view', 'card_click', 'cta_click', 'test_completed'];

function errorResponse(message, status) {
  return NextResponse.json({ error: message }, { status });
}

function toDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function buildLast30Days() {
  const days = [];
  const now = new Date();

  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
    days.push(toDayKey(date));
  }

  return days;
}

export async function GET() {
  if (!db) {
    return errorResponse('Database unavailable', 503);
  }

  const { error } = await requireAdminSession();
  if (error) {
    return error;
  }

  let dailyRows;
  let totalRows;
  try {
    dailyRows = await db.execute(sql`
      select
        to_char(created_at::date, 'YYYY-MM-DD') as date,
        event_type as "eventType",
        count(*)::int as count
      from analytics_events
      where created_at >= current_date - interval '29 days'
      group by 1, 2
      order by 1 asc, 2 asc
    `);

    totalRows = await db.execute(sql`
      select
        event_type as "eventType",
        count(*)::int as count
      from analytics_events
      group by 1
      order by 1 asc
    `);
  } catch {
    return errorResponse('Eroare la încărcarea statisticilor', 500);
  }

  const dailyMap = new Map();
  for (const row of dailyRows.rows || dailyRows) {
    dailyMap.set(`${row.date}:${row.eventType}`, Number(row.count || 0));
  }

  const daily = [];
  for (const date of buildLast30Days()) {
    for (const eventType of eventTypes) {
      daily.push({
        date,
        eventType,
        count: dailyMap.get(`${date}:${eventType}`) || 0,
      });
    }
  }

  const totals = {
    total: 0,
  };

  for (const eventType of eventTypes) {
    totals[eventType] = 0;
  }

  for (const row of totalRows.rows || totalRows) {
    const count = Number(row.count || 0);
    totals[row.eventType] = count;
    totals.total += count;
  }

  return NextResponse.json(
    {
      daily,
      totals,
    },
    { status: 200 },
  );
}
