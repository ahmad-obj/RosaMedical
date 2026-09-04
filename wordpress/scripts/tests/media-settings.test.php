<?php
declare(strict_types=1);
$GLOBALS['rosa_test_options'] = [
    'rosa_preview_media' => [
        'logo' => 12,
        'home-hero-01' => 34,
        'home-who-01' => 35,
        'home-feature-01' => 36,
        'home-promo-01' => 37,
        'home-why-01' => 38,
        'home-evidence-01' => 39,
        'hero' => 40,
        'procurement_support' => 56,
        'home-hero-01-desktop' => 70,
    ],
];
function get_option(string $name, mixed $default = false): mixed { return $GLOBALS['rosa_test_options'][$name] ?? $default; }
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php';
use RosaMedical\Core\Settings\MediaSettings;
function expectSame(mixed $expected, mixed $actual, string $message): void {
    if ($expected !== $actual) { fwrite(STDERR, "FAIL: {$message}\nExpected: ".var_export($expected,true)."\nActual: ".var_export($actual,true)."\n"); exit(1); }
}

$targetHome = [
    'home-hero-01', 'home-who-01', 'home-feature-01',
    'home-promo-01', 'home-promo-02', 'home-promo-03', 'home-promo-04',
    'home-why-01', 'home-evidence-01', 'prefooter-person-01',
];
foreach ($targetHome as $key) {
    expectSame(true, in_array($key, MediaSettings::allowedKeys(), true), "finished-template Home media key missing: {$key}");
}

// Superseded latest-custom keys remain accepted so existing stored media is not destroyed.
foreach (['home-hero-01-desktop', 'home-specialty-spine', 'catalogue-pdf-scissors'] as $key) {
    expectSame(true, in_array($key, MediaSettings::allowedKeys(), true), "retired media key must remain tolerated: {$key}");
}

$clean = MediaSettings::mergeSanitize([
    'logo'=>'99',
    'home-hero-01'=>'123',
    'home-promo-04'=>'124',
    'home-hero-01-desktop'=>'201',
    'evil_key'=>'777'
]);
expectSame(99, $clean['logo'], 'logo updated');
expectSame(123, $clean['home-hero-01'], 'target homepage hero slot updated');
expectSame(124, $clean['home-promo-04'], 'target homepage promo slot updated');
expectSame(201, $clean['home-hero-01-desktop'], 'retired latest-custom slot remains accepted');
expectSame(35, $clean['home-who-01'], 'existing target media survives partial updates');
expectSame(56, $clean['procurement_support'], 'legacy unknown stored media survives partial updates');
expectSame(false, array_key_exists('evil_key', $clean), 'unknown submitted key discarded');
expectSame(34, MediaSettings::id('home-hero-01'), 'target Home media resolves from option');
expectSame(0, MediaSettings::id('home-promo-02'), 'missing allowed target key resolves to zero');
fwrite(STDOUT, "PASS: MediaSettings finished-template Home contract\n");
