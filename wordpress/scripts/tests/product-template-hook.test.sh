#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PLUGIN="$ROOT_DIR/wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php"

fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq "add_filter('template_include', [self::class, 'productTemplate'], 100);" "$PLUGIN" || fail 'priority 100 missing'
grep -Fq "if (! function_exists('is_product') || ! is_product())" "$PLUGIN" || fail 'product-only scope missing'
grep -Fq "template-parts/product-detail.php" "$PLUGIN" || fail 'theme product template preference missing'
grep -Fq "templates/product-detail-prototype.php" "$PLUGIN" || fail 'plugin fallback missing'

printf 'PASS: Rosa product template hook priority contract\n'
