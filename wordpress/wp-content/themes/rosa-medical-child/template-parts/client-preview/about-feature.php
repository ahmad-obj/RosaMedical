<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'about_hospitals');
?>
<section class="rosa-preview-about-feature" data-preview-feature-banner>
  <div class="rosa-preview-about-feature__media" aria-hidden="true">
    <?php if ($imageId > 0) : ?>
      <?php echo wp_get_attachment_image($imageId, 'large'); ?>
    <?php else : ?>
      <div class="rosa-preview-media-slot"><span>ROSA</span></div>
    <?php endif; ?>
  </div>
  <div class="rosa-preview-rail rosa-preview-about-feature__content">
    <p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($c('feature_eyebrow','ROSA','ROSA')); ?></p>
    <h2><?php echo esc_html($c('feature_title','Clear support for procurement requirements','دعم واضح لاحتياجات التوريد')); ?></h2>
    <p><?php echo esc_html($c('feature_body','Start with a family or product reference, then contact us with what you need.','ابدأ بالفئة أو مرجع المنتج ثم تواصل معنا بالمطلوب.')); ?></p>
  </div>
</section>
