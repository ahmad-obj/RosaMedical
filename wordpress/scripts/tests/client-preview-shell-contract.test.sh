#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
THEME="$ROOT/wordpress/wp-content/themes/rosa-medical-child"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
grep -Fq 'data-rosa-preview-shell' "$THEME/header.php" || fail 'preview shell marker missing'
grep -Fq 'rosa-preview-announcement' "$THEME/header.php" || fail 'announcement/contact strip missing'
grep -Fq 'rosa_preview_media_id' "$THEME/header.php" || fail 'Rosa Media Library logo missing'
grep -Fq 'rosa_preview_nav_items' "$THEME/header.php" || fail 'localized preview nav missing'
grep -Fq 'rosa_preview_pair_url' "$THEME/header.php" || fail 'language switch target missing'
grep -Fq 'Inquiry' "$THEME/header.php" || fail 'retail action role not replaced by inquiry role'
grep -Fq 'data-rosa-preview-menu-trigger' "$THEME/header.php" || fail 'mobile menu trigger missing'
grep -Fq 'rosa-preview-footer' "$THEME/footer.php" || fail 'preview footer missing'
grep -Fq 'rosa_theme_business_value' "$THEME/footer.php" || fail 'centralized business values missing'
grep -Fq 'client-preview.css' "$THEME/functions.php" || fail 'preview stylesheet not enqueued'
grep -Fq 'client-preview.js' "$THEME/functions.php" || fail 'preview JS not enqueued'
! grep -Eqi 'cart|checkout|payment|shipping|returns' "$THEME/header.php" || fail 'retail semantics leaked into header'
printf 'PASS: client preview shell contract\n'
