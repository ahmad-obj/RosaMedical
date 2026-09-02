#!/usr/bin/env bash
set -euo pipefail
CONTACT=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php
PARTS=wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$CONTACT" ]] || fail 'preview contact template missing'
for part in page-hero contact-layout contact-map; do
  [[ -f "$PARTS/$part.php" ]] || fail "missing Contact composition part: $part"
done
scope=(
  "$CONTACT"
  "$PARTS/page-hero.php"
  "$PARTS/contact-layout.php"
  "$PARTS/contact-map.php"
)
for marker in 'data-preview-page-hero' 'data-preview-contact-layout' 'data-preview-contact-location' 'data-preview-contact-phone' 'data-preview-contact-email' 'data-preview-contact-form' 'data-preview-map-role'; do
  grep -Fq "$marker" "${scope[@]}" || fail "missing contact role: $marker"
done
grep -Fq "rosa_theme_business_value('address')" "${scope[@]}" || fail 'map address not centralized'
grep -Fq "rosa_theme_business_value('phone')" "${scope[@]}" || fail 'phone not centralized'
grep -Fq "rosa_theme_business_value('email')" "${scope[@]}" || fail 'email not centralized'
grep -Fq "rosa_preview_business_value('address'" "${scope[@]}" || fail 'localized address helper missing'
grep -Fq 'dir="ltr"' "${scope[@]}" || fail 'technical contact values lack LTR isolation'
! grep -Eqi 'Jln Cempaka|yourdomain|6221\.2002' "${scope[@]}" || fail 'demo contact value leaked'
printf 'PASS: client preview Contact contract\n'
