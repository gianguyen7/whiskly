#!/bin/bash
# Post-Edit Lint Reminder — reminds to run formatter/linter after edits
# Used as a post-tool hook for Edit/Write operations

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

EXT="${FILE_PATH##*.}"

case "$EXT" in
  js|jsx|ts|tsx)
    echo "Reminder: Run 'npx prettier --write $FILE_PATH && npx eslint --fix $FILE_PATH' to format and lint."
    ;;
  py)
    echo "Reminder: Run 'black $FILE_PATH && ruff check --fix $FILE_PATH' to format and lint."
    ;;
  go)
    echo "Reminder: Run 'gofmt -w $FILE_PATH && go vet ./...' to format and vet."
    ;;
  rs)
    echo "Reminder: Run 'rustfmt $FILE_PATH && cargo clippy' to format and lint."
    ;;
  *)
    ;;
esac

exit 0
