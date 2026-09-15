<?php

$root = dirname(__DIR__, 2);
$theme = $root . '/wp-content/themes/rosa-medical-child';

$mediaPath = $theme . '/template-parts/client-preview/media-slot.php';
$cssPath = $theme . '/assets/css/client-preview.css';
$helpersPath = $theme . '/inc/client-preview.php';
$cardsPath = $theme . '/template-parts/client-preview/about-cards.php';
$proofPath = $theme . '/template-parts/client-preview/about-proof.php';
$mediaFieldPath = $root . '/wp-content/plugins/rosa-medical-core/src/Admin/MediaField.php';

foreach ([$mediaPath, $cssPath, $helpersPath, $cardsPath, $proofPath, $mediaFieldPath] as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing curated media contract dependency: {$path}\n");
        exit(1);
    }
}

$media = (string) file_get_contents($mediaPath);
$css = (string) file_get_contents($cssPath);
$helpers = (string) file_get_contents($helpersPath);
$cards = (string) file_get_contents($cardsPath);
$proof = (string) file_get_contents($proofPath);
$mediaField = (string) file_get_contents($mediaFieldPath);

/* Client-selected WordPress media remains authoritative, but unsafe historical
   attachments are rejected before an audited local fallback is considered. */
if (strpos($media, 'if ($imageId > 0)') === false
    || strpos($media, "elseif (\$fallbackUrl !== '')") === false
    || strpos($media, 'rosa_preview_is_safe_media_id') === false
    || strpos($helpers, 'function rosa_preview_is_safe_media_id') === false) {
    fwrite(STDERR, "Safe client-media precedence contract is incomplete\n");
    exit(1);
}

if (strpos($media, 'rosa-preview-media-slot__image--curated-fallback') === false
    || strpos($css, '.rosa-preview-media-slot__image--curated-fallback') === false
    || strpos($css, 'grayscale(.82)') === false) {
    fwrite(STDERR, "Curated fallback grey-tone contract is incomplete\n");
    exit(1);
}

/* About now uses message-specific instrument/catalogue slots rather than the
   earlier generic hospital/international stock fallbacks. */
foreach ([
    'about-who-instruments',
    'about-product-families',
    'about-catalogue-support',
    'about-feature-instruments',
    'about-proof-instruments',
] as $slot) {
    if (strpos($media, "'{$slot}'") === false) {
        fwrite(STDERR, "Missing audited About fallback slot: {$slot}\n");
        exit(1);
    }
}

foreach ([
    'assets/media/curated/about-procurement.jpg',
    'assets/media/curated/about-hospitals.jpg',
    'assets/media/curated/about-international.webp',
] as $legacyStock) {
    if (strpos($media, $legacyStock) !== false || strpos($helpers, $legacyStock) !== false) {
        fwrite(STDERR, "Historical generic About stock remains in an active fallback chain: {$legacyStock}\n");
        exit(1);
    }
}

if (strpos($cards, "'about-product-families'") === false
    || strpos($cards, "'about-catalogue-support'") === false
    || strpos($proof, "'slot' => 'about-proof-instruments'") === false) {
    fwrite(STDERR, "About templates are not wired to the audited semantic image slots\n");
    exit(1);
}

/* Existing admin keys remain replaceable so this audit does not break the
   client's established content-control contract. */
foreach ([
    "'about_procurement' => 'Who We Are image'",
    "'about_hospitals' => 'Feature banner image'",
    "'about_international' => 'Proof image'",
] as $needle) {
    if (strpos($mediaField, $needle) === false) {
        fwrite(STDERR, "About media control disappeared: {$needle}\n");
        exit(1);
    }
}

/* Shop family navigation must always have local, catalogue-specific artwork. */
$familyAssets = [
    'catalogue-family-knives' => 'assets/media/homepage-covers/knives-family-cover-full.svg',
    'catalogue-family-scissors' => 'assets/media/homepage-covers/scissors-family-cover-full.svg',
    'catalogue-family-punches' => 'assets/media/homepage-covers/punches-family-cover.webp',
    'catalogue-family-chisels' => 'assets/media/homepage-covers/chisels-family-cover-full.svg',
    'catalogue-family-cutters' => 'assets/media/homepage-covers/cutters-family-cover-full.svg',
];

foreach ($familyAssets as $slot => $asset) {
    if (strpos($media, "'{$slot}'") === false || strpos($media, $asset) === false) {
        fwrite(STDERR, "Missing catalogue-family fallback mapping for {$slot}\n");
        exit(1);
    }
    $path = $theme . '/' . $asset;
    if (! is_file($path) || filesize($path) <= 0) {
        fwrite(STDERR, "Missing or empty catalogue-family asset: {$asset}\n");
        exit(1);
    }
}

/* Current hero family must have responsive local derivatives. */
for ($slide = 1; $slide <= 4; $slide++) {
    foreach (['desktop.webp', 'desktop.avif', 'mobile.webp'] as $suffix) {
        $asset = sprintf('assets/media/home-hero/client-v5/hero-%02d-%s', $slide, $suffix);
        $path = $theme . '/' . $asset;
        if (! is_file($path) || filesize($path) <= 0) {
            fwrite(STDERR, "Missing or empty approved hero derivative: {$asset}\n");
            exit(1);
        }
    }
}

/* Fallback images expose intrinsic dimensions to reduce layout shift. */
foreach (['getimagesize', 'width=', 'height='] as $needle) {
    if (strpos($media, $needle) === false) {
        fwrite(STDERR, "Intrinsic fallback dimension contract missing: {$needle}\n");
        exit(1);
    }
}

echo "PASS: audited local imagery fallbacks, semantic About media, responsive heroes, and client override controls are preserved\n";
