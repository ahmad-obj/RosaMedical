#!/usr/bin/env bash
set -euo pipefail
ABOUT=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php
PARTS=wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$ABOUT" ]] || fail 'preview about template missing'
for part in page-hero about-who about-stats about-cards about-feature about-why about-proof; do
  [[ -f "$PARTS/$part.php" ]] || fail "missing About composition part: $part"
done
scope=(
  "$ABOUT"
  "$PARTS/page-hero.php"
  "$PARTS/about-who.php"
  "$PARTS/about-stats.php"
  "$PARTS/about-cards.php"
  "$PARTS/about-feature.php"
  "$PARTS/about-why.php"
  "$PARTS/about-proof.php"
)
for marker in 'data-preview-page-hero' 'data-preview-who-we-are' 'data-preview-stats' 'data-preview-about-cards' 'data-preview-feature-banner' 'data-preview-why-us' 'data-preview-proof-role' 'data-preview-family-strip' 'data-preview-contact-cta'; do
  grep -Fq "$marker" "${scope[@]}" || fail "missing about role: $marker"
done
! grep -Eqi 'opening hours|happy customer|product sold|years experience|testimonial|drug store|pharmacy store' "${scope[@]}" || fail 'unsupported demo claims leaked into About'
printf 'PASS: client preview About contract\n'
