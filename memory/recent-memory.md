# Recent Memory

> Rolling 48-hour context window. Updated after each conversation.
> Important items get promoted to long-term memory nightly via `/consolidate-memory`.
> Loaded inline at conversation startup via CLAUDE.md.

---

## Last Updated: 2026-04-12

## Current Focus

- **Phase 1 complete.** All product-definition deliverables shipped.
- **Phase 2 complete.** Supabase provisioned, CI green, Vercel linked and deployed.
- **Next:** UI redesign pass (before Sprint 1 wiring). Design system is ready in `docs/design/DESIGN-SYSTEM.md`.

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

- ~~**Supabase email confirmation:**~~ **Resolved 2026-04-12.** Toggled off in dashboard. Auto-confirm is now active.
- **UI redesign first, then wire.** User wants to redesign the UI before starting Sprint 1 feature wiring. Design system is in `docs/design/DESIGN-SYSTEM.md`.
- **Sprint 1 wiring (after redesign):** critical path is US-201 → US-202 → US-301/US-302 → US-303. Backend is ready; only app wiring remains.
- **Next.js 16 deprecation:** `middleware` file → rename to `proxy` before v1.0.
- **PRD open questions:** Q4 (OAuth — Google is P2), Q5 (recommendation explanation UX).
- **npm audit — 6 high severity:** (1) `next@16.2.2` DoS via Server Components → fix: bump to 16.2.3. (2) `serialize-javascript` ≤7.0.4 RCE + CPU DoS → transitive via `@ducanh2912/next-pwa` → `workbox-build` → `@rollup/plugin-terser`; waiting on upstream fix. **Not** `html2canvas` as previously noted.

## Blockers / Watch Items

- None currently.
