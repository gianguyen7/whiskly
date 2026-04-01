# Product Requirements Document: Whiskly MVP

**Author:** Gia Nguyen  
**Status:** Draft  
**Last Updated:** 2026-03-31  
**Approvers:** —  
**Reference:** [PRFAQ](PRFAQ-whiskly.md)  

---

## 1. Problem Statement

Young professionals who drink matcha regularly have no dedicated tool to track what
they've tried, remember what they liked, or discover new varieties that match their
taste. Existing information is scattered across promoted blog posts and tea-enthusiast
forums that don't speak to casual-but-curious drinkers. The current alternative is
a spreadsheet or nothing.

## 2. Goals & Success Metrics

| Goal | Metric | Target | Measurement |
|------|--------|--------|-------------|
| Users actively log matcha | Active users with 3+ logs in first month | 10+ users | App analytics |
| Recommendations feel useful | % of recommendations that get logged | > 20% | Log data |
| Users return after first session | 7-day retention | > 40% | App analytics |
| Users share with friends | Share cards generated per week | 5+ | App analytics |

## 3. User Persona

**Name:** Alex, 27  
**Role:** Young professional, design at a startup  
**Matcha behavior:** Drinks 3-5x/week, buys online and from local shops, has tried ~15
brands but can only name 5. Follows matcha accounts on Instagram. Has a Notes doc with
a few names scribbled down. Gets decision fatigue when buying new matcha — ends up
re-ordering what's familiar.  
**Motivation:** Wants to feel knowledgeable about matcha without deep tea expertise.
Likes having taste opinions and sharing discoveries with friends.  
**Frustration:** Can't remember what they've tried, doesn't trust sponsored recommendations,
overwhelmed by choices.

## 4. Scope

### In Scope (MVP)

- User accounts (sign up, log in, log out)
- Matcha catalog (curated, searchable)
- Matcha logging with 5-dimension taste rating
- Personal taste profile visualization
- Basic recommendations (taste-vector similarity)
- Curated content section (pairings, prep tips, origin stories)
- Shareable matcha card (image generation)
- Mobile-responsive web app

### Out of Scope (MVP)

- Native mobile apps (iOS/Android)
- Photo upload on logs
- Social features (feed, followers, comments)
- E-commerce / affiliate links
- User-generated content or reviews visible to others
- Advanced ML recommendation engine
- Multi-language support
- Public profile pages
- Push notifications
- Offline support

### Assumptions

- 5 taste dimensions are sufficient to differentiate matcha meaningfully
- A curated catalog of ~50-100 entries is enough for launch
- Cosine similarity on taste vectors produces useful recommendations after 3+ logs
- Content can be curated manually at 1-2 posts/week for launch scale
- Friends-and-family launch means < 50 users initially — no scaling pressure
- Users have modern mobile browsers (Safari, Chrome)

## 5. Requirements

### Functional Requirements

#### F1: Authentication

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F1.1 | User can sign up with email and password | P0 | |
| F1.2 | User can log in and log out | P0 | |
| F1.3 | User can reset password via email | P1 | |
| F1.4 | OAuth login (Google) | P2 | Nice-to-have for MVP |

#### F2: Matcha Catalog

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F2.1 | Browse matcha catalog with search | P0 | Search by name, brand, region |
| F2.2 | Each matcha entry has: name, brand, region, type (ceremonial/culinary/etc.), description | P0 | |
| F2.3 | User can add a custom matcha entry not in catalog | P1 | Prevents dead-ends when their matcha isn't listed |
| F2.4 | Catalog is admin-curated (no public submissions in v1) | P0 | |

#### F3: Matcha Logging

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F3.1 | User can log a matcha with 5 taste ratings (1-5 scale each) | P0 | Umami, sweetness, bitterness, grassiness, creaminess |
| F3.2 | User can add free-text notes to a log | P0 | |
| F3.3 | User can add an overall rating (1-5 stars) | P0 | Separate from taste dimensions |
| F3.4 | Log timestamp is auto-captured | P0 | |
| F3.5 | User can edit or delete a past log | P1 | |
| F3.6 | User can optionally add a photo to a log | P3 | Nice-to-have, out of MVP |
| F3.7 | User can view their log history, sorted by recency | P0 | |

#### F4: Taste Profile

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F4.1 | User sees a radar/spider chart of their average taste preferences | P0 | Aggregated across all logs |
| F4.2 | Profile updates automatically as new logs are added | P0 | |
| F4.3 | User can see how a specific matcha compares to their average profile | P1 | Overlay on the chart |

#### F5: Recommendations

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F5.1 | After 3+ logs, user sees recommended matcha from the catalog | P0 | |
| F5.2 | Recommendations based on cosine similarity between user taste vector and matcha catalog vectors | P0 | Catalog entries need baseline taste profiles |
| F5.3 | Recommendations exclude matcha the user has already logged | P0 | |
| F5.4 | User can dismiss a recommendation | P2 | |

#### F6: Content

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F6.1 | Content section with articles (pairing guides, prep tips, origin stories) | P1 | |
| F6.2 | Articles are admin-authored, stored as structured content | P1 | |
| F6.3 | Articles can be tagged by taste profile relevance | P2 | Enables personalized content later |

#### F7: Sharing

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| F7.1 | User can generate a styled card image for any logged matcha | P1 | Shows matcha name, taste radar, rating, notes snippet |
| F7.2 | Card can be saved to device or shared via native share sheet | P1 | |

### Non-Functional Requirements

- **Performance:** Pages load in < 2s on 4G. Log submission < 1s.
- **Security:** Passwords hashed (bcrypt/argon2). No sensitive data in client storage.
  HTTPS everywhere. Input sanitization on all user inputs.
- **Accessibility:** WCAG 2.1 AA for core flows (logging, browsing). Semantic HTML.
  Keyboard navigable.
- **Scalability:** Designed for < 50 users at launch. No premature optimization, but
  avoid architectural decisions that would block scaling to 1,000+ later.
- **Browser support:** Latest 2 versions of Safari (iOS) and Chrome (Android/desktop).

## 6. User Flows

### Core Flow: Log a Matcha

```
Home → "Log a Matcha" → Search catalog (or add custom) → Select matcha →
Rate 5 taste sliders → Add overall star rating → Add notes (optional) →
Save → See updated log history and taste profile
```

### Discovery Flow: Get a Recommendation

```
Home → "Recommendations" tab → See 3-5 suggested matcha with taste profiles →
Tap one → See detail (taste radar, description, why recommended) →
"Log this one" (after trying it) or dismiss
```

### Sharing Flow: Share a Card

```
Log history → Tap a log → "Share" button → Preview styled card →
Save to photos or share via native share sheet
```

### Content Flow: Browse Articles

```
Home → "Discover" tab → Browse articles by category (pairings, prep, origins) →
Read article → See related matcha from catalog
```

## 7. Design & UX

No mockups yet. Design direction:

- **Visual tone:** Clean, modern, slightly warm. Not clinical, not cutesy. Think
  Aesop meets a good coffee app. Matcha green as accent, not dominant.
- **Mobile-first:** Designed for thumb-reach on phone. Desktop is supported but
  secondary.
- **Key UI components:**
  - Taste slider (horizontal, 1-5, with haptic-style feedback)
  - Radar/spider chart for taste profiles
  - Matcha card (shareable image with brand-consistent styling)
  - Simple card-based content feed

## 8. Technical Considerations

Architecture decisions are tracked in [ADR-001](../adr/ADR-001-architecture-decisions-needed.md).

Key constraints:
- **PWA** — progressive web app for installability and app-like feel on mobile
- **User accounts** — need auth infrastructure from day 1
- **Matcha catalog seeding** — multi-source pipeline:
  1. **Yunomi.life** (primary) — ~50-80 products with pre-scored numerical taste data
     (umami, creaminess, bitterness, astringency on /20 scales). Normalize to 1-5.
     Accessed via free Shopify `/products.json` endpoint.
  2. **Kettl + Sazen Tea + Ippodo** — ~80 more products with rich prose descriptions.
     Use LLM to extract 1-5 taste scores from tasting notes. Also Shopify JSON.
  3. **Reddit (Arctic Shift archive)** — community reviews from r/matcha, r/tea for
     validation and confidence boosting. Free API, structured JSON.
  4. **Gia's manual ratings** — 3-4 gold-standard entries.
  5. Deduplicate across sources. Each entry gets a confidence score based on number
     of data sources backing it. User logs refine baselines over time.
- **Taste vector math** — cosine similarity on 5-dimensional taste vectors. Recommendations
  only include entries above a confidence threshold. Entries with sparse or conflicting
  scraped data are flagged and excluded from recommendations until a real user logs them.
- **Card image generation** — client-side (html2canvas) for MVP simplicity.
- **Content storage** — Markdown files in the repo. No CMS needed at launch scale.

## 9. Launch Plan

This is a friends-and-family launch, not a public launch.

- [ ] Deploy to a single environment (no staging/prod split needed for F&F)
- [ ] Seed catalog with ~50 matcha entries with baseline taste profiles
- [ ] Write 3-5 initial content articles
- [ ] Create 2-3 test accounts and verify all flows
- [ ] Share link with friends and family via group chat
- [ ] Collect feedback via a simple form or DMs
- [ ] No monitoring/alerting infrastructure needed at this scale — check logs manually

## 10. Open Questions

| # | Question | Owner | Status | Resolution |
|---|----------|-------|--------|------------|
| 1 | Who rates the catalog matcha for baseline taste profiles? | Gia | Resolved | Hybrid: 3-4 manual, rest via web scraping + sentiment analysis. User logs refine over time. |
| 2 | Should content be markdown in repo or in database? | Gia | Resolved | Markdown files in repo |
| 3 | PWA (installable, offline) or just responsive web? | Gia | Resolved | PWA |
| 4 | What OAuth providers beyond email/password, if any? | Gia | Open | Google is P2 |
| 5 | How should the recommendation "why" be explained? (e.g., "because you liked grassy matcha") | Gia | Open | |
| 6 | What sources should we scrape for catalog taste profiles? | Gia | Resolved | Yunomi (numerical), Kettl + Sazen + Ippodo (prose via LLM), Reddit/Arctic Shift (validation). All free. |
| 7 | How do we handle scraped profiles that have low confidence / conflicting data? | Gia | Resolved | Flag and exclude from recommendations until a real user logs that matcha. |

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-03-31 | Gia | Initial draft based on PRFAQ |
| 2026-03-31 | Gia | Resolved Q1-3: scraping for catalog seed, markdown content, PWA |
| 2026-03-31 | Gia | Resolved Q6-7: scraping sources (Yunomi, Kettl, Sazen, Ippodo, Reddit) and low-confidence policy |
