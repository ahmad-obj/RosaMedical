#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

fail() {
  printf 'Foundation verification failed: %s\n' "$1" >&2
  exit 1
}

bash "$SCRIPT_DIR/foundation-preflight.sh"

wp core is-installed >/dev/null || fail 'WordPress is not installed; run foundation-bootstrap.sh first'
wp plugin is-active elementor >/dev/null || fail 'Elementor Free is not active'
wp plugin is-active woocommerce >/dev/null || fail 'WooCommerce is not active'
wp plugin is-active rosa-medical-core >/dev/null || fail 'rosa-medical-core is not active'
[[ "$(wp theme list --status=active --field=name | head -n 1)" == 'rosa-medical-child' ]] || fail 'rosa-medical-child is not the active theme'

ensure_page() {
  local title="$1"
  local slug="$2"
  local body="$3"
  local id
  id="$(wp post list --post_type=page --name="$slug" --post_status=publish,draft --field=ID --format=ids | awk '{print $1}')"
  if [[ -z "$id" ]]; then
    id="$(wp post create --post_type=page --post_status=publish --post_title="$title" --post_name="$slug" --post_content="$body" --porcelain)"
  else
    wp post update "$id" --post_status=publish --post_title="$title" >/dev/null
  fi
  printf '%s' "$id"
}

home_id="$(ensure_page 'Home' 'foundation-home' 'Rosa Medical foundation Home page. Edit this representative content with Elementor Free.')"
about_id="$(ensure_page 'About' 'foundation-about' 'Rosa Medical foundation About page. Edit this representative content with Elementor Free.')"
contact_id="$(ensure_page 'Contact' 'foundation-contact' 'Rosa Medical foundation Contact page. Edit this representative content with Elementor Free.')"

wp option update show_on_front page >/dev/null
wp option update page_on_front "$home_id" >/dev/null

# Elementor Free must support ordinary pages. Preserve any existing supported post types
# while ensuring `page` is present in Elementor's elementor_cpt_support option.
wp eval '
$support = get_option("elementor_cpt_support", ["page", "post"]);
if (! is_array($support)) {
    $support = ["page", "post"];
}
if (! in_array("page", $support, true)) {
    $support[] = "page";
}
update_option("elementor_cpt_support", array_values(array_unique($support)));
' >/dev/null

page_support="$(wp eval '$v=get_option("elementor_cpt_support", []); echo in_array("page", (array) $v, true) ? "yes" : "no";')"
[[ "$page_support" == 'yes' ]] || fail 'Elementor page support was not enabled'

for page_id in "$home_id" "$about_id" "$contact_id"; do
  url="$(wp post url "$page_id")"
  html="$(curl -fsS "$url")" || fail "representative page did not resolve: $url"
  lower_html="$(printf '%s' "$html" | tr '[:upper:]' '[:lower:]')"
  [[ "$lower_html" != *'critical error'* ]] || fail "critical error rendered at $url"
  [[ "$lower_html" != *'fatal error'* ]] || fail "fatal error rendered at $url"
done

product_id="$(wp post list --post_type=product --name='rosa-foundation-stevens-scissors-regular' --post_status=publish --field=ID --format=ids | awk '{print $1}')"
[[ -n "$product_id" ]] || fail 'verified Stevens fixture is missing; run foundation-seed.sh first'
product_url="$(wp post url "$product_id")"
product_html="$(curl -fsS "$product_url")" || fail "shared product detail did not resolve: $product_url"
[[ "$product_html" == *'rosa-product-detail'* ]] || fail 'shared Rosa Product Detail marker is missing'
[[ "$product_html" == *'04-0901'* && "$product_html" == *'04-0911'* ]] || fail 'shared product detail lost verified variation SKUs'
lower_product_html="$(printf '%s' "$product_html" | tr '[:upper:]' '[:lower:]')"
[[ "$lower_product_html" != *'critical error'* ]] || fail 'critical error rendered on product detail'
[[ "$lower_product_html" != *'fatal error'* ]] || fail 'fatal error rendered on product detail'

# Prove one centralized setting reaches two independent surfaces.
original_business_settings="$(wp option get rosa_business_settings --format=json 2>/dev/null || printf '{}')"
verification_phone='+966 55 000 1122'
restore_business_settings() {
  wp option update rosa_business_settings "$original_business_settings" --format=json >/dev/null 2>&1 || true
}
trap restore_business_settings EXIT
wp option update rosa_business_settings "{\"phone\":\"$verification_phone\"}" --format=json >/dev/null
home_html="$(curl -fsS "$(wp option get home)")" || fail 'home page failed while verifying centralized business settings'
phone_occurrences="$(( ( ${#home_html} - ${#home_html//$verification_phone/} ) / ${#verification_phone} ))"
restore_business_settings
trap - EXIT
[[ "$phone_occurrences" -ge 2 ]] || fail 'centralized phone setting did not render in two independent shell surfaces'

original_locale="$(wp option get WPLANG 2>/dev/null || true)"
restore_locale() {
  if [[ -n "$original_locale" ]]; then
    wp site switch-language "$original_locale" >/dev/null 2>&1 || wp option update WPLANG "$original_locale" >/dev/null 2>&1 || true
  else
    wp option update WPLANG '' >/dev/null 2>&1 || true
  fi
}
trap restore_locale EXIT

wp language core install ar >/dev/null
wp site switch-language ar >/dev/null
rtl_state="$(wp eval 'echo is_rtl() ? "yes" : "no";')"
[[ "$rtl_state" == 'yes' ]] || fail 'WordPress did not report RTL after switching to Arabic'
rtl_html="$(curl -fsS "$product_url")" || fail 'product detail failed under Arabic locale'
[[ "$rtl_html" == *'dir="rtl"'* ]] || fail 'Arabic product HTML is missing dir="rtl"'
rtl_lower="$(printf '%s' "$rtl_html" | tr '[:upper:]' '[:lower:]')"
[[ "$rtl_lower" != *'critical error'* ]] || fail 'critical error rendered under RTL locale'
[[ "$rtl_lower" != *'fatal error'* ]] || fail 'fatal error rendered under RTL locale'
restore_locale
trap - EXIT

printf '\nAutomated foundation checks passed.\n'
printf 'Representative pages:\n'
printf '  Home:    %s/wp-admin/post.php?post=%s&action=elementor\n' "$(wp option get siteurl)" "$home_id"
printf '  About:   %s/wp-admin/post.php?post=%s&action=elementor\n' "$(wp option get siteurl)" "$about_id"
printf '  Contact: %s/wp-admin/post.php?post=%s&action=elementor\n' "$(wp option get siteurl)" "$contact_id"
printf '\nManual acceptance still required before this gate can pass:\n'
printf '  1. For Home, About and Contact: open Elementor -> edit/add a small section -> Save/Update -> leave -> reopen -> edit again -> Save/Update.\n'
printf '  2. Inspect representative public pages at ~390, 768, 1024, 1440 and 1920 px; no structural overflow/breakage.\n'
printf '  3. Check browser console on representative Home and Product Detail pages; no console-breaking JavaScript errors.\n'
printf '\n'

if [[ "${ROSA_ELEMENTOR_MANUAL_EDIT_CONFIRMED:-}" != 'yes' ]]; then
  printf 'MANUAL_PENDING: set ROSA_ELEMENTOR_MANUAL_EDIT_CONFIRMED=yes only after the Elementor create/save/reopen/edit/save cycle passes on all three pages.\n' >&2
  exit 3
fi

if [[ "${ROSA_RESPONSIVE_MANUAL_CONFIRMED:-}" != 'yes' ]]; then
  printf 'MANUAL_PENDING: set ROSA_RESPONSIVE_MANUAL_CONFIRMED=yes only after the listed representative widths pass.\n' >&2
  exit 3
fi

if [[ "${ROSA_BROWSER_CONSOLE_CONFIRMED:-}" != 'yes' ]]; then
  printf 'MANUAL_PENDING: set ROSA_BROWSER_CONSOLE_CONFIRMED=yes only after representative browser-console checks pass.\n' >&2
  exit 3
fi

printf 'PASS: automated foundation runtime + Elementor editability + responsive shell + browser-console acceptance confirmed\n'
