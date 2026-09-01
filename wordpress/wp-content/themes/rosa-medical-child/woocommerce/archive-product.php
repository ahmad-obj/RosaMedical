<?php
if (! defined('ABSPATH')) { exit; }
$locale = 'en';
$c = static fn(string $key, string $fallback): string => rosa_preview_content('shop', $key, $locale, $fallback);
get_header();
?>
<section class="rosa-preview-shop-hero" data-preview-shop-hero><div class="rosa-preview-rail"><p class="rosa-preview-eyebrow"><?php echo esc_html($c('hero_eyebrow','ROSA')); ?></p><h1><?php echo esc_html($c('hero_title','Shop')); ?></h1><p><?php echo esc_html($c('hero_body','Browse Rosa medical-instrument products and contact us for catalogue and quotation support.')); ?></p></div></section>
<section class="rosa-preview-shop"><div class="rosa-preview-rail"><form class="rosa-preview-shop-search" role="search" method="get" action="<?php echo esc_url(get_post_type_archive_link('product') ?: home_url('/shop/')); ?>"><label for="rosa-preview-shop-search"><?php echo esc_html($c('search_label','Search products')); ?></label><div><input id="rosa-preview-shop-search" name="s" type="search" value="<?php echo esc_attr(get_search_query()); ?>"><input type="hidden" name="post_type" value="product"><button type="submit" class="rosa-preview-button"><?php echo esc_html($c('search_button','Search')); ?></button></div></form>
<div class="rosa-preview-shop-grid" data-preview-shop-grid><?php if (woocommerce_product_loop()) : while (have_posts()) : the_post(); $product=wc_get_product(get_the_ID()); if($product instanceof WC_Product) get_template_part('template-parts/client-preview/product-card',null,['product'=>$product,'locale'=>$locale]); endwhile; else: ?><p class="rosa-preview-shop-empty"><?php echo esc_html($c('empty_state','No products matched this view.')); ?></p><?php endif; ?></div>
<div class="rosa-preview-pagination"><?php the_posts_pagination(['mid_size'=>1]); ?></div></div></section>
<?php get_template_part('template-parts/client-preview/cta-banner',null,['locale'=>$locale]); get_footer();
