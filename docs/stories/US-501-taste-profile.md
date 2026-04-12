# User Story: Auto-Updating Taste Profile

**ID:** US-501
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 2 (MVP)
**Status:** Ready

---

## Story

**As a** user,
**I want** my taste profile to update automatically whenever I save, edit, or
delete a log and see it visualized as a radar chart,
**so that** my preferences are always current and easy to understand at a
glance.

## Acceptance Criteria

- [ ] **Given** I save a new log, **when** I navigate to `/profile`, **then**
      the 5 taste averages reflect all my logs including the latest.
- [ ] **Given** I delete a log, **when** I view `/profile`, **then** the
      averages are recalculated from the remaining logs.
- [ ] **Given** I edit a log's taste ratings, **when** I view `/profile`,
      **then** the averages reflect the new values.
- [ ] **Given** I have 0 logs, **when** `/profile` loads, **then** I see an
      empty state: "Log matcha to build your profile" with a CTA to `/log/new`.
- [ ] **Given** I have 1 or 2 logs, **when** `/profile` loads, **then** I see
      the radar chart populated plus a hint: "Log 3+ matcha to unlock
      recommendations (N of 3)".
- [ ] **Given** I have 3+ logs, **when** `/profile` loads, **then** I see
      the radar chart, `log_count` ("Based on N tastings"), and a link to
      `/recommendations`.
- [ ] **Given** the radar chart, **when** rendered on a small mobile viewport
      (320px), **then** it fits without horizontal scroll and remains legible.
- [ ] **Given** the chart, **when** drawn, **then** it uses the matcha-green
      palette (fill `matcha-400/40%`, stroke `matcha-600`).

## Context

The taste profile is Whiskly's signature insight — the thing that
differentiates it from a generic food logger. The radar chart makes the
user's palate visible in one glance and anchors the recommendation story.
Because the DB trigger handles recalculation (ADR-004), the app's job is
purely read + render; that also guarantees consistency if multiple
devices are editing simultaneously.

## Design

- Route: `/profile` (stub exists at `src/app/(main)/profile/page.tsx`).
- Layout:
  1. Header: display name + log count ("Based on 7 tastings")
  2. Radar chart (centered, ~280px square on mobile)
  3. Stats strip (optional): top dimension, most recent matcha
  4. Logout button at the bottom
- Radar chart component: `src/components/ui/radar-chart.tsx` (stub).
- Empty state per DESIGN-SYSTEM §9.8.

## Technical Notes

- Server component fetches from `profiles` where `id = auth.uid()`.
- All five dimensions (`umami_avg`, `sweetness_avg`, etc.) plus `log_count`
  come from one row.
- Radar chart: prefer a lightweight SVG implementation (no chart library) to
  keep the PWA bundle small. If a library is needed, choose `recharts` —
  already likely to be needed elsewhere.
- Values are 1–5; normalize to 0–1 for the chart.
- DB trigger `recalculate_taste_profile` (ADR-004) handles all math; no
  client-side aggregation.

## Out of Scope

- Comparing a specific matcha's profile to mine (US-503).
- Time-based profile evolution ("your palate last month vs. now") — post-MVP.
- Sharing the profile card (US-703/704).
- Exporting profile data.

## Estimation

- **Size:** L (~6 hours)
- **Complexity Notes:** The read is trivial. The radar chart is the work —
  SVG math, labels, responsive sizing, and making sure it looks good at
  both filled (all dimensions ~3) and skewed (one dimension maxed) shapes.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-402 (Save log)        | Blocked by | Ready |
| `recalculate_taste_profile()` trigger | Blocked by | Ready |
| `radar-chart.tsx` stub   | Blocked by | Ready |

## Test Scenarios

| # | Scenario              | Steps                                                         | Expected Result |
|---|-----------------------|---------------------------------------------------------------|-----------------|
| 1 | Empty profile         | New user → visit `/profile`                                  | Empty state + CTA to log |
| 2 | First log updates profile | Save one log → visit `/profile`                           | Radar renders, averages = that log's values |
| 3 | Multi-log average     | Save 3 logs with varying values → visit `/profile`           | Averages = mean of the 3 |
| 4 | Delete log recalcs    | Delete one of the 3 logs → visit `/profile`                  | Averages recalculated from remaining 2 |
| 5 | Edit log recalcs      | Edit a log's umami 3→5 → visit `/profile`                    | Umami average reflects 5 |
| 6 | Progress hint 1-2 logs | Save 2 logs → visit `/profile`                              | Chart + "2 of 3" progress hint |
| 7 | Unlock recommendations | Save 3rd log → visit `/profile`                             | Link to `/recommendations` appears |
| 8 | Small viewport        | Visit on 320px-wide viewport                                 | Chart fits without horizontal scroll |
