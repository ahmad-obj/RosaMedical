#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PLUGIN="$ROOT_DIR/wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php"
DETAIL="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php"
CSS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css"
JS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
grep -Fq "add_filter('template_include', [self::class, 'productTemplate'], 100)" "$PLUGIN" || fail 'priority 100 missing'
grep -Fq 'template-parts/product-detail.php' "$PLUGIN" || fail 'theme detail route missing'
! grep -Eq '<main([[:space:]>])' "$DETAIL" || fail 'detail nests main'
grep -Fq 'data-rosa-product-detail' "$DETAIL" || fail 'detail marker missing'
grep -Fq 'data-rosa-configuration' "$DETAIL" || fail 'configuration marker missing'
grep -Fq 'data-rosa-selected-sku' "$DETAIL" || fail 'selected sku marker missing'
grep -Fq 'data-rosa-price-state' "$DETAIL" || fail 'price state marker missing'
grep -Fq 'data-rosa-inquiry-action' "$DETAIL" || fail 'inquiry marker missing'
grep -Fq 'object-fit: contain' "$CSS" || fail 'contained detail media missing'
grep -Fq '@media (max-height: 800px)' "$CSS" || fail 'short-height detail safeguard missing'
grep -Fq 'env(safe-area-inset-bottom)' "$CSS" || fail 'mobile safe area missing'
grep -Fq 'rosaAttributes' "$JS" || fail 'configuration JS attributes missing'
! grep -Eqi 'related products|add to cart|shipping|rating|wishlist|checkout' "$DETAIL" || fail 'retail detail leakage'
printf 'PASS: Phase 2A product detail contract\n'
