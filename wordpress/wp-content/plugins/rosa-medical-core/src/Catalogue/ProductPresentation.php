<?php

declare(strict_types=1);

namespace RosaMedical\Core\Catalogue;

final class ProductPresentation
{
    /** @return array{kind:string,label:string} */
    public static function defaultPriceState(): array
    {
        return ['kind' => 'request', 'label' => __('Price on request', 'rosa-medical')];
    }

    public static function defaultInquiryEnabled(): bool
    {
        return false;
    }

    /**
     * @param list<string> $skus
     * @return array<string, int|string>
     */
    public static function referenceSummary(array $skus, ?string $productReference): array
    {
        $normalized = [];
        foreach ($skus as $sku) {
            $value = trim((string) $sku);
            if ($value !== '' && ! in_array($value, $normalized, true)) {
                $normalized[] = $value;
            }
        }

        if (count($normalized) === 1) {
            return ['type' => 'single-sku', 'label' => $normalized[0]];
        }

        $reference = trim((string) $productReference);
        if ($reference !== '') {
            return ['type' => 'product-reference', 'label' => $reference, 'count' => count($normalized)];
        }

        $count = count($normalized);
        return [
            'type' => 'configuration-count',
            'label' => sprintf(_n('%d configuration', '%d configurations', $count, 'rosa-medical'), $count),
        ];
    }

    /**
     * @return array{
     *   id:int,
     *   name:string,
     *   permalink:string,
     *   family:?array{id:int,name:string,slug:string},
     *   image:?array{id:int,url:string,alt:string},
     *   description:string,
     *   configurations:list<array{id:int,sku:string,attributes:array<string,string>}>,
     *   reference:array<string,int|string>,
     *   price:array{kind:string,label:string},
     *   inquiry_enabled:bool
     * }
     */
    public static function forProduct(\WC_Product $product): array
    {
        $family = self::familyForProduct($product);
        $image = self::imageForProduct($product);
        $configurations = self::configurationsForProduct($product);
        $skus = array_values(array_filter(array_map(
            static fn (array $configuration): string => $configuration['sku'],
            $configurations
        )));
        $productReference = trim((string) $product->get_meta('_rosa_product_reference', true));

        $price = apply_filters('rosa_medical_product_price_state', self::defaultPriceState(), $product);
        if (! is_array($price) || ! isset($price['kind'], $price['label'])) {
            $price = self::defaultPriceState();
        }

        $inquiryEnabled = (bool) apply_filters(
            'rosa_medical_inquiry_enabled',
            self::defaultInquiryEnabled(),
            $product
        );

        return [
            'id' => (int) $product->get_id(),
            'name' => (string) $product->get_name(),
            'permalink' => (string) get_permalink($product->get_id()),
            'family' => $family,
            'image' => $image,
            'description' => (string) $product->get_description(),
            'configurations' => $configurations,
            'reference' => self::referenceSummary($skus, $productReference !== '' ? $productReference : null),
            'price' => ['kind' => (string) $price['kind'], 'label' => (string) $price['label']],
            'inquiry_enabled' => $inquiryEnabled,
        ];
    }

    /** @return ?array{id:int,name:string,slug:string} */
    private static function familyForProduct(\WC_Product $product): ?array
    {
        $terms = wc_get_product_terms($product->get_id(), 'product_cat', ['fields' => 'all']);
        if (! is_array($terms) || $terms === []) {
            return null;
        }

        usort($terms, static fn ($a, $b): int => ((int) $a->term_id) <=> ((int) $b->term_id));
        $term = $terms[0] ?? null;
        if (! $term instanceof \WP_Term) {
            return null;
        }

        return ['id' => (int) $term->term_id, 'name' => (string) $term->name, 'slug' => (string) $term->slug];
    }

    /** @return ?array{id:int,url:string,alt:string} */
    private static function imageForProduct(\WC_Product $product): ?array
    {
        $imageId = (int) $product->get_image_id();
        if ($imageId <= 0) {
            return null;
        }

        $url = function_exists('wp_get_attachment_image_url')
            ? wp_get_attachment_image_url($imageId, 'woocommerce_thumbnail')
            : false;
        if (! is_string($url) || $url === '') {
            $url = wp_get_attachment_url($imageId);
        }
        if (! is_string($url) || $url === '') {
            return null;
        }

        $alt = (string) get_post_meta($imageId, '_wp_attachment_image_alt', true);
        return ['id' => $imageId, 'url' => $url, 'alt' => $alt];
    }

    /** @return list<array{id:int,sku:string,attributes:array<string,string>}> */
    private static function configurationsForProduct(\WC_Product $product): array
    {
        if ($product instanceof \WC_Product_Variable) {
            $configurations = [];
            foreach ($product->get_children() as $variationId) {
                $variation = wc_get_product((int) $variationId);
                if (! $variation instanceof \WC_Product_Variation || $variation->get_status() !== 'publish') {
                    continue;
                }

                $configurations[] = [
                    'id' => (int) $variation->get_id(),
                    'sku' => (string) $variation->get_sku(),
                    'attributes' => self::resolvedAttributes($variation->get_attributes()),
                ];
            }

            return $configurations;
        }

        return [[
            'id' => (int) $product->get_id(),
            'sku' => (string) $product->get_sku(),
            'attributes' => self::resolvedAttributes($product->get_attributes()),
        ]];
    }

    /** @param array<string,mixed> $attributes @return array<string,string> */
    private static function resolvedAttributes(array $attributes): array
    {
        $result = [];
        foreach ($attributes as $taxonomy => $rawValue) {
            $key = (string) $taxonomy;
            if (is_object($rawValue) && method_exists($rawValue, 'get_name')) {
                $key = (string) $rawValue->get_name();
                $options = method_exists($rawValue, 'get_options') ? $rawValue->get_options() : [];
                $result[$key] = implode(', ', array_map('strval', is_array($options) ? $options : []));
                continue;
            }

            $slug = trim((string) $rawValue);
            if ($slug === '') {
                continue;
            }

            $term = function_exists('get_term_by') ? get_term_by('slug', $slug, $key) : false;
            $result[$key] = $term instanceof \WP_Term ? (string) $term->name : $slug;
        }

        return $result;
    }
}
