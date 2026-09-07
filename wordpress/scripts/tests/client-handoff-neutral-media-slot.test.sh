#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
WHO="$ROOT/wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php"
COMPREHENSIVE="$ROOT/wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-comprehensive.php"
CONFIDENCE="$ROOT/wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-confidence.php"
MEDIA_SLOT="$ROOT/wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php"
fail(){ printf 'FAIL: client handoff neutral media slot: %s\n' "$1" >&2; exit 1; }
for file in "$WHO" "$COMPREHENSIVE" "$CONFIDENCE" "$MEDIA_SLOT"; do
  [[ -f "$file" ]] || fail "missing template: $file"
done

grep -Fq "template-parts/client-preview/media-slot" "$WHO" || fail 'About who section lacks neutral media fallback'
grep -Fq "template-parts/client-preview/media-slot" "$COMPREHENSIVE" || fail 'Home comprehensive specialty section lacks neutral media fallback'
grep -Fq "template-parts/client-preview/media-slot" "$CONFIDENCE" || fail 'Home confidence section lacks neutral media fallback'
grep -Fq "data-media-slot=" "$MEDIA_SLOT" || fail 'shared media slot does not expose stable slot marker'
grep -Fq "<span aria-hidden=\"true\">ROSA</span>" "$MEDIA_SLOT" || fail 'shared media slot lacks network-independent neutral fallback'

printf 'PASS: classified handoff media surfaces expose neutral Rosa fallbacks\n'
