#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/wordpress/dev/compose.yaml"
ENV_FILE="$ROOT_DIR/wordpress/dev/.env"
compose=(docker compose -f "$COMPOSE_FILE")
if [[ -f "$ENV_FILE" ]]; then
  compose+=(--env-file "$ENV_FILE")
fi

wp() {
  "${compose[@]}" run --rm wpcli "$@"
}

bash "$SCRIPT_DIR/foundation-preflight.sh"

if ! wp plugin is-active woocommerce >/dev/null 2>&1; then
  printf 'Foundation seed failed: WooCommerce must be active.\n' >&2
  exit 1
fi

seed_php="$(cat <<'PHP'
if (! function_exists('wc_get_product')) {
    WP_CLI::error('WooCommerce is not loaded.');
}

$fixture = [
    'slug' => 'rosa-foundation-stevens-scissors-regular',
    'name' => 'Stevens Scissors — Regular',
    'family' => ['name' => 'Scissors', 'slug' => 'scissors'],
    'attributes' => [
        'direction' => [
            'name' => 'Direction',
            'terms' => [
                ['name' => 'Straight', 'slug' => 'straight'],
                ['name' => 'Curved', 'slug' => 'curved'],
            ],
        ],
        'size' => [
            'name' => 'Size',
            'terms' => [
                ['name' => '10.5 cm', 'slug' => '10-5-cm'],
            ],
        ],
        'variant' => [
            'name' => 'Variant',
            'terms' => [
                ['name' => 'Regular', 'slug' => 'regular'],
            ],
        ],
    ],
    'variations' => [
        [
            'sku' => '04-0901',
            'attributes' => [
                'pa_direction' => 'straight',
                'pa_size' => '10-5-cm',
                'pa_variant' => 'regular',
            ],
        ],
        [
            'sku' => '04-0911',
            'attributes' => [
                'pa_direction' => 'curved',
                'pa_size' => '10-5-cm',
                'pa_variant' => 'regular',
            ],
        ],
    ],
];

function rosa_foundation_ensure_attribute(string $slug, string $label): array {
    $taxonomy = wc_attribute_taxonomy_name($slug);
    $attribute_id = wc_attribute_taxonomy_id_by_name($taxonomy);

    if (! $attribute_id) {
        $attribute_id = wc_create_attribute([
            'name' => $label,
            'slug' => $slug,
            'type' => 'select',
            'order_by' => 'menu_order',
            'has_archives' => false,
        ]);
        if (is_wp_error($attribute_id)) {
            WP_CLI::error($attribute_id->get_error_message());
        }
        delete_transient('wc_attribute_taxonomies');
    }

    if (! taxonomy_exists($taxonomy)) {
        register_taxonomy($taxonomy, ['product'], [
            'hierarchical' => false,
            'show_ui' => false,
            'query_var' => true,
            'rewrite' => false,
            'public' => false,
        ]);
    }

    return [(int) $attribute_id, $taxonomy];
}

function rosa_foundation_ensure_term(string $taxonomy, string $name, string $slug): int {
    $existing = term_exists($slug, $taxonomy);
    if ($existing) {
        return (int) (is_array($existing) ? $existing['term_id'] : $existing);
    }

    $created = wp_insert_term($name, $taxonomy, ['slug' => $slug]);
    if (is_wp_error($created)) {
        WP_CLI::error($created->get_error_message());
    }

    return (int) $created['term_id'];
}

$category = term_exists($fixture['family']['slug'], 'product_cat');
if (! $category) {
    $category = wp_insert_term($fixture['family']['name'], 'product_cat', [
        'slug' => $fixture['family']['slug'],
    ]);
    if (is_wp_error($category)) {
        WP_CLI::error($category->get_error_message());
    }
}
$category_id = (int) (is_array($category) ? $category['term_id'] : $category);

$attribute_runtime = [];
foreach ($fixture['attributes'] as $slug => $definition) {
    [$attribute_id, $taxonomy] = rosa_foundation_ensure_attribute($slug, $definition['name']);
    $term_ids = [];
    foreach ($definition['terms'] as $term) {
        $term_ids[] = rosa_foundation_ensure_term($taxonomy, $term['name'], $term['slug']);
    }
    $attribute_runtime[$slug] = [
        'id' => $attribute_id,
        'taxonomy' => $taxonomy,
        'term_ids' => $term_ids,
    ];
}

$existing_post = get_page_by_path($fixture['slug'], OBJECT, 'product');
if ($existing_post) {
    $product = wc_get_product((int) $existing_post->ID);
    if (! $product || ! $product->is_type('variable')) {
        wp_set_object_terms((int) $existing_post->ID, 'variable', 'product_type');
        $product = new WC_Product_Variable((int) $existing_post->ID);
    }
} else {
    $product = new WC_Product_Variable();
}

$product->set_name($fixture['name']);
$product->set_slug($fixture['slug']);
$product->set_status('publish');
$product->set_catalog_visibility('visible');
$product->set_category_ids([$category_id]);
$product->set_description('Foundation-gate fixture derived from the verified Rosa scissors catalogue.');
$product_id = $product->save();

$product_attributes = [];
foreach ($attribute_runtime as $runtime) {
    wp_set_object_terms($product_id, $runtime['term_ids'], $runtime['taxonomy']);

    $attribute = new WC_Product_Attribute();
    $attribute->set_id($runtime['id']);
    $attribute->set_name($runtime['taxonomy']);
    $attribute->set_options($runtime['term_ids']);
    $attribute->set_position(count($product_attributes));
    $attribute->set_visible(true);
    $attribute->set_variation(true);
    $product_attributes[] = $attribute;
}
$product->set_attributes($product_attributes);
$product->save();

$expected_skus = [];
$expected_variation_ids = [];
foreach ($fixture['variations'] as $definition) {
    $expected_skus[] = $definition['sku'];
    $existing_id = wc_get_product_id_by_sku($definition['sku']);
    if ($existing_id) {
        $variation = wc_get_product($existing_id);
        if (! $variation instanceof WC_Product_Variation) {
            WP_CLI::error("SKU {$definition['sku']} is already used by a non-variation product.");
        }
        if ($variation->get_parent_id() !== $product_id) {
            WP_CLI::error("SKU {$definition['sku']} belongs to a different product.");
        }
    } else {
        $variation = new WC_Product_Variation();
        $variation->set_parent_id($product_id);
    }

    $variation->set_status('publish');
    $variation->set_sku($definition['sku']);
    $variation->set_attributes($definition['attributes']);
    $variation->set_manage_stock(false);
    $variation_id = $variation->save();
    $expected_variation_ids[] = $variation_id;
}

$product = wc_get_product($product_id);
foreach ($product->get_children() as $child_id) {
    if (! in_array((int) $child_id, $expected_variation_ids, true)) {
        $unexpected = wc_get_product((int) $child_id);
        if ($unexpected instanceof WC_Product_Variation) {
            $unexpected->delete(true);
        }
    }
}

WC_Product_Variable::sync($product_id);
wc_delete_product_transients($product_id);
clean_post_cache($product_id);

WP_CLI::success(
    sprintf(
        'Seeded %s (product %d) with exact SKUs: %s',
        $fixture['name'],
        $product_id,
        implode(', ', $expected_skus)
    )
);
PHP
)"

wp eval "$seed_php"
