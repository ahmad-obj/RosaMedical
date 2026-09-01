<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$items = $locale === 'ar' ? [['home-promo-01', 'السكاكين الجراحية', 'تصفح مراجع الفئة'], ['home-promo-02', 'مقصات دقيقة', 'خيارات مستقيمة ومنحنية'], ['home-promo-03', 'المثاقب والأزاميل', 'حدد الأداة المطلوبة'], ['home-promo-04', 'خمسة كتالوجات للأدوات', 'ابدأ من الفئة المناسبة']] : [['home-promo-01', 'Surgical knives', 'Browse family references'], ['home-promo-02', 'Precision scissors', 'Straight and curved options'], ['home-promo-03', 'Punches and chisels', 'Identify the instrument needed'], ['home-promo-04', 'Five instrument catalogues', 'Start with the right family']];
$shop = home_url($locale === 'ar' ? '/ar/shop/' : '/shop/');
?>
<section class="rosa-preview-promos" data-home-section="promos"><div class="rosa-preview-rail rosa-preview-promos__grid"><?php foreach ($items as $index => [$slot, $title, $body]) : ?><a class="rosa-preview-promos__tile rosa-preview-promos__tile--<?php echo esc_attr((string) ($index + 1)); ?>" href="<?php echo esc_url($shop); ?>"><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $slot, 'label' => $title]); ?><span class="rosa-preview-promos__content"><strong><?php echo esc_html($title); ?></strong><span><?php echo esc_html($body); ?></span></span></a><?php endforeach; ?></div></section>
