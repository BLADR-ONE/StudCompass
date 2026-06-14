import { desc, eq } from 'drizzle-orm';
import { auth } from '../../lib/auth.js';
import dbModule from '../../lib/db/index.js';
import AdminDesk from '../../components/admin/AdminDesk.js';
import { CompassRose } from '../../components/layout/Brand.js';

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
    const [reviewRows, messageRows, userRows] = await Promise.all([
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
    ]);

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
      {/* Chapter header — same atlas language, workshop chapter. */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="texture-doodle" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg"
        />
        <CompassRose className="pointer-events-none absolute -right-28 -top-24 hidden size-[22rem] text-primary/[0.08] lg:block dark:text-primary-soft/10" />

        <div className="wrap relative pb-10 pt-14 sm:pt-20">
          <p className="eyebrow animate-rise" style={{ animationDelay: '60ms' }}>
            Masa cartografului
          </p>
          <h1
            className="animate-rise mt-5 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.06] sm:text-5xl"
            style={{ animationDelay: '160ms' }}
          >
            Atelierul din spatele{' '}
            <em className="wonky italic text-primary-strong dark:text-primary-soft">
              hărții
            </em>
            .
          </h1>
          <p
            className="animate-rise mt-5 max-w-xl text-pretty leading-relaxed text-text-muted sm:text-lg"
            style={{ animationDelay: '280ms' }}
          >
            Recenzii, mesaje, conturi și jurnalul de bord — tot ce ține
            atlasul StudCompass curat și de încredere, pe o singură masă de
            lucru.
          </p>
        </div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className="wrap">
          <AdminDesk
            offline={!data}
            reviews={data?.reviews ?? []}
            messages={data?.messages ?? []}
            users={data?.users ?? []}
            currentUserId={session?.user?.id || ''}
          />
        </div>
      </section>
    </>
  );
}
