# Whiskly

> **Status:** Phase 0 — Foundation

Product definition and implementation have not started yet. This repo contains
the project scaffolding, documentation templates, and engineering conventions.

## What's Here

```
.github/          GitHub workflows, PR template, issue templates
docs/
  adr/            Architecture Decision Records
  product/        Execution plan, roadmap, PRDs
  runbooks/       Operational runbooks
  templates/      Reusable doc templates (PRD, PRFAQ, ADR, etc.)
src/              Application source code (Next.js App Router)
supabase/         Supabase migrations, seed data, local config
scripts/          Build, deploy, and utility scripts
tests/            Unit, integration, and E2E tests
```

## Getting Started

> Development environment setup will be added in Phase 2 after architecture
> decisions are made. See [ADR-001](docs/adr/ADR-001-architecture-decisions-needed.md).

## Next Steps

1. **Define the product** — Write the [PRFAQ](docs/templates/PRFAQ.md) and [PRD](docs/templates/PRD.md)
2. **Make architecture decisions** — Resolve open questions in [ADR-001](docs/adr/ADR-001-architecture-decisions-needed.md)
3. **Set up dev environment** — Configure tooling for chosen stack
4. **Build MVP** — Implement core user stories

See the full [Execution Plan](docs/product/EXECUTION-PLAN.md) for the phased roadmap.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions,
PR guidelines, and code review standards.

## Documentation

| Document | Purpose |
|----------|---------|
| [Execution Plan](docs/product/EXECUTION-PLAN.md) | Phased plan from idea to launch |
| [ADR-001](docs/adr/ADR-001-architecture-decisions-needed.md) | Open architecture decisions |
| [Testing Strategy](docs/testing-strategy.md) | Test philosophy, pyramid, and coverage targets |
| [Deployment Flow](docs/deployment-flow.md) | Environments, pipeline, and release process |
| [Contributing](CONTRIBUTING.md) | Engineering standards and conventions |
