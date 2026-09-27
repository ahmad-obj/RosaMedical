<?php

use RosaMedical\Core\Catalogue\CatalogueImporter;
use RosaMedical\Core\Catalogue\FamilyService;

if (! defined('ABSPATH')) {
    fwrite(STDERR, "Run this test through the disposable local WordPress WP-CLI runtime.\n");
    exit(2);
}

/** @return never */
function rosa_runtime_safety_fail(string $message): void
{
    fwrite(STDERR, "FAIL: {$message}\n");
    exit(1);
}

$dataset = CatalogueImporter::getCanonicalDataset();
$candidate = null;
$product = null;

foreach ($dataset['products'] as $entry) {
    if (count($entry['catalogueCodes'] ?? []) > 1) {
        continue;
    }

    $matches = get_posts([
        'post_type' => 'product',
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'meta_key' => CatalogueImporter::PRODUCT_ID_META,
        'meta_value' => (string) ($entry['id'] ?? ''),
    ]);
    if ($matches === []) {
        continue;
    }

    $candidate = $entry;
    $product = wc_get_product((int) $matches[0]);
    if ($product instanceof WC_Product && ! $product instanceof WC_Product_Variation) {
        break;
    }
    $candidate = null;
    $product = null;
}

if (! is_array($candidate) || ! $product instanceof WC_Product) {
    rosa_runtime_safety_fail('No seeded canonical simple parent product was available for the preservation probe.');
}

$parentId = $product->get_id();
$sentinelName = 'QA client-owned name — must survive routine import';
$sentinelDescription = 'QA client-owned description — must survive routine import.';
$originalCategories = $product->get_category_ids();

$product->set_name($sentinelName);
$product->set_description($sentinelDescription);
$product->set_status('draft');
$product->set_catalog_visibility('hidden');
$product->save();

$mediaRoot = is_dir('/rosa-reference-media') ? '/rosa-reference-media' : ABSPATH . '../apps/web/public/media';
$familyMap = CatalogueImporter::ensureFamilies(new FamilyService(), $mediaRoot);
CatalogueImporter::ensureProducts($familyMap, $mediaRoot);

$after = wc_get_product($parentId);
if (! $after instanceof WC_Product || $after instanceof WC_Product_Variation) {
    rosa_runtime_safety_fail('Routine import must retain the canonical parent product identity.');
}
if ($after->get_name() !== $sentinelName) {
    rosa_runtime_safety_fail('Routine import overwrote a client-managed product name.');
}
if ($after->get_description() !== $sentinelDescription) {
    rosa_runtime_safety_fail('Routine import overwrote a client-managed product description.');
}
if ($after->get_status() !== 'draft' || $after->get_catalog_visibility() !== 'hidden') {
    rosa_runtime_safety_fail('Routine import overwrote client-managed publication settings.');
}
if ($after->get_category_ids() !== $originalCategories) {
    rosa_runtime_safety_fail('Routine import overwrote client-managed family assignment.');
}

echo "PASS: routine catalogue import preserves existing client-managed parent-product fields\n";
