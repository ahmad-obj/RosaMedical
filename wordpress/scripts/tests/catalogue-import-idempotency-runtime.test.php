<?php

use RosaMedical\Core\Catalogue\CatalogueImporter;
use RosaMedical\Core\Catalogue\FamilyService;

if (! defined('ABSPATH')) {
    fwrite(STDERR, "Run this test through an isolated WordPress WP-CLI runtime.\n");
    exit(2);
}

/** @return never */
function rosa_idempotency_runtime_fail(string $message): void
{
    fwrite(STDERR, "FAIL: {$message}\n");
    exit(1);
}

/** @return array<string, mixed> */
function rosa_idempotency_snapshot(): array
{
    $parents = get_posts([
        'post_type' => 'product',
        'post_status' => 'any',
        'post_parent' => 0,
        'posts_per_page' => -1,
        'fields' => 'ids',
        'meta_key' => CatalogueImporter::PRODUCT_ID_META,
    ]);

    $parentIds = array_map('intval', $parents);
    sort($parentIds);
    $canonicalParentIds = [];
    $variationIds = [];
    foreach ($parentIds as $parentId) {
        $canonicalId = (string) get_post_meta($parentId, CatalogueImporter::PRODUCT_ID_META, true);
        if ($canonicalId === '') {
            continue;
        }
        $canonicalParentIds[$canonicalId] = $parentId;
        $product = wc_get_product($parentId);
        if (! $product instanceof WC_Product || $product instanceof WC_Product_Variation) {
            rosa_idempotency_runtime_fail("Canonical product {$canonicalId} is not a top-level Woo product.");
        }
        foreach ($product->get_children() as $variationId) {
            $variationIds[] = (int) $variationId;
        }
    }
    ksort($canonicalParentIds);
    sort($variationIds);

    $attachmentIds = get_posts([
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'posts_per_page' => -1,
        'fields' => 'ids',
        'meta_key' => CatalogueImporter::SOURCE_PATH_META,
    ]);
    $attachmentIds = array_map('intval', $attachmentIds);
    sort($attachmentIds);

    $families = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
        'fields' => 'ids',
        'slug' => ['scissors', 'cutters', 'punches', 'chisels', 'knives'],
    ]);
    $families = is_array($families) ? array_map('intval', $families) : [];
    sort($families);

    return [
        'families' => $families,
        'canonicalParents' => $canonicalParentIds,
        'variationIds' => $variationIds,
        'attachmentIds' => $attachmentIds,
    ];
}

$mediaRoot = is_dir('/rosa-reference-media') ? '/rosa-reference-media' : ABSPATH . '../apps/web/public/media';
$families = CatalogueImporter::ensureFamilies(new FamilyService(), $mediaRoot);
CatalogueImporter::ensureProducts($families, $mediaRoot);
$first = rosa_idempotency_snapshot();

$families = CatalogueImporter::ensureFamilies(new FamilyService(), $mediaRoot);
CatalogueImporter::ensureProducts($families, $mediaRoot);
$second = rosa_idempotency_snapshot();

if ($first !== $second) {
    rosa_idempotency_runtime_fail('Second import changed canonical family, parent-product, variation or attachment identities.');
}
if (count($first['families']) !== 5) {
    rosa_idempotency_runtime_fail('Exactly five canonical families must exist after the import.');
}
if (count($first['canonicalParents']) !== 111) {
    rosa_idempotency_runtime_fail('The corrected source manifest must seed exactly 111 canonical parent products.');
}

echo "PASS: clean catalogue import is runtime-idempotent for families, parents, variations and attachments\n";
