<?php

use RosaMedical\Core\Catalogue\CatalogueImporter;
use RosaMedical\Core\Catalogue\FamilyService;

if (! defined('ABSPATH')) {
    fwrite(STDERR, "Run this test through the disposable local WordPress WP-CLI runtime.\n");
    exit(2);
}

/** @return never */
function rosa_reference_runtime_fail(string $message): void
{
    fwrite(STDERR, "FAIL: {$message}\n");
    exit(1);
}

$mediaRoot = is_dir('/rosa-reference-media') ? '/rosa-reference-media' : ABSPATH . '../apps/web/public/media';
$familyMap = CatalogueImporter::ensureFamilies(new FamilyService(), $mediaRoot);
CatalogueImporter::ensureProducts($familyMap, $mediaRoot);

$reference = '18-0644';
$productIds = get_posts([
    'post_type' => 'product',
    'post_status' => 'publish',
    'post_parent' => 0,
    'posts_per_page' => -1,
    'fields' => 'ids',
    'meta_key' => CatalogueImporter::PRIMARY_CODE_META,
    'meta_value' => $reference,
]);

if (count($productIds) !== 2) {
    rosa_reference_runtime_fail('The intentional duplicate public reference must create two distinct published parent products.');
}

$quoteRows = array_values(array_filter(
    rosa_quote_request_catalog_payload(),
    static fn (array $row): bool => ($row['sku'] ?? '') === $reference
));
if (count($quoteRows) !== 2) {
    rosa_reference_runtime_fail('Both products with the shared public reference must be quotable.');
}

foreach ($quoteRows as $row) {
    $product = wc_get_product((int) $row['productId']);
    if (! $product instanceof WC_Product || CatalogueImporter::publicReference($product) !== $reference) {
        rosa_reference_runtime_fail('All public catalogue surfaces must resolve the selected product\'s primary reference before falling back to Woo SKU.');
    }

    $canonical = rosa_quote_submission_canonical_item([
        'productId' => (int) $row['productId'],
        'variationId' => 0,
        'sku' => $reference,
        'quantity' => 2,
    ]);
    if (! is_array($canonical) || ($canonical['sku'] ?? '') !== $reference) {
        rosa_reference_runtime_fail('Quotation canonicalization must validate the public reference against the selected product, not against a globally unique Woo SKU.');
    }
}

echo "PASS: duplicate public catalogue reference remains distinct, searchable and quotable\n";
