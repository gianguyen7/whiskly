# Recent Memory

> Rolling 48-hour context window. Updated after each conversation.
> Important items get promoted to long-term memory nightly via `/consolidate-memory`.
> Loaded inline at conversation startup via CLAUDE.md.

---

## Last Updated: 2026-04-11

## Current Focus

- Phase 1 complete: all product-definition deliverables shipped
- Phase 2 ~85% complete: Supabase fully provisioned; CI + Vercel + setup script remaining
- Next: CI workflow, Vercel linking, dev setup script, then Sprint 1 build

## Recent Decisions (Last 48hr)

- **Design system v0.1** shipped (`docs/design/DESIGN-SYSTEM.md`): color tokens, typography scale, spacing, components, motion, a11y
- **Token policy:** keep Tailwind `gray-*` for text emphasis; use `warm-*` for surfaces, borders, dividers (OQ#1)
- **Icon library:** migrated inline SVGs in `nav.tsx` and `catalog-client.tsx` to `lucide-react` v1.8.0 (OQ#2)
- **Dark mode:** deferred to post-MVP; token scaffolding exists as commented-out `@media (prefers-color-scheme: dark)` block in `globals.css` (OQ#3)
- **User stories:** 8 standalone story cards in `docs/stories/` covering the MVP critical path (US-201, US-202, US-301, US-302, US-401, US-402, US-501, US-602)
- **Roadmap:** versioned v0.1 alpha → v1.0 MVP → v1.1 harden → v2.0 social-vs-expertise in `docs/product/ROADMAP.md`
- **Supabase project layout:** moved `infra/supabase/` → `supabase/` (standard CLI convention); `infra/` directory removed; all doc references updated
- **Supabase provisioning:** discovered the hosted project (`fdayixiwxwligrxutmro`) was already fully provisioned in a prior session — schema, RLS, triggers, `get_recommendations` RPC, and 24 seeded matcha entries all live. Marked migration 001 as applied via `supabase migration repair --status applied 001`.

## Open Threads

- **Phase 2 remaining:** CI workflow (lint + test + build on PR), Vercel ↔ GitHub link, `scripts/setup.sh`, README dev setup section
- **Local dev without Docker:** Docker isn't installed on this machine, so `supabase start` (local stack) isn't available. Currently using the hosted project as the dev environment. Revisit if we need a fully offline loop.
- **PRD open questions:** Q4 (OAuth — Google is P2), Q5 (recommendation explanation UX)
- **html2canvas vulnerability warnings:** 5 high severity in `npm audit` (upstream dep issues, not ours to fix)
- **Next.js 16 middleware → proxy migration:** may be needed before v1.0

## Blockers / Watch Items

- None currently
