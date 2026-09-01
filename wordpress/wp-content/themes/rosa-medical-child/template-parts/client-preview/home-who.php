<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_content('home', $key, $locale, $locale === 'ar' ? $ar : $en);
$stats = [
    [$c('stat_1_value', '5', '5'), $c('stat_1_label', 'Product families', 'فئات منتجات')],
    [$c('stat_2_value', '5', '5'), $c('stat_2_label', 'Catalogue PDFs', 'كتالوجات')],
    [$c('stat_3_value', '2', '2'), $c('stat_3_label', 'Preview languages', 'لغات للمعاينة')],
];
?>
<section class="rosa-preview-who" data-home-section="who"><div class="rosa-preview-rail rosa-preview-who__layout"><div class="rosa-preview-who__copy"><p class="rosa-preview-eyebrow"><?php echo esc_html($c('who_eyebrow', 'Who we are', 'من نحن')); ?></p><h2><?php echo esc_html($c('who_title', 'Expect more than an instrument catalogue.', 'توقع شريكًا يركز على تفاصيل الأدوات.')); ?></h2><p><?php echo esc_html($c('who_body', 'Rosa helps professional buyers identify instrument families, confirm catalogue references and prepare a clear quotation request.', 'نساعد المشترين على استكشاف فئات الأدوات ومراجع الكتالوج والتواصل للحصول على دعم التوريد.')); ?></p><a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/about/' : '/about/')); ?>"><?php echo esc_html($c('who_button', 'Discover Rosa', 'تعرف علينا')); ?></a></div><div class="rosa-preview-who__visual"><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-who-01', 'label' => 'Rosa procurement team media']); ?></div><div class="rosa-preview-who__stats"><?php foreach ($stats as [$value, $label]) : ?><div><strong><?php echo esc_html($value); ?></strong><span><?php echo esc_html($label); ?></span></div><?php endforeach; ?></div></div></section>
