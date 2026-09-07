<?php
/**
 * Dedicated quotation review and institutional inquiry surface.
 */
if (! defined('ABSPATH')) {
    exit;
}

$locale = function_exists('rosa_quote_request_route_locale') && rosa_quote_request_route_locale() === 'ar' ? 'ar' : 'en';
$isArabic = $locale === 'ar';
$copy = $isArabic
    ? [
        'eyebrow' => 'طلب عرض سعر',
        'title' => 'راجع طلب عرض السعر',
        'intro' => 'راجع الأدوات المحددة والكميات، ثم أضف بيانات المؤسسة لإكمال طلب الاستفسار.',
        'selected' => 'الأدوات المحددة',
        'empty' => 'طلب عرض السعر فارغ. تصفح الكتالوج لإضافة الأدوات التي تحتاجها.',
        'catalog' => 'تصفح الكتالوج',
        'sku' => 'رمز SKU',
        'configuration' => 'التكوين',
        'quantity' => 'الكمية',
        'remove' => 'إزالة',
        'contactTitle' => 'بيانات طلب عرض السعر',
        'contactIntro' => 'أدخل بيانات التواصل والمؤسسة. سيتم ربطها بالأدوات المحددة عند الإرسال.',
        'name' => 'الاسم',
        'email' => 'البريد الإلكتروني',
        'phone' => 'واتساب / الهاتف',
        'institution' => 'المؤسسة / المستشفى',
        'location' => 'الدولة / المدينة',
        'notes' => 'ملاحظات',
        'submit' => 'إرسال طلب عرض السعر',
    ]
    : [
        'eyebrow' => 'Quotation request',
        'title' => 'Review your quote request',
        'intro' => 'Review selected instruments and quantities, then add institutional details for the inquiry request.',
        'selected' => 'Selected instruments',
        'empty' => 'Your quote request is empty. Browse the catalogue to add the instruments you need.',
        'catalog' => 'Browse catalogue',
        'sku' => 'SKU',
        'configuration' => 'Configuration',
        'quantity' => 'Quantity',
        'remove' => 'Remove',
        'contactTitle' => 'Quotation inquiry details',
        'contactIntro' => 'Add your contact and institution details. They will be paired with the selected instruments when submission is enabled.',
        'name' => 'Name',
        'email' => 'Email',
        'phone' => 'WhatsApp / Phone',
        'institution' => 'Institution / Hospital',
        'location' => 'Country / City',
        'notes' => 'Notes',
        'submit' => 'Send quote request',
    ];

$catalog = function_exists('rosa_quote_request_catalog_payload') ? rosa_quote_request_catalog_payload() : [];
$catalogUrl = home_url($isArabic ? '/ar/shop/' : '/shop/');

$theme = wp_get_theme();
$version = (string) $theme->get('Version');
wp_enqueue_style('rosa-medical-tokens', get_stylesheet_directory_uri() . '/assets/css/tokens.css', [], $version);
wp_enqueue_style('rosa-medical-base', get_stylesheet_directory_uri() . '/assets/css/base.css', ['rosa-medical-tokens'], $version);
wp_enqueue_style('rosa-client-preview', get_stylesheet_directory_uri() . '/assets/css/client-preview.css', ['rosa-medical-base'], $version);
wp_enqueue_style('rosa-live-visual-recovery', get_stylesheet_directory_uri() . '/assets/css/live-visual-recovery.css', ['rosa-client-preview'], $version);
if ($isArabic && file_exists(get_stylesheet_directory() . '/assets/css/client-preview-rtl.css')) {
    wp_enqueue_style('rosa-client-preview-rtl', get_stylesheet_directory_uri() . '/assets/css/client-preview-rtl.css', ['rosa-client-preview'], $version);
}
wp_enqueue_style('rosa-newsletter-banner', get_stylesheet_directory_uri() . '/assets/css/newsletter-banner.css', ['rosa-live-visual-recovery'], $version);
wp_enqueue_style('rosa-quote-selection', get_stylesheet_directory_uri() . '/assets/css/quote-selection.css', ['rosa-live-visual-recovery'], $version);
wp_enqueue_style('rosa-quote-request', get_stylesheet_directory_uri() . '/assets/css/quote-request.css', ['rosa-quote-selection'], $version);

wp_enqueue_script('rosa-quote-basket', get_stylesheet_directory_uri() . '/assets/js/quote-basket.js', [], $version, true);
wp_enqueue_script('rosa-quote-selection', get_stylesheet_directory_uri() . '/assets/js/quote-selection.js', ['rosa-quote-basket'], $version, true);
wp_enqueue_script('rosa-quote-request', get_stylesheet_directory_uri() . '/assets/js/quote-request.js', ['rosa-quote-basket'], $version, true);
wp_enqueue_script('rosa-client-preview', get_stylesheet_directory_uri() . '/assets/js/client-preview.js', [], $version, true);

get_header();
?>
<section class="rosa-quote-request-page" data-rosa-quote-request-page data-rosa-quote-request-locale="<?php echo esc_attr($locale); ?>">
    <div class="rosa-preview-rail rosa-quote-request-page__inner">
        <header class="rosa-quote-request-page__hero">
            <p class="rosa-quote-request-page__eyebrow"><?php echo esc_html($copy['eyebrow']); ?></p>
            <h1 data-rosa-quote-request-title><?php echo esc_html($copy['title']); ?></h1>
            <p><?php echo esc_html($copy['intro']); ?></p>
        </header>

        <div class="rosa-quote-request-page__grid">
            <section class="rosa-quote-request-page__review" aria-labelledby="rosa-quote-request-items-title">
                <h2 id="rosa-quote-request-items-title"><?php echo esc_html($copy['selected']); ?></h2>
                <div class="rosa-quote-request-page__items" data-rosa-quote-request-items></div>
                <div class="rosa-quote-request-page__empty" data-rosa-quote-request-empty hidden>
                    <p><?php echo esc_html($copy['empty']); ?></p>
                    <a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url($catalogUrl); ?>" data-rosa-quote-request-catalog-link><?php echo esc_html($copy['catalog']); ?></a>
                </div>
            </section>

            <section class="rosa-quote-request-page__inquiry" aria-labelledby="rosa-quote-request-form-title">
                <h2 id="rosa-quote-request-form-title"><?php echo esc_html($copy['contactTitle']); ?></h2>
                <p><?php echo esc_html($copy['contactIntro']); ?></p>
                <form class="rosa-quote-request-form" data-rosa-quote-request-form method="post" action="">
                    <div class="rosa-quote-request-form__grid">
                        <label for="rosa-quote-request-name"><?php echo esc_html($copy['name']); ?></label>
                        <input id="rosa-quote-request-name" name="name" type="text" required autocomplete="name">

                        <label for="rosa-quote-request-email"><?php echo esc_html($copy['email']); ?></label>
                        <input id="rosa-quote-request-email" name="email" type="email" required autocomplete="email">

                        <label for="rosa-quote-request-phone"><?php echo esc_html($copy['phone']); ?></label>
                        <input id="rosa-quote-request-phone" name="phone" type="tel" autocomplete="tel">

                        <label for="rosa-quote-request-institution"><?php echo esc_html($copy['institution']); ?></label>
                        <input id="rosa-quote-request-institution" name="institution" type="text">

                        <label for="rosa-quote-request-location"><?php echo esc_html($copy['location']); ?></label>
                        <input id="rosa-quote-request-location" name="location" type="text">

                        <label for="rosa-quote-request-notes"><?php echo esc_html($copy['notes']); ?></label>
                        <textarea id="rosa-quote-request-notes" name="notes" rows="5"></textarea>
                    </div>
                    <button class="rosa-preview-button rosa-preview-button--accent rosa-quote-request-form__submit" type="submit" data-rosa-quote-request-submit><?php echo esc_html($copy['submit']); ?></button>
                </form>
            </section>
        </div>
    </div>

    <script type="application/json" data-rosa-quote-request-catalog><?php
        echo wp_json_encode(
            $catalog,
            JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        );
    ?></script>
</section>
<?php get_footer(); ?>
