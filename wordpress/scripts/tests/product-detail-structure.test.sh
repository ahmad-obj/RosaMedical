#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HEADER="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/header.php"
PRODUCT="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php"
FALLBACK="$ROOT_DIR/wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq '<main id="main" class="rosa-site-main">' "$HEADER" || fail 'child theme must own the single page main landmark'
! grep -Eq '<main([[:space:]>])' "$PRODUCT" || fail 'production product detail must not nest main'
! grep -Eq '<main([[:space:]>])' "$FALLBACK" || fail 'plugin fallback must not nest main'
grep -Fq 'data-rosa-product-detail' "$PRODUCT" || fail 'production product detail marker missing'

printf 'PASS: product detail landmark structure contract\n'
