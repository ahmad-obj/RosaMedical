<?php

$root = dirname(__DIR__, 2);
$clientPreviewPath = $root . '/wp-content/themes/rosa-medical-child/inc/client-preview.php';
$mediaSlotPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php';
$heroPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php';

foreach ([$clientPreviewPath, $mediaSlotPath, $heroPath] as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing dependency: {$path}\n");
        exit(1);
    }
}

$clientPreview = (string) file_get_contents($clientPreviewPath);
$mediaSlot = (string) file_get_contents($mediaSlotPath);
$hero = (string) file_get_contents($heroPath);

$expected = [
    'home-hero-01-desktop' => ['latest-home/hero-01.webp', 'assets/media/curated/home-hero-01.webp'],
    'home-hero-01-mobile' => ['latest-home/hero-01.webp', 'assets/media/curated/home-hero-01.webp'],
    'home-hero-02-desktop' => ['latest-home/hero-02.webp', 'assets/media/curated/home-who-01.webp'],
    'home-hero-02-mobile' => ['latest-home/hero-02.webp', 'assets/media/curated/home-who-01.webp'],
    'home-hero-03-desktop' => ['latest-home/hero-03.webp', 'assets/media/curated/home-feature-01.webp'],
    'home-hero-03-mobile' => ['latest-home/hero-03.webp', 'assets/media/curated/home-feature-01.webp'],
    'home-hero-04-desktop' => ['latest-home/hero-04.webp', 'assets/media/curated/home-why-01.webp'],
    'home-hero-04-mobile' => ['latest-home/hero-04.webp', 'assets/media/curated/home-why-01.webp'],
    'home-specialty-plastic-surgery' => ['latest-home/specialty-plastic-surgery.webp', 'assets/media/curated/about-procurement.jpg'],
    'home-specialty-orthopedics' => ['latest-home/specialty-orthopedics.webp', 'assets/media/curated/about-hospitals.jpg'],
    'home-specialty-maxillofacial' => ['latest-home/specialty-maxillofacial.webp', 'assets/media/curated/home-evidence-01.jpg'],
    'home-specialty-orthodontics' => ['latest-home/specialty-orthodontics.webp', 'assets/media/curated/home-promo-04.jpg'],
    'home-specialty-spine' => ['latest-home/specialty-spine.webp', 'assets/media/curated/about-international.webp'],
    'home-securing-confidence' => ['latest-home/securing-confidence.webp', 'assets/media/curated/prefooter-person-01.webp'],
];

foreach (['function rosa_preview_curated_media_candidates', 'function rosa_preview_curated_media_url'] as $needle) {
    if (strpos($clientPreview, $needle) === false) {
        fwrite(STDERR, "Missing curated-media helper contract: {$needle}\n");
        exit(1);
    }
}

$themeRoot = $root . '/wp-content/themes/rosa-medical-child/';
foreach ($expected as $slot => [$generated, $fallback]) {
    if (strpos($clientPreview, "'{$slot}'") === false
        || strpos($clientPreview, $generated) === false
        || strpos($clientPreview, $fallback) === false) {
        fwrite(STDERR, "Incomplete curated mapping for {$slot}\n");
        exit(1);
    }

    if (! is_file($themeRoot . $fallback) || filesize($themeRoot . $fallback) <= 0) {
        fwrite(STDERR, "Missing safe fallback asset for {$slot}: {$fallback}\n");
        exit(1);
    }
}

if (strpos($mediaSlot, 'rosa_preview_curated_media_url($slot)') === false) {
    fwrite(STDERR, "Shared media slot does not use latest-home curated fallback resolution\n");
    exit(1);
}

foreach (['$desktopSlot', '$mobileSlot', 'rosa_preview_curated_media_url($desktopSlot)', 'rosa_preview_curated_media_url($mobileSlot)'] as $needle) {
    if (strpos($hero, $needle) === false) {
        fwrite(STDERR, "Latest homepage hero fallback missing: {$needle}\n");
        exit(1);
    }
}

echo "PASS: all 14 latest-home media slots have generated-image priority and safe fallback coverage\n";
