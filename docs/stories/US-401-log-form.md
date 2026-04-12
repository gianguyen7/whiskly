# User Story: Log Form — Taste & Star Rating

**ID:** US-401
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 2 (MVP)
**Status:** Ready

---

## Story

**As a** user,
**I want to** rate a matcha on five taste dimensions plus an overall star
rating and add freeform notes,
**so that** I can capture my tasting experience and contribute to my taste
profile.

## Acceptance Criteria

- [ ] **Given** `/log/new`, **when** the form loads without a `?matcha=<id>`
      query param, **then** I see step 1: a matcha picker (reuses catalog
      search).
- [ ] **Given** `/log/new?matcha=<id>`, **when** the form loads, **then** step
      1 is skipped and I go directly to step 2 (the rating form) with the
      matcha header visible.
- [ ] **Given** step 2, **when** rendered, **then** I see five sliders labeled
      Umami, Sweetness, Bitterness, Grassiness, Creaminess, each defaulting to
      3 with a visible current value.
- [ ] **Given** a slider, **when** I drag it, **then** the numeric value updates
      live as I drag (touch + mouse).
- [ ] **Given** the form, **when** displayed, **then** I see a 5-star input for
      overall rating and an optional notes text area (max 1000 chars with a
      counter after 800).
- [ ] **Given** I tap a star, **when** registered, **then** that star plus all
      stars to its left become filled.
- [ ] **Given** I tap the same star twice, **when** registered, **then** the
      rating clears back to 0.
- [ ] **Given** I leave the page mid-edit, **when** I return, **then** my
      in-progress values are preserved (sessionStorage) until I save or
      explicitly discard.

## Context

Logging is the core engagement loop of the app. The form has to feel fast
and playful — if it takes more than 30 seconds to log a matcha, users
won't build the habit. Sliders over number inputs because they invite
exploration; 1–5 scale because 10-point scales are overkill for taste
self-assessment (PRD §4).

## Design

- Route: `/log/new` (stub exists).
- Two-step wizard:
  1. **Pick matcha**: reuses search + filter chips from US-302.
  2. **Rate**: matcha header (name, brand, type pill), then sliders, stars,
     notes, save CTA.
- Sliders: see DESIGN-SYSTEM.md §9.7 (Taste slider).
- Star rating: see §9.6.
- Primary CTA sticky at bottom above the nav.
- Respect `pb-safe` for notched devices.

## Technical Notes

- Client component (heavy interactivity).
- Reuse `taste-slider.tsx` and `star-rating.tsx` stubs.
- State: local `useState` for values; persist to `sessionStorage` on every
  change to survive accidental navigation.
- Step transitions: keep both steps in one component and toggle via URL
  query param (`?step=rate`) so the back button works.
- The actual DB save is US-402 — this story ends at "form is ready to submit".

## Out of Scope

- Saving to DB (US-402).
- Photo upload (not in MVP).
- Location / venue tagging.
- Voice notes.
- Editing an existing log (US-404).

## Estimation

- **Size:** L (~8 hours)
- **Complexity Notes:** The interaction surface is large — touch/drag sliders,
  star input, wizard navigation, sessionStorage. Each piece is small, but the
  accumulation of small interactions needs careful QA on mobile.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-302 (Catalog search for picker) | Blocked by | Ready |
| `taste-slider.tsx` stub            | Blocked by | Ready |
| `star-rating.tsx` stub             | Blocked by | Ready |

## Test Scenarios

| # | Scenario                         | Steps                                                        | Expected Result |
|---|----------------------------------|--------------------------------------------------------------|-----------------|
| 1 | Pick then rate                   | Visit `/log/new` → search "uji" → pick → rate → stars → notes | All inputs responsive, CTA enabled |
| 2 | Deep-link pre-fill               | Visit `/log/new?matcha=<id>`                                 | Step 2 shown immediately, matcha header correct |
| 3 | Slider drag (touch)              | Drag umami slider                                            | Value updates live; final position retained |
| 4 | Star tap toggle                  | Tap 3 stars → tap 3rd star again                             | First tap fills 1-3, second tap clears |
| 5 | Notes length limit               | Type > 1000 characters                                       | Counter appears at 800, input blocked at 1000 |
| 6 | Accidental navigation            | Fill form → tap back → return                                | Values preserved via sessionStorage |
| 7 | Matcha not found in picker       | Search nonexistent string                                    | Empty state with "Add custom matcha" CTA (US-304) |
