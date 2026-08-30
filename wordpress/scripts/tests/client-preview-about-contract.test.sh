#!/usr/bin/env bash
set -euo pipefail
ABOUT=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$ABOUT" ]] || fail 'preview about template missing'
for marker in 'data-preview-page-hero' 'data-preview-who-we-are' 'data-preview-stats' 'data-preview-about-cards' 'data-preview-feature-banner' 'data-preview-why-us' 'data-preview-proof-role' 'data-preview-family-strip' 'data-preview-contact-cta'; do grep -Fq "$marker" "$ABOUT" || fail "missing about role: $marker"; done
! grep -Eqi 'opening hours|happy customer|product sold|years experience|testimonial|drug store|pharmacy store' "$ABOUT" || fail 'unsupported demo claims leaked into About'
printf 'PASS: client preview About contract\n'
