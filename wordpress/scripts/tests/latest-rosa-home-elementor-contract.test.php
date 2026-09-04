<?php
declare(strict_types=1);

$GLOBALS['rosa_test_options'] = [
    'rosa_preview_media' => [
        'home-hero-01-desktop' => 101, 'home-hero-01-mobile' => 102,
        'home-hero-02-desktop' => 103, 'home-hero-02-mobile' => 104,
        'home-hero-03-desktop' => 105, 'home-hero-03-mobile' => 106,
        'home-hero-04-desktop' => 107, 'home-hero-04-mobile' => 108,
        'home-specialty-plastic-surgery' => 109,
        'home-specialty-orthopedics' => 110,
        'home-specialty-maxillofacial' => 111,
        'home-specialty-orthodontics' => 112,
        'home-specialty-spine' => 113,
        'home-securing-confidence' => 114,
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
function rosa_test_widgets(array $document): array
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
if (($root['settings']['css_classes'] ?? '') !== 'rosa-elementor-root public-page public-page--home') {
    fail_test('Home root must carry latest Rosa public-page classes');
}
if (($root['settings']['content_width'] ?? '') !== 'full') fail_test('Home root must remain full width');
if ((int)($root['settings']['gap']['size'] ?? -1) !== 0) fail_test('Home root gap must stay zero');

$widgets = rosa_test_widgets($document);
$actual = array_map(static fn(array $widget): string => (string)($widget['widgetType'] ?? ''), $widgets);
$expected = [
    'rosa-home-hero-carousel',
    'rosa-home-family-discovery',
    'rosa-home-comprehensive',
    'rosa-home-confidence',
    'rosa-home-contact-band',
    'rosa-home-assurance',
    'rosa-home-quotation',
];
if ($actual !== $expected) {
    fail_test('latest Home widget order mismatch: ' . implode(', ', $actual));
}

$hero = $widgets[0]['settings'] ?? [];
foreach (['desktop_1','mobile_1','desktop_2','mobile_2','desktop_3','mobile_3','desktop_4','mobile_4'] as $key) {
    if (! is_array($hero[$key] ?? null) || (int)($hero[$key]['id'] ?? 0) <= 0) {
        fail_test("hero media control missing: {$key}");
    }
}
if (($hero['hero_1_title'] ?? '') !== 'Precision instruments. Procurement made clear.') {
    fail_test('latest hero copy not seeded');
}

$comprehensive = $widgets[2]['settings'] ?? [];
foreach (['lead_image','specialty_1_image','specialty_2_image','specialty_3_image','specialty_4_image'] as $key) {
    if (! is_array($comprehensive[$key] ?? null) || (int)($comprehensive[$key]['id'] ?? 0) <= 0) {
        fail_test("comprehensive media control missing: {$key}");
    }
}

$contact = $widgets[4]['settings'] ?? [];
foreach (['phone','email','whatsapp','whatsapp_href','email_href','contact_phone','contact_email'] as $forbidden) {
    if (array_key_exists($forbidden, $contact)) {
        fail_test("centralized business href leaked into Elementor: {$forbidden}");
    }
}
if (($contact['contact_title'] ?? '') !== 'Get in Touch Now') fail_test('contact-band source copy missing');

$about = ElementorSeedData::build('about', 'en');
$aboutWidgets = rosa_test_widgets($about);
if (count($aboutWidgets) !== 7) fail_test('About widget count changed during Home parity work');
$contactDoc = ElementorSeedData::build('contact', 'en');
$contactWidgets = rosa_test_widgets($contactDoc);
if (count($contactWidgets) !== 3) fail_test('Contact widget count changed during Home parity work');

fwrite(STDOUT, "PASS: latest Rosa Home Elementor topology, media ownership and root contract\n");
