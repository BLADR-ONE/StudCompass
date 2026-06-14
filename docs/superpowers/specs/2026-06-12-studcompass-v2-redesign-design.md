# StudCompass v2 — UI Redesign + Firebase→Postgres Migration

**Date:** 2026-06-12
**Status:** Approved by user (with process note: parallelize delegation only when genuinely useful)

## Goal

Rebuild the StudCompass interface from scratch — sleeker, modern, palette-driven — while migrating all data and auth off Firebase onto PostgreSQL (Netlify DB / Neon). Only the home page's *concept* survives: big hero background image with a transparent navbar that solidifies on scroll. Everything else (home sections below the hero, about, faculties listing/detail, login, account, personality test, admin) is redone. The contact page is merged into About; `/contact` redirects to `/about#contact`.

## Decisions (user-confirmed)

| Decision | Choice |
|---|---|
| Router | **Migrate to App Router** (`app/`), React Server Components + client islands |
| ORM | **Drizzle** + Neon serverless driver, migrations via `drizzle-kit` |
| Auth | **Auth.js v5**: Credentials (email+password, bcrypt) + Google provider, Drizzle adapter, JWT session strategy |
| Theming | **Light + dark toggle**, CSS variables from `colorPallete.json`, `data-theme` on `<html>` |
| UI stack | **Tailwind v4 only** — MUI, Emotion, CSS Modules removed |
| Data | **Function-first schema redesign**; old Firestore data transformed to fit the new schema (never the reverse). User provides export/credentials for a one-time import |
| FingerprintJS | **Dropped** — replaced by random localStorage visitor id for analytics |

## Architecture

- Next.js 16 App Router. Server components fetch from Postgres via Drizzle directly; mutations go through route handlers under `app/api/`.
- Hosting: Netlify (existing host) with Netlify DB (Neon Postgres). Connection string env var: `NETLIFY_DATABASE_URL`.
- Same public URLs as v1: `/`, `/about`, `/facultati`, `/facultati/[pid]`, `/account`, `/account/auth`, `/account/personalityTest`, `/admin`. `/contact` → redirect to `/about#contact`.
- `lib/db/` holds the Drizzle client (Neon serverless driver) and schema; `lib/auth.js` holds the Auth.js config. The old `lib/firebase.js`, `lib/firebase-admin.js`, `lib/authToken.js`, `lib/reducer.js`, `lib/StateProvider.js`, `lib/consoleHandler.js` are deleted in cleanup.

## Database schema (Postgres, function-first)

The old Firestore `facultati` docs are institutions with an embedded `facultati` array and denormalized review sums. New normalized schema:

### users
- `id` uuid PK default `gen_random_uuid()`
- `email` text unique not null; `email_verified` timestamptz (Auth.js)
- `name` text; `image` text
- `password_hash` text null (null for Google-only accounts)
- `role` text not null default `'user'` — `'user' | 'admin'`
- `banned_at` timestamptz null (null = not banned; reversible, auditable)
- `preferences` jsonb (saved filters: city, domains, etc.)
- `created_at` timestamptz default now()

### accounts / sessions / verification_tokens
Standard Auth.js Drizzle-adapter tables (sessions table present even though JWT strategy is used — harmless, adapter-complete).

### faculties
- `id` uuid PK; `slug` text unique not null (the URL `pid`)
- `name` text not null; `description` text
- `city` text not null (indexed); `address` text
- `website`, `email`, `phone` text
- `cover_url`, `emblem_url` text
- `tuition_cost` integer (lei/year); `min_admission_grade` numeric(4,2); `budget_seats_index` numeric
- `multi_campus` boolean default false
- `created_at`, `updated_at` timestamptz
- Review aggregates (`AVG(rating)`, `COUNT(*)`) computed in SQL — no stored `sumReviews`/`nrReviews`.

### programs
- `id` uuid PK; `faculty_id` uuid FK → faculties (cascade); `name` text not null
- Rows come from the old embedded `facultati` array.

### domains / faculty_domains
- `domains`: `id` PK, `name` unique, `slug` unique
- `faculty_domains`: composite PK (`faculty_id`, `domain_id`) — powers domain filtering.

### reviews
- `id` uuid PK; `faculty_id` FK cascade; `user_id` FK
- `rating` smallint check 1–5; `body` text
- `hidden_at` timestamptz null (moderation); `created_at`
- Unique (`faculty_id`, `user_id`) — one review per user per faculty; import keeps the latest.

### messages (per-faculty public chat)
- `id` uuid PK; `faculty_id` FK cascade; `user_id` FK
- `body` text not null; `hidden_at` timestamptz null; `created_at` (indexed with faculty_id)

### personality_results
- `id` uuid PK; `user_id` FK; `answers` jsonb (raw 120); `scores` jsonb (computed); `created_at`
- History kept; profile shows the latest row.

### analytics_events
- `id` bigserial PK; `event_type` text not null; `faculty_id` uuid FK null
- `visitor_id` text (random localStorage UUID); `user_id` uuid null; `created_at` (indexed)

Indexes: `faculties(city)`, `reviews(faculty_id, created_at)`, `messages(faculty_id, created_at)`, `analytics_events(created_at, event_type)`.

## Auth flows

- **Register:** form → POST `/api/register` → validate → bcrypt hash → insert user.
- **Login:** Auth.js Credentials (verify hash) or Google OAuth. Google links to an existing user by verified email — kept as a UX nicety (safe: Google verifies emails); no longer needed for migration since users start from a clean slate (decision 2026-06-12). Email-based password reset deferred (needs an email service).
- **Sessions:** JWT strategy; `role` and ban status enforced in the JWT/`authorized` callbacks. Banned users are signed out / blocked from posting.
- **Admin:** UI route-guarded *and* every admin API re-checks `role='admin'` server-side.

## Design system & UI

### Tokens (Tailwind v4 `@theme` + CSS variables)
- Primary teal `#388870` (strong `#306858`, soft `#58b098`); CTA orange `#f07820` (hover `#d05828`); highlight amber `#f8c050`; mint tints `#a8e8e8`, `#78c8c8`; ink `#183838`; destructive/warning rust `#884028`.
- Semantic vars (`--background`, `--surface`, `--text`, `--primary`, `--accent`, …) flip with `data-theme="light|dark"` on `<html>`. Light: off-white surfaces, ink text. Dark: deep-teal surfaces from the `#183838` family, mint text.
- Persisted in localStorage, defaults to `prefers-color-scheme`, no-flash inline script in root layout. Replaces the broken `[theme = true/false]` CSS.
- Modern type via `next/font`; rounded cards, soft shadows, consistent spacing scale.

### Pages
- **Home:** hero kept in spirit (big bg image, transparent→solid navbar, headline + CTA buttons). Below it, all new: "How it works" 3-step section, featured faculties pulled live from the DB, restyled testimonial/quote band, personality-test CTA band, new footer.
- **About:** rebuilt; contact info/form merged as a section (`#contact` anchor).
- **Faculties listing:** server-rendered card grid; client filter bar (city, domain, multi-campus) — custom Tailwind controls, no MUI.
- **Faculty detail:** cover+emblem hero, info cards (cost, min grade, contacts, website), programs list, reviews with star input, public chat. Chat uses polling refresh (Firestore realtime is gone; fine at this traffic).
- **Auth (`/account/auth`):** rebuilt login/register with Google button.
- **Account:** profile, preferences, latest personality result.
- **Personality test:** rebuilt 120-question stepper with progress indicator; posts answers; result stored in `personality_results`.
- **Admin:** rebuilt dashboard — moderation (hide review/message, ban user) + Chart.js analytics from `analytics_events`.

## Data transfer (one-time) — **catalog only** (decision 2026-06-12)

**Users start from a clean slate** (user's explicit choice): no accounts, reviews, chat messages, or personality results are migrated. The only import is the **faculty catalog** — content the user curated, not user data.

Service-account key available in the main checkout's `secrets/` folder (git-ignored; all project secrets live there by user convention, 2026-06-12). Flow:
1. `scripts/export-firestore.mjs` dumps the `facultati` collection to `firestore-export.json`.
2. `scripts/import-firestore.mjs --dry-run|--apply` transforms institution docs → `faculties` + `programs` + `domains`/`faculty_domains` (slugified pids) and upserts via Drizzle.

The schema never bends to old data; the transform absorbs all mapping mess. After this, Firebase is never touched again and the key can be deleted.

## Required from the user

1. `NETLIFY_DATABASE_URL` — `netlify db init` or Netlify dashboard → Extensions → Neon; paste into `.env.local`.
2. Google OAuth client (`AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`) — Google Cloud Console → Credentials; redirect URIs `http://localhost:3000/api/auth/callback/google` + production domain.
3. `AUTH_SECRET` — generated during implementation.
4. Firestore export when convenient (everything else proceeds without it).

## Out of scope (deferred)

- Email/password-reset service (SMTP) — v2.1.
- Realtime (websocket) chat — polling suffices.
- Test framework introduction — verification is `npm run lint` + `npm run build` + scripted manual flow checks; the import script's `--dry-run` is its safety net.

## Cleanup (final phase)

Delete `pages/` (all), Firebase/MUI/Emotion/FingerprintJS/react-firebase-hooks deps, CSS Modules, `Navbar.old.js`, `Footer.js`/`Fotter.js`, `lib/firebase*.js`, `lib/authToken.js`, `lib/StateProvider.js`, `lib/reducer.js`, `lib/consoleHandler.js`. Update `CLAUDE.md` to describe the new architecture.
