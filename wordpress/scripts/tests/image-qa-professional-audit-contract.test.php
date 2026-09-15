<?php

$root = dirname(__DIR__, 2);
$theme = $root . '/wp-content/themes/rosa-medical-child';
$core = $root . '/wp-content/plugins/rosa-medical-core';

$files = [
    'helpers' => $theme . '/inc/client-preview.php',
    'media' => $theme . '/template-parts/client-preview/media-slot.php',
    'hero' => $theme . '/template-parts/client-preview/hero.php',
    'latest_hero' => $theme . '/template-parts/client-preview/latest-home-hero.php',
    'page_hero' => $theme . '/template-parts/client-preview/page-hero.php',
    'about_who' => $theme . '/template-parts/client-preview/about-who.php',
    'about_cards' => $theme . '/template-parts/client-preview/about-cards.php',
    'about_feature' => $theme . '/template-parts/client-preview/about-feature.php',
    'about_proof' => $theme . '/template-parts/client-preview/about-proof.php',
    'css' => $theme . '/assets/css/home-visual-restoration.css',
    'product_widgets' => $core . '/src/Elementor/Widgets/ProductWidgets.php',
];

foreach ($files as $name => $path) {
    if (! is_file($path)) {
        fwrite(STDERR, "Missing {$name}: {$path}\n");
        exit(1);
    }
}

$source = [];
foreach ($files as $name => $path) {
    $source[$name] = (string) file_get_contents($path);
}

/* The current non-WordPress reference uses the client-v5 monochrome banners. */
if (strpos($source['helpers'], 'assets/media/home-hero/client-v5/') === false
    || strpos($source['helpers'], "'avif'") === false) {
    fwrite(STDERR, "Hero helper is not wired to the approved client-v5 responsive source family\n");
    exit(1);
}

for ($slide = 1; $slide <= 4; $slide++) {
    foreach (['desktop.webp', 'desktop.avif', 'mobile.webp'] as $suffix) {
        $name = sprintf('hero-%02d-%s', $slide, $suffix);
        $asset = $theme . '/assets/media/home-hero/client-v5/' . $name;
        if (! is_file($asset) || filesize($asset) <= 0) {
            fwrite(STDERR, "Missing client-v5 hero derivative: {$name}\n");
            exit(1);
        }
    }
}

foreach (['hero', 'latest_hero'] as $name) {
    if (strpos($source[$name], "'avif'") === false
        || strpos($source[$name], '--hero-desktop-focal') === false
        || strpos($source[$name], '--hero-mobile-focal') === false) {
        fwrite(STDERR, "Responsive hero/focal contract missing from {$name}\n");
        exit(1);
    }
}

if (strpos($source['page_hero'], "'avif'") === false
    || strpos($source['page_hero'], '--page-hero-desktop-focal') === false
    || strpos($source['page_hero'], '--page-hero-mobile-focal') === false) {
    fwrite(STDERR, "About/Contact hero does not preserve responsive source and focal metadata\n");
    exit(1);
}

/* Shop family-navigation cards must never degrade to a ROSA text placeholder. */
foreach (['knives', 'scissors', 'punches', 'chisels', 'cutters'] as $slug) {
    if (strpos($source['media'], "'catalogue-family-{$slug}'") === false) {
        fwrite(STDERR, "Missing catalogue-family image fallback for {$slug}\n");
        exit(1);
    }
}

/* Generic historical About stock should not be the default fallback anymore. */
foreach ([
    'about-who-instruments',
    'about-product-families',
    'about-catalogue-support',
    'about-feature-instruments',
    'about-proof-instruments',
] as $slot) {
    if (strpos($source['media'], "'{$slot}'") === false) {
        fwrite(STDERR, "Missing intentional About image slot: {$slot}\n");
        exit(1);
    }
}
foreach ([
    'assets/media/curated/about-procurement.jpg',
    'assets/media/curated/about-hospitals.jpg',
    'assets/media/curated/about-international.webp',
] as $unsafeDefault) {
    if (strpos($source['media'], $unsafeDefault) !== false) {
        fwrite(STDERR, "Historical generic About stock is still a default fallback: {$unsafeDefault}\n");
        exit(1);
    }
}

$aboutContracts = [
    'about_who' => 'about-who-instruments',
    'about_cards' => 'about-product-families',
    'about_feature' => 'about-feature-instruments',
    'about_proof' => 'about-proof-instruments',
];
foreach ($aboutContracts as $file => $slot) {
    if (strpos($source[$file], $slot) === false) {
        fwrite(STDERR, "About template {$file} does not use audited slot {$slot}\n");
        exit(1);
    }
}
if (strpos($source['about_cards'], 'about-catalogue-support') === false) {
    fwrite(STDERR, "About catalogue-support card lacks a catalogue-specific visual\n");
    exit(1);
}

/* Fallback images should provide intrinsic dimensions to reduce layout shift. */
foreach (['getimagesize', 'width=', 'height='] as $needle) {
    if (strpos($source['media'], $needle) === false) {
        fwrite(STDERR, "Media fallback intrinsic-dimension contract missing: {$needle}\n");
        exit(1);
    }
}

/* Known curated focal points should be explicit and only affect fallbacks. */
foreach ([
    '[data-media-slot="home-who-01"]',
    '[data-media-slot="home-feature-01"]',
    '[data-media-slot="home-why-01"]',
    '[data-media-slot="home-evidence-01"]',
    '[data-media-slot="about-catalogue-support"]',
] as $selector) {
    if (strpos($source['css'], $selector) === false) {
        fwrite(STDERR, "Missing audited focal/fit selector: {$selector}\n");
        exit(1);
    }
}

/* Product-detail LCP image should have explicit decoding/fetch priority. */
if (strpos($source['product_widgets'], 'fetchpriority="high"') === false
    || strpos($source['product_widgets'], 'decoding="async"') === false) {
    fwrite(STDERR, "Product-detail primary image performance contract is incomplete\n");
    exit(1);
}

echo "PASS: professional image QA contracts are satisfied\n";
