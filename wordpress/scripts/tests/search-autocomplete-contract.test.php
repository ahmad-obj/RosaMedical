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
$controllerPath = $root . '/wp-content/plugins/rosa-medical-core/includes/SearchAutocompleteController.php';
$jsPath = $root . '/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js';
$cssPath = $root . '/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css';

assertTrue(is_file($controllerPath), "SearchAutocompleteController.php must exist at {$controllerPath}");
$controllerCode = file_get_contents($controllerPath) ?: '';

assertTrue(str_contains($controllerCode, 'class SearchAutocompleteController'), 'Must define SearchAutocompleteController class');
assertTrue(str_contains($controllerCode, 'rosa/v1'), 'Must register rosa/v1 REST namespace');
assertTrue(str_contains($controllerCode, '/search'), 'Must register /search REST endpoint');

$jsCode = file_get_contents($jsPath) ?: '';
assertTrue(str_contains($jsCode, 'rosa-search-autocomplete'), 'JS must implement autocomplete dropdown container');
assertTrue(str_contains($jsCode, 'input#rosa-live-shop-search') || str_contains($jsCode, '#rosa-live-shop-search'), 'JS must bind to search input');
assertTrue(str_contains($jsCode, 'debounce') || str_contains($jsCode, 'setTimeout'), 'JS must debounce search requests');

$cssCode = file_get_contents($cssPath) ?: '';
assertTrue(str_contains($cssCode, '.rosa-search-autocomplete'), 'CSS must style autocomplete dropdown');
assertTrue(str_contains($cssCode, '.rosa-search-autocomplete__item'), 'CSS must style autocomplete items');

echo "PASS: search autocomplete contract\n";
