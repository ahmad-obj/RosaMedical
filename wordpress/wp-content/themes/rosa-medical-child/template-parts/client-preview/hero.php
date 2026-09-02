<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$title = isset($sectionArgs['title']) && is_scalar($sectionArgs['title'])
    ? (string) $sectionArgs['title']
    : rosa_preview_section_value($sectionArgs, 'home', 'hero_title', $locale, $locale === 'ar' ? 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.' : 'Surgical instruments for professional procurement.');
$body = isset($sectionArgs['body']) && is_scalar($sectionArgs['body'])
    ? (string) $sectionArgs['body']
    : rosa_preview_section_value($sectionArgs, 'home', 'hero_body', $locale, $locale === 'ar' ? 'استكشف فئات أدوات روزا وتواصل مع فريقنا للحصول على الكتالوج ودعم عروض الأسعار.' : 'Explore Rosa instrument families and contact our team for catalogue and quotation support.');
$eyebrow = rosa_preview_section_value($sectionArgs, 'home', 'hero_eyebrow', $locale, $locale === 'ar' ? 'روزا ميديكال' : 'Rosa Medical');
$button = rosa_preview_section_value($sectionArgs, 'home', 'hero_button', $locale, $locale === 'ar' ? 'تصفح المنتجات' : 'Browse products');
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'home-hero-01');
?>
<section class="rosa-preview-hero" data-home-section="hero">
    <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-hero-01', 'label' => 'Rosa medical hero media', 'class' => 'rosa-preview-hero__media', 'image_id' => $imageId]); ?>
    <div class="rosa-preview-rail rosa-preview-hero__inner"><div class="rosa-preview-hero__copy"><p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($eyebrow); ?></p><h1><?php echo esc_html($title); ?></h1><p><?php echo esc_html($body); ?></p><a class="rosa-preview-button rosa-preview-button--light" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/shop/' : '/shop/')); ?>"><?php echo esc_html($button); ?></a></div></div>
</section>
