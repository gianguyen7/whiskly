# User Story: Search the Catalog

**ID:** US-302
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 1 (MVP)
**Status:** Ready

---

## Story

**As a** user,
**I want to** search the catalog by name, brand, or region and filter by type,
**so that** I can quickly find a specific matcha I remember or am looking for.

## Acceptance Criteria

- [ ] **Given** `/catalog`, **when** I type in the search bar, **then** the
      list filters to matching entries with a 300ms debounce (no flicker on
      fast typing).
- [ ] **Given** a query like "Uji", **when** results load, **then** I see all
      matcha where "Uji" appears in name, brand, or region (case-insensitive).
- [ ] **Given** I have an active query, **when** I tap the clear button,
      **then** the query resets and the full catalog returns.
- [ ] **Given** a query with no matches, **when** the results empty, **then** I
      see "No results for '<query>'" with a suggestion to try a different
      spelling.
- [ ] **Given** filter chips (All / Ceremonial / Premium / Culinary / Latte /
      Other), **when** I tap one, **then** the list filters to that type and
      the chip becomes visually active.
- [ ] **Given** a search + filter combination, **when** the URL updates,
      **then** it is shareable/bookmarkable (e.g.,
      `?q=uji&type=ceremonial`).
- [ ] **Given** a query with `%`, `'`, or other SQL-sensitive characters,
      **when** submitted, **then** the query is parameterized and returns
      results without SQL injection risk.

## Context

Search is the second-most-used action on the catalog, especially once the
catalog grows past 50 entries. It needs to feel instantaneous — users
typing a matcha name expect the list to respond within a frame. The
300ms debounce is a compromise between responsiveness and DB load.

## Design

- Search bar: sticky at the top of the catalog (`position: sticky`), full
  width with a leading Search icon (lucide-react) and trailing clear button.
- Filter chips: horizontal scroll below the search bar.
- See DESIGN-SYSTEM.md §9.3 for input styling and §9.4 for pills.
- Empty state reuses the search icon (see catalog-client.tsx current
  implementation).

## Technical Notes

- Client component (interactive). Uses `useDeferredValue` for debouncing —
  already prototyped in `src/app/(main)/catalog/catalog-client.tsx`.
- Server-side search: use Supabase `.ilike()` on `name`, `brand`, `region`
  joined with `.or()`. Example:
  ```ts
  supabase.from('matchas').select('*').or(
    `name.ilike.%${q}%,brand.ilike.%${q}%,region.ilike.%${q}%`
  )
  ```
- Alternative: full-text search via `search_index` GIN index + `.textSearch()`.
  Decide based on query performance.
- Sanitize: Supabase client handles parameterization, but sanitize `%` and
  `_` if they should not be treated as wildcards.
- URL sync via `useRouter().replace()` so back/forward works.

## Out of Scope

- Advanced search (taste-profile similarity search — covered by
  recommendations).
- Saved searches / search history.
- Voice search.
- Typo tolerance / fuzzy matching.

## Estimation

- **Size:** M (~4 hours)
- **Complexity Notes:** The search logic is simple. The tricky bits are URL
  state sync, making sure the scroll position doesn't jump on every keystroke,
  and the `%`/`_` wildcard sanitization.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-301 (Browse catalog) | Blocked by | Ready |

## Test Scenarios

| # | Scenario                 | Steps                                     | Expected Result |
|---|--------------------------|-------------------------------------------|-----------------|
| 1 | Simple search            | Type "uji"                                | Results filter to Uji matcha within 300ms |
| 2 | No results               | Type "zzzz"                               | Empty state with "No results for 'zzzz'" |
| 3 | Clear search             | Search → tap clear (X)                    | Full catalog restored |
| 4 | Type filter              | Tap "Ceremonial" chip                     | List filters, chip highlighted |
| 5 | Search + filter combined | Search "uji" + Ceremonial chip            | Both applied |
| 6 | URL deep link            | Visit `/catalog?q=uji&type=ceremonial`    | Search bar and chip pre-populated |
| 7 | SQL injection attempt    | Type `%' OR 1=1--`                        | Treated as literal text, no unexpected results |
| 8 | Debounce                 | Type 10 characters fast                   | Only one DB query fires after 300ms pause |
