<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$phone = rosa_preview_business_value('phone', $locale);
$whatsapp = rosa_preview_business_value('whatsapp', $locale);
if ($whatsapp === '') { $whatsapp = $phone; }
$waDigits = preg_replace('/\D+/', '', $whatsapp);
$waHref = is_string($waDigits) && $waDigits !== '' ? 'https://wa.me/' . $waDigits : '#';
$email = rosa_preview_business_value('email', $locale);
$emailHref = $email !== '' ? 'mailto:' . $email : '#';
?>
<section class="home-contact-band" data-section="home-contact-band" aria-labelledby="home-contact-band-title">
    <div class="container container--wide">
        <div class="home-contact-band__surface">
            <div class="home-contact-band__actions">
                <a class="home-contact-action home-contact-action--whatsapp" href="<?php echo esc_url($waHref); ?>" target="_blank" rel="noreferrer">
                    <span class="home-contact-action__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z"/><path d="M9.1 8.5c.4 2.7 2 4.4 4.7 5.2l1.3-1.3 2.1.9c-.4 1.9-1.7 2.8-3.5 2.5-3.8-.7-6.2-3.1-6.9-6.9-.3-1.8.6-3.1 2.5-3.5l.9 2.1Z"/></svg></span>
                    <?php echo esc_html($c('contact_whatsapp_label')); ?>
                </a>
                <a class="home-contact-action home-contact-action--email" href="<?php echo esc_url($emailHref); ?>">
                    <span class="home-contact-action__icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.8"/><path d="m4.5 7 7.5 6 7.5-6"/></svg></span>
                    <?php echo esc_html($c('contact_email_label')); ?>
                </a>
            </div>
            <div class="home-contact-band__copy">
                <p class="home-contact-band__eyebrow"><?php echo esc_html($c('contact_eyebrow')); ?></p>
                <h2 id="home-contact-band-title"><?php echo esc_html($c('contact_title')); ?></h2>
            </div>
        </div>
    </div>
</section>
