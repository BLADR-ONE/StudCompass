# StudCompass v2 Implementation Plan

> **For agentic workers:** Execution is orchestrated via codex-delegator tasks (user's delegation rules). Tasks use checkbox (`- [ ]`) syntax for tracking. **Do not run `git commit`/`git push` — the user manages git.** Verification = `npm run lint` + `npm run build` (+ manual flow checks); the repo has no test framework by design (see spec "Out of scope").

**Goal:** Rebuild the StudCompass UI from scratch (App Router, Tailwind v4, palette-driven light/dark theming) and migrate all data/auth from Firebase to Postgres (Netlify DB / Neon, Drizzle ORM, Auth.js v5).

**Architecture:** Next.js 16 App Router; server components fetch via Drizzle directly, mutations via `app/api/` route handlers; Auth.js v5 (Credentials + Google, JWT sessions, Drizzle adapter); one-time Firestore import script. Old `pages/` tree stays in place as reference until the final cleanup phase deletes it.

**Tech Stack:** Next 16, React 19, Tailwind v4, drizzle-orm + @neondatabase/serverless + drizzle-kit, next-auth@beta (Auth.js v5) + @auth/drizzle-adapter, bcryptjs, zod, bad-words, chart.js.

**Spec:** `docs/superpowers/specs/2026-06-12-studcompass-v2-redesign-design.md`

**Language:** All UI copy in Romanian (matching v1). Code identifiers/comments in English.

**Repo stays JavaScript** — no TypeScript migration; Drizzle schema and config are written in JS.

---

## Pinned contracts (all tasks must conform)

### Env vars (`.env.local`, update `.env.local.example` in Phase 0)
- `NETLIFY_DATABASE_URL` — Neon Postgres connection string (pooled)
- `AUTH_SECRET` — Auth.js JWT secret
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — Google OAuth client
- `AUTH_TRUST_HOST=true` (Netlify); old Firebase/FPJS vars removed in Phase 5

### File map (new code)
- `drizzle.config.js` — drizzle-kit config, schema path + `NETLIFY_DATABASE_URL`
- `lib/db/schema.js` — all Drizzle table definitions (single source of truth)
- `lib/db/index.js` — exports `db` (drizzle over neon-http driver)
- `lib/auth.js` — exports `{ handlers, auth, signIn, signOut }` from NextAuth()
- `lib/validate.js` — zod schemas shared by API routes
- `app/layout.js` — root layout: fonts, theme no-flash script, Navbar/Footer, SessionProvider
- `app/globals.css` — Tailwind v4 import + `@theme` tokens + `[data-theme]` semantic vars
- `app/page.js` (home), `app/about/page.js`, `app/contact/page.js` (redirect → `/about#contact`)
- `app/facultati/page.js`, `app/facultati/[pid]/page.js`
- `app/account/auth/page.js`, `app/account/page.js`, `app/account/personalityTest/page.js`, `app/account/layout.js` (auth guard)
- `app/admin/page.js`, `app/admin/layout.js` (admin guard)
- `app/api/auth/[...nextauth]/route.js`, `app/api/register/route.js`
- `app/api/reviews/route.js`, `app/api/messages/route.js`
- `app/api/personality/route.js`, `app/api/preferences/route.js`, `app/api/profile/route.js`
- `app/api/analytics/route.js`, `app/api/admin/moderate/route.js`, `app/api/admin/stats/route.js`
- `components/ui/*` (Button, Card, Input, Select, Badge, StarRating, Spinner, Modal)
- `components/layout/*` (Navbar, Footer, ThemeToggle)
- `components/home/*`, `components/faculty/*` (FilterBar, FacultyCard, Reviews, Chat), `components/account/*`, `components/admin/*`
- `scripts/seed.mjs`, `scripts/export-firestore.mjs`, `scripts/import-firestore.mjs`
- `netlify.toml`

### Database schema (Drizzle, table → key columns)
Exactly as the spec defines. Table names (snake_case in SQL): `users`, `accounts`, `sessions`, `verification_tokens`, `faculties`, `programs`, `domains`, `faculty_domains`, `reviews`, `messages`, `personality_results`, `analytics_events`. Notable constraints: `faculties.slug` unique; `reviews` unique `(faculty_id, user_id)`, `rating` smallint CHECK 1–5; moderation via `hidden_at`/`banned_at` timestamps; indexes on `faculties(city)`, `reviews(faculty_id, created_at)`, `messages(faculty_id, created_at)`, `analytics_events(created_at, event_type)`.

### API conventions
- JSON bodies validated with zod; errors `{ error: string }` with proper status (400/401/403/404).
- Auth via `await auth()` in route handlers; admin routes additionally check `session.user.role === 'admin'`; banned users (`banned_at` set) get 403 on all mutating routes.
- `POST /api/register` `{name, email, password}` → 201 `{ok: true}`; 409 on duplicate email.
- `GET /api/reviews?faculty=<slug>` → `{reviews: [...], avg, count}`; `POST /api/reviews` `{faculty, rating, body}` (upsert own review).
- `GET /api/messages?faculty=<slug>` → `{messages: [...]}` (latest 100, hidden excluded); `POST /api/messages` `{faculty, body}` — body run through bad-words filter.
- `POST /api/personality` `{answers: number[120]}` → `{scores}`; `GET /api/personality` → latest own result.
- `PUT /api/preferences` `{city?, domains?: string[]}`; `PUT /api/profile` `{name}`.
- `POST /api/analytics` `{eventType, faculty?}` (eventType ∈ `page_view`, `card_click`, `cta_click`, `test_completed`); visitor id = UUID persisted in `localStorage('sc_visitor')`, sent in body.
- `POST /api/admin/moderate` `{action: 'hide_review'|'unhide_review'|'hide_message'|'unhide_message'|'ban_user'|'unban_user', id}`.
- `GET /api/admin/stats` → aggregates for Chart.js (events per day by type, last 30 days; totals).

### Design tokens (`app/globals.css`)
Raw palette in `@theme`: `--color-primary: #388870`, `--color-primary-strong: #306858`, `--color-primary-soft: #58b098`, `--color-accent: #f07820`, `--color-accent-strong: #d05828`, `--color-highlight: #f8c050`, `--color-mint: #a8e8e8`, `--color-teal-soft: #78c8c8`, `--color-ink: #183838`, `--color-rust: #884028`.
Semantic vars flipped by `[data-theme="light"]` / `[data-theme="dark"]` on `<html>` and exposed as utilities via `@theme inline`: `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-text`, `--color-text-muted`, `--color-border`. Light: off-white bg / ink text; dark: `#11292b`-family bg / mint text. Theme persisted in `localStorage('sc_theme')`, default = system, no-flash inline script in `<head>`. Orange = CTAs/highlights only; rust = destructive only.

---

## Phase 0 — Foundation: deps, schema, DB client, seed

**Blocked on nothing.** (Live DB connection only needed at the final verification step — `NETLIFY_DATABASE_URL` from the user.)

- [x] Install: `npm i drizzle-orm @neondatabase/serverless next-auth@beta @auth/drizzle-adapter bcryptjs zod && npm i -D drizzle-kit`
- [x] Write `lib/db/schema.js` with every table from the pinned contract (incl. Auth.js adapter tables per @auth/drizzle-adapter docs)
- [x] Write `lib/db/index.js` (neon-http drizzle client reading `NETLIFY_DATABASE_URL`)
- [x] Write `drizzle.config.js`; run `npx drizzle-kit generate` → SQL migration in `drizzle/` (generated: `drizzle/0000_redundant_karen_page.sql`)
- [x] Write `scripts/seed.mjs`: ~10 real Romanian universities (name, city, description, website, contacts, plausible tuition/grade/budget data, cover/emblem from existing `/public` assets or placeholder paths), ~12 study domains, programs per faculty; idempotent (upsert by slug). Add npm scripts: `db:generate`, `db:migrate`, `db:seed`
- [x] Replace `.env.local.example` with the new var set (keep file committed-safe, values empty)
- [x] Verify: `npm run lint` and `npm run build` pass (build must not require a live DB) — verified 2026-06-12
> **PAUSED 2026-06-12 after Phase 0** (user decision; Codex quota exhausted, resets 2026-07-06 or earlier via `codex login`). Resume at Phase 1. Still needed from user: `NETLIFY_DATABASE_URL` in `.env.local`, `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`, old Firebase service-account JSON (Phase 4).
- [ ] **Checkpoint** (user commit suggested)
- [ ] When the local Netlify DB is up: `npm run db:migrate && netlify dev:exec node scripts/seed.mjs`, verify with a quick select

## Phase 1 — Auth.js

**Depends on Phase 0.**

- [ ] `lib/auth.js`: NextAuth v5 — Drizzle adapter, JWT session strategy; Credentials provider (zod-validate, bcrypt compare, reject banned); Google provider (`allowDangerousEmailAccountLinking: true` — deliberate: recovery path for imported users, acceptable because Google verifies emails); jwt/session callbacks expose `id`, `role`, `banned`
- [ ] `app/api/auth/[...nextauth]/route.js` exporting handlers
- [ ] `app/api/register/route.js` per contract (bcrypt cost 12)
- [ ] Guards: `app/account/layout.js` (redirect to `/account/auth` if no session) and `app/admin/layout.js` (redirect to `/` if not admin) — note: `app/account/auth/page.js` must live OUTSIDE the guarded segment; use a route group `app/account/(protected)/` for guarded pages so `/account/auth` stays public
- [ ] Verify: lint + build

## Phase 2 — App shell & design system

**Depends on Phase 0 only (can start before Phase 1 lands if convenient; merges in the same worktree, sequential is fine).**

- [ ] `app/globals.css` per pinned design tokens; delete nothing old yet
- [ ] `app/layout.js`: `next/font` (Manrope or similar for UI + a display font for headings), no-flash theme script, metadata (Romanian title/description), Navbar + Footer + SessionProvider wiring
- [ ] `components/layout/Navbar.js`: client component — transparent over hero, solid surface after scroll (IntersectionObserver or scroll listener), links (Acasă, Facultăți, Despre), ThemeToggle, session-aware account/login button, mobile menu
- [ ] `components/layout/ThemeToggle.js`, `components/layout/Footer.js`
- [ ] `components/ui/`: Button (primary/accent/ghost/destructive variants), Card, Input, Select, Badge, StarRating (display + input modes), Spinner, Modal — small, focused files
- [ ] Temporary `app/page.js` placeholder rendering the shell so build passes
- [ ] Verify: lint + build + `npm run dev` renders shell in both themes
- [ ] **Checkpoint**

## Phase 3 — Pages (sequential tasks, one Codex session each)

**Depends on Phases 0–2.** Old `pages/` files remain as content/behavior reference — port the Romanian copy and the 120 personality questions + scoring from them. **Route-collision rule:** as each route is rebuilt under `app/`, rename the colliding legacy `pages/` file to `*.legacy.txt` (pattern set by `pages/index.legacy.txt`). Build currently runs with `--experimental-app-only`; Phase 5 removes the flag together with the whole `pages/` tree.

### 3a Home
- [ ] `app/page.js` (server component) + `components/home/*`: hero (big bg image from `/public`, headline, CTA buttons → `/facultati` and `/account/personalityTest`), "Cum funcționează" 3 steps, featured faculties (top 4 by review avg — Drizzle query, graceful empty state when DB absent), quote/testimonial band, personality-test CTA band
- [ ] Create `app/api/analytics/route.js` (POST per contract — moved here from 3h because 3a is its first consumer) + `lib/analytics.js` client helper (visitor id in `localStorage('sc_visitor')`, fire-and-forget POST); home fires `page_view`
### Execution split for Phase 3 (user directive 2026-06-12, strengthened)
**ALL UI is built by dedicated UI subagents** (model: opus / Opus 4.8 since the 2026-06-14 Fable-5 ban; was fable, frontend-design skill) — pages, components, styling. **Codex handles only non-UI work**: one backend batch task builds the remaining API routes per the pinned contracts (`reviews`, `messages`, `personality`, `preferences`, `profile`, `admin/moderate`, `admin/stats`), runnable in parallel with Fable UI sessions (disjoint files: `app/api/*` vs pages/components). Fable session 1 takes ownership of the design system + home (absorbing/replacing the Codex 3a skeleton); subsequent Fable sessions build 3b–3h UI against the API contracts; a final Fable polish sweep runs before Phase 5 cleanup.
**Polish-sweep checklist (user decisions 2026-06-12):** contact email stays `contact@studcompass.ro` (user registers the domain later — do NOT change); social links site-wide = GitHub `https://github.com/BLADR-ONE` ONLY, remove any other socials (footer, about, anywhere); fix cross-session cohesion drift.
### 3b About (+contact merged)
- [ ] `app/about/page.js`: mission/team sections rebuilt + `#contact` section (email link, simple mailto form); `app/contact/page.js` = `redirect('/about#contact')`
### 3c Faculties listing
- [ ] `app/facultati/page.js` (server, reads searchParams) + `components/faculty/FilterBar.js` (client: city select, domain multi-select, multi-campus toggle → URL params) + `FacultyCard.js` (cover, emblem, name, city, domains badges, avg stars, `card_click` analytics)
### 3d Faculty detail
- [ ] `app/facultati/[pid]/page.js`: cover hero + emblem, info cards (tuition, min grade, budget index, contacts, website), programs list, `components/faculty/Reviews.js` (list + star input, one per user, upsert) and `Chat.js` (poll `GET /api/messages` every 15s, post box, signed-in only), `app/api/reviews/route.js` + `app/api/messages/route.js` per contract
### 3e Auth pages
- [ ] `app/account/auth/page.js`: tabbed login/register, credentials forms (zod client validation), Google button, error states; uses `signIn` + `/api/register`
### 3f Account
- [ ] `app/account/(protected)/page.js`: profile (name edit → `/api/profile`), preferences (city/domains → `/api/preferences`), latest personality result summary, sign-out; APIs per contract
### 3g Personality test
- [ ] `app/account/(protected)/personalityTest/page.js`: port the 120 questions + scoring from `pages/account/personalityTest.js` into a stepper (10 Qs/step, progress bar, localStorage draft), submit → `/api/personality` (server recomputes scores; fires `test_completed`)
### 3h Admin
- [ ] `app/admin/page.js`: tabs — Recenzii / Mesaje / Utilizatori / Statistici; moderation tables hitting `/api/admin/moderate`; Chart.js charts from `/api/admin/stats`; `app/api/analytics/route.js` POST for events
- [ ] Verify after each sub-task: lint + build; after 3h: full manual flow check (register → login → review → chat → test → admin moderation) against seeded DB
- [ ] **Checkpoint** after each sub-task

## Phase 4 — Firestore import: **faculty catalog ONLY** (rescoped 2026-06-12)

> Users/reviews/messages/personality results are NOT migrated — clean slate by user decision. Only curated catalog content moves. Key is available (unblocked).

- [ ] `scripts/export-firestore.mjs`: with the service-account JSON (path arg; key lives in the main checkout's `secrets/` folder — the whole folder is git-ignored; all project secrets live there by user convention), dump the `facultati` collection (documents only, no subcollections) to `firestore-export.json` (also git-ignored)
- [ ] `scripts/import-firestore.mjs --dry-run|--apply`: transform institutions → faculties/programs/domains + faculty_domains (slugify old pid); report row counts; idempotent upserts by slug
- [ ] Verify: dry-run output reviewed, then apply; spot-check counts in DB

## Phase 5 — Cleanup, Netlify config, docs

**Depends on Phases 1–3 (Phase 4 can land after — import scripts only need firebase-admin as a devDependency or standalone; keep `firebase-admin` installed until Phase 4 done if export not yet received).**

- [ ] Delete `pages/` entirely; delete old `components/` root files (Navbar, Navbar.old, Footer, Fotter, List, Card, CardAdmin, Review, ChatMessage, Profession), `styles/*.module.css` (keep only `globals.css` if still referenced — new one lives in `app/`), `lib/firebase.js`, `lib/firebase-admin.js`, `lib/authToken.js`, `lib/StateProvider.js`, `lib/reducer.js`, `lib/consoleHandler.js`
- [ ] `npm un firebase react-firebase-hooks @mui/material @mui/icons-material @emotion/react @emotion/styled @fingerprintjs/fingerprintjs-pro-react react-awesome-reveal` (+ `react-virtuoso`/`react-window`/`react-countup`/`axios` if unused in new code; `firebase-admin` only after Phase 4)
- [ ] `netlify.toml`: Next runtime defaults + `npm run build`
- [ ] Remove `--experimental-app-only` from the build script (obsolete once `pages/` is deleted)
- [ ] Update `CLAUDE.md` to describe v2 architecture (App Router, Drizzle/Neon, Auth.js, Tailwind tokens, new file map, npm db scripts); delete `NEXT_SESSION.md`; note that the old "Firebase immutable ID" guidance is obsolete
- [ ] Final verify: lint + build + full manual flow in both themes + Netlify deploy preview
- [ ] **Final checkpoint** — hand user the merge-to-main commands

---

## Self-review notes
- Spec coverage: every spec section maps to a phase (schema→0, auth→1, design system→2, pages→3a–3h, import→4, cleanup/deploy→5, env asks→0/4). `/contact` redirect in 3b. FingerprintJS removal in 5; visitor-id replacement in 3a/analytics contract.
- Route-group gotcha for `/account/auth` vs guarded `/account` is called out explicitly (Phase 1) — known App Router foot-gun.
- Build-without-DB requirement stated in Phase 0 verification (pages must not crash at build when `NETLIFY_DATABASE_URL` is unset — guard data fetches).
