<?php
if (! defined('ABSPATH')) { exit; }
$locale = $args['locale'] ?? rosa_preview_locale();
$imageId = (int) ($args['image_id'] ?? rosa_preview_media_id('hero'));
$title = (string) ($args['title'] ?? rosa_preview_copy('hero_title', $locale));
$body = (string) ($args['body'] ?? rosa_preview_copy('hero_body', $locale));
?>
<section class="rosa-preview-hero" data-preview-hero><div class="rosa-preview-rail rosa-preview-hero__grid"><div class="rosa-preview-hero__copy"><p class="rosa-preview-eyebrow"><?php echo esc_html(rosa_preview_copy('hero_eyebrow', $locale)); ?></p><h1><?php echo esc_html($title); ?></h1><p><?php echo esc_html($body); ?></p><div class="rosa-preview-actions"><a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/shop/' : '/shop/')); ?>"><?php echo esc_html(rosa_preview_copy('browse_products', $locale)); ?></a><a class="rosa-preview-text-link" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/' : '/contact/')); ?>"><?php echo esc_html(rosa_preview_copy('contact_us', $locale)); ?></a></div></div><div class="rosa-preview-hero__media"><?php if ($imageId > 0) echo wp_get_attachment_image($imageId, 'full', false, ['loading'=>'eager']); ?></div></div></section>
