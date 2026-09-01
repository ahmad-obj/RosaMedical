#!/usr/bin/env bash
set -euo pipefail
HOME=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$HOME" ]] || fail 'preview home template missing'
for marker in hero who featured feature latest promos why proof evidence; do grep -Fq "data-home-section=\"$marker\"" "$HOME" || fail "missing measured homepage role: $marker"; done
for slot in home-hero-01 home-who-01 home-feature-01 home-promo-01 home-promo-02 home-promo-03 home-promo-04 home-why-01 home-evidence-01; do rg -Fq "'$slot'" wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview || fail "missing neutral media slot: $slot"; done
! grep -Eqi 'add to cart|30 days warranty|secure payment|international shipment|testimonial by|newsletter' "$HOME" || fail 'demo retail/fabricated copy leaked into homepage'
grep -Fq '.rosa-preview-products' "$CSS" || fail 'homepage product-grid CSS missing'
printf 'PASS: client preview homepage contract\n'
