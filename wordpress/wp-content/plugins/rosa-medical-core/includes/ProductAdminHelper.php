<?php

namespace RosaMedical\Core\Admin;

if (! defined('ABSPATH')) {
    exit;
}

class ProductAdminHelper
{
    public static function init(): void
    {
        add_action('admin_footer-post-new.php', [self::class, 'autoEnableStockManagement']);
        add_action('woocommerce_product_options_stock_status', [self::class, 'renderStockQuantityHelperNotice']);
    }

    /**
     * On adding a new product, automatically check "Manage stock?" so the numerical
     * Quantity input field is immediately visible and ready for the user.
     */
    public static function autoEnableStockManagement(): void
    {
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        if (! $screen || $screen->post_type !== 'product') {
            return;
        }
        ?>
        <script>
        (function() {
            function ensureManageStockChecked() {
                var manageStock = document.getElementById('_manage_stock');
                if (manageStock && !manageStock.checked) {
                    manageStock.checked = true;
                    manageStock.dispatchEvent(new Event('change'));
                }
            }
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', ensureManageStockChecked);
            } else {
                ensureManageStockChecked();
            }
            // Repeat on window load in case WooCommerce scripts ran after DOMContentLoaded
            window.addEventListener('load', ensureManageStockChecked);
        })();
        </script>
        <?php
    }

    /**
     * Render an informative helper notice inside the Inventory tab so the user
     * immediately understands where and how to set product quantities.
     */
    public static function renderStockQuantityHelperNotice(): void
    {
        ?>
        <div class="rosa-admin-stock-notice" style="margin: 10px 0 15px; padding: 10px 14px; background: #f0f7ff; border-inline-start: 4px solid #b71920; border-radius: 3px;">
            <p style="margin: 0; font-size: 13px; color: #1d2327; font-weight: 500;">
                <strong>ROSA Catalogue Tip:</strong> Enter the instrument quantity in the <strong>Stock quantity</strong> box above. If track stock is enabled, this quantity is reflected in procurement records.
            </p>
        </div>
        <?php
    }
}
