#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp() { "${compose[@]}" run --rm wpcli "$@"; }

printf '# Rosa Medical free foundation runtime\n\n'
printf -- '- WordPress: `%s`\n' "$(wp core version)"
printf -- '- PHP: `%s`\n' "$("${compose[@]}" exec -T wordpress php -r 'echo PHP_VERSION;')"
printf -- '- Database: `%s`\n' "$("${compose[@]}" exec -T db mariadb --version | tr -d '\r')"
printf -- '- Active theme: `%s`\n' "$(wp theme list --status=active --field=name | head -n 1)"
printf -- '- rosa-medical-child: `%s`\n' "$(wp theme get rosa-medical-child --field=version)"
printf -- '- Elementor: `%s`\n' "$(wp plugin get elementor --field=version)"
printf -- '- WooCommerce: `%s`\n' "$(wp plugin get woocommerce --field=version)"
printf -- '- rosa-medical-core: `%s`\n' "$(wp plugin get rosa-medical-core --field=version)"
