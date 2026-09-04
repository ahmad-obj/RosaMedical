<?php
declare(strict_types=1);

$GLOBALS['rosa_test_options'] = [
    'rosa_preview_media' => [
        'home-hero-01' => 101,
        'home-who-01' => 102,
        'home-feature-01' => 103,
        'home-promo-01' => 104,
        'home-promo-02' => 105,
        'home-promo-03' => 106,
        'home-promo-04' => 107,
        'home-why-01' => 108,
        'home-evidence-01' => 109,
    ],
];

function get_option(string $name, mixed $default = false): mixed
{
    return $GLOBALS['rosa_test_options'][$name] ?? $default;
}

require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/ContentSettings.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php';

use RosaMedical\Core\Elementor\ElementorSeedData;

function fail_test(string $message): never
{
    fwrite(STDERR, "FAIL: {$message}\n");
    exit(1);
}

/** @return list<array<string,mixed>> */
function home_widgets(array $document): array
{
    $root = $document[0] ?? null;
    if (! is_array($root)) fail_test('Home document root missing');
    $widgets = $root['elements'] ?? null;
    if (! is_array($widgets)) fail_test('Home root elements missing');
    return array_values(array_filter($widgets, 'is_array'));
}

$document = ElementorSeedData::build('home', 'en');
$root = $document[0] ?? null;
if (! is_array($root)) fail_test('Home root missing');
if (($root['settings']['css_classes'] ?? '') !== 'rosa-elementor-root') {
    fail_test('Home root must be layout-neutral and carry only rosa-elementor-root');
}
if (($root['settings']['content_width'] ?? '') !== 'full') fail_test('Home root must remain full width');
if ((int)($root['settings']['gap']['size'] ?? -1) !== 0) fail_test('Home root gap must stay zero');
if ((int)($root['settings']['padding']['top'] ?? -1) !== 0) fail_test('Home root padding must stay zero');

$widgets = home_widgets($document);
$actual = array_map(static fn(array $widget): string => (string)($widget['widgetType'] ?? ''), $widgets);
$expected = [
    'rosa-home-hero',
    'rosa-home-who',
    'rosa-home-featured',
    'rosa-home-feature-banner',
    'rosa-home-latest',
    'rosa-home-promotions',
    'rosa-home-why',
    'rosa-home-proof',
    'rosa-home-evidence',
];
if ($actual !== $expected) {
    fail_test('finished-template Home widget order mismatch: ' . implode(', ', $actual));
}

$expectedMedia = [
    0 => ['image' => 101],
    1 => ['image' => 102],
    3 => ['image' => 103],
    5 => ['image_1' => 104, 'image_2' => 105, 'image_3' => 106, 'image_4' => 107],
    6 => ['image' => 108],
    8 => ['image' => 109],
];
foreach ($expectedMedia as $index => $controls) {
    $settings = $widgets[$index]['settings'] ?? [];
    foreach ($controls as $control => $id) {
        if ((int)($settings[$control]['id'] ?? 0) !== $id) {
            fail_test("target media mapping mismatch at widget {$index} control {$control}");
        }
    }
}

if (($widgets[0]['settings']['hero_title'] ?? '') !== 'Surgical instruments for professional procurement.') {
    fail_test('target hero copy not seeded');
}
if (($widgets[2]['settings']['featured_title'] ?? '') !== 'Featured Products') {
    fail_test('target Featured Products heading not seeded');
}
if (($widgets[4]['settings']['latest_title'] ?? '') !== 'Latest Products') {
    fail_test('target Latest Products heading not seeded');
}

foreach ([2, 4] as $index) {
    foreach (['products', 'product_ids', 'skus', 'items'] as $forbidden) {
        if (array_key_exists($forbidden, $widgets[$index]['settings'] ?? [])) {
            fail_test("WooCommerce product truth leaked into Elementor setting: {$forbidden}");
        }
    }
}

$about = ElementorSeedData::build('about', 'en');
if (count(home_widgets($about)) !== 7) fail_test('About widget count changed during Home conversion');
$contact = ElementorSeedData::build('contact', 'en');
if (count(home_widgets($contact)) !== 3) fail_test('Contact widget count changed during Home conversion');

fwrite(STDOUT, "PASS: finished-template Home Elementor topology, media ownership and root contract\n");
