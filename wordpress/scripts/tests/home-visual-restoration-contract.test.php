<?php

$root = dirname(__DIR__, 2);
$theme = $root . '/wp-content/themes/rosa-medical-child';

$familyPath = $theme . '/template-parts/client-preview/latest-home-family-discovery.php';
$promoPath = $theme . '/template-parts/client-preview/home-promos.php';
$proofPath = $theme . '/template-parts/client-preview/home-proof.php';
$heroPath = $theme . '/template-parts/client-preview/latest-home-hero.php';
$legacyHeroPath = $theme . '/template-parts/client-preview/hero.php';
$pageHeroPath = $theme . '/template-parts/client-preview/page-hero.php';
$helpersPath = $theme . '/inc/client-preview.php';
$functionsPath = $theme . '/functions.php';
$cssPath = $theme . '/assets/css/home-visual-restoration.css';
$jsPath = $theme . '/assets/js/home-visual-restoration.js';

foreach ([
    $familyPath, $promoPath, $proofPath, $heroPath, $legacyHeroPath,
    $pageHeroPath, $helpersPath, $functionsPath, $cssPath, $jsPath,
] as $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing dependency: {$path}\n");
        exit(1);
    }
}

$family = (string) file_get_contents($familyPath);
$promo = (string) file_get_contents($promoPath);
$proof = (string) file_get_contents($proofPath);
$hero = (string) file_get_contents($heroPath);
$legacyHero = (string) file_get_contents($legacyHeroPath);
$pageHero = (string) file_get_contents($pageHeroPath);
$helpers = (string) file_get_contents($helpersPath);
$functions = (string) file_get_contents($functionsPath);
$css = (string) file_get_contents($cssPath);
$js = (string) file_get_contents($jsPath);

/* The catalogue must replace the old four-card promo mosaic, not the proof strip. */
if (strpos($promo, "latest-home-family-discovery") === false) {
    fwrite(STDERR, "Catalogue is not rendered from the promotions slot\n");
    exit(1);
}
foreach (['Surgical knives', 'Precision scissors', 'Punches and chisels', 'Five instrument catalogues'] as $legacyPromoText) {
    if (strpos($promo, $legacyPromoText) !== false) {
        fwrite(STDERR, "Legacy promotion content still exists in the replacement slot: {$legacyPromoText}\n");
        exit(1);
    }
}
if (strpos($proof, 'class="rosa-preview-proof"') === false
    || strpos($proof, 'latest-home-family-discovery') !== false) {
    fwrite(STDERR, "Proof strip was replaced by the catalogue instead of remaining in its original role\n");
    exit(1);
}

/* Match the old non-WordPress family ordering and assets. */
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

if (strpos($family, "assets/media/homepage-covers/") === false
    || strpos($family, "'cover' => 'punches-family-cover.webp'") === false
    || strpos($family, 'class="rosa-preview-rail') === false) {
    fwrite(STDERR, "Catalogue does not use the exact stable old-site cover/container contract\n");
    exit(1);
}

$punchesAsset = $theme . '/assets/media/homepage-covers/punches-family-cover.webp';
if (! is_file($punchesAsset) || filesize($punchesAsset) <= 0) {
    fwrite(STDERR, "Punches catalogue cover is missing or empty\n");
    exit(1);
}

/* Catalogue geometry must complement the existing WordPress homepage and be mobile-safe. */
foreach ([
    '.home-product-range {',
    'overflow: clip',
    'padding-block: clamp(',
    '.home-product-range .home-compact-section-title',
    'grid-template-columns: repeat(5, minmax(0, 1fr))',
    'aspect-ratio: 560 / 786',
    'filter: none !important',
    'overflow-x: auto',
    'overflow-y: hidden',
    'scroll-snap-type: inline mandatory',
    '-webkit-overflow-scrolling: touch',
    'flex: 0 0 min(44vw, 10.75rem)',
] as $needle) {
    if (strpos($css, $needle) === false) {
        fwrite(STDERR, "Catalogue responsive/geometry contract missing: {$needle}\n");
        exit(1);
    }
}
if (strpos($css, 'flex: 0 0 min(72vw, 17rem)') !== false) {
    fwrite(STDERR, "Catalogue mobile cards still use the oversized restoration geometry\n");
    exit(1);
}

/* Existing banner and secondary-hero restoration contracts remain protected. */
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
    fwrite(STDERR, "Current Home hero is not using the restored four-banner path\n");
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
    '.rosa-preview-page-hero__media',
    '.rosa-preview-about-feature__media::after',
    '.rosa-preview-about-evidence__media::after',
] as $needle) {
    if (strpos($css, $needle) === false) {
        fwrite(STDERR, "Visual restoration CSS contract missing: {$needle}\n");
        exit(1);
    }
}
foreach (['rgb(224 8 21', '#e00815', '#b90a14', '#b9000b'] as $redNeedle) {
    if (strpos($css, $redNeedle) !== false) {
        fwrite(STDERR, "Restoration stylesheet contains a red photographic wash token: {$redNeedle}\n");
        exit(1);
    }
}

if (strpos($functions, "'rosa-home-visual-restoration'") === false) {
    fwrite(STDERR, "Restoration stylesheet/script are not enqueued\n");
    exit(1);
}

echo "PASS: catalogue replaces promos with compact responsive old-site treatment; banners and secondary heroes remain protected\n";
