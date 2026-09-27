<?php

use RosaMedical\Core\Catalogue\CatalogueImporter;

if (! defined('ABSPATH')) {
    fwrite(STDERR, "Run this test through a disposable WordPress WP-CLI runtime.\n");
    exit(2);
}

/** @return never */
function rosa_legacy_repair_fail(string $message): void
{
    fwrite(STDERR, "FAIL: {$message}\n");
    exit(1);
}

$targetIds = get_posts([
    'post_type' => 'product',
    'post_status' => 'any',
    'post_parent' => 0,
    'posts_per_page' => 1,
    'fields' => 'ids',
    'meta_key' => CatalogueImporter::PRODUCT_ID_META,
    'meta_value' => 'product-knives-liston',
]);
if ($targetIds === []) {
    rosa_legacy_repair_fail('The Liston Knife canonical parent must exist before legacy identity repair.');
}
$targetId = (int) $targetIds[0];

$stats = CatalogueImporter::repairKnownLegacyIdentities();
if (($stats['movedVariations'] ?? 0) !== 4) {
    rosa_legacy_repair_fail('The repair must move exactly the four source-verified Liston Knife variations.');
}

foreach (['18-0401', '18-0402', '18-0403', '18-0404'] as $sku) {
    $variation = wc_get_product((int) wc_get_product_id_by_sku($sku));
    if (! $variation instanceof WC_Product_Variation || (int) $variation->get_parent_id() !== $targetId) {
        rosa_legacy_repair_fail("{$sku} must belong to the Liston Knife parent after repair.");
    }
}

echo "PASS: opt-in legacy identity repair moves only verified Liston Knife variations\n";
