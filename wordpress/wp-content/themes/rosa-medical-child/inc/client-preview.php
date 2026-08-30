<?php
if (! defined('ABSPATH') && PHP_SAPI !== 'cli') { exit; }
const ROSA_PREVIEW_LOCALE_META = '_rosa_preview_locale';
const ROSA_PREVIEW_PAIR_META = '_rosa_preview_pair_id';
const ROSA_PREVIEW_MEDIA_OPTION = 'rosa_preview_media';
function rosa_preview_locale(?int $postId = null): string {
    $id = $postId ?? get_the_ID();
    $locale = (string) get_post_meta($id, ROSA_PREVIEW_LOCALE_META, true);
    return $locale === 'ar' ? 'ar' : 'en';
}
function rosa_preview_pair_url(?int $postId = null): string {
    $id = $postId ?? get_the_ID();
    $pair = (int) get_post_meta($id, ROSA_PREVIEW_PAIR_META, true);
    return $pair > 0 ? get_permalink($pair) : home_url(rosa_preview_locale($id) === 'ar' ? '/' : '/ar/');
}
function rosa_preview_media_id(string $key): int {
    $media = get_option(ROSA_PREVIEW_MEDIA_OPTION, []);
    return is_array($media) && isset($media[$key]) ? max(0, (int) $media[$key]) : 0;
}
function rosa_preview_copy(string $key, ?string $locale = null): string {
    $locale = $locale === 'ar' ? 'ar' : ($locale === 'en' ? 'en' : rosa_preview_locale());
    $copy = [
        'en' => [
            'request_quote' => 'Request a quote',
            'hero_eyebrow' => 'Rosa Medical',
            'hero_title' => 'Surgical instruments for professional procurement.',
            'hero_body' => 'Explore Rosa instrument families and contact our team for catalogue and quotation support.',
            'who_eyebrow' => 'Who we are',
            'who_title' => 'A focused medical-instrument supply partner.',
            'why_title' => 'Support built around instrument procurement',
            'contact_title' => 'Get in touch and let us know how we can help.',
            'price_request' => 'Price on request',
            'view_details' => 'View details',
            'browse_products' => 'Browse products',
            'contact_us' => 'Contact us',
            'catalogue_support' => 'Catalogue support',
            'quotation_support' => 'Quotation support',
        ],
        'ar' => [
            'request_quote' => 'اطلب عرض سعر',
            'hero_eyebrow' => 'روزا ميديكال',
            'hero_title' => 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.',
            'hero_body' => 'استكشف فئات أدوات روزا وتواصل مع فريقنا للحصول على الكتالوج ودعم عروض الأسعار.',
            'who_eyebrow' => 'من نحن',
            'who_title' => 'شريك متخصص في توريد الأدوات الطبية.',
            'why_title' => 'دعم يركز على احتياجات توريد الأدوات',
            'contact_title' => 'تواصل معنا وأخبرنا كيف يمكننا مساعدتك.',
            'price_request' => 'السعر عند الطلب',
            'view_details' => 'عرض التفاصيل',
            'browse_products' => 'تصفح المنتجات',
            'contact_us' => 'اتصل بنا',
            'catalogue_support' => 'دعم الكتالوج',
            'quotation_support' => 'دعم عروض الأسعار',
        ],
    ];
    return $copy[$locale][$key] ?? '';
}
function rosa_preview_price_label(?string $locale = null): string { return rosa_preview_copy('price_request', $locale); }
