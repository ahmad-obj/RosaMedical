<?php

declare(strict_types=1);

namespace RosaMedical\Core\Catalogue;

use WP_Error;

class FamilyService
{
    public const TAXONOMY = 'product_cat';
    public const META_NAME_AR = '_rosa_name_ar';
    public const META_DESC_AR = '_rosa_description_ar';
    public const META_ORDER = '_rosa_family_order';
    public const META_VISIBLE = '_rosa_family_visible';
    public const META_PDF_ID = '_rosa_family_pdf_id';
    public const META_COVER_ID = '_rosa_family_cover_id';

    /**
     * @return list<FamilyModel>
     */
    public function getFamilies(bool $includeHidden = false, string $locale = 'en'): array
    {
        if (! function_exists('get_terms')) {
            return [];
        }

        $terms = get_terms([
            'taxonomy' => self::TAXONOMY,
            'hide_empty' => false,
        ]);

        if (! is_array($terms) || (function_exists('is_wp_error') && is_wp_error($terms))) {
            return [];
        }

        $models = [];
        foreach ($terms as $term) {
            if (! is_object($term) || ! isset($term->term_id)) {
                continue;
            }

            // Exclude default Uncategorized category if it has no products and no custom meta
            if ($term->slug === 'uncategorized' && (int) ($term->count ?? 0) === 0) {
                continue;
            }

            $model = $this->mapTermToModel($term);
            if (! $includeHidden && ! $model->visible) {
                continue;
            }
            $models[] = $model;
        }

        // Sort by order ASC, then name ASC
        usort($models, static function (FamilyModel $a, FamilyModel $b): int {
            if ($a->order !== $b->order) {
                return $a->order <=> $b->order;
            }
            return strcasecmp($a->name, $b->name);
        });

        return $models;
    }

    public function getFamily(int|string $identifier, string $locale = 'en'): ?FamilyModel
    {
        if (! function_exists('get_term') && ! function_exists('get_term_by')) {
            return null;
        }

        $term = is_int($identifier) || ctype_digit((string) $identifier)
            ? get_term((int) $identifier, self::TAXONOMY)
            : get_term_by('slug', (string) $identifier, self::TAXONOMY);

        if (! is_object($term) || (function_exists('is_wp_error') && is_wp_error($term)) || ! isset($term->term_id)) {
            return null;
        }

        return $this->mapTermToModel($term);
    }

    /**
     * @param array<string, mixed> $data
     * @return int|WP_Error
     */
    public function saveFamily(array $data): int|WP_Error
    {
        $id = isset($data['id']) ? max(0, (int) $data['id']) : 0;
        $name = isset($data['name']) ? sanitize_text_field((string) $data['name']) : '';
        $nameAr = isset($data['name_ar']) ? sanitize_text_field((string) $data['name_ar']) : '';
        $slug = isset($data['slug']) && trim((string) $data['slug']) !== ''
            ? sanitize_title((string) $data['slug'])
            : sanitize_title($name);
        $description = isset($data['description']) ? wp_kses_post((string) $data['description']) : '';
        $descriptionAr = isset($data['description_ar']) ? wp_kses_post((string) $data['description_ar']) : '';
        $order = isset($data['order']) ? (int) $data['order'] : 0;
        $visible = ! isset($data['visible']) || (bool) $data['visible'];
        $coverId = isset($data['cover_id']) ? max(0, (int) $data['cover_id']) : 0;
        $pdfId = isset($data['pdf_id']) ? max(0, (int) $data['pdf_id']) : 0;

        if ($id > 0) {
            $updateArgs = [];
            if ($name !== '') {
                $updateArgs['name'] = $name;
            }
            if ($slug !== '') {
                $updateArgs['slug'] = $slug;
            }
            if (isset($data['description'])) {
                $updateArgs['description'] = $description;
            }

            if ($updateArgs !== []) {
                $updated = wp_update_term($id, self::TAXONOMY, $updateArgs);
                if (function_exists('is_wp_error') && is_wp_error($updated)) {
                    return $updated;
                }
            }
            $termId = $id;
        } else {
            if ($name === '') {
                return new WP_Error('missing_name', 'Family name is required.');
            }
            $inserted = wp_insert_term($name, self::TAXONOMY, [
                'slug' => $slug,
                'description' => $description,
            ]);
            if (function_exists('is_wp_error') && is_wp_error($inserted)) {
                return $inserted;
            }
            $termId = is_array($inserted) ? (int) $inserted['term_id'] : (int) $inserted;
        }

        // Persist term metadata
        if (isset($data['name_ar'])) {
            update_term_meta($termId, self::META_NAME_AR, $nameAr);
        }
        if (isset($data['description_ar'])) {
            update_term_meta($termId, self::META_DESC_AR, $descriptionAr);
        }
        if (isset($data['order'])) {
            update_term_meta($termId, self::META_ORDER, $order);
        }
        if (isset($data['visible'])) {
            update_term_meta($termId, self::META_VISIBLE, $visible ? '1' : '0');
        }
        if (isset($data['cover_id'])) {
            update_term_meta($termId, self::META_COVER_ID, $coverId);
            // Also synchronize standard WooCommerce category thumbnail_id
            update_term_meta($termId, 'thumbnail_id', $coverId);
        }
        if (isset($data['pdf_id'])) {
            update_term_meta($termId, self::META_PDF_ID, $pdfId);
        }

        return $termId;
    }

    public function deleteFamily(int $termId, int $reassignTermId = 0): bool|WP_Error
    {
        if ($termId <= 0) {
            return new WP_Error('invalid_term', 'Invalid family ID.');
        }

        // Handle safe deletion of assigned products
        if (function_exists('get_objects_in_term')) {
            $productIds = get_objects_in_term($termId, self::TAXONOMY);
            if (is_array($productIds) && $productIds !== []) {
                foreach ($productIds as $productId) {
                    $pid = (int) $productId;
                    if ($pid <= 0) {
                        continue;
                    }
                    if ($reassignTermId > 0 && function_exists('wp_set_object_terms')) {
                        // Reassign to target family
                        wp_set_object_terms($pid, [$reassignTermId], self::TAXONOMY, true);
                    }
                    if (function_exists('wp_remove_object_terms')) {
                        // Remove from deleted family
                        wp_remove_object_terms($pid, [$termId], self::TAXONOMY);
                    }
                }
            }
        }

        // Delete term itself
        $deleted = wp_delete_term($termId, self::TAXONOMY);
        if (function_exists('is_wp_error') && is_wp_error($deleted)) {
            return $deleted;
        }

        return $deleted !== false;
    }

    private function mapTermToModel(object $term): FamilyModel
    {
        $termId = (int) ($term->term_id ?? 0);
        $nameAr = function_exists('get_term_meta') ? (string) get_term_meta($termId, self::META_NAME_AR, true) : '';
        $descAr = function_exists('get_term_meta') ? (string) get_term_meta($termId, self::META_DESC_AR, true) : '';
        $orderRaw = function_exists('get_term_meta') ? get_term_meta($termId, self::META_ORDER, true) : '';
        $order = is_numeric($orderRaw) ? (int) $orderRaw : 0;
        $visibleMeta = function_exists('get_term_meta') ? get_term_meta($termId, self::META_VISIBLE, true) : '';
        $visible = $visibleMeta === '' || $visibleMeta === '1' || $visibleMeta === true;

        $coverIdMeta = function_exists('get_term_meta') ? get_term_meta($termId, self::META_COVER_ID, true) : 0;
        $coverId = max(0, (int) $coverIdMeta);
        if ($coverId <= 0 && function_exists('get_term_meta')) {
            $coverId = max(0, (int) get_term_meta($termId, 'thumbnail_id', true));
        }

        $coverUrl = $coverId > 0 && function_exists('wp_get_attachment_url')
            ? (string) (wp_get_attachment_url($coverId) ?: '')
            : '';

        $pdfIdMeta = function_exists('get_term_meta') ? get_term_meta($termId, self::META_PDF_ID, true) : 0;
        $pdfId = max(0, (int) $pdfIdMeta);
        $pdfUrl = $pdfId > 0 && function_exists('wp_get_attachment_url')
            ? (string) (wp_get_attachment_url($pdfId) ?: '')
            : '';

        $productCount = max(0, (int) ($term->count ?? 0));

        return new FamilyModel(
            id: $termId,
            slug: (string) ($term->slug ?? ''),
            name: (string) ($term->name ?? ''),
            nameAr: $nameAr,
            description: (string) ($term->description ?? ''),
            descriptionAr: $descAr,
            order: $order,
            visible: $visible,
            coverId: $coverId,
            coverUrl: $coverUrl,
            pdfId: $pdfId,
            pdfUrl: $pdfUrl,
            productCount: $productCount
        );
    }
}
