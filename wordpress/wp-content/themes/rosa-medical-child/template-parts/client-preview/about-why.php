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
<section class="rosa-preview-why" data-preview-why-us>
  <div class="rosa-preview-rail rosa-preview-about-why__layout">
    <div class="rosa-preview-about-why__intro">
      <p class="rosa-preview-eyebrow"><?php echo esc_html($locale === 'ar' ? 'لماذا روزا' : 'Why Rosa'); ?></p>
      <h2><?php echo esc_html($c('why_title','Support built around instrument procurement','دعم يركز على احتياجات توريد الأدوات')); ?></h2>
    </div>
    <div class="rosa-preview-why__grid">
      <?php foreach($items as $index => [$title,$body]): ?>
        <article>
          <span class="rosa-preview-about-why__number" aria-hidden="true"><?php echo esc_html(sprintf('%02d', $index + 1)); ?></span>
          <div class="rosa-preview-about-why__copy">
            <h3><?php echo esc_html($title); ?></h3>
            <p><?php echo esc_html($body); ?></p>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
