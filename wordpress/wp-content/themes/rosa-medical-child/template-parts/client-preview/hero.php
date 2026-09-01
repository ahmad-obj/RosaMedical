<?php
if (! defined('ABSPATH')) { exit; }
$locale = $args['locale'] ?? rosa_preview_locale();
$title = (string) ($args['title'] ?? rosa_preview_content('home', 'hero_title', $locale, $locale === 'ar' ? 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.' : 'Surgical instruments for professional procurement.'));
$body = (string) ($args['body'] ?? rosa_preview_content('home', 'hero_body', $locale, $locale === 'ar' ? 'استكشف فئات أدوات روزا وتواصل مع فريقنا للحصول على الكتالوج ودعم عروض الأسعار.' : 'Explore Rosa instrument families and contact our team for catalogue and quotation support.'));
$eyebrow = rosa_preview_content('home', 'hero_eyebrow', $locale, $locale === 'ar' ? 'روزا ميديكال' : 'Rosa Medical');
$button = rosa_preview_content('home', 'hero_button', $locale, $locale === 'ar' ? 'تصفح المنتجات' : 'Browse products');
?>
<section class="rosa-preview-hero" data-home-section="hero">
    <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-hero-01', 'label' => 'Rosa medical hero media', 'class' => 'rosa-preview-hero__media']); ?>
    <div class="rosa-preview-rail rosa-preview-hero__inner"><div class="rosa-preview-hero__copy"><p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($eyebrow); ?></p><h1><?php echo esc_html($title); ?></h1><p><?php echo esc_html($body); ?></p><a class="rosa-preview-button rosa-preview-button--light" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/shop/' : '/shop/')); ?>"><?php echo esc_html($button); ?></a></div></div>
</section>
