<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$c = static fn(string $key, string $en, string $ar): string => rosa_preview_content('home', $key, $locale, $locale === 'ar' ? $ar : $en);
$items = [
    [$c('evidence_1_title', 'Identify the family', 'حدد الفئة'), $c('evidence_1_body', 'Start with the instrument type you need.', 'ابدأ بنوع الأداة المطلوبة.')],
    [$c('evidence_2_title', 'Share the reference', 'شارك المرجع'), $c('evidence_2_body', 'Send the available code or configuration.', 'أرسل الرمز أو التكوين المتاح.')],
    [$c('evidence_3_title', 'Request a quotation', 'اطلب عرض سعر'), $c('evidence_3_body', 'Contact Rosa for procurement support.', 'تواصل مع فريق روزا للتوريد.')],
];
?>
<section class="rosa-preview-evidence" data-home-section="evidence"><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'home-evidence-01', 'label' => 'Rosa quotation workflow']); ?><div class="rosa-preview-rail rosa-preview-evidence__content"><p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($c('evidence_eyebrow', 'A clear workflow', 'مسار واضح')); ?></p><h2><?php echo esc_html($c('evidence_title', 'Turn an instrument need into a clear procurement request.', 'حوّل احتياجك إلى طلب توريد واضح.')); ?></h2><p><?php echo esc_html($c('evidence_body', 'Three simple steps help our team understand exactly what you need.', 'ثلاث خطوات بسيطة تساعد فريقنا على فهم ما تحتاجه.')); ?></p><div class="rosa-preview-evidence__cards"><?php foreach ($items as $index => [$title, $body]) : ?><article><span><?php echo esc_html('0' . ($index + 1)); ?></span><h3><?php echo esc_html($title); ?></h3><p><?php echo esc_html($body); ?></p></article><?php endforeach; ?></div></div></section>
