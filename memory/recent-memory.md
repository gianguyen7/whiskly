# Recent Memory

> Rolling 48-hour context window. Updated after each conversation.
> Important items get promoted to long-term memory nightly via `/consolidate-memory`.
> Loaded inline at conversation startup via CLAUDE.md.

---

## Last Updated: 2026-04-11

## Current Focus

- **Phase 1 complete.** All product-definition deliverables shipped.
- **Phase 2 complete.** Supabase provisioned, CI green, Vercel linked and deployed.
- **Next:** Phase 3 Sprint 1 — start with US-201 (wire signup to real Supabase).

## Recent Decisions (Last 48hr)

- **Design system v0.1** shipped (`docs/design/DESIGN-SYSTEM.md`): color tokens, typography scale, spacing, components, motion, a11y
- **Token policy:** keep Tailwind `gray-*` for text emphasis; use `warm-*` for surfaces, borders, dividers (OQ#1)
- **Icon library:** migrated inline SVGs to `lucide-react` v1.8.0 (OQ#2)
- **Dark mode:** deferred to post-MVP; token scaffolding exists commented-out in `globals.css` (OQ#3)
- **User stories:** 8 standalone cards in `docs/stories/` covering the MVP critical path
- **Roadmap:** versioned v0.1 → v2.0 in `docs/product/ROADMAP.md`
- **Supabase layout:** moved `infra/supabase/` → `supabase/` (standard CLI convention)
- **Supabase provisioning:** hosted project `fdayixiwxwligrxutmro` was already fully provisioned in a prior session. Schema, RLS, triggers, `get_recommendations()` RPC, and 24 seeded matcha entries all live. Migration history repaired via `supabase migration repair --status applied 001`.
- **CI:** real pipeline now — `.github/workflows/ci.yml` runs eslint + `tsc --noEmit` + `next build` with placeholder Supabase env vars. `npm run ci` runs the same locally.
- **Dev setup:** `scripts/setup.sh` is idempotent and gets a fresh clone to a lint-clean state in <10s. README has full prerequisites, first-run, and fresh-project provisioning sections.
- **Vercel:** linked to `gianguyen7/whiskly` GitHub repo via web dashboard; auto-deploy on push to main; preview deploys per PR. Live at **https://whiskly-puce.vercel.app**. Supabase env vars are set in Vercel project settings (Prod + Preview + Dev).

## Open Threads

- **Supabase email confirmation:** still enabled on the project (`mailer_autoconfirm: false`). Per US-201 technical notes, MVP should auto-confirm. Either toggle it off in the dashboard (Authentication → Providers → Email → disable "Confirm email") OR update US-201 to keep confirmations on.
- **Sprint 1 start:** critical path is US-201 → US-202 → US-301/US-302 → US-303. Backend is ready; only app wiring remains.
- **Next.js 16 deprecation:** `middleware` file → rename to `proxy` before v1.0.
- **PRD open questions:** Q4 (OAuth — Google is P2), Q5 (recommendation explanation UX).
- **html2canvas vulnerability warnings:** 5 high severity in `npm audit` (upstream, not ours to fix).

## Blockers / Watch Items

- None currently.
