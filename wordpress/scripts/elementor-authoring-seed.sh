#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then compose+=(--env-file "$ENV_FILE"); fi
wp(){ "${compose[@]}" run --rm wpcli "$@"; }
fail(){ printf 'Elementor authoring seed failed: %s\n' "$1" >&2; exit 1; }

force=false
if [[ ${1:-} == '--force' ]]; then
  force=true
  shift
fi
[[ $# -eq 0 ]] || fail 'usage: elementor-authoring-seed.sh [--force]'

wp plugin is-active elementor >/dev/null || fail 'Elementor Free is not active'
wp plugin is-active rosa-medical-core >/dev/null || fail 'Rosa Medical Core is not active'
admin_id="$(wp user list --role=administrator --field=ID | head -n1 | tr -d '\r')"
[[ "$admin_id" =~ ^[0-9]+$ ]] || fail 'No WordPress administrator available for Elementor document save'
wp_admin(){ wp --user="$admin_id" "$@"; }

targets=(
  'home|home|en'
  'about|about|en'
  'contact|contact|en'
  'ar|home|ar'
  'ar/about|about|ar'
  'ar/contact|contact|ar'
)

for target in "${targets[@]}"; do
  IFS='|' read -r path page_type locale <<<"$target"
  force_php=false
  [[ "$force" == true ]] && force_php=true
  result="$(wp_admin eval "
    \$path = '${path}';
    \$page = get_page_by_path(\$path, OBJECT, 'page');
    if (! \$page) WP_CLI::error('Missing Rosa authoring page: ' . \$path);
    \$id = (int) \$page->ID;
    \$locale = (string) get_post_meta(\$id, '_rosa_preview_locale', true);
    if (\$locale !== '${locale}') WP_CLI::error('Locale mismatch for ' . \$path . ': ' . \$locale);
    \$result = \\RosaMedical\\Core\\Elementor\\ElementorPageSeeder::seedPage(\$id, '${page_type}', '${locale}', ${force_php});
    echo (string) (\$result['status'] ?? 'unknown') . '|' . \$id;
  ")"
  status="${result%%|*}"
  post_id="${result##*|}"
  case "$status" in
    seeded|seeded_forced|skipped|migrated_home_parity) ;;
    home_parity_manual_required)
      fail "$path contains client-edited Home Elementor content. Finished-template parity was NOT applied. Review the edits explicitly; do not use --force as a routine migration."
      ;;
    *) fail "$path returned status $status" ;;
  esac
  printf '%s | %s | %s | post=%s | %s\n' "$path" "$page_type" "$locale" "$post_id" "$status"
done
