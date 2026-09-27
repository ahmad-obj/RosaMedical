<?php

namespace RosaMedical\Core\Catalogue;

if (! defined('ABSPATH')) {
    exit;
}

class SearchAutocompleteController
{
    public static function init(): void
    {
        add_action('rest_api_init', [self::class, 'registerRoutes']);
    }

    public static function registerRoutes(): void
    {
        register_rest_route('rosa/v1', '/search', [
            'methods' => 'GET',
            'callback' => [self::class, 'handleSearch'],
            'permission_callback' => '__return_true',
            'args' => [
                'q' => [
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'lang' => [
                    'required' => false,
                    'type' => 'string',
                    'default' => 'en',
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);
    }

    /**
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public static function handleSearch(\WP_REST_Request $request): \WP_REST_Response
    {
        $query = trim((string) $request->get_param('q'));
        $locale = (string) $request->get_param('lang') === 'ar' ? 'ar' : 'en';

        if (mb_strlen($query) < 2) {
            return new \WP_REST_Response([], 200);
        }

        $args = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => 6,
            's' => $query,
        ];

        // Search both Woo's unique internal SKU and Rosa's public catalogue
        // reference. The latter deliberately supports source-backed duplicate
        // references across distinct instruments.
        $skuQuery = new \WP_Query([
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => 6,
            'meta_query' => [
                'relation' => 'OR',
                [
                    'key' => '_sku',
                    'value' => $query,
                    'compare' => 'LIKE',
                ],
                [
                    'key' => '_rosa_primary_code',
                    'value' => $query,
                    'compare' => 'LIKE',
                ],
            ],
        ]);

        $textQuery = new \WP_Query($args);
        $postIds = array_unique(array_merge(
            wp_list_pluck($textQuery->posts, 'ID'),
            wp_list_pluck($skuQuery->posts, 'ID')
        ));
        $postIds = array_slice($postIds, 0, 6);

        $results = [];
        foreach ($postIds as $postId) {
            $product = wc_get_product($postId);
            if (! $product instanceof \WC_Product) {
                continue;
            }

            $terms = wc_get_product_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
            $family = ! empty($terms) ? (string) $terms[0] : '';
            if (function_exists('rosa_preview_family_label')) {
                $family = rosa_preview_family_label($family, $locale);
            }

            $imageId = (int) $product->get_image_id();
            $thumbnail = $imageId > 0 ? (wp_get_attachment_image_url($imageId, 'woocommerce_thumbnail') ?: '') : '';

            $url = function_exists('rosa_preview_product_url')
                ? rosa_preview_product_url($product->get_id(), $locale)
                : get_permalink($product->get_id());

            $sku = trim((string) get_post_meta($product->get_id(), '_rosa_primary_code', true));
            if ($sku === '') {
                $sku = (string) $product->get_sku();
            }
            if ($sku === '') {
                $sku = 'ROSA-' . $product->get_id();
            }

            $results[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'sku' => $sku,
                'family' => $family,
                'thumbnail' => $thumbnail,
                'url' => $url,
            ];
        }

        return new \WP_REST_Response($results, 200);
    }
}
