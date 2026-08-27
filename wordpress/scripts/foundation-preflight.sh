#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  printf 'Foundation preflight failed: Docker is required for the isolated local WordPress environment.\n' >&2
  exit 2
fi

if ! docker compose version >/dev/null 2>&1; then
  printf 'Foundation preflight failed: Docker Compose v2 is required.\n' >&2
  exit 2
fi

printf 'Foundation preflight passed.\n'
