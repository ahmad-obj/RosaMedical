<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'about_procurement');
?>
<section class="rosa-preview-split" data-preview-who-we-are><div class="rosa-preview-rail rosa-preview-split__grid"><div class="rosa-preview-split__media"><?php if($imageId>0) echo wp_get_attachment_image($imageId,'large'); ?></div><div><p class="rosa-preview-eyebrow"><?php echo esc_html($c('who_eyebrow', 'Who we are', 'من نحن')); ?></p><h2><?php echo esc_html($c('who_title', 'A focused medical-instrument supply partner.', 'شريك متخصص في توريد الأدوات الطبية.')); ?></h2><p><?php echo esc_html($c('who_body', 'Rosa helps buyers navigate instrument families and catalogue references, then contact the team for procurement support.', 'يساعد موقع روزا المشترين على التنقل بين فئات الأدوات ومراجع الكتالوج والتواصل للحصول على دعم التوريد.')); ?></p></div></div></section>
