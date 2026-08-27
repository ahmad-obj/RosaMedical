#!/usr/bin/env bash
set -euo pipefail

WORDPRESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
THEME="$WORDPRESS_DIR/wp-content/themes/rosa-medical-child"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$THEME/style.css" ]] || fail 'style.css missing'
grep -q 'Template: hello-elementor' "$THEME/style.css" || fail 'Hello Elementor parent declaration missing'
grep -q -- '--rosa-red:' "$THEME/assets/css/tokens.css" || fail 'Rosa red token missing'
grep -q 'language_attributes' "$THEME/header.php" || fail 'WordPress language/dir attributes missing'
grep -q 'margin-inline\|padding-inline\|inset-inline' "$THEME/assets/css/base.css" || fail 'logical RTL-safe spacing missing'

printf 'PASS: Rosa child-theme contract\n'
