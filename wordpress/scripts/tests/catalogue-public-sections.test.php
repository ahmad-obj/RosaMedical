<?php

declare(strict_types=1);

namespace RosaMedical\Tests;

function assertTrue(bool $condition, string $message): void {
    if (! $condition) {
        throw new \RuntimeException("Assertion failed: " . $message);
    }
}

$shopPageFile = __DIR__ . '/../../wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php';
$content = file_get_contents($shopPageFile) ?: '';

// Must use dynamic families and family sections
assertTrue(str_contains($content, 'rosa-catalogue-family-section'), 'Must contain dynamic family sections');
assertTrue(str_contains($content, 'rosa-catalogue-anchor-nav'), 'Must contain anchor navigation rail');
assertTrue(! str_contains($content, '$familySequence'), 'Must not contain hardcoded filler sequence');

echo "PASS: dynamic catalogue public sections contract\n";
