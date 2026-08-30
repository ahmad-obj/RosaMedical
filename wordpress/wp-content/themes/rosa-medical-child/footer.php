<?php
/**
 * Production Rosa procurement footer.
 */

if (! defined('ABSPATH')) {
    exit;
}

$phone = rosa_theme_business_value('phone');
$email = rosa_theme_business_value('email');
$address = rosa_theme_business_value('address');
$quoteLabel = rosa_theme_business_value('primary_cta_label', __('Request a quote', 'rosa-medical'));
?>
</main>
<footer class="rosa-site-footer rosa-surface--dark" data-rosa-site-footer>
    <div class="rosa-rail rosa-rail--wide rosa-site-footer__grid">
        <section class="rosa-site-footer__brand" aria-labelledby="rosa-footer-brand-title">
            <h2 id="rosa-footer-brand-title">ROSA</h2>
            <p><?php esc_html_e('Structured medical-instrument sourcing, catalogue references and quotation support.', 'rosa-medical'); ?></p>
            <a class="rosa-button rosa-button--primary" href="<?php echo esc_url(home_url('/inquiry/')); ?>"><?php echo esc_html($quoteLabel); ?></a>
            <?php if ($address !== '') : ?><p class="rosa-site-footer__address"><?php echo esc_html($address); ?></p><?php endif; ?>
            <?php if ($phone !== '') : ?><p><a href="<?php echo esc_url('tel:' . preg_replace('/[^0-9+]/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a></p><?php endif; ?>
            <?php if ($email !== '') : ?><p><a href="<?php echo esc_url('mailto:' . sanitize_email($email)); ?>"><?php echo esc_html($email); ?></a></p><?php endif; ?>
        </section>

        <nav aria-labelledby="rosa-footer-products-title">
            <h2 id="rosa-footer-products-title"><?php esc_html_e('Products', 'rosa-medical'); ?></h2>
            <ul>
                <?php foreach (['knives' => 'Knives', 'scissors' => 'Scissors', 'punches' => 'Punches', 'chisels' => 'Chisels', 'cutters' => 'Cutters'] as $slug => $label) : ?>
                    <li><a href="<?php echo esc_url(rosa_theme_family_url($slug)); ?>"><?php echo esc_html__($label, 'rosa-medical'); ?></a></li>
                <?php endforeach; ?>
                <li><a href="<?php echo esc_url(home_url('/catalogues/')); ?>"><?php esc_html_e('Catalogues', 'rosa-medical'); ?></a></li>
            </ul>
        </nav>

        <nav aria-labelledby="rosa-footer-company-title">
            <h2 id="rosa-footer-company-title"><?php esc_html_e('Company', 'rosa-medical'); ?></h2>
            <ul>
                <li><a href="<?php echo esc_url(home_url('/about/')); ?>"><?php esc_html_e('About Us', 'rosa-medical'); ?></a></li>
                <li><a href="<?php echo esc_url(home_url('/inquiry/')); ?>"><?php esc_html_e('Procurement support', 'rosa-medical'); ?></a></li>
                <li><a href="<?php echo esc_url(home_url('/contact/')); ?>"><?php esc_html_e('Contact Us', 'rosa-medical'); ?></a></li>
            </ul>
        </nav>

        <nav aria-labelledby="rosa-footer-support-title">
            <h2 id="rosa-footer-support-title"><?php esc_html_e('Support', 'rosa-medical'); ?></h2>
            <ul>
                <li><a href="<?php echo esc_url(home_url('/inquiry/')); ?>"><?php esc_html_e('Inquiry', 'rosa-medical'); ?></a></li>
                <li><a href="<?php echo esc_url(home_url('/?s=')); ?>"><?php esc_html_e('Search', 'rosa-medical'); ?></a></li>
                <li><a href="<?php echo esc_url(get_privacy_policy_url()); ?>"><?php esc_html_e('Privacy Policy', 'rosa-medical'); ?></a></li>
                <li><a href="<?php echo esc_url(home_url('/terms/')); ?>"><?php esc_html_e('Terms', 'rosa-medical'); ?></a></li>
            </ul>
        </nav>
    </div>
    <div class="rosa-rail rosa-rail--wide rosa-site-footer__bottom">
        <small>&copy; <?php echo esc_html(wp_date('Y')); ?> ROSA</small>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
