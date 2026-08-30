<?php
/**
 * Protected Rosa public navigation model.
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @return list<array{key:string,label:string,url:string}>
 */
function rosa_theme_primary_navigation(): array
{
    return [
        ['key' => 'home', 'label' => __('Home', 'rosa-medical'), 'url' => home_url('/')],
        ['key' => 'about', 'label' => __('About Us', 'rosa-medical'), 'url' => home_url('/about/')],
        ['key' => 'products', 'label' => __('Products', 'rosa-medical'), 'url' => home_url('/products/')],
        ['key' => 'inquiry', 'label' => __('Inquiry', 'rosa-medical'), 'url' => home_url('/inquiry/')],
        ['key' => 'contact', 'label' => __('Contact Us', 'rosa-medical'), 'url' => home_url('/contact/')],
    ];
}

function rosa_theme_nav_is_active(string $key): bool
{
    if ($key === 'products') {
        return (function_exists('is_shop') && is_shop())
            || (function_exists('is_product') && is_product())
            || (function_exists('is_product_taxonomy') && is_product_taxonomy());
    }

    if ($key === 'home') {
        return function_exists('is_front_page') && is_front_page();
    }

    $pageSlugs = [
        'about' => 'about',
        'inquiry' => 'inquiry',
        'contact' => 'contact',
    ];

    return isset($pageSlugs[$key]) && function_exists('is_page') && is_page($pageSlugs[$key]);
}

function rosa_theme_family_url(string $slug): string
{
    if (function_exists('get_term_by') && function_exists('get_term_link')) {
        $term = get_term_by('slug', $slug, 'product_cat');
        if ($term instanceof WP_Term) {
            $url = get_term_link($term);
            if (is_string($url)) {
                return $url;
            }
        }
    }

    return home_url('/products/');
}
