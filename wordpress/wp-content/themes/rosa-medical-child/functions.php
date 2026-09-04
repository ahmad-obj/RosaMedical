<?php
/**
 * Rosa Medical child-theme setup.
 */

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/inc/client-preview.php';
require_once __DIR__ . '/inc/client-preview-navigation.php';

add_action('after_setup_theme', static function (): void {
    add_theme_support('title-tag');
    add_theme_support('custom-logo');

    register_nav_menus([
        'primary' => __('Primary Navigation', 'rosa-medical'),
    ]);
});

add_action('wp_enqueue_scripts', static function (): void {
    $theme = wp_get_theme();
    $version = (string) $theme->get('Version');
    $pageTemplate = is_page() ? (string) get_page_template_slug() : '';

    wp_enqueue_style(
        'rosa-medical-tokens',
        get_stylesheet_directory_uri() . '/assets/css/tokens.css',
        [],
        $version
    );

    wp_enqueue_style(
        'rosa-medical-base',
        get_stylesheet_directory_uri() . '/assets/css/base.css',
        ['rosa-medical-tokens'],
        $version
    );

    $previewTemplates = [
        'page-templates/client-preview-home.php',
        'page-templates/client-preview-about.php',
        'page-templates/client-preview-contact.php',
        'page-templates/client-preview-shop.php',
        'page-templates/rosa-elementor-authoring.php',
    ];
    $isPreviewPage = is_page() && (in_array($pageTemplate, $previewTemplates, true) || rosa_preview_locale() === 'ar');
    $isPreviewCatalogue = function_exists('is_shop') && (
        is_shop()
        || is_product_category()
        || is_product_tag()
        || (function_exists('is_product') && is_product())
    );
    if ($isPreviewPage || $isPreviewCatalogue) {
        wp_enqueue_style('rosa-client-preview', get_stylesheet_directory_uri() . '/assets/css/client-preview.css', ['rosa-medical-base'], $version);

        $media = get_option(ROSA_PREVIEW_MEDIA_OPTION, []);
        $editableMediaKeys = [
            'home-hero-01', 'home-who-01', 'home-feature-01',
            'home-promo-01', 'home-promo-02', 'home-promo-03', 'home-promo-04',
            'home-why-01', 'home-evidence-01', 'prefooter-person-01',
        ];
        $hasEditableMedia = is_array($media) && array_reduce(
            $editableMediaKeys,
            static fn(bool $found, string $key): bool => $found || (isset($media[$key]) && (int) $media[$key] > 0),
            false
        );
        if ($hasEditableMedia) {
            wp_enqueue_style('rosa-client-preview-media', get_stylesheet_directory_uri() . '/assets/css/client-preview-media.css', ['rosa-client-preview'], $version);
        }

        if ($pageTemplate === 'page-templates/rosa-elementor-authoring.php') {
            wp_enqueue_style(
                'rosa-elementor-authoring',
                get_stylesheet_directory_uri() . '/assets/css/elementor-authoring.css',
                ['rosa-client-preview'],
                $version
            );
        }

        if (rosa_preview_locale() === 'ar' && file_exists(get_stylesheet_directory() . '/assets/css/client-preview-rtl.css')) {
            wp_enqueue_style('rosa-client-preview-rtl', get_stylesheet_directory_uri() . '/assets/css/client-preview-rtl.css', ['rosa-client-preview'], $version);
        }
        wp_enqueue_script('rosa-client-preview', get_stylesheet_directory_uri() . '/assets/js/client-preview.js', [], $version, true);

        // Latest-Rosa Homepage parity assets are intentionally scoped to the
        // EN front page and its paired AR root after Elementor migration.
        $currentId = is_page() ? (int) get_queried_object_id() : 0;
        $frontId = (int) get_option('page_on_front', 0);
        $pageUri = $currentId > 0 && function_exists('get_page_uri') ? trim((string) get_page_uri($currentId), '/') : '';
        $isLatestHome = $pageTemplate === 'page-templates/rosa-elementor-authoring.php'
            && $currentId > 0
            && ($currentId === $frontId || ($pageUri === 'ar' && rosa_preview_locale($currentId) === 'ar'));

        if ($isLatestHome) {
            $latestHomeCss = get_stylesheet_directory() . '/assets/css/latest-rosa-home.css';
            if (is_file($latestHomeCss)) {
                wp_enqueue_style(
                    'rosa-latest-home',
                    get_stylesheet_directory_uri() . '/assets/css/latest-rosa-home.css',
                    ['rosa-elementor-authoring'],
                    $version
                );
            }

            $latestHomeJs = get_stylesheet_directory() . '/assets/js/latest-rosa-home.js';
            if (is_file($latestHomeJs)) {
                wp_enqueue_script(
                    'rosa-latest-home',
                    get_stylesheet_directory_uri() . '/assets/js/latest-rosa-home.js',
                    ['rosa-client-preview'],
                    $version,
                    true
                );
            }
        }
    }
});

function rosa_theme_business_value(string $key, string $default = ''): string
{
    if (function_exists('rosa_business_value')) {
        return rosa_business_value($key, $default);
    }

    return $default;
}