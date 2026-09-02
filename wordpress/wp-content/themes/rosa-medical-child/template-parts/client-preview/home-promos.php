<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, $locale === 'ar' ? $ar : $en);
$items = [
    ['home-promo-01', 'image_1', $c('promo_1_title', 'Surgical knives', 'السكاكين الجراحية'), $c('promo_1_body', 'Browse family references', 'تصفح مراجع الفئة')],
    ['home-promo-02', 'image_2', $c('promo_2_title', 'Precision scissors', 'مقصات دقيقة'), $c('promo_2_body', 'Straight and curved options', 'خيارات مستقيمة ومنحنية')],
    ['home-promo-03', 'image_3', $c('promo_3_title', 'Punches and chisels', 'المثاقب والأزاميل'), $c('promo_3_body', 'Identify the instrument needed', 'حدد الأداة المطلوبة')],
    ['home-promo-04', 'image_4', $c('promo_4_title', 'Five instrument catalogues', 'خمسة كتالوجات للأدوات'), $c('promo_4_body', 'Start with the right family', 'ابدأ من الفئة المناسبة')],
];
$shop = home_url($locale === 'ar' ? '/ar/shop/' : '/shop/');
?>
<section class="rosa-preview-promos" data-home-section="promos"><div class="rosa-preview-rail rosa-preview-promos__grid"><?php foreach ($items as $index => [$slot, $mediaKey, $title, $body]) : $imageId = rosa_preview_section_media_id($sectionArgs, $mediaKey, $slot); ?><a class="rosa-preview-promos__tile rosa-preview-promos__tile--<?php echo esc_attr((string) ($index + 1)); ?>" href="<?php echo esc_url($shop); ?>"><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $slot, 'label' => $title, 'image_id' => $imageId]); ?><span class="rosa-preview-promos__content"><strong><?php echo esc_html($title); ?></strong><span><?php echo esc_html($body); ?></span></span></a><?php endforeach; ?></div></section>
