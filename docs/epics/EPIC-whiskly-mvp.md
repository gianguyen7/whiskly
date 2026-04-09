# Epic Breakdown: Whiskly MVP

**Created:** 2026-04-02
**PRD:** docs/product/PRD-whiskly-mvp.md
**Schema:** docs/adr/ADR-004-database-schema.md
**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS + Supabase + Vercel + PWA

---

## Table of Contents

1. [Sprint Plan Overview](#sprint-plan-overview)
2. [Critical Path & Sequencing](#critical-path--sequencing)
3. [Epic 1: Infrastructure & Database Setup](#epic-1-infrastructure--database-setup)
4. [Epic 2: Authentication](#epic-2-authentication)
5. [Epic 3: Matcha Catalog](#epic-3-matcha-catalog)
6. [Epic 4: Matcha Logging](#epic-4-matcha-logging)
7. [Epic 5: Taste Profile](#epic-5-taste-profile)
8. [Epic 6: Recommendations](#epic-6-recommendations)
9. [Epic 7: Content & Sharing](#epic-7-content--sharing)
10. [Technical Spikes](#technical-spikes)
11. [Future (P2+) Items](#future-p2-items)

---

## Sprint Plan Overview

Three 1-week sprints. Each sprint delivers a shippable increment.

| Sprint | Theme | Epics | Exit State |
|--------|-------|-------|------------|
| **Sprint 1** | Foundation + Auth + Catalog | Epic 1, Epic 2, Epic 3 | User can sign up, log in, browse/search matcha catalog |
| **Sprint 2** | Logging + Taste Profile | Epic 4, Epic 5 | User can log matcha with taste ratings, see log history, view radar chart |
| **Sprint 3** | Recommendations + Content + Polish | Epic 6, Epic 7, polish | User gets recommendations after 3+ logs, can browse articles, share cards |

### Velocity Assumptions

- 1 developer, ~6-8 productive hours/day
- S = 2-4 hrs, M = 4-8 hrs, L = 1-2 days, XL = 2-3 days
- Scaffold (routes, components, services, models) already exists — work is implementing real logic

---

## Critical Path & Sequencing

```
SPRINT 1
────────────────────────────────────────────────────────────────────

  SP-01 (Supabase Client)
    │
    ▼
  US-101 (DB Schema + Migrations) ──────────────────────┐
    │                                                    │
    ▼                                                    ▼
  US-102 (RLS Policies)           US-103 (Seed Catalog)
    │                                │
    ▼                                ▼
  US-201 (Sign Up) ──► US-202 (Login/Logout)  US-301 (Browse Catalog)
    │                       │                      │
    ▼                       ▼                      ▼
  US-203 (Auth Guard)  US-204 (Password Reset) US-302 (Search)
                                                   │
SPRINT 2                                           ▼
────────────────────────────────────────────────────────────────────
                                               US-303 (Detail Page)
  US-401 (Log Form) ◄─── depends on catalog search
    │
    ▼
  US-402 (Save Log) ──► US-501 (Taste Profile Auto-Update)
    │                       │
    ▼                       ▼
  US-403 (Log History)  US-502 (Radar Chart)
    │                       │
    ▼                       ▼
  US-404 (Edit/Delete)  US-503 (Compare to Profile)

SPRINT 3
────────────────────────────────────────────────────────────────────

  US-601 (Recommendation Engine) ◄─── depends on 3+ logs + profile
    │
    ▼
  US-602 (Recommendation UI)
    │
    ▼
  US-603 ("Log This One" Flow)

  US-701 (Article Rendering) ──► US-702 (Article Index)

  US-703 (Share Card) ──► US-704 (Native Share)
```

**Critical path:** US-101 → US-201 → US-401 → US-402 → US-501 → US-601 → US-602

Any delay on the logging or taste profile path directly delays recommendations.

---

## Epic 1: Infrastructure & Database Setup

**Goal:** Stand up the Supabase project, run the schema, seed the catalog, and verify the dev environment works end-to-end.

**Sprint:** 1 (first 2 days)
**Total Estimate:** L (1.5 days)

---

### SP-01: Spike — Supabase Local Dev & Client Integration
**Priority:** P0 | **Size:** M | **Sprint:** 1

Verify that `supabase start` (local Docker), the Supabase CLI migration workflow, and the existing `src/lib/supabase/` client/server helpers work together. Document any gaps.

**Acceptance Criteria:**
- [ ] Given a fresh clone, when running `supabase start`, then local Postgres + Auth + Studio are running
- [ ] Given the server client helper, when calling `supabase.from('profiles').select()`, then it returns data (or empty array) without error
- [ ] Given the middleware helper, when an unauthenticated request hits a protected route, then it redirects to `/login`
- [ ] Output: updated `README` dev setup instructions if needed

**Technical Notes:** The scaffold already has `src/lib/supabase/client.ts`, `server.ts`, and `middleware.ts`. This spike validates they work with real Supabase. Check if `@supabase/ssr` is the right package for Next.js 16.

---

### US-101: Create Database Schema & Migrations
**Priority:** P0 | **Size:** M | **Sprint:** 1

**As a** developer, **I want to** run a single migration that creates all tables, indexes, functions, triggers, and RLS policies, **so that** the database is ready for the application.

**Acceptance Criteria:**
- [ ] Given a fresh Supabase instance, when running `supabase db push` (or `supabase migration up`), then all 4 tables are created (`matchas`, `profiles`, `matcha_logs`, `articles`)
- [ ] Given the migration, when inspecting the schema, then all indexes from ADR-004 exist (GIN search index, `idx_logs_user`, etc.)
- [ ] Given the migration, when inspecting functions, then `recalculate_taste_profile()` trigger and `get_recommendations()` function exist
- [ ] Given the migration, when inspecting triggers, then `trg_recalculate_taste_profile` fires on INSERT/UPDATE/DELETE on `matcha_logs`
- [ ] Given the migration, when rolling back, then it drops cleanly without orphaned objects

**Technical Notes:**
- Migration file: `infra/supabase/migrations/001_initial_schema.sql`
- Schema SQL is fully specified in ADR-004 — transcribe and test
- Include `handle_new_user()` trigger that auto-creates a `profiles` row on `auth.users` insert

**Dependencies:** SP-01

---

### US-102: Configure Row-Level Security Policies
**Priority:** P0 | **Size:** S | **Sprint:** 1

**As a** developer, **I want** RLS policies enforced on all tables, **so that** users can only access their own data.

**Acceptance Criteria:**
- [ ] Given an authenticated user, when selecting from `matcha_logs`, then only their own logs are returned
- [ ] Given an authenticated user, when selecting from `matchas`, then they see approved entries + their own submissions
- [ ] Given an authenticated user, when inserting into `matcha_logs`, then `user_id` must match their auth UID
- [ ] Given an unauthenticated request, when selecting from any table, then zero rows are returned (or request is rejected)
- [ ] Given an authenticated user, when trying to update another user's profile, then the update is rejected

**Technical Notes:** RLS SQL is in ADR-004. Bundle into the same migration as US-101 or a follow-up migration. Test via Supabase Studio or a test script.

**Dependencies:** US-101

---

### US-103: Seed Matcha Catalog
**Priority:** P0 | **Size:** M | **Sprint:** 1

**As a** developer, **I want** the catalog populated with 20-30 real matcha entries, **so that** users have meaningful data to browse and log from day one.

**Acceptance Criteria:**
- [ ] Given the seed script, when executed against a fresh DB, then 20-30 matcha entries exist in the `matchas` table
- [ ] Given seeded entries, when querying, then each has at minimum: name, brand, type, and at least 3 of 5 taste dimensions filled
- [ ] Given seeded entries, when filtering by confidence, then at least 10 entries have `confidence = 'high'` or `'medium'`
- [ ] Given the seed script, when run twice, then it is idempotent (upserts, no duplicates)
- [ ] Given seeded entries, then `submitted_by IS NULL` and `is_approved = true` for all catalog entries

**Technical Notes:**
- Seed data source: ADR-003 pipeline output or hand-curated JSON
- Script location: `scripts/seed-catalog.ts` (or `.sql`)
- Include entries from diverse regions (Uji, Nishio, Kagoshima, etc.) and types (ceremonial, premium, latte)
- Taste profiles should be realistic and varied to produce meaningful recommendations

**Dependencies:** US-101

---

## Epic 2: Authentication

**Goal:** Users can create an account, log in, log out, and reset their password. Auth state is enforced across the app.

**Sprint:** 1 (days 3-5)
**Total Estimate:** L (1.5 days)

---

### US-201: Sign Up with Email & Password
**Priority:** P0 | **Size:** M | **Sprint:** 1

**As a** new user, **I want to** create an account with my email and password, **so that** I can start tracking my matcha journey.

**Acceptance Criteria:**
- [ ] Given the `/signup` page, when I enter a valid email and password (8+ chars), then my account is created and I am redirected to the home page
- [ ] Given signup, when the account is created, then a `profiles` row is automatically inserted via the `handle_new_user()` trigger
- [ ] Given an already-registered email, when I try to sign up, then I see a clear error message
- [ ] Given an invalid email format, when I submit, then client-side validation prevents submission
- [ ] Given a password shorter than 8 characters, when I submit, then I see a validation error
- [ ] Given successful signup, when I land on the home page, then my session is active (no re-login required)

**Technical Notes:**
- Use `supabase.auth.signUp()` from the browser client
- The `(auth)/signup/page.tsx` route stub exists — implement the form
- Form state: use React `useActionState` or a controlled form with `useState`
- Email confirmation: disable in Supabase dashboard for MVP (auto-confirm)

**Dependencies:** US-101, US-102

---

### US-202: Log In & Log Out
**Priority:** P0 | **Size:** S | **Sprint:** 1

**As a** returning user, **I want to** log in with my email and password (and log out), **so that** I can access my matcha logs and profile.

**Acceptance Criteria:**
- [ ] Given the `/login` page, when I enter valid credentials, then I am authenticated and redirected to home
- [ ] Given invalid credentials, when I submit, then I see "Invalid email or password" (no info leakage about which field is wrong)
- [ ] Given I am logged in, when I tap "Log out" in the profile/settings area, then my session is destroyed and I am redirected to `/login`
- [ ] Given I am logged in and close the browser, when I reopen the app, then my session persists (cookie-based)

**Technical Notes:**
- Use `supabase.auth.signInWithPassword()` and `supabase.auth.signOut()`
- Session persistence is handled by `@supabase/ssr` middleware refreshing the cookie
- Logout button lives in the profile page or nav component

**Dependencies:** US-201

---

### US-203: Auth Route Guard
**Priority:** P0 | **Size:** S | **Sprint:** 1

**As a** developer, **I want** unauthenticated users redirected to `/login` when accessing protected routes, **so that** data is only accessible to logged-in users.

**Acceptance Criteria:**
- [ ] Given an unauthenticated user, when navigating to any `(main)/*` route, then they are redirected to `/login`
- [ ] Given an authenticated user, when navigating to `/login` or `/signup`, then they are redirected to home
- [ ] Given a session that expires mid-use, when the next server request fires, then the user is redirected to `/login`

**Technical Notes:**
- Middleware stub exists at `src/middleware.ts` — implement the redirect logic using the Supabase middleware helper
- Check `supabase.auth.getUser()` (not `getSession()` — `getUser()` validates the JWT server-side)

**Dependencies:** US-201

---

### US-204: Password Reset via Email
**Priority:** P1 | **Size:** S | **Sprint:** 1

**As a** user who forgot my password, **I want to** reset it via email, **so that** I can regain access to my account.

**Acceptance Criteria:**
- [ ] Given the login page, when I tap "Forgot password?", then I see a form to enter my email
- [ ] Given a valid registered email, when I submit the reset form, then I see "Check your email for a reset link"
- [ ] Given the reset email, when I click the link, then I am taken to a "Set new password" page in the app
- [ ] Given the reset page, when I enter a new password (8+ chars) and submit, then my password is updated and I am redirected to login
- [ ] Given an unregistered email, when I submit the reset form, then I see the same success message (no email enumeration)

**Technical Notes:**
- Use `supabase.auth.resetPasswordForEmail()` and `supabase.auth.updateUser()`
- Requires a callback route (e.g., `/auth/callback`) to handle the magic link token
- Supabase handles email sending — configure the email template in the dashboard

**Dependencies:** US-202

---

## Epic 3: Matcha Catalog

**Goal:** Users can browse, search, and view detail pages for matcha in the catalog.

**Sprint:** 1 (days 4-5, overlaps with auth)
**Total Estimate:** L (1.5 days)

---

### US-301: Browse Matcha Catalog
**Priority:** P0 | **Size:** M | **Sprint:** 1

**As a** user, **I want to** browse a list of matcha entries, **so that** I can discover matcha to try and log.

**Acceptance Criteria:**
- [ ] Given the `/catalog` page, when it loads, then I see a list/grid of matcha entries showing name, brand, region, and type
- [ ] Given the catalog, when there are 20+ entries, then the list is paginated or uses infinite scroll (max 20 per page)
- [ ] Given each catalog card, when displayed, then it shows the matcha type as a badge (ceremonial, premium, etc.)
- [ ] Given the catalog, when loaded on a 4G connection, then the page renders in under 2 seconds

**Technical Notes:**
- Server component: fetch from Supabase in `(main)/catalog/page.tsx`
- Use the `matcha-card.tsx` component stub
- Query: `matchas` where `submitted_by IS NULL OR is_approved = true`, ordered by name
- Pagination: use Supabase `.range(from, to)` with a page query param

**Dependencies:** US-101, US-103

---

### US-302: Search Catalog
**Priority:** P0 | **Size:** M | **Sprint:** 1

**As a** user, **I want to** search the catalog by name, brand, or region, **so that** I can quickly find a specific matcha.

**Acceptance Criteria:**
- [ ] Given the catalog page, when I type in the search bar, then results filter in real-time (debounced 300ms)
- [ ] Given a search for "Uji", when results load, then I see all matcha with "Uji" in name, brand, or region
- [ ] Given a search with no results, when displayed, then I see "No matcha found" with a suggestion to add a custom entry
- [ ] Given a search query, when I clear the search bar, then the full catalog is shown again

**Technical Notes:**
- Use Postgres full-text search via the GIN index: `.textSearch('search_index', query)`
- Alternatively, use Supabase `.ilike()` on name/brand/region for simpler implementation
- Search bar is a client component; results can be fetched via server action or client-side query
- Debounce with `useDeferredValue` or a custom `useDebounce` hook

**Dependencies:** US-301

---

### US-303: Matcha Detail Page
**Priority:** P0 | **Size:** S | **Sprint:** 1

**As a** user, **I want to** view detailed information about a specific matcha, **so that** I can decide if I want to try it.

**Acceptance Criteria:**
- [ ] Given the catalog, when I tap a matcha card, then I navigate to `/catalog/[id]`
- [ ] Given the detail page, when loaded, then I see: name, brand, region, type, description, and taste profile (if available)
- [ ] Given taste profile data exists, when displayed, then I see a mini radar chart or 5 horizontal bars showing the taste dimensions
- [ ] Given the detail page, when I tap "Log this matcha", then I am navigated to the log form pre-filled with this matcha

**Technical Notes:**
- Route stub exists at `(main)/catalog/[id]/page.tsx`
- Server component fetching by ID
- "Log this matcha" button passes `matcha_id` as a query param to `/log/new?matcha=<id>`

**Dependencies:** US-301

---

### US-304: Add Custom Matcha Entry
**Priority:** P1 | **Size:** M | **Sprint:** 2

**As a** user, **I want to** add a matcha that is not in the catalog, **so that** I can log any matcha I try.

**Acceptance Criteria:**
- [ ] Given the catalog or log flow, when I tap "Add custom matcha", then I see a form with fields: name (required), brand (required), region, type, description
- [ ] Given valid input, when I submit, then a new row is inserted in `matchas` with `submitted_by = my user ID` and `is_approved = false`
- [ ] Given my custom entry, when I view the catalog, then I can see my own entry (but others cannot until approved)
- [ ] Given my custom entry, when I start a new log, then my custom matcha appears in my search results

**Technical Notes:**
- RLS policy allows insert where `submitted_by = auth.uid()`
- Custom entries are visible to their creator via the `matchas_select` policy
- No admin approval UI in MVP — just the flag in the DB

**Dependencies:** US-301, US-201

---

## Epic 4: Matcha Logging

**Goal:** Users can log matcha with taste ratings, notes, and star rating. They can view, edit, and delete past logs.

**Sprint:** 2 (days 1-4)
**Total Estimate:** XL (2.5 days)

---

### US-401: Log Form — Taste Ratings & Star Rating
**Priority:** P0 | **Size:** L | **Sprint:** 2

**As a** user, **I want to** rate a matcha on 5 taste dimensions and give an overall star rating, **so that** I can record my tasting experience.

**Acceptance Criteria:**
- [ ] Given the `/log/new` page, when loaded, then I see 5 labeled sliders (umami, sweetness, bitterness, grassiness, creaminess) each defaulting to 3
- [ ] Given a slider, when I drag it, then the value updates in real-time showing the current value (1-5)
- [ ] Given the form, when displayed, then I see a 5-star rating input for overall rating
- [ ] Given the form, when displayed, then I see a text area for free-text notes (optional)
- [ ] Given the form, when I have not selected a matcha, then a "Select matcha" step is shown first (search + select from catalog)
- [ ] Given a `?matcha=<id>` query param, when the form loads, then the matcha is pre-selected and I go straight to the rating step

**Technical Notes:**
- Client component (interactive sliders and star input)
- Use the `taste-slider.tsx` and `star-rating.tsx` component stubs
- Two-step flow: (1) search & select matcha, (2) rate & submit
- Consider a stepper/wizard UI for mobile

**Dependencies:** US-302 (catalog search for matcha selection)

---

### US-402: Save Log to Database
**Priority:** P0 | **Size:** M | **Sprint:** 2

**As a** user, **I want to** save my matcha log, **so that** it is recorded and contributes to my taste profile.

**Acceptance Criteria:**
- [ ] Given a completed log form, when I tap "Save", then a row is inserted into `matcha_logs` with my user ID, matcha ID, 5 taste ratings, overall rating, notes, and auto-timestamp
- [ ] Given a successful save, when the insert completes, then the `recalculate_taste_profile` trigger fires and my `profiles` row is updated
- [ ] Given a successful save, then I see a success confirmation and am redirected to my log history
- [ ] Given a save failure (network error), when it occurs, then I see an error message and my form data is preserved (no data loss)
- [ ] Given the save, when checking the DB, then `created_at` is auto-populated with the current timestamp

**Technical Notes:**
- Use a Server Action that calls `supabase.from('matcha_logs').insert()`
- Validate all 5 taste ratings are 1-5 and overall_rating is 1-5 on the server side
- The trigger handles profile recalculation — no app-level code needed

**Dependencies:** US-401, US-101

---

### US-403: View Log History
**Priority:** P0 | **Size:** M | **Sprint:** 2

**As a** user, **I want to** see all my past matcha logs sorted by most recent, **so that** I can review my tasting history.

**Acceptance Criteria:**
- [ ] Given the `/log` page, when loaded, then I see a list of my logs sorted by `created_at DESC`
- [ ] Given each log entry, when displayed, then I see: matcha name, brand, overall star rating, date, and a preview of taste ratings
- [ ] Given I have no logs, when the page loads, then I see an empty state: "No logs yet — log your first matcha!" with a CTA button
- [ ] Given many logs, when scrolling, then the list is paginated or uses infinite scroll

**Technical Notes:**
- Server component with Supabase query joining `matcha_logs` and `matchas` (for name/brand)
- Use `.order('created_at', { ascending: false })` with `.range()` for pagination
- Index `idx_logs_user` ensures fast retrieval

**Dependencies:** US-402

---

### US-404: Edit or Delete a Log
**Priority:** P1 | **Size:** M | **Sprint:** 2

**As a** user, **I want to** edit or delete a past log, **so that** I can correct mistakes or remove entries.

**Acceptance Criteria:**
- [ ] Given a log in my history, when I tap it, then I see the full log detail with "Edit" and "Delete" actions
- [ ] Given I tap "Edit", when the edit form loads, then all fields are pre-populated with the existing values
- [ ] Given I update ratings and save, when the update completes, then the `recalculate_taste_profile` trigger fires and my profile is recalculated
- [ ] Given I tap "Delete", when I confirm the deletion, then the log is removed and my taste profile is recalculated
- [ ] Given a delete of my only log, when the profile recalculates, then my taste averages reset to 0 and log_count = 0

**Technical Notes:**
- Edit: Server Action calling `.update()` on `matcha_logs` where `id = log_id`
- Delete: Server Action calling `.delete()` on `matcha_logs` where `id = log_id`
- RLS ensures users can only update/delete their own logs
- Test the trigger edge case: deleting the last log should zero out the profile

**Dependencies:** US-403

---

## Epic 5: Taste Profile

**Goal:** Users can visualize their taste preferences as a radar chart that auto-updates with each log.

**Sprint:** 2 (days 3-5)
**Total Estimate:** L (1.5 days)

---

### US-501: Auto-Updating Taste Profile
**Priority:** P0 | **Size:** S | **Sprint:** 2

**As a** user, **I want** my taste profile to automatically update when I log matcha, **so that** my preferences are always current.

**Acceptance Criteria:**
- [ ] Given I save a new log, when I navigate to my profile, then the taste averages reflect the new log
- [ ] Given I have 5 logs and delete one, when I view my profile, then the averages are recalculated from the remaining 4 logs
- [ ] Given I edit a log's taste ratings, when I view my profile, then the averages reflect the updated values
- [ ] Given my profile page, when loaded, then I see my `log_count` displayed (e.g., "Based on 7 tastings")

**Technical Notes:**
- This is primarily a DB trigger (already designed in ADR-004). The app work is reading and displaying the profile.
- Fetch from `profiles` table where `id = auth.uid()`
- No app-level recalculation needed

**Dependencies:** US-402 (logs must be saveable for profile to update)

---

### US-502: Radar Chart Visualization
**Priority:** P0 | **Size:** M | **Sprint:** 2

**As a** user, **I want to** see my taste preferences as a radar/spider chart, **so that** I can quickly understand my palate.

**Acceptance Criteria:**
- [ ] Given the `/profile` page, when loaded, then I see a radar chart with 5 axes: umami, sweetness, bitterness, grassiness, creaminess
- [ ] Given my profile data, when the chart renders, then the shape reflects my average taste ratings
- [ ] Given I have 0 logs, when the chart renders, then it shows an empty state (flat shape or a message "Log matcha to build your profile")
- [ ] Given the chart, when viewed on mobile, then it is legible and fits within the viewport without horizontal scrolling
- [ ] Given the chart, when rendered, then it uses the matcha-green color palette

**Technical Notes:**
- Use the `radar-chart.tsx` component stub
- Library options: `recharts` (RadarChart), `chart.js` + `react-chartjs-2`, or a lightweight SVG implementation
- Prefer SVG-based for smaller bundle size and PWA performance
- Data: 5 values from `profiles` table (umami_avg, sweetness_avg, etc.)

**Dependencies:** US-501

---

### US-503: Compare Matcha to Profile
**Priority:** P1 | **Size:** M | **Sprint:** 2

**As a** user, **I want to** overlay a specific matcha's taste profile on my personal radar chart, **so that** I can see how it compares to my preferences.

**Acceptance Criteria:**
- [ ] Given a matcha detail page, when I tap "Compare to my profile", then I see a radar chart with two overlaid shapes: my profile (filled) and the matcha's profile (outline)
- [ ] Given the comparison chart, when displayed, then each shape is clearly labeled (e.g., "Your profile" vs. "Uji Hikari")
- [ ] Given a matcha with missing taste dimensions, when compared, then only available dimensions are plotted (or a note says "Incomplete data")
- [ ] Given the comparison, when viewed, then I can clearly see where the matcha differs from my preferences

**Technical Notes:**
- Reuse the radar chart component with a second data series
- Could be a modal overlay on the matcha detail page or a dedicated comparison view
- Matcha taste data is from the `matchas` table (baseline values)

**Dependencies:** US-502, US-303

---

## Epic 6: Recommendations

**Goal:** After 3+ logs, users see personalized matcha recommendations based on cosine similarity between their taste profile and the catalog.

**Sprint:** 3 (days 1-3)
**Total Estimate:** L (1.5 days)

---

### US-601: Recommendation Engine Integration
**Priority:** P0 | **Size:** M | **Sprint:** 3

**As a** developer, **I want** the recommendation service to call the `get_recommendations()` Postgres function, **so that** personalized suggestions are generated server-side.

**Acceptance Criteria:**
- [ ] Given a user with 3+ logs, when the service calls `get_recommendations(user_id, 5)`, then it returns up to 5 matcha entries sorted by similarity score
- [ ] Given a user with fewer than 3 logs, when the service is called, then it returns an empty array (gated by `log_count` check)
- [ ] Given returned recommendations, when inspected, then none of them are matcha the user has already logged
- [ ] Given returned recommendations, when inspected, then all have `confidence IN ('high', 'medium')` and complete taste profiles
- [ ] Given the function, when called, then it completes in under 200ms for a catalog of 100 entries

**Technical Notes:**
- Service stub exists at `src/services/recommendation-service.ts`
- Call via `supabase.rpc('get_recommendations', { p_user_id, p_limit })`
- Gate on `profiles.log_count >= 3` before calling the function
- The DB function handles exclusion of logged matcha and low-confidence entries

**Dependencies:** US-501 (profile must exist with log_count), US-103 (catalog must be seeded)

---

### US-602: Recommendation UI
**Priority:** P0 | **Size:** M | **Sprint:** 3

**As a** user, **I want to** see personalized matcha recommendations on the Recommendations tab, **so that** I can discover matcha that match my taste.

**Acceptance Criteria:**
- [ ] Given the `/recommendations` page, when I have 3+ logs, then I see 3-5 recommended matcha cards with name, brand, and a similarity indicator
- [ ] Given the recommendations, when displayed, then they are ordered by similarity (best match first)
- [ ] Given I have fewer than 3 logs, when the page loads, then I see "Log 3 matcha to unlock recommendations" with a progress indicator (e.g., "1 of 3")
- [ ] Given a recommendation card, when I tap it, then I navigate to the matcha detail page
- [ ] Given the similarity score, when displayed, then it is shown as a percentage or "match" label (e.g., "94% match"), not a raw decimal

**Technical Notes:**
- Route stub exists at `(main)/recommendations/page.tsx`
- Server component that fetches from the recommendation service
- Display similarity as `Math.round(similarity * 100)`
- Reuse `matcha-card.tsx` with an added match percentage badge

**Dependencies:** US-601

---

### US-603: "Log This One" Quick Flow
**Priority:** P0 | **Size:** S | **Sprint:** 3

**As a** user, **I want to** quickly start logging a recommended matcha, **so that** the journey from recommendation to log is seamless.

**Acceptance Criteria:**
- [ ] Given a recommendation card, when I tap "Log this one", then I navigate to `/log/new?matcha=<id>` with the matcha pre-selected
- [ ] Given the log form, when loaded via recommendation, then step 1 (matcha selection) is skipped and I go straight to rating
- [ ] Given I complete the log, when redirected to history, then I can return to recommendations and the just-logged matcha is no longer recommended

**Technical Notes:**
- Reuses the existing log form (US-401) with query param pre-fill
- After logging, the recommendation engine naturally excludes it on next load

**Dependencies:** US-602, US-401

---

## Epic 7: Content & Sharing

**Goal:** Users can browse articles about matcha and share styled tasting cards.

**Sprint:** 3 (days 3-5)
**Total Estimate:** L (2 days)

---

### US-701: Article Rendering with MDX
**Priority:** P1 | **Size:** M | **Sprint:** 3

**As a** user, **I want to** read articles about matcha, **so that** I can learn about origins, preparation, and pairings.

**Acceptance Criteria:**
- [ ] Given the `/discover` page, when loaded, then I see a list of published articles with title, category, summary, and published date
- [ ] Given an article card, when I tap it, then I see the full article rendered from MDX with proper typography and styling
- [ ] Given article categories, when displayed, then I can filter by category: pairing, preparation, origin, guide
- [ ] Given an unpublished article (`published_at IS NULL`), when any user browses, then it is not visible

**Technical Notes:**
- MDX files live at `src/content/articles/{slug}.mdx`
- Use `next-mdx-remote` or Next.js built-in MDX support
- Article metadata (title, category, summary) comes from the `articles` DB table; body from the MDX file
- Route stub exists at `(main)/discover/page.tsx`
- Need to create at least 3-5 seed articles for MVP

**Dependencies:** US-101 (articles table)

---

### US-702: Article Index & Category Filtering
**Priority:** P1 | **Size:** S | **Sprint:** 3

**As a** user, **I want to** browse articles by category, **so that** I can find content relevant to my interests.

**Acceptance Criteria:**
- [ ] Given the discover page, when loaded, then I see category filter chips (All, Pairing, Preparation, Origin, Guide)
- [ ] Given I tap a category, when the filter applies, then only articles of that category are shown
- [ ] Given the "All" filter, when active, then all published articles are displayed
- [ ] Given no articles in a category, when filtered, then I see "No articles yet in this category"

**Technical Notes:**
- Filter can be client-side (if article count is small) or use query params for server-side filtering
- Query: `articles` where `published_at IS NOT NULL` and optionally `category = ?`

**Dependencies:** US-701

---

### US-703: Generate Shareable Tasting Card
**Priority:** P1 | **Size:** L | **Sprint:** 3

**As a** user, **I want to** generate a styled card image of my matcha log, **so that** I can share my tasting experience.

**Acceptance Criteria:**
- [ ] Given a log in my history, when I tap "Share", then I see a preview of a styled card showing: matcha name, brand, star rating, taste radar mini-chart, notes snippet, and Whiskly branding
- [ ] Given the card preview, when displayed, then it uses the matcha-green color palette and looks polished
- [ ] Given the card, when generated, then it is a PNG image at a shareable resolution (1080x1080 or similar)
- [ ] Given the card, when generated, then it completes in under 3 seconds

**Technical Notes:**
- Use `html2canvas` (already in dependencies per npm audit mention) or `@vercel/og` for image generation
- `html2canvas` renders a hidden DOM element to canvas, then exports as PNG
- Alternative: use a server-side OG image route (`/api/og/log/[id]`) with `@vercel/og` (Satori) for consistent rendering
- Consider `@vercel/og` to avoid html2canvas vulnerabilities noted in recent-memory

**Dependencies:** US-403 (log history must exist)

---

### US-704: Save or Share Card via Native Share
**Priority:** P1 | **Size:** S | **Sprint:** 3

**As a** user, **I want to** save the tasting card to my device or share it via the native share sheet, **so that** I can post it on social media or send to friends.

**Acceptance Criteria:**
- [ ] Given the card preview, when I tap "Save to device", then the PNG image is downloaded to my device
- [ ] Given a device that supports the Web Share API, when I tap "Share", then the native share sheet opens with the image attached
- [ ] Given a device without Web Share API support, when displayed, then the "Share" button is hidden and only "Save" is shown
- [ ] Given the share action, when completed or cancelled, then I return to the card preview without errors

**Technical Notes:**
- Web Share API: `navigator.share({ files: [imageFile] })` — check `navigator.canShare` first
- Fallback: `<a download>` for saving the image
- PWA context may have better share support than browser context

**Dependencies:** US-703

---

## Technical Spikes

### SP-01: Supabase Local Dev & Client Integration
(Described above in Epic 1)

### SP-02: Radar Chart Library Evaluation
**Priority:** P0 | **Size:** S | **Sprint:** 1 (end of sprint)

**Goal:** Evaluate radar chart options and pick one before Sprint 2 starts.

**Options to evaluate:**
1. **Recharts** `<RadarChart>` — popular, well-documented, but large bundle
2. **Chart.js + react-chartjs-2** — flexible, moderate bundle
3. **Custom SVG** — smallest bundle, full control, more implementation effort
4. **Nivo** `<ResponsiveRadar>` — beautiful defaults, SSR-friendly

**Acceptance Criteria:**
- [ ] Given each option, measure: bundle size impact, mobile rendering quality, ease of overlaying two datasets (for US-503)
- [ ] Given the evaluation, produce a recommendation with rationale
- [ ] Given the chosen library, create a minimal working prototype in `radar-chart.tsx`

**Technical Notes:** Mobile performance is critical — test on throttled connection. Two-series overlay is required for the comparison feature (US-503).

---

## Future (P2+) Items

These items are out of MVP scope but should be designed with extensibility in mind. No full stories needed now.

| ID | Feature | Priority | Notes |
|----|---------|----------|-------|
| F1.4 | OAuth (Google) | P2 | Supabase supports it natively. Add a "Continue with Google" button to auth pages. |
| F5.4 | Dismiss recommendation | P2 | Add a `dismissed_recommendations` table or a column on a join table. Filter in `get_recommendations()`. |
| F6.3 | Tag articles by taste profile relevance | P2 | Schema already supports taste affinity ranges on `articles`. Build the matching query. |
| F3.6 | Photo upload with logs | P3 | Use Supabase Storage. Add `photo_url` column to `matcha_logs`. Resize client-side before upload. |
| — | Admin dashboard for catalog curation | P2 | Approve user-submitted matcha, edit catalog entries, manage articles. |
| — | Social features (follow, feed) | P3 | Would require `follows` table, feed aggregation, privacy controls. |
| — | Offline support (PWA) | P2 | Service worker caching for catalog, queue log submissions for sync. |

---

## Story Summary

| Epic | P0 Stories | P1 Stories | Total | Estimate |
|------|-----------|-----------|-------|----------|
| 1. Infrastructure | 3 + 1 spike | 0 | 4 | L |
| 2. Authentication | 3 | 1 | 4 | L |
| 3. Matcha Catalog | 3 | 1 | 4 | L |
| 4. Matcha Logging | 3 | 1 | 4 | XL |
| 5. Taste Profile | 2 | 1 | 3 | L |
| 6. Recommendations | 3 | 0 | 3 | L |
| 7. Content & Sharing | 0 | 4 | 4 | L |
| **Spikes** | 2 | 0 | 2 | M |
| **Total** | **19** | **8** | **28** | ~3 weeks |

### Sprint Allocation

**Sprint 1 (Week 1): Foundation + Auth + Catalog**
- SP-01, US-101, US-102, US-103
- US-201, US-202, US-203, US-204
- US-301, US-302, US-303
- SP-02
- **12 stories** | Exit: user can sign up, browse catalog

**Sprint 2 (Week 2): Logging + Profile**
- US-304 (custom matcha — P1)
- US-401, US-402, US-403, US-404
- US-501, US-502, US-503
- **8 stories** | Exit: user can log matcha, see profile radar chart

**Sprint 3 (Week 3): Recommendations + Content + Sharing**
- US-601, US-602, US-603
- US-701, US-702, US-703, US-704
- Bug fixes and polish
- **7 stories + polish** | Exit: full MVP feature-complete
