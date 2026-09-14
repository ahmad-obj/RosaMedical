<?php

$root = dirname(__DIR__, 2);
$theme = $root . '/wp-content/themes/rosa-medical-child';

$familyPath = $theme . '/template-parts/client-preview/latest-home-family-discovery.php';
$heroPath = $theme . '/template-parts/client-preview/latest-home-hero.php';
$legacyHeroPath = $theme . '/template-parts/client-preview/hero.php';
$pageHeroPath = $theme . '/template-parts/client-preview/page-hero.php';
$helpersPath = $theme . '/inc/client-preview.php';
$functionsPath = $theme . '/functions.php';
$cssPath = $theme . '/assets/css/home-visual-restoration.css';
$jsPath = $theme . '/assets/js/home-visual-restoration.js';

foreach ([$familyPath, $heroPath, $legacyHeroPath, $pageHeroPath, $helpersPath, $functionsPath] as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing dependency: {$path}\n");
        exit(1);
    }
}

$family = (string) file_get_contents($familyPath);
$hero = (string) file_get_contents($heroPath);
$legacyHero = (string) file_get_contents($legacyHeroPath);
$pageHero = (string) file_get_contents($pageHeroPath);
$helpers = (string) file_get_contents($helpersPath);
$functions = (string) file_get_contents($functionsPath);
$css = is_file($cssPath) ? (string) file_get_contents($cssPath) : '';
$js = is_file($jsPath) ? (string) file_get_contents($jsPath) : '';

$expectedFamilies = ['scissors', 'cutters', 'punches', 'chisels', 'knives'];
$offset = -1;
foreach ($expectedFamilies as $slug) {
    $needle = "'slug' => '{$slug}'";
    $next = strpos($family, $needle);
    if ($next === false || $next <= $offset) {
        fwrite(STDERR, "Catalogue family order is wrong at {$slug}\n");
        exit(1);
    }
    $offset = $next;
}

if (strpos($family, "get_stylesheet_directory_uri()") === false
    || strpos($family, "assets/media/homepage-covers/") === false) {
    fwrite(STDERR, "Catalogue covers do not use stable child-theme fallbacks\n");
    exit(1);
}

if (strpos($helpers, 'function rosa_preview_reference_hero_url') === false) {
    fwrite(STDERR, "Missing old-reference hero URL helper\n");
    exit(1);
}

for ($slide = 1; $slide <= 4; $slide++) {
    foreach (['desktop', 'mobile'] as $kind) {
        $name = sprintf('home-hero-%02d-%s.webp', $slide, $kind);
        $asset = $theme . '/assets/media/home-hero/v1/' . $name;
        if (! is_file($asset) || filesize($asset) <= 0) {
            fwrite(STDERR, "Missing old hero asset: {$name}\n");
            exit(1);
        }
    }
}

foreach ([
    'rosa_preview_reference_hero_url($index + 1, \'desktop\')',
    'rosa_preview_reference_hero_url($index + 1, \'mobile\')',
] as $needle) {
    if (strpos($hero, $needle) === false) {
        fwrite(STDERR, "Latest hero does not use exact old banner defaults: {$needle}\n");
        exit(1);
    }
}

if (strpos($legacyHero, 'data-restored-home-hero') === false) {
    fwrite(STDERR, "Legacy/current Home hero is not using the restored four-banner path\n");
    exit(1);
}

if (strpos($js, 'const HERO_AUTOPLAY_MS = 4750;') === false
    || strpos($js, 'prefers-reduced-motion: reduce') === false
    || strpos($js, 'document.hidden') === false) {
    fwrite(STDERR, "Restored hero interaction contract is incomplete\n");
    exit(1);
}

if (strpos($pageHero, '$heroSlide = $isContact ? 4 : 2;') === false
    || strpos($pageHero, 'rosa_preview_reference_hero_url($heroSlide, \'desktop\')') === false
    || strpos($pageHero, 'rosa_preview_reference_hero_url($heroSlide, \'mobile\')') === false) {
    fwrite(STDERR, "About/Contact fixed hero mapping is incomplete\n");
    exit(1);
}

foreach ([
    'grid-template-columns: repeat(5, minmax(0, 1fr))',
    'filter: none !important',
    '.rosa-preview-page-hero__media',
    '.rosa-preview-about-feature__media::after',
    '.rosa-preview-about-evidence__media::after',
] as $needle) {
    if (strpos($css, $needle) === false) {
        fwrite(STDERR, "Visual restoration CSS contract missing: {$needle}\n");
        exit(1);
    }
}

if (preg_match('/home-family-gallery__image[^}]*filter:\s*(grayscale|saturate\(0)/s', $css)) {
    fwrite(STDERR, "Catalogue images are still desaturated\n");
    exit(1);
}

foreach ([
    'rgb(224 8 21',
    '#e00815',
    '#b90a14',
    '#b9000b',
] as $redNeedle) {
    if (strpos($css, $redNeedle) !== false) {
        fwrite(STDERR, "Restoration stylesheet contains a red photographic wash token: {$redNeedle}\n");
        exit(1);
    }
}

if (strpos($functions, "'rosa-home-visual-restoration'") === false) {
    fwrite(STDERR, "Restoration stylesheet/script are not enqueued\n");
    exit(1);
}

echo "PASS: homepage catalogue, four-banner hero, neutral overlays, and secondary photographic heroes are pinned\n";
