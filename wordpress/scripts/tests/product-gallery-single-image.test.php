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
$widgetPath = $root . '/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductWidgets.php';
$protoPath = $root . '/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php';

assertTrue(is_file($widgetPath), "ProductWidgets.php must exist at {$widgetPath}");
assertTrue(is_file($protoPath), "product-detail-prototype.php must exist at {$protoPath}");

$widgetContent = file_get_contents($widgetPath) ?: '';
$protoContent = file_get_contents($protoPath) ?: '';

// Forbidden patterns that cause empty placeholder thumbnails:
assertTrue(! str_contains($widgetContent, 'max(4, count($ids))'), 'ProductWidgets must not force 4 thumbnail slots using max(4, count($ids))');
assertTrue(! str_contains($widgetContent, 'min(4, $thumbCount)'), 'ProductWidgets must not use min(4, $thumbCount)');
assertTrue(! str_contains($protoContent, '$thumbnailIndex < 4'), 'product-detail-prototype must not hardcode 4 thumbnail slots');

// Required patterns: must only render thumbnail strip when > 1 image exists, and iterate over actual valid images
assertTrue(str_contains($widgetContent, 'count($ids) > 1'), 'ProductWidgets must check count($ids) > 1 before rendering thumbnails');
assertTrue(str_contains($protoContent, 'count($imageIds) > 1'), 'product-detail-prototype must check count($imageIds) > 1 before rendering thumbnails');

echo "PASS: product gallery single image contract\n";
