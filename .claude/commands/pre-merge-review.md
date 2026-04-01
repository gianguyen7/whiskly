# Pre-Merge Review

Perform a thorough code review before merging.

## Instructions

1. Identify the changes to review: $ARGUMENTS (branch name, PR number, or "staged changes")
2. Use the **qa-reviewer** agent to perform a comprehensive review
3. Check the following:
   - **Correctness** — Does the code do what it claims? Are there logic errors?
   - **Security** — Any injection vectors, auth bypasses, or data leaks?
   - **Tests** — Are changes tested? Are tests meaningful (not just coverage padding)?
   - **Performance** — Any N+1 queries, unbounded loops, or memory leaks?
   - **Style** — Does it follow project conventions?
   - **Breaking changes** — Will this break existing clients or workflows?
4. Run `git diff` to see the actual changes
5. Read modified files in full to understand context
6. Cross-reference with any related PRD or epic docs in `docs/`

## Output

Produce a structured review with:
1. **Verdict** — APPROVE, REQUEST_CHANGES, or NEEDS_DISCUSSION
2. **Findings** — Grouped by severity (BLOCKER, MAJOR, MINOR, NIT)
3. **Test assessment** — Coverage gaps or quality concerns
4. **Suggestions** — Optional improvements
