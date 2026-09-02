<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
?>
<section class="rosa-preview-family-strip" data-preview-family-strip data-preview-proof-role><div class="rosa-preview-rail"><div class="rosa-preview-family-strip__items"><?php foreach(['Knives','Scissors','Punches','Chisels','Cutters'] as $family): ?><span><?php echo esc_html(rosa_preview_family_label($family, $locale)); ?></span><?php endforeach; ?></div><div class="rosa-preview-proof"><strong><?php echo esc_html($c('proof_1','Clear catalogue references','مراجع كتالوج واضحة')); ?></strong><strong><?php echo esc_html($c('proof_2','Contextual product imagery','صور سياقية')); ?></strong><strong><?php echo esc_html($c('proof_3','Direct contact support','دعم تواصل مباشر')); ?></strong></div></div></section>
