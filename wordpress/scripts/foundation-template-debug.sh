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
debug_log='/tmp/rosa-template-debug.log'
cleanup() {
  "${compose[@]}" exec -T wordpress rm -f "$mu_plugin" "$debug_log" >/dev/null 2>&1 || true
}
trap cleanup EXIT

"${compose[@]}" exec -T wordpress rm -f "$debug_log" >/dev/null 2>&1 || true
"${compose[@]}" exec -T wordpress sh -lc 'mkdir -p /var/www/html/wp-content/mu-plugins && cat > /var/www/html/wp-content/mu-plugins/rosa-template-debug.php' <<'PHP'
<?php
/** Temporary Rosa template debugging. Removed automatically by the caller. */
if (! isset($_GET['rosa_template_debug'])) {
    return;
}

const ROSA_TEMPLATE_DEBUG_LOG = '/tmp/rosa-template-debug.log';

function rosa_debug_write(string $label, string $value): void
{
    file_put_contents(
        ROSA_TEMPLATE_DEBUG_LOG,
        $label . '=' . str_replace(["\r", "\n"], '', $value) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}

function rosa_debug_callback_name($callback): string
{
    if (is_array($callback) && count($callback) === 2) {
        $owner = is_object($callback[0]) ? get_class($callback[0]) : (string) $callback[0];
        return $owner . '::' . (string) $callback[1];
    }
    if ($callback instanceof Closure) {
        return 'Closure';
    }
    if (is_string($callback)) {
        return $callback;
    }
    if (is_object($callback) && method_exists($callback, '__invoke')) {
        return get_class($callback) . '::__invoke';
    }
    return gettype($callback);
}

add_filter('wp_using_themes', static function (bool $using): bool {
    rosa_debug_write('WPUsingThemes-Observed', $using ? 'yes' : 'no');
    return $using;
}, PHP_INT_MAX);

add_action('template_redirect', static function (): void {
    rosa_debug_write('Redirect-IsProduct', function_exists('is_product') && is_product() ? 'yes' : 'no');
    rosa_debug_write('Redirect-IsSingularProduct', is_singular('product') ? 'yes' : 'no');
    rosa_debug_write('Redirect-QueriedId', (string) get_queried_object_id());
    rosa_debug_write('Redirect-PostType', (string) get_post_type(get_queried_object_id()));
    rosa_debug_write('Redirect-RosaHook', (string) has_filter('template_include', ['RosaMedical\\Core\\Plugin', 'productTemplate']));
    rosa_debug_write('Redirect-WPUseThemes-Constant', defined('WP_USE_THEMES') && WP_USE_THEMES ? 'yes' : 'no');
    rosa_debug_write('Redirect-WPUsingThemes', wp_using_themes() ? 'yes' : 'no');

    global $wp_filter;
    foreach (['template_redirect', 'wp_using_themes', 'template_include'] as $hook_name) {
        $hook = $wp_filter[$hook_name] ?? null;
        if (! $hook instanceof WP_Hook) {
            continue;
        }
        foreach ($hook->callbacks as $priority => $callbacks) {
            foreach ($callbacks as $callback) {
                rosa_debug_write(
                    $hook_name . '-Callback-P' . (string) $priority,
                    rosa_debug_callback_name($callback['function'])
                );
            }
        }
    }
}, -10000);

foreach ([-9999, -2, -1, 0, 1, 5, 9, 10, 11, 20, 50, 99, 100, 101, 999, 1001] as $priority) {
    add_action('template_redirect', static function () use ($priority): void {
        rosa_debug_write('Redirect-Reached-P' . (string) $priority, 'yes');
        rosa_debug_write('Redirect-WPUsingThemes-P' . (string) $priority, wp_using_themes() ? 'yes' : 'no');
    }, $priority);
}

foreach ([12, 99, 101, 999] as $priority) {
    add_filter('template_include', static function (string $template) use ($priority): string {
        rosa_debug_write('Template-P' . $priority . '-Path', $template);
        rosa_debug_write('Template-P' . $priority . '-Basename', basename($template));
        rosa_debug_write('Template-P' . $priority . '-IsProduct', function_exists('is_product') && is_product() ? 'yes' : 'no');
        rosa_debug_write('Template-P' . $priority . '-Exists', is_file($template) ? 'yes' : 'no');
        rosa_debug_write('Template-P' . $priority . '-Readable', is_readable($template) ? 'yes' : 'no');

        if ($priority === 99 || $priority === 101) {
            $rosa_template = defined('ROSA_MEDICAL_CORE_FILE')
                ? dirname(ROSA_MEDICAL_CORE_FILE) . '/templates/product-detail-prototype.php'
                : '';
            rosa_debug_write('Template-P' . $priority . '-RosaReadable', $rosa_template !== '' && is_readable($rosa_template) ? 'yes' : 'no');
            rosa_debug_write('Template-P' . $priority . '-RosaPath', $rosa_template !== '' ? $rosa_template : 'missing');

            if (class_exists('RosaMedical\\Core\\Plugin')) {
                $direct = RosaMedical\Core\Plugin::productTemplate($template);
                rosa_debug_write('Template-P' . $priority . '-DirectResult', $direct);
                rosa_debug_write('Template-P' . $priority . '-DirectBasename', basename($direct));
            } else {
                rosa_debug_write('Template-P' . $priority . '-DirectResult', 'class-missing');
            }
        }

        return $template;
    }, $priority);
}

add_action('wp_before_include_template', static function (string $template): void {
    rosa_debug_write('BeforeInclude-Template', $template);
}, 10, 1);

register_shutdown_function(static function (): void {
    rosa_debug_write('Shutdown-WPUsingThemes', wp_using_themes() ? 'yes' : 'no');
    rosa_debug_write('Shutdown-DidTemplateInclude', (string) did_filter('template_include'));
    rosa_debug_write('Shutdown-DidBeforeInclude', (string) did_action('wp_before_include_template'));
    rosa_debug_write(
        'Shutdown-RosaHook',
        (string) has_filter('template_include', ['RosaMedical\\Core\\Plugin', 'productTemplate'])
    );
});
PHP

product_id="$(wp post list --post_type=product --name='rosa-foundation-stevens-scissors-regular' --post_status=publish --field=ID --format=ids | awk '{print $1}')"
[[ -n "$product_id" ]] || {
  printf 'Template diagnostics failed: fixture product is missing.\n' >&2
  exit 1
}
url="$(wp post url "$product_id")"
body="$(mktemp)"
trap 'rm -f "$body"; cleanup' EXIT

curl -fsS -o "$body" "${url}?rosa_template_debug=1&_=$(date +%s)"

printf '=== ROSA REQUEST PIPELINE LOG ===\n'
"${compose[@]}" exec -T wordpress sh -lc "cat '$debug_log' 2>/dev/null || true"
printf '\n=== RESPONSE MARKERS ===\n'
grep -E 'rosa-product-detail|04-0901|04-0911|woocommerce-breadcrumb|product-template-default|<title' "$body" | head -n 40 || true
