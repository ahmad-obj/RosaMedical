#!/usr/bin/env bash
set -euo pipefail
ROOT="${ROSA_TEST_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)}"
THEME="$ROOT/wordpress/wp-content/themes/rosa-medical-child"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

for file in \
  "$THEME/template-parts/client-preview/home-featured.php" \
  "$THEME/template-parts/client-preview/home-latest.php" \
  "$THEME/template-parts/client-preview/page-hero.php" \
  "$THEME/template-parts/client-preview/about-who.php" \
  "$THEME/template-parts/client-preview/about-stats.php" \
  "$THEME/template-parts/client-preview/about-cards.php" \
  "$THEME/template-parts/client-preview/about-feature.php" \
  "$THEME/template-parts/client-preview/about-why.php" \
  "$THEME/template-parts/client-preview/about-proof.php" \
  "$THEME/template-parts/client-preview/contact-layout.php" \
  "$THEME/template-parts/client-preview/contact-map.php"; do
  [[ -f "$file" ]] || fail "missing Elementor-ready Rosa section part: ${file#$ROOT/}"
done

grep -Fq 'rosa_preview_section_value' "$THEME/inc/client-preview.php" || fail 'argument-first section content helper missing'
grep -Fq 'rosa_preview_section_media_id' "$THEME/inc/client-preview.php" || fail 'argument-first section media helper missing'

grep -Fq "home-featured" "$THEME/page-templates/client-preview-home.php" || fail 'Home Featured section was not extracted'
grep -Fq "home-latest" "$THEME/page-templates/client-preview-home.php" || fail 'Home Latest section was not extracted'
for part in page-hero about-who about-stats about-cards about-feature about-why about-proof; do
  grep -Fq "$part" "$THEME/page-templates/client-preview-about.php" || fail "About template missing extracted part: $part"
done
for part in page-hero contact-layout contact-map; do
  grep -Fq "$part" "$THEME/page-templates/client-preview-contact.php" || fail "Contact template missing extracted part: $part"
done

for template in \
  "$THEME/page-templates/client-preview-home.php" \
  "$THEME/page-templates/client-preview-about.php" \
  "$THEME/page-templates/client-preview-contact.php"; do
  ! grep -Fq 'Elementor\\' "$template" || fail "legacy rollback template directly depends on Elementor: ${template#$ROOT/}"
done

printf 'PASS: Elementor authoring theme-section contract\n'
