<?php
if (! defined('ABSPATH') && PHP_SAPI !== 'cli') { exit; }
function rosa_preview_nav_items(?string $locale = null): array {
    $locale = $locale === 'ar' ? 'ar' : ($locale === 'en' ? 'en' : rosa_preview_locale());
    $defaults = $locale === 'ar'
        ? ['الرئيسية', 'من نحن', 'المنتجات', 'اتصل بنا', 'الاستفسار']
        : ['Home', 'About us', 'Shop', 'Contact us', 'Inquiry'];
    $keys = ['nav_home', 'nav_about', 'nav_shop', 'nav_contact', 'nav_inquiry'];
    $labels = array_map(
        static fn(string $key, string $fallback): string => rosa_preview_content('site', $key, $locale, $fallback),
        $keys,
        $defaults
    );
    $paths = $locale === 'ar'
        ? ['/ar/', '/ar/about/', '/ar/shop/', '/ar/contact/', '/ar/contact/#inquiry']
        : ['/', '/about/', '/shop/', '/contact/', '/contact/#inquiry'];
    return array_map(static fn(string $label, string $path): array => ['label' => $label, 'url' => home_url($path)], $labels, $paths);
}
