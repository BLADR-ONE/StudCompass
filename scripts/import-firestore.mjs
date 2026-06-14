import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { eq } from 'drizzle-orm';

const schemaModule = await import('../lib/db/index.js');
const { db, schema } = schemaModule.default ?? schemaModule;

function readExportFile() {
  const exportPath = fileURLToPath(new URL('../firestore-export.json', import.meta.url));
  return JSON.parse(readFileSync(exportPath, 'utf8'));
}

function getMode() {
  if (process.argv.includes('--apply')) {
    return 'apply';
  }
  return 'dry-run';
}

function normalizeWhitespace(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function stripDiacritics(value) {
  return normalizeWhitespace(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
}

function slugify(value) {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/&/g, ' si ')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function compactString(value) {
  if (value == null) {
    return null;
  }

  const normalized = normalizeWhitespace(value);
  if (!normalized || normalized === '-' || normalized === '—' || normalized === 'n/a') {
    return null;
  }

  return normalized;
}

function toNumber(value) {
  if (value == null || value === '') {
    return null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['1', 'true', 't', 'yes', 'y', 'da', 'd'].includes(normalized);
  }
  return false;
}

function firstValue(...values) {
  for (const value of values) {
    if (value != null && value !== '') {
      return value;
    }
  }
  return null;
}

function parseLocation(value) {
  const text = compactString(value);
  if (!text) {
    return { city: null, address: null };
  }

  const [cityPart, ...rest] = text.split(',').map((part) => normalizeWhitespace(part));
  return {
    city: cityPart || null,
    address: rest.length ? rest.join(', ') : null,
  };
}

function normalizeCost(value) {
  const number = toNumber(value);
  if (number != null) {
    return Math.trunc(number);
  }

  const normalized = compactString(value)?.toLowerCase();
  if (!normalized) {
    return null;
  }

  const map = {
    mic: 3000,
    mediu: 5000,
    medium: 5000,
    medie: 5000,
    mare: 7000,
  };

  return map[normalized] ?? null;
}

function normalizeMultiCampus(value) {
  return toBoolean(value);
}

function extractEmbeddedItems(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return compactString(item);
      }
      if (item && typeof item === 'object') {
        return compactString(
          firstValue(item.name, item.nume, item.title, item.label, item.facultate, item.value),
        );
      }
      return null;
    })
    .filter(Boolean);
}

function normalizeProgramName(value) {
  const text = compactString(value);
  if (!text || text === '*') {
    return null;
  }
  return text.replace(/[;,.]+$/g, '');
}

function normalizeDomainName(value) {
  const text = normalizeProgramName(value);
  if (!text) {
    return null;
  }

  return text
    .replace(/^facultatea\s+de\s+/i, '')
    .replace(/^facultatea\s+/i, '')
    .replace(/^fac\.\s*/i, '')
    .replace(/^f\.\s*/i, '')
    .replace(/&/g, ' și ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickFacultyName(source, docId) {
  const fallback = titleCase(docId);
  return compactString(firstValue(source.name, source.nume, source.title, source.pid, fallback));
}

function pickFacultySlug(source, docId) {
  return slugify(firstValue(source.pid, source.slug, docId) ?? docId);
}

function pickFacultyRecord(source, docId) {
  const slug = pickFacultySlug(source, docId);
  const name = pickFacultyName(source, docId);
  const { city, address } = parseLocation(source.loc);
  const description = compactString(source.desc);
  const website = compactString(source.website);
  const email = compactString(firstValue(source.email, source.emaill));
  const phone = compactString(source.phone);
  const coverUrl = compactString(source.cover);
  const emblemUrl = compactString(source.emblem);
  const tuitionCost = normalizeCost(source.cost);
  const minAdmissionGrade = toNumber(source.medie);
  const budgetSeatsIndex = toNumber(firstValue(source.bugetIndex, source.budgetIndex, source.butgetIndex));
  const multiCampus = normalizeMultiCampus(source.multipleFac);

  const missing = [];
  if (!slug) {
    missing.push('slug');
  }
  if (!name) {
    missing.push('name');
  }
  if (!city) {
    missing.push('city');
  }

  if (missing.length) {
    return { skipped: true, reasons: missing, source };
  }

  return {
    skipped: false,
    faculty: {
      slug,
      name,
      description,
      city,
      address,
      website,
      email,
      phone,
      coverUrl,
      emblemUrl,
      tuitionCost,
      minAdmissionGrade,
      budgetSeatsIndex,
      multiCampus,
    },
  };
}

function buildRows(exportData) {
  const faculties = [];
  const programs = [];
  const domains = [];
  const facultyDomains = [];
  const skippedDocs = [];
  const domainBySlug = new Map();

  for (const document of exportData.documents ?? []) {
    const source = document.data ?? {};
    const facultyResult = pickFacultyRecord(source, document.id);

    if (facultyResult.skipped) {
      skippedDocs.push({
        id: document.id,
        reasons: facultyResult.reasons,
      });
      continue;
    }

    const { faculty } = facultyResult;
    faculties.push(faculty);

    const embeddedItems = extractEmbeddedItems(source.facultati);
    const programNames = new Map();
    const domainNames = new Map();

    for (const item of embeddedItems) {
      const programName = normalizeProgramName(item);
      if (programName && !programNames.has(programName)) {
        programNames.set(programName, programName);
        programs.push({
          facultySlug: faculty.slug,
          name: programName,
        });
      }

      const domainName = normalizeDomainName(item);
      if (!domainName) {
        continue;
      }

      const domainSlug = slugify(domainName);
      if (!domainSlug || domainBySlug.has(domainSlug)) {
        continue;
      }

      domainBySlug.set(domainSlug, { slug: domainSlug, name: domainName });
      domainNames.set(domainSlug, true);
    }

    for (const domain of domainNames.keys()) {
      facultyDomains.push({
        facultySlug: faculty.slug,
        domainSlug: domain,
      });
    }
  }

  domains.push(...domainBySlug.values());

  return {
    faculties,
    programs,
    domains,
    facultyDomains,
    skippedDocs,
  };
}

function sampleRow(rows) {
  return rows.length ? rows[0] : null;
}

async function applyRows(plan) {
  for (const domain of plan.domains) {
    await db
      .insert(schema.domains)
      .values(domain)
      .onConflictDoUpdate({
        target: schema.domains.slug,
        set: {
          name: domain.name,
        },
      });
  }

  const domainRows = await db.select({ id: schema.domains.id, slug: schema.domains.slug }).from(schema.domains);
  const domainMap = new Map(domainRows.map((row) => [row.slug, row.id]));

  for (const faculty of plan.faculties) {
    const [facultyRow] = await db
      .insert(schema.faculties)
      .values({
        slug: faculty.slug,
        name: faculty.name,
        description: faculty.description,
        city: faculty.city,
        address: faculty.address,
        website: faculty.website,
        email: faculty.email,
        phone: faculty.phone,
        coverUrl: faculty.coverUrl,
        emblemUrl: faculty.emblemUrl,
        tuitionCost: faculty.tuitionCost,
        minAdmissionGrade: faculty.minAdmissionGrade,
        budgetSeatsIndex: faculty.budgetSeatsIndex,
        multiCampus: faculty.multiCampus,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.faculties.slug,
        set: {
          name: faculty.name,
          description: faculty.description,
          city: faculty.city,
          address: faculty.address,
          website: faculty.website,
          email: faculty.email,
          phone: faculty.phone,
          coverUrl: faculty.coverUrl,
          emblemUrl: faculty.emblemUrl,
          tuitionCost: faculty.tuitionCost,
          minAdmissionGrade: faculty.minAdmissionGrade,
          budgetSeatsIndex: faculty.budgetSeatsIndex,
          multiCampus: faculty.multiCampus,
          updatedAt: new Date(),
        },
      })
      .returning();

    await db.delete(schema.programs).where(eq(schema.programs.facultyId, facultyRow.id));
    await db.delete(schema.facultyDomains).where(eq(schema.facultyDomains.facultyId, facultyRow.id));

    const programRows = plan.programs.filter((program) => program.facultySlug === faculty.slug);
    if (programRows.length) {
      await db.insert(schema.programs).values(
        programRows.map((program) => ({
          facultyId: facultyRow.id,
          name: program.name,
        })),
      );
    }

    const facultyDomainRows = plan.facultyDomains.filter((link) => link.facultySlug === faculty.slug);
    if (facultyDomainRows.length) {
      await db.insert(schema.facultyDomains).values(
        facultyDomainRows
          .map((link) => {
            const domainId = domainMap.get(link.domainSlug);
            if (!domainId) {
              return null;
            }
            return {
              facultyId: facultyRow.id,
              domainId,
            };
          })
          .filter(Boolean),
      );
    }
  }
}

function printDryRunSummary(plan) {
  console.log(`Faculties rows: ${plan.faculties.length}`);
  console.log(`Programs rows: ${plan.programs.length}`);
  console.log(`Domains rows: ${plan.domains.length}`);
  console.log(`Faculty domains rows: ${plan.facultyDomains.length}`);
  console.log(`Skipped docs: ${plan.skippedDocs.length}`);

  if (plan.skippedDocs.length) {
    console.log(`Skipped details: ${JSON.stringify(plan.skippedDocs, null, 2)}`);
  }

  console.log(`Sample faculties row: ${JSON.stringify(sampleRow(plan.faculties), null, 2)}`);
  console.log(`Sample programs row: ${JSON.stringify(sampleRow(plan.programs), null, 2)}`);
  console.log(`Sample domains row: ${JSON.stringify(sampleRow(plan.domains), null, 2)}`);
  console.log(`Sample faculty_domains row: ${JSON.stringify(sampleRow(plan.facultyDomains), null, 2)}`);
}

async function main() {
  if (!db && getMode() === 'apply') {
    console.error(
      'Database client is not available. Use `netlify dev:exec node scripts/import-firestore.mjs --apply` or set `NETLIFY_DATABASE_URL`.',
    );
    process.exit(1);
  }

  const exportData = readExportFile();
  const plan = buildRows(exportData);

  if (getMode() === 'dry-run') {
    printDryRunSummary(plan);
    return;
  }

  await applyRows(plan);
  console.log(
    `Applied ${plan.faculties.length} faculties, ${plan.programs.length} programs, ${plan.domains.length} domains, and ${plan.facultyDomains.length} faculty-domain links.`,
  );
  console.log(
    plan.skippedDocs.length
      ? `Skipped docs: ${JSON.stringify(plan.skippedDocs, null, 2)}`
      : 'Skipped docs: none',
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
