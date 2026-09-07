<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'about', $key, $locale, $locale === 'ar' ? $ar : $en);
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'about_international');
$proof = [
    $c('proof_1','Clear catalogue references','مراجع كتالوج واضحة'),
    $c('proof_2','Contextual product imagery','صور سياقية'),
    $c('proof_3','Direct contact support','دعم تواصل مباشر'),
];
?>
<section class="rosa-preview-about-proof-shell" data-preview-family-strip data-preview-proof-role>
  <div class="rosa-preview-about-evidence" data-preview-about-evidence>
    <div class="rosa-preview-about-evidence__media" aria-hidden="true">
      <?php if ($imageId > 0) : ?>
        <?php echo wp_get_attachment_image($imageId, 'large'); ?>
      <?php else : ?>
        <div class="rosa-preview-media-slot"><span>ROSA</span></div>
      <?php endif; ?>
    </div>
    <div class="rosa-preview-rail rosa-preview-about-evidence__content">
      <p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($locale === 'ar' ? 'دعم واضح' : 'Clear support'); ?></p>
      <h2><?php echo esc_html($locale === 'ar' ? 'مراجع أوضح لتواصل أسرع مع فريق روزا.' : 'Clearer references for faster procurement conversations.'); ?></h2>
      <p><?php echo esc_html($locale === 'ar' ? 'استخدم الفئة والمرجع والصورة المناسبة لتوضيح احتياجك.' : 'Use the family, reference and relevant imagery to make your requirement easier to understand.'); ?></p>
      <div class="rosa-preview-about-evidence__cards">
        <?php foreach ($proof as $index => $label) : ?>
          <article>
            <span><?php echo esc_html('0' . ($index + 1)); ?></span>
            <strong><?php echo esc_html($label); ?></strong>
          </article>
        <?php endforeach; ?>
      </div>
    </div>
  </div>

  <div class="rosa-preview-about-family-band">
    <div class="rosa-preview-rail rosa-preview-about-family-band__items">
      <?php foreach(['Knives','Scissors','Punches','Chisels','Cutters'] as $family): ?>
        <span><?php echo esc_html(rosa_preview_family_label($family, $locale)); ?></span>
      <?php endforeach; ?>
    </div>
  </div>
</section>
