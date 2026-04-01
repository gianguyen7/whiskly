# Write Release Notes

Generate release notes for a version.

## Instructions

1. Read the release notes template at `docs/templates/RELEASE-NOTES.md`
2. Version or range to document: $ARGUMENTS (e.g., "v1.2.0", "since last tag", "last 2 weeks")
3. Use the **release-manager** agent to:
   - Analyze git history (`git log`, `git diff`) for the specified range
   - Determine the appropriate version bump (major/minor/patch)
   - Categorize changes (features, improvements, bug fixes, breaking changes)
4. Write release notes for a human audience — focus on user impact, not implementation
5. Include PR numbers and contributor attribution
6. If there are breaking changes, include a migration guide
7. Save to `docs/releases/RELEASE-<version>.md`

## Output

Produce complete release notes following the template. Highlight any breaking changes or required migration steps prominently.
