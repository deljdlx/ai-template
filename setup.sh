#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# setup.sh — Bootstrap a new project from the ai-template
#
# Usage:
#   ./setup.sh <project-name>
#
# What it does:
#   1. Replaces all {{PROJECT}} placeholders with <project-name>
#   2. Removes the demo code (src/frontend/, config files)
#   3. Reinitializes git (fresh history)
#   4. Creates the initial commit
# ─────────────────────────────────────────────────────────────

if [ $# -lt 1 ]; then
  echo "Usage: ./setup.sh <project-name>"
  echo "Example: ./setup.sh my-app"
  exit 1
fi

PROJECT_NAME="$1"

echo "┌─────────────────────────────────────┐"
echo "│  ai-template setup                  │"
echo "│  Project: $PROJECT_NAME"
echo "└─────────────────────────────────────┘"
echo ""

# ── 1. Replace {{PROJECT}} in all relevant files ─────────────

FILES_WITH_PLACEHOLDER=(
  "CLAUDE.md"
  "AGENTS.md"
  ".github/copilot-instructions.md"
  "ai-instructions/git.md"
)

echo "→ Replacing {{PROJECT}} with '$PROJECT_NAME'..."

for file in "${FILES_WITH_PLACEHOLDER[@]}"; do
  if [ -f "$file" ]; then
    sed -i "s/{{PROJECT}}/$PROJECT_NAME/g" "$file"
    echo "  ✓ $file"
  else
    echo "  ⚠ $file not found, skipping"
  fi
done

echo ""

# ── 2. Remove demo code ──────────────────────────────────────

echo "→ Removing demo code..."

DEMO_FILES=(
  "src/frontend"
  "vite.config.js"
  "eslint.config.js"
  ".prettierrc"
  "package.json"
  "package-lock.json"
)

for item in "${DEMO_FILES[@]}"; do
  if [ -e "$item" ]; then
    rm -rf "$item"
    echo "  ✓ removed $item"
  fi
done

echo ""

# ── 3. Remove this script ────────────────────────────────────

echo "→ Cleaning up..."
rm -f setup.sh
echo "  ✓ removed setup.sh"
echo ""

# ── 4. Reinitialize git ──────────────────────────────────────

echo "→ Reinitializing git..."
rm -rf .git
git init
git add -A
git commit -m "chore: initialize $PROJECT_NAME from ai-template"
echo ""

echo "┌─────────────────────────────────────┐"
echo "│  Done!                              │"
echo "└─────────────────────────────────────┘"
echo ""
echo "Next steps:"
echo "  1. Choose your stack (see ai-instructions/recipes/)"
echo "  2. Remove unused recipes"
echo "  3. Create a GitHub repo:"
echo "     gh repo create $PROJECT_NAME --public --source=. --push"
echo ""
