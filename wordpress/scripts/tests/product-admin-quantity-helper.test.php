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
$helperPath = $root . '/wp-content/plugins/rosa-medical-core/includes/ProductAdminHelper.php';
$mainPluginPath = $root . '/wp-content/plugins/rosa-medical-core/rosa-medical-core.php';

assertTrue(is_file($helperPath), "ProductAdminHelper.php must exist at {$helperPath}");

$helperCode = file_get_contents($helperPath) ?: '';
$mainPluginCode = file_get_contents($mainPluginPath) ?: '';

assertTrue(str_contains($helperCode, 'class ProductAdminHelper'), 'Must define ProductAdminHelper class');
assertTrue(str_contains($helperCode, '_manage_stock'), 'Must reference _manage_stock to pre-enable quantity field');
assertTrue(str_contains($mainPluginCode, 'ProductAdminHelper'), 'rosa-medical-core.php must reference ProductAdminHelper');

echo "PASS: product admin quantity helper contract\n";
