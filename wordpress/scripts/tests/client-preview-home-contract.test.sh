#!/usr/bin/env bash
set -euo pipefail
HOME=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$HOME" ]] || fail 'preview home template missing'
for marker in 'data-preview-hero' 'data-preview-who-we-are' 'data-preview-stats' 'data-preview-featured-products' 'data-preview-value-strip' 'data-preview-feature-banner' 'data-preview-latest-products' 'data-preview-promos' 'data-preview-why-us' 'data-preview-proof-role' 'data-preview-contact-cta'; do grep -Fq "$marker" "$HOME" || fail "missing homepage role: $marker"; done
grep -Fq 'home-hero-surgical-instruments' wordpress/scripts/client-preview-seed.sh || fail 'hero source not seeded'
! grep -Eqi 'add to cart|30 days warranty|secure payment|international shipment|testimonial by|newsletter' "$HOME" || fail 'demo retail/fabricated copy leaked into homepage'
grep -Fq '.rosa-preview-products' "$CSS" || fail 'homepage product-grid CSS missing'
printf 'PASS: client preview homepage contract\n'
