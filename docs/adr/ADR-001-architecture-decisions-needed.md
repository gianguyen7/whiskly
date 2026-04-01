# ADR-001: Architecture Decisions Needed Before Implementation

**Date:** 2026-03-31
**Status:** Proposed
**Deciders:** TBD

---

## Context

Whiskly is starting from scratch. Before writing application code, we need to make
foundational architecture decisions. This ADR catalogs the open decisions, their
tradeoffs, and recommended order of resolution.

## Decisions Required

### 1. What is the product?

**Must answer before anything else.** Fill out the PRFAQ and PRD.

- What problem are we solving?
- Who is the target user?
- What is the MVP scope?

### 2. Frontend Framework

| Option | Pros | Cons |
|--------|------|------|
| Next.js (React) | SSR/SSG, large ecosystem, Vercel hosting | Bundle size, React complexity |
| SvelteKit | Fast, small bundles, good DX | Smaller ecosystem, fewer hires |
| Plain HTML/HTMX | Simplest, no build step, fast | Limited interactivity, unconventional |

**Decision drivers:** Team expertise, interactivity needs, time to market.

### 3. Backend Framework / Language

| Option | Pros | Cons |
|--------|------|------|
| Node.js (Express/Fastify) | JS everywhere, fast prototyping | Callback complexity at scale |
| Python (FastAPI/Django) | Data ecosystem, readability | GIL for CPU work, two languages |
| Go | Performance, simple concurrency | Slower prototyping, less flexible |

**Decision drivers:** Team skills, performance needs, MVP speed.

### 4. Database

| Option | Pros | Cons |
|--------|------|------|
| PostgreSQL | Battle-tested, JSONB, full SQL | Operational overhead (self-hosted) |
| SQLite (via Turso/Litestream) | Zero ops for MVP, fast | Scaling limits, fewer managed options |
| Managed (Supabase/PlanetScale) | Zero ops, built-in auth/API | Vendor lock-in, cost at scale |

**Decision drivers:** Data model complexity, scale expectations, operational budget.

### 5. Hosting / Deployment

| Option | Pros | Cons |
|--------|------|------|
| Vercel/Netlify | Zero-config, great DX | Vendor lock-in, cost at scale |
| Railway/Render | Simple, supports backends | Less mature, limited regions |
| AWS/GCP (IaC) | Full control, scalable | Operational complexity, slower start |
| Docker + VPS | Cheap, portable | Manual ops, no auto-scaling |

**Decision drivers:** Budget, ops expertise, scaling timeline.

### 6. Authentication

| Option | Pros | Cons |
|--------|------|------|
| Auth provider (Clerk/Auth0/Supabase Auth) | Fast, secure by default | Cost, vendor dependency |
| Custom (JWT + sessions) | Full control, no vendor | Security risk, implementation time |
| OAuth only (Google/GitHub) | Simple, no passwords | Limits user base |

**Decision drivers:** User base, security requirements, speed.

### 7. Monorepo vs Polyrepo

| Option | Pros | Cons |
|--------|------|------|
| Monorepo (this repo) | Simple, atomic changes, shared tooling | CI complexity at scale |
| Polyrepo | Independent deploys, clear boundaries | Cross-repo changes are painful |

**Recommendation:** Start monorepo. Split later only if team or deploy cadence demands it.

### 8. API Style

| Option | Pros | Cons |
|--------|------|------|
| REST | Simple, well-understood, cacheable | Over/under-fetching |
| GraphQL | Flexible queries, typed schema | Complexity, caching harder |
| tRPC | End-to-end type safety (TS only) | TypeScript lock-in, less standard |

**Decision drivers:** Client needs, team familiarity, number of consumers.

## Recommended Resolution Order

```
1. Product definition (PRFAQ + PRD)        ← Unblocks everything
2. Frontend + Backend + Database choices    ← Unblocks dev environment
3. Hosting + Auth                           ← Unblocks deployment
4. Monorepo/API style                      ← Confirm or adjust defaults
```

## Follow-Up Actions

- [ ] Schedule architecture decision session
- [ ] Write individual ADRs for each decision made
- [ ] Update CI/CD pipeline after tech stack is chosen
