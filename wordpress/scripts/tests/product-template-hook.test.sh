#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PLUGIN="$ROOT_DIR/wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

grep -Fq "add_filter('template_include', [self::class, 'productTemplate'], 100);" "$PLUGIN" \
  || fail 'Rosa product template filter must run at priority 100 after Elementor/WooCommerce template_include callbacks'

grep -Fq "if (! function_exists('is_product') || ! is_product())" "$PLUGIN" \
  || fail 'Rosa product template override must remain scoped to product requests only'

printf 'PASS: Rosa product template hook priority contract\n'
