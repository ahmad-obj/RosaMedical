<?php
if (! defined('ABSPATH')) { exit; }
$locale = function_exists('rosa_preview_locale') ? rosa_preview_locale() : 'en';
$address = rosa_theme_business_value('address');
$phone = rosa_theme_business_value('phone');
$email = rosa_theme_business_value('email');
?>
</main>
<footer class="rosa-preview-footer" data-rosa-preview-footer>
    <div class="rosa-preview-rail rosa-preview-footer__grid">
        <section>
            <strong class="rosa-preview-footer__brand">ROSA</strong>
            <p><?php echo esc_html($locale === 'ar' ? 'أدوات طبية وجراحية مع دعم للكتالوج وطلبات عروض الأسعار.' : 'Medical and surgical instruments with catalogue and quotation support.'); ?></p>
            <a class="rosa-preview-button rosa-preview-button--light" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>"><?php echo esc_html(rosa_preview_copy('request_quote', $locale)); ?></a>
        </section>
        <section><h2><?php echo esc_html($locale === 'ar' ? 'الشركة' : 'Company'); ?></h2><a href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/about/' : '/about/')); ?>"><?php echo esc_html($locale === 'ar' ? 'من نحن' : 'About us'); ?></a><a href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/' : '/contact/')); ?>"><?php echo esc_html($locale === 'ar' ? 'اتصل بنا' : 'Contact us'); ?></a><a href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>"><?php echo esc_html($locale === 'ar' ? 'الاستفسار' : 'Inquiry'); ?></a></section>
        <section><h2><?php echo esc_html($locale === 'ar' ? 'المنتجات' : 'Products'); ?></h2><?php foreach (['Knives','Scissors','Punches','Chisels','Cutters'] as $family) : ?><a href="<?php echo esc_url(home_url('/shop/')); ?>"><?php echo esc_html($family); ?></a><?php endforeach; ?></section>
        <section><h2><?php echo esc_html($locale === 'ar' ? 'الدعم' : 'Support'); ?></h2><p><?php echo esc_html($address); ?></p><?php if ($phone !== '') : ?><a href="tel:<?php echo esc_attr((string) preg_replace('/[^0-9+]/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a><?php endif; ?><?php if ($email !== '') : ?><a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a><?php endif; ?></section>
    </div>
    <div class="rosa-preview-rail rosa-preview-footer__bottom">© <?php echo esc_html((string) wp_date('Y')); ?> ROSA</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
