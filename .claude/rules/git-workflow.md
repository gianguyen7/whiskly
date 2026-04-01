---
description: Git workflow conventions
globs: "**/*"
---

# Git Workflow Rules

- Write commit messages in imperative mood ("Add feature" not "Added feature").
- Keep commits atomic — one logical change per commit.
- Never force-push to `main` or `master`.
- Always create feature branches from `main`.
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/` prefixes.
- PRs require at least a `/pre-merge-review` before merging.
- Tag releases with semver: `vMAJOR.MINOR.PATCH`.
