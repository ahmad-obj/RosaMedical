<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$quoteUrl = home_url($locale === 'ar' ? '/ar/request-quotation/' : '/request-quotation/');
?>
<section class="section section--compact" data-section="quotation-cta" aria-label="<?php echo esc_attr($locale === 'ar' ? 'اطلب عرض سعر' : 'Request a quotation'); ?>">
    <div class="container container--wide">
        <div class="quotation-cta__surface">
            <div class="procurement-panel procurement-panel--dark procurement-panel--premium-cta">
                <div class="procurement-panel__content">
                    <p class="public-eyebrow"><?php echo esc_html($c('quotation_eyebrow')); ?></p>
                    <h2 class="procurement-panel__title"><?php echo esc_html($c('quotation_title')); ?></h2>
                    <p class="procurement-panel__copy"><?php echo esc_html($c('quotation_body')); ?></p>
                </div>
                <div class="procurement-panel__actions">
                    <a class="button button--primary" href="<?php echo esc_url($quoteUrl); ?>"><?php echo esc_html($c('quotation_button')); ?></a>
                </div>
            </div>
        </div>
    </div>
</section>