<?php
/**
 * Virtual quotation-request routes and canonical Woo-backed presentation data.
 */
if (! defined('ABSPATH')) {
    exit;
}

function rosa_quote_request_route_locale(): ?string
{
    $requestUri = (string) ($_SERVER['REQUEST_URI'] ?? '');
    $requestPath = (string) wp_parse_url($requestUri, PHP_URL_PATH);
    $homePath = rtrim((string) wp_parse_url(home_url('/'), PHP_URL_PATH), '/');

    if ($homePath !== '' && $homePath !== '/' && strncmp($requestPath, $homePath . '/', strlen($homePath) + 1) === 0) {
        $requestPath = substr($requestPath, strlen($homePath));
    }

    $path = trim($requestPath, '/');
    if ($path === 'quote-request') {
        return 'en';
    }
    if ($path === 'ar/quote-request') {
        return 'ar';
    }

    return null;
}

function rosa_is_quote_request_route(): bool
{
    return rosa_quote_request_route_locale() !== null;
}

function rosa_quote_request_catalog_payload(): array
{
    if (! function_exists('wc_get_products')) {
        return [];
    }

    $products = wc_get_products([
        'status' => 'publish',
        'limit' => -1,
        'orderby' => 'ID',
        'order' => 'ASC',
        'return' => 'objects',
    ]);

    $rows = [];
    foreach ($products as $product) {
        if (! ($product instanceof WC_Product)) {
            continue;
        }

        $productId = (int) $product->get_id();
        $title = trim((string) $product->get_name());
        if ($productId <= 0 || $title === '') {
            continue;
        }

        if ($product instanceof WC_Product_Variable) {
            foreach ($product->get_children() as $variationId) {
                $variation = wc_get_product((int) $variationId);
                if (! ($variation instanceof WC_Product_Variation) || $variation->get_status() !== 'publish') {
                    continue;
                }

                $sku = trim((string) $variation->get_sku());
                if ($sku === '') {
                    continue;
                }

                $parts = [];
                foreach ($variation->get_attributes() as $taxonomy => $value) {
                    $value = (string) $value;
                    if ($value === '') {
                        continue;
                    }

                    $label = function_exists('wc_attribute_label')
                        ? wc_attribute_label((string) $taxonomy, $product)
                        : ucwords(str_replace(['pa_', '-', '_'], ['', ' ', ' '], (string) $taxonomy));

                    $display = $value;
                    if (taxonomy_exists((string) $taxonomy)) {
                        $term = get_term_by('slug', $value, (string) $taxonomy);
                        if ($term instanceof WP_Term) {
                            $display = $term->name;
                        }
                    }

                    $parts[] = trim((string) $label) . ': ' . $display;
                }

                $rows[] = [
                    'productId' => $productId,
                    'variationId' => (int) $variation->get_id(),
                    'sku' => $sku,
                    'title' => $title,
                    'configuration' => $parts !== [] ? implode(' · ', $parts) : $sku,
                ];
            }
            continue;
        }

        $sku = trim((string) $product->get_sku());
        if ($sku === '') {
            continue;
        }

        $rows[] = [
            'productId' => $productId,
            'variationId' => 0,
            'sku' => $sku,
            'title' => $title,
            'configuration' => $sku,
        ];
    }

    return $rows;
}

add_action('init', static function (): void {
    add_rewrite_rule('^quote-request/?$', 'index.php?rosa_quote_request=1&rosa_quote_locale=en', 'top');
    add_rewrite_rule('^ar/quote-request/?$', 'index.php?rosa_quote_request=1&rosa_quote_locale=ar', 'top');
});

add_filter('query_vars', static function (array $vars): array {
    $vars[] = 'rosa_quote_request';
    $vars[] = 'rosa_quote_locale';
    return $vars;
});

add_action('template_redirect', static function (): void {
    if (! rosa_is_quote_request_route()) {
        return;
    }

    global $wp_query;
    if ($wp_query instanceof WP_Query) {
        $wp_query->is_404 = false;
        $wp_query->is_page = true;
    }

    $routeLocale = rosa_quote_request_route_locale() === 'ar' ? 'ar' : 'en';
    if (defined('ROSA_PREVIEW_ROUTE_LOCALE_QUERY')) {
        set_query_var(ROSA_PREVIEW_ROUTE_LOCALE_QUERY, $routeLocale === 'ar' ? 'ar' : '');
    }

    status_header(200);
    nocache_headers();

    $template = get_stylesheet_directory() . '/page-templates/quote-request.php';
    if (is_readable($template)) {
        include $template;
        exit;
    }
}, 0);
