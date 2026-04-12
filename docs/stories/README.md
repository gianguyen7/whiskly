# User Stories

Standalone story cards for the Whiskly MVP. Each card follows
`docs/templates/USER-STORY.md`. Stories are also catalogued (with technical
notes and sequencing) in `docs/epics/EPIC-whiskly-mvp.md` — the cards here
are the implementation-ready slice focused on what the developer needs to
start and what QA needs to verify.

## Core MVP path

| ID     | Title                           | Sprint | Priority |
|--------|---------------------------------|--------|----------|
| [US-201](US-201-sign-up.md)     | Sign Up with Email & Password   | 1 | P0 |
| [US-202](US-202-log-in-out.md)  | Log In & Log Out                | 1 | P0 |
| [US-301](US-301-browse-catalog.md) | Browse Matcha Catalog        | 1 | P0 |
| [US-302](US-302-search-catalog.md) | Search the Catalog           | 1 | P0 |
| [US-401](US-401-log-form.md)    | Log Form — Taste & Star Rating  | 2 | P0 |
| [US-402](US-402-save-log.md)    | Save Log to Database            | 2 | P0 |
| [US-501](US-501-taste-profile.md) | Auto-Updating Taste Profile   | 2 | P0 |
| [US-602](US-602-recommendations.md) | Personalized Recommendations | 3 | P0 |

These 8 stories cover the critical path from signup → discovering matcha →
logging → seeing a personalized profile → receiving recommendations. P1
stories (password reset, custom matcha entries, edit/delete, comparison
view, content, sharing) live in the epic breakdown but don't get standalone
cards until they're pulled into a sprint.

## How to use a card

1. Read the full story + acceptance criteria before starting work.
2. Create a feature branch matching the ID: `feature/us-201-sign-up`.
3. Walk through the **Test Scenarios** table manually before opening a PR.
4. Update the status in the frontmatter as you progress.
