<?php
declare(strict_types=1);
$GLOBALS['rosa_test_options'] = [
    'rosa_preview_media' => ['logo' => 12, 'hero' => 34, 'procurement_support' => 56],
];
function get_option(string $name, mixed $default = false): mixed { return $GLOBALS['rosa_test_options'][$name] ?? $default; }
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php';
use RosaMedical\Core\Settings\MediaSettings;
function expectSame(mixed $expected, mixed $actual, string $message): void {
    if ($expected !== $actual) { fwrite(STDERR, "FAIL: {$message}\nExpected: ".var_export($expected,true)."\nActual: ".var_export($actual,true)."\n"); exit(1); }
}

$requiredMedia = [
    'home-hero-01-desktop', 'home-hero-01-mobile',
    'home-hero-02-desktop', 'home-hero-02-mobile',
    'home-hero-03-desktop', 'home-hero-03-mobile',
    'home-hero-04-desktop', 'home-hero-04-mobile',
    'home-specialty-plastic-surgery', 'home-specialty-orthopedics',
    'home-specialty-maxillofacial', 'home-specialty-orthodontics',
    'home-specialty-spine', 'home-securing-confidence',
];
foreach ($requiredMedia as $key) {
    expectSame(true, in_array($key, MediaSettings::allowedKeys(), true), "latest Home media key missing: {$key}");
}

$clean = MediaSettings::mergeSanitize([
    'logo'=>'99',
    'home-hero-01'=>'123',
    'home-hero-01-desktop'=>'201',
    'home-securing-confidence'=>'202',
    'evil_key'=>'777'
]);
expectSame(99, $clean['logo'], 'logo updated');
expectSame(123, $clean['home-hero-01'], 'rollback homepage slot remains accepted');
expectSame(201, $clean['home-hero-01-desktop'], 'latest homepage hero slot updated');
expectSame(202, $clean['home-securing-confidence'], 'latest confidence media slot updated');
expectSame(34, $clean['hero'], 'legacy hero preserved');
expectSame(56, $clean['procurement_support'], 'legacy procurement key preserved');
expectSame(false, array_key_exists('evil_key', $clean), 'unknown submitted key discarded');
expectSame(0, MediaSettings::id('home-specialty-spine'), 'missing allowed latest key resolves to zero');
fwrite(STDOUT, "PASS: MediaSettings latest Home contract\n");
