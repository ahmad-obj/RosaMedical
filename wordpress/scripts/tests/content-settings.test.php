<?php
declare(strict_types=1);

$GLOBALS['rosa_test_options'] = [];

function get_option(string $name, mixed $default = false): mixed
{
    return $GLOBALS['rosa_test_options'][$name] ?? $default;
}

function update_option(string $name, mixed $value): bool
{
    $GLOBALS['rosa_test_options'][$name] = $value;
    return true;
}

function sanitize_text_field(string $value): string
{
    return trim(strip_tags($value));
}

function sanitize_textarea_field(string $value): string
{
    return trim(strip_tags($value));
}

require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/ContentSettings.php';

use RosaMedical\Core\Settings\ContentSettings;

function expectSame(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true) . "\nActual: " . var_export($actual, true) . "\n");
        exit(1);
    }
}

expectSame('Surgical instruments for professional procurement.', ContentSettings::get('home', 'hero_title', 'en'), 'target Home hero title missing');
expectSame('أدوات جراحية مخصصة لاحتياجات التوريد المهني.', ContentSettings::get('home', 'hero_title', 'ar'), 'target Arabic Home hero title missing');
expectSame('Expect more than an instrument catalogue.', ContentSettings::get('home', 'who_title', 'en'), 'target Home who title missing');
expectSame('Featured Products', ContentSettings::get('home', 'featured_title', 'en'), 'target Home featured title missing');
expectSame('Latest Products', ContentSettings::get('home', 'latest_title', 'en'), 'target Home latest title missing');
expectSame('From catalogue reference to a clear quotation request.', ContentSettings::get('home', 'feature_title', 'en'), 'target Home feature title missing');
expectSame('Surgical knives', ContentSettings::get('home', 'promo_1_title', 'en'), 'target Home promo copy missing');
expectSame('Support built around instrument procurement', ContentSettings::get('home', 'why_title', 'en'), 'target Home why title missing');
expectSame('Catalogues', ContentSettings::get('home', 'proof_6', 'en'), 'target Home proof labels missing');
expectSame('Turn an instrument need into a clear procurement request.', ContentSettings::get('home', 'evidence_title', 'en'), 'target Home evidence title missing');

$GLOBALS['rosa_test_options']['rosa_home_content'] = [
    'en' => [
        'hero_title' => 'Changed safely',
        'family_title' => 'Preserved superseded range title',
    ],
    'ar' => [],
];
expectSame('Changed safely', ContentSettings::get('home', 'hero_title', 'en'), 'stored English value must win');
expectSame('أدوات جراحية مخصصة لاحتياجات التوريد المهني.', ContentSettings::get('home', 'hero_title', 'ar'), 'missing Arabic value must retain target Arabic default');
expectSame('fallback', ContentSettings::get('home', 'not_allowed', 'en', 'fallback'), 'unknown keys return fallback');
expectSame('fallback', ContentSettings::get('missing', 'hero_title', 'en', 'fallback'), 'unknown sections return fallback');

$clean = ContentSettings::sanitizeSection('home', [
    'en' => [
        'hero_title' => ' <b>Clean title</b> ',
        'evidence_body' => "  Line one\nLine two  ",
        'not_allowed' => 'drop',
    ],
    'ar' => ['hero_title' => ' عنوان '],
]);
expectSame('Clean title', $clean['en']['hero_title'], 'text fields are sanitized');
expectSame("Line one\nLine two", $clean['en']['evidence_body'], 'textarea fields preserve line breaks');
expectSame('Preserved superseded range title', $clean['en']['family_title'] ?? null, 'stored superseded fields survive current settings saves');
expectSame(false, isset($clean['en']['not_allowed']), 'new unknown submitted keys are discarded');
expectSame('عنوان', $clean['ar']['hero_title'], 'Arabic is sanitized independently');

fwrite(STDOUT, "PASS: ContentSettings finished-template Home contract\n");
