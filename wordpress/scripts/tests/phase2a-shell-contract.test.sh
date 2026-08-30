#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
THEME="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child"
NAV="$THEME/inc/navigation.php"
HEADER="$THEME/header.php"
FOOTER="$THEME/footer.php"
SHELL="$THEME/assets/css/shell.css"
JS="$THEME/assets/js/site-shell.js"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
for label in "Home" "About Us" "Products" "Inquiry" "Contact Us"; do grep -Fq "'$label'" "$NAV" || fail "missing nav label $label"; done
grep -Fq 'href="#main"' "$HEADER" || fail 'skip link missing'
grep -Fq 'data-rosa-menu-trigger' "$HEADER" || fail 'drawer trigger missing'
grep -Fq 'data-rosa-menu-drawer' "$HEADER" || fail 'drawer missing'
grep -Fq 'data-rosa-menu-overlay' "$HEADER" || fail 'drawer overlay missing'
grep -Fq '<main id="main"' "$HEADER" || fail 'main ownership missing'
! grep -Fq 'wp_nav_menu' "$HEADER" || fail 'header must use protected navigation model'
grep -Fq "rosa_theme_business_value('phone'" "$FOOTER" || fail 'footer phone not centralized'
grep -Fq "rosa_theme_business_value('email'" "$FOOTER" || fail 'footer email not centralized'
grep -Fq "rosa_theme_business_value('address'" "$FOOTER" || fail 'footer address not centralized'
grep -Fq 'inert' "$JS" || fail 'drawer must make background inert'
grep -Fq 'aria-expanded' "$JS" || fail 'drawer aria state missing'
grep -Fq 'inset-inline-end' "$SHELL" || fail 'drawer must use logical positioning'
printf 'PASS: Phase 2A shell contract\n'
