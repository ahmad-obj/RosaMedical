<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
$items = [
    [$c('why_1_title','Organized families','فئات منظمة'),$c('why_1_body','Browse instruments across five primary families.','تصفح الأدوات ضمن خمس فئات رئيسية.')],
    [$c('why_2_title','Shareable references','مراجع قابلة للمشاركة'),$c('why_2_body','Use product names and references when contacting Rosa.','استخدم أسماء المنتجات والمراجع عند التواصل.')],
    [$c('why_3_title','Direct contact','قناة تواصل مباشرة'),$c('why_3_body','Use email or phone for procurement support.','تواصل بالبريد أو الهاتف للحصول على مساعدة التوريد.')],
];
?>
<section class="rosa-preview-why" data-preview-why-us><div class="rosa-preview-rail"><h2><?php echo esc_html($c('why_title','Support built around instrument procurement','دعم يركز على احتياجات توريد الأدوات')); ?></h2><div class="rosa-preview-why__grid"><?php foreach($items as [$title,$body]): ?><article><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></article><?php endforeach; ?></div></div></section>
