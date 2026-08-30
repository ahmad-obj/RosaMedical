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
    ];
    $isPreviewPage = is_page() && (in_array((string) get_page_template_slug(), $previewTemplates, true) || rosa_preview_locale() === 'ar');
    $isPreviewCatalogue = function_exists('is_shop') && (
        is_shop()
        || is_product_category()
        || is_product_tag()
        || (function_exists('is_product') && is_product())
    );
    if ($isPreviewPage || $isPreviewCatalogue) {
        wp_enqueue_style('rosa-client-preview', get_stylesheet_directory_uri() . '/assets/css/client-preview.css', ['rosa-medical-base'], $version);
        if (rosa_preview_locale() === 'ar' && file_exists(get_stylesheet_directory() . '/assets/css/client-preview-rtl.css')) {
            wp_enqueue_style('rosa-client-preview-rtl', get_stylesheet_directory_uri() . '/assets/css/client-preview-rtl.css', ['rosa-client-preview'], $version);
        }
        wp_enqueue_script('rosa-client-preview', get_stylesheet_directory_uri() . '/assets/js/client-preview.js', [], $version, true);
    }
});

function rosa_theme_business_value(string $key, string $default = ''): string
{
    if (function_exists('rosa_business_value')) {
        return rosa_business_value($key, $default);
    }

    return $default;
}
