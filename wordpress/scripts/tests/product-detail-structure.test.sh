#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
HEADER="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/header.php"
PRODUCT="$ROOT_DIR/wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq '<main id="main" class="rosa-site-main">' "$HEADER" || fail 'child theme must own the single page main landmark'
! grep -Eq '<main([[:space:]>])' "$PRODUCT" || fail 'product detail template must not nest a second main landmark inside the child-theme main'
grep -Fq 'class="rosa-product-detail"' "$PRODUCT" || fail 'product detail wrapper marker missing'

printf 'PASS: product detail landmark structure contract\n'
