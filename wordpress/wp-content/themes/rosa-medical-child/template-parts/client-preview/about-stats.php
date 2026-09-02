<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
$stats = [
    [$c('stat_1_value','5','5'),$c('stat_1_label','Product families','فئات منتجات')],
    [$c('stat_2_value','5','5'),$c('stat_2_label','Catalogue PDFs','كتالوجات')],
    [$c('stat_3_value','2','2'),$c('stat_3_label','Preview languages','لغات للمعاينة')],
];
?>
<section class="rosa-preview-stats" data-preview-stats><div class="rosa-preview-rail rosa-preview-stats__grid"><?php foreach($stats as [$n,$label]): ?><div><strong><?php echo esc_html($n); ?></strong><span><?php echo esc_html($label); ?></span></div><?php endforeach; ?></div></section>
