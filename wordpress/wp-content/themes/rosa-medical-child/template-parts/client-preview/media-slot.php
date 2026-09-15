<?php
if (! defined('ABSPATH')) { exit; }

$slot = sanitize_html_class((string) ($args['slot'] ?? 'media-slot'));
$label = (string) ($args['label'] ?? 'ROSA');
$class = trim((string) ($args['class'] ?? ''));
$imageId = isset($args['image_id']) && is_scalar($args['image_id'])
    ? max(0, (int) $args['image_id'])
    : (function_exists('rosa_preview_media_id') ? rosa_preview_media_id($slot) : 0);

$fallbackMedia = [
    'home-hero-01' => 'assets/media/home-hero/client-v5/hero-01-desktop.webp',
    'home-who-01' => 'assets/media/home-hero/v1/home-hero-03-desktop.webp',
    'home-feature-01' => 'assets/media/home-hero/v1/home-hero-02-desktop.webp',
    'home-promo-01' => 'assets/media/homepage-covers/knives-family-cover-full.svg',
    'home-promo-02' => 'assets/media/homepage-covers/scissors-family-cover-full.svg',
    'home-promo-03' => 'assets/media/homepage-covers/punches-family-cover.webp',
    'home-promo-04' => 'assets/media/curated/home-promo-04.jpg',
    'home-why-01' => 'assets/media/home-hero/v1/home-hero-04-desktop.webp',
    'home-evidence-01' => 'assets/media/curated/home-evidence-01.jpg',
    'prefooter-person-01' => 'assets/media/curated/prefooter-person-01.webp',

    // Audited About defaults: instrument/catalogue-led instead of generic stock.
    'about-who-instruments' => 'assets/media/home-hero/v1/home-hero-03-desktop.webp',
    'about-product-families' => 'assets/media/home-hero/v1/home-hero-04-desktop.webp',
    'about-catalogue-support' => 'assets/media/homepage-covers/scissors-family-cover-full.svg',
    'about-feature-instruments' => 'assets/media/home-hero/v1/home-hero-01-desktop.webp',
    'about-proof-instruments' => 'assets/media/curated/home-evidence-01.jpg',

    // Backward-compatible old slot names now resolve to audited instrument-led defaults.
    'about_procurement' => 'assets/media/home-hero/v1/home-hero-03-desktop.webp',
    'about_hospitals' => 'assets/media/home-hero/v1/home-hero-01-desktop.webp',
    'about_international' => 'assets/media/curated/home-evidence-01.jpg',

    // Shop family-navigation cards must never fall through to a text placeholder.
    'catalogue-family-knives' => 'assets/media/homepage-covers/knives-family-cover-full.svg',
    'catalogue-family-scissors' => 'assets/media/homepage-covers/scissors-family-cover-full.svg',
    'catalogue-family-punches' => 'assets/media/homepage-covers/punches-family-cover.webp',
    'catalogue-family-chisels' => 'assets/media/homepage-covers/chisels-family-cover-full.svg',
    'catalogue-family-cutters' => 'assets/media/homepage-covers/cutters-family-cover-full.svg',
];

$fallbackRelative = $fallbackMedia[$slot] ?? '';
$fallbackUrl = $fallbackRelative !== '' && function_exists('get_stylesheet_directory_uri')
    ? trailingslashit(get_stylesheet_directory_uri()) . $fallbackRelative
    : '';

if ($fallbackUrl === '' && function_exists('rosa_preview_curated_media_url')) {
    $fallbackUrl = rosa_preview_curated_media_url($slot);
}

$fallbackWidth = 0;
$fallbackHeight = 0;
if ($fallbackRelative !== '' && function_exists('get_stylesheet_directory')) {
    $fallbackPath = trailingslashit(get_stylesheet_directory()) . ltrim($fallbackRelative, '/');
    if (is_file($fallbackPath)) {
        $imageSize = @getimagesize($fallbackPath);
        if (is_array($imageSize)) {
            $fallbackWidth = max(0, (int) ($imageSize[0] ?? 0));
            $fallbackHeight = max(0, (int) ($imageSize[1] ?? 0));
        }
    }
}
?>
<div class="rosa-preview-media-slot<?php echo $class !== '' ? ' ' . esc_attr($class) : ''; ?>" data-media-slot="<?php echo esc_attr($slot); ?>" role="img" aria-label="<?php echo esc_attr($label); ?>"><?php if ($imageId > 0) : ?><?php echo wp_get_attachment_image($imageId, 'full', false, ['class' => 'rosa-preview-media-slot__image', 'alt' => '']); ?><?php elseif ($fallbackUrl !== '') : ?><img class="rosa-preview-media-slot__image rosa-preview-media-slot__image--curated-fallback" src="<?php echo esc_url($fallbackUrl); ?>" alt="" loading="<?php echo $slot === 'home-hero-01' ? 'eager' : 'lazy'; ?>" decoding="async"<?php echo $slot === 'home-hero-01' ? ' fetchpriority="high"' : ''; ?><?php echo $fallbackWidth > 0 ? ' width="' . esc_attr((string) $fallbackWidth) . '"' : ''; ?><?php echo $fallbackHeight > 0 ? ' height="' . esc_attr((string) $fallbackHeight) . '"' : ''; ?>><?php else : ?><span aria-hidden="true">ROSA</span><?php endif; ?></div>
