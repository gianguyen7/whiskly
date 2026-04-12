# Whiskly Roadmap

**Last updated:** 2026-04-11
**Owner:** Whiskly team
**Status:** Sketch — will be refined after v0.1 alpha lands

> This roadmap is the product-facing complement to
> [`EXECUTION-PLAN.md`](EXECUTION-PLAN.md). The execution plan describes
> *process phases* (Foundation → Design → Build → Polish → Launch → Learn).
> This roadmap describes *product versions* — what ships, to whom, and why.

---

## Vision

Whiskly helps curious matcha drinkers understand their own palate and
discover matcha they'll love — without needing to become experts.

## Principles

1. **Ship learning over perfection.** Every release should answer a
   question about our users, not just tick feature boxes.
2. **Cut scope before extending timelines.** If a release is at risk, the
   first lever is scope.
3. **Retention > acquisition.** Don't chase signups until we can show
   weekly-active users logging more than once per week.
4. **One hero feature per release.** Avoid feature soup; each version has
   a single thing it tests.

---

## Now / Next / Later

A quick snapshot. The detailed release plan follows below.

| Horizon | Focus | Status |
|---------|-------|--------|
| **Now** (Phase 2-3) | v0.1 alpha — Sprint 1 foundation + catalog browsing | In progress |
| **Next** (Phase 3) | v1.0 MVP — logging, taste profile, recommendations | Not started |
| **Later** (Phase 4-6) | v1.1 hardening + v2.0 social & content depth | Planned |

---

## v0.1 — Alpha (internal)

**Theme:** Foundation works end-to-end
**Target:** 2026-05 (end of Sprint 1)
**Audience:** Team only — dogfood on personal device
**Hero:** "I can sign up and browse a real matcha catalog."

### In scope

| Priority | Item                                           | Source |
|----------|------------------------------------------------|--------|
| P0       | Supabase project provisioned + schema migrated | Phase 2 |
| P0       | Dev setup script + README                      | Phase 2 |
| P0       | CI running lint + test + build on PR           | Phase 2 |
| P0       | 20–30 seeded matcha entries                    | Phase 2 |
| P0       | Sign up / log in / log out (US-201, US-202)    | Sprint 1 |
| P0       | Auth route guard (US-203)                      | Sprint 1 |
| P0       | Password reset (US-204)                        | Sprint 1 |
| P0       | Browse + search catalog (US-301, US-302)       | Sprint 1 |
| P0       | Matcha detail page (US-303)                    | Sprint 1 |

### Exit criteria

- Alpha app is deployed to a staging Vercel URL.
- A new engineer can clone, run `./scripts/setup.sh`, and have a working
  local env in under 10 minutes.
- All P0 Sprint 1 stories have their acceptance criteria passing in manual QA.

### Key risks

- Supabase local dev vs. hosted parity — covered by SP-01 spike.
- Catalog seed quality — garbage in, garbage recommendations later.
  Mitigation: hand-curate the first 30 entries, don't automate until we
  see how real data behaves.

---

## v1.0 — MVP (public beta)

**Theme:** The complete loop — log, understand, discover
**Target:** 2026-06 (end of Sprint 3)
**Audience:** ~10 friendly users from personal network
**Hero:** "After 3 logs, I can see my taste profile and get recommendations."

### In scope

| Priority | Item                                          | Source |
|----------|-----------------------------------------------|--------|
| P0       | Log form + save (US-401, US-402)              | Sprint 2 |
| P0       | Log history (US-403)                          | Sprint 2 |
| P0       | Edit / delete log (US-404)                    | Sprint 2 |
| P0       | Auto-updating taste profile (US-501)          | Sprint 2 |
| P0       | Radar chart visualization (US-502)            | Sprint 2 |
| P0       | Recommendation engine + UI (US-601, US-602)   | Sprint 3 |
| P0       | "Log this one" quick flow (US-603)            | Sprint 3 |
| P1       | Add custom matcha entry (US-304)              | Sprint 2 |
| P1       | Compare matcha to profile (US-503)            | Sprint 2 |
| P1       | Article rendering + index (US-701, US-702)    | Sprint 3 |
| P1       | Share card generation (US-703, US-704)        | Sprint 3 |

### Success metrics (from PRD)

- 10+ users onboarded
- 3+ logs per active user in the first week
- 20% click-through on recommendations
- 40% week-2 retention

### Exit criteria

- All P0 stories shipped and verified.
- Error monitoring (Sentry or similar) active.
- No P0/P1 bugs open.
- Privacy policy and ToS published.

### Key risks

- Recommendation quality with sparse data — cosine similarity needs
  enough dimension variance to be useful. Mitigation: seed catalog with
  high-variance matcha; consider fallback to "popular with people like you"
  if similarity is flat.
- Radar chart legibility on small viewports — covered by US-502 AC.
- Habit formation — users need a reason to come back between purchases.
  This is the main hypothesis v1.0 tests.

---

## v1.1 — Harden & learn

**Theme:** Production-ready and feedback-driven
**Target:** 2026-07 (Phase 4 + 5)
**Audience:** Open to anyone with a signup link
**Hero:** "Whiskly works reliably and I can share my profile with a friend."

### In scope

- E2E test suite for critical paths (signup → log → recommendation)
- Performance baseline + Lighthouse > 90 on mobile
- Sentry + analytics dashboards live
- Operational runbooks for top 3 failure modes
- Native share sheet integration polish
- Onboarding flow refinement based on v1.0 user observation
- Bug fixes and UX polish from v1.0 feedback

### Open questions driving v1.1 scope

- Do users actually want an "explain why this matcha was recommended" UI?
  (PRD Q5)
- Is OAuth a meaningful acquisition lever or a nice-to-have? (PRD Q4)
- What are the top 3 complaints from v1.0 users?

### Exit criteria

- Weekly active users stable or growing week over week.
- No more than 1 P1 bug at any given time.
- First 5 runbooks verified by actually using them during an incident.

---

## v2.0 — Depth & community

**Theme:** From solo tasting to shared taste
**Target:** 2026-Q4 (speculative — depends on v1.1 learnings)
**Audience:** Public launch
**Hero:** TBD — will be whichever direction v1.1 data points to.

Two candidate themes, only one picked based on evidence:

### Option A — Social

If v1.1 shows users asking to share profiles or compare with friends:

- Follow / friends model
- Shared tasting sessions
- Public profile pages
- "Matcha I'd recommend to you" between friends
- Requires: privacy controls, content moderation plan

### Option B — Expertise

If v1.1 shows users engaging with articles and asking for deeper
knowledge:

- In-depth articles per origin, producer, grade
- Pairing guides (food, occasion, time of day)
- Admin-curated matcha journeys (e.g., "Uji sampler")
- Expert-authored content partnerships
- Requires: CMS, editorial workflow

### Decision gate

Pick one path at the end of v1.1 based on:
- Share card sends per week
- Article reads per active user
- Qualitative interviews with top-10 most-active users

---

## Future / Icebox

Ideas worth keeping in view, not committed to any version.

| Item                               | Rationale for deferral |
|------------------------------------|------------------------|
| Photo upload with logs (F3.6)      | Adds storage cost and latency; not core to the taste-profile hypothesis |
| Location / venue tagging           | Interesting signal but needs a places DB and privacy work |
| Offline PWA support                | Only matters once people log on the go during poor connectivity — wait for the data |
| Admin dashboard for catalog curation | Hand-curation works up to ~200 entries; build when we can't keep up |
| Voice notes                        | Novel but not obviously valuable — revisit after user interviews |
| Multi-region i18n (JA / ZH)        | High effort, speculative market |
| Dark mode                          | Token scaffolding exists in `globals.css`; activate when users ask |
| Dismiss / thumbs-down recommendations | Needs model to react to negative signal — post-v2 |
| Wholesale matcha reseller integrations | Possible revenue path; out of scope until product-market fit |

---

## Changelog

| Date       | Change                                                        |
|------------|---------------------------------------------------------------|
| 2026-04-11 | Initial sketch based on PRD, epic breakdown, and execution plan |
