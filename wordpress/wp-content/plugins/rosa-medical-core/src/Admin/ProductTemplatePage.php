<?php

declare(strict_types=1);

namespace RosaMedical\Core\Admin;

use RosaMedical\Core\Elementor\ProductTemplate;

final class ProductTemplatePage
{
    public static function render(): void
    {
        if (! current_user_can(Capabilities::MANAGE_CONTENT)) {
            return;
        }

        if (! ProductTemplate::isElementorAvailable()) {
            self::notice(
                __('Elementor is required to edit the Rosa Product Page layout.', 'rosa-medical'),
                admin_url('plugins.php'),
                __('View Plugins', 'rosa-medical')
            );
            return;
        }

        $templateId = ProductTemplate::ensure();
        if ($templateId <= 0) {
            self::notice(
                __('The Rosa Product Page template could not be created. Confirm that Elementor is active and try again.', 'rosa-medical'),
                admin_url(),
                __('Back to Dashboard', 'rosa-medical')
            );
            return;
        }

        if (! current_user_can('edit_post', $templateId)) {
            self::notice(
                __('You do not have permission to edit the Rosa Product Page template.', 'rosa-medical'),
                admin_url(),
                __('Back to Dashboard', 'rosa-medical')
            );
            return;
        }

        $url = ProductTemplate::editorUrl($templateId);
        if ($url === '') {
            self::notice(
                __('The Product Page template exists, but no Elementor editor URL is available.', 'rosa-medical'),
                get_edit_post_link($templateId, '') ?: admin_url(),
                __('Edit Template', 'rosa-medical')
            );
            return;
        }

        if (! headers_sent() && wp_safe_redirect($url)) {
            exit;
        }

        self::notice(
            __('The Product Page is a global Elementor layout. WooCommerce still supplies each product title, images, SKU, configurations and descriptions dynamically.', 'rosa-medical'),
            $url,
            __('Edit Product Page with Elementor', 'rosa-medical')
        );
    }

    private static function notice(string $message, string $url, string $button): void
    {
        ?>
        <div class="wrap rosa-content-admin">
            <h1><?php echo esc_html__('Product Page', 'rosa-medical'); ?></h1>
            <div class="notice notice-info inline"><p><?php echo esc_html($message); ?></p></div>
            <p><a class="button button-primary" href="<?php echo esc_url($url); ?>"><?php echo esc_html($button); ?></a></p>
        </div>
        <?php
    }
}
