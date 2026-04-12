# Whiskly

> **Status:** Phase 2 — Technical Design (nearly complete) + Sprint 1 build pending

A matcha discovery & logging PWA. Log what you taste, see your palate
visualized as a radar chart, and get personalized matcha recommendations.

Built with Next.js 16 (App Router), Supabase, Tailwind v4, and `@ducanh2912/next-pwa`.

---

## What's Here

```
.github/          GitHub workflows, PR template, issue templates
docs/
  adr/            Architecture Decision Records
  design/         Design system, wireframes, logo explorations
  epics/          Epic breakdown
  product/        Execution plan, roadmap, PRDs, PRFAQ
  runbooks/       Operational runbooks
  stories/        Standalone user story cards
  templates/      Reusable doc templates (PRD, PRFAQ, ADR, etc.)
memory/           Rolling + long-term memory layer
src/              Next.js App Router source code
supabase/         Supabase migrations, seed data, local config
scripts/          Build, deploy, and utility scripts
tests/            Unit, integration, and E2E tests (empty — pending Sprint 1)
```

---

## Getting Started

### Prerequisites

- **Node.js 22+** (CI runs 22; mismatched versions cause drift)
- **Git**
- **Supabase CLI** (optional but recommended for migrations):
  - macOS: `brew install supabase/tap/supabase`
  - Other: see https://supabase.com/docs/guides/local-development/cli/getting-started

### First-run setup

```bash
git clone <repo-url> whiskly
cd whiskly
./scripts/setup.sh
```

`scripts/setup.sh` is idempotent. It will:

1. Verify required tools and Node version
2. Install npm dependencies via `npm ci`
3. Create `.env.local` from `.env.example` if missing
4. Run lint + typecheck as a smoke test
5. Print next-step commands

### Configure Supabase credentials

Open `.env.local` and fill in the two values. Find them in the
[Supabase dashboard](https://supabase.com/dashboard) → your project →
Settings → API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

### Applying schema / seed to a fresh Supabase project

If you're provisioning a new Supabase project, from an authenticated CLI:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                      # applies supabase/migrations/
psql "$DATABASE_URL" -f supabase/seed.sql   # optional — seed 24 matchas
```

The linked project for the current team is tracked in
`supabase/config.toml`. Migration state is visible via
`supabase migration list`.

---

## Useful commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Next.js dev server (Turbopack) on :3000 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run ci` | Full local CI: lint + typecheck + build |
| `./scripts/setup.sh` | Re-run setup (idempotent) |
| `supabase migration list` | Show local vs remote migration state |
| `supabase db push` | Apply pending migrations to the linked remote |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions,
PR guidelines, and code review standards.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [Execution Plan](docs/product/EXECUTION-PLAN.md) | Phased plan from idea to launch |
| [Roadmap](docs/product/ROADMAP.md) | Versioned release plan (v0.1 → v2.0) |
| [PRD — Whiskly MVP](docs/product/PRD-whiskly-mvp.md) | Product requirements for the MVP |
| [Epic breakdown](docs/epics/EPIC-whiskly-mvp.md) | Sprint plan with 28 stories |
| [User stories](docs/stories/README.md) | Standalone story cards for Sprint 1-3 |
| [Design system](docs/design/DESIGN-SYSTEM.md) | Visual language, tokens, component specs |
| [ADR-002 — Tech stack](docs/adr/ADR-002-tech-stack.md) | Next.js + Supabase + Vercel + Tailwind |
| [ADR-004 — Database schema](docs/adr/ADR-004-database-schema.md) | Full schema with triggers, RLS, recommendations |
| [Testing Strategy](docs/testing-strategy.md) | Test philosophy, pyramid, and coverage targets |
| [Deployment Flow](docs/deployment-flow.md) | Environments, pipeline, and release process |
| [Contributing](CONTRIBUTING.md) | Engineering standards and conventions |
