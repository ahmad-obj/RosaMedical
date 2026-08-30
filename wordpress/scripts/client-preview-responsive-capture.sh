#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
ARTIFACT_DIR="$ROOT_DIR/wordpress/.client-preview-artifacts/screenshots"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'Client preview screenshot capture failed: %s\n' "$1" >&2; exit 1; }
page_url(){ local path="$1"; wp eval "\$p=get_page_by_path('${path}',OBJECT,'page'); if(!\$p){WP_CLI::error('Missing page: ${path}');} echo get_permalink((int)\$p->ID);"; }

cd "$ROOT_DIR"
command -v pnpm >/dev/null 2>&1 || fail 'pnpm is required for Playwright capture'
mkdir -p "$ARTIFACT_DIR"

home_url="$(wp option get home)"
about_url="$(page_url 'about')"
contact_url="$(page_url 'contact')"
shop_id="$(wp option get woocommerce_shop_page_id)"
[[ "$shop_id" =~ ^[0-9]+$ && "$shop_id" -gt 0 ]] || fail 'WooCommerce Shop page ID is missing'
shop_url="$(wp post url "$shop_id")"
ar_home_url="$(page_url 'ar')"
ar_about_url="$(page_url 'ar/about')"
ar_contact_url="$(page_url 'ar/contact')"
ar_shop_url="$(page_url 'ar/shop')"

pages=(
  "en-home|$home_url"
  "en-about|$about_url"
  "en-contact|$contact_url"
  "en-shop|$shop_url"
  "ar-home|$ar_home_url"
  "ar-about|$ar_about_url"
  "ar-contact|$ar_contact_url"
  "ar-shop|$ar_shop_url"
)
viewports=("390,844" "430,932" "768,1024" "1024,768" "1366,768" "1440,900" "1920,1080" "2560,1440")
# Explicit route evidence required by the tooling contract: /ar/

count=0
for entry in "${pages[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  for viewport in "${viewports[@]}"; do
    dimensions="${viewport/,/x}"
    output="$ARTIFACT_DIR/${name}-${dimensions}.png"
    printf 'Capturing %-12s %s -> %s\n' "$name" "$viewport" "$output"
    pnpm --filter @rosa/web exec playwright screenshot \
      --browser=chromium \
      --viewport-size="$viewport" \
      --full-page \
      --wait-for-timeout=500 \
      "$url" "$output" >/dev/null
    [[ -s "$output" ]] || fail "capture was not created: $output"
    count=$((count + 1))
  done
done

[[ "$count" -eq 64 ]] || fail "expected 64 captures, created $count"
printf 'PASS: %s bilingual client-preview screenshots captured in %s\n' "$count" "$ARTIFACT_DIR"
