#!/usr/bin/env bash
set -euo pipefail
CONTACT=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$CONTACT" ]] || fail 'preview contact template missing'
for marker in 'data-preview-page-hero' 'data-preview-contact-layout' 'data-preview-contact-location' 'data-preview-contact-phone' 'data-preview-contact-email' 'data-preview-contact-form' 'data-preview-map-role'; do grep -Fq "$marker" "$CONTACT" || fail "missing contact role: $marker"; done
grep -Fq "rosa_theme_business_value('address')" "$CONTACT" || fail 'map address not centralized'
grep -Fq "rosa_theme_business_value('phone')" "$CONTACT" || fail 'phone not centralized'
grep -Fq "rosa_theme_business_value('email')" "$CONTACT" || fail 'email not centralized'
grep -Fq "rosa_preview_business_value('address'" "$CONTACT" || fail 'localized address helper missing'
grep -Fq 'dir="ltr"' "$CONTACT" || fail 'technical contact values lack LTR isolation'
! grep -Eqi 'Jln Cempaka|yourdomain|6221\.2002' "$CONTACT" || fail 'demo contact value leaked'
printf 'PASS: client preview Contact contract\n'
