#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

mu_plugin='/var/www/html/wp-content/mu-plugins/rosa-template-debug.php'
cleanup() {
  "${compose[@]}" exec -T wordpress rm -f "$mu_plugin" >/dev/null 2>&1 || true
}
trap cleanup EXIT

"${compose[@]}" exec -T wordpress sh -lc 'mkdir -p /var/www/html/wp-content/mu-plugins && cat > /var/www/html/wp-content/mu-plugins/rosa-template-debug.php' <<'PHP'
<?php
/** Temporary Rosa template debugging. Removed automatically by the caller. */
if (! isset($_GET['rosa_template_debug'])) {
    return;
}

function rosa_debug_header_value(string $name, string $value): void
{
    header('X-Rosa-Debug-' . $name . ': ' . str_replace(["\r", "\n"], '', $value));
}

add_action('template_redirect', static function (): void {
    rosa_debug_header_value('Redirect-IsProduct', function_exists('is_product') && is_product() ? 'yes' : 'no');
    rosa_debug_header_value('Redirect-IsSingularProduct', is_singular('product') ? 'yes' : 'no');
    rosa_debug_header_value('Redirect-QueriedId', (string) get_queried_object_id());
    rosa_debug_header_value('Redirect-PostType', (string) get_post_type(get_queried_object_id()));
    rosa_debug_header_value('Redirect-RosaHook', (string) has_filter('template_include', ['RosaMedical\\Core\\Plugin', 'productTemplate']));
});

foreach ([12, 99, 101, 999] as $priority) {
    add_filter('template_include', static function (string $template) use ($priority): string {
        rosa_debug_header_value('P' . $priority . '-Template', basename($template));
        rosa_debug_header_value('P' . $priority . '-IsProduct', function_exists('is_product') && is_product() ? 'yes' : 'no');

        if ($priority === 101) {
            $rosa_template = defined('ROSA_MEDICAL_CORE_FILE')
                ? dirname(ROSA_MEDICAL_CORE_FILE) . '/templates/product-detail-prototype.php'
                : '';
            rosa_debug_header_value('P101-RosaReadable', $rosa_template !== '' && is_readable($rosa_template) ? 'yes' : 'no');
            rosa_debug_header_value('P101-RosaConstant', defined('ROSA_MEDICAL_CORE_FILE') ? ROSA_MEDICAL_CORE_FILE : 'missing');

            if (class_exists('RosaMedical\\Core\\Plugin')) {
                $direct = RosaMedical\Core\Plugin::productTemplate($template);
                rosa_debug_header_value('P101-DirectResult', basename($direct));
            } else {
                rosa_debug_header_value('P101-DirectResult', 'class-missing');
            }
        }

        return $template;
    }, $priority);
}
PHP

product_id="$(wp post list --post_type=product --name='rosa-foundation-stevens-scissors-regular' --post_status=publish --field=ID --format=ids | awk '{print $1}')"
[[ -n "$product_id" ]] || {
  printf 'Template diagnostics failed: fixture product is missing.\n' >&2
  exit 1
}
url="$(wp post url "$product_id")"
headers="$(mktemp)"
body="$(mktemp)"
trap 'rm -f "$headers" "$body"; cleanup' EXIT

curl -fsS -D "$headers" -o "$body" "${url}?rosa_template_debug=1&_=$(date +%s)"

printf '=== ROSA REQUEST DEBUG HEADERS ===\n'
grep -i '^X-Rosa-Debug-' "$headers" || true
printf '\n=== RESPONSE MARKERS ===\n'
grep -E 'rosa-product-detail|04-0901|04-0911|woocommerce-breadcrumb|product-template-default|<title' "$body" | head -n 40 || true
