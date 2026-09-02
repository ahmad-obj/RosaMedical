<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, $locale === 'ar' ? $ar : $en);
$items = [
    [$c('why_1_title', 'Clear references', 'مراجع واضحة'), $c('why_1_body', 'Work with family names and product references.', 'استخدم أسماء الفئات ومراجع المنتجات.')],
    [$c('why_2_title', 'Exact configurations', 'تكوينات دقيقة'), $c('why_2_body', 'Review the real options available for each instrument.', 'راجع الخيارات الفعلية لكل أداة.')],
    [$c('why_3_title', 'Direct support', 'تواصل مباشر'), $c('why_3_body', 'Share requirements for quotation support.', 'شارك متطلباتك لطلب عرض سعر.')],
];
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'home-why-01');
?>
<section class="rosa-preview-why" data-home-section="why"><div class="rosa-preview-rail rosa-preview-why__layout"><div class="rosa-preview-why__intro"><p class="rosa-preview-eyebrow"><?php echo esc_html($c('why_eyebrow', 'ROSA', 'ROSA')); ?></p><h2><?php echo esc_html($c('why_title', 'Support built around instrument procurement', 'دعم يركز على احتياجات توريد الأدوات')); ?></h2><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-why-01', 'label' => 'Rosa instrument procurement', 'image_id' => $imageId]); ?></div><div class="rosa-preview-why__cards"><?php foreach ($items as $index => [$title, $body]) : ?><article><span><?php echo esc_html((string) ($index + 1)); ?></span><div><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></div></article><?php endforeach; ?></div></div></section>
