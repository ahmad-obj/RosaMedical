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
$shopPagePath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php';
$functionsPath = $root . '/wp-content/themes/rosa-medical-child/functions.php';
$cssPath = $root . '/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css';
$jsPath = $root . '/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js';

assertTrue(is_file($shopPagePath), "shop-page.php must exist at {$shopPagePath}");
$shopPage = file_get_contents($shopPagePath) ?: '';

// Amazon-style layout structure
assertTrue(str_contains($shopPage, 'rosa-shop-container'), 'Must render rosa-shop-container');
assertTrue(str_contains($shopPage, 'rosa-shop-sidebar'), 'Must render rosa-shop-sidebar');
assertTrue(str_contains($shopPage, 'rosa-shop-main'), 'Must render rosa-shop-main');
assertTrue(str_contains($shopPage, 'rosa-shop-products-grid'), 'Must render rosa-shop-products-grid');

// Faceted Filters
assertTrue(str_contains($shopPage, 'data-filter-group="family"'), 'Must have family filter group');
assertTrue(str_contains($shopPage, 'data-filter-group="profile"'), 'Must have profile/curvature filter group');
assertTrue(str_contains($shopPage, 'data-filter-group="grade"'), 'Must have grade/feature filter group');
assertTrue(str_contains($shopPage, 'data-filter-group="length"'), 'Must have length/size filter group');
assertTrue(str_contains($shopPage, 'rosa-active-filters'), 'Must render active filters chips container');
assertTrue(str_contains($shopPage, 'rosa-shop-filter-toggle'), 'Must render mobile filter toggle');

// Asset Enqueues in functions.php
$functions = file_get_contents($functionsPath) ?: '';
assertTrue(str_contains($functions, 'shop-amazon-layout.css'), 'functions.php must enqueue shop-amazon-layout.css');
assertTrue(str_contains($functions, 'shop-filters-autocomplete.js'), 'functions.php must enqueue shop-filters-autocomplete.js');

// CSS Styles
$css = file_get_contents($cssPath) ?: '';
assertTrue(str_contains($css, '.rosa-shop-container'), 'CSS must define .rosa-shop-container');
assertTrue(str_contains($css, '.rosa-shop-sidebar'), 'CSS must define .rosa-shop-sidebar');
assertTrue(str_contains($css, '.rosa-shop-products-grid'), 'CSS must define .rosa-shop-products-grid');
assertTrue(str_contains($css, '[dir="rtl"] .rosa-shop-container'), 'CSS must support RTL for shop container');

// JS Filtering Engine
$js = file_get_contents($jsPath) ?: '';
assertTrue(str_contains($js, 'data-filter-group'), 'JS must handle faceted data-filter-group');
assertTrue(str_contains($js, 'updateFilterCounts') || str_contains($js, 'filterProducts'), 'JS must implement filtering engine');

echo "PASS: shop amazon layout contract\n";
