#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
REFERENCE_MEDIA_ROOT="${ROSA_PREVIEW_MEDIA_ROOT:-/rosa-reference-media}"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'Client preview seed failed: %s\n' "$1" >&2; exit 1; }

if [[ -n "${ROSA_PREVIEW_PHONE:-}" || -n "${ROSA_PREVIEW_EMAIL:-}" || -n "${ROSA_PREVIEW_ADDRESS:-}" ]]; then
  phone_b64="$(printf '%s' "${ROSA_PREVIEW_PHONE:-}" | base64 | tr -d '\n')"
  email_b64="$(printf '%s' "${ROSA_PREVIEW_EMAIL:-}" | base64 | tr -d '\n')"
  address_b64="$(printf '%s' "${ROSA_PREVIEW_ADDRESS:-}" | base64 | tr -d '\n')"
  wp eval "
    \$settings = get_option('rosa_business_settings', []);
    if (! is_array(\$settings)) \$settings = [];
    \$input = [
      'phone' => base64_decode('${phone_b64}', true),
      'email' => base64_decode('${email_b64}', true),
      'address' => base64_decode('${address_b64}', true),
    ];
    foreach (\$input as \$key => \$value) {
      if (! is_string(\$value) || \$value === '') continue;
      \$settings[\$key] = \$key === 'email' ? sanitize_email(\$value) : sanitize_text_field(\$value);
    }
    update_option('rosa_business_settings', \$settings);
  "
fi
wp eval '
  $settings = get_option("rosa_business_settings", []);
  foreach (["phone", "email", "address"] as $key) {
    if (!is_array($settings) || trim((string)($settings[$key] ?? "")) === "") {
      WP_CLI::error("Missing verified Rosa business setting: {$key}");
    }
  }
'

import_media(){
  local key="$1"
  local rel="$2"
  local host_src="$ROOT_DIR/$rel"
  local relative_media container_src
  [[ -f "$host_src" ]] || fail "missing Rosa-owned media source: $rel"
  relative_media="${rel#apps/web/public/media/}"
  [[ "$relative_media" != "$rel" ]] || fail "media source is outside approved Rosa media root: $rel"
  container_src="$REFERENCE_MEDIA_ROOT/$relative_media"
  local existing
  existing="$(wp post list --post_type=attachment --meta_key=_rosa_preview_source_path --meta_value="$rel" --field=ID --format=ids | awk '{print $1}')"
  local id="$existing"
  if [[ -z "$id" ]]; then
    id="$(wp media import "$container_src" --porcelain)"
    [[ -n "$id" ]] || fail "WordPress did not import Rosa media source: $rel"
    wp post meta update "$id" _rosa_preview_source_path "$rel" >/dev/null
  fi
  printf '%s=%s\n' "$key" "$id"
}

media_lines="$(
  import_media logo 'apps/web/public/media/brand/rosa-header-logo-v1.webp'
  import_media hero 'apps/web/public/media/editorial/home-hero-surgical-instruments.jpg'
  import_media about_procurement 'apps/web/public/media/editorial/about-procurement.jpg'
  import_media about_hospitals 'apps/web/public/media/editorial/about-hospitals.jpg'
  import_media about_international 'apps/web/public/media/editorial/about-international-buyers.webp'
  import_media procurement_support 'apps/web/public/media/editorial/procurement-support.jpg'
)"
media_lines_b64="$(printf '%s' "$media_lines" | base64 | tr -d '\n')"
wp eval "
  \$decoded = base64_decode('${media_lines_b64}', true);
  if (! is_string(\$decoded)) WP_CLI::error('Could not decode Rosa preview media map.');
  \$map = [];
  foreach (preg_split('/\\R/', \$decoded) as \$line) {
    if (\$line === '' || strpos(\$line, '=') === false) continue;
    [\$key, \$value] = explode('=', \$line, 2);
    \$map[\$key] = (int) \$value;
  }
  if (! isset(\$map['logo'], \$map['hero'])) WP_CLI::error('Rosa preview media map is incomplete.');
  update_option('rosa_preview_media', \$map);
"

wp eval '
  function rosa_preview_seed_page(string $path, string $title, string $template, string $locale, int $parent = 0): int {
    $existing = get_page_by_path($path, OBJECT, "page");
    $id = $existing ? (int)$existing->ID : wp_insert_post([
      "post_type" => "page", "post_status" => "publish", "post_title" => $title,
      "post_name" => basename($path), "post_parent" => $parent, "post_content" => ""
    ]);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    wp_update_post(["ID" => $id, "post_status" => "publish", "post_title" => $title, "post_parent" => $parent]);
    update_post_meta($id, "_wp_page_template", $template);
    update_post_meta($id, "_rosa_preview_locale", $locale);
    return (int)$id;
  }
  $home = rosa_preview_seed_page("home", "Home", "page-templates/client-preview-home.php", "en");
  $about = rosa_preview_seed_page("about", "About us", "page-templates/client-preview-about.php", "en");
  $contact = rosa_preview_seed_page("contact", "Contact us", "page-templates/client-preview-contact.php", "en");
  $ar = rosa_preview_seed_page("ar", "الرئيسية", "page-templates/client-preview-home.php", "ar");
  $arAbout = rosa_preview_seed_page("ar/about", "من نحن", "page-templates/client-preview-about.php", "ar", $ar);
  $arContact = rosa_preview_seed_page("ar/contact", "اتصل بنا", "page-templates/client-preview-contact.php", "ar", $ar);
  $arShop = rosa_preview_seed_page("ar/shop", "المنتجات", "page-templates/client-preview-shop.php", "ar", $ar);
  foreach ([[$home,$ar],[$about,$arAbout],[$contact,$arContact]] as [$a,$b]) {
    update_post_meta($a, "_rosa_preview_pair_id", $b); update_post_meta($b, "_rosa_preview_pair_id", $a);
  }
  $shopId = (int)get_option("woocommerce_shop_page_id", 0);
  if ($shopId > 0) { update_post_meta($shopId, "_rosa_preview_locale", "en"); update_post_meta($shopId, "_rosa_preview_pair_id", $arShop); update_post_meta($arShop, "_rosa_preview_pair_id", $shopId); }
  update_option("show_on_front", "page"); update_option("page_on_front", $home);
  WP_CLI::success("Rosa client preview pages and media are seeded.");
'
