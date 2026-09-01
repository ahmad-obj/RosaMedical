<?php
/** Template Name: Rosa Client Preview Shop Arabic */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_content('shop', $key, $locale, $locale === 'ar' ? $ar : $en);
$search = isset($_GET['s']) ? sanitize_text_field(wp_unslash((string) $_GET['s'])) : '';
$query = new WP_Query(['post_type'=>'product','post_status'=>'publish','posts_per_page'=>12,'paged'=>max(1,(int)get_query_var('paged')),'s'=>$search]);
get_header();
?>
<section class="rosa-preview-shop-hero" data-preview-shop-hero><div class="rosa-preview-rail"><p class="rosa-preview-eyebrow"><?php echo esc_html($c('hero_eyebrow','ROSA','ROSA')); ?></p><h1><?php echo esc_html($c('hero_title','Shop','المنتجات')); ?></h1><p><?php echo esc_html($c('hero_body','Browse Rosa medical products and contact us for catalogue and quotation support.','تصفح منتجات روزا الطبية وتواصل معنا للحصول على دعم الكتالوج وعروض الأسعار.')); ?></p></div></section>
<section class="rosa-preview-shop"><div class="rosa-preview-rail"><form class="rosa-preview-shop-search" role="search" method="get" action="<?php echo esc_url(home_url('/ar/shop/')); ?>"><label for="rosa-preview-shop-search"><?php echo esc_html($c('search_label','Search products','البحث في المنتجات')); ?></label><div><input id="rosa-preview-shop-search" name="s" type="search" value="<?php echo esc_attr($search); ?>"><button type="submit" class="rosa-preview-button"><?php echo esc_html($c('search_button','Search','بحث')); ?></button></div></form><div class="rosa-preview-shop-grid" data-preview-shop-grid><?php if($query->have_posts()): while($query->have_posts()): $query->the_post(); $product=wc_get_product(get_the_ID()); if($product instanceof WC_Product) get_template_part('template-parts/client-preview/product-card',null,['product'=>$product,'locale'=>$locale]); endwhile; wp_reset_postdata(); else: ?><p class="rosa-preview-shop-empty"><?php echo esc_html($c('empty_state','No products are available in this preview.','لا توجد منتجات متاحة في هذه المعاينة.')); ?></p><?php endif; ?></div></div></section>
<?php get_template_part('template-parts/client-preview/cta-banner',null,['locale'=>$locale]); get_footer();
