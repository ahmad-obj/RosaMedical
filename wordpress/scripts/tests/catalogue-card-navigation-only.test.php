<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$theme = $root . '/wp-content/themes/rosa-medical-child';
$plugin = $root . '/wp-content/plugins/rosa-medical-core';

$cardPath = $theme . '/template-parts/client-preview/product-card.php';
$quoteCssPath = $theme . '/assets/css/quote-selection.css';
$productWidgetsPath = $plugin . '/src/Elementor/Widgets/ProductWidgets.php';

foreach ([$cardPath, $quoteCssPath, $productWidgetsPath] as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing catalogue/detail quote contract dependency: {$path}\n");
        exit(1);
    }
}

$card = file_get_contents($cardPath) ?: '';
$quoteCss = file_get_contents($quoteCssPath) ?: '';
$productWidgets = file_get_contents($productWidgetsPath) ?: '';

foreach ([
    'class="rosa-preview-product__media" href=',
    '<h3><a href=',
    'class="rosa-preview-product__action" href=',
] as $needle) {
    if (! str_contains($card, $needle)) {
        fwrite(STDERR, "Catalogue card navigation contract missing: {$needle}\n");
        exit(1);
    }
}

foreach ([
    'rosa-preview-product__quote',
    'data-rosa-quote-item',
    'data-rosa-quote-configuration',
    'data-rosa-quote-quantity',
    'data-rosa-add-to-quote',
] as $forbidden) {
    if (str_contains($card, $forbidden)) {
        fwrite(STDERR, "Catalogue cards must be navigation-only; found forbidden quote control: {$forbidden}\n");
        exit(1);
    }
}

if (str_contains($quoteCss, '.rosa-preview-product__quote')) {
    fwrite(STDERR, "Catalogue-card quote layout CSS must be removed after quote controls leave listing cards\n");
    exit(1);
}

foreach ([
    '.rosa-preview-product {',
    'align-self: start;',
    '.rosa-preview-product__body {',
    'min-height: 0;',
] as $needle) {
    if (! str_contains($quoteCss, $needle)) {
        fwrite(STDERR, "Compact catalogue-card CSS contract missing: {$needle}\n");
        exit(1);
    }
}

foreach ([
    'data-rosa-quote-configuration',
    'data-rosa-quote-quantity',
    'data-rosa-add-to-quote',
] as $needle) {
    if (! str_contains($productWidgets, $needle)) {
        fwrite(STDERR, "Product Detail must retain quotation control: {$needle}\n");
        exit(1);
    }
}

fwrite(STDOUT, "PASS: catalogue cards navigate to Product Detail only while Product Detail retains quote controls\n");
