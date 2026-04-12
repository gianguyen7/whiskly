# User Story: Log In & Log Out

**ID:** US-202
**Author:** Whiskly team
**Created:** 2026-04-11
**Sprint/Milestone:** Sprint 1 (MVP)
**Status:** Ready

---

## Story

**As a** returning user,
**I want to** log in with my email and password (and log out when I'm done),
**so that** I can access my matcha logs and profile from any device.

## Acceptance Criteria

- [ ] **Given** I'm on `/login`, **when** I enter valid credentials and submit,
      **then** I am authenticated and redirected to `/catalog`.
- [ ] **Given** invalid credentials, **when** I submit, **then** I see the
      generic error "Invalid email or password" — no field-level hint that
      would let an attacker enumerate valid accounts.
- [ ] **Given** I'm authenticated, **when** I tap "Log out" on the profile page,
      **then** my session is destroyed and I am redirected to `/login`.
- [ ] **Given** I closed the browser while authenticated, **when** I reopen the
      app, **then** my session is still active (cookie-persisted).
- [ ] **Given** I'm on `/login` while already authenticated, **when** the page
      loads, **then** I am redirected to `/catalog` (no re-login).
- [ ] **Given** my session expires mid-session, **when** I make a server
      request, **then** I am redirected to `/login` and the original URL is
      preserved as a `redirectTo` query param.

## Context

Login is for returning users — typically users who signed up on another
device or cleared cookies. It needs to be fast and, importantly, it must
not leak account existence information (security rule: no email
enumeration). Logout must also fully clear the session so the next person
on a shared device cannot access the data.

## Design

- Route: `/login` (exists at `src/app/(auth)/login/page.tsx`).
- Same visual treatment as `/signup` (see DESIGN-SYSTEM.md §9.1/§9.3).
- "Forgot password?" link below the password field (implementing US-204
  separately).
- Logout button lives in `src/app/(main)/profile/logout-button.tsx`,
  styled as a secondary button.

## Technical Notes

- Use `supabase.auth.signInWithPassword()` and `supabase.auth.signOut()`.
- Session persistence is handled by the `@supabase/ssr` middleware in
  `src/middleware.ts` — the middleware refreshes the cookie on every
  request.
- Never return different error strings for "email not found" vs "wrong
  password" — always the same generic message.
- After logout, call `redirect('/login')` from a server action so the
  session cookie is cleared before navigation.

## Out of Scope

- Password reset (covered by US-204).
- Two-factor auth.
- OAuth providers.
- Remember-me toggle (sessions persist by default).
- Account lockout after N failed attempts (post-MVP).

## Estimation

- **Size:** S (~2–3 hours)
- **Complexity Notes:** Mostly wiring. The harder part is making sure the
  middleware redirect loop is airtight for both logged-in-on-auth-route
  and logged-out-on-main-route cases.

## Dependencies

| Dependency | Type       | Status |
|------------|------------|--------|
| US-201 (Sign up) | Blocked by | Ready |
| US-203 (Route guard middleware) | Related | Parallel |

## Test Scenarios

| # | Scenario                        | Steps                                                    | Expected Result |
|---|---------------------------------|----------------------------------------------------------|-----------------|
| 1 | Happy path                      | Enter valid credentials → Submit                         | Redirected to `/catalog`, session active |
| 2 | Wrong password                  | Valid email, wrong password → Submit                     | Generic "Invalid email or password" |
| 3 | Nonexistent email               | Unregistered email → Submit                              | Same generic error (no enumeration) |
| 4 | Already authenticated           | Visit `/login` while logged in                           | Redirected to `/catalog` |
| 5 | Logout                          | Profile → Log out                                        | Session cleared, redirected to `/login` |
| 6 | Session persists across reloads | Log in → reload                                          | Still authenticated |
| 7 | Redirect preservation           | Visit `/log` while logged out                            | Redirected to `/login?redirectTo=/log`, login returns to `/log` |
