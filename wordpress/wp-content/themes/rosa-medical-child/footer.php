<?php
if (! defined('ABSPATH')) { exit; }
$locale = function_exists('rosa_preview_locale') ? rosa_preview_locale() : 'en';
$address = rosa_preview_business_value('address', $locale);
$phone = rosa_theme_business_value('phone');
$email = rosa_theme_business_value('email');
$shopPath = $locale === 'ar' ? '/ar/shop/' : '/shop/';
$content = static fn(string $key, string $en, string $ar): string => rosa_preview_content('site', $key, $locale, $locale === 'ar' ? $ar : $en);
?>
</main>
<footer class="rosa-preview-footer" data-rosa-preview-footer>
    <div class="rosa-preview-rail rosa-preview-footer__grid">
        <section class="rosa-preview-footer__column rosa-preview-footer__about"><strong class="rosa-preview-footer__brand">ROSA</strong><p><?php echo esc_html($content('footer_description', 'Medical and surgical instruments with clear catalogue and quotation support.', 'أدوات طبية وجراحية مع دعم واضح للكتالوج وطلبات عروض الأسعار.')); ?></p><a class="rosa-preview-footer__contact-link" href="mailto:<?php echo esc_attr($email); ?>"><bdi dir="ltr"><?php echo esc_html($email); ?></bdi></a></section>
        <section class="rosa-preview-footer__column"><h2><?php echo esc_html($content('footer_company_heading', 'Company', 'الشركة')); ?></h2><a href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/about/' : '/about/')); ?>"><?php echo esc_html($content('footer_about_label', 'About us', 'من نحن')); ?></a><a href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/' : '/contact/')); ?>"><?php echo esc_html($content('footer_contact_label', 'Contact us', 'اتصل بنا')); ?></a><a href="<?php echo esc_url(home_url($shopPath)); ?>"><?php echo esc_html($content('footer_products_label', 'Products', 'المنتجات')); ?></a></section>
        <section class="rosa-preview-footer__column"><h2><?php echo esc_html($content('footer_support_heading', 'Support', 'الدعم')); ?></h2><?php foreach (['Knives', 'Scissors', 'Punches', 'Chisels', 'Cutters'] as $family) : ?><a href="<?php echo esc_url(home_url($shopPath)); ?>"><?php echo esc_html(rosa_preview_family_label($family, $locale)); ?></a><?php endforeach; ?></section>
        <section class="rosa-preview-footer__column"><h2><?php echo esc_html($content('footer_touch_heading', 'Get in touch', 'تواصل معنا')); ?></h2><p><?php echo esc_html($address); ?></p><?php if ($phone !== '') : ?><a href="tel:<?php echo esc_attr((string) preg_replace('/[^0-9+]/', '', $phone)); ?>"><bdi dir="ltr"><?php echo esc_html($phone); ?></bdi></a><?php endif; ?><?php if ($email !== '') : ?><a href="mailto:<?php echo esc_attr($email); ?>"><bdi dir="ltr"><?php echo esc_html($email); ?></bdi></a><?php endif; ?><a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>"><?php echo esc_html($content('request_quote', 'Request a quote', 'اطلب عرض سعر')); ?></a></section>
    </div>
    <div class="rosa-preview-rail rosa-preview-footer__bottom"><span>© <?php echo esc_html((string) wp_date('Y')); ?> ROSA Medical</span><span><?php echo esc_html($content('footer_bottom_location', 'Riyadh, Saudi Arabia', 'الرياض، المملكة العربية السعودية')); ?></span></div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
