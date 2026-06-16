const {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
  numeric,
  jsonb,
  smallint,
  bigserial,
  primaryKey,
  uniqueIndex,
  index,
  check,
} = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

const now = () => sql`now()`;
const emptyObject = sql`'{}'::jsonb`;
const emptyArray = sql`'[]'::jsonb`;

const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: timestamp('email_verified', {
      withTimezone: true,
      mode: 'date',
    }),
    image: text('image'),
    passwordHash: text('password_hash'),
    role: text('role').notNull().default('user'),
    bannedAt: timestamp('banned_at', {
      withTimezone: true,
      mode: 'date',
    }),
    preferences: jsonb('preferences').notNull().default(emptyObject),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
  },
);

const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (table) => ({
    compositePk: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  }),
);

const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => ({
    compositePk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  }),
);

const faculties = pgTable(
  'faculties',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    city: text('city').notNull(),
    address: text('address'),
    website: text('website'),
    email: text('email'),
    phone: text('phone'),
    coverUrl: text('cover_url'),
    emblemUrl: text('emblem_url'),
    tuitionCost: integer('tuition_cost'),
    minAdmissionGrade: numeric('min_admission_grade', {
      precision: 4,
      scale: 2,
      mode: 'number',
    }),
    budgetSeatsIndex: numeric('budget_seats_index', {
      precision: 8,
      scale: 2,
      mode: 'number',
    }),
    multiCampus: boolean('multi_campus').notNull().default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
  },
  (table) => ({
    cityIdx: index('faculties_city_idx').on(table.city),
  }),
);

const programs = pgTable('programs', {
  id: uuid('id').defaultRandom().primaryKey(),
  facultyId: uuid('faculty_id')
    .notNull()
    .references(() => faculties.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
});

const domains = pgTable('domains', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
});

const facultyDomains = pgTable(
  'faculty_domains',
  {
    facultyId: uuid('faculty_id')
      .notNull()
      .references(() => faculties.id, { onDelete: 'cascade' }),
    domainId: uuid('domain_id')
      .notNull()
      .references(() => domains.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    compositePk: primaryKey({
      columns: [table.facultyId, table.domainId],
    }),
  }),
);

const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    facultyId: uuid('faculty_id')
      .notNull()
      .references(() => faculties.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: smallint('rating').notNull(),
    body: text('body'),
    hiddenAt: timestamp('hidden_at', {
      withTimezone: true,
      mode: 'date',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
  },
  (table) => ({
    facultyCreatedIdx: index('reviews_faculty_id_created_at_idx').on(
      table.facultyId,
      table.createdAt,
    ),
    uniqueReview: uniqueIndex('reviews_faculty_id_user_id_key').on(
      table.facultyId,
      table.userId,
    ),
    ratingCheck: check('reviews_rating_check', sql`${table.rating} between 1 and 5`),
  }),
);

const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    facultyId: uuid('faculty_id')
      .notNull()
      .references(() => faculties.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    hiddenAt: timestamp('hidden_at', {
      withTimezone: true,
      mode: 'date',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
  },
  (table) => ({
    facultyCreatedIdx: index('messages_faculty_id_created_at_idx').on(
      table.facultyId,
      table.createdAt,
    ),
  }),
);

const personalityResults = pgTable('personality_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  answers: jsonb('answers').notNull().default(emptyArray),
  scores: jsonb('scores').notNull().default(emptyObject),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .default(now()),
});

const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    eventType: text('event_type').notNull(),
    facultyId: uuid('faculty_id').references(() => faculties.id, {
      onDelete: 'set null',
    }),
    visitorId: text('visitor_id').notNull(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
  },
  (table) => ({
    createdTypeIdx: index('analytics_events_created_at_event_type_idx').on(
      table.createdAt,
      table.eventType,
    ),
  }),
);

const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorName: text('author_name').notNull(),
    authorRole: text('author_role').notNull(),
    body: text('body').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    published: boolean('published').notNull().default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .default(now()),
  },
  (table) => ({
    sortIdx: index('testimonials_sort_order_idx').on(
      table.published,
      table.sortOrder,
    ),
  }),
);

const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .default(now()),
});

const authSchema = {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
};

module.exports = {
  users,
  accounts,
  sessions,
  verificationTokens,
  faculties,
  programs,
  domains,
  facultyDomains,
  reviews,
  messages,
  personalityResults,
  analyticsEvents,
  testimonials,
  siteSettings,
  authSchema,
};
