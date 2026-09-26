<?php

declare(strict_types=1);

namespace RosaMedical\Core\Catalogue;

final class CatalogueImporter
{
    public const SOURCE_PATH_META = '_rosa_catalogue_source_path';
    public const PREVIEW_PATH_META = '_rosa_preview_source_path';
    public const PRODUCT_ID_META = '_rosa_product_id';
    public const PRIMARY_CODE_META = '_rosa_primary_code';

    /**
     * Return canonical dataset definition containing the 5 families and 113 products.
     *
     * @return array{families: array<string, array<string, mixed>>, products: list<array<string, mixed>>}
     */
    public static function getCanonicalDataset(): array
    {
        $families = [
            'scissors' => [
                'name' => 'Scissors',
                'name_ar' => 'المقصات',
                'slug' => 'scissors',
                'order' => 1,
                'description' => 'Surgical scissors organised by product code, length, direction and listed variant.',
                'description_ar' => 'مقصات جراحية مصنفة حسب رمز المنتج، الطول، الاتجاه، والشكل.',
                'cover_file' => 'apps/web/public/media/families/homepage-covers/scissors-family-cover-full.svg',
                'pdf_file' => 'apps/web/public/media/catalogues/pdf/rosa-scissors-catalogue.pdf',
            ],
            'cutters' => [
                'name' => 'Cutters',
                'name_ar' => 'القواطع',
                'slug' => 'cutters',
                'order' => 2,
                'description' => 'Cutting instruments organised by named pattern, length and listed direction or profile.',
                'description_ar' => 'أدوات قطع جراحية مصنفة حسب النمط، الطول، والاتجاه.',
                'cover_file' => 'apps/web/public/media/families/homepage-covers/cutters-family-cover-full.svg',
                'pdf_file' => 'apps/web/public/media/catalogues/pdf/rosa-cutters-catalogue.pdf',
            ],
            'punches' => [
                'name' => 'Punches',
                'name_ar' => 'المثاقب',
                'slug' => 'punches',
                'order' => 3,
                'description' => 'Punch instruments organised by jaw pattern, shaft length and catalogue reference.',
                'description_ar' => 'أدوات ثقب جراحية مصنفة حسب نمط الفك، طول الساق، ومرجع الكتالوج.',
                'cover_file' => 'apps/web/public/media/families/homepage-covers/punches-family-cover.webp',
                'pdf_file' => 'apps/web/public/media/catalogues/pdf/rosa-punches-catalogue.pdf',
            ],
            'chisels' => [
                'name' => 'Chisels & Osteotomes',
                'name_ar' => 'الأزاميل ومناشير العظام',
                'slug' => 'chisels',
                'order' => 4,
                'description' => 'Chisels and osteotomes organised by pattern, width, length and listed direction.',
                'description_ar' => 'أزاميل ومناشير عظام مصنفة حسب النمط، العرض، الطول، والاتجاه.',
                'cover_file' => 'apps/web/public/media/families/homepage-covers/chisels-family-cover-full.svg',
                'pdf_file' => 'apps/web/public/media/catalogues/pdf/rosa-chisels-catalogue.pdf',
            ],
            'knives' => [
                'name' => 'Knives',
                'name_ar' => 'السكاكين الجراحية',
                'slug' => 'knives',
                'order' => 5,
                'description' => 'Precision cutting instruments presented with clear product codes, stated sizes and available variants for quotation preparation.',
                'description_ar' => 'أدوات قطع دقيقة بمقابض وشفرات جراحية جاهزة لطلب عروض الأسعار.',
                'cover_file' => 'apps/web/public/media/families/homepage-covers/knives-family-cover-full.svg',
                'pdf_file' => 'apps/web/public/media/catalogues/pdf/rosa-knives-catalogue.pdf',
            ],
        ];

        $jsonPaths = [
            __DIR__ . '/../../data/canonical-catalogue.json',
            dirname(__DIR__, 4) . '/data/canonical-catalogue.json',
            dirname(__DIR__, 5) . '/wordpress/data/canonical-catalogue.json',
        ];

        $products = [];
        foreach ($jsonPaths as $path) {
            if (file_exists($path)) {
                $decoded = json_decode((string) file_get_contents($path), true);
                if (is_array($decoded) && isset($decoded['products']) && is_array($decoded['products'])) {
                    $products = $decoded['products'];
                    break;
                }
            }
        }

        return [
            'families' => $families,
            'products' => $products,
        ];
    }

    /**
     * Ensure a media file is imported as an attachment idempotently.
     */
    public static function ensureMediaFile(string $relativeSourcePath, string $mediaRoot, ?string $fallbackRelativePath = null): int
    {
        if (! function_exists('get_posts') || ! function_exists('wp_insert_attachment')) {
            return 0;
        }

        // 1. Check if already imported
        $existing = get_posts([
            'post_type' => 'attachment',
            'post_status' => 'inherit',
            'posts_per_page' => 1,
            'meta_query' => [
                [
                    'key' => self::SOURCE_PATH_META,
                    'value' => $relativeSourcePath,
                ],
            ],
            'fields' => 'ids',
        ]);

        if (! empty($existing)) {
            return (int) $existing[0];
        }

        // Try matching fallback path if provided
        if ($fallbackRelativePath !== null) {
            $existingFallback = get_posts([
                'post_type' => 'attachment',
                'post_status' => 'inherit',
                'posts_per_page' => 1,
                'meta_query' => [
                    [
                        'key' => self::SOURCE_PATH_META,
                        'value' => $fallbackRelativePath,
                    ],
                ],
                'fields' => 'ids',
            ]);
            if (! empty($existingFallback)) {
                return (int) $existingFallback[0];
            }
        }

        // 2. Resolve host or container physical path
        $cleanRel = ltrim($relativeSourcePath, '/');
        // If path starts with apps/web/public/media/, strip it relative to mediaRoot
        $mediaSubPath = preg_replace('#^apps/web/public/media/#', '', $cleanRel);
        $mediaSubPath = preg_replace('#^media/#', '', $mediaSubPath);

        $physicalCandidates = [
            rtrim($mediaRoot, '/') . '/' . $mediaSubPath,
            ABSPATH . 'wp-content/themes/rosa-medical-child/' . $cleanRel,
            ABSPATH . '../' . $cleanRel,
        ];

        $sourceFile = '';
        foreach ($physicalCandidates as $candidate) {
            if (file_exists($candidate) && ! is_dir($candidate)) {
                $sourceFile = $candidate;
                break;
            }
        }

        // If not found and fallback exists, check fallback
        if ($sourceFile === '' && $fallbackRelativePath !== null) {
            $cleanFallbackRel = ltrim($fallbackRelativePath, '/');
            $fallbackSubPath = preg_replace('#^apps/web/public/media/#', '', $cleanFallbackRel);
            $fallbackSubPath = preg_replace('#^media/#', '', $fallbackSubPath);

            $fallbackCandidates = [
                rtrim($mediaRoot, '/') . '/' . $fallbackSubPath,
                ABSPATH . 'wp-content/themes/rosa-medical-child/' . $cleanFallbackRel,
                ABSPATH . '../' . $cleanFallbackRel,
            ];

            foreach ($fallbackCandidates as $candidate) {
                if (file_exists($candidate) && ! is_dir($candidate)) {
                    $sourceFile = $candidate;
                    break;
                }
            }
        }

        if ($sourceFile === '' || ! file_exists($sourceFile)) {
            return 0;
        }

        // Copy file to WordPress uploads directory
        $wpUploads = wp_upload_dir();
        $filename = wp_basename($sourceFile);
        $targetFile = $wpUploads['path'] . '/' . wp_unique_filename($wpUploads['path'], $filename);

        if (! copy($sourceFile, $targetFile)) {
            return 0;
        }

        $filetype = wp_check_filetype($filename, null);
        $attachment = [
            'post_mime_type' => $filetype['type'] ?? 'application/octet-stream',
            'post_title' => sanitize_file_name(pathinfo($filename, PATHINFO_FILENAME)),
            'post_content' => '',
            'post_status' => 'inherit',
        ];

        $attachId = wp_insert_attachment($attachment, $targetFile);
        if ($attachId > 0) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
            $attachData = wp_generate_attachment_metadata($attachId, $targetFile);
            wp_update_attachment_metadata($attachId, $attachData);

            update_post_meta($attachId, self::SOURCE_PATH_META, $relativeSourcePath);
            update_post_meta($attachId, self::PREVIEW_PATH_META, $relativeSourcePath);
        }

        return (int) $attachId;
    }

    /**
     * Ensure the 5 canonical families exist, with Arabic meta, covers, and PDFs.
     *
     * @return array<string, int> Mapping of familySlug => term_id
     */
    public static function ensureFamilies(FamilyService $familyService, string $mediaRoot, ?callable $logger = null): array
    {
        $dataset = self::getCanonicalDataset();
        $slugToId = [];

        foreach ($dataset['families'] as $slug => $data) {
            $existing = get_term_by('slug', $slug, 'product_cat');
            $termId = $existing ? (int) $existing->term_id : 0;

            // Import cover image
            $coverId = self::ensureMediaFile($data['cover_file'], $mediaRoot);

            // Import PDF
            $pdfId = self::ensureMediaFile($data['pdf_file'], $mediaRoot);

            $saveData = [
                'id' => $termId,
                'name' => $data['name'],
                'name_ar' => $data['name_ar'],
                'slug' => $slug,
                'order' => (int) $data['order'],
                'visible' => 1,
                'description' => $data['description'] ?? '',
                'description_ar' => $data['description_ar'] ?? '',
                'cover_id' => $coverId,
                'pdf_id' => $pdfId,
            ];

            $result = $familyService->saveFamily($saveData);
            if (is_int($result)) {
                $slugToId[$slug] = $result;
                if ($logger) {
                    $logger("Ensured family '{$data['name']}' (term_id: {$result}, cover: {$coverId}, pdf: {$pdfId})");
                }
            } elseif ($existing) {
                $slugToId[$slug] = (int) $existing->term_id;
            }
        }

        return $slugToId;
    }

    /**
     * Ensure global WooCommerce attribute taxonomies exist.
     */
    public static function ensureAttributeTaxonomies(): void
    {
        if (! function_exists('wc_create_attribute')) {
            return;
        }

        $attributes = [
            'direction' => 'Direction',
            'size' => 'Size',
            'point_style' => 'Point Style',
            'finish' => 'Finish',
            'variant' => 'Variant',
        ];

        foreach ($attributes as $slug => $label) {
            $taxName = wc_attribute_taxonomy_name($slug);
            $attrId = wc_attribute_taxonomy_id_by_name($taxName);
            if (! $attrId) {
                wc_create_attribute([
                    'name' => $label,
                    'slug' => $slug,
                    'type' => 'select',
                    'order_by' => 'menu_order',
                    'has_archives' => false,
                ]);
            }
            if (! taxonomy_exists($taxName)) {
                register_taxonomy($taxName, ['product'], [
                    'hierarchical' => false,
                    'show_ui' => false,
                    'query_var' => true,
                    'rewrite' => false,
                    'public' => false,
                ]);
            }
        }
        delete_transient('wc_attribute_taxonomies');
    }

    /**
     * Seed all products and variations idempotently.
     */
    public static function ensureProducts(array $familyTermIds, string $mediaRoot, ?callable $logger = null): array
    {
        $dataset = self::getCanonicalDataset();
        $products = $dataset['products'];
        $createdCount = 0;
        $updatedCount = 0;

        foreach ($products as $pData) {
            $familySlug = $pData['familySlug'] ?? '';
            $catId = $familyTermIds[$familySlug] ?? 0;
            if ($catId === 0) {
                continue;
            }

            $primaryCode = (string) ($pData['code'] ?? '');
            $productSlug = (string) ($pData['slug'] ?? '');
            $productName = (string) ($pData['name'] ?? '');
            $productDesc = (string) ($pData['description'] ?? '');
            $catalogueCodes = is_array($pData['catalogueCodes'] ?? null) ? $pData['catalogueCodes'] : [];
            $mediaPath = (string) ($pData['mediaPath'] ?? '');
            $mediaFallback = (string) ($pData['mediaFallbackPath'] ?? '');

            // Import featured image
            $featuredImageId = 0;
            if ($mediaFallback !== '' || $mediaPath !== '') {
                $featuredImageId = self::ensureMediaFile($mediaFallback !== '' ? $mediaFallback : $mediaPath, $mediaRoot, $mediaPath);
            }

            // Find existing product by SKU or by post_name
            $existingId = 0;
            if ($primaryCode !== '' && function_exists('wc_get_product_id_by_sku')) {
                $existingId = wc_get_product_id_by_sku($primaryCode);
            }
            if ($existingId === 0) {
                $post = get_page_by_path($productSlug, OBJECT, 'product');
                if ($post) {
                    $existingId = (int) $post->ID;
                }
            }

            $isVariable = count($catalogueCodes) > 1;

            if ($existingId > 0 && function_exists('wc_get_product')) {
                $wcProduct = wc_get_product($existingId);
                $updatedCount++;
            } else {
                $wcProduct = $isVariable ? new \WC_Product_Variable() : new \WC_Product_Simple();
                $createdCount++;
            }

            if (! $wcProduct) {
                continue;
            }

            $wcProduct->set_name($productName);
            $wcProduct->set_slug($productSlug);
            $wcProduct->set_status('publish');
            $wcProduct->set_catalog_visibility('visible');
            $wcProduct->set_category_ids([$catId]);
            $wcProduct->set_description($productDesc);
            $wcProduct->set_short_description("Catalogue code: {$primaryCode}");

            if ($featuredImageId > 0) {
                $wcProduct->set_image_id($featuredImageId);
            }

            if (! $isVariable && $primaryCode !== '') {
                $wcProduct->set_sku($primaryCode);
            }

            $productId = $wcProduct->save();

            // Set custom Rosa meta
            update_post_meta($productId, self::PRODUCT_ID_META, $pData['id'] ?? '');
            update_post_meta($productId, self::PRIMARY_CODE_META, $primaryCode);

            // Handle variations if variable
            if ($isVariable && $wcProduct instanceof \WC_Product_Variable) {
                // Determine attributes (e.g. Size or Code)
                $sizes = array_unique(array_filter(array_column($catalogueCodes, 'size')));
                if (! empty($sizes)) {
                    $sizeAttr = new \WC_Product_Attribute();
                    $sizeAttr->set_name('Size');
                    $sizeAttr->set_options($sizes);
                    $sizeAttr->set_position(0);
                    $sizeAttr->set_visible(true);
                    $sizeAttr->set_variation(true);
                    $wcProduct->set_attributes([$sizeAttr]);
                    $wcProduct->save();
                }

                $childVariationIds = [];
                foreach ($catalogueCodes as $codeEntry) {
                    $vSku = (string) ($codeEntry['code'] ?? '');
                    $vSize = (string) ($codeEntry['size'] ?? '');
                    if ($vSku === '') {
                        continue;
                    }

                    $existingVarId = function_exists('wc_get_product_id_by_sku') ? wc_get_product_id_by_sku($vSku) : 0;
                    if ($existingVarId > 0) {
                        $wcVariation = new \WC_Product_Variation($existingVarId);
                    } else {
                        $wcVariation = new \WC_Product_Variation();
                        $wcVariation->set_parent_id($productId);
                    }

                    $wcVariation->set_status('publish');
                    $wcVariation->set_sku($vSku);
                    if ($vSize !== '') {
                        $wcVariation->set_attributes(['size' => $vSize]);
                    }
                    $wcVariation->set_manage_stock(false);
                    if ($featuredImageId > 0) {
                        $wcVariation->set_image_id($featuredImageId);
                    }
                    $varId = $wcVariation->save();
                    $childVariationIds[] = $varId;
                }

                \WC_Product_Variable::sync($productId);
            }

            if (function_exists('wc_delete_product_transients')) {
                wc_delete_product_transients($productId);
            }
            if (function_exists('clean_post_cache')) {
                clean_post_cache($productId);
            }

            if ($logger && ($createdCount + $updatedCount) % 20 === 0) {
                $logger(sprintf('Processed %d/%d catalogue products...', $createdCount + $updatedCount, count($products)));
            }
        }

        return [
            'created' => $createdCount,
            'updated' => $updatedCount,
            'total' => count($products),
        ];
    }
}
