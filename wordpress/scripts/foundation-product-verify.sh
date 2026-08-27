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
  printf 'Foundation product verification failed: %s\n' "$1" >&2
  exit 1
}

slug='rosa-foundation-stevens-scissors-regular'
expected_skus=('04-0901' '04-0911')

product_id="$(wp post list --post_type=product --name="$slug" --post_status=publish --field=ID --format=ids)"
[[ -n "$product_id" ]] || fail "fixture product '$slug' is missing"

product_type="$(wp eval "echo wc_get_product(${product_id})->get_type();")"
[[ "$product_type" == 'variable' ]] || fail "fixture product must be variable, got '$product_type'"

mapfile -t variation_ids < <(wp post list --post_type=product_variation --post_parent="$product_id" --post_status=publish --field=ID --format=ids | tr ' ' '\n' | sed '/^$/d')
[[ ${#variation_ids[@]} -eq 2 ]] || fail "expected exactly 2 real variations, found ${#variation_ids[@]}"

declare -a actual_skus=()
for variation_id in "${variation_ids[@]}"; do
  sku="$(wp post meta get "$variation_id" _sku)"
  direction="$(wp post meta get "$variation_id" attribute_pa_direction)"
  size="$(wp post meta get "$variation_id" attribute_pa_size 2>/dev/null || true)"
  variant="$(wp post meta get "$variation_id" attribute_pa_variant 2>/dev/null || true)"

  [[ -n "$sku" ]] || fail "variation $variation_id has no SKU"
  [[ "$direction" == 'straight' || "$direction" == 'curved' ]] || fail "variation $variation_id has invalid direction '$direction'"
  [[ -z "$size" || "$size" == '10-5-cm' ]] || fail "variation $variation_id has unexpected size '$size'"
  [[ -z "$variant" || "$variant" == 'regular' ]] || fail "variation $variation_id has unexpected variant '$variant'"
  actual_skus+=("$sku")
done

printf '%s\n' "${actual_skus[@]}" | sort -u > /tmp/rosa-foundation-actual-skus.txt
printf '%s\n' "${expected_skus[@]}" | sort -u > /tmp/rosa-foundation-expected-skus.txt
cmp -s /tmp/rosa-foundation-actual-skus.txt /tmp/rosa-foundation-expected-skus.txt || {
  printf 'Expected SKUs:\n' >&2
  cat /tmp/rosa-foundation-expected-skus.txt >&2
  printf 'Actual SKUs:\n' >&2
  cat /tmp/rosa-foundation-actual-skus.txt >&2
  fail 'variation SKU set does not match catalogue fixture'
}

product_url="$(wp post url "$product_id")"
[[ -n "$product_url" ]] || fail 'product URL lookup returned empty output'
html="$(curl -fsS "$product_url")" || fail "product detail route did not resolve: $product_url"
[[ "$html" == *'Stevens Scissors'* ]] || fail 'product detail does not render product name'
[[ "$html" == *'04-0901'* ]] || fail 'product detail does not render straight SKU 04-0901'
[[ "$html" == *'04-0911'* ]] || fail 'product detail does not render curved SKU 04-0911'
[[ "$html" == *'Straight'* ]] || fail 'product detail does not render Straight configuration'
[[ "$html" == *'Curved'* ]] || fail 'product detail does not render Curved configuration'

printf 'PASS: Stevens Scissors Regular foundation fixture parity and shared detail rendering\n'
