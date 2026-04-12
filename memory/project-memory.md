# Project Memory

> Active project state, architecture snapshots, and work-in-progress tracking.
> Updated after significant milestones. Source of truth for "where are we?"

---

## Last Updated: 2026-04-01

## Project: Whiskly

**One-liner:** Personal matcha tracker with taste profiling and smart recommendations.

## Phase Status

| Phase | Status | Key Artifact |
|-------|--------|-------------|
| Phase 0: Foundation | Complete | Repo structure, templates, CONTRIBUTING.md |
| Phase 1: Product Definition | ~80% complete | PRFAQ + PRD done, user stories + roadmap remaining |
| Phase 2: Technical Design | ~40% complete | ADR-002 (stack), ADR-003 (seeding), ADR-004 (schema) done |
| Phase 3: MVP Build | Not started | — |
| Phase 4: Polish & Harden | Not started | — |
| Phase 5: Launch | Not started | — |

## Architecture Snapshot

```
Browser (PWA)
  ↕ HTTPS
Next.js on Vercel (SSR + API routes)
  ↕ Supabase JS client
Supabase (Postgres + Auth + RLS)
```

- **Frontend:** Next.js 14+ App Router, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes (no separate server)
- **Database:** Supabase Postgres with 4 tables: matchas, profiles, matcha_logs, articles
- **Auth:** Supabase Auth (email/password)
- **Hosting:** Vercel (free tier)
- **Content:** MDX in repo, metadata indexed in articles table

## Database Tables

| Table | Rows (est.) | Purpose |
|-------|-------------|---------|
| `matchas` | ~100 at launch | Global catalog + user-submitted entries |
| `profiles` | 1 per user | Materialized taste averages, auto-created on signup |
| `matcha_logs` | ~3-10 per user | Individual tastings with 5 taste dimensions |
| `articles` | ~5-10 at launch | Content metadata for taste-based filtering |

## Key Functions

- `handle_new_user()` — trigger: auto-creates profile on signup
- `recalculate_taste_profile()` — trigger: updates materialized averages on log CRUD
- `get_recommendations()` — function: cosine similarity, excludes low-confidence + already-logged

## Catalog Seeding Pipeline

```
Yunomi (numerical) → normalize to 1-5 → high confidence
Kettl/Sazen/Ippodo (prose) → LLM extraction → medium confidence
Reddit (Arctic Shift) → validation/boost → confidence adjustment
Manual (Gia, 3-4 entries) → high confidence
→ Deduplicate → catalog.json → seed Supabase
```

## File Inventory (Key Files)

| File | Purpose |
|------|---------|
| `docs/product/PRFAQ-whiskly.md` | Product vision and customer framing |
| `docs/product/PRD-whiskly-mvp.md` | 27 requirements, 4 user flows, success metrics |
| `docs/product/EXECUTION-PLAN.md` | 6-phase plan from foundation to launch |
| `docs/adr/ADR-002-tech-stack.md` | Next.js + Supabase + Vercel decision |
| `docs/adr/ADR-003-catalog-seeding-pipeline.md` | Scraping sources and pipeline design |
| `docs/adr/ADR-004-database-schema.md` | Full schema with triggers, RLS, recommendations |
| `supabase/migrations/001_initial_schema.sql` | Runnable migration |
| `scripts/seed-catalog/README.md` | Pipeline instructions |
