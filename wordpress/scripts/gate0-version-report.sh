#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp() { "${compose[@]}" run --rm wpcli "$@"; }

printf '# Rosa Medical Gate 0 runtime\n\n'
printf -- '- Gate mode: `%s`\n' "${ROSA_GATE0_MODE:-free}"
printf -- '- WordPress: `%s`\n' "$(wp core version)"
printf -- '- PHP: `%s`\n' "$("${compose[@]}" exec -T wordpress php -r 'echo PHP_VERSION;')"
printf -- '- Database: `%s`\n' "$("${compose[@]}" exec -T db mariadb --version | tr -d '\r')"
printf '\n## Themes\n\n```text\n'
wp theme list --fields=name,status,version
printf '```\n\n## Plugins\n\n```text\n'
wp plugin list --fields=name,status,version
printf '```\n'
