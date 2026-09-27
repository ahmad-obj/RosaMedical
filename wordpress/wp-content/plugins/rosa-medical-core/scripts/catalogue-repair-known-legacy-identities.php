<?php

if (! defined('ABSPATH')) {
    exit(1);
}

use RosaMedical\Core\Catalogue\CatalogueImporter;

if (getenv('ROSA_CATALOGUE_CONFIRM_LEGACY_REPAIR') !== 'yes') {
    $message = 'Refusing legacy catalogue relationship repair. Set ROSA_CATALOGUE_CONFIRM_LEGACY_REPAIR=yes after a database backup.';
    if (class_exists('WP_CLI')) {
        WP_CLI::error($message);
    }
    exit(2);
}

require_once __DIR__ . '/../src/Catalogue/CatalogueImporter.php';

$logger = static function (string $message): void {
    if (class_exists('WP_CLI')) {
        WP_CLI::log($message);
    }
};

$stats = CatalogueImporter::repairKnownLegacyIdentities($logger);
$message = sprintf(
    'Known legacy catalogue relationship repair complete: moved %d variation(s), already correct %d.',
    $stats['movedVariations'],
    $stats['skippedVariations']
);
if (class_exists('WP_CLI')) {
    WP_CLI::success($message);
} else {
    echo $message . "\n";
}
