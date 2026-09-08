<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$content = static fn(string $key, string $en, string $ar): string => rosa_preview_content('site', $key, $locale, $locale === 'ar' ? $ar : $en);
$nameLabel = $content('newsletter_name_label', 'Name', 'الاسم');
$emailLabel = $content('newsletter_email_label', 'Email', 'البريد الإلكتروني');
$submitLabel = $content('newsletter_submit_label', 'Sign Up', 'اشترك');
?>
<section class="rosa-preview-prefooter rosa-preview-newsletter" data-rosa-newsletter-banner>
    <div class="rosa-preview-rail rosa-preview-newsletter__layout">
        <div class="rosa-preview-newsletter__content">
            <h2><?php echo esc_html($content('newsletter_title', 'Sign up for Rosa updates', 'اشترك في تحديثات روزا')); ?></h2>
            <p><?php echo esc_html($content('newsletter_body', 'Receive catalogue, product and company updates from Rosa Medical.', 'استلم تحديثات الكتالوج والمنتجات والشركة من روزا ميديكال.')); ?></p>
        </div>
        <form class="rosa-preview-newsletter__form" data-rosa-newsletter-form data-rosa-newsletter-provider="pending" method="post" action="" aria-label="<?php echo esc_attr($content('newsletter_form_label', 'Newsletter signup', 'الاشتراك في النشرة البريدية')); ?>">
            <label class="rosa-preview-newsletter__field">
                <span class="screen-reader-text"><?php echo esc_html($nameLabel); ?></span>
                <input type="text" name="name" required autocomplete="name" placeholder="<?php echo esc_attr($nameLabel); ?>">
            </label>
            <label class="rosa-preview-newsletter__field">
                <span class="screen-reader-text"><?php echo esc_html($emailLabel); ?></span>
                <input type="email" name="email" required autocomplete="email" placeholder="<?php echo esc_attr($emailLabel); ?>">
            </label>
            <button class="rosa-preview-newsletter__submit" type="submit"><span aria-hidden="true">✉</span><span><?php echo esc_html($submitLabel); ?></span></button>
        </form>
        <div class="rosa-preview-newsletter__media">
            <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'prefooter-person-01', 'label' => $content('newsletter_media_label', 'Rosa Medical updates', 'تحديثات روزا ميديكال')]); ?>
        </div>
    </div>
</section>
