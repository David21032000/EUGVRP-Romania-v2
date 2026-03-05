#!/usr/bin/env bash
set -euo pipefail

# If CLIENT_ID and TOKEN_BOT are present, try registering commands first (optional)
if [ -n "${CLIENT_ID:-}" ] && [ -n "${TOKEN_BOT:-}" ]; then
  echo "Registering slash commands (CLIENT_ID and TOKEN_BOT present)..."
  node deploy-commands.js || echo "deploy-commands failed or returned non-zero; continuing to start the bot"
fi

echo "Starting bot..."
node index.js
