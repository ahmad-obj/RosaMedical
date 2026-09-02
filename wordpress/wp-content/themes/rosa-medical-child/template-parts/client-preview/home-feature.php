<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, $locale === 'ar' ? $ar : $en);
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'home-feature-01');
?>
<section class="rosa-preview-feature" data-home-section="feature"><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-feature-01', 'label' => 'Rosa catalogue support media', 'image_id' => $imageId]); ?><div class="rosa-preview-rail rosa-preview-feature__content"><p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($c('feature_eyebrow', 'Procurement support', 'دعم التوريد')); ?></p><h2><?php echo esc_html($c('feature_title', 'From catalogue reference to a clear quotation request.', 'من مرجع الكتالوج إلى طلب عرض سعر واضح.')); ?></h2><p><?php echo esc_html($c('feature_body', 'Browse instruments by family and share the exact references your procurement team needs.', 'استكشف الأدوات حسب الفئة وشارك المراجع المطلوبة مع فريق روزا.')); ?></p><a class="rosa-preview-button rosa-preview-button--light" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/' : '/contact/')); ?>"><?php echo esc_html($c('feature_button', 'Contact us', 'اتصل بنا')); ?></a></div></section>
