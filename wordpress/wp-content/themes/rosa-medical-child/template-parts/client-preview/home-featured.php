<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, $locale === 'ar' ? $ar : $en);
$benefits = [
    [$c('benefit_1_title', 'Catalogue support', 'دعم الكتالوج'), $c('benefit_1_body', 'Identify the right reference', 'حدد المرجع الصحيح')],
    [$c('benefit_2_title', 'Quotation route', 'عرض السعر'), $c('benefit_2_body', 'Ask about price and supply', 'اسأل عن السعر والتوريد')],
    [$c('benefit_3_title', 'Five families', 'خمس فئات'), $c('benefit_3_body', 'Browse instrument ranges', 'تصفح عائلات الأدوات')],
];
$benefitIcons = [
    '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M7 3h8l3 3v15H7V3Zm3 5h5m-5 4h5m-5 4h3"/></svg>',
    '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 7h10m4 0h2M4 17h3m4 0h9M14 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM9 15a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>',
    '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M5 5h14v10H9l-4 4V5Zm4 4h6m-6 3h4"/></svg>',
];
?>
<section class="rosa-preview-featured" data-home-section="featured"><div class="rosa-preview-rail rosa-preview-featured__layout"><div class="rosa-preview-featured__products"><?php get_template_part('template-parts/client-preview/product-grid', null, ['title' => $c('featured_title', 'Featured Products', 'منتجات مختارة'), 'limit' => 4, 'context' => 'featured', 'locale' => $locale]); ?></div><aside class="rosa-preview-benefits" aria-label="<?php echo esc_attr($locale === 'ar' ? 'مزايا التوريد' : 'Procurement support'); ?>"><?php foreach ($benefits as $index => [$title, $body]) : ?><article><span class="rosa-preview-benefit-icon"><?php echo $benefitIcons[$index]; // trusted inline SVG icon asset ?></span><div><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></div></article><?php endforeach; ?></aside></div></section>
