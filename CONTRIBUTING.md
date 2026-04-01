# Contributing to Whiskly

## Getting Started

1. Clone the repo and create a branch from `main`
2. Follow the branch naming convention below
3. Make your changes in small, reviewable commits
4. Open a PR against `main` using the PR template

## Branch Naming

```
<type>/<short-description>

Examples:
  feat/user-auth
  fix/cart-total-rounding
  docs/api-endpoints
  chore/upgrade-deps
  spike/evaluate-redis
```

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `spike`

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): <description>

[optional body]

[optional footer(s)]
```

**Examples:**
```
feat(auth): add OAuth2 login flow
fix(cart): correct rounding on discount calculation
docs(api): add rate limiting section to API docs
test(orders): add integration tests for checkout
chore(deps): upgrade express to 4.19
refactor(db): extract query builder into shared utility
```

**Rules:**
- Subject line: imperative mood, lowercase, no period, max 72 chars
- Body: wrap at 80 chars, explain *why* not *what*
- Breaking changes: add `BREAKING CHANGE:` in footer or `!` after type

## Pull Requests

### Before Opening
- [ ] Code compiles/runs without errors
- [ ] All existing tests pass
- [ ] New code has tests (if applicable)
- [ ] No secrets, credentials, or PII committed
- [ ] Self-reviewed the diff

### PR Guidelines
- **One concern per PR.** Don't mix features with refactors.
- **Keep PRs small.** Aim for < 400 lines changed. Split larger work into stacked PRs.
- **Write a clear description.** Explain what changed, why, and how to test.
- **Link issues.** Reference related issue numbers with `Closes #NNN` or `Relates to #NNN`.

### Code Review

Reviewers should check for:
- [ ] Correctness: Does it do what the PR says?
- [ ] Clarity: Can a new team member understand this in 6 months?
- [ ] Tests: Are edge cases covered?
- [ ] Security: Any injection, auth, or data exposure risks?
- [ ] Performance: Any N+1 queries, unbounded loops, or missing indexes?
- [ ] Naming: Are names descriptive and consistent with the codebase?

**Review etiquette:**
- Comment on the code, not the person
- Prefix nits with `nit:` — these are optional
- Use `blocking:` for changes that must happen before merge
- Approve with comments if only nits remain

## Testing

See [docs/testing-strategy.md](docs/testing-strategy.md) for the full testing strategy.

**Minimum bar for merge:**
- Unit tests for new business logic
- Integration tests for new API endpoints
- No decrease in coverage for touched files

## Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR:** Breaking changes to public API or data schema
- **MINOR:** New features, backwards compatible
- **PATCH:** Bug fixes, backwards compatible
