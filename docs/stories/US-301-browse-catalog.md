# User Story: Browse Matcha Catalog

**ID:** US-301
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 1 (MVP)
**Status:** Ready

---

## Story

**As a** user,
**I want to** browse a list of matcha entries with name, brand, and type,
**so that** I can discover matcha to try and log.

## Acceptance Criteria

- [ ] **Given** I visit `/catalog`, **when** the page loads, **then** I see a
      scrollable list of matcha cards each showing name, brand, region (if
      present), and a type badge.
- [ ] **Given** the catalog has more than 20 entries, **when** I reach the end
      of the page, **then** I can load more (via a "Load more" button or
      infinite scroll) with 20 per page.
- [ ] **Given** each card, **when** rendered, **then** the matcha type
      (ceremonial / premium / culinary / latte / other) appears as a pill
      using the matcha-100 background.
- [ ] **Given** the catalog is empty (no seeded data), **when** the page loads,
      **then** I see a friendly empty state: "The catalog is being prepared.
      Check back soon."
- [ ] **Given** a 4G connection, **when** I navigate to `/catalog`, **then**
      the page becomes interactive in under 2 seconds.
- [ ] **Given** I tap a card, **when** the tap registers, **then** I navigate
      to `/catalog/[id]` for that matcha (US-303).

## Context

The catalog is the primary discovery surface. Before recommendations
unlock (after 3 logs), it's the user's only way to find matcha to log —
so the browsing experience directly affects engagement. The design
philosophy (DESIGN-SYSTEM §1) says content should be the loudest thing
on screen: the cards are the hero of this view.

## Design

- Route: `/catalog` (stub exists, partially wired in
  `src/app/(main)/catalog/page.tsx` and `catalog-client.tsx`).
- Layout: single column, `max-w-2xl`, `gap-3` between cards.
- Card: uses `MatchaCard` component (already built). See DESIGN-SYSTEM.md §9.2.
- Empty state: see DESIGN-SYSTEM.md §9.8.
- Load more CTA: secondary button below the list.

## Technical Notes

- Server component in `src/app/(main)/catalog/page.tsx` fetches initial
  page from Supabase.
- Query: `matchas` where `submitted_by IS NULL OR is_approved = true`,
  ordered by `name ASC`, with `.range(from, to)` for pagination.
- Page state lives in the URL (`?page=2`) so back navigation restores it.
- Service stub: `src/services/matcha-service.ts`.

## Out of Scope

- Search and filter (covered by US-302).
- Sorting controls beyond name ASC.
- Favoriting / bookmarking.
- Custom matcha submission (covered by US-304).

## Estimation

- **Size:** M (~4 hours)
- **Complexity Notes:** The query and rendering are straightforward. The
  pagination state and making sure server + client stay in sync (load more
  without losing the search/filter state from US-302) is the trickiest
  part.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-101 (Schema) | Blocked by | Ready |
| US-103 (Seed catalog) | Blocked by | Not started |

## Test Scenarios

| # | Scenario              | Steps                             | Expected Result |
|---|-----------------------|-----------------------------------|-----------------|
| 1 | Happy path            | Visit `/catalog`                  | 20 cards rendered, name/brand/type visible |
| 2 | Load more             | Scroll to end, tap Load More      | Next 20 cards append, URL becomes `?page=2` |
| 3 | Empty catalog         | Wipe seed, visit `/catalog`       | Empty state shown |
| 4 | Card navigation       | Tap a card                        | Navigates to `/catalog/[id]` |
| 5 | Back from detail      | Card → Back                       | Scroll position preserved |
| 6 | Unapproved custom     | Another user's unapproved entry   | Not visible in list |
