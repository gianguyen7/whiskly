#!/bin/bash
# Notification Hook — sends macOS notifications for long-running operations
# Used as a post-tool hook to notify when significant operations complete

INPUT=$(cat)
TOOL_NAME="${CLAUDE_TOOL_NAME:-unknown}"

# Only notify for operations that take a while
case "$TOOL_NAME" in
  Bash)
    COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | cut -d'"' -f4)
    # Notify for build, test, deploy commands
    if echo "$COMMAND" | grep -qE '(npm (run |test|build)|pytest|cargo (build|test)|make |docker |terraform |kubectl )'; then
      osascript -e "display notification \"Command completed: $(echo "$COMMAND" | head -c 50)\" with title \"Claude Code\" sound name \"Glass\"" 2>/dev/null || true
    fi
    ;;
  Agent)
    osascript -e "display notification \"Agent task completed\" with title \"Claude Code\" sound name \"Glass\"" 2>/dev/null || true
    ;;
esac

exit 0
