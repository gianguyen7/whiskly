---
description: Code quality standards for all implementations
globs: src/**/*
---

# Code Quality Rules

- Never commit secrets, API keys, or credentials. Use environment variables.
- All new functions must have corresponding tests.
- Handle errors explicitly — no silent catch blocks or empty error handlers.
- Use descriptive names. Avoid single-letter variables outside of loops.
- Keep functions under 50 lines. Extract helpers when complexity grows.
- Prefer immutability. Use `const` over `let`, avoid mutation where possible.
- No `console.log` in production code — use a proper logger.
- Validate inputs at system boundaries (API handlers, CLI args, external data).
