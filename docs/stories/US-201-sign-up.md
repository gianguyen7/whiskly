# User Story: Sign Up with Email & Password

**ID:** US-201
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 1 (MVP)
**Status:** Ready

---

## Story

**As a** new user,
**I want to** create an account with my email and password,
**so that** I can start tracking the matcha I try and build up a taste profile.

## Acceptance Criteria

- **Given** I'm on `/signup`, **when** I enter a valid email and a password
of at least 8 characters and submit, **then** my account is created and
I'm redirected to `/catalog` with an active session.
- **Given** I just signed up, **when** the auth trigger fires, **then** a
`profiles` row is inserted automatically via `handle_new_user()`.
- **Given** an email that's already registered, **when** I submit, **then**
I see a clear error message ("An account with this email already exists.
Try signing in instead.") and remain on `/signup`.
- **Given** an invalid email format, **when** I tab off the field or submit,
**then** I see inline validation and the submit button is inert.
- **Given** a password shorter than 8 characters, **when** I submit, **then**
I see a validation error and the password field keeps focus.
- **Given** the signup succeeded, **when** I reload the page, **then** my
session persists (cookie) and I stay on `/catalog`.
- **Given** a network error, **when** the request fails, **then** the form
preserves my input and shows a retry-friendly error.

## Context

Signup is the first interaction a user has with Whiskly after downloading /
opening the PWA. It's the single gate between discovery and engagement — if
it fails or feels heavy, the user is gone. The PRD persona ("Alex, 27,
casually obsessed with matcha") expects a frictionless 10-second signup;
email confirmation is explicitly disabled in MVP to keep the path short.

## Design

- Route: `/signup` (exists as a stub in `src/app/(auth)/signup/page.tsx`).
- Layout: centered single-column, `max-w-sm`, logo + wordmark at top.
- Fields: Display Name (required), Email (required), Password (required,
8+ chars, visible min-length hint).
- Primary CTA: full-width `matcha-600` button.
- Error banner above the form, dismissible on next keystroke.
- See `docs/design/DESIGN-SYSTEM.md` §9.1 (Button) and §9.3 (Form input) for
styling specs.

## Technical Notes

- Use `supabase.auth.signUp()` via the browser client in
`src/lib/supabase/client.ts`.
- Form state: React `useActionState` with a Server Action in
`src/app/(auth)/actions.ts` (stub already exists).
- Disable email confirmation in the Supabase dashboard for MVP
(auto-confirm). Re-enable before public launch.
- After successful signup, redirect with `redirect('/catalog')` from the
action so cookies are set before the navigation.
- Display name is stored in `profiles.display_name` — pass it through as
user metadata on signUp and let the DB trigger persist it.

## Out of Scope

- OAuth providers (Google, Apple) — flagged P2 in the PRD.
- Email verification UX.
- Magic-link signup.
- Username / handle selection.
- Onboarding tour after signup (lands directly on the catalog).

## Estimation

- **Size:** M (~4–6 hours)
- **Complexity Notes:** Supabase SDK handles most of it. The real work is
error-state mapping (Supabase returns opaque error strings that need
translation into user-facing copy) and keeping the form resilient across
server action re-renders.

## Dependencies


| Dependency                    | Type       | Status      |
| ----------------------------- | ---------- | ----------- |
| US-101 (DB schema)            | Blocked by | Ready       |
| US-102 (RLS policies)         | Blocked by | Ready       |
| Supabase project provisioning | Blocked by | Not started |


## Test Scenarios


| #   | Scenario            | Steps                                                | Expected Result                                                          |
| --- | ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | Happy path          | Enter valid email + 8+ char password + name → Submit | Redirected to `/catalog`, `profiles` row exists, session cookie set      |
| 2   | Duplicate email     | Sign up with an email that already has an account    | Error: "An account with this email already exists." Form preserved.      |
| 3   | Short password      | Enter 5-char password → Submit                       | Inline error shown, submit blocked                                       |
| 4   | Malformed email     | Enter "foo@bar" → Blur                               | Inline validation error                                                  |
| 5   | Session persistence | Sign up → reload page                                | Still authenticated, no redirect to login                                |
| 6   | Network failure     | Disable network → Submit                             | Error banner, form input preserved, retry succeeds when network restored |


