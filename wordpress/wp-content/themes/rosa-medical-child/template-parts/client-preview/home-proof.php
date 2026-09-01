<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_content('home', $key, $locale, $locale === 'ar' ? $ar : $en);
$labels = [
    $c('proof_1', 'Knives', 'السكاكين'),
    $c('proof_2', 'Scissors', 'المقصات'),
    $c('proof_3', 'Punches', 'المثاقب'),
    $c('proof_4', 'Chisels', 'الأزاميل'),
    $c('proof_5', 'Cutters', 'القواطع'),
    $c('proof_6', 'Catalogues', 'الكتالوجات'),
];
?>
<section class="rosa-preview-proof" data-home-section="proof" aria-label="<?php echo esc_attr($locale === 'ar' ? 'فئات كتالوج روزا' : 'Rosa catalogue families'); ?>"><div class="rosa-preview-rail rosa-preview-proof__track"><?php foreach ($labels as $label) : ?><span><?php echo esc_html($label); ?></span><?php endforeach; ?></div></section>
