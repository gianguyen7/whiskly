# Execution Plan: Idea to Launch

## Overview

This plan breaks the project into phased milestones. Each phase has a clear
goal, deliverables, and exit criteria. No phase begins until the previous
phase's exit criteria are met.

---

## Phase 0: Foundation (Current)

**Goal:** Establish project structure, conventions, and decision framework.
**Duration:** 1-2 days

### Deliverables
- [x] Repository structure
- [x] Documentation templates (PRD, PRFAQ, ADR, user stories, release notes, roadmap)
- [x] Engineering standards (CONTRIBUTING.md, commit conventions, PR template)
- [x] CI/CD scaffolding
- [x] Testing strategy
- [x] Deployment flow
- [x] Architecture decision catalog (ADR-001)
- [x] This execution plan

### Exit Criteria
- [ ] All deliverables merged to `main`
- [ ] Team agrees on conventions

---

## Phase 1: Product Definition

**Goal:** Clearly define what we're building, for whom, and what MVP looks like.
**Duration:** 3-5 days

### Deliverables
- [x] PRFAQ written and reviewed (docs/product/PRFAQ-whiskly.md)
- [x] PRD for MVP scope (docs/product/PRD-whiskly-mvp.md)
- [x] User persona defined (Alex, 27, young professional)
- [x] Success metrics defined (10+ users, 3+ logs, 20% rec conversion, 40% retention)
- [x] Core user stories written (5-10 for MVP) — see `docs/stories/`
- [x] Roadmap with Phase 2-4 sketched out — see `docs/product/ROADMAP.md`

### Exit Criteria
- [ ] PRFAQ approved by stakeholders
- [ ] PRD approved — MVP scope is locked
- [ ] User stories are "Ready" (acceptance criteria defined)

### Key Questions to Answer
- What is the core value proposition?
- Who is the day-1 user?
- What is the smallest thing we can ship that tests our hypothesis?
- What are we explicitly NOT building in v1?

---

## Phase 2: Technical Design

**Goal:** Make architecture decisions and set up the development environment.
**Duration:** 3-5 days

### Deliverables
- [x] ADR-002: Tech stack — Next.js + TypeScript + Supabase + Vercel + Tailwind
- [x] ADR-003: Catalog seeding pipeline — Yunomi, Kettl, Sazen, Ippodo, Reddit
- [x] Supabase project created, schema deployed, 24 matchas seeded (`fdayixiwxwligrxutmro`)
- [x] Next.js project scaffolded with TypeScript, Tailwind, PWA config
- [x] Vercel linked to GitHub repo — live at https://whiskly-puce.vercel.app
- [x] Dev environment setup (`scripts/setup.sh` + README)
- [x] Database schema design (matcha catalog, user logs, taste profiles) — ADR-004
- [x] CI/CD pipeline configured for Next.js (lint + typecheck + build on PR)
- [x] Local development workflow verified end-to-end

### Exit Criteria
- [ ] `scripts/setup.sh` gets a new developer from clone to running app in < 10 min
- [ ] CI pipeline runs lint + test + build on PR
- [ ] ADRs approved — no open "blocking" architecture questions
- [ ] Catalog seeding pipeline produces valid catalog.json

---

## Phase 3: MVP Build

**Goal:** Implement the minimum viable product.
**Duration:** 2-4 weeks (depends on scope from Phase 1)

### Approach
- Work in 1-week sprints
- Each sprint delivers a shippable increment
- Demo at end of each sprint
- User stories pulled from backlog in priority order

### Deliverables
- [ ] Core user flows implemented
- [ ] Unit + integration tests for all business logic
- [ ] Basic error handling and input validation
- [ ] Staging environment deployed and accessible

### Exit Criteria
- [ ] All P0 user stories complete and tested
- [ ] App runs end-to-end on staging
- [ ] No P0/P1 bugs open

---

## Phase 4: Polish & Harden

**Goal:** Make the MVP production-ready.
**Duration:** 1-2 weeks

### Deliverables
- [ ] E2E tests for critical paths
- [ ] Security review (auth, input validation, secrets management)
- [ ] Performance baseline established
- [ ] Error monitoring configured (e.g., Sentry)
- [ ] Logging and observability set up
- [ ] Operational runbooks written for top 3 failure scenarios
- [ ] Load testing (if applicable)

### Exit Criteria
- [ ] Security checklist passed
- [ ] No P0/P1 bugs
- [ ] Monitoring and alerting active
- [ ] Runbooks reviewed by on-call

---

## Phase 5: Launch

**Goal:** Ship to real users and learn.
**Duration:** 1 week

### Deliverables
- [ ] Production environment provisioned
- [ ] Feature flags configured for gradual rollout
- [ ] Release notes written
- [ ] Launch checklist completed
- [ ] Rollback plan tested

### Launch Checklist
- [ ] DNS / domain configured
- [ ] SSL certificate active
- [ ] Database backups verified
- [ ] Monitoring dashboards live
- [ ] On-call rotation set
- [ ] Analytics / event tracking active
- [ ] Legal (privacy policy, ToS) — if applicable

### Exit Criteria
- [ ] App live in production
- [ ] First real users onboarded
- [ ] No critical incidents in first 48 hours

---

## Phase 6: Learn & Iterate

**Goal:** Gather feedback and plan the next cycle.

### Activities
- [ ] Review success metrics from PRD
- [ ] Collect user feedback (interviews, analytics, support tickets)
- [ ] Retrospective on process
- [ ] Update roadmap based on learnings
- [ ] Begin Phase 1 for next cycle

---

## Assumptions & Tradeoffs

### Assumptions
- Small team (1-3 people) — process is lightweight by design
- MVP is scoped to validate one core hypothesis
- We have budget for managed services (not self-hosting everything)
- We'll iterate quickly — first version is a learning tool, not the final product

### Tradeoffs Made
| Decision | Tradeoff | Rationale |
|----------|----------|-----------|
| Templates over tools | Manual overhead vs. flexibility | Too early to commit to specific project management tooling |
| Monorepo | CI complexity later vs. simplicity now | Not enough code to justify repo boundaries |
| Placeholder CI | Non-functional CI vs. early structure | Establishing the pattern is more valuable than the specific tools |
| Docs before code | Slower start vs. clearer direction | Reduces rework and misalignment |
