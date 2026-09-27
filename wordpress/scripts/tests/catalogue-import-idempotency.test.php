<?php

declare(strict_types=1);

namespace {
    if (! defined('ABSPATH')) {
        define('ABSPATH', __DIR__ . '/../../');
    }
    if (! defined('ROSA_MEDICAL_CORE_FILE')) {
        define('ROSA_MEDICAL_CORE_FILE', __DIR__ . '/../../wp-content/plugins/rosa-medical-core/rosa-medical-core.php');
    }
}

namespace RosaMedical\Tests {
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/CatalogueImporter.php';

    use RosaMedical\Core\Catalogue\CatalogueImporter;

    $dataset = CatalogueImporter::getCanonicalDataset();
    assert(isset($dataset['families']), 'Dataset must contain families');
    assert(count($dataset['families']) === 5, 'Must contain exactly 5 canonical families');

    $familySlugs = array_keys($dataset['families']);
    sort($familySlugs);
    $expectedSlugs = ['chisels', 'cutters', 'knives', 'punches', 'scissors'];
    sort($expectedSlugs);
    assert($familySlugs === $expectedSlugs, 'Family slugs must match expected 5 families');

    // Verify Scissors details
    $scissors = $dataset['families']['scissors'];
    assert($scissors['name'] === 'Scissors', 'Scissors name must be Scissors');
    assert($scissors['name_ar'] === 'المقصات', 'Scissors Arabic name must be المقصات');
    assert($scissors['order'] === 1, 'Scissors order must be 1');
    assert(str_contains($scissors['pdf_file'], 'rosa-scissors-catalogue.pdf'), 'Scissors PDF must reference the canonical Rosa Scissors PDF');

    // Verify Cutters details
    $cutters = $dataset['families']['cutters'];
    assert($cutters['name'] === 'Cutters', 'Cutters name must be Cutters');
    assert($cutters['name_ar'] === 'القواطع', 'Cutters Arabic name must be القواطع');
    assert($cutters['order'] === 2, 'Cutters order must be 2');

    // Verify Punches details
    $punches = $dataset['families']['punches'];
    assert($punches['order'] === 3, 'Punches order must be 3');

    // Verify Chisels details
    $chisels = $dataset['families']['chisels'];
    assert($chisels['order'] === 4, 'Chisels order must be 4');

    // Verify Knives details
    $knives = $dataset['families']['knives'];
    assert($knives['order'] === 5, 'Knives order must be 5');

    // Verify Products
    assert(isset($dataset['products']) && is_array($dataset['products']), 'Products array must exist');
    assert(count($dataset['products']) === 111, 'Corrected source manifest must contain 111 canonical logical products');

    $slugs = [];
    foreach ($dataset['products'] as $product) {
        assert(! empty($product['name']), 'Product name must not be empty');
        assert(! empty($product['code']), 'Product code must not be empty');
        assert(in_array($product['familySlug'], $expectedSlugs, true), "Product {$product['name']} family must be valid");
        assert(! empty($product['slug']), 'Product slug must not be empty');

        $slug = (string) $product['slug'];
        if (isset($slugs[$slug])) {
            fwrite(STDERR, "FAIL: canonical product slugs must be globally unique; duplicate {$slug}\n");
            exit(1);
        }
        $slugs[$slug] = true;
    }

    // The rendered Scissors catalogue was reviewed after its flattened text
    // incorrectly associated these two references with Iris Scissors. They are
    // owned by the separately verified Stevens foundation fixture instead.
    $misassociatedIrisCodes = ['04-0901', '04-0911'];
    foreach ($dataset['products'] as $product) {
        if (($product['name'] ?? '') !== 'Iris Scissors') {
            continue;
        }

        $productCodes = array_filter([
            (string) ($product['code'] ?? ''),
            ...array_map(
                static fn (array $entry): string => (string) ($entry['code'] ?? ''),
                is_array($product['catalogueCodes'] ?? null) ? $product['catalogueCodes'] : []
            ),
        ]);
        foreach ($misassociatedIrisCodes as $code) {
            if (in_array($code, $productCodes, true)) {
                fwrite(STDERR, "FAIL: {$code} must not be represented as an Iris Scissors reference\n");
                exit(1);
            }
        }
    }

    $duplicateReferenceProducts = array_values(array_filter(
        $dataset['products'],
        static fn (array $product): bool => (string) ($product['code'] ?? '') === '18-0644'
    ));
    if (count($duplicateReferenceProducts) !== 2) {
        fwrite(STDERR, "FAIL: intentional public reference 18-0644 must remain represented by both source-backed products\n");
        exit(1);
    }

    echo "PASS: CatalogueImporter dataset contract\n";
}
