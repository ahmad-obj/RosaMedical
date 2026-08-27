<?php
/**
 * Site footer.
 */

if (! defined('ABSPATH')) {
    exit;
}
?>
</main>
<footer class="rosa-site-footer">
    <div class="rosa-shell rosa-site-footer__inner">
        <div>
            <strong><?php echo esc_html(get_bloginfo('name')); ?></strong>
            <?php $address = rosa_theme_business_value('address'); ?>
            <?php if ($address !== '') : ?>
                <p><?php echo esc_html($address); ?></p>
            <?php endif; ?>
        </div>
        <div>
            <?php $phone = rosa_theme_business_value('phone'); ?>
            <?php $email = rosa_theme_business_value('email'); ?>
            <?php if ($phone !== '') : ?><p><?php echo esc_html($phone); ?></p><?php endif; ?>
            <?php if ($email !== '') : ?><p><?php echo esc_html($email); ?></p><?php endif; ?>
        </div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
