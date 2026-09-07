#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
INVENTORY="$ROOT_DIR/wordpress/scripts/client-handoff-media-inventory.sh"

fail() {
  printf 'FAIL: client handoff media inventory contract: %s\n' "$1" >&2
  exit 1
}

[[ -f "$INVENTORY" ]] || fail 'client-handoff-media-inventory.sh is missing'

for marker in \
  'ROSA_MEDIA_INVENTORY_V1' \
  'rosa_preview_media' \
  '_elementor_data' \
  '_product_image_gallery' \
  '_thumbnail_id' \
  'product_cat' \
  '_rosa_preview_source_path' \
  '# SOURCE repository_references'; do
  grep -Fq -- "$marker" "$INVENTORY" || fail "inventory collector marker missing: $marker"
done

expected_header=$'owner\tsurface\tslot\tattachment_id\tsource_path\tfile_url\tparent_id\tnotes'
grep -Fq -- "$expected_header" "$INVENTORY" || fail 'normalized TSV header is missing'

for forbidden in \
  'post[[:space:]]+update' \
  'post[[:space:]]+delete' \
  'post[[:space:]]+meta[[:space:]]+update' \
  'option[[:space:]]+update' \
  'media[[:space:]]+import' \
  'term[[:space:]]+update'; do
  if grep -Eqi -- "$forbidden" "$INVENTORY"; then
    fail "read-only inventory contains mutating WP-CLI operation matching: $forbidden"
  fi
done

# Static/source contract can be verified without a Docker runtime by setting
# ROSA_MEDIA_INVENTORY_SKIP_RUNTIME=1. The default path deliberately performs
# the local runtime smoke required for the client-handoff gate.
if [[ "${ROSA_MEDIA_INVENTORY_SKIP_RUNTIME:-0}" != '1' ]]; then
  output="$(mktemp)"
  trap 'rm -f "$output"' EXIT
  bash "$INVENTORY" > "$output"

  [[ "$(sed -n '1p' "$output")" == 'ROSA_MEDIA_INVENTORY_V1' ]] || fail 'runtime output version marker is not the first line'
  [[ "$(sed -n '2p' "$output")" == "$expected_header" ]] || fail 'runtime TSV header is not the second line'

  for source in \
    '# SOURCE settings rosa_preview_media' \
    '# SOURCE elementor _elementor_data' \
    '# SOURCE woo_products _thumbnail_id _product_image_gallery' \
    '# SOURCE woo_categories product_cat _thumbnail_id' \
    '# SOURCE attachments _rosa_preview_source_path' \
    '# SOURCE repository_references'; do
    grep -Fq -- "$source" "$output" || fail "runtime evidence source missing: $source"
  done

  grep -Fq -- $'attachment\tmedia_library\t' "$output" || fail 'runtime inventory did not emit any Media Library attachment records'
fi

printf 'PASS: client handoff media inventory is read-only and covers all required provenance sources\n'
