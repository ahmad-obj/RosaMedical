#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp() { "${compose[@]}" run --rm wpcli "$@"; }

fail() {
  printf 'Foundation runtime report failed: %s\n' "$1" >&2
  exit 1
}

wp_required() {
  local label="$1"
  shift
  local value
  if ! value="$(wp "$@")"; then
    fail "$label lookup failed"
  fi
  [[ -n "$value" ]] || fail "$label lookup returned empty output"
  printf '%s' "$value"
}

compose_required() {
  local label="$1"
  shift
  local value
  if ! value="$("${compose[@]}" "$@")"; then
    fail "$label lookup failed"
  fi
  [[ -n "$value" ]] || fail "$label lookup returned empty output"
  printf '%s' "$value"
}

printf '# Rosa Medical free foundation runtime\n\n'
printf -- '- WordPress: `%s`\n' "$(wp_required 'WordPress' core version)"
printf -- '- PHP: `%s`\n' "$(compose_required 'PHP' exec -T wordpress php -r 'echo PHP_VERSION;')"
printf -- '- Database: `%s`\n' "$(compose_required 'Database' exec -T db mariadb --version | tr -d '\r')"
printf -- '- Active theme: `%s`\n' "$(wp_required 'Active theme' theme list --status=active --field=name | head -n 1)"
printf -- '- rosa-medical-child: `%s`\n' "$(wp_required 'rosa-medical-child' theme get rosa-medical-child --field=version)"
printf -- '- Elementor: `%s`\n' "$(wp_required 'Elementor' plugin get elementor --field=version)"
printf -- '- WooCommerce: `%s`\n' "$(wp_required 'WooCommerce' plugin get woocommerce --field=version)"
printf -- '- rosa-medical-core: `%s`\n' "$(wp_required 'rosa-medical-core' plugin get rosa-medical-core --field=version)"
