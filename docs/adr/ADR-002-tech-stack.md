# ADR-002: Tech Stack Selection

**Date:** 2026-04-01
**Status:** Proposed
**Deciders:** Gia Nguyen

---

## Context

Whiskly is a matcha tracking PWA for friends-and-family launch (<50 users). It needs:
user accounts, a searchable catalog, taste profile visualization, cosine-similarity
recommendations, shareable card image generation, and markdown-based content. Solo
developer, optimizing for speed to launch and minimal ops burden.

## Decision Drivers

- **Solo dev velocity** — fewer moving parts, less context-switching
- **Zero ops** — no servers to manage, no database to administer
- **Free at launch scale** — <50 users should cost $0/month
- **PWA capable** — installable, offline-friendly, app-like on mobile
- **Migration path** — not permanently locked to any vendor

## Options Considered

### Option A: Next.js + Supabase + Vercel (Recommended)

**Description:** Full-stack JavaScript with managed services.

| Component | Choice | Free Tier Limits |
|-----------|--------|------------------|
| Framework | Next.js 14+ (App Router) | N/A |
| Language | TypeScript | N/A |
| Database + Auth | Supabase (Postgres) | 500MB DB, 50K MAU, 1GB storage |
| Hosting | Vercel | 100GB bandwidth, serverless functions |
| Styling | Tailwind CSS | N/A |
| Charts | Recharts or Chart.js | N/A |
| Card generation | html2canvas (client-side) | N/A |
| Content | MDX files in repo | N/A |

| Pros | Cons |
|------|------|
| Single language (TS) across full stack | Vercel vendor lock-in for hosting |
| Supabase handles auth + DB + RLS in one service | Supabase has a learning curve for RLS policies |
| Vercel deploys in seconds, preview URLs on PR | Next.js App Router is newer, some rough edges |
| Excellent PWA support via next-pwa | Two vendor dependencies (Vercel + Supabase) |
| Free tier covers 50x our launch scale | Moving off Supabase later requires auth migration |
| Large ecosystem, easy to hire for later | |

**Estimated effort:** 0.5 days for initial setup (project scaffold, Supabase project, Vercel link)
**Operational cost:** $0/month at launch scale

### Option B: SvelteKit + Supabase + Vercel

**Description:** SvelteKit instead of Next.js for smaller bundles and simpler reactivity.

| Pros | Cons |
|------|------|
| Smaller bundle size, faster load times | Smaller ecosystem, fewer examples |
| Simpler reactivity model than React | Fewer component libraries (charts, UI kits) |
| Good PWA support | Harder to find help / hire later |
| Less boilerplate than React | Svelte 5 (runes) is very new, docs still catching up |

**Estimated effort:** 0.5 days setup, but slower ongoing due to fewer examples to reference
**Operational cost:** $0/month

### Option C: Django + HTMX + SQLite + Railway

**Description:** Python backend with server-rendered HTML and minimal JavaScript.

| Pros | Cons |
|------|------|
| Python is better for scraping pipeline | Two languages (Python backend, JS for charts/canvas) |
| Django has built-in auth, admin panel | HTMX limits interactivity (radar charts, sliders) |
| SQLite is zero-ops | PWA support is manual — no framework help |
| Railway is simple for Python hosting | Card image generation harder server-side |
| Django admin is free catalog management | Slower iteration on UI compared to React/Svelte |

**Estimated effort:** 1 day setup
**Operational cost:** $0-5/month (Railway free tier is limited)

## Decision

**Option A: Next.js + Supabase + Vercel.**

Rationale:
- TypeScript everywhere minimizes context-switching for a solo dev
- Supabase collapses auth + database + storage into one service with generous free tier
- Vercel is the lowest-friction hosting for Next.js — push to deploy
- The vendor lock-in risk is acceptable at this scale. If Whiskly outgrows free tiers,
  the migration path is clear: Postgres is portable, Next.js runs on any Node host,
  auth can be swapped to NextAuth
- The scraping pipeline runs separately as Python scripts (one-time, local), so the
  "Python is better for scraping" advantage of Option C still applies

## Consequences

### Positive
- Auth, database, hosting are all set up in < 1 day
- Zero monthly cost at launch
- Preview deployments on every PR for free
- Type safety on taste vectors reduces bugs in recommendation logic

### Negative
- Two vendor dependencies (Vercel + Supabase)
- Need to learn Supabase RLS if we want row-level security
- Next.js App Router has some patterns that differ from Pages Router docs/tutorials

### Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Supabase free tier limits hit | Low (need 50K MAU) | Medium | Monitor usage; upgrade to $25/mo Pro if needed |
| Vercel cold starts on serverless | Low | Low | Recommendation computation is lightweight |
| html2canvas rendering inconsistencies | Medium | Low | Fallback to server-side canvas if needed |
| Next.js App Router breaking changes | Low | Medium | Pin Next.js version, upgrade deliberately |

## Follow-Up Actions

- [ ] Create Next.js project with TypeScript + Tailwind + PWA config
- [ ] Create Supabase project and design initial schema
- [ ] Link Vercel to this GitHub repo
- [ ] Write ADR-003 for catalog seeding pipeline
- [ ] Add Supabase + Vercel setup instructions to README
