<?php

declare(strict_types=1);

namespace RosaMedical\Tests;

function assertTrue(bool $condition, string $message): void {
    if (! $condition) {
        throw new \RuntimeException("Assertion failed: " . $message);
    }
}

$discoveryFile = __DIR__ . '/../../wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php';
$content = file_get_contents($discoveryFile) ?: '';

assertTrue(str_contains($content, 'FamilyService') || str_contains($content, 'rosa_get_catalogue_families'), 'Must use dynamic family query');
assertTrue(str_contains($content, 'data-family-panel'), 'Must render family panels');
assertTrue(str_contains($content, 'home-family-gallery-shell--scrollable') || str_contains($content, 'home-family-gallery--scrollable'), 'Must support scrollable modifier when families exceed 5');
assertTrue(str_contains($content, 'data-family-gallery-prev') && str_contains($content, 'data-family-gallery-next'), 'Must provide navigation arrows');

$cssFile = __DIR__ . '/../../wp-content/themes/rosa-medical-child/assets/css/home-visual-restoration.css';
$css = file_get_contents($cssFile) ?: '';
assertTrue(str_contains($css, '.home-family-gallery-shell--scrollable') || str_contains($css, '.home-family-gallery--scrollable'), 'CSS must define scrollable family gallery styles');

echo "PASS: dynamic homepage family discovery contract\n";

