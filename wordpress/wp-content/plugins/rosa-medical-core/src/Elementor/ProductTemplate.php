<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor;

use WC_Product;

final class ProductTemplate
{
    public const META_KEY = '_rosa_product_template';
    public const VERSION_META = '_rosa_product_template_version';
    public const PREVIEW_PRODUCT_META = '_rosa_product_template_preview_product';
    public const VERSION = '1';
    public const TITLE = 'Rosa Product Detail';

    private static int $activeProductId = 0;

    public static function register(): void
    {
        // A one-time runtime seed makes the global Product Page available as soon
        // as updated code is deployed; admin_init remains an explicit repair path.
        add_action('init', [self::class, 'maybeEnsureRuntime'], 90);
        add_action('admin_init', [self::class, 'maybeEnsure'], 40);
    }

    public static function maybeEnsureRuntime(): void
    {
        if (! self::isElementorAvailable()
            || ! function_exists('post_type_exists')
            || ! post_type_exists('elementor_library')
            || self::templateId() > 0) {
            return;
        }

        self::ensure();
    }

    public static function maybeEnsure(): void
    {
        if (! self::isElementorAvailable() || ! function_exists('current_user_can') || ! current_user_can('edit_posts')) {
            return;
        }

        self::ensure();
    }

    public static function isElementorAvailable(): bool
    {
        return class_exists('\\Elementor\\Plugin');
    }

    public static function templateId(): int
    {
        if (! function_exists('get_posts')) {
            return 0;
        }

        $ids = get_posts([
            'post_type' => 'elementor_library',
            'post_status' => ['publish', 'draft', 'private'],
            'posts_per_page' => 1,
            'fields' => 'ids',
            'orderby' => 'ID',
            'order' => 'ASC',
            'meta_key' => self::META_KEY,
            'meta_value' => '1',
            'suppress_filters' => true,
        ]);

        return isset($ids[0]) ? max(0, (int) $ids[0]) : 0;
    }

    public static function ensure(): int
    {
        if (! self::isElementorAvailable() || ! function_exists('post_type_exists') || ! post_type_exists('elementor_library')) {
            return 0;
        }

        $existing = self::templateId();
        if ($existing > 0) {
            if ((int) get_post_meta($existing, self::PREVIEW_PRODUCT_META, true) <= 0) {
                $previewId = self::firstPreviewProductId();
                if ($previewId > 0) {
                    update_post_meta($existing, self::PREVIEW_PRODUCT_META, $previewId);
                }
            }
            return $existing;
        }

        if (! function_exists('wp_insert_post')) {
            return 0;
        }

        $inserted = wp_insert_post([
            'post_type' => 'elementor_library',
            'post_status' => 'publish',
            'post_title' => self::TITLE,
            'post_content' => '',
            'post_excerpt' => '',
        ], true);

        if ((function_exists('is_wp_error') && is_wp_error($inserted)) || ! is_numeric($inserted)) {
            return 0;
        }
        $templateId = (int) $inserted;
        if ($templateId <= 0) {
            return 0;
        }

        update_post_meta($templateId, self::META_KEY, '1');
        update_post_meta($templateId, self::VERSION_META, self::VERSION);
        update_post_meta($templateId, '_elementor_edit_mode', 'builder');
        update_post_meta($templateId, '_elementor_template_type', 'page');
        update_post_meta($templateId, '_elementor_page_settings', []);
        if (defined('ELEMENTOR_VERSION')) {
            update_post_meta($templateId, '_elementor_version', (string) ELEMENTOR_VERSION);
        }

        $encoded = function_exists('wp_json_encode')
            ? wp_json_encode(self::seedElements(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : json_encode(self::seedElements(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (is_string($encoded)) {
            update_post_meta($templateId, '_elementor_data', function_exists('wp_slash') ? wp_slash($encoded) : $encoded);
        }

        $previewId = self::firstPreviewProductId();
        if ($previewId > 0) {
            update_post_meta($templateId, self::PREVIEW_PRODUCT_META, $previewId);
        }

        if (class_exists('\\Elementor\\Plugin')
            && isset(\Elementor\Plugin::$instance)
            && is_object(\Elementor\Plugin::$instance)
            && isset(\Elementor\Plugin::$instance->files_manager)
            && is_object(\Elementor\Plugin::$instance->files_manager)
            && method_exists(\Elementor\Plugin::$instance->files_manager, 'clear_cache')) {
            \Elementor\Plugin::$instance->files_manager->clear_cache();
        }

        return $templateId;
    }

    /** @return list<array<string,mixed>> */
    public static function seedElements(): array
    {
        $widget = static fn(string $name, int $index): array => [
            'id' => self::id(sprintf('product-%02d-%s', $index, $name)),
            'elType' => 'widget',
            'widgetType' => $name,
            'isInner' => false,
            'settings' => [],
            'elements' => [],
        ];

        $hero = [
            'id' => self::id('product-hero'),
            'elType' => 'container',
            'isInner' => false,
            'settings' => [
                'css_classes' => 'rosa-product-elementor-hero',
                'content_width' => 'full',
                'gap' => ['unit' => 'px', 'size' => 0, 'sizes' => []],
                'padding' => ['unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true],
            ],
            'elements' => [
                $widget('rosa-product-gallery', 2),
                $widget('rosa-product-summary', 3),
            ],
        ];

        return [[
            'id' => self::id('product-root'),
            'elType' => 'container',
            'isInner' => false,
            'settings' => [
                'css_classes' => 'rosa-product-elementor-root',
                'content_width' => 'full',
                'gap' => ['unit' => 'px', 'size' => 0, 'sizes' => []],
                'padding' => ['unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true],
            ],
            'elements' => [
                $widget('rosa-product-breadcrumb', 1),
                $hero,
                $widget('rosa-product-details', 4),
                $widget('rosa-product-configurations', 5),
                $widget('rosa-product-support', 6),
                $widget('rosa-product-related', 7),
            ],
        ]];
    }

    public static function currentProduct(): ?WC_Product
    {
        $candidate = self::$activeProductId;

        if ($candidate <= 0 && function_exists('get_queried_object_id')) {
            $queried = (int) get_queried_object_id();
            if ($queried > 0 && function_exists('get_post_type') && get_post_type($queried) === 'product') {
                $candidate = $queried;
            }
        }

        if ($candidate <= 0 && function_exists('get_the_ID')) {
            $current = (int) get_the_ID();
            if ($current > 0 && function_exists('get_post_type') && get_post_type($current) === 'product') {
                $candidate = $current;
            }
        }

        if ($candidate <= 0) {
            $templateId = self::templateId();
            if ($templateId > 0 && function_exists('get_post_meta')) {
                $candidate = (int) get_post_meta($templateId, self::PREVIEW_PRODUCT_META, true);
            }
        }

        if ($candidate <= 0) {
            $candidate = self::firstPreviewProductId();
        }

        if ($candidate <= 0 || ! function_exists('wc_get_product')) {
            return null;
        }

        $product = wc_get_product($candidate);
        return $product instanceof WC_Product ? $product : null;
    }

    public static function currentLocale(): string
    {
        $product = self::currentProduct();
        if ($product instanceof WC_Product && function_exists('rosa_preview_locale')) {
            return rosa_preview_locale($product->get_id()) === 'ar' ? 'ar' : 'en';
        }

        if (function_exists('rosa_preview_request_locale') && rosa_preview_request_locale() === 'ar') {
            return 'ar';
        }

        return 'en';
    }

    public static function render(int $productId): bool
    {
        if ($productId <= 0 || ! self::isElementorAvailable()) {
            return false;
        }

        $templateId = self::templateId();
        if ($templateId <= 0
            || ! isset(\Elementor\Plugin::$instance)
            || ! is_object(\Elementor\Plugin::$instance)
            || ! isset(\Elementor\Plugin::$instance->frontend)
            || ! is_object(\Elementor\Plugin::$instance->frontend)
            || ! method_exists(\Elementor\Plugin::$instance->frontend, 'get_builder_content_for_display')) {
            return false;
        }

        $previous = self::$activeProductId;
        self::$activeProductId = $productId;
        try {
            $content = (string) \Elementor\Plugin::$instance->frontend->get_builder_content_for_display($templateId, true);
        } finally {
            self::$activeProductId = $previous;
        }

        if (trim($content) === '') {
            return false;
        }

        echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor returns rendered HTML.
        return true;
    }

    public static function editorUrl(int $templateId = 0): string
    {
        $templateId = $templateId > 0 ? $templateId : self::templateId();
        if ($templateId <= 0) {
            return '';
        }

        if (self::isElementorAvailable()
            && isset(\Elementor\Plugin::$instance)
            && is_object(\Elementor\Plugin::$instance)
            && isset(\Elementor\Plugin::$instance->documents)
            && is_object(\Elementor\Plugin::$instance->documents)
            && method_exists(\Elementor\Plugin::$instance->documents, 'get')) {
            $document = \Elementor\Plugin::$instance->documents->get($templateId, false);
            if (is_object($document) && method_exists($document, 'get_edit_url')) {
                $url = (string) $document->get_edit_url();
                if ($url !== '') {
                    return $url;
                }
            }
        }

        if (function_exists('get_edit_post_link')) {
            return (string) get_edit_post_link($templateId, '');
        }

        return '';
    }

    private static function firstPreviewProductId(): int
    {
        if (function_exists('wc_get_products')) {
            $ids = wc_get_products([
                'status' => 'publish',
                'limit' => 1,
                'return' => 'ids',
                'orderby' => 'ID',
                'order' => 'ASC',
            ]);
            if (is_array($ids) && isset($ids[0])) {
                return max(0, (int) $ids[0]);
            }
        }

        if (function_exists('get_posts')) {
            $ids = get_posts([
                'post_type' => 'product',
                'post_status' => 'publish',
                'posts_per_page' => 1,
                'fields' => 'ids',
                'orderby' => 'ID',
                'order' => 'ASC',
                'suppress_filters' => true,
            ]);
            if (isset($ids[0])) {
                return max(0, (int) $ids[0]);
            }
        }

        return 0;
    }

    private static function id(string $key): string
    {
        if (class_exists(ElementorSeedData::class)) {
            return ElementorSeedData::deterministicId($key);
        }

        return substr(md5('rosa:' . $key), 0, 8);
    }
}
