<?php
/**
 * Protected Rosa WooCommerce product archive.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

use RosaMedical\Core\Catalogue\FamilyCatalogue;

$productArchiveUrl = get_post_type_archive_link('product');
if (! is_string($productArchiveUrl) || $productArchiveUrl === '') {
    $productArchiveUrl = home_url('/products/');
}
$hasFilterProvider = has_action('rosa_medical_archive_filters');
$catalogue = null;
$queried = get_queried_object();
if ($queried instanceof WP_Term && $queried->taxonomy === 'product_cat') {
    $catalogue = FamilyCatalogue::forTerm($queried);
}

get_header();
?>
<section class="rosa-products-intro">
    <div class="rosa-rail rosa-rail--archive">
        <p class="rosa-eyebrow"><?php esc_html_e('Product catalogue', 'rosa-medical'); ?></p>
        <h1 class="rosa-display"><?php esc_html_e('Medical Devices', 'rosa-medical'); ?></h1>
        <p class="rosa-products-intro__copy"><?php esc_html_e('Search the Rosa catalogue and open the exact instrument before adding it to your quotation inquiry.', 'rosa-medical'); ?></p>
    </div>
</section>

<section class="rosa-products-workspace" aria-labelledby="rosa-products-results-title">
    <div class="rosa-rail rosa-rail--archive">
        <form class="rosa-products-search" role="search" method="get" action="<?php echo esc_url($productArchiveUrl); ?>">
            <label for="rosa-product-search"><?php esc_html_e('Search products by name, code, size or option', 'rosa-medical'); ?></label>
            <div class="rosa-products-search__control">
                <input id="rosa-product-search" name="s" type="search" value="<?php echo esc_attr(get_search_query()); ?>" autocomplete="off">
                <button class="rosa-button" type="submit"><?php esc_html_e('Search', 'rosa-medical'); ?></button>
            </div>
            <input type="hidden" name="post_type" value="product">
        </form>

        <div class="rosa-products-layout<?php echo $hasFilterProvider ? ' has-filters' : ''; ?>">
            <?php if ($hasFilterProvider) : ?>
                <aside class="rosa-products-filters" aria-label="<?php echo esc_attr__('Product filters', 'rosa-medical'); ?>">
                    <?php do_action('rosa_medical_archive_filters'); ?>
                </aside>
            <?php endif; ?>

            <div class="rosa-products-results">
                <div class="rosa-products-results__header">
                    <h2 id="rosa-products-results-title"><?php esc_html_e('Products', 'rosa-medical'); ?></h2>
                    <p aria-live="polite">
                        <?php
                        $total = (int) wc_get_loop_prop('total', 0);
                        echo esc_html(sprintf(_n('%d product', '%d products', $total, 'rosa-medical'), $total));
                        ?>
                    </p>
                </div>

                <?php if (woocommerce_product_loop()) : ?>
                    <div class="rosa-products-grid">
                        <?php while (have_posts()) : the_post(); ?>
                            <?php
                            global $product;
                            if (! $product instanceof WC_Product) {
                                $product = wc_get_product(get_the_ID());
                            }
                            if ($product instanceof WC_Product) {
                                get_template_part('template-parts/product-card', null, ['product' => $product]);
                            }
                            ?>
                        <?php endwhile; ?>
                    </div>
                    <div class="rosa-products-reveal">
                        <?php do_action('rosa_medical_archive_reveal'); ?>
                    </div>
                <?php else : ?>
                    <div class="rosa-products-empty">
                        <h3><?php esc_html_e('No matching instruments found.', 'rosa-medical'); ?></h3>
                        <p><?php esc_html_e('Clear the current search or filters to return to the complete product catalogue.', 'rosa-medical'); ?></p>
                        <a class="rosa-button" href="<?php echo esc_url($productArchiveUrl); ?>"><?php esc_html_e('View all products', 'rosa-medical'); ?></a>
                    </div>
                <?php endif; ?>

                <?php if (is_array($catalogue)) : ?>
                    <?php get_template_part('template-parts/catalogue-panel', null, ['catalogue' => $catalogue]); ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();
