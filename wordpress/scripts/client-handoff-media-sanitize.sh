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
  printf 'Client handoff media sanitizer failed: %s\n' "$1" >&2
  exit 1
}

[[ -f "$COMPOSE_FILE" ]] || fail "missing Docker compose file: $COMPOSE_FILE"
"${compose[@]}" up -d db wordpress >/dev/null

home_url="$(wp option get home 2>/dev/null || true)"
case "$home_url" in
  http://localhost|http://localhost:*|https://localhost|https://localhost:*|http://127.0.0.1|http://127.0.0.1:*|https://127.0.0.1|https://127.0.0.1:*) ;;
  *) fail "refusing to mutate non-local WordPress runtime: ${home_url:-unknown}" ;;
esac

WP_EVAL="$(cat <<'PHP'
$unsafeIds = [19, 20, 21, 22, 23, 39, 80, 81, 82, 83, 84, 85];
$unsafeMap = array_fill_keys($unsafeIds, true);
$unsafeSettingKeys = [
    'hero',
    'about_procurement',
    'about_hospitals',
    'about_international',
    'home-hero-01',
    'procurement_support',
    'home-specialty-plastic-surgery',
    'home-specialty-orthopedics',
    'home-specialty-maxillofacial',
    'home-specialty-orthodontics',
    'home-specialty-spine',
    'home-securing-confidence',
];

$media = get_option('rosa_preview_media', []);
if (! is_array($media)) {
    $media = [];
}
$nextMedia = $media;
$settingsChanged = 0;
foreach ($unsafeSettingKeys as $key) {
    $currentId = isset($media[$key]) && is_scalar($media[$key]) ? max(0, (int) $media[$key]) : 0;
    if ($currentId > 0 && isset($unsafeMap[$currentId])) {
        $nextMedia[$key] = 0;
        $settingsChanged++;
    }
}

$targets = [
    'home' => [0 => 22],
    'ar' => [0 => 22],
    'about' => [1 => 20, 4 => 21],
    'ar/about' => [1 => 20, 4 => 21],
];
$preparedPages = [];
$elementorChanged = 0;

// Validate every audited Elementor document first. No WordPress content is
// mutated until all expected structures and IDs have passed this preflight.
foreach ($targets as $path => $indexes) {
    $page = get_page_by_path($path, OBJECT, 'page');
    if (! $page instanceof WP_Post) {
        WP_CLI::error('Missing audited Elementor page: ' . $path);
    }

    $pageId = (int) $page->ID;
    $raw = (string) get_post_meta($pageId, '_elementor_data', true);
    $doc = json_decode($raw, true);
    if (! is_array($doc)) {
        WP_CLI::error('Invalid Elementor document for audited page: ' . $path);
    }
    if (! isset($doc[0]['elements']) || ! is_array($doc[0]['elements'])) {
        WP_CLI::error('Unexpected Elementor root structure for audited page: ' . $path);
    }

    $pageChanged = false;
    foreach ($indexes as $index => $expectedId) {
        if (! isset($doc[0]['elements'][$index]['settings']) || ! is_array($doc[0]['elements'][$index]['settings'])) {
            WP_CLI::error(sprintf('Missing audited Elementor settings at %s element %d', $path, $index));
        }

        $value = $doc[0]['elements'][$index]['settings']['image'] ?? [];
        $currentId = 0;
        if (is_array($value) && isset($value['id']) && is_scalar($value['id'])) {
            $currentId = max(0, (int) $value['id']);
        } elseif (is_scalar($value)) {
            $currentId = max(0, (int) $value);
        }

        if ($currentId === 0) {
            continue;
        }
        if (! isset($unsafeMap[$currentId])) {
            // A client/editor has already supplied a different media asset.
            // Preserve it; this migration only clears the audited unsafe IDs.
            continue;
        }
        if ($currentId !== $expectedId) {
            WP_CLI::error(sprintf(
                'Unsafe attachment %d appeared at unexpected audited slot %s element %d (expected %d)',
                $currentId,
                $path,
                $index,
                $expectedId
            ));
        }

        $doc[0]['elements'][$index]['settings']['image'] = [];
        $pageChanged = true;
        $elementorChanged++;
    }

    if ($pageChanged) {
        $preparedPages[$pageId] = $doc;
    }
}

if ($settingsChanged > 0) {
    update_option('rosa_preview_media', $nextMedia);
}

foreach ($preparedPages as $pageId => $doc) {
    update_post_meta(
        (int) $pageId,
        '_elementor_data',
        wp_slash(wp_json_encode($doc, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))
    );
    delete_post_meta((int) $pageId, '_elementor_element_cache');
    delete_post_meta((int) $pageId, '_elementor_css');
    clean_post_cache((int) $pageId);
}

WP_CLI::success(sprintf(
    'Sanitized Rosa handoff media references (settings changed: %d; Elementor controls changed: %d).',
    $settingsChanged,
    $elementorChanged
));
PHP
)"

wp eval "$WP_EVAL"
