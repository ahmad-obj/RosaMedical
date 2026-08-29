<?php
/**
 * Shared Rosa Product Detail foundation prototype.
 *
 * This template intentionally proves dynamic WooCommerce rendering only.
 * Final pricing, inquiry, image system and production visual polish belong to
 * later migration phases.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

$product = wc_get_product(get_the_ID());
if (! $product instanceof WC_Product) {
    status_header(404);
    nocache_headers();
    get_header();
    echo '<div class="rosa-product-detail"><p>' . esc_html__('Product unavailable.', 'rosa-medical') . '</p></div>';
    get_footer();
    return;
}

$family_terms = wc_get_product_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
$family_label = $family_terms ? implode(', ', $family_terms) : '';
$variations = [];

if ($product instanceof WC_Product_Variable) {
    foreach ($product->get_children() as $variation_id) {
        $variation = wc_get_product((int) $variation_id);
        if ($variation instanceof WC_Product_Variation && $variation->get_status() === 'publish') {
            $variations[] = $variation;
        }
    }
}

get_header();
?>
<div class="rosa-product-detail" id="main-content">
    <article class="rosa-product-detail__inner">
        <?php if ($family_label !== '') : ?>
            <p class="rosa-product-detail__eyebrow"><?php echo esc_html($family_label); ?></p>
        <?php endif; ?>

        <h1><?php echo esc_html($product->get_name()); ?></h1>

        <?php if ($product->get_description() !== '') : ?>
            <div class="rosa-product-detail__description">
                <?php echo wp_kses_post(wpautop($product->get_description())); ?>
            </div>
        <?php endif; ?>

        <?php if ($variations !== []) : ?>
            <section class="rosa-product-detail__configurations" aria-labelledby="rosa-configurations-title">
                <h2 id="rosa-configurations-title"><?php esc_html_e('Available configurations', 'rosa-medical'); ?></h2>
                <div class="rosa-product-detail__configuration-list">
                    <?php foreach ($variations as $variation) :
                        $attributes = $variation->get_attributes();
                        $direction_slug = (string) ($attributes['pa_direction'] ?? '');
                        $size_slug = (string) ($attributes['pa_size'] ?? '');
                        $variant_slug = (string) ($attributes['pa_variant'] ?? '');

                        $direction_term = $direction_slug !== '' ? get_term_by('slug', $direction_slug, 'pa_direction') : false;
                        $size_term = $size_slug !== '' ? get_term_by('slug', $size_slug, 'pa_size') : false;
                        $variant_term = $variant_slug !== '' ? get_term_by('slug', $variant_slug, 'pa_variant') : false;
                        ?>
                        <article class="rosa-product-detail__configuration" data-variation-id="<?php echo esc_attr((string) $variation->get_id()); ?>">
                            <h3><?php echo esc_html($direction_term instanceof WP_Term ? $direction_term->name : $direction_slug); ?></h3>
                            <dl>
                                <div>
                                    <dt><?php esc_html_e('SKU', 'rosa-medical'); ?></dt>
                                    <dd><?php echo esc_html($variation->get_sku()); ?></dd>
                                </div>
                                <?php if ($size_slug !== '') : ?>
                                    <div>
                                        <dt><?php esc_html_e('Size', 'rosa-medical'); ?></dt>
                                        <dd><?php echo esc_html($size_term instanceof WP_Term ? $size_term->name : $size_slug); ?></dd>
                                    </div>
                                <?php endif; ?>
                                <?php if ($variant_slug !== '') : ?>
                                    <div>
                                        <dt><?php esc_html_e('Variant', 'rosa-medical'); ?></dt>
                                        <dd><?php echo esc_html($variant_term instanceof WP_Term ? $variant_term->name : $variant_slug); ?></dd>
                                    </div>
                                <?php endif; ?>
                            </dl>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
        <?php endif; ?>

        <p class="rosa-product-detail__procurement-note">
            <?php esc_html_e('Contact Rosa Medical for procurement details.', 'rosa-medical'); ?>
        </p>
    </article>
</div>
<?php
get_footer();
