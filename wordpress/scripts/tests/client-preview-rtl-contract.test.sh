#!/usr/bin/env bash
set -euo pipefail
THEME=wordpress/wp-content/themes/rosa-medical-child
RTL="$THEME/assets/css/client-preview-rtl.css"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$RTL" ]] || fail 'Arabic preview stylesheet missing'
grep -Fq 'dir="rtl"' "$THEME/header.php" || fail 'RTL html-direction hook missing'
grep -Fq 'lang="ar"' "$THEME/header.php" || fail 'Arabic lang output missing'
grep -Fq 'margin-inline' "$THEME/assets/css/client-preview.css" || fail 'logical margin usage missing'
grep -Fq 'padding-inline' "$THEME/assets/css/client-preview.css" || fail 'logical padding usage missing'
grep -Fq 'inset-inline' "$THEME/assets/css/client-preview.css" || fail 'logical inset usage missing'
grep -Fq 'font-family' "$RTL" || fail 'Arabic typography missing'
grep -Fq 'rosa_preview_pair_url' "$THEME/header.php" || fail 'paired language switch missing'
grep -Fq "\$shopPath = \$locale === 'ar' ? '/ar/shop/' : '/shop/';" "$THEME/footer.php" || fail 'Arabic footer product links must target the paired Arabic Shop'
grep -Fq 'home_url($shopPath)' "$THEME/footer.php" || fail 'footer family links do not use localized Shop path'
printf 'PASS: client preview RTL source contract\n'
