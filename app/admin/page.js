import { asc, desc, eq } from 'drizzle-orm';
import { auth } from '../../lib/auth.js';
import dbModule from '../../lib/db/index.js';
import AdminDesk from '../../components/admin/AdminDesk.js';
import ChapterHeader from '../../components/layout/ChapterHeader.js';

const { db, schema } = dbModule;

export const metadata = {
  title: 'Administrare',
  description:
    'Masa cartografului StudCompass: moderarea recenziilor și a mesajelor, conturile călătorilor și jurnalul de bord al atlasului.',
};

/* Moderation works on live data — never serve a cached desk. */
export const dynamic = 'force-dynamic';

const LIST_CAP = 200;

function iso(value) {
  return value ? new Date(value).toISOString() : null;
}

/* Everything on the desk, in one trip: newest first, capped at 200 rows
   per drawer. A missing/unreachable database returns null — the desk
   renders its designed offline state instead. */
async function getDeskData() {
  if (!db) {
    return null;
  }

  try {
    const [reviewRows, messageRows, userRows, facultyRows, programRows, linkRows, domainRows] =
      await Promise.all([
      db
        .select({
          id: schema.reviews.id,
          rating: schema.reviews.rating,
          body: schema.reviews.body,
          hiddenAt: schema.reviews.hiddenAt,
          createdAt: schema.reviews.createdAt,
          authorName: schema.users.name,
          authorEmail: schema.users.email,
          facultyName: schema.faculties.name,
        })
        .from(schema.reviews)
        .innerJoin(schema.users, eq(schema.reviews.userId, schema.users.id))
        .innerJoin(
          schema.faculties,
          eq(schema.reviews.facultyId, schema.faculties.id),
        )
        .orderBy(desc(schema.reviews.createdAt))
        .limit(LIST_CAP),
      db
        .select({
          id: schema.messages.id,
          body: schema.messages.body,
          hiddenAt: schema.messages.hiddenAt,
          createdAt: schema.messages.createdAt,
          authorName: schema.users.name,
          authorEmail: schema.users.email,
          facultyName: schema.faculties.name,
        })
        .from(schema.messages)
        .innerJoin(schema.users, eq(schema.messages.userId, schema.users.id))
        .innerJoin(
          schema.faculties,
          eq(schema.messages.facultyId, schema.faculties.id),
        )
        .orderBy(desc(schema.messages.createdAt))
        .limit(LIST_CAP),
      db
        .select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          role: schema.users.role,
          bannedAt: schema.users.bannedAt,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .orderBy(desc(schema.users.createdAt))
        .limit(LIST_CAP),
      db
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
        .orderBy(asc(schema.faculties.name)),
      db
        .select({
          facultyId: schema.programs.facultyId,
          name: schema.programs.name,
        })
        .from(schema.programs)
        .orderBy(
          asc(schema.programs.facultyId),
          asc(schema.programs.name),
        ),
      db
        .select({
          facultyId: schema.facultyDomains.facultyId,
          id: schema.domains.id,
          name: schema.domains.name,
          slug: schema.domains.slug,
        })
        .from(schema.facultyDomains)
        .innerJoin(
          schema.domains,
          eq(schema.facultyDomains.domainId, schema.domains.id),
        )
        .orderBy(
          asc(schema.facultyDomains.facultyId),
          asc(schema.domains.name),
        ),
      db
        .select({
          id: schema.domains.id,
          name: schema.domains.name,
          slug: schema.domains.slug,
        })
        .from(schema.domains)
        .orderBy(asc(schema.domains.name)),
    ]);

    const programsByFaculty = new Map();
    for (const row of programRows) {
      const list = programsByFaculty.get(row.facultyId) || [];
      list.push({ name: row.name });
      programsByFaculty.set(row.facultyId, list);
    }

    const domainsByFaculty = new Map();
    for (const row of linkRows) {
      const list = domainsByFaculty.get(row.facultyId) || [];
      list.push({ id: row.id, name: row.name, slug: row.slug });
      domainsByFaculty.set(row.facultyId, list);
    }

    return {
      reviews: reviewRows.map((row) => ({
        ...row,
        hiddenAt: iso(row.hiddenAt),
        createdAt: iso(row.createdAt),
      })),
      messages: messageRows.map((row) => ({
        ...row,
        hiddenAt: iso(row.hiddenAt),
        createdAt: iso(row.createdAt),
      })),
      users: userRows.map((row) => ({
        ...row,
        bannedAt: iso(row.bannedAt),
        createdAt: iso(row.createdAt),
      })),
      faculties: facultyRows.map((row) => ({
        ...row,
        tuitionCost: row.tuitionCost == null ? null : Number(row.tuitionCost),
        minAdmissionGrade:
          row.minAdmissionGrade == null ? null : Number(row.minAdmissionGrade),
        budgetSeatsIndex:
          row.budgetSeatsIndex == null ? null : Number(row.budgetSeatsIndex),
        createdAt: iso(row.createdAt),
        updatedAt: iso(row.updatedAt),
        domainIds: (domainsByFaculty.get(row.id) || []).map((domain) => domain.id),
        domains: domainsByFaculty.get(row.id) || [],
        programs: programsByFaculty.get(row.id) || [],
      })),
      domains: domainRows,
    };
  } catch {
    /* Unreachable database — the desk shows its offline state. */
    return null;
  }
}

/* The cartographer's desk: the workshop behind the public atlas. */
export default async function AdminPage() {
  const [session, data] = await Promise.all([auth(), getDeskData()]);

  return (
    <>
      <ChapterHeader
        eyebrow="Masa cartografului"
        title={
          <>
            Atelierul din spatele{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              hărții
            </em>
            .
          </>
        }
        subtitle="Recenzii, mesaje, conturi și jurnalul de bord — tot ce ține atlasul StudCompass curat și de încredere, pe o singură masă de lucru."
      />

      <section className="pb-24 sm:pb-28">
        <div className="wrap">
          <AdminDesk
            offline={!data}
            reviews={data?.reviews ?? []}
            messages={data?.messages ?? []}
            users={data?.users ?? []}
            faculties={data?.faculties ?? []}
            domains={data?.domains ?? []}
            currentUserId={session?.user?.id || ''}
          />
        </div>
      </section>
    </>
  );
}
