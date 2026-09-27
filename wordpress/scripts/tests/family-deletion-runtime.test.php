<?php

use RosaMedical\Core\Admin\FamilyEditorPage;
use RosaMedical\Core\Catalogue\FamilyService;

if (! defined('ABSPATH')) {
    fwrite(STDERR, "Run this test through the disposable local WordPress WP-CLI runtime.\n");
    exit(2);
}

function rosa_family_deletion_runtime_fail(string $message): void
{
    throw new RuntimeException($message);
}

/** @return int */
function rosa_family_deletion_runtime_family(string $slug): int
{
    $existing = get_term_by('slug', $slug, FamilyService::TAXONOMY);
    if ($existing instanceof WP_Term) {
        if (get_term_meta($existing->term_id, '_rosa_finalization_qa', true) !== '1') {
            rosa_family_deletion_runtime_fail("Refusing to reuse an unmarked term: {$slug}");
        }
        wp_delete_term($existing->term_id, FamilyService::TAXONOMY);
    }

    $created = wp_insert_term('QA ' . $slug, FamilyService::TAXONOMY, ['slug' => $slug]);
    if (is_wp_error($created) || ! is_array($created)) {
        rosa_family_deletion_runtime_fail("Could not create marked QA family: {$slug}");
    }
    $id = (int) $created['term_id'];
    update_term_meta($id, '_rosa_finalization_qa', '1');
    return $id;
}

/** @return int */
function rosa_family_deletion_runtime_product(string $sku, int $familyId): int
{
    $existing = wc_get_product_id_by_sku($sku);
    if ($existing > 0) {
        rosa_family_deletion_runtime_fail("Refusing to reuse an existing product SKU: {$sku}");
    }

    $product = new WC_Product_Simple();
    $product->set_name('QA Family deletion product ' . $sku);
    $product->set_sku($sku);
    $product->set_status('draft');
    $product->set_category_ids([$familyId]);
    return $product->save();
}

function rosa_family_deletion_runtime_clean_product(int $productId): void
{
    if ($productId > 0) {
        wp_delete_post($productId, true);
    }
}

$suffix = 'rosa-finalization-qa-' . substr(md5((string) microtime(true)), 0, 10);
$sourceA = $suffix . '-leave';
$sourceB = $suffix . '-reassign';
$target = $suffix . '-target';
$productA = 0;
$productB = 0;
$sourceAId = 0;
$sourceBId = 0;
$targetId = 0;

$failure = null;
try {
    $service = new FamilyService();
    $sourceAId = rosa_family_deletion_runtime_family($sourceA);
    $targetId = rosa_family_deletion_runtime_family($target);
    $productA = rosa_family_deletion_runtime_product('QA-DEL-A-' . substr($suffix, -6), $sourceAId);

    $resolvedLeave = FamilyEditorPage::resolveReassignmentId('none', $targetId, $sourceAId);
    if ($resolvedLeave !== 0 || ! $service->deleteFamily($sourceAId, $resolvedLeave)) {
        rosa_family_deletion_runtime_fail('Leave-unassigned deletion did not complete successfully.');
    }
    $afterLeave = wc_get_product($productA);
    if (! $afterLeave instanceof WC_Product || in_array($targetId, $afterLeave->get_category_ids(), true)) {
        rosa_family_deletion_runtime_fail('Leave-unassigned deletion silently reassigned a product.');
    }
    if (get_term($sourceAId, FamilyService::TAXONOMY) instanceof WP_Term) {
        rosa_family_deletion_runtime_fail('Leave-unassigned source family was not deleted.');
    }

    $sourceBId = rosa_family_deletion_runtime_family($sourceB);
    $productB = rosa_family_deletion_runtime_product('QA-DEL-B-' . substr($suffix, -6), $sourceBId);
    $resolvedReassign = FamilyEditorPage::resolveReassignmentId('reassign', $targetId, $sourceBId);
    if ($resolvedReassign !== $targetId || ! $service->deleteFamily($sourceBId, $resolvedReassign)) {
        rosa_family_deletion_runtime_fail('Reassign deletion did not complete successfully.');
    }
    // Term assignment invalidates the persisted object relation; reload from
    // Woo after clearing this request's product cache before asserting it.
    clean_post_cache($productB);
    $afterReassign = wc_get_product($productB);
    if (! $afterReassign instanceof WC_Product || ! in_array($targetId, $afterReassign->get_category_ids(), true)) {
        rosa_family_deletion_runtime_fail('Reassign deletion did not assign the product to the selected target family.');
    }
    if (in_array($sourceBId, $afterReassign->get_category_ids(), true)) {
        rosa_family_deletion_runtime_fail('Reassign deletion left the deleted family on the product.');
    }
    if (get_term($sourceBId, FamilyService::TAXONOMY) instanceof WP_Term) {
        rosa_family_deletion_runtime_fail('Reassign source family was not deleted.');
    }

} catch (Throwable $error) {
    $failure = $error;
} finally {
    rosa_family_deletion_runtime_clean_product($productA);
    rosa_family_deletion_runtime_clean_product($productB);
    foreach ([$sourceAId, $sourceBId, $targetId] as $termId) {
        if ($termId > 0 && get_term_meta($termId, '_rosa_finalization_qa', true) === '1') {
            wp_delete_term($termId, FamilyService::TAXONOMY);
        }
    }
}

if ($failure instanceof Throwable) {
    fwrite(STDERR, "FAIL: {$failure->getMessage()}\n");
    exit(1);
}

echo "PASS: family deletion honors leave-unassigned and explicit reassignment at Woo runtime\n";
