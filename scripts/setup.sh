#!/usr/bin/env bash
#
# scripts/setup.sh — first-run developer setup for Whiskly.
#
# Goal: get a fresh clone to a running dev server in under 10 minutes.
#
# What this script does (idempotent — safe to re-run):
#   1. Verifies required tools are installed (node, npm, git)
#   2. Recommends optional tools (supabase CLI) with install hints
#   3. Checks Node version against package.json engines / CI target
#   4. Installs npm dependencies via `npm ci` (or `npm install` on first run)
#   5. Creates .env.local from .env.example if it does not exist
#   6. Reminds the user to fill in Supabase credentials if .env.local is empty
#   7. Runs `npm run lint` + `npm run typecheck` as a smoke test
#
# What this script does NOT do:
#   - Create the Supabase project (you get credentials from the dashboard)
#   - Run migrations (use `supabase db push` after linking)
#   - Start the dev server (run `npm run dev` when you are ready)

set -euo pipefail

# --- helpers ----------------------------------------------------------------

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
BOLD="\033[1m"
RESET="\033[0m"

info()  { printf "${BLUE}[info]${RESET}  %s\n" "$*"; }
ok()    { printf "${GREEN}[ok]${RESET}    %s\n" "$*"; }
warn()  { printf "${YELLOW}[warn]${RESET}  %s\n" "$*"; }
error() { printf "${RED}[error]${RESET} %s\n" "$*" >&2; }

require_cmd() {
  local cmd="$1"
  local hint="${2:-}"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    error "$cmd is required but was not found."
    if [ -n "$hint" ]; then
      printf "         %s\n" "$hint"
    fi
    exit 1
  fi
}

recommend_cmd() {
  local cmd="$1"
  local purpose="$2"
  local hint="$3"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    warn "$cmd is not installed — $purpose will not work."
    printf "         Install: %s\n" "$hint"
    return 1
  fi
  return 0
}

# --- preflight --------------------------------------------------------------

# Resolve the repo root based on this script's location, so the user can
# run it from anywhere.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

printf "${BOLD}Whiskly dev environment setup${RESET}\n"
printf "Repo: %s\n\n" "$REPO_ROOT"

# --- 1. required tools ------------------------------------------------------

info "Checking required tools..."
require_cmd git "Install git from https://git-scm.com/"
require_cmd node "Install Node.js 22+ from https://nodejs.org/ or via nvm"
require_cmd npm "npm ships with Node.js — reinstall Node if missing"
ok "git, node, npm found"

# --- 2. node version --------------------------------------------------------

NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
REQUIRED_NODE_MAJOR=22

if [ "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ]; then
  error "Node.js $REQUIRED_NODE_MAJOR or newer is required. Found: $(node -v)"
  printf "         CI uses Node %s — mismatched local versions cause drift.\n" "$REQUIRED_NODE_MAJOR"
  printf "         Try: nvm install %s && nvm use %s\n" "$REQUIRED_NODE_MAJOR" "$REQUIRED_NODE_MAJOR"
  exit 1
fi
ok "Node $(node -v) >= v$REQUIRED_NODE_MAJOR"

# --- 3. optional tools ------------------------------------------------------

info "Checking optional tools..."
recommend_cmd supabase "migrations (supabase db push / migration list)" \
  "brew install supabase/tap/supabase  (macOS)" || true

# --- 4. dependencies --------------------------------------------------------

info "Installing npm dependencies..."
if [ -f package-lock.json ]; then
  npm ci
else
  warn "No package-lock.json found — running npm install instead of npm ci"
  npm install
fi
ok "Dependencies installed"

# --- 5. .env.local ----------------------------------------------------------

if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    ok "Created .env.local from .env.example"
    warn ".env.local contains placeholder values. Fill in your Supabase credentials:"
    printf "         1. Go to https://supabase.com/dashboard\n"
    printf "         2. Open your project → Settings → API\n"
    printf "         3. Copy the Project URL and anon/public key into .env.local\n"
  else
    error ".env.example is missing — ask a teammate for one."
    exit 1
  fi
else
  ok ".env.local already exists (not overwriting)"
  if grep -q "your-project-url\|your-anon-key" .env.local 2>/dev/null; then
    warn ".env.local still contains placeholder values — fill them in before running the app."
  fi
fi

# --- 6. smoke test ----------------------------------------------------------

info "Running smoke tests (lint + typecheck)..."
npm run lint >/dev/null 2>&1 && ok "ESLint passes" || warn "ESLint reported issues — run 'npm run lint' for details"
npm run typecheck >/dev/null 2>&1 && ok "TypeScript passes" || warn "TypeScript reported issues — run 'npm run typecheck' for details"

# --- done -------------------------------------------------------------------

printf "\n%bSetup complete.%b\n\n" "${BOLD}${GREEN}" "${RESET}"
printf "Next steps:\n"
printf "  1. Verify %b.env.local%b has real Supabase credentials\n" "${BOLD}" "${RESET}"
printf "  2. Start the dev server: %bnpm run dev%b\n" "${BOLD}" "${RESET}"
printf "  3. Open %bhttp://localhost:3000%b\n\n" "${BOLD}" "${RESET}"
printf "Other useful commands:\n"
printf "  %bnpm run ci%b               Run the full CI pipeline locally\n" "${BOLD}" "${RESET}"
printf "  %bsupabase migration list%b  Show local vs remote migration state\n" "${BOLD}" "${RESET}"
printf "  %bsupabase db push%b         Apply pending migrations to the remote DB\n" "${BOLD}" "${RESET}"
