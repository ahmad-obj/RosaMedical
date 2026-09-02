<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
$cards = [
    [$c('card_1_title','Product Families','فئات المنتجات'),$c('card_1_body','Five focused catalogue families for instrument discovery.','خمس فئات كتالوج رئيسية لاكتشاف الأدوات.'),$c('card_1_cta','Browse products','تصفح المنتجات')],
    [$c('card_2_title','Catalogue Support','دعم الكتالوج'),$c('card_2_body','Use family catalogues and product references to identify requirements.','استخدم الكتالوجات والمراجع لتحديد المتطلبات.'),$c('card_2_cta','View shop','عرض المنتجات')],
    [$c('card_3_title','Quotation Support','دعم عروض الأسعار'),$c('card_3_body','Contact Rosa with the required instrument/reference for procurement assistance.','تواصل مع روزا بالمراجع المطلوبة للحصول على مساعدة التوريد.'),$c('card_3_cta','Contact us','اتصل بنا')],
];
$link = home_url($locale==='ar'?'/ar/shop/':'/shop/');
?>
<section class="rosa-preview-about-cards" data-preview-about-cards><div class="rosa-preview-rail rosa-preview-about-cards__grid"><?php foreach($cards as [$title,$body,$cta]): ?><article><h2><?php echo esc_html($title); ?></h2><p><?php echo esc_html($body); ?></p><a class="rosa-preview-text-link" href="<?php echo esc_url($link); ?>"><?php echo esc_html($cta); ?></a></article><?php endforeach; ?></div></section>
