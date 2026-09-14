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

$specialties = [
    'home-specialty-plastic-surgery' => 'assets/media/curated/about-procurement.jpg',
    'home-specialty-orthopedics' => 'assets/media/curated/about-hospitals.jpg',
    'home-specialty-maxillofacial' => 'assets/media/curated/home-evidence-01.jpg',
    'home-specialty-orthodontics' => 'assets/media/curated/home-promo-04.jpg',
    'home-specialty-spine' => 'assets/media/curated/about-international.webp',
    'home-securing-confidence' => 'assets/media/curated/prefooter-person-01.webp',
];

foreach ($specialties as $slot => $fallback) {
    if (strpos($clientPreview, "'{$slot}'") === false || strpos($clientPreview, $fallback) === false) {
        fwrite(STDERR, "Incomplete curated specialty fallback for {$slot}\n");
        exit(1);
    }
}

if (strpos($mediaSlot, 'rosa_preview_curated_media_url($slot)') === false) {
    fwrite(STDERR, "Shared media slot does not retain curated fallback resolution\n");
    exit(1);
}

foreach ([
    "rosa_preview_reference_hero_url(\$index + 1, 'desktop')",
    "rosa_preview_reference_hero_url(\$index + 1, 'mobile')",
] as $needle) {
    if (strpos($hero, $needle) === false) {
        fwrite(STDERR, "Latest homepage hero does not use the restored old banner source: {$needle}\n");
        exit(1);
    }
}

echo "PASS: latest-home specialties retain curated fallbacks and hero uses restored original banners\n";
