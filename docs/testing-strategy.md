# Testing Strategy

## Philosophy

- **Test behavior, not implementation.** Tests should verify what the system does, not how it does it.
- **Fast feedback loops.** Unit tests run in seconds; integration tests in under a minute.
- **Tests are documentation.** A new team member should be able to understand features by reading tests.
- **Fix the test, not the flake.** Flaky tests get quarantined and fixed, never ignored.

## Test Pyramid

```
        /  E2E   \        ← Few: critical user journeys only
       / Integration\     ← Moderate: API contracts, DB queries, service boundaries
      /    Unit       \   ← Many: business logic, pure functions, edge cases
```

## Test Types

### Unit Tests (`tests/unit/`)

- **What:** Pure business logic, utilities, data transformations
- **Dependencies:** None — all external deps are mocked/stubbed
- **Speed:** < 5s for full suite
- **When to write:** Every new function with non-trivial logic

### Integration Tests (`tests/integration/`)

- **What:** API endpoints, database queries, service-to-service calls
- **Dependencies:** Real database (test instance), real HTTP calls between internal services
- **Speed:** < 60s for full suite
- **When to write:** Every new API endpoint, every new DB query pattern

### End-to-End Tests (`tests/e2e/`)

- **What:** Critical user journeys through the full stack
- **Dependencies:** Full application running (staging-like environment)
- **Speed:** < 5 min for full suite
- **When to write:** Core happy paths only — sign up, main workflow, checkout (if applicable)

## Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Unit | 80%+ on business logic | High value, low cost |
| Integration | Key paths covered | Catch contract/schema issues |
| E2E | Top 5-10 user journeys | Catch full-stack regressions |

Coverage is a guide, not a gate. Don't write tests just to hit a number.

## When Tests Run

| Trigger | Unit | Integration | E2E |
|---------|------|-------------|-----|
| Pre-commit (local) | Yes | No | No |
| CI on PR | Yes | Yes | No |
| CI on merge to main | Yes | Yes | Yes |
| Nightly | Yes | Yes | Yes |

## Test Data

- **Unit:** Inline fixtures or factory functions. No shared mutable state.
- **Integration:** Seeded database per test run. Transactions rolled back after each test.
- **E2E:** Dedicated seed script (`scripts/seed-test-data.sh`).

## Naming Convention

```
describe("[Unit/Module]", () => {
  it("should [expected behavior] when [condition]", () => {
    // Arrange → Act → Assert
  });
});
```

## Flaky Test Policy

1. If a test fails intermittently, tag it `@flaky` and open a bug
2. Flaky tests are excluded from blocking CI within 24 hours
3. Flaky tests must be fixed or deleted within 1 sprint
