# Recent Memory

> Rolling 48-hour context window. Updated after each conversation.
> Important items get promoted to long-term memory nightly via `/consolidate-memory`.
> Loaded inline at conversation startup via CLAUDE.md.

---

## Last Updated: 2026-04-02

## Current Focus

- Phase 2 (Technical Design) nearing completion — Next.js scaffold done
- Next: create Supabase project, configure CI, dev env setup, write user stories

## Recent Decisions (Last 48hr)

- Next.js 16.2.2 scaffolded with App Router, TypeScript, Tailwind CSS
- Using @ducanh2912/next-pwa for PWA support (webpack-based, works alongside Turbopack with `turbopack: {}` config)
- Supabase SSR pattern: createBrowserClient (client), createServerClient (server + middleware)
- Route groups: (auth) for login/signup, (main) for authenticated pages with bottom nav
- Matcha-green color palette defined in globals.css via @theme inline (CSS custom properties)
- Next.js middleware handles auth session refresh + redirects unauthenticated users from protected routes
- Service stubs use server-side Supabase client (all data fetching is server-side)
- Chose materialized user taste profiles over computed-on-read
- Custom matcha entries go in same `matchas` table with `submitted_by` + `is_approved` flags
- Articles indexed in DB (not just frontmatter) for taste-profile-based content recommendations
- Multiple logs per matcha allowed

## Open Threads

- Phase 2 remaining: create Supabase project, configure CI, dev env setup
- Phase 1 remaining: user stories (5-10 for MVP), roadmap
- PRD open questions: Q4 (OAuth — Google is P2), Q5 (recommendation explanation UX)
- html2canvas vulnerability warnings in npm audit (5 high severity — upstream dep issues)
- Next.js 16 deprecates "middleware" file convention in favor of "proxy" — migration may be needed

## Blockers / Watch Items

- None currently
