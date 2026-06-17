import { NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';
import dbModule from '../../../../lib/db/index.js';
import {
  adminFacultyDeleteSchema,
  adminFacultyUpsertSchema,
} from '../../../../lib/validate.js';
import { jsonError, requireAdminSession } from '../../../../lib/admin.js';
import { toSlug } from '../../../../lib/slug.js';

const { db, schema } = dbModule;

export const runtime = 'nodejs';

function normalizeText(value) {
  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function normalizeSlug(value, name) {
  const explicit = normalizeText(value);
  const source = explicit || normalizeText(name) || '';
  const slug = toSlug(source);
  return slug.length > 0 ? slug : null;
}

function normalizeNumber(value) {
  if (value == null || value === '') {
    return null;
  }

  const parsed = Number(String(value).trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function normalizeBoolean(value) {
  if (value === true || value === 'true' || value === 1 || value === '1') {
    return true;
  }

  if (
    value === false ||
    value === 'false' ||
    value === 0 ||
    value === '0' ||
    value == null ||
    value === ''
  ) {
    return false;
  }

  return Boolean(value);
}

function normalizePrograms(programs) {
  if (!Array.isArray(programs)) {
    return [];
  }

  return programs
    .map((value) => normalizeText(value))
    .filter((value) => Boolean(value));
}

function normalizeDomainIds(domainIds) {
  if (!Array.isArray(domainIds)) {
    return [];
  }

  return [...new Set(domainIds.map((value) => normalizeText(value)).filter(Boolean))];
}

async function loadFaculty(tx, id) {
  const [row] = await tx
    .select({
      id: schema.faculties.id,
      slug: schema.faculties.slug,
      name: schema.faculties.name,
      description: schema.faculties.description,
      city: schema.faculties.city,
      address: schema.faculties.address,
      website: schema.faculties.website,
      email: schema.faculties.email,
      phone: schema.faculties.phone,
      coverUrl: schema.faculties.coverUrl,
      emblemUrl: schema.faculties.emblemUrl,
      tuitionCost: schema.faculties.tuitionCost,
      minAdmissionGrade: schema.faculties.minAdmissionGrade,
      budgetSeatsIndex: schema.faculties.budgetSeatsIndex,
      multiCampus: schema.faculties.multiCampus,
      createdAt: schema.faculties.createdAt,
      updatedAt: schema.faculties.updatedAt,
    })
    .from(schema.faculties)
    .where(eq(schema.faculties.id, id))
    .limit(1);

  if (!row) {
    return null;
  }

  const domains = await tx
    .select({
      id: schema.domains.id,
      name: schema.domains.name,
      slug: schema.domains.slug,
    })
    .from(schema.facultyDomains)
    .innerJoin(
      schema.domains,
      eq(schema.facultyDomains.domainId, schema.domains.id),
    )
    .where(eq(schema.facultyDomains.facultyId, id))
    .orderBy(asc(schema.domains.name));

  const programs = await tx
    .select({
      name: schema.programs.name,
    })
    .from(schema.programs)
    .where(eq(schema.programs.facultyId, id))
    .orderBy(asc(schema.programs.name));

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    city: row.city,
    address: row.address,
    description: row.description,
    website: row.website,
    email: row.email,
    phone: row.phone,
    tuitionCost: row.tuitionCost,
    minAdmissionGrade:
      row.minAdmissionGrade == null ? null : Number(row.minAdmissionGrade),
    budgetSeatsIndex:
      row.budgetSeatsIndex == null ? null : Number(row.budgetSeatsIndex),
    coverUrl: row.coverUrl,
    emblemUrl: row.emblemUrl,
    multiCampus: Boolean(row.multiCampus),
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null,
    domainIds: domains.map((domain) => domain.id),
    domains,
    programs: programs.map((program) => ({ name: program.name })),
  };
}

function buildFacultyPayload(body) {
  const normalizedSlug = normalizeSlug(body.slug, body.name);

  return {
    id: normalizeText(body.id) || undefined,
    name: normalizeText(body.name),
    slug: normalizedSlug || undefined,
    city: normalizeText(body.city),
    address: normalizeText(body.address),
    description: normalizeText(body.description),
    website: normalizeText(body.website),
    email: normalizeText(body.email),
    phone: normalizeText(body.phone),
    tuitionCost: normalizeNumber(body.tuitionCost),
    minAdmissionGrade: normalizeNumber(body.minAdmissionGrade),
    budgetSeatsIndex: normalizeNumber(body.budgetSeatsIndex),
    coverUrl: normalizeText(body.coverUrl),
    emblemUrl: normalizeText(body.emblemUrl),
    multiCampus: normalizeBoolean(body.multiCampus),
    domainIds: normalizeDomainIds(body.domainIds),
    programs: normalizePrograms(body.programs),
  };
}

async function persistFacultyRelations(tx, facultyId, domainIds, programs) {
  await tx.delete(schema.facultyDomains).where(eq(schema.facultyDomains.facultyId, facultyId));
  await tx.delete(schema.programs).where(eq(schema.programs.facultyId, facultyId));

  if (domainIds.length > 0) {
    await tx.insert(schema.facultyDomains).values(
      domainIds.map((domainId) => ({
        facultyId,
        domainId,
      })),
    );
  }

  if (programs.length > 0) {
    await tx.insert(schema.programs).values(
      programs.map((name) => ({
        facultyId,
        name,
      })),
    );
  }
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

  const normalized = buildFacultyPayload(
    body && typeof body === 'object' && !Array.isArray(body) ? body : {},
  );
  const parsed = adminFacultyUpsertSchema.safeParse(normalized);
  if (!parsed.success || !parsed.data.slug) {
    return jsonError('Date invalide', 400);
  }

  const faculty = await db.transaction(async (tx) => {
    const slugConflict = await tx
      .select({ id: schema.faculties.id })
      .from(schema.faculties)
      .where(eq(schema.faculties.slug, parsed.data.slug))
      .limit(1);

    if (slugConflict.length > 0) {
      return null;
    }

    const [created] = await tx
      .insert(schema.faculties)
      .values({
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description,
        city: parsed.data.city,
        address: parsed.data.address,
        website: parsed.data.website,
        email: parsed.data.email,
        phone: parsed.data.phone,
        coverUrl: parsed.data.coverUrl,
        emblemUrl: parsed.data.emblemUrl,
        tuitionCost: parsed.data.tuitionCost,
        minAdmissionGrade: parsed.data.minAdmissionGrade,
        budgetSeatsIndex: parsed.data.budgetSeatsIndex,
        multiCampus: parsed.data.multiCampus,
      })
      .returning({ id: schema.faculties.id });

    if (!created) {
      return null;
    }

    await persistFacultyRelations(
      tx,
      created.id,
      parsed.data.domainIds,
      parsed.data.programs,
    );

    return loadFaculty(tx, created.id);
  });

  if (!faculty) {
    return jsonError('Slug-ul există deja', 409);
  }

  return NextResponse.json(
    {
      ok: true,
      faculty,
    },
    { status: 201 },
  );
}

export async function PATCH(request) {
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

  const normalized = buildFacultyPayload(
    body && typeof body === 'object' && !Array.isArray(body) ? body : {},
  );
  const parsed = adminFacultyUpsertSchema.safeParse(normalized);
  if (!parsed.success || !parsed.data.id || !parsed.data.slug) {
    return jsonError('Date invalide', 400);
  }

  const faculty = await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: schema.faculties.id })
      .from(schema.faculties)
      .where(eq(schema.faculties.id, parsed.data.id))
      .limit(1);

    if (existing.length === 0) {
      return null;
    }

    const slugConflict = await tx
      .select({ id: schema.faculties.id })
      .from(schema.faculties)
      .where(
        eq(schema.faculties.slug, parsed.data.slug),
      )
      .limit(1);

    if (
      slugConflict.length > 0 &&
      slugConflict[0].id !== parsed.data.id
    ) {
      return { slugConflict: true };
    }

    await tx
      .update(schema.faculties)
      .set({
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description,
        city: parsed.data.city,
        address: parsed.data.address,
        website: parsed.data.website,
        email: parsed.data.email,
        phone: parsed.data.phone,
        coverUrl: parsed.data.coverUrl,
        emblemUrl: parsed.data.emblemUrl,
        tuitionCost: parsed.data.tuitionCost,
        minAdmissionGrade: parsed.data.minAdmissionGrade,
        budgetSeatsIndex: parsed.data.budgetSeatsIndex,
        multiCampus: parsed.data.multiCampus,
        updatedAt: new Date(),
      })
      .where(eq(schema.faculties.id, parsed.data.id));

    await persistFacultyRelations(
      tx,
      parsed.data.id,
      parsed.data.domainIds,
      parsed.data.programs,
    );

    return loadFaculty(tx, parsed.data.id);
  });

  if (!faculty) {
    return jsonError('Facultate negăsită', 404);
  }

  if (faculty.slugConflict) {
    return jsonError('Slug-ul există deja', 409);
  }

  return NextResponse.json(
    {
      ok: true,
      faculty,
    },
    { status: 200 },
  );
}

export async function DELETE(request) {
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

  const parsed = adminFacultyDeleteSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError('Date invalide', 400);
  }

  const [existing] = await db
    .select({ id: schema.faculties.id })
    .from(schema.faculties)
    .where(eq(schema.faculties.id, parsed.data.id))
    .limit(1);

  if (!existing) {
    return jsonError('Facultate negăsită', 404);
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(schema.facultyDomains)
      .where(eq(schema.facultyDomains.facultyId, parsed.data.id));
    await tx.delete(schema.programs).where(eq(schema.programs.facultyId, parsed.data.id));
    await tx.delete(schema.reviews).where(eq(schema.reviews.facultyId, parsed.data.id));
    await tx.delete(schema.messages).where(eq(schema.messages.facultyId, parsed.data.id));
    await tx.delete(schema.faculties).where(eq(schema.faculties.id, parsed.data.id));
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
