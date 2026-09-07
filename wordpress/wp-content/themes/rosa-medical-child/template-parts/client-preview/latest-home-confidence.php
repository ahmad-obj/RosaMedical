<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$slot = 'home-securing-confidence';
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', $slot);
$imageUrl = $imageId > 0 ? wp_get_attachment_image_url($imageId, 'full') : '';
?>
<section class="section home-confidence" data-section="securing-confidence" aria-labelledby="home-confidence-title">
    <div class="container container--wide home-confidence__grid">
        <div class="home-confidence__copy">
            <h2 id="home-confidence-title" class="home-compact-section-title"><?php echo esc_html($c('confidence_title')); ?></h2>
            <p class="home-editorial-copy"><?php echo esc_html($c('confidence_body')); ?></p>
        </div>
        <div class="home-confidence__media-reveal">
            <div class="home-clinical-media home-clinical-media--portrait">
                <?php if (is_string($imageUrl) && $imageUrl !== '') : ?>
                    <img class="home-clinical-media__image" src="<?php echo esc_url($imageUrl); ?>" alt="<?php echo esc_attr($c('confidence_image_alt')); ?>" loading="lazy" decoding="async" style="object-position:52% 50%">
                <?php else : ?>
                    <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $slot, 'label' => 'Rosa clinical support media', 'class' => 'home-clinical-media__placeholder', 'image_id' => 0]); ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
