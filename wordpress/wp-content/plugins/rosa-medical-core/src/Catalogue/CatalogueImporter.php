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
     * Return the supplier's public catalogue reference for a product.
     *
     * WooCommerce requires a globally unique SKU, while Rosa's supplied
     * catalogues deliberately reuse a small number of references across
     * distinct instruments. The importer stores that source truth separately
     * and every public surface must prefer it over Woo's storage constraint.
     */
    public static function publicReference(\WC_Product $product): string
    {
        $reference = trim((string) get_post_meta($product->get_id(), self::PRIMARY_CODE_META, true));
        return $reference !== '' ? $reference : trim((string) $product->get_sku());
    }

    /**
     * Return canonical dataset definition containing the 5 families and their
     * source-backed logical products.
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
    public static function ensureFamilies(FamilyService $familyService, string $mediaRoot, ?callable $logger = null, bool $syncCanonical = false): array
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

            // Routine imports only establish missing canonical families. Once a
            // family exists, labels, copy, ordering, visibility and selected
            // media are client-managed. Explicit migrations may opt into sync.
            if ($termId > 0 && ! $syncCanonical) {
                $slugToId[$slug] = $termId;
                if ($logger) {
                    $logger("Preserved existing family '{$data['name']}' (term_id: {$termId})");
                }
                continue;
            }

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

            // The primary reference of a variable product belongs to one of its
            // variations. A SKU lookup can therefore return a child variation;
            // stable canonical parent identity is the authoritative lookup.
            $existingId = self::findExistingParentProductId((string) ($pData['id'] ?? ''), $productSlug);

            $isVariable = count($catalogueCodes) > 1;

            $isExisting = $existingId > 0 && function_exists('wc_get_product');
            if ($isExisting) {
                $wcProduct = wc_get_product($existingId);
                $updatedCount++;
            } else {
                $wcProduct = $isVariable ? new \WC_Product_Variable() : new \WC_Product_Simple();
                $createdCount++;
            }

            if (! $wcProduct) {
                continue;
            }

            if (! $isExisting) {
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

                // WooCommerce requires globally unique SKUs. A small number of
                // supplier catalogue references are intentionally shared by
                // distinct instruments, so `_rosa_primary_code` is the public
                // reference authority and `_sku` is used only when unique.
                if (! $isVariable && $primaryCode !== '' && self::canAssignWooSku($primaryCode)) {
                    $wcProduct->set_sku($primaryCode);
                } elseif (! $isVariable && $primaryCode !== '' && $logger) {
                    $logger("Stored shared public reference {$primaryCode} outside Woo SKU for {$productSlug}");
                }
            }

            $productId = $wcProduct->save();

            // Set custom Rosa meta
            update_post_meta($productId, self::PRODUCT_ID_META, $pData['id'] ?? '');
            update_post_meta($productId, self::PRIMARY_CODE_META, $primaryCode);

            // Handle variations if variable
            if ($isVariable && $wcProduct instanceof \WC_Product_Variable) {
                // Determine attributes (e.g. Size or Code)
                $sizes = array_unique(array_filter(array_column($catalogueCodes, 'size')));
                if (! $isExisting && ! empty($sizes)) {
                    $sizeAttr = new \WC_Product_Attribute();
                    $sizeAttr->set_name('Size');
                    $sizeAttr->set_options($sizes);
                    $sizeAttr->set_position(0);
                    $sizeAttr->set_visible(true);
                    $sizeAttr->set_variation(true);
                    $wcProduct->set_attributes([$sizeAttr]);
                    $wcProduct->save();
                }

                foreach ($catalogueCodes as $codeEntry) {
                    $vSku = (string) ($codeEntry['code'] ?? '');
                    $vSize = (string) ($codeEntry['size'] ?? '');
                    if ($vSku === '') {
                        continue;
                    }

                    $existingVarId = function_exists('wc_get_product_id_by_sku') ? (int) wc_get_product_id_by_sku($vSku) : 0;
                    $existingVariation = $existingVarId > 0 ? wc_get_product($existingVarId) : null;
                    if ($existingVariation instanceof \WC_Product_Variation) {
                        if ((int) $existingVariation->get_parent_id() !== $productId && $logger) {
                            $logger("Skipped variation {$vSku}: already belongs to parent " . $existingVariation->get_parent_id());
                        }
                        // Existing variation fields are client-managed. Do not
                        // overwrite them, and never move a child across parents.
                        continue;
                    }

                    $wcVariation = new \WC_Product_Variation();
                    $wcVariation->set_parent_id($productId);

                    $wcVariation->set_status('publish');
                    $wcVariation->set_sku($vSku);
                    if ($vSize !== '') {
                        $wcVariation->set_attributes(['size' => $vSize]);
                    }
                    $wcVariation->set_manage_stock(false);
                    if ($featuredImageId > 0) {
                        $wcVariation->set_image_id($featuredImageId);
                    }
                    $wcVariation->save();
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

    /**
     * Repair one pre-dynamic-catalogue relationship that was verified against
     * the supplied source: the Liston Knife references were attached to the
     * similarly named Liston Cutter parent. This is intentionally opt-in and
     * only moves variations when both canonical parent identities match.
     *
     * @return array{movedVariations: int, skippedVariations: int}
     */
    public static function repairKnownLegacyIdentities(?callable $logger = null): array
    {
        if (! function_exists('get_posts') || ! function_exists('wc_get_product') || ! function_exists('wc_get_product_id_by_sku')) {
            return ['movedVariations' => 0, 'skippedVariations' => 4];
        }

        $targetCanonicalId = 'product-knives-liston';
        $legacyCanonicalId = 'product-cutters-liston-straight';
        $skus = ['18-0401', '18-0402', '18-0403', '18-0404'];
        $targetMatches = get_posts([
            'post_type' => 'product',
            'post_status' => 'any',
            'post_parent' => 0,
            'posts_per_page' => 2,
            'fields' => 'ids',
            'meta_key' => self::PRODUCT_ID_META,
            'meta_value' => $targetCanonicalId,
        ]);

        if (count($targetMatches) !== 1) {
            throw new \RuntimeException('Known legacy repair requires exactly one Liston Knife canonical parent.');
        }

        $targetId = (int) $targetMatches[0];
        $target = wc_get_product($targetId);
        if (! $target instanceof \WC_Product_Variable) {
            throw new \RuntimeException('Known legacy repair target must be a variable Liston Knife product.');
        }

        $moved = 0;
        $skipped = 0;
        $legacyParents = [];
        foreach ($skus as $sku) {
            $variationId = (int) wc_get_product_id_by_sku($sku);
            $variation = $variationId > 0 ? wc_get_product($variationId) : null;
            if (! $variation instanceof \WC_Product_Variation) {
                throw new \RuntimeException("Known legacy repair expected variation {$sku}.");
            }

            $currentParentId = (int) $variation->get_parent_id();
            if ($currentParentId === $targetId) {
                $skipped++;
                continue;
            }

            $currentCanonicalId = (string) get_post_meta($currentParentId, self::PRODUCT_ID_META, true);
            if ($currentCanonicalId !== $legacyCanonicalId) {
                throw new \RuntimeException("Known legacy repair refused {$sku}: unexpected current parent identity.");
            }

            $variation->set_parent_id($targetId);
            $variation->save();
            $legacyParents[$currentParentId] = true;
            $moved++;
            if ($logger) {
                $logger("Moved verified Liston Knife variation {$sku} to product {$targetId}");
            }
        }

        \WC_Product_Variable::sync($targetId);
        wc_delete_product_transients($targetId);
        foreach (array_keys($legacyParents) as $legacyParentId) {
            \WC_Product_Variable::sync((int) $legacyParentId);
            wc_delete_product_transients((int) $legacyParentId);
        }

        return ['movedVariations' => $moved, 'skippedVariations' => $skipped];
    }

    /**
     * Find only a top-level WooCommerce product. A product variation is never
     * a valid canonical parent identity.
     */
    private static function findExistingParentProductId(string $canonicalId, string $slug): int
    {
        if ($canonicalId !== '' && function_exists('get_posts')) {
            $matches = get_posts([
                'post_type' => 'product',
                'post_status' => 'any',
                'post_parent' => 0,
                'posts_per_page' => 1,
                'fields' => 'ids',
                'meta_key' => self::PRODUCT_ID_META,
                'meta_value' => $canonicalId,
            ]);
            if (is_array($matches) && isset($matches[0])) {
                return (int) $matches[0];
            }
        }

        if ($slug !== '' && function_exists('get_page_by_path')) {
            $post = get_page_by_path($slug, OBJECT, 'product');
            if ($post && (int) ($post->post_parent ?? 0) === 0) {
                return (int) $post->ID;
            }
        }

        return 0;
    }

    /**
     * WooCommerce enforces global SKU uniqueness, while Rosa's source material
     * can legitimately reuse a public catalogue reference for distinct products.
     */
    private static function canAssignWooSku(string $sku): bool
    {
        if ($sku === '' || ! function_exists('wc_get_product_id_by_sku')) {
            return false;
        }

        return (int) wc_get_product_id_by_sku($sku) === 0;
    }
}
