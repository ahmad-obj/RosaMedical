<?php
/** Template Name: Rosa Client Preview Home */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
get_header();
get_template_part('template-parts/client-preview/hero', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-who', null, ['locale' => $locale]);
?>
<section class="rosa-preview-featured" data-home-section="featured"><div class="rosa-preview-rail rosa-preview-featured__layout"><div class="rosa-preview-featured__products"><?php get_template_part('template-parts/client-preview/product-grid', null, ['title' => $locale === 'ar' ? 'منتجات مختارة' : 'Editor’s Choice', 'limit' => 4, 'context' => 'featured', 'locale' => $locale]); ?></div><aside class="rosa-preview-benefits" aria-label="<?php echo esc_attr($locale === 'ar' ? 'مزايا التوريد' : 'Procurement support'); ?>"><?php $benefits = $locale === 'ar' ? [['دعم الكتالوج', 'حدد المرجع الصحيح'], ['عرض السعر', 'اسأل عن السعر والتوريد'], ['خمس فئات', 'تصفح عائلات الأدوات']] : [['Catalogue support', 'Identify the right reference'], ['Quotation route', 'Ask about price and supply'], ['Five families', 'Browse instrument ranges']]; foreach ($benefits as $index => [$title, $body]) : ?><article><span><?php echo esc_html((string) ($index + 1)); ?></span><div><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></div></article><?php endforeach; ?></aside></div></section>
<?php
get_template_part('template-parts/client-preview/home-feature', null, ['locale' => $locale]);
?>
<section class="rosa-preview-latest" data-home-section="latest"><div class="rosa-preview-rail"><?php get_template_part('template-parts/client-preview/product-grid', null, ['title' => $locale === 'ar' ? 'أحدث المنتجات' : 'Latest Products', 'limit' => 10, 'context' => 'latest', 'locale' => $locale]); ?></div></section>
<?php
get_template_part('template-parts/client-preview/home-promos', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-why', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-proof', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-evidence', null, ['locale' => $locale]);
?>
<div data-preview-contact-cta><?php get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]); ?></div>
<?php get_footer();
