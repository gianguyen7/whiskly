# User Story: Save Log to Database

**ID:** US-402
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 2 (MVP)
**Status:** Ready

---

## Story

**As a** user,
**I want** my completed log form to persist when I tap Save,
**so that** my tasting is recorded and my taste profile updates.

## Acceptance Criteria

- [ ] **Given** a complete form (matcha + 5 taste values + star rating, notes
      optional), **when** I tap Save, **then** a row is inserted into
      `matcha_logs` with my user ID, matcha ID, the 5 values, overall rating,
      notes, and server-generated `created_at`.
- [ ] **Given** the insert succeeds, **when** the DB trigger fires, **then**
      my `profiles` row is recalculated via `recalculate_taste_profile()` and
      `log_count` increments.
- [ ] **Given** a successful save, **when** the response returns, **then** I
      see a success toast and am redirected to `/log` (history view).
- [ ] **Given** a network error or 5xx, **when** save fails, **then** I see an
      error toast, my form data is preserved in sessionStorage, and the Save
      button re-enables.
- [ ] **Given** a tampered request (invalid rating out of range 1–5), **when**
      the server validates, **then** the insert is rejected with a 400 and
      no row is written.
- [ ] **Given** a user without an active session, **when** they somehow POST
      the action, **then** RLS blocks the insert.
- [ ] **Given** a double-tap of the Save button, **when** the second tap fires,
      **then** no duplicate row is inserted (idempotency or button disable).

## Context

This is the moment the user's effort becomes real data. The save must be
reliable — losing a log because of a flaky network will destroy trust.
SessionStorage preservation on failure is a critical hedge. The DB trigger
design (ADR-004) means the app doesn't own profile recalculation, which
keeps the client simple and guarantees consistency.

## Design

- No new UI for this story beyond success/error toasts (DESIGN-SYSTEM §9.10).
- Save button shows a loading state (spinner inline) while the request is
  in flight; Save is disabled until the request settles.

## Technical Notes

- Server Action in the log form component (or `src/app/(main)/log/actions.ts`).
- Validation: use a schema (`zod` or hand-rolled) to confirm 5 taste fields
  are integers 1–5 and overall_rating is 1–5 before calling the insert.
- `supabase.from('matcha_logs').insert([...])` — RLS policy restricts
  inserts to `user_id = auth.uid()`.
- On success: `redirect('/log')` from the action. Client clears
  sessionStorage on the redirect.
- The `recalculate_taste_profile()` trigger fires automatically after
  insert — no app code needed.
- Error mapping: translate Supabase error codes to user-facing copy. Log
  raw errors to the server logs only, never to the client.

## Out of Scope

- Optimistic UI (show in history before save confirms) — post-MVP.
- Offline queue (save when network returns) — post-MVP.
- Edit / delete (US-404).
- Undo after save.

## Estimation

- **Size:** M (~4 hours)
- **Complexity Notes:** Schema validation and error mapping are the real work.
  The insert itself is trivial. Test the trigger path end-to-end to make sure
  profile recalc fires.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-401 (Form)            | Blocked by | Ready  |
| US-101 (Schema + triggers) | Blocked by | Ready  |
| RLS policies on `matcha_logs` | Blocked by | Ready |

## Test Scenarios

| # | Scenario                      | Steps                                                     | Expected Result |
|---|-------------------------------|-----------------------------------------------------------|-----------------|
| 1 | Happy path                    | Complete form → Save                                      | Row inserted, toast shown, redirected to `/log` |
| 2 | Profile trigger fires         | Save first log → Visit `/profile`                        | log_count = 1, taste averages match inputs |
| 3 | Network failure               | Disable network → Save                                    | Error toast, form preserved, Save re-enabled |
| 4 | Invalid rating server-side    | Use dev tools to send rating = 10                         | 400, no row inserted |
| 5 | Double-tap                    | Tap Save twice rapidly                                    | Exactly one row inserted |
| 6 | RLS enforcement               | Forge another user_id in payload                          | Insert rejected by RLS |
| 7 | Optional notes                | Save without notes                                        | Row inserted with notes = NULL |
