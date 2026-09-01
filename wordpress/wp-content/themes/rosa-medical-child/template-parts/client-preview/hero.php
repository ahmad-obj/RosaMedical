<?php
if (! defined('ABSPATH')) { exit; }
$locale = $args['locale'] ?? rosa_preview_locale();
$title = (string) ($args['title'] ?? rosa_preview_copy('hero_title', $locale));
$body = (string) ($args['body'] ?? rosa_preview_copy('hero_body', $locale));
?>
<section class="rosa-preview-hero" data-home-section="hero">
    <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-hero-01', 'label' => 'Rosa medical hero media', 'class' => 'rosa-preview-hero__media']); ?>
    <div class="rosa-preview-rail rosa-preview-hero__inner"><div class="rosa-preview-hero__copy"><p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html(rosa_preview_copy('hero_eyebrow', $locale)); ?></p><h1><?php echo esc_html($title); ?></h1><p><?php echo esc_html($body); ?></p><a class="rosa-preview-button rosa-preview-button--light" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/shop/' : '/shop/')); ?>"><?php echo esc_html(rosa_preview_copy('browse_products', $locale)); ?></a></div></div>
</section>
