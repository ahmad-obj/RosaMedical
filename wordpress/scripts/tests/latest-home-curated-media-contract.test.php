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
    'home-hero-01-desktop' => 'latest-home/hero-01.webp',
    'home-hero-01-mobile' => 'latest-home/hero-01.webp',
    'home-hero-02-desktop' => 'latest-home/hero-02.webp',
    'home-hero-02-mobile' => 'latest-home/hero-02.webp',
    'home-hero-03-desktop' => 'latest-home/hero-03.webp',
    'home-hero-03-mobile' => 'latest-home/hero-03.webp',
    'home-hero-04-desktop' => 'latest-home/hero-04.webp',
    'home-hero-04-mobile' => 'latest-home/hero-04.webp',
    'home-specialty-plastic-surgery' => 'latest-home/specialty-plastic-surgery.webp',
    'home-specialty-orthopedics' => 'latest-home/specialty-orthopedics.webp',
    'home-specialty-maxillofacial' => 'latest-home/specialty-maxillofacial.webp',
    'home-specialty-orthodontics' => 'latest-home/specialty-orthodontics.webp',
    'home-specialty-spine' => 'latest-home/specialty-spine.webp',
    'home-securing-confidence' => 'latest-home/securing-confidence.webp',
];

if (strpos($clientPreview, 'function rosa_preview_curated_media_url') === false) {
    fwrite(STDERR, "Missing centralized curated-media URL helper\n");
    exit(1);
}

foreach ($expected as $slot => $asset) {
    if (strpos($clientPreview, "'{$slot}'") === false || strpos($clientPreview, $asset) === false) {
        fwrite(STDERR, "Missing curated mapping for {$slot}\n");
        exit(1);
    }
}

if (strpos($mediaSlot, 'rosa_preview_curated_media_url($slot)') === false) {
    fwrite(STDERR, "Shared media slot is not using centralized curated-media helper\n");
    exit(1);
}

if (substr_count($hero, 'rosa_preview_curated_media_url(') < 2) {
    fwrite(STDERR, "Latest homepage hero does not fall back through curated desktop/mobile media\n");
    exit(1);
}

$themeRoot = $root . '/wp-content/themes/rosa-medical-child/assets/media/curated/latest-home/';
foreach (array_unique(array_values($expected)) as $asset) {
    $file = $themeRoot . basename($asset);
    if (! is_file($file) || filesize($file) <= 0) {
        fwrite(STDERR, "Missing generated curated asset: " . basename($asset) . "\n");
        exit(1);
    }
}

echo "PASS: latest homepage curated imagery covers all remaining media placeholders\n";
