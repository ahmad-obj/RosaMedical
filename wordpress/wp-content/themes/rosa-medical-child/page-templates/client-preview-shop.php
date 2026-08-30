<?php
/** Template Name: Rosa Client Preview Shop Arabic */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
$query = new WP_Query(['post_type'=>'product','post_status'=>'publish','posts_per_page'=>12,'paged'=>max(1,(int)get_query_var('paged'))]);
get_header();
?>
<section class="rosa-preview-shop-hero" data-preview-shop-hero><div class="rosa-preview-rail"><p class="rosa-preview-eyebrow">ROSA</p><h1><?php echo esc_html($locale==='ar'?'المنتجات':'Shop'); ?></h1><p><?php echo esc_html($locale==='ar'?'تصفح منتجات روزا الطبية وتواصل معنا للحصول على دعم الكتالوج وعروض الأسعار.':'Browse Rosa medical products and contact us for catalogue and quotation support.'); ?></p></div></section>
<section class="rosa-preview-shop"><div class="rosa-preview-rail"><div class="rosa-preview-shop-grid" data-preview-shop-grid><?php if($query->have_posts()): while($query->have_posts()): $query->the_post(); $product=wc_get_product(get_the_ID()); if($product instanceof WC_Product) get_template_part('template-parts/client-preview/product-card',null,['product'=>$product,'locale'=>$locale]); endwhile; wp_reset_postdata(); else: ?><p class="rosa-preview-shop-empty"><?php echo esc_html($locale==='ar'?'لا توجد منتجات متاحة في هذه المعاينة.':'No products are available in this preview.'); ?></p><?php endif; ?></div></div></section>
<?php get_template_part('template-parts/client-preview/cta-banner',null,['locale'=>$locale]); get_footer();
