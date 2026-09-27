<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$locale = $locale === 'ar' ? 'ar' : 'en';
$content = static fn(string $key, string $en, string $ar): string => rosa_preview_content('site', $key, $locale, $locale === 'ar' ? $ar : $en);
$quoteUrl = home_url($locale === 'ar' ? '/ar/quote-request/' : '/quote-request/');
$contactUrl = home_url($locale === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry');
?>
<section class="rosa-preview-prefooter rosa-preview-newsletter rosa-preview-cta-banner" data-rosa-cta-banner>
    <div class="rosa-preview-rail rosa-preview-newsletter__layout">
        <div class="rosa-preview-newsletter__content">
            <h2><?php echo esc_html($content('cta_title', 'Need an instrument reference or quotation?', 'هل تحتاج إلى مرجع أداة أو عرض سعر؟')); ?></h2>
            <p><?php echo esc_html($content('cta_body', 'Share the catalogue reference or configuration you need and Rosa can prepare the next step.', 'شارك مرجع الكتالوج أو التكوين المطلوب لتتمكن روزا من تجهيز الخطوة التالية.')); ?></p>
        </div>
        <div class="rosa-preview-cta-actions" aria-label="<?php echo esc_attr($locale === 'ar' ? 'خيارات التواصل' : 'Contact options'); ?>">
            <a class="rosa-preview-cta-actions__primary" href="<?php echo esc_url($quoteUrl); ?>"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M6 3h9l3 3v15H6V3Zm3 5h6m-6 4h6m-6 4h4"/></svg><span><?php echo esc_html($content('cta_action_1', 'Request a quote', 'اطلب عرض سعر')); ?></span></a>
            <a class="rosa-preview-cta-actions__secondary" href="<?php echo esc_url($contactUrl); ?>"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M5 5h14v10H9l-4 4V5Zm4 4h6m-6 3h4"/></svg><span><?php echo esc_html($content('cta_action_2', 'Contact Rosa', 'تواصل مع روزا')); ?></span></a>
        </div>
    </div>
</section>
