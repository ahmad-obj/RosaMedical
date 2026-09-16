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
    'latest_comprehensive' => $theme . '/template-parts/client-preview/latest-home-comprehensive.php',
    'latest_confidence' => $theme . '/template-parts/client-preview/latest-home-confidence.php',
    'about_who' => $theme . '/template-parts/client-preview/about-who.php',
    'about_cards' => $theme . '/template-parts/client-preview/about-cards.php',
    'about_feature' => $theme . '/template-parts/client-preview/about-feature.php',
    'about_proof' => $theme . '/template-parts/client-preview/about-proof.php',
    'css' => $theme . '/assets/css/home-visual-restoration.css',
    'base_preview_css' => $theme . '/assets/css/client-preview.css',
    'live_preview_css' => $theme . '/assets/css/live-visual-recovery.css',
    'cta' => $theme . '/template-parts/client-preview/cta-banner.php',
    'product_widgets' => $core . '/src/Elementor/Widgets/ProductWidgets.php',
    'theme_functions' => $theme . '/functions.php',
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

/* WordPress-selected imagery must not fall back to raw full-size URLs with
   misleading MIME hints. The shared attachment-data path provides responsive
   srcset plus intrinsic dimensions, while specialty media uses WordPress image
   markup directly. */
if (strpos($source['helpers'], 'function rosa_preview_attachment_image_data') === false) {
    fwrite(STDERR, "Missing safe responsive attachment-image helper\n");
    exit(1);
}
foreach (['hero', 'latest_hero'] as $name) {
    if (strpos($source[$name], 'rosa_preview_attachment_image_data') === false
        || strpos($source[$name], 'srcset=') === false
        || strpos($source[$name], 'sizes=') === false) {
        fwrite(STDERR, "Responsive client-selected hero contract missing from {$name}\n");
        exit(1);
    }
}
if (strpos($source['latest_hero'], 'data-mobile-hero-composition') !== false) {
    fwrite(STDERR, "Latest hero still emits hidden duplicate mobile-composition images\n");
    exit(1);
}
foreach (['latest_comprehensive', 'latest_confidence'] as $name) {
    if (strpos($source[$name], 'wp_get_attachment_image(') === false
        || strpos($source[$name], "'large'") === false) {
        fwrite(STDERR, "Responsive WordPress attachment rendering missing from {$name}\n");
        exit(1);
    }
}

/* Known historical stock/temporary attachment IDs must be rejected at render time
   without mutating client-selected provenanced media. */
foreach ([
    'function rosa_preview_is_safe_media_id',
    'home-hero-surgical-instruments.jpg',
    'about-procurement.jpg',
    'about-hospitals.jpg',
    'about-international-buyers.webp',
    'procurement-support.jpg',
    'home-specialties/',
] as $needle) {
    if (strpos($source['helpers'], $needle) === false) {
        fwrite(STDERR, "Runtime unsafe-media guard missing: {$needle}\n");
        exit(1);
    }
}
if (strpos($source['media'], 'rosa_preview_is_safe_media_id') === false) {
    fwrite(STDERR, "Shared media renderer does not enforce unsafe-media guard\n");
    exit(1);
}

/* Shop family-navigation cards must never degrade to a ROSA text placeholder. */
foreach (['knives', 'scissors', 'punches', 'chisels', 'cutters'] as $slug) {
    if (strpos($source['media'], "'catalogue-family-{$slug}'") === false) {
        fwrite(STDERR, "Missing catalogue-family image fallback for {$slug}\n");
        exit(1);
    }
}

/* Dormant/latest-home fallbacks must also avoid the old unprovenanced stock family. */
foreach ([
    'assets/media/curated/about-procurement.jpg',
    'assets/media/curated/about-hospitals.jpg',
    'assets/media/curated/about-international.webp',
] as $unsafeCandidate) {
    if (strpos($source['helpers'], $unsafeCandidate) !== false) {
        fwrite(STDERR, "Unsafe historical stock remains in curated candidate chain: {$unsafeCandidate}\n");
        exit(1);
    }
}

/* Every hard-coded curated candidate must exist. The abandoned generated
   latest-home paths are not valid preferred candidates until real approved
   assets are actually committed. */
foreach ([
    'assets/media/curated/latest-home/hero-01.webp',
    'assets/media/curated/latest-home/hero-02.webp',
    'assets/media/curated/latest-home/hero-03.webp',
    'assets/media/curated/latest-home/hero-04.webp',
    'assets/media/curated/latest-home/specialty-plastic-surgery.webp',
    'assets/media/curated/latest-home/specialty-orthopedics.webp',
    'assets/media/curated/latest-home/specialty-maxillofacial.webp',
    'assets/media/curated/latest-home/specialty-orthodontics.webp',
    'assets/media/curated/latest-home/specialty-spine.webp',
    'assets/media/curated/latest-home/securing-confidence.webp',
] as $missingCandidate) {
    if (strpos($source['helpers'], $missingCandidate) !== false) {
        fwrite(STDERR, "Missing generated media remains in active candidate chain: {$missingCandidate}\n");
        exit(1);
    }
}

/* The newsletter image was a 3:1 banner forced into a near-portrait frame.
   It is intentionally removed rather than preserving a destructive crop. */
if (strpos($source['cta'], 'prefooter-person-01') !== false) {
    fwrite(STDERR, "Newsletter still renders the unsuitable prefooter image\n");
    exit(1);
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

/* Red brand washes may exist on non-photo UI, but photographic pseudo-overlays
   are neutralized at their source rather than depending on cascade accidents. */
foreach ([
    '.rosa-preview-media-slot::after',
    '.rosa-preview-hero > .rosa-preview-media-slot::after',
    '.rosa-preview-feature > .rosa-preview-media-slot::after',
    '.rosa-preview-evidence > .rosa-preview-media-slot::after',
] as $selector) {
    $position = strpos($source['base_preview_css'], $selector);
    if ($position === false) {
        fwrite(STDERR, "Missing base photo-overlay selector: {$selector}\n");
        exit(1);
    }
    $snippet = substr($source['base_preview_css'], $position, 260);
    if (strpos($snippet, '224 8 21') !== false) {
        fwrite(STDERR, "Base photo overlay still carries Rosa-red tint: {$selector}\n");
        exit(1);
    }
}
foreach (['.rosa-preview-about-feature__media::after', '.rosa-preview-about-evidence__media::after'] as $selector) {
    $position = strpos($source['live_preview_css'], $selector);
    if ($position === false) {
        fwrite(STDERR, "Missing live photo-overlay selector: {$selector}\n");
        exit(1);
    }
    $snippet = substr($source['live_preview_css'], $position, 300);
    if (strpos($snippet, '224 8 21') !== false) {
        fwrite(STDERR, "About photo overlay still carries Rosa-red tint: {$selector}\n");
        exit(1);
    }
}

/* The About hero's source fallback must also be neutral. Otherwise users can
   see a red flash while the photograph decodes or if its source is unavailable. */
$aboutHeroPosition = strpos($source['live_preview_css'], '.rosa-preview-page-hero:not(.rosa-preview-page-hero--contact)');
if ($aboutHeroPosition === false) {
    fwrite(STDERR, "Missing About hero base styling\n");
    exit(1);
}
$aboutHeroSnippet = substr($source['live_preview_css'], $aboutHeroPosition, 520);
if (strpos($aboutHeroSnippet, '224 8 21') !== false) {
    fwrite(STDERR, "About hero base fallback still carries Rosa-red tint\n");
    exit(1);
}

/* Classified generic About stock is no longer used anywhere and should not
   remain in the shipped theme as multi-megabyte dead media. */
foreach ([
    'assets/media/curated/about-procurement.jpg',
    'assets/media/curated/about-hospitals.jpg',
    'assets/media/curated/about-international.webp',
] as $retiredAsset) {
    if (is_file($theme . '/' . $retiredAsset)) {
        fwrite(STDERR, "Retired generic About stock still ships in theme: {$retiredAsset}\n");
        exit(1);
    }
}

/* Public Elementor rendering must remain self-contained. External Google Fonts
   introduce a network/privacy dependency and make local/browser acceptance
   nondeterministic; Rosa typography intentionally falls back to the theme/system
   font stacks instead. */
if (strpos($source['theme_functions'], "elementor/frontend/print_google_fonts") === false
    || strpos($source['theme_functions'], "__return_false") === false) {
    fwrite(STDERR, "Elementor Google Fonts are not disabled on the public frontend\n");
    exit(1);
}

/* Product-detail LCP image should have explicit decoding/fetch priority. */
if (strpos($source['product_widgets'], 'fetchpriority="high"') === false
    || strpos($source['product_widgets'], 'decoding="async"') === false) {
    fwrite(STDERR, "Product-detail primary image performance contract is incomplete\n");
    exit(1);
}

echo "PASS: professional image QA contracts are satisfied\n";
