#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
ARTIFACT_DIR="${ROSA_HOSTINGER_ARTIFACT_DIR:-$ROOT_DIR/wordpress/.hostinger-migration}"
REPORT="$ARTIFACT_DIR/preflight-report.txt"

mkdir -p "$ARTIFACT_DIR"
: > "$REPORT"
exec > >(tee "$REPORT") 2>&1

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp(){ "${compose[@]}" run --rm wpcli "$@"; }

blockers=0
warnings=0

pass(){ printf 'PASS: %s\n' "$1"; }
warn(){ printf 'WARN: %s\n' "$1"; warnings=$((warnings + 1)); }
block(){ printf 'BLOCKER: %s\n' "$1"; blockers=$((blockers + 1)); }

need_cmd(){
  if command -v "$1" >/dev/null 2>&1; then
    pass "command available: $1"
  else
    block "required command is missing: $1"
  fi
}

printf 'Rosa Medical Hostinger migration preflight\n'
printf 'repository=%s\n' "$ROOT_DIR"
printf 'artifact_dir=%s\n' "$ARTIFACT_DIR"

for cmd in docker curl python3 tar gzip sha256sum; do
  need_cmd "$cmd"
done

if (( blockers > 0 )); then
  printf '\nMIGRATION STATUS: NO-GO\n'
  printf 'blockers=%d warnings=%d\n' "$blockers" "$warnings"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  block 'docker compose is unavailable'
else
  pass 'docker compose is available'
fi

if ! bash "$SCRIPT_DIR/foundation-preflight.sh"; then
  block 'foundation preflight failed'
else
  pass 'foundation preflight passed'
fi

if ! "${compose[@]}" up -d db wordpress >/dev/null; then
  block 'could not start local database/WordPress services'
else
  pass 'local database/WordPress services are running'
fi

wp_ready=0
for _ in $(seq 1 45); do
  if wp core version >/dev/null 2>&1; then
    wp_ready=1
    break
  fi
  sleep 2
done
if (( wp_ready == 0 )); then
  block 'WordPress did not become ready'
fi

if (( blockers > 0 )); then
  printf '\nMIGRATION STATUS: NO-GO\n'
  printf 'blockers=%d warnings=%d\n' "$blockers" "$warnings"
  exit 1
fi

wordpress_version="$(wp core version 2>/dev/null || true)"
php_version="$("${compose[@]}" exec -T wordpress php -r 'echo PHP_VERSION;' 2>/dev/null || true)"
printf 'wordpress_version=%s\n' "$wordpress_version"
printf 'php_version=%s\n' "$php_version"
[[ -n "$wordpress_version" ]] && pass 'WordPress version resolved' || block 'WordPress version could not be resolved'
[[ -n "$php_version" ]] && pass 'PHP version resolved' || block 'PHP version could not be resolved'

if [[ -n "$php_version" ]]; then
  php_major="${php_version%%.*}"
  php_rest="${php_version#*.}"
  php_minor="${php_rest%%.*}"
  if [[ "$php_major" =~ ^[0-9]+$ && "$php_minor" =~ ^[0-9]+$ ]] && (( php_major > 8 || (php_major == 8 && php_minor >= 2) )); then
    pass "local PHP $php_version is within Hostinger's currently recommended PHP 8.2+ range"
  else
    warn "local PHP $php_version is below Hostinger's currently recommended PHP 8.2+ range; select a supported PHP version in hPanel and retest"
  fi
fi

if wp core is-installed >/dev/null 2>&1; then
  pass 'WordPress is installed'
else
  block 'WordPress is not installed'
fi

if wp theme is-active rosa-medical-child >/dev/null 2>&1; then
  pass 'rosa-medical-child theme is active'
else
  block 'rosa-medical-child theme is not active'
fi

if wp theme is-installed hello-elementor >/dev/null 2>&1; then
  pass 'hello-elementor parent theme is installed'
else
  block 'hello-elementor parent theme is missing'
fi

for plugin in elementor woocommerce rosa-medical-core; do
  if wp plugin is-active "$plugin" >/dev/null 2>&1; then
    version="$(wp plugin get "$plugin" --field=version 2>/dev/null || true)"
    pass "$plugin is active${version:+ (version $version)}"
  else
    block "$plugin plugin is not active"
  fi
done

if wp db check >/dev/null 2>&1; then
  pass 'wp db check passed'
else
  block 'wp db check failed'
fi

coming_soon="$(wp option get woocommerce_coming_soon 2>/dev/null || true)"
if [[ "${coming_soon,,}" == "yes" ]]; then
  block 'WooCommerce Coming Soon mode is enabled'
else
  pass 'WooCommerce Coming Soon mode is not enabled'
fi

home_url="$(wp option get home 2>/dev/null || true)"
site_url="$(wp option get siteurl 2>/dev/null || true)"
printf 'home_url=%s\n' "$home_url"
printf 'site_url=%s\n' "$site_url"
[[ "$home_url" =~ ^https?:// ]] && pass 'WordPress home URL is valid' || block 'WordPress home URL is missing/invalid'
[[ "$site_url" =~ ^https?:// ]] && pass 'WordPress site URL is valid' || block 'WordPress site URL is missing/invalid'

page_url(){
  local path="$1"
  wp eval "\$page=get_page_by_path('${path}', OBJECT, 'page'); if(!\$page){WP_CLI::error('Missing page: ${path}');} echo get_permalink((int)\$page->ID);" 2>/dev/null
}

shop_id="$(wp option get woocommerce_shop_page_id 2>/dev/null || true)"
product_id="$(wp post list --post_type=product --name='rosa-foundation-stevens-scissors-regular' --post_status=publish --field=ID --format=ids 2>/dev/null | awk '{print $1}')"

declare -a route_labels=()
declare -a route_urls=()
add_route(){ route_labels+=("$1"); route_urls+=("$2"); }

[[ -n "$home_url" ]] && add_route 'English Home' "$home_url"
for entry in \
  'English About|about' \
  'English Contact|contact' \
  'Arabic Home|ar' \
  'Arabic About|ar/about' \
  'Arabic Contact|ar/contact' \
  'Arabic Shop|ar/shop'; do
  label="${entry%%|*}"
  path="${entry#*|}"
  if url="$(page_url "$path")"; then
    add_route "$label" "$url"
  else
    block "required page is missing: $path"
  fi
done

if [[ "$shop_id" =~ ^[0-9]+$ && "$shop_id" -gt 0 ]]; then
  if shop_url="$(wp post url "$shop_id" 2>/dev/null)"; then
    add_route 'English Shop' "$shop_url"
  else
    block 'WooCommerce Shop URL could not be resolved'
  fi
else
  block 'WooCommerce Shop page ID is missing'
fi

if [[ -n "$product_id" ]]; then
  if product_url="$(wp post url "$product_id" 2>/dev/null)"; then
    add_route 'Stevens Product Detail' "$product_url"
  else
    block 'Stevens Product Detail URL could not be resolved'
  fi
else
  block 'canonical Stevens product is missing'
fi

for i in "${!route_urls[@]}"; do
  label="${route_labels[$i]}"
  url="${route_urls[$i]}"
  if html="$(curl -fsSL --connect-timeout 10 --max-time 45 "$url" 2>/dev/null)"; then
    pass "$label returns HTTP success"
    if grep -Eq '/rosa-reference-media|apps/web/public/media|file:///|/home/[^"[:space:]]*/Projects/RosaMedical' <<<"$html"; then
      block "$label renders a local-only filesystem/media reference"
    fi
    if [[ "$label" == Arabic* ]]; then
      [[ "$html" == *'lang="ar"'* && "$html" == *'dir="rtl"'* ]] \
        && pass "$label renders Arabic RTL metadata" \
        || block "$label is missing Arabic lang/dir metadata"
    fi
  else
    block "$label did not return HTTP success: $url"
  fi
done

attachment_audit="$(wp eval '
$ids = get_posts(["post_type"=>"attachment","post_status"=>"inherit","numberposts"=>-1,"fields"=>"ids"]);
$missing = [];
foreach ($ids as $id) {
    $file = get_attached_file($id);
    if (! is_string($file) || $file === "" || ! file_exists($file)) {
        $missing[] = $id . ":" . (is_string($file) ? $file : "");
    }
}
echo "total=" . count($ids) . "\n";
echo "missing=" . count($missing) . "\n";
foreach ($missing as $item) echo "missing_attachment=" . $item . "\n";
' 2>/dev/null || true)"
printf '%s\n' "$attachment_audit"
attachment_total="$(awk -F= '/^total=/{print $2; exit}' <<<"$attachment_audit")"
attachment_missing="$(awk -F= '/^missing=/{print $2; exit}' <<<"$attachment_audit")"
attachment_total="${attachment_total:-0}"
attachment_missing="${attachment_missing:-999999}"
if [[ "$attachment_missing" =~ ^[0-9]+$ ]] && (( attachment_missing == 0 )); then
  pass "all $attachment_total WordPress attachment files exist under wp-content/uploads or another WordPress-managed path"
else
  block "WordPress has missing attachment files (missing=$attachment_missing)"
fi

tmp_sql="$(mktemp)"
cleanup(){ rm -f "$tmp_sql"; }
trap cleanup EXIT

if wp db export - --quiet >"$tmp_sql" 2>/dev/null && [[ -s "$tmp_sql" ]]; then
  pass 'database can be exported for migration'
else
  block 'database export failed'
fi

count_literal(){
  local needle="$1"
  python3 - "$tmp_sql" "$needle" <<'PY'
from pathlib import Path
import sys
data = Path(sys.argv[1]).read_bytes()
print(data.count(sys.argv[2].encode()))
PY
}

if [[ -s "$tmp_sql" ]]; then
  localhost_count="$(count_literal 'localhost')"
  loopback_count="$(count_literal '127.0.0.1')"
  reference_mount_count="$(count_literal '/rosa-reference-media')"
  apps_media_count="$(count_literal 'apps/web/public/media')"
  repo_path_count="$(count_literal "$ROOT_DIR")"
  container_path_count="$(count_literal '/var/www/html')"
  tmp_path_count="$(count_literal '/tmp/')"

  printf 'db_localhost_occurrences=%s\n' "$localhost_count"
  printf 'db_127_0_0_1_occurrences=%s\n' "$loopback_count"
  printf 'db_reference_mount_occurrences=%s\n' "$reference_mount_count"
  printf 'db_apps_media_occurrences=%s\n' "$apps_media_count"
  printf 'db_repo_path_occurrences=%s\n' "$repo_path_count"
  printf 'db_container_path_occurrences=%s\n' "$container_path_count"
  printf 'db_tmp_path_occurrences=%s\n' "$tmp_path_count"

  (( localhost_count > 0 || loopback_count > 0 )) \
    && warn 'localhost/loopback references exist in the database; the runbook requires WordPress-aware search-replace after migration' \
    || pass 'no localhost/loopback references found in database'

  (( reference_mount_count == 0 )) \
    && pass 'database does not depend on /rosa-reference-media' \
    || block 'database contains /rosa-reference-media references'

  (( apps_media_count == 0 )) \
    && pass 'database does not depend on apps/web/public/media' \
    || block 'database contains apps/web/public/media references'

  (( repo_path_count == 0 )) \
    && pass 'database does not contain the host repository path' \
    || block 'database contains the host repository path'

  (( container_path_count > 0 )) && warn 'database contains /var/www/html references; review plugin/cache entries after migration'
  (( tmp_path_count > 0 )) && warn 'database contains /tmp/ references; review transient/plugin entries after migration'
fi

site_kb="$("${compose[@]}" exec -T wordpress sh -lc "du -sk /var/www/html 2>/dev/null | awk '{print \$1}'" 2>/dev/null || true)"
uploads_kb="$("${compose[@]}" exec -T wordpress sh -lc "du -sk /var/www/html/wp-content/uploads 2>/dev/null | awk '{print \$1}'" 2>/dev/null || true)"
db_bytes="$(wp db query 'SELECT COALESCE(SUM(data_length+index_length),0) FROM information_schema.TABLES WHERE table_schema=DATABASE();' --skip-column-names 2>/dev/null | tr -d '[:space:]' || true)"
printf 'wordpress_document_root_kb=%s\n' "${site_kb:-unknown}"
printf 'wp-content/uploads_kb=%s\n' "${uploads_kb:-unknown}"
printf 'database_bytes=%s\n' "${db_bytes:-unknown}"

phone="$(wp eval '$s=get_option("rosa_business_settings",[]); echo is_array($s)?trim((string)($s["phone"]??"")):"";' 2>/dev/null || true)"
email="$(wp eval '$s=get_option("rosa_business_settings",[]); echo is_array($s)?trim((string)($s["email"]??"")):"";' 2>/dev/null || true)"
address="$(wp eval '$s=get_option("rosa_business_settings",[]); echo is_array($s)?trim((string)($s["address"]??"")):"";' 2>/dev/null || true)"
[[ -n "$phone" ]] && pass 'Rosa phone setting is populated' || block 'Rosa phone setting is empty'
[[ -n "$email" ]] && pass 'Rosa email setting is populated' || block 'Rosa email setting is empty'
[[ -n "$address" ]] && pass 'Rosa address setting is populated' || block 'Rosa address setting is empty'

printf '\npreflight_blockers=%d\n' "$blockers"
printf 'preflight_warnings=%d\n' "$warnings"
if (( blockers == 0 )); then
  printf 'MIGRATION STATUS: GO\n'
  exit 0
fi

printf 'MIGRATION STATUS: NO-GO\n'
exit 1
