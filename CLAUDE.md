# CLAUDE.md — Whiskly Project

> This file is the single source of truth for how Claude Code operates in this repository.
> It documents the project structure, available subagents, skills (slash commands), hooks,
> rules, and workflows so that every conversation starts with full context.

## Memory System

**IMPORTANT: At the start of every conversation, read `memory/recent-memory.md` inline for rolling context. Reference `memory/long-term-memory.md` by path when you need user preferences, permanent decisions, or patterns.**

The memory layer has three tiers:

| File | Purpose | Loaded |
|------|---------|--------|
| `memory/recent-memory.md` | Rolling 48-hour context: current focus, recent decisions, open threads | **Always read at startup** |
| `memory/long-term-memory.md` | Distilled facts, preferences, and permanent decisions | Read by path when needed |
| `memory/project-memory.md` | Active project state, architecture snapshot, phase status | Read by path when needed |

**Updating memory:**
- Update `recent-memory.md` at the end of any conversation where decisions were made or significant progress occurred
- Run `/consolidate-memory` to promote important items from recent → long-term and refresh all files
- A nightly scheduled job runs `/consolidate-memory` automatically at 11 PM ET

---

## Project Status

**Phase 2 (Technical Design) — in progress.** Stack decided: Next.js + Supabase + Vercel.
Database schema designed. Next: scaffold Next.js project or write user stories.

### Key Files
- [Execution Plan](docs/product/EXECUTION-PLAN.md) — phased roadmap from idea to launch
- [ADR-001](docs/adr/ADR-001-architecture-decisions-needed.md) — open architecture decisions
- [ADR-002](docs/adr/ADR-002-tech-stack.md) — tech stack decision
- [ADR-004](docs/adr/ADR-004-database-schema.md) — database schema design
- [Testing Strategy](docs/testing-strategy.md) — test pyramid, coverage targets, policies
- [Deployment Flow](docs/deployment-flow.md) — environments, pipeline, release process
- [Contributing](CONTRIBUTING.md) — commit conventions, branch naming, PR/review standards

---

## Project Structure

```
whiskly/
├── CLAUDE.md                    # This file — project rules & reference
├── .claude/
│   ├── settings.local.json      # Permissions, hooks configuration
│   ├── agents/                  # Custom subagent definitions
│   │   ├── product-strategist.md
│   │   ├── technical-architect.md
│   │   ├── engineering-planner.md
│   │   ├── implementation-engineer.md
│   │   ├── qa-reviewer.md
│   │   ├── release-manager.md
│   │   └── ux-designer.md
│   ├── commands/                # Custom slash commands (skills)
│   │   ├── write-prfaq.md
│   │   ├── write-prd.md
│   │   ├── draft-architecture.md
│   │   ├── break-into-epics.md
│   │   ├── scaffold-app.md
│   │   ├── pre-merge-review.md
│   │   ├── write-release-notes.md
│   │   └── consolidate-memory.md
│   └── rules/                   # Contextual rules (auto-loaded by glob)
│       ├── code-quality.md      # Applied to src/**/*
│       ├── security.md          # Applied to all files
│       └── git-workflow.md      # Applied to all files
├── docs/
│   ├── adr/                     # Architecture Decision Records
│   │   └── ADR-001-architecture-decisions-needed.md
│   ├── product/                 # Execution plan, roadmap, PRDs
│   │   └── EXECUTION-PLAN.md
│   ├── runbooks/                # Operational runbook templates
│   │   └── RUNBOOK-TEMPLATE.md
│   ├── templates/               # Document templates referenced by skills
│   │   ├── PRFAQ.md
│   │   ├── PRD.md
│   │   ├── ADR.md
│   │   ├── USER-STORY.md
│   │   ├── ROADMAP.md
│   │   └── RELEASE-NOTES.md
│   ├── testing-strategy.md
│   └── deployment-flow.md
├── scripts/                     # Hook scripts
│   ├── sensitive-file-guard.sh  # Blocks edits to .env, credentials, keys
│   ├── post-edit-lint-reminder.sh  # Reminds to lint after edits
│   ├── pre-commit-validation.sh    # Validates before git commit
│   └── notification-hook.sh        # macOS notifications on completion
├── src/
│   ├── api/                     # API route handlers and middleware
│   ├── services/                # Business logic layer
│   ├── models/                  # Data models and schemas
│   ├── lib/                     # Shared utilities
│   └── config/                  # Configuration management
├── tests/
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests
├── memory/                      # Persistent memory layer
│   ├── long-term-memory.md      # Distilled facts, preferences, patterns
│   ├── recent-memory.md         # Rolling 48hr context (loaded at startup)
│   └── project-memory.md        # Active project state and architecture
├── supabase/                    # Supabase migrations, seed, local config
│   ├── migrations/              # Schema migrations (run via `supabase db push`)
│   └── seed.sql                 # Catalog + article seed data
└── .github/                     # CI/CD workflows, PR/issue templates
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   ├── feature_request.md
    │   └── spike.md
    ├── workflows/
    │   └── ci.yml
    └── PULL_REQUEST_TEMPLATE.md
```

---

## Subagents

Six specialized agents are available in `.claude/agents/`. Use them by name when delegating work via the Agent tool.

| Agent | Role | When to Use |
|-------|------|-------------|
| **product-strategist** | Product thinking, market analysis, PR/FAQs | Defining what to build and why |
| **technical-architect** | System design, ADRs, tech stack decisions | Designing how to build it |
| **engineering-planner** | Epic/story breakdown, estimation, sequencing | Planning the engineering work |
| **implementation-engineer** | Writing production code and tests | Building features and fixes |
| **qa-reviewer** | Code review, security audit, test assessment | Reviewing before merge |
| **release-manager** | Versioning, changelogs, release coordination | Shipping a release |
| **ux-designer** | User flows, interaction patterns, UX copy, accessibility | Designing how users interact with features |

### Typical Workflow

```
product-strategist  →  technical-architect  →  engineering-planner
        ↓                      ↓                       ↓
   PR/FAQ & PRD            ADR(s)              Epics & Stories
                                                       ↓
                                            implementation-engineer
                                                       ↓
                                                 qa-reviewer
                                                       ↓
                                               release-manager
```

### Usage Examples

```
# Delegate architecture work
Use the technical-architect agent to design the authentication system

# Parallel agents for independent work
Launch product-strategist for competitive analysis AND
engineering-planner to break down the existing PRD into stories

# Sequential pipeline
1. product-strategist writes the PR/FAQ
2. technical-architect drafts the ADR
3. engineering-planner breaks it into epics
```

---

## Skills (Slash Commands)

Seven custom slash commands are available in `.claude/commands/`. Type `/<command>` to invoke.

### Project-specific commands (`.claude/commands/`)

| Command | Description | Outputs To |
|---------|-------------|------------|
| `/write-prfaq <feature>` | Write a complete PR/FAQ document | `docs/prfaq/` |
| `/write-prd <feature>` | Write a Product Requirements Document | `docs/prd/` |
| `/draft-architecture <decision>` | Create an Architecture Decision Record | `docs/adr/` |
| `/break-into-epics <feature/PRD>` | Decompose into epics, stories, tasks | `docs/epics/` |
| `/scaffold-app <feature>` | Generate application code with tests | `src/`, `tests/` |
| `/pre-merge-review [branch/PR]` | Comprehensive code review | Console output |
| `/write-release-notes <version>` | Generate release notes from git history | `docs/releases/` |

### Cross-project commands (inherited from `../../.claude/commands/`)

| Command | Description | Outputs To |
|---------|-------------|------------|
| `/consolidate-memory` | Consolidate recent activity into memory layer | `memory/` |
| `/research-scout` | Search web for new info that challenges or extends project knowledge | `memory/` |
| `/promote-learnings` | Weekly review: promote confirmed findings from staging to permanent memory | `memory/` |

### Skill Chaining

Skills are designed to chain together. A typical feature lifecycle:

```
/write-prfaq whiskey-recommendation-engine
    → produces docs/prfaq/PRFAQ-whiskey-recommendation-engine.md

/write-prd whiskey-recommendation-engine
    → produces docs/prd/PRD-whiskey-recommendation-engine.md

/draft-architecture recommendation-service-design
    → produces docs/adr/ADR-001-recommendation-service-design.md

/break-into-epics whiskey-recommendation-engine
    → produces docs/epics/EPIC-whiskey-recommendation-engine.md

/scaffold-app whiskey-recommendation-engine
    → generates src/ and tests/ files

/pre-merge-review feature/recommendation-engine
    → outputs review verdict and findings

/write-release-notes v1.0.0
    → produces docs/releases/RELEASE-v1.0.0.md
```

---

## Hooks

Four hooks are configured in `.claude/settings.local.json` and run automatically.

### 1. Sensitive File Guard (Pre-Tool: Edit, Write)
**Script:** `scripts/sensitive-file-guard.sh`
**Purpose:** Blocks edits to sensitive files (`.env`, credentials, `.pem`, `.key`, `*.tfstate`, etc.)
**Behavior:** Returns exit code 2 (block) if the target file matches a sensitive pattern. If you need to edit a protected file, ask the user for explicit permission first.

### 2. Post-Edit Lint Reminder (Post-Tool: Edit, Write)
**Script:** `scripts/post-edit-lint-reminder.sh`
**Purpose:** After editing a file, reminds you to run the appropriate formatter/linter based on file extension:
- `.js/.ts/.tsx/.jsx` → Prettier + ESLint
- `.py` → Black + Ruff
- `.go` → gofmt + go vet
- `.rs` → rustfmt + Clippy

### 3. Pre-Commit Validation (Pre-Tool: Bash matching `git commit`)
**Script:** `scripts/pre-commit-validation.sh`
**Purpose:** Runs checks before any `git commit` command:
- Blocks if `.env` files are staged
- Warns about large files (>5MB)
- Warns about debug statements (`console.log`, `debugger`, `pdb.set_trace`)
- Notes new TODO/FIXME comments

### 4. Notification Hook (Post-Tool: Bash, Agent)
**Script:** `scripts/notification-hook.sh`
**Purpose:** Sends macOS notifications (via `osascript`) when long-running operations complete (builds, tests, deploys, agent tasks).

---

## Rules

Three rule files in `.claude/rules/` are auto-loaded based on glob patterns.

### Code Quality (`src/**/*`)
- All new functions must have tests
- Explicit error handling — no silent catches
- Functions under 50 lines
- No `console.log` in production code
- Validate inputs at system boundaries

### Security (`**/*`)
- Never hardcode secrets
- Never log sensitive data
- Parameterized queries only — no SQL concatenation
- Sanitize user inputs
- HTTPS for all external calls

### Git Workflow (`**/*`)
- Imperative commit messages
- Atomic commits
- Never force-push to main
- Branch prefixes: `feature/`, `fix/`, `chore/`, `docs/`
- Semver tags: `vMAJOR.MINOR.PATCH`

---

## Key Conventions

### Code Organization
- **API handlers** go in `src/api/` — thin layer, delegates to services
- **Business logic** goes in `src/services/` — the core of the application
- **Data models** go in `src/models/` — schemas, types, validation
- **Shared utilities** go in `src/lib/` — pure functions, helpers
- **Configuration** goes in `src/config/` — env var loading, feature flags

### Testing Strategy
- **Unit tests** (`tests/unit/`) — test individual functions in isolation
- **Integration tests** (`tests/integration/`) — test service interactions
- **E2E tests** (`tests/e2e/`) — test full user workflows
- Write tests alongside code, not as an afterthought
- Test behavior, not implementation details

### Documentation
- All templates live in `docs/templates/` — use them, don't reinvent
- Generated docs go in their respective `docs/` subdirectories
- Keep docs close to decisions — ADRs capture *why*, not just *what*

### Environment & Secrets
- Never commit `.env` files (already in `.gitignore`)
- Use `.env.example` with placeholder values for documentation
- Reference secrets via environment variables in code
- The sensitive file guard hook will block accidental edits to credential files

---

## Quick Reference

```
# Start a new feature (full pipeline)
/write-prfaq <feature>      # Define the what & why
/write-prd <feature>         # Detail the requirements
/draft-architecture <topic>  # Design the solution
/break-into-epics <feature>  # Plan the work
/scaffold-app <feature>      # Generate the code
/pre-merge-review            # Review before merge
/write-release-notes <ver>   # Document the release

# Code review
/pre-merge-review            # Full review of current changes

# Release
/write-release-notes v1.0.0  # Generate release notes

# Memory
/consolidate-memory          # Nightly consolidation (also runs automatically at 11 PM PT)
```
