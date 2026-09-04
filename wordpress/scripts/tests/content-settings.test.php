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

expectSame('Our range of products', ContentSettings::get('home', 'family_title', 'en'), 'latest Home family title missing');
expectSame('Comprehensive Plans', ContentSettings::get('home', 'comprehensive_title', 'en'), 'latest Home comprehensive title missing');
expectSame('Securing Confidence', ContentSettings::get('home', 'confidence_title', 'en'), 'latest Home confidence title missing');
expectSame('Get in Touch Now', ContentSettings::get('home', 'contact_title', 'en'), 'latest Home contact title missing');
expectSame('Services Assure our Clients Success', ContentSettings::get('home', 'assurance_title', 'en'), 'latest Home assurance title missing');
expectSame('Prepare your instruments inquiry.', ContentSettings::get('home', 'quotation_title', 'en'), 'latest Home quotation title missing');
expectSame('Precision instruments. Procurement made clear.', ContentSettings::get('home', 'hero_1_title', 'en'), 'latest Home hero slide 1 missing');
expectSame('حوّل تفاصيل الكتالوج إلى طلب واحد منظم.', ContentSettings::get('home', 'hero_4_title', 'ar'), 'latest Arabic Home hero slide 4 missing');

$GLOBALS['rosa_test_options']['rosa_home_content'] = [
    'en' => ['family_title' => 'Changed safely'],
    'ar' => [],
];
expectSame('Changed safely', ContentSettings::get('home', 'family_title', 'en'), 'stored English value must win');
expectSame('مجموعة منتجاتنا', ContentSettings::get('home', 'family_title', 'ar'), 'missing Arabic value must retain Arabic default');
expectSame('fallback', ContentSettings::get('home', 'not_allowed', 'en', 'fallback'), 'unknown keys return fallback');
expectSame('fallback', ContentSettings::get('missing', 'family_title', 'en', 'fallback'), 'unknown sections return fallback');

$clean = ContentSettings::sanitizeSection('home', [
    'en' => [
        'family_title' => ' <b>Clean title</b> ',
        'comprehensive_body' => "  Line one\nLine two  ",
        'not_allowed' => 'drop',
    ],
    'ar' => ['family_title' => ' عنوان '],
]);
expectSame('Clean title', $clean['en']['family_title'], 'text fields are sanitized');
expectSame("Line one\nLine two", $clean['en']['comprehensive_body'], 'textarea fields preserve line breaks');
expectSame(false, isset($clean['en']['not_allowed']), 'unknown keys are discarded');
expectSame('عنوان', $clean['ar']['family_title'], 'Arabic is sanitized independently');

fwrite(STDOUT, "PASS: ContentSettings latest Home contract\n");
