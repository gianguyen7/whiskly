# Session Plan: 2026-04-09 — What's Left + UI/UX Deep Dive

## Current Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0: Foundation | Done | Repo structure, templates, CONTRIBUTING.md |
| Phase 1: Product Definition | ~80% | PRFAQ, PRD, personas, epics done; user stories + roadmap remaining |
| Phase 2: Technical Design | ~50% | Stack decided, schema designed, Next.js scaffolded; Supabase project, CI, dev env remaining |
| Phase 3: MVP Build | Not started | Route stubs exist but nothing wired to real DB |
| Phase 4-6 | Not started | — |

The app has scaffolded routes and components but everything hits stub services returning empty arrays. No real Supabase connection, no seed data, no working auth flow yet.

---

## What Still Needs Doing

### Phase 1 Remainders (small)

1. Write 5-10 core user stories with acceptance criteria (partially covered by epic breakdown, not standalone story cards)
2. Sketch a roadmap for Phases 2-4

### Phase 2 Remainders (medium)

3. ~~Create Supabase project + run `001_initial_schema.sql` migration~~ ✅ done (2026-04-11) — project `fdayixiwxwligrxutmro`, schema + RLS + triggers + RPC all live
4. ~~Verify local dev with `supabase start`~~ — skipped; no Docker on this machine. Hosted project is the dev environment. Revisit if we need a fully offline dev loop.
5. ~~Seed catalog with 20-30 real matcha entries~~ ✅ done — 24 entries live (13 ceremonial, 5 premium, 3 latte, 3 culinary)
6. ~~Configure CI (lint + test + build on PR)~~ ✅ done — `.github/workflows/ci.yml` runs eslint + tsc + next build on push/PR; `npm run ci` runs the same locally
7. ~~Link Vercel to GitHub repo~~ ✅ done — deployed at https://whiskly-puce.vercel.app (auto-deploy on push to main, preview deploys per PR)
8. ~~Write `scripts/setup.sh` and README dev setup instructions~~ ✅ done — idempotent setup script + README section covering prereqs, first-run, and provisioning

### Phase 3 — Sprint 1 (the real build)

9. Wire auth (signup, login, logout, password reset) to real Supabase
10. Wire catalog browsing/search to real data
11. Build matcha detail page with real content

### Phase 3 — Sprint 2

12. Log form + save log to DB
13. Taste profile auto-calculation
14. Radar chart with real data
15. Log history + edit/delete

### Phase 3 — Sprint 3

16. Recommendation engine + UI
17. Article rendering + index
18. Share card generation

---

## UI/UX Design Focus

The current UI is functional scaffolding — default Tailwind with minimal design. Before building Sprint 1 for real, nail down the visual language.

### 1. Design System Definition

Finalize color tokens (matcha palette started in `globals.css`), typography scale, spacing, border-radius, shadows. Document in `docs/design/DESIGN-SYSTEM.md`.

### 2. Component Library

Design the core reusable pieces:

- **Card component** — matcha card in catalog, log card in history
- **Form inputs** — text, select, star rating, taste sliders
- **Bottom nav** — already exists, needs polish
- **Empty states** — what users see before they have data
- **Loading skeletons** — perceived performance
- **Toast/notification patterns** — feedback on actions

### 3. Screen-by-Screen Wireframes

Extend existing `WIREFRAMES-sprint-1.md` to cover all screens:

- Auth screens (login, signup, forgot password)
- Catalog list + detail
- Log form (most interaction-heavy screen)
- Profile with radar chart
- Recommendations feed
- Discover/articles

### 4. Interaction Patterns

Decide on:

- Page transitions / navigation feel
- Pull-to-refresh behavior
- Matcha search UX (instant filter vs. submit)
- Taste rating input (sliders vs. discrete buttons vs. drag)
- Radar chart interactivity

### 5. Logo Integration

Teal brushstroke swirl + Nunito Sans 600 is chosen. Integrate into:

- App header
- Splash/loading screen
- Favicon (already generated)
- Auth screens branding
