<?php
declare(strict_types=1);

function __(string $text, string $domain = 'default'): string { return $text; }
function _n(string $single, string $plural, int $number, string $domain = 'default'): string { return $number === 1 ? $single : $plural; }
function apply_filters(string $hook, mixed $value, mixed ...$args): mixed { return $value; }

function expectSame(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true) . "\nActual: " . var_export($actual, true) . "\n");
        exit(1);
    }
}

require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php';

use RosaMedical\Core\Catalogue\ProductPresentation;

expectSame(
    ['kind' => 'request', 'label' => 'Price on request'],
    ProductPresentation::defaultPriceState(),
    'Phase 2A must not invent numeric pricing'
);
expectSame(false, ProductPresentation::defaultInquiryEnabled(), 'inquiry persistence is not enabled in Phase 2A');
expectSame(
    ['type' => 'single-sku', 'label' => '04-0901'],
    ProductPresentation::referenceSummary(['04-0901'], null),
    'single exact configuration should expose its SKU'
);
expectSame(
    ['type' => 'configuration-count', 'label' => '2 configurations'],
    ProductPresentation::referenceSummary(['04-0901', '04-0911'], null),
    'multiple variations should not pretend one variation SKU identifies the product'
);
expectSame(
    ['type' => 'product-reference', 'label' => 'STEVENS-REG', 'count' => 2],
    ProductPresentation::referenceSummary(['04-0901', '04-0911'], 'STEVENS-REG'),
    'authoritative product reference may accompany configuration count'
);

fwrite(STDOUT, "PASS: Phase 2A product presentation contract\n");
