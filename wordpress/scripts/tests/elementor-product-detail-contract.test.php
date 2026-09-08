<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$plugin = $root . '/wp-content/plugins/rosa-medical-core';
$theme = $root . '/wp-content/themes/rosa-medical-child';

$required = [
    $plugin . '/src/Elementor/ProductTemplate.php',
    $plugin . '/src/Elementor/Widgets/ProductWidgets.php',
    $plugin . '/src/Admin/ProductTemplatePage.php',
    $plugin . '/templates/product-detail-elementor.php',
    $theme . '/assets/js/product-detail.js',
    $theme . '/assets/css/product-detail-live-visual-recovery.css',
];

foreach ($required as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing product Elementor implementation: {$path}\n");
        exit(1);
    }
}

$productTemplate = file_get_contents($plugin . '/src/Elementor/ProductTemplate.php') ?: '';
$widgets = file_get_contents($plugin . '/src/Elementor/Widgets/ProductWidgets.php') ?: '';
$registry = file_get_contents($plugin . '/src/Elementor/WidgetRegistry.php') ?: '';
$admin = file_get_contents($plugin . '/src/Admin/RosaAdmin.php') ?: '';
$renderer = file_get_contents($plugin . '/templates/product-detail-elementor.php') ?: '';
$pluginBoot = file_get_contents($plugin . '/src/Plugin.php') ?: '';
$themeBoot = file_get_contents($theme . '/functions.php') ?: '';
$css = file_get_contents($theme . '/assets/css/product-detail-live-visual-recovery.css') ?: '';

$contracts = [
    [$productTemplate, "'rosa-product-breadcrumb'", 'breadcrumb seed widget'],
    [$productTemplate, "'rosa-product-gallery'", 'gallery seed widget'],
    [$productTemplate, "'rosa-product-summary'", 'summary seed widget'],
    [$productTemplate, "'rosa-product-details'", 'details seed widget'],
    [$productTemplate, "'rosa-product-configurations'", 'configurations seed widget'],
    [$productTemplate, "'rosa-product-support'", 'support seed widget'],
    [$productTemplate, "'rosa-product-related'", 'related seed widget'],
    [$productTemplate, '_rosa_product_template', 'global template identity meta'],
    [$productTemplate, "add_action('init', [self::class, 'maybeEnsureRuntime'], 90)", 'automatic one-time runtime template seed'],
    [$widgets, 'data-rosa-quote-configuration', 'summary exact configuration selector'],
    [$widgets, 'data-variation-id', 'configuration variation identity'],
    [$widgets, 'data-rosa-add-to-quote', 'summary Add to Quote control'],
    [$widgets, 'data-rosa-product-thumb', 'real gallery thumbnail control'],
    [$registry, "Widgets/ProductWidgets.php", 'product widget registry include'],
    [$admin, 'rosa-medical-product-page', 'Product Page admin shortcut'],
    [$renderer, 'ProductTemplate::render', 'Elementor render path'],
    [$renderer, 'product-detail-prototype.php', 'safe fallback renderer'],
    [$pluginBoot, 'product-detail-elementor.php', 'Woo single-product template routing'],
    [$themeBoot, "assets/js/product-detail.js", 'product interaction asset enqueue'],
    [$themeBoot, '_rosa_product_template', 'Elementor template preview asset detection'],
    [$css, '.rosa-product-elementor-hero', 'Elementor hero layout styling'],
    [$css, '[dir="rtl"] .rosa-product-elementor-hero', 'mirrored RTL hero styling'],
];

foreach ($contracts as [$haystack, $needle, $label]) {
    if (! str_contains($haystack, $needle)) {
        fwrite(STDERR, "Missing contract: {$label}\n");
        exit(1);
    }
}

if (str_contains($widgets, 'single_add_to_cart_button') || str_contains($widgets, 'woocommerce-Reviews')) {
    fwrite(STDERR, "Product Elementor widgets must remain quotation-only and review-free\n");
    exit(1);
}

fwrite(STDOUT, "PASS: Elementor Product Detail source contract\n");
