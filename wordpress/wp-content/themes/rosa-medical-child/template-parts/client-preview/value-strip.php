<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$items = $locale === 'ar' ? [['دعم الكتالوج','العثور على الفئة ومراجع المنتجات المناسبة.'],['دعم عروض الأسعار','تواصل مع روزا للحصول على تفاصيل الأسعار والتوريد.'],['فئات الأدوات','تصفح السكاكين والمقصات والمثاقب والأزاميل والقواطع.']] : [['Catalogue Support','Find the correct family and product references.'],['Quotation Support','Contact Rosa for pricing and procurement details.'],['Instrument Families','Browse Knives, Scissors, Punches, Chisels and Cutters.']]; ?>
<section class="rosa-preview-value-strip" data-preview-value-strip><div class="rosa-preview-rail rosa-preview-value-strip__grid"><?php foreach($items as [$title,$body]): ?><article><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></article><?php endforeach; ?></div></section>
