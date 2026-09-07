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
  printf 'Client handoff media inventory failed: %s\n' "$1" >&2
  exit 1
}

[[ -f "$COMPOSE_FILE" ]] || fail "missing Docker compose file: $COMPOSE_FILE"
git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail 'repository root is not a Git working tree'

# TSV_COLUMNS: owner	surface	slot	attachment_id	source_path	file_url	parent_id	notes
printf 'ROSA_MEDIA_INVENTORY_V1\n'
printf 'owner\tsurface\tslot\tattachment_id\tsource_path\tfile_url\tparent_id\tnotes\n'

WP_EVAL="$(cat <<'PHP'
function rosa_inv_clean($value): string {
    $value = is_scalar($value) ? (string) $value : '';
    return str_replace(["\t", "\r", "\n"], ' ', $value);
}

function rosa_inv_attachment_fields(int $attachmentId): array {
    if ($attachmentId <= 0) {
        return [
            'source_path' => '',
            'file_url' => '',
            'parent_id' => 0,
            'notes' => '',
        ];
    }

    $post = get_post($attachmentId);
    $sourcePath = (string) get_post_meta($attachmentId, '_rosa_preview_source_path', true);
    $attachedFile = (string) get_post_meta($attachmentId, '_wp_attached_file', true);
    $url = (string) wp_get_attachment_url($attachmentId);
    $mime = $post instanceof WP_Post ? (string) $post->post_mime_type : '';
    $parentId = $post instanceof WP_Post ? (int) $post->post_parent : 0;
    $notes = [];
    if ($attachedFile !== '') {
        $notes[] = 'wp_attached_file=' . $attachedFile;
    }
    if ($mime !== '') {
        $notes[] = 'mime=' . $mime;
    }
    if (! $post instanceof WP_Post) {
        $notes[] = 'missing_attachment=1';
    }

    return [
        'source_path' => $sourcePath,
        'file_url' => $url,
        'parent_id' => $parentId,
        'notes' => implode(' ', $notes),
    ];
}

function rosa_inv_emit(
    string $owner,
    string $surface,
    string $slot,
    int $attachmentId,
    string $sourcePath,
    string $fileUrl,
    int $parentId,
    string $notes
): void {
    $fields = [
        $owner,
        $surface,
        $slot,
        (string) max(0, $attachmentId),
        $sourcePath,
        $fileUrl,
        (string) max(0, $parentId),
        $notes,
    ];
    echo implode("\t", array_map('rosa_inv_clean', $fields)) . "\n";
}

function rosa_inv_emit_attachment_reference(
    string $owner,
    string $surface,
    string $slot,
    int $attachmentId,
    string $notes = '',
    string $fallbackUrl = ''
): void {
    $attachment = rosa_inv_attachment_fields($attachmentId);
    $fileUrl = $attachment['file_url'] !== '' ? $attachment['file_url'] : $fallbackUrl;
    $combinedNotes = trim($attachment['notes'] . ' ' . $notes);
    rosa_inv_emit(
        $owner,
        $surface,
        $slot,
        $attachmentId,
        $attachment['source_path'],
        $fileUrl,
        $attachment['parent_id'],
        $combinedNotes
    );
}

function rosa_inv_walk_elementor_media($node, string $path, int $pageId, string $surface, string $locale): void {
    if (! is_array($node)) {
        return;
    }

    $isElementRecord = array_key_exists('elType', $node) || array_key_exists('widgetType', $node);
    $attachmentId = 0;
    if (! $isElementRecord && array_key_exists('id', $node) && is_scalar($node['id'])) {
        $candidate = trim((string) $node['id']);
        if ($candidate !== '' && ctype_digit($candidate)) {
            $attachmentId = max(0, (int) $candidate);
        }
    }

    $url = '';
    if (! $isElementRecord && array_key_exists('url', $node) && is_scalar($node['url'])) {
        $url = trim((string) $node['url']);
    }
    $looksLikeMediaUrl = $url !== '' && (
        preg_match('~\.(?:jpe?g|png|gif|webp|avif|svg)(?:[?#].*)?$~i', $url) === 1
        || str_contains($url, '/wp-content/uploads/')
    );

    if ($attachmentId > 0 || $looksLikeMediaUrl) {
        rosa_inv_emit_attachment_reference(
            'elementor',
            $surface,
            $path,
            $attachmentId,
            'page_id=' . $pageId . ' locale=' . $locale,
            $url
        );
    }

    foreach ($node as $key => $value) {
        if (! is_array($value)) {
            continue;
        }
        $nextPath = $path === '' ? (string) $key : $path . '/' . (string) $key;
        rosa_inv_walk_elementor_media($value, $nextPath, $pageId, $surface, $locale);
    }
}

echo "# SOURCE settings rosa_preview_media\n";
$mediaSettings = get_option('rosa_preview_media', []);
if (is_array($mediaSettings)) {
    ksort($mediaSettings);
    foreach ($mediaSettings as $key => $value) {
        if (! is_scalar($value)) {
            continue;
        }
        $attachmentId = max(0, (int) $value);
        if ($attachmentId <= 0) {
            continue;
        }
        rosa_inv_emit_attachment_reference(
            'settings',
            'rosa_preview_media',
            (string) $key,
            $attachmentId,
            'option=rosa_preview_media'
        );
    }
}

echo "# SOURCE elementor _elementor_data\n";
$pagePaths = ['home', 'about', 'contact', 'ar', 'ar/about', 'ar/contact'];
foreach ($pagePaths as $pagePath) {
    $page = get_page_by_path($pagePath, OBJECT, 'page');
    if (! $page instanceof WP_Post) {
        continue;
    }
    $pageId = (int) $page->ID;
    $locale = (string) get_post_meta($pageId, '_rosa_preview_locale', true);
    $locale = $locale === 'ar' ? 'ar' : 'en';
    $raw = (string) get_post_meta($pageId, '_elementor_data', true);
    if ($raw === '') {
        continue;
    }
    $decoded = json_decode($raw, true);
    if (! is_array($decoded)) {
        rosa_inv_emit('elementor', $pagePath, '_elementor_data', 0, '', '', 0, 'page_id=' . $pageId . ' invalid_json=1');
        continue;
    }
    rosa_inv_walk_elementor_media($decoded, '_elementor_data', $pageId, $pagePath, $locale);
}

echo "# SOURCE woo_products _thumbnail_id _product_image_gallery\n";
$productIds = get_posts([
    'post_type' => 'product',
    'post_status' => 'publish',
    'fields' => 'ids',
    'posts_per_page' => -1,
    'orderby' => 'ID',
    'order' => 'ASC',
]);
foreach ($productIds as $productId) {
    $productId = (int) $productId;
    $slug = (string) get_post_field('post_name', $productId);
    $featuredId = (int) get_post_meta($productId, '_thumbnail_id', true);
    if ($featuredId > 0) {
        rosa_inv_emit_attachment_reference('woocommerce', 'product:' . $slug, '_thumbnail_id', $featuredId, 'product_id=' . $productId);
    }

    $galleryRaw = (string) get_post_meta($productId, '_product_image_gallery', true);
    if ($galleryRaw !== '') {
        $galleryIds = array_values(array_filter(array_map('absint', preg_split('/\s*,\s*/', $galleryRaw) ?: [])));
        foreach ($galleryIds as $index => $galleryId) {
            rosa_inv_emit_attachment_reference(
                'woocommerce',
                'product:' . $slug,
                '_product_image_gallery[' . $index . ']',
                (int) $galleryId,
                'product_id=' . $productId
            );
        }
    }

    $variationIds = get_posts([
        'post_type' => 'product_variation',
        'post_status' => ['publish', 'private'],
        'post_parent' => $productId,
        'fields' => 'ids',
        'posts_per_page' => -1,
        'orderby' => 'ID',
        'order' => 'ASC',
    ]);
    foreach ($variationIds as $variationId) {
        $variationId = (int) $variationId;
        $variationImageId = (int) get_post_meta($variationId, '_thumbnail_id', true);
        if ($variationImageId <= 0) {
            continue;
        }
        rosa_inv_emit_attachment_reference(
            'woocommerce',
            'product:' . $slug,
            'variation:' . $variationId . '/_thumbnail_id',
            $variationImageId,
            'product_id=' . $productId . ' variation_id=' . $variationId
        );
    }
}

echo "# SOURCE woo_categories product_cat _thumbnail_id\n";
if (taxonomy_exists('product_cat')) {
    $terms = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
        'orderby' => 'term_id',
        'order' => 'ASC',
    ]);
    if (! is_wp_error($terms)) {
        foreach ($terms as $term) {
            if (! $term instanceof WP_Term) {
                continue;
            }
            $thumbnailId = (int) get_term_meta((int) $term->term_id, '_thumbnail_id', true);
            if ($thumbnailId <= 0) {
                continue;
            }
            rosa_inv_emit_attachment_reference(
                'woocommerce',
                'product_cat:' . (string) $term->slug,
                '_thumbnail_id',
                $thumbnailId,
                'term_id=' . (int) $term->term_id
            );
        }
    }
}

echo "# SOURCE attachments _rosa_preview_source_path\n";
$attachmentIds = get_posts([
    'post_type' => 'attachment',
    'post_status' => 'inherit',
    'fields' => 'ids',
    'posts_per_page' => -1,
    'orderby' => 'ID',
    'order' => 'ASC',
]);
foreach ($attachmentIds as $attachmentId) {
    $attachmentId = (int) $attachmentId;
    $post = get_post($attachmentId);
    if (! $post instanceof WP_Post) {
        continue;
    }
    $attachment = rosa_inv_attachment_fields($attachmentId);
    $title = (string) get_the_title($attachmentId);
    $notes = trim($attachment['notes'] . ' title=' . $title);
    rosa_inv_emit(
        'attachment',
        'media_library',
        'attachment:' . $attachmentId,
        $attachmentId,
        $attachment['source_path'],
        $attachment['file_url'],
        $attachment['parent_id'],
        $notes
    );
}
PHP
)"

wp eval "$WP_EVAL"

printf '# SOURCE repository_references\n'
repo_paths=(
  'wordpress/wp-content/themes/rosa-medical-child'
  'wordpress/wp-content/plugins/rosa-medical-core'
)
while IFS= read -r seed_path; do
  [[ -n "$seed_path" ]] && repo_paths+=("$seed_path")
done < <(git -C "$ROOT_DIR" ls-files 'wordpress/scripts/*seed*.sh')

reference_pattern='(background(-image)?[[:space:]]*:|url[[:space:]]*\(|[^[:alnum:]_./-]\.?/?[^[:space:]"'"'']*\.(jpe?g|png|gif|webp|avif|svg)([?#][^[:space:]"'"'']*)?)'
while IFS= read -r match; do
  [[ -n "$match" ]] || continue
  file="${match%%:*}"
  remainder="${match#*:}"
  line="${remainder%%:*}"
  text="${remainder#*:}"
  text="${text//$'\t'/ }"
  text="${text//$'\r'/ }"
  text="${text//$'\n'/ }"
  printf 'repository\thardcoded_reference\tline:%s\t0\t%s\t\t0\t%s\n' "$line" "$file" "$text"
done < <(git -C "$ROOT_DIR" grep -nEI -- "$reference_pattern" -- "${repo_paths[@]}" 2>/dev/null || true)

printf '# SUMMARY mode=read-only evidence_sources=settings,elementor,woo_products,woo_categories,attachments,repository_references\n'
