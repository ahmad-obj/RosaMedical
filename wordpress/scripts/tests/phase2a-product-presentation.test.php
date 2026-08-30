<?php
declare(strict_types=1);

function __(string $text, string $domain = 'default'): string { return $text; }
function _n(string $single, string $plural, int $number, string $domain = 'default'): string { return $number === 1 ? $single : $plural; }
function apply_filters(string $hook, mixed $value, mixed ...$args): mixed { return $value; }

$GLOBALS['rosa_test_attachment_mime'] = [];
$GLOBALS['rosa_test_attachment_url'] = [];
$GLOBALS['rosa_test_attachment_title'] = [];
function get_post_mime_type(int $id): string|false { return $GLOBALS['rosa_test_attachment_mime'][$id] ?? false; }
function wp_get_attachment_url(int $id): string|false { return $GLOBALS['rosa_test_attachment_url'][$id] ?? false; }
function get_the_title(int $id): string { return $GLOBALS['rosa_test_attachment_title'][$id] ?? ''; }

function expectSame(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true) . "\nActual: " . var_export($actual, true) . "\n");
        exit(1);
    }
}

require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php';

use RosaMedical\Core\Catalogue\ProductPresentation;
use RosaMedical\Core\Catalogue\FamilyCatalogue;

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
expectSame(null, FamilyCatalogue::fromAttachmentId(0), 'missing attachment must not create a broken catalogue link');
$GLOBALS['rosa_test_attachment_mime'][42] = 'application/pdf';
$GLOBALS['rosa_test_attachment_url'][42] = 'https://example.test/scissors.pdf';
$GLOBALS['rosa_test_attachment_title'][42] = 'Scissors Catalogue';
expectSame(
    ['attachment_id' => 42, 'url' => 'https://example.test/scissors.pdf', 'title' => 'Scissors Catalogue'],
    FamilyCatalogue::fromAttachmentId(42),
    'valid PDF attachment must become the authoritative catalogue reference'
);
$GLOBALS['rosa_test_attachment_mime'][43] = 'image/jpeg';
$GLOBALS['rosa_test_attachment_url'][43] = 'https://example.test/not-a-pdf.jpg';
expectSame(null, FamilyCatalogue::fromAttachmentId(43), 'non-PDF attachment must be rejected');

fwrite(STDOUT, "PASS: Phase 2A product presentation contract\n");
