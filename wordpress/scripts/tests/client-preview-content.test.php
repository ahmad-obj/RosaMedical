<?php
declare(strict_types=1);
$GLOBALS['rosa_preview_meta'] = [];
$GLOBALS['rosa_preview_options'] = ['rosa_preview_media' => ['hero' => 42]];
$GLOBALS['rosa_preview_business'] = [
    'address' => 'King Fahd Road, Al Olaya, Riyadh 12214, Saudi Arabia',
    'address_ar' => 'طريق الملك فهد، العليا، الرياض 12214، المملكة العربية السعودية',
    'phone' => '+966 59 720 4394',
];
$GLOBALS['rosa_content_overrides'] = ['site' => ['ar' => ['nav_home' => 'واجهة']]];
function get_the_ID(): int { return 100; }
function get_post_meta(int $id, string $key, bool $single = false): mixed { return $GLOBALS['rosa_preview_meta'][$id][$key] ?? ''; }
function get_permalink(int $id): string { return 'https://example.test/page-' . $id . '/'; }
function get_option(string $key, mixed $default = false): mixed { return $GLOBALS['rosa_preview_options'][$key] ?? $default; }
function __(string $text, string $domain = 'default'): string { return $text; }
function home_url(string $path = ''): string { return 'https://example.test' . $path; }
function rosa_theme_business_value(string $key, string $default = ''): string { return $GLOBALS['rosa_preview_business'][$key] ?? $default; }
function rosa_content_value(string $section, string $key, string $locale = 'en', string $fallback = ''): string { return $GLOBALS['rosa_content_overrides'][$section][$locale][$key] ?? $fallback; }
require_once __DIR__ . '/../../wp-content/themes/rosa-medical-child/inc/client-preview.php';
require_once __DIR__ . '/../../wp-content/themes/rosa-medical-child/inc/client-preview-navigation.php';
function same(mixed $expected, mixed $actual, string $message): void { if ($expected !== $actual) { fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true) . "\nActual: " . var_export($actual, true) . "\n"); exit(1); } }
$GLOBALS['rosa_preview_meta'][100]['_rosa_preview_locale'] = 'ar';
$GLOBALS['rosa_preview_meta'][100]['_rosa_preview_pair_id'] = 200;
same('ar', rosa_preview_locale(100), 'page locale must come from preview metadata');
same('https://example.test/page-200/', rosa_preview_pair_url(100), 'language switch must resolve the paired page');
same(42, rosa_preview_media_id('hero'), 'preview media map must resolve attachment IDs');
same('اطلب عرض سعر', rosa_preview_copy('request_quote', 'ar'), 'Arabic interface copy must remain explicit');
same('Price on request', rosa_preview_price_label('en'), 'English price fallback must stay truthful');
same('السعر عند الطلب', rosa_preview_price_label('ar'), 'Arabic price fallback must stay truthful');
same('طريق الملك فهد، العليا، الرياض 12214، المملكة العربية السعودية', rosa_preview_business_value('address', 'ar'), 'Arabic address must resolve from centralized business settings');
same('King Fahd Road, Al Olaya, Riyadh 12214, Saudi Arabia', rosa_preview_business_value('address', 'en'), 'English address must remain centralized');
same('+966 59 720 4394', rosa_preview_business_value('phone', 'ar'), 'locale-neutral business values must remain centralized');
same('المقصات', rosa_preview_family_label('Scissors', 'ar'), 'verified family labels must be localized');
same('Technical family 04', rosa_preview_family_label('Technical family 04', 'ar'), 'unknown technical family labels must remain unchanged');
same('Fallback', rosa_preview_content('home', 'missing', 'en', 'Fallback'), 'content helper must preserve explicit coded fallback');
same('واجهة', rosa_preview_nav_items('ar')[0]['label'], 'Arabic navigation label must use editable site content');
same('About us', rosa_preview_nav_items('en')[1]['label'], 'English navigation must retain current default without an override');
fwrite(STDOUT, "PASS: client preview content/locale helpers\n");
