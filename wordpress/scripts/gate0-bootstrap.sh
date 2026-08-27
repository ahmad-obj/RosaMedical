#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
mode="${ROSA_GATE0_MODE:-free}"

bash "$SCRIPT_DIR/gate0-preflight.sh"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

"${compose[@]}" up -d db wordpress

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

for _ in $(seq 1 60); do
  if wp core is-installed >/dev/null 2>&1; then
    break
  fi
  if wp core version >/dev/null 2>&1; then
    wp core install \
      --url="http://localhost:${ROSA_WP_PORT:-8088}" \
      --title="Rosa Medical Gate 0" \
      --admin_user="${ROSA_WP_ADMIN_USER:-rosa_gate0_admin}" \
      --admin_password="${ROSA_WP_ADMIN_PASSWORD:-rosa-gate0-local-only}" \
      --admin_email="${ROSA_WP_ADMIN_EMAIL:-gate0@example.invalid}" \
      --skip-email >/dev/null
    break
  fi
  sleep 2
done

if ! wp core is-installed >/dev/null 2>&1; then
  printf 'Gate 0 bootstrap failed: WordPress did not become ready in time.\n' >&2
  exit 1
fi

wp theme install hello-elementor --activate
wp plugin install elementor --activate
wp plugin install woocommerce --activate

if [[ "$mode" == "pro" ]]; then
  wp plugin install "$ROSA_ELEMENTOR_PRO_ZIP" --activate
fi

printf '\nGate 0 WordPress is ready at http://localhost:%s\n' "${ROSA_WP_PORT:-8088}"
printf 'Mode: %s\n' "$mode"
printf 'Next: import the purchased MedicaShop ZIP through Elementor/Envato supported kit import and record which templates require Pro.\n'
printf 'Do not install ElementsKit Lite or Skyboot unless the imported kit reports a concrete missing dependency.\n'
