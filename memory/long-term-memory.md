# Long-Term Memory

> Distilled facts, preferences, and patterns that persist across all conversations.
> Updated nightly by `/consolidate-memory` — promoted from recent memory.
> Referenced by path in CLAUDE.md.

---

## User Profile

- **Name:** Gia Nguyen
- **GitHub:** gianguyen7 (email: ngkhuonggia@gmail.com)
- **Role:** Solo developer, building Whiskly as a personal/friends-and-family project
- **Background:** Data science (UC Berkeley MIDS), comfortable with Python, learning web stack

## Preferences & Working Style

- Prefers decisions to be surfaced with tradeoffs, not just recommendations
- Wants docs before code — values clarity over speed
- Likes structured templates and process but keeps MVP scope tight
- Comfortable delegating to AI for research (e.g., scraping source analysis)
- Prefers free/low-cost tools — not looking to monetize yet

## Key Decisions (Permanent)

- **Product:** Whiskly is a matcha tracking PWA, not a whiskey app despite the name
- **Target user:** Young professionals, matcha-curious, not full tea enthusiasts
- **Stack:** Next.js + TypeScript + Supabase + Vercel + Tailwind
- **Auth:** Supabase Auth (email/password, Google OAuth P2)
- **Database:** Supabase Postgres with RLS
- **Content:** MDX files in repo, indexed in DB for taste-based recommendations
- **Sharing:** Styled card images (not public URLs) — fits target user's social behavior
- **Catalog seeding:** Scrape Yunomi, Kettl, Sazen, Ippodo via Shopify JSON + Reddit validation
- **Low-confidence data:** Flagged and excluded from recommendations until a real user logs it
- **Taste dimensions:** Umami, sweetness, bitterness, grassiness, creaminess (1-5 scale)
- **Recommendations:** Cosine similarity on taste vectors, requires 3+ logs
- **User profiles:** Materialized averages (trigger-updated), not computed on read
- **Multiple logs per matcha:** Allowed (tastes evolve, preparation varies)
- **Photo upload:** Nice-to-have, not in MVP
- **PWA:** Yes — installable, app-like feel

## Patterns Observed

- Gia makes decisions quickly when given clear options with tradeoffs
- Prefers "same table, flag it" over separate tables for related data
- Chooses materialized/pre-computed over lazy computation
- Values database-level enforcement (triggers, RLS) over app-layer logic

---

## My Learnings (Staging)

> Research scout findings awaiting weekly review. Each entry is verified and either promoted to permanent memory or discarded.
> Format: `- **[YYYY-MM-DD]** [TAG] Summary | Source: url | Status: unreviewed`

_No staged learnings yet._
