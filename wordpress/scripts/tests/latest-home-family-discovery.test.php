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

assertTrue(! str_contains($content, "['slug' => 'scissors', 'name' =>"), 'Must not hardcode families array');
assertTrue(str_contains($content, 'FamilyService') || str_contains($content, 'rosa_get_catalogue_families'), 'Must use dynamic family query');

echo "PASS: dynamic homepage family discovery contract\n";
