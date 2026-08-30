<?php
/**
 * Rosa Medical child-theme setup.
 */

if (! defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/inc/navigation.php';

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
        'rosa-medical-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'rosa-medical-tokens',
        get_stylesheet_directory_uri() . '/assets/css/tokens.css',
        ['rosa-medical-fonts'],
        $version
    );

    wp_enqueue_style(
        'rosa-medical-base',
        get_stylesheet_directory_uri() . '/assets/css/base.css',
        ['rosa-medical-tokens'],
        $version
    );

    wp_enqueue_style(
        'rosa-medical-shell',
        get_stylesheet_directory_uri() . '/assets/css/shell.css',
        ['rosa-medical-base'],
        $version
    );

    wp_enqueue_script(
        'rosa-medical-site-shell',
        get_stylesheet_directory_uri() . '/assets/js/site-shell.js',
        [],
        $version,
        true
    );

    $isProductSearch = is_search() && get_query_var('post_type') === 'product';
    $isCatalogue = (function_exists('is_shop') && is_shop())
        || (function_exists('is_product_taxonomy') && is_product_taxonomy())
        || $isProductSearch;

    if ($isCatalogue) {
        wp_enqueue_style(
            'rosa-medical-catalogue',
            get_stylesheet_directory_uri() . '/assets/css/catalogue.css',
            ['rosa-medical-shell'],
            $version
        );
    }
});

function rosa_theme_business_value(string $key, string $default = ''): string
{
    if (function_exists('rosa_business_value')) {
        return rosa_business_value($key, $default);
    }

    return $default;
}
