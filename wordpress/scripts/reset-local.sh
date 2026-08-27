#!/usr/bin/env bash
set -euo pipefail

if [[ "${ROSA_GATE0_CONFIRM_RESET:-}" != "yes" ]]; then
  printf 'Refusing reset. Set ROSA_GATE0_CONFIRM_RESET=yes to destroy only the Rosa Gate 0 local containers/volumes.\n' >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
"${compose[@]}" down --volumes --remove-orphans
printf 'Rosa Medical Gate 0 local environment removed.\n'
