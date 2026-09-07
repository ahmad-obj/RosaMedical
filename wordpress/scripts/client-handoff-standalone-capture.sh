#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
ARTIFACT_DIR="$ROOT_DIR/wordpress/.client-preview-artifacts/handoff-phase3"
CAPTURE_HELPER="$SCRIPT_DIR/client-preview-capture.mjs"

compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

fail() {
  printf 'Phase 3 standalone capture failed: %s\n' "$1" >&2
  exit 1
}

cd "$ROOT_DIR"
command -v node >/dev/null 2>&1 || fail 'Node.js is required for Playwright capture'
[[ -f "$COMPOSE_FILE" ]] || fail "missing Docker compose file: $COMPOSE_FILE"
[[ -f "$CAPTURE_HELPER" ]] || fail "missing capture helper: $CAPTURE_HELPER"

base_url="$(wp option get home)"
base_url="${base_url%/}"
[[ -n "$base_url" ]] || fail 'WordPress home URL is empty'

pages=(
  "en-home|$base_url/"
  "en-about|$base_url/about/"
  "en-contact|$base_url/contact/"
  "en-shop|$base_url/shop/"
  "en-product|$base_url/product/rosa-foundation-stevens-scissors-regular/"
  "ar-home|$base_url/ar/"
  "ar-about|$base_url/ar/about/"
  "ar-contact|$base_url/ar/contact/"
  "ar-shop|$base_url/ar/shop/"
  "ar-product|$base_url/ar/product/rosa-foundation-stevens-scissors-regular/"
)

viewports=("1440,900" "1024,768" "768,1024" "431,932" "390,844")
expected=50

rm -rf "$ARTIFACT_DIR"
mkdir -p "$ARTIFACT_DIR"
printf 'locale\tsurface\troute\tviewport\tfile\n' > "$ARTIFACT_DIR/manifest.tsv"

count=0
for entry in "${pages[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  locale="${name%%-*}"
  surface="${name#*-}"
  route="${url#"$base_url"}"

  for viewport in "${viewports[@]}"; do
    width="${viewport%%,*}"
    height="${viewport##*,}"
    dimensions="${width}x${height}"
    file="$ARTIFACT_DIR/${name}-${dimensions}.png"

    printf 'Capturing %-10s %-9s -> %s\n' "$name" "$dimensions" "$file"
    node "$CAPTURE_HELPER" "$url" "$file" "$width" "$height"
    [[ -s "$file" ]] || fail "capture was not created: $file"

    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$locale" "$surface" "$route" "$dimensions" "$file" \
      >> "$ARTIFACT_DIR/manifest.tsv"
    count=$((count + 1))
  done
done

[[ "$count" -eq "$expected" ]] || fail "expected $expected captures, created $count"
manifest_rows=$(($(wc -l < "$ARTIFACT_DIR/manifest.tsv") - 1))
[[ "$manifest_rows" -eq "$expected" ]] || fail 'manifest row count does not match screenshot count'
printf 'PASS: %d standalone Phase 3 screenshots captured in %s\n' "$count" "$ARTIFACT_DIR"
