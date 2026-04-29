# Recent Memory

> Rolling 48-hour context window. Updated after each conversation.
> Important items get promoted to long-term memory nightly via `/consolidate-memory`.
> Loaded inline at conversation startup via CLAUDE.md.

---

## Last Updated: 2026-04-28

## Current Focus

- **Cha-dō UI redesign — major pass complete.** Splash, auth pages, For You, catalog, detail, profile, nav, and welcome modal all rebuilt in the Cha-dō editorial direction.
- **Remaining pages to redesign:** Journal/log, discover, recommendations, share card.
- **After redesign:** Wire Sprint 1 features (US-201 → US-202 → US-301/302 → US-303).

## Recent Decisions (Last 48hr)

- **Cha-dō chosen as production design direction** — Fraunces (serif display) + DM Sans (body) + DM Mono (labels), cream paper (#EFEAD8), deep matcha accent (#3F5A1A), editorial zen voice.
- **Replaced Geist + Nunito Sans fonts** with Fraunces + DM Sans + DM Mono across layout.tsx and globals.css.
- **Floating pill nav bar** — rounded-full bg-card container with gradient fade, central green "+" circle for Log. Tabs: Today, Catalog, Log, Journal, Me.
- **Dark splash page** — #2D4014 bg with Fraunces "whiskly." wordmark, decorative cup SVG, cream CTA.
- **3-second auth timeout in middleware** — `Promise.race` with 3s ceiling on `getUser()` to prevent 25s hangs when Supabase is unreachable.
- **Supabase was paused** — user confirmed it's back online now. Verify connectivity next session.

## Open Threads

- **Check Supabase project status** — was paused during this session. User says it's back online. Verify on next session start.
- **Integrate illustrated matcha tin SVGs** — 5 silhouettes (cylinder, canister, jar, pouch, tinbox) ready in Downloads/components/matcha-tins.jsx. Need to port to React components.
- **Remaining UI redesign pages:** journal/log, discover, recommendations, share card exist in mockups but not yet rebuilt.
- **Profile "Sign out" button** — currently posts to `/api/auth/logout` which doesn't exist. Needs to use existing `LogoutButton` component or server action.
- **DB migration needed:** add `price_per_gram`, `good_for`, `milk_pairing` columns + seed data.
- **Sprint 1 wiring (after redesign):** critical path is US-201 → US-202 → US-301/US-302 → US-303.
- **Next.js 16 deprecation:** `middleware` file → rename to `proxy` before v1.0.
- **npm audit — 6 high severity:** (1) `next@16.2.2` DoS → bump to 16.2.3. (2) `serialize-javascript` ≤7.0.4 → waiting on upstream `@ducanh2912/next-pwa` fix.

## Blockers / Watch Items

- Supabase connectivity — verify on next session.
