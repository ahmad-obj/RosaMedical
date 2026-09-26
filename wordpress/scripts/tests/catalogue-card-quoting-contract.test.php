<?php

declare(strict_types=1);

namespace RosaMedical\Tests;

function assertTrue(bool $condition, string $message): void {
    if (! $condition) {
        fwrite(STDERR, "Assertion failed: {$message}\n");
        exit(1);
    }
}

$root = dirname(__DIR__, 2);
$cardPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php';
$cssPath = $root . '/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css';

assertTrue(is_file($cardPath), "product-card.php must exist at {$cardPath}");
$cardContent = file_get_contents($cardPath) ?: '';

// Required Card Quoting Controls
assertTrue(str_contains($cardContent, 'data-rosa-quote-item'), 'Card must have data-rosa-quote-item container');
assertTrue(str_contains($cardContent, 'data-rosa-qty-minus'), 'Card must have quantity minus button');
assertTrue(str_contains($cardContent, 'data-rosa-quote-quantity'), 'Card must have quantity input field');
assertTrue(str_contains($cardContent, 'data-rosa-qty-plus'), 'Card must have quantity plus button');
assertTrue(str_contains($cardContent, 'data-rosa-add-to-quote'), 'Card must have data-rosa-add-to-quote button');
assertTrue(str_contains($cardContent, 'data-product-id='), 'Card quote button must have data-product-id');
assertTrue(str_contains($cardContent, 'data-sku='), 'Card quote button must have data-sku');

// Required Card Navigation & Identification
assertTrue(str_contains($cardContent, 'class="rosa-preview-product__media" href='), 'Card must link image to product detail');
assertTrue(str_contains($cardContent, '<h3><a href='), 'Card must link title to product detail');
assertTrue(str_contains($cardContent, 'rosa-preview-product__sku'), 'Card must render SKU/reference code');

// CSS styling contract
assertTrue(is_file($cssPath), "shop-amazon-layout.css must exist at {$cssPath}");
$cssContent = file_get_contents($cssPath) ?: '';
assertTrue(str_contains($cssContent, '.rosa-preview-product__quote-bar'), 'CSS must style quote bar');
assertTrue(str_contains($cssContent, '.rosa-qty-stepper'), 'CSS must style quantity stepper');
assertTrue(str_contains($cssContent, '.rosa-card-quote-btn'), 'CSS must style card quote button');

echo "PASS: catalogue card quoting contract\n";
