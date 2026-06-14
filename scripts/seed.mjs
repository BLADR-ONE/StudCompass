import { eq } from 'drizzle-orm';

const schemaModule = await import('../lib/db/index.js');
const { db, schema } = schemaModule.default ?? schemaModule;

if (!db) {
  console.error(
    'Database client is not available. Use `netlify dev:exec node scripts/seed.mjs` for local Netlify dev, or set `NETLIFY_DATABASE_URL`.',
  );
  process.exit(1);
}

const universities = [
  {
    slug: 'universitatea-din-bucuresti',
    name: 'Universitatea din București',
    city: 'București',
    address: 'Bulevardul Regina Elisabeta 4-12, București',
    website: 'https://unibuc.ro',
    email: 'contact@unibuc.ro',
    phone: '+40 21 305 9700',
    description:
      'Universitate publică de referință, cu tradiție în științe, litere, drept și științe sociale.',
    coverUrl: '/assets/home.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 4900,
    minAdmissionGrade: 8.15,
    budgetSeatsIndex: 92.4,
    multiCampus: true,
    domains: [
      'stiinte-umaniste',
      'drept-si-stiinte-sociale',
      'psihologie-si-stiinte-ale-comunicarii',
      'stiinte-ale-educatiei',
    ],
    programs: [
      'Informatică',
      'Drept',
      'Psihologie',
      'Limba și literatura română',
    ],
  },
  {
    slug: 'universitatea-babes-bolyai',
    name: 'Universitatea Babeș-Bolyai',
    city: 'Cluj-Napoca',
    address: 'Strada Mihail Kogălniceanu 1, Cluj-Napoca',
    website: 'https://ubbcluj.ro',
    email: 'contact@ubbcluj.ro',
    phone: '+40 264 405 300',
    description:
      'Cea mai mare universitate din România, cu portofoliu amplu de programe și campusuri multiple.',
    coverUrl: '/assets/about.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 5300,
    minAdmissionGrade: 8.25,
    budgetSeatsIndex: 95.1,
    multiCampus: true,
    domains: [
      'informatica-si-it',
      'stiinte-economice',
      'psihologie-si-stiinte-ale-comunicarii',
      'stiinte-ale-educatiei',
    ],
    programs: [
      'Informatica',
      'Economie și afaceri internaționale',
      'Psihologie',
      'Științe ale educației',
    ],
  },
  {
    slug: 'universitatea-alexandru-ioan-cuza-din-iasi',
    name: 'Universitatea Alexandru Ioan Cuza din Iași',
    city: 'Iași',
    address: 'Bulevardul Carol I 11, Iași',
    website: 'https://uaic.ro',
    email: 'contact@uaic.ro',
    phone: '+40 232 201 000',
    description:
      'Universitate istorică, puternică pe științe exacte, economie, drept și științe sociale.',
    coverUrl: '/assets/journey.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 4700,
    minAdmissionGrade: 8.05,
    budgetSeatsIndex: 90.8,
    multiCampus: true,
    domains: [
      'informatica-si-it',
      'stiinte-economice',
      'drept-si-stiinte-sociale',
      'stiinte-ale-naturii',
    ],
    programs: ['Informatică', 'Finanțe și bănci', 'Drept', 'Biologie'],
  },
  {
    slug: 'universitatea-de-vest-din-timisoara',
    name: 'Universitatea de Vest din Timișoara',
    city: 'Timișoara',
    address: 'Bulevardul Vasile Pârvan 4, Timișoara',
    website: 'https://www.uvt.ro',
    email: 'secretariat@e-uvt.ro',
    phone: '+40 256 592 111',
    description:
      'Centru universitar modern, cu profil puternic pe științe exacte, arte și științe sociale.',
    coverUrl: '/assets/maincover.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 5200,
    minAdmissionGrade: 8.1,
    budgetSeatsIndex: 88.7,
    multiCampus: false,
    domains: [
      'informatica-si-it',
      'arte-si-design',
      'psihologie-si-stiinte-ale-comunicarii',
      'stiinte-economice',
    ],
    programs: ['Informatica', 'Arte plastice', 'Comunicare', 'Management'],
  },
  {
    slug: 'universitatea-politehnica-din-bucuresti',
    name: 'Universitatea Politehnica din București',
    city: 'București',
    address: 'Splaiul Independenței 313, București',
    website: 'https://upb.ro',
    email: 'rectorat@upb.ro',
    phone: '+40 21 402 9510',
    description:
      'Politehnica bucureșteană, orientată spre inginerie, tehnologie și sisteme digitale.',
    coverUrl: '/assets/bgDark.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 5900,
    minAdmissionGrade: 8.4,
    budgetSeatsIndex: 96.5,
    multiCampus: true,
    domains: ['inginerie', 'informatica-si-it', 'arhitectura-si-constructii'],
    programs: [
      'Calculatoare și tehnologia informației',
      'Inginerie electrică',
      'Automatică și informatică aplicată',
      'Arhitectură',
    ],
  },
  {
    slug: 'universitatea-tehnica-din-cluj-napoca',
    name: 'Universitatea Tehnică din Cluj-Napoca',
    city: 'Cluj-Napoca',
    address: 'Strada Memorandumului 28, Cluj-Napoca',
    website: 'https://utcluj.ro',
    email: 'registratura@utcluj.ro',
    phone: '+40 264 401 200',
    description:
      'Universitate tehnică recunoscută pentru inginerie, construcții și informatică aplicată.',
    coverUrl: '/assets/bgWhite.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 5600,
    minAdmissionGrade: 8.2,
    budgetSeatsIndex: 93.2,
    multiCampus: true,
    domains: ['inginerie', 'informatica-si-it', 'arhitectura-si-constructii'],
    programs: [
      'Ingineria calculatoarelor',
      'Construcții civile',
      'Inginerie mecanică',
      'Autovehicule rutiere',
    ],
  },
  {
    slug: 'universitatea-transilvania-din-brasov',
    name: 'Universitatea Transilvania din Brașov',
    city: 'Brașov',
    address: 'Bulevardul Eroilor 29, Brașov',
    website: 'https://unitbv.ro',
    email: 'contact@unitbv.ro',
    phone: '+40 268 413 000',
    description:
      'Universitate multidisciplinară, cu programe puternice în inginerie, medicină și economie.',
    coverUrl: '/assets/homeold.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 5000,
    minAdmissionGrade: 8.0,
    budgetSeatsIndex: 89.6,
    multiCampus: true,
    domains: ['inginerie', 'medicina-si-sanatate', 'stiinte-economice'],
    programs: ['Inginerie forestieră', 'Medicină generală', 'Contabilitate', 'Mecatronică'],
  },
  {
    slug: 'academia-de-studii-economice-din-bucuresti',
    name: 'Academia de Studii Economice din București',
    city: 'București',
    address: 'Piața Romană 6, București',
    website: 'https://ase.ro',
    email: 'admitere@ase.ro',
    phone: '+40 21 319 1900',
    description:
      'Universitate specializată în economie, management, finanțe și business.',
    coverUrl: '/assets/contact.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 5400,
    minAdmissionGrade: 8.3,
    budgetSeatsIndex: 94.8,
    multiCampus: false,
    domains: ['stiinte-economice', 'drept-si-stiinte-sociale', 'informatica-si-it'],
    programs: [
      'Cibernetică economică',
      'Finanțe și bănci',
      'Management',
      'Informatică economică',
    ],
  },
  {
    slug: 'universitatea-de-medicina-si-farmacie-carol-davila-din-bucuresti',
    name: 'Universitatea de Medicină și Farmacie „Carol Davila” din București',
    city: 'București',
    address: 'Bulevardul Eroii Sanitari 8, București',
    website: 'https://umfcd.ro',
    email: 'contact@umfcd.ro',
    phone: '+40 21 318 0719',
    description:
      'Centru medical major, cu programe competitive în medicină, farmacie și stomatologie.',
    coverUrl: '/assets/bgDark.jpg',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 6300,
    minAdmissionGrade: 9.05,
    budgetSeatsIndex: 98.1,
    multiCampus: true,
    domains: ['medicina-si-sanatate', 'biologie-si-mediu'],
    programs: ['Medicină generală', 'Farmacie', 'Stomatologie', 'Asistență medicală generală'],
  },
  {
    slug: 'universitatea-ovidius-din-constanta',
    name: 'Universitatea „Ovidius” din Constanța',
    city: 'Constanța',
    address: 'Bulevardul Mamaia 124, Constanța',
    website: 'https://univ-ovidius.ro',
    email: 'secretariat@univ-ovidius.ro',
    phone: '+40 241 606 407',
    description:
      'Universitate amplă de pe litoral, cu profil divers, de la medicină la științe ale naturii.',
    coverUrl: '/assets/decide.webp',
    emblemUrl: '/assets/logo.png',
    tuitionCost: 4400,
    minAdmissionGrade: 7.95,
    budgetSeatsIndex: 87.3,
    multiCampus: true,
    domains: ['medicina-si-sanatate', 'stiinte-ale-naturii', 'stiinte-economice'],
    programs: ['Medicină', 'Biologie marină', 'Contabilitate', 'Geografie'],
  },
];

const domains = [
  { slug: 'informatica-si-it', name: 'Informatică și IT' },
  { slug: 'inginerie', name: 'Inginerie' },
  { slug: 'stiinte-economice', name: 'Științe economice' },
  { slug: 'drept-si-stiinte-sociale', name: 'Drept și științe sociale' },
  { slug: 'medicina-si-sanatate', name: 'Medicină și sănătate' },
  { slug: 'arhitectura-si-constructii', name: 'Arhitectură și construcții' },
  { slug: 'stiinte-ale-educatiei', name: 'Științe ale educației' },
  { slug: 'psihologie-si-stiinte-ale-comunicarii', name: 'Psihologie și comunicare' },
  { slug: 'arte-si-design', name: 'Arte și design' },
  { slug: 'biologie-si-mediu', name: 'Biologie și mediu' },
  { slug: 'stiinte-ale-naturii', name: 'Științe ale naturii' },
  { slug: 'stiinte-umaniste', name: 'Științe umaniste' },
];

async function upsertDomain(domain) {
  const [row] = await db
    .insert(schema.domains)
    .values(domain)
    .onConflictDoUpdate({
      target: schema.domains.slug,
      set: {
        name: domain.name,
      },
    })
    .returning();
  return row;
}

async function upsertFaculty(faculty) {
  const [row] = await db
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
  return row;
}

async function main() {
  for (const domain of domains) {
    await upsertDomain(domain);
  }

  const domainRows = await db
    .select({ id: schema.domains.id, slug: schema.domains.slug })
    .from(schema.domains);
  const domainMap = new Map(domainRows.map((row) => [row.slug, row.id]));

  for (const faculty of universities) {
    const facultyRow = await upsertFaculty(faculty);

    await db
      .delete(schema.programs)
      .where(eq(schema.programs.facultyId, facultyRow.id));

    await db
      .delete(schema.facultyDomains)
      .where(eq(schema.facultyDomains.facultyId, facultyRow.id));

    await db.insert(schema.programs).values(
      faculty.programs.map((name) => ({
        facultyId: facultyRow.id,
        name,
      })),
    );

    await db.insert(schema.facultyDomains).values(
      faculty.domains.map((slug) => ({
        facultyId: facultyRow.id,
        domainId: domainMap.get(slug),
      })),
    );
  }

  console.log(`Seeded ${universities.length} universities and ${domains.length} domains.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
