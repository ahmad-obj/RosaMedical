#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SCRIPT="$ROOT/wordpress/scripts/client-handoff-standalone-capture.sh"
fail(){ printf 'FAIL: Phase 3 standalone capture contract: %s\n' "$1" >&2; exit 1; }

[[ -f "$SCRIPT" ]] || fail 'capture script is missing'

for token in \
  'en-home|' 'en-about|' 'en-contact|' 'en-shop|' 'en-product|' \
  'ar-home|' 'ar-about|' 'ar-contact|' 'ar-shop|' 'ar-product|'; do
  grep -Fq "$token" "$SCRIPT" || fail "missing route token $token"
done

for viewport in '1440,900' '1024,768' '768,1024' '431,932' '390,844'; do
  grep -Fq "\"$viewport\"" "$SCRIPT" || fail "missing handoff viewport $viewport"
done

grep -Fq '/product/rosa-foundation-stevens-scissors-regular/' "$SCRIPT" \
  || fail 'English Product Detail route is missing'
grep -Fq '/ar/product/rosa-foundation-stevens-scissors-regular/' "$SCRIPT" \
  || fail 'Arabic Product Detail route is missing'
grep -Fq 'expected=50' "$SCRIPT" || fail 'capture script must enforce exactly 50 screenshots'
grep -Fq 'manifest.tsv' "$SCRIPT" || fail 'capture script must emit a review manifest'

if grep -Eqi 'pixel.?diff|overlay|compare.?image|reference.?image' "$SCRIPT"; then
  fail 'standalone capture script must not implement overlay/pixel-diff acceptance'
fi

printf 'PASS: Phase 3 standalone capture contract covers 10 bilingual routes x 5 handoff viewports\n'
