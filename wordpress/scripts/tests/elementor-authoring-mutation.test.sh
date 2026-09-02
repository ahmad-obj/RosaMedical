#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
COMPOSE_FILE="$ROOT/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT/wordpress/dev/.env"
BASE_URL="${ROSA_BASE_URL:-http://localhost:8088}"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
admin_id="$(wp user list --role=administrator --field=ID | head -n1 | tr -d '\r')"
[[ "$admin_id" =~ ^[0-9]+$ ]] || fail 'No WordPress administrator available for Elementor mutation test'
wp_admin(){ wp --user="$admin_id" "$@"; }

ids="$(wp_admin eval '
$en = get_page_by_path("home", OBJECT, "page");
$ar = get_page_by_path("ar", OBJECT, "page");
if (! $en || ! $ar) WP_CLI::error("Home authoring pages are missing");
echo (int)$en->ID . "|" . (int)$ar->ID;
')"
IFS='|' read -r en_id ar_id <<<"$ids"
[[ "$en_id" =~ ^[0-9]+$ && "$ar_id" =~ ^[0-9]+$ ]] || fail 'Could not resolve Home page IDs'

wp_admin eval "
foreach ([${en_id}, ${ar_id}] as \$id) {
    \$document = \\Elementor\\Plugin::\$instance->documents->get(\$id, false);
    if (! \$document) WP_CLI::error('Missing Elementor document for post ' . \$id);
    update_option('rosa_elementor_mutation_backup_' . \$id, \$document->get_elements_data(), false);
}
"

restore(){
  wp_admin eval "
  foreach ([${en_id}, ${ar_id}] as \$id) {
      \$backup = get_option('rosa_elementor_mutation_backup_' . \$id, null);
      if (! is_array(\$backup)) continue;
      \$document = \\Elementor\\Plugin::\$instance->documents->get(\$id, false);
      if (\$document) \$document->save(['elements' => \$backup]);
      delete_option('rosa_elementor_mutation_backup_' . \$id);
  }
  " >/dev/null
  printf 'RESTORED: Elementor mutation fixtures\n'
}
trap restore EXIT

media_id="$(wp_admin eval "
function rosa_mutate_widget(array &\$elements, string \$widget, array \$changes): bool {
    foreach (\$elements as &\$element) {
        if (! is_array(\$element)) continue;
        if ((string)(\$element['widgetType'] ?? '') === \$widget) {
            if (! isset(\$element['settings']) || ! is_array(\$element['settings'])) \$element['settings'] = [];
            foreach (\$changes as \$key => \$value) \$element['settings'][\$key] = \$value;
            return true;
        }
        if (isset(\$element['elements']) && is_array(\$element['elements']) && rosa_mutate_widget(\$element['elements'], \$widget, \$changes)) return true;
    }
    return false;
}
\$enDoc = \\Elementor\\Plugin::\$instance->documents->get(${en_id}, false);
\$arDoc = \\Elementor\\Plugin::\$instance->documents->get(${ar_id}, false);
\$en = \$enDoc->get_elements_data();
\$ar = \$arDoc->get_elements_data();
\$currentMedia = 0;
foreach (\$en as \$root) {
    foreach ((array)(\$root['elements'] ?? []) as \$widget) {
        if ((string)(\$widget['widgetType'] ?? '') === 'rosa-home-hero') \$currentMedia = (int)(\$widget['settings']['image']['id'] ?? 0);
    }
}
\$attachments = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'numberposts' => 50, 'fields' => 'ids']);
\$media = 0;
foreach (\$attachments as \$candidate) { if ((int)\$candidate > 0 && (int)\$candidate !== \$currentMedia) { \$media = (int)\$candidate; break; } }
if (\$media <= 0) WP_CLI::error('Need a second Media Library attachment for media mutation test');
if (! rosa_mutate_widget(\$en, 'rosa-home-hero', ['hero_title' => 'TEST ELEMENTOR HERO', 'image' => ['id' => \$media]])) WP_CLI::error('English Home hero widget not found');
if (! rosa_mutate_widget(\$ar, 'rosa-home-hero', ['hero_title' => 'AR TEST ELEMENTOR HERO'])) WP_CLI::error('Arabic Home hero widget not found');
if (! \$enDoc->save(['elements' => \$en])) WP_CLI::error('Could not save English Elementor mutation');
if (! \$arDoc->save(['elements' => \$ar])) WP_CLI::error('Could not save Arabic Elementor mutation');
echo \$media;
")"
[[ "$media_id" =~ ^[0-9]+$ ]] || fail 'Media mutation did not return an attachment ID'

home_html="$(curl -fsSL "$BASE_URL/")"
ar_html="$(curl -fsSL "$BASE_URL/ar/")"
grep -Fq 'TEST ELEMENTOR HERO' <<<"$home_html" || fail 'English Elementor text edit did not render'
! grep -Fq 'AR TEST ELEMENTOR HERO' <<<"$home_html" || fail 'Arabic Elementor edit leaked into English Home'
grep -Fq 'AR TEST ELEMENTOR HERO' <<<"$ar_html" || fail 'Arabic Elementor text edit did not render'
grep -Fq 'lang="ar" dir="rtl"' <<<"$ar_html" || fail 'Arabic Home lost RTL document attributes'
grep -Fq "wp-image-${media_id}" <<<"$home_html" || fail 'Elementor media control edit did not render selected attachment'
for section in hero who featured feature latest promos why proof evidence; do
  grep -Fq "data-home-section=\"${section}\"" <<<"$home_html" || fail "Home section disappeared after Elementor edit: ${section}"
done

bash "$ROOT/wordpress/scripts/client-preview-seed.sh" >/dev/null
for id in "$en_id" "$ar_id"; do
  template="$(wp post meta get "$id" _wp_page_template)"
  [[ "$template" == 'page-templates/rosa-elementor-authoring.php' ]] || fail 'routine client-preview seed reverted an Elementor authoring page template'
done
seed_output="$(bash "$ROOT/wordpress/scripts/elementor-authoring-seed.sh")"
[[ "$(grep -c '| skipped$' <<<"$seed_output")" -eq 6 ]] || fail 'normal Elementor reseed must skip all previously migrated documents'

home_html="$(curl -fsSL "$BASE_URL/")"
ar_html="$(curl -fsSL "$BASE_URL/ar/")"
grep -Fq 'TEST ELEMENTOR HERO' <<<"$home_html" || fail 'routine seed erased English Elementor edit'
grep -Fq 'AR TEST ELEMENTOR HERO' <<<"$ar_html" || fail 'routine seed erased Arabic Elementor edit'
grep -Fq "wp-image-${media_id}" <<<"$home_html" || fail 'routine seed erased Elementor media edit'

restore
trap - EXIT
home_html="$(curl -fsSL "$BASE_URL/")"
! grep -Fq 'TEST ELEMENTOR HERO' <<<"$home_html" || fail 'English mutation fixture did not restore'
printf 'PASS: Elementor EN/AR/media edits persist and routine seeds cannot erase them\n'
