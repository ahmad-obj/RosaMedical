<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$shopPath = $root . '/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php';

if (! is_file($shopPath)) {
    fwrite(STDERR, "Missing Shop template: {$shopPath}\n");
    exit(1);
}

$shop = file_get_contents($shopPath) ?: '';

if (! str_contains($shop, 'data-preview-shop-workflow')) {
    fwrite(STDERR, "Shop workflow section must remain present\n");
    exit(1);
}

foreach ([
    '<p class="rosa-preview-eyebrow" style="color:#fff">',
    '<h2 style="color:#fff">',
    '<p style="color:#fff">',
] as $needle) {
    if (! str_contains($shop, $needle)) {
        fwrite(STDERR, "Workflow copy must be forced white on the red background: {$needle}\n");
        exit(1);
    }
}

foreach ([
    'data-preview-shop-families',
    'INSTRUMENT FAMILIES',
    'Start with the right instrument family',
    'فئات الأدوات',
    'ابدأ من الفئة المناسبة',
] as $forbidden) {
    if (str_contains($shop, $forbidden)) {
        fwrite(STDERR, "Removed Instrument Families section leaked into Shop template: {$forbidden}\n");
        exit(1);
    }
}

fwrite(STDOUT, "PASS: Shop workflow copy is white on red and the Instrument Families section is removed\n");
