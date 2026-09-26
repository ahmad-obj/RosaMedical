<?php

if (! defined('ABSPATH')) {
    exit(1);
}

use RosaMedical\Core\Catalogue\CatalogueImporter;
use RosaMedical\Core\Catalogue\FamilyService;

require_once __DIR__ . '/../src/Catalogue/FamilyModel.php';
require_once __DIR__ . '/../src/Catalogue/FamilyService.php';
require_once __DIR__ . '/../src/Catalogue/CatalogueImporter.php';

$mediaRoot = getenv('ROSA_PREVIEW_MEDIA_ROOT');
if (! is_string($mediaRoot) || $mediaRoot === '' || ! is_dir($mediaRoot)) {
    $mediaRoot = is_dir('/rosa-reference-media') ? '/rosa-reference-media' : ABSPATH . '../apps/web/public/media';
}

$logger = static function (string $msg): void {
    if (class_exists('WP_CLI')) {
        WP_CLI::log($msg);
    } else {
        echo $msg . "\n";
    }
};

$logger("=== Starting Rosa Medical Dynamic Catalogue Seed ===");
$logger("Media root: {$mediaRoot}");

// 1. Ensure global attribute taxonomies
CatalogueImporter::ensureAttributeTaxonomies();

// 2. Ensure the 5 canonical families
$familyService = new FamilyService();
$familyMap = CatalogueImporter::ensureFamilies($familyService, $mediaRoot, $logger);
$logger(sprintf("Ensured %d canonical families: %s", count($familyMap), implode(', ', array_keys($familyMap))));

// 3. Ensure products and variations
$stats = CatalogueImporter::ensureProducts($familyMap, $mediaRoot, $logger);

$successMsg = sprintf(
    "Catalogue Seed Complete! Total products: %d (Created: %d, Updated: %d).",
    $stats['total'],
    $stats['created'],
    $stats['updated']
);

if (class_exists('WP_CLI')) {
    WP_CLI::success($successMsg);
} else {
    echo $successMsg . "\n";
}
