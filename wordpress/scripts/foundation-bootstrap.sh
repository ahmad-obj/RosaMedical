#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"

bash "$SCRIPT_DIR/foundation-preflight.sh"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

"${compose[@]}" up -d db wordpress

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

for _ in $(seq 1 60); do
  if wp core version >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

if ! wp core version >/dev/null 2>&1; then
  printf 'Foundation bootstrap failed: WordPress files did not become ready in time.\n' >&2
  exit 1
fi

if ! wp core is-installed >/dev/null 2>&1; then
  wp core install \
    --url="http://localhost:${ROSA_WP_PORT:-8088}" \
    --title="Rosa Medical Foundation" \
    --admin_user="${ROSA_WP_ADMIN_USER:-rosa_foundation_admin}" \
    --admin_password="${ROSA_WP_ADMIN_PASSWORD:-rosa-foundation-local-only}" \
    --admin_email="${ROSA_WP_ADMIN_EMAIL:-foundation@example.invalid}" \
    --skip-email >/dev/null
fi

if ! wp theme is-installed hello-elementor >/dev/null 2>&1; then
  wp theme install hello-elementor >/dev/null
fi
if ! wp plugin is-installed elementor >/dev/null 2>&1; then
  wp plugin install elementor >/dev/null
fi
if ! wp plugin is-installed woocommerce >/dev/null 2>&1; then
  wp plugin install woocommerce >/dev/null
fi

wp plugin activate elementor >/dev/null
wp plugin activate woocommerce >/dev/null
# WooCommerce can default a newly created store to coming-soon mode. The
# disposable Rosa foundation must expose public catalogue routes so shared
# templates and acceptance checks execute through the normal WordPress loader.
wp option update woocommerce_coming_soon no >/dev/null
wp theme activate rosa-medical-child >/dev/null
wp plugin activate rosa-medical-core >/dev/null
wp rewrite structure '/%postname%/' --hard >/dev/null
wp rewrite flush --hard >/dev/null

printf 'Rosa Medical free foundation ready at http://localhost:%s\n' "${ROSA_WP_PORT:-8088}"
