<?php
/**
 * Elementor-authored Rosa Product Detail shell.
 *
 * Elementor owns the global presentation document while WooCommerce remains the
 * sole source of product data. If the reusable document is unavailable, the
 * existing shared product prototype remains the safe runtime fallback.
 */

declare(strict_types=1);

use RosaMedical\Core\Elementor\ProductTemplate;

if (! defined('ABSPATH')) {
    exit;
}

$productId = function_exists('get_queried_object_id') ? (int) get_queried_object_id() : (int) get_the_ID();
$product = function_exists('wc_get_product') ? wc_get_product($productId) : false;
$fallback = dirname(__FILE__) . '/product-detail-prototype.php';

if (! $product instanceof WC_Product) {
    if (is_readable($fallback)) {
        require $fallback;
    }
    return;
}

ob_start();
$rendered = ProductTemplate::render($product->get_id());
$content = (string) ob_get_clean();

if (! $rendered || trim($content) === '') {
    if (is_readable($fallback)) {
        require $fallback;
    }
    return;
}

get_header();
?>
<div class="rosa-product-detail rosa-product-detail--elementor" id="main-content" data-rosa-elementor-product-detail>
    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Elementor-rendered document. ?>
</div>
<?php
get_footer();
