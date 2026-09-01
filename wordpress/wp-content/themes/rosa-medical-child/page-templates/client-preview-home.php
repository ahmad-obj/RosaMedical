<?php
/** Template Name: Rosa Client Preview Home */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_content('home', $key, $locale, $locale === 'ar' ? $ar : $en);
get_header();
get_template_part('template-parts/client-preview/hero', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-who', null, ['locale' => $locale]);
?>
<section class="rosa-preview-featured" data-home-section="featured"><div class="rosa-preview-rail rosa-preview-featured__layout"><div class="rosa-preview-featured__products"><?php get_template_part('template-parts/client-preview/product-grid', null, ['title' => $c('featured_title', 'Featured Products', 'منتجات مختارة'), 'limit' => 4, 'context' => 'featured', 'locale' => $locale]); ?></div><aside class="rosa-preview-benefits" aria-label="<?php echo esc_attr($locale === 'ar' ? 'مزايا التوريد' : 'Procurement support'); ?>"><?php $benefits = [[$c('benefit_1_title', 'Catalogue support', 'دعم الكتالوج'), $c('benefit_1_body', 'Identify the right reference', 'حدد المرجع الصحيح')], [$c('benefit_2_title', 'Quotation route', 'عرض السعر'), $c('benefit_2_body', 'Ask about price and supply', 'اسأل عن السعر والتوريد')], [$c('benefit_3_title', 'Five families', 'خمس فئات'), $c('benefit_3_body', 'Browse instrument ranges', 'تصفح عائلات الأدوات')]]; foreach ($benefits as $index => [$title, $body]) : ?><article><span><?php echo esc_html((string) ($index + 1)); ?></span><div><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></div></article><?php endforeach; ?></aside></div></section>
<?php
get_template_part('template-parts/client-preview/home-feature', null, ['locale' => $locale]);
?>
<section class="rosa-preview-latest" data-home-section="latest"><div class="rosa-preview-rail"><?php get_template_part('template-parts/client-preview/product-grid', null, ['title' => $c('latest_title', 'Latest Products', 'أحدث المنتجات'), 'limit' => 10, 'context' => 'latest', 'locale' => $locale]); ?></div></section>
<?php
get_template_part('template-parts/client-preview/home-promos', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-why', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-proof', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-evidence', null, ['locale' => $locale]);
?>
<div data-preview-contact-cta><?php get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]); ?></div>
<?php get_footer();
