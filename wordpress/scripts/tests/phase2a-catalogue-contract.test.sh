#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
ARCHIVE="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php"
CARD="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php"
CSS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
grep -Fq 'rosa-products-search' "$ARCHIVE" || fail 'archive search missing'
grep -Fq "has_action('rosa_medical_archive_filters')" "$ARCHIVE" || fail 'filter provider guard missing'
grep -Fq "do_action('rosa_medical_archive_filters')" "$ARCHIVE" || fail 'filter hook missing'
grep -Fq 'rosa-products-grid' "$ARCHIVE" || fail 'grid missing'
grep -Fq "do_action('rosa_medical_archive_reveal')" "$ARCHIVE" || fail 'reveal hook missing'
grep -Fq 'ProductPresentation::forProduct' "$CARD" || fail 'card presenter missing'
grep -Fq 'object-fit: contain' "$CSS" || fail 'contained media missing'
grep -Fq 'minmax(12rem, 1fr)' "$CSS" || fail 'desktop card minimum missing'
! grep -Eqi 'add to cart|rating|stars|sale badge|shipping|checkout' "$CARD" || fail 'retail card leakage'
printf 'PASS: Phase 2A catalogue source contract\n'
