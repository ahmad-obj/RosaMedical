#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PLUGIN="$ROOT/wp-content/plugins/rosa-medical-core"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$PLUGIN/src/Admin/RosaAdmin.php" ]] || fail 'RosaAdmin.php missing'
[[ -f "$PLUGIN/src/Admin/ContentPage.php" ]] || fail 'ContentPage.php missing'
[[ -f "$PLUGIN/assets/admin/rosa-content-admin.js" ]] || fail 'admin JS missing'
[[ -f "$PLUGIN/assets/admin/rosa-content-admin.css" ]] || fail 'admin CSS missing'
grep -Fq 'add_menu_page' "$PLUGIN/src/Admin/RosaAdmin.php" || fail 'top-level menu missing'
for label in Homepage About Contact Shop 'Site & CTA' Business; do grep -Fq "$label" "$PLUGIN/src/Admin/RosaAdmin.php" || fail "submenu missing: $label"; done
grep -Fq 'manage_options' "$PLUGIN/src/Admin/RosaAdmin.php" || fail 'manage_options capability missing'
grep -Fq 'settings_fields' "$PLUGIN/src/Admin/ContentPage.php" || fail 'Settings API form missing'
grep -Fq 'wp_enqueue_media' "$PLUGIN/src/Admin/RosaAdmin.php" || fail 'media library not enqueued'
grep -Fq 'data-lang-panel=' "$PLUGIN/src/Admin/ContentPage.php" || fail 'language panels missing'
grep -Fq "'ar' => 'العربية'" "$PLUGIN/src/Admin/ContentPage.php" || fail 'Arabic panel missing'
echo 'PASS: Rosa admin contract'
