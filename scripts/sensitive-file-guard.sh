#!/bin/bash
# Sensitive File Guard — prevents edits to protected files
# Used as a pre-tool hook for Read/Edit/Write operations

SENSITIVE_PATTERNS=(
  ".env"
  ".env.local"
  ".env.production"
  ".env.*.local"
  "credentials"
  "secrets"
  ".pem"
  ".key"
  "id_rsa"
  "*.tfstate"
  "settings.local.json"
)

# The tool input is passed via stdin as JSON
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

BASENAME=$(basename "$FILE_PATH")

for PATTERN in "${SENSITIVE_PATTERNS[@]}"; do
  case "$BASENAME" in
    $PATTERN)
      echo "BLOCKED: '$FILE_PATH' matches sensitive file pattern '$PATTERN'." >&2
      echo "If you need to modify this file, ask the user for explicit permission." >&2
      exit 2
      ;;
  esac
done

exit 0
