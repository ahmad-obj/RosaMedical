#!/usr/bin/env bash
set -euo pipefail
ARCHIVE=wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
ARSHOP=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php
CARD=wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$ARCHIVE" ]] || fail 'English Shop archive override missing'
[[ -f "$ARSHOP" ]] || fail 'Arabic Shop paired page missing'
grep -Fq 'data-preview-shop-hero' "$ARCHIVE" || fail 'Shop hero missing'
grep -Fq 'data-preview-shop-grid' "$ARCHIVE" || fail 'Shop grid missing'
grep -Fq 'data-preview-shop-grid' "$ARSHOP" || fail 'Arabic Shop grid missing'
grep -Fq 'rosa-preview-shop-search' "$ARSHOP" || fail 'Arabic Shop search role missing'
grep -Fq "rosa_preview_family_label" "$CARD" || fail 'product family labels are not localized'
grep -Fq 'rosa_preview_price_label' "$CARD" || fail 'truthful price-on-request label missing'
grep -Fq "rosa_preview_content('site', 'view_details'" "$CARD" || fail 'settings-backed localized detail action missing'
! grep -Eqi 'add to cart|rating|wishlist|shipping|checkout|sale!' "$CARD" || fail 'consumer-retail Shop leakage'
grep -Fq 'object-fit: contain' "$CSS" || fail 'contained product imagery missing'
grep -Fq 'min-block-size: 44px' "$CSS" || fail 'minimum interactive target safeguard missing'
printf 'PASS: client preview Shop contract\n'
