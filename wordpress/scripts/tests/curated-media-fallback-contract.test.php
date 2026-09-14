<?php

$root = dirname(__DIR__, 2);
$mediaPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php';
$cssPath = $root . '/wp-content/themes/rosa-medical-child/assets/css/client-preview.css';
$cardsPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php';
$proofPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php';
$mediaFieldPath = $root . '/wp-content/plugins/rosa-medical-core/src/Admin/MediaField.php';

foreach ([$mediaPath, $cssPath, $cardsPath, $proofPath, $mediaFieldPath] as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing curated media contract dependency: {$path}\n");
        exit(1);
    }
}

$media = (string) file_get_contents($mediaPath);
$css = (string) file_get_contents($cssPath);
$cards = (string) file_get_contents($cardsPath);
$proof = (string) file_get_contents($proofPath);
$mediaField = (string) file_get_contents($mediaFieldPath);

$slots = [
    'home-hero-01', 'home-who-01', 'home-feature-01',
    'home-promo-01', 'home-promo-02', 'home-promo-03', 'home-promo-04',
    'home-why-01', 'home-evidence-01', 'prefooter-person-01',
    'about_procurement', 'about_hospitals', 'about_international',
];

foreach ($slots as $slot) {
    if (strpos($media, "'" . $slot . "'") === false) {
        fwrite(STDERR, "Missing curated fallback mapping for {$slot}\n");
        exit(1);
    }
}

if (strpos($media, 'if ($imageId > 0)') === false
    || strpos($media, "elseif (\$fallbackUrl !== '')") === false) {
    fwrite(STDERR, "WordPress-selected media must take priority over curated fallbacks\n");
    exit(1);
}

if (strpos($media, 'rosa-preview-media-slot__image--curated-fallback') === false
    || strpos($css, '.rosa-preview-media-slot__image--curated-fallback') === false
    || strpos($css, 'grayscale(.82)') === false) {
    fwrite(STDERR, "Curated fallback grey-tone contract is incomplete\n");
    exit(1);
}

if (strpos($cards, "'about_international'") === false
    || strpos($proof, "'slot' => 'about_international'") === false) {
    fwrite(STDERR, "About image fallbacks are not wired through the shared media slot\n");
    exit(1);
}

if (strpos($mediaField, "'about_international' => 'Proof image'") === false) {
    fwrite(STDERR, "About proof image is not client-replaceable from Rosa media controls\n");
    exit(1);
}

$assetPaths = [
    'assets/media/curated/home-hero-01.webp',
    'assets/media/curated/home-who-01.webp',
    'assets/media/curated/home-feature-01.webp',
    'assets/media/curated/home-promo-04.jpg',
    'assets/media/curated/home-why-01.webp',
    'assets/media/curated/home-evidence-01.jpg',
    'assets/media/curated/prefooter-person-01.webp',
    'assets/media/curated/about-procurement.jpg',
    'assets/media/curated/about-hospitals.jpg',
    'assets/media/curated/about-international.webp',
    'assets/media/homepage-covers/knives-family-cover-full.svg',
    'assets/media/homepage-covers/scissors-family-cover-full.svg',
    'assets/media/homepage-covers/punches-family-cover.webp',
];

$themeRoot = $root . '/wp-content/themes/rosa-medical-child/';
foreach ($assetPaths as $asset) {
    $path = $themeRoot . $asset;
    if (! is_file($path) || filesize($path) <= 0) {
        fwrite(STDERR, "Missing or empty curated media asset: {$asset}\n");
        exit(1);
    }
}

echo "PASS: curated website imagery fallbacks, grey-tone treatment, and client override contract\n";
