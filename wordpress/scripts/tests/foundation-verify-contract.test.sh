#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
VERIFY="$ROOT_DIR/wordpress/scripts/foundation-verify.sh"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$VERIFY" ]] || fail 'foundation-verify.sh missing'

for token in 'Home' 'About' 'Contact' 'elementor_cpt_support' 'language core install ar' 'site switch-language ar' 'is_rtl()' 'ROSA_ELEMENTOR_MANUAL_EDIT_CONFIRMED'; do
  grep -Fq "$token" "$VERIFY" || fail "foundation verification missing contract token: $token"
done

grep -Fq 'trap restore_locale EXIT' "$VERIFY" || fail 'foundation verification must restore locale on exit'
grep -Fq 'dir="rtl"' "$VERIFY" || fail 'foundation verification must assert RTL html direction'
grep -Fq 'critical error' "$VERIFY" || fail 'foundation verification must reject critical-error HTML'
grep -Fq 'fatal error' "$VERIFY" || fail 'foundation verification must reject fatal-error HTML'
! grep -Eqi 'hostinger|cloudflare|medicashop|elementor-pro|wpml' "$VERIFY" || fail 'foundation verification contains prohibited infrastructure/paid dependency reference'

printf 'PASS: foundation verification source contract\n'
