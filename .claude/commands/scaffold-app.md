# Scaffold App

Scaffold application code for a feature based on existing plans.

## Instructions

1. Read the relevant PRD, ADR, and epic breakdown for context: $ARGUMENTS
2. Use the **implementation-engineer** agent to generate the code
3. Follow the project structure:
   - `src/api/` — Route handlers and middleware
   - `src/services/` — Business logic
   - `src/models/` — Data models and schemas
   - `src/lib/` — Shared utilities
   - `src/config/` — Configuration
   - `tests/unit/` — Unit tests
   - `tests/integration/` — Integration tests
4. For each file created:
   - Follow existing code patterns and conventions
   - Include appropriate error handling
   - Write corresponding test files
5. Do NOT create `.env` files with real secrets — use `.env.example` with placeholders
6. Update any configuration or dependency files as needed

## Output

Create all necessary files. Provide a summary of what was created and any manual steps needed (e.g., environment variables to set, services to configure).
