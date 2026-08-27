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

wordpress_version="$(wp_required 'WordPress' core version)"
php_version="$(compose_required 'PHP' exec -T wordpress php -r 'echo PHP_VERSION;')"
database_version="$(compose_required 'Database' exec -T db mariadb --version | tr -d '\r')"
active_theme="$(wp_required 'Active theme' theme list --status=active --field=name)"
child_theme_version="$(wp_required 'rosa-medical-child' theme get rosa-medical-child --field=version)"
elementor_version="$(wp_required 'Elementor' plugin get elementor --field=version)"
woocommerce_version="$(wp_required 'WooCommerce' plugin get woocommerce --field=version)"
rosa_core_version="$(wp_required 'rosa-medical-core' plugin get rosa-medical-core --field=version)"

printf '# Rosa Medical free foundation runtime\n\n'
printf -- '- WordPress: `%s`\n' "$wordpress_version"
printf -- '- PHP: `%s`\n' "$php_version"
printf -- '- Database: `%s`\n' "$database_version"
printf -- '- Active theme: `%s`\n' "$active_theme"
printf -- '- rosa-medical-child: `%s`\n' "$child_theme_version"
printf -- '- Elementor: `%s`\n' "$elementor_version"
printf -- '- WooCommerce: `%s`\n' "$woocommerce_version"
printf -- '- rosa-medical-core: `%s`\n' "$rosa_core_version"
