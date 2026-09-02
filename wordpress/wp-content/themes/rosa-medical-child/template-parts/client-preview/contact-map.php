<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'contact', $key, $locale, $locale === 'ar' ? $ar : $en);
$address = rosa_preview_business_value('address', $locale);
$mapAddress = rosa_theme_business_value('address');
?>
<section class="rosa-preview-map" data-preview-map-role><div class="rosa-preview-rail"><div class="rosa-preview-map__panel"><p class="rosa-preview-eyebrow"><?php echo esc_html($c('map_eyebrow','Location','الموقع')); ?></p><h2><?php echo esc_html($address); ?></h2><?php if($mapAddress!==''): ?><a class="rosa-preview-button" href="<?php echo esc_url('https://www.google.com/maps/search/?api=1&query='.rawurlencode($mapAddress)); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($c('map_button','Search on maps','البحث في الخرائط')); ?></a><?php endif; ?></div></div></section>
