# User Story: Personalized Recommendations

**ID:** US-602
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 3 (MVP)
**Status:** Ready

---

## Story

**As a** user with a taste profile,
**I want to** see matcha recommendations personalized to my palate,
**so that** I can discover new matcha I'm likely to enjoy without manual
browsing.

## Acceptance Criteria

- [ ] **Given** I have 3 or more logs, **when** I visit `/recommendations`,
      **then** I see 3–5 matcha cards ordered by similarity to my taste
      profile (best match first).
- [ ] **Given** each recommendation card, **when** displayed, **then** it
      shows name, brand, type, and a "match" label as a percentage
      (e.g., "94% match") — never a raw decimal.
- [ ] **Given** a recommendation, **when** I tap the card, **then** I navigate
      to the matcha detail page (`/catalog/[id]`).
- [ ] **Given** a recommendation card, **when** I tap "Log this one", **then**
      I navigate to `/log/new?matcha=<id>` with step 1 skipped (handled by
      US-603).
- [ ] **Given** I have fewer than 3 logs, **when** I visit the page,
      **then** I see a locked state: "Log N more matcha to unlock
      personalized recommendations" with a progress bar and CTA to `/log/new`.
- [ ] **Given** I've already logged a matcha, **when** recommendations fetch,
      **then** that matcha is excluded from the result set.
- [ ] **Given** a matcha in the catalog with `confidence = 'low'` or missing
      taste data, **when** recommendations compute, **then** it is excluded.
- [ ] **Given** the recommendation fetch, **when** it executes, **then** it
      completes in under 500ms end-to-end on a 100-entry catalog.

## Context

Recommendations are the "aha moment" — the first time the app does
something the user couldn't do themselves. Gating behind 3 logs protects
the UX: one log doesn't yield meaningful similarity scores, and showing
bad recommendations early will teach users to ignore the feature. The
cosine-similarity approach (ADR-004) is intentionally simple for MVP;
the DB does the heavy lifting.

## Design

- Route: `/recommendations` (stub exists).
- Layout:
  - Header: "For your taste"
  - 3–5 stacked matcha cards (reuses `MatchaCard` with added match
    percentage badge)
  - Match badge: pill, matcha-600 bg, white text, top-right of the card
- Locked state:
  - Progress indicator (e.g., filled circles: ● ● ○ for 2 of 3)
  - Primary CTA: "Log a matcha" → `/log/new`
- See DESIGN-SYSTEM.md §9.2 (card) and §9.4 (pill).

## Technical Notes

- Server component in `src/app/(main)/recommendations/page.tsx`.
- Fetch via `supabase.rpc('get_recommendations', { p_user_id, p_limit: 5 })`.
- Gate on `profiles.log_count >= 3` before calling the RPC (save a round
  trip).
- Display similarity as `Math.round(similarity * 100)`. Raw scores
  (0.0–1.0) are not user-friendly.
- Service stub: `src/services/recommendation-service.ts`.
- The DB function handles "already logged" and confidence filtering.

## Out of Scope

- Explaining *why* a matcha was recommended (PRD open question Q5).
- Feedback mechanism ("not for me" → adjust future recommendations).
- Recommendations on the home screen.
- Trending / most-logged feed.

## Estimation

- **Size:** M (~4 hours)
- **Complexity Notes:** The backend function is already designed. The app
  work is fetching, mapping similarity to percentage, and building the
  locked state with a decent progress indicator. Polishing the match badge
  placement on the card takes longer than expected.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-501 (Taste profile)               | Blocked by | Ready |
| US-601 (Recommendation RPC)          | Blocked by | Ready |
| `get_recommendations()` DB function  | Blocked by | Ready |
| Seeded catalog with taste data       | Blocked by | Not started |

## Test Scenarios

| # | Scenario                      | Steps                                                          | Expected Result |
|---|-------------------------------|----------------------------------------------------------------|-----------------|
| 1 | Locked state (0 logs)         | New user → `/recommendations`                                  | "Log 3 more" message, progress 0/3 |
| 2 | Locked state (2 logs)         | Save 2 logs → `/recommendations`                               | "Log 1 more" message, progress 2/3 |
| 3 | Unlocked happy path           | Save 3 logs → `/recommendations`                               | 3–5 cards with match percentages |
| 4 | Order                         | Inspect the response                                           | Cards sorted similarity DESC |
| 5 | Exclusion of logged matcha    | Log matcha A → `/recommendations`                              | A not in the list |
| 6 | Exclusion of low-confidence   | Seed a low-confidence matcha                                   | Not in the list |
| 7 | Navigation                    | Tap a card                                                     | Navigate to `/catalog/[id]` |
| 8 | Latency                       | Measure end-to-end on 100-entry catalog                        | < 500ms |
