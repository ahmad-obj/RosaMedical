#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PLUGIN="$ROOT/wp-content/plugins/rosa-medical-core"
ADMIN="$PLUGIN/src/Admin/RosaAdmin.php"
SHORTCUT="$PLUGIN/src/Admin/ElementorShortcutPage.php"
MEDIA_FIELD="$PLUGIN/src/Admin/MediaField.php"
BOOTSTRAP="$PLUGIN/rosa-medical-core.php"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$ADMIN" ]] || fail 'RosaAdmin.php missing'
[[ -f "$PLUGIN/src/Admin/ContentPage.php" ]] || fail 'ContentPage.php missing for Shop/Site and rollback storage'
[[ -f "$SHORTCUT" ]] || fail 'ElementorShortcutPage.php missing'
[[ -f "$PLUGIN/assets/admin/rosa-content-admin.js" ]] || fail 'admin JS missing'
[[ -f "$PLUGIN/assets/admin/rosa-content-admin.css" ]] || fail 'admin CSS missing'
grep -Fq 'add_menu_page' "$ADMIN" || fail 'top-level menu missing'
for label in Homepage About Contact Shop 'Site & CTA' Business; do grep -Fq "$label" "$ADMIN" || fail "submenu missing: $label"; done
grep -Fq 'manage_options' "$ADMIN" || fail 'manage_options capability missing'
for mapping in "ElementorShortcutPage::render('home', 'Homepage')" "ElementorShortcutPage::render('about', 'About')" "ElementorShortcutPage::render('contact', 'Contact')"; do
  grep -Fq "$mapping" "$ADMIN" || fail "missing Elementor shortcut mapping: $mapping"
done
! grep -Fq "ContentPage::render('home')" "$ADMIN" || fail 'Homepage must not retain competing Rosa content form'
! grep -Fq "ContentPage::render('about')" "$ADMIN" || fail 'About must not retain competing Rosa content form'
! grep -Fq "ContentPage::render('contact')" "$ADMIN" || fail 'Contact must not retain competing Rosa content form'
grep -Fq "ContentPage::render('shop')" "$ADMIN" || fail 'Shop content form must remain'
grep -Fq "ContentPage::render('site')" "$ADMIN" || fail 'Site & CTA content form must remain'
grep -Fq 'ContentSettings.php' "$BOOTSTRAP" || fail 'structured page settings must remain loaded for migration/rollback'
grep -Fq 'get_page_by_path' "$SHORTCUT" || fail 'Elementor shortcut must resolve actual page IDs by path'
grep -Fq 'get_edit_url' "$SHORTCUT" || fail 'Elementor shortcut must derive Elementor editor URL from document'
grep -Fq 'get_edit_post_link' "$SHORTCUT" || fail 'Elementor-unavailable fallback Edit Page link missing'
grep -Fq 'wp_enqueue_media' "$ADMIN" || fail 'media library not enqueued for remaining Rosa media forms'
grep -Fq "'prefooter-person-01' => 'Shared pre-footer image'" "$MEDIA_FIELD" || fail 'shared pre-footer media control missing'
if grep -Fq "'about_international' =>" "$MEDIA_FIELD"; then
  fail 'About page must not expose legacy about_international as a dead media control'
fi
echo 'PASS: Rosa admin and Elementor shortcut contract'