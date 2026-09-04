#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
THEME="$ROOT/wordpress/wp-content/themes/rosa-medical-child"
TEMPLATE="$THEME/page-templates/rosa-elementor-authoring.php"
CSS="$THEME/assets/css/elementor-authoring.css"
HOME_CSS="$THEME/assets/css/latest-rosa-home.css"
HOME_JS="$THEME/assets/js/latest-rosa-home.js"
SEED="$ROOT/wordpress/scripts/elementor-authoring-seed.sh"
COMPOSE_FILE="$ROOT/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT/wordpress/dev/.env"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$TEMPLATE" ]] || fail 'protected Rosa Elementor page template missing'
[[ -f "$CSS" ]] || fail 'Elementor authoring wrapper stylesheet missing'
[[ -f "$HOME_CSS" ]] || fail 'latest Rosa Home stylesheet missing'
[[ -f "$HOME_JS" ]] || fail 'latest Rosa Home interaction script missing'
[[ -f "$SEED" ]] || fail 'explicit Elementor authoring seed command missing'
grep -Fq 'get_header();' "$TEMPLATE" || fail 'Elementor authoring template must preserve Rosa header'
grep -Fq 'the_content();' "$TEMPLATE" || fail 'Elementor authoring template must render normal page content'
grep -Fq "get_template_part('template-parts/client-preview/cta-banner'" "$TEMPLATE" || fail 'Elementor authoring template must preserve shared CTA'
grep -Fq 'get_footer();' "$TEMPLATE" || fail 'Elementor authoring template must preserve Rosa footer'
! grep -Eqi 'elementor_canvas|elementor_header_footer' "$TEMPLATE" || fail 'Elementor Canvas/header-footer template mode must not replace Rosa shell'
grep -Fq '.rosa-elementor-authoring' "$CSS" || fail 'authoring wrapper CSS scope missing'
grep -Fq '.rosa-elementor-root' "$CSS" || fail 'root Elementor wrapper neutralization missing'
grep -Fq 'latest-rosa-home.css' "$THEME/functions.php" || fail 'latest Home stylesheet enqueue missing'
grep -Fq 'latest-rosa-home.js' "$THEME/functions.php" || fail 'latest Home interaction enqueue missing'
grep -Fq 'home|home|en' "$SEED" || fail 'English Home migration target missing'
grep -Fq 'about|about|en' "$SEED" || fail 'English About migration target missing'
grep -Fq 'contact|contact|en' "$SEED" || fail 'English Contact migration target missing'
grep -Fq 'ar|home|ar' "$SEED" || fail 'Arabic Home migration target missing'
grep -Fq 'ar/about|about|ar' "$SEED" || fail 'Arabic About migration target missing'
grep -Fq 'ar/contact|contact|ar' "$SEED" || fail 'Arabic Contact migration target missing'
! grep -Fq 'elementor-authoring-seed.sh' "$ROOT/wordpress/scripts/client-preview-seed.sh" || fail 'routine client preview seed must not invoke Elementor migration'

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }

wp eval '
$targets = [
  ["home", "home", "en"], ["about", "about", "en"], ["contact", "contact", "en"],
  ["ar", "home", "ar"], ["ar/about", "about", "ar"], ["ar/contact", "contact", "ar"],
];
foreach ($targets as [$path, $pageType, $locale]) {
    $page = get_page_by_path($path, OBJECT, "page");
    if (! $page) WP_CLI::error("Missing target page: {$path}");
    $id = (int) $page->ID;
    if ((string) get_post_meta($id, "_rosa_preview_locale", true) !== $locale) {
        WP_CLI::error("Locale mismatch for {$path}");
    }
    if ((string) get_post_meta($id, "_wp_page_template", true) !== "page-templates/rosa-elementor-authoring.php") {
        WP_CLI::error("Protected Elementor template missing for {$path}");
    }
    if ((string) get_post_meta($id, "_rosa_elementor_authoring_version", true) !== "2") {
        WP_CLI::error("Rosa Elementor migration version 2 missing for {$path}");
    }
    if ($pageType === "home" && (string) get_post_meta($id, "_rosa_elementor_home_parity_version", true) !== "1") {
        WP_CLI::error("Latest Rosa Home parity version 1 missing for {$path}");
    }
    if (! class_exists("\\Elementor\\Plugin")) WP_CLI::error("Elementor is inactive");
    $document = \Elementor\Plugin::$instance->documents->get($id, false);
    if (! $document || ! $document->is_built_with_elementor()) {
        WP_CLI::error("Page is not recognized as an Elementor document: {$path}");
    }
}
WP_CLI::success("Six Rosa Elementor authoring documents verified, including latest Home parity.");
'

printf 'PASS: Elementor authoring protected-shell, latest Home parity and runtime contract\n'
