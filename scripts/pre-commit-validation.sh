#!/bin/bash
# Pre-Commit Validation — checks for common issues before committing
# Used as a pre-tool hook for Bash commands matching git commit

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4)

# Only check git commit commands
if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

echo "Running pre-commit validation checks..."

# Check for .env files staged
STAGED_ENV=$(git diff --cached --name-only 2>/dev/null | grep -E '\.env($|\.)' | grep -v '\.env\.example$')
if [ -n "$STAGED_ENV" ]; then
  echo "BLOCKED: Environment files are staged for commit:" >&2
  echo "$STAGED_ENV" >&2
  echo "Remove them with: git reset HEAD <file>" >&2
  exit 2
fi

# Check for large files (>5MB)
LARGE_FILES=$(git diff --cached --name-only 2>/dev/null | while read f; do
  if [ -f "$f" ]; then
    SIZE=$(wc -c < "$f" 2>/dev/null | tr -d ' ')
    if [ "$SIZE" -gt 5242880 ] 2>/dev/null; then
      echo "$f ($(( SIZE / 1048576 ))MB)"
    fi
  fi
done)
if [ -n "$LARGE_FILES" ]; then
  echo "WARNING: Large files staged for commit:" >&2
  echo "$LARGE_FILES" >&2
fi

# Check for debug/console statements
DEBUG_HITS=$(git diff --cached --name-only 2>/dev/null | while read f; do
  if [ -f "$f" ]; then
    grep -n -E '(console\.log|debugger|breakpoint\(\)|pdb\.set_trace|binding\.pry)' "$f" 2>/dev/null | while read line; do
      echo "  $f:$line"
    done
  fi
done)
if [ -n "$DEBUG_HITS" ]; then
  echo "WARNING: Debug statements found in staged files:" >&2
  echo "$DEBUG_HITS" >&2
fi

# Check for TODO/FIXME/HACK
TODO_HITS=$(git diff --cached -U0 2>/dev/null | grep -E '^\+.*\b(TODO|FIXME|HACK|XXX)\b' | head -5)
if [ -n "$TODO_HITS" ]; then
  echo "NOTE: New TODO/FIXME comments added:"
  echo "$TODO_HITS"
fi

exit 0
