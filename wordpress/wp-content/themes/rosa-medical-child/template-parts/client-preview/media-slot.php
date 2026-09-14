<?php
if (! defined('ABSPATH')) { exit; }

$slot = sanitize_html_class((string) ($args['slot'] ?? 'media-slot'));
$label = (string) ($args['label'] ?? 'ROSA');
$class = trim((string) ($args['class'] ?? ''));
$imageId = isset($args['image_id']) && is_scalar($args['image_id'])
    ? max(0, (int) $args['image_id'])
    : (function_exists('rosa_preview_media_id') ? rosa_preview_media_id($slot) : 0);

$fallbackMedia = [
    'home-hero-01' => 'assets/media/curated/home-hero-01.webp',
    'home-who-01' => 'assets/media/curated/home-who-01.webp',
    'home-feature-01' => 'assets/media/curated/home-feature-01.webp',
    'home-promo-01' => 'assets/media/homepage-covers/knives-family-cover-full.svg',
    'home-promo-02' => 'assets/media/homepage-covers/scissors-family-cover-full.svg',
    'home-promo-03' => 'assets/media/homepage-covers/punches-family-cover.webp',
    'home-promo-04' => 'assets/media/curated/home-promo-04.jpg',
    'home-why-01' => 'assets/media/curated/home-why-01.webp',
    'home-evidence-01' => 'assets/media/curated/home-evidence-01.jpg',
    'prefooter-person-01' => 'assets/media/curated/prefooter-person-01.webp',
    'about_procurement' => 'assets/media/curated/about-procurement.jpg',
    'about_hospitals' => 'assets/media/curated/about-hospitals.jpg',
    'about_international' => 'assets/media/curated/about-international.webp',
];

$fallbackUrl = isset($fallbackMedia[$slot]) && function_exists('get_stylesheet_directory_uri')
    ? trailingslashit(get_stylesheet_directory_uri()) . $fallbackMedia[$slot]
    : '';
?>
<div class="rosa-preview-media-slot<?php echo $class !== '' ? ' ' . esc_attr($class) : ''; ?>" data-media-slot="<?php echo esc_attr($slot); ?>" role="img" aria-label="<?php echo esc_attr($label); ?>"><?php if ($imageId > 0) : ?><?php echo wp_get_attachment_image($imageId, 'full', false, ['class' => 'rosa-preview-media-slot__image', 'alt' => '']); ?><?php elseif ($fallbackUrl !== '') : ?><img class="rosa-preview-media-slot__image rosa-preview-media-slot__image--curated-fallback" src="<?php echo esc_url($fallbackUrl); ?>" alt="" loading="<?php echo $slot === 'home-hero-01' ? 'eager' : 'lazy'; ?>" decoding="async"<?php echo $slot === 'home-hero-01' ? ' fetchpriority="high"' : ''; ?>><?php else : ?><span aria-hidden="true">ROSA</span><?php endif; ?></div>
