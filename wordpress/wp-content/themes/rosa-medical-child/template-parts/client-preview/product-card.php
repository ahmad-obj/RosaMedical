<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$product = $args['product'] ?? null;
$family = $args['family'] ?? null;
$detailLabel = rosa_preview_copy('view_details', $locale);
if ($product instanceof WC_Product) {
    $imageId = $product->get_image_id();
    $name = $product->get_name();
    $url = get_permalink($product->get_id());
    $terms = wc_get_product_terms($product->get_id(), 'product_cat', ['fields'=>'names']);
    $familyLabel = $terms ? rosa_preview_family_label((string) $terms[0], $locale) : ($locale === 'ar' ? 'أداة طبية' : 'Medical instrument');
    ?>
    <article class="rosa-preview-product">
      <a class="rosa-preview-product__media" href="<?php echo esc_url($url); ?>"><?php if ($imageId > 0) echo wp_get_attachment_image($imageId, 'woocommerce_thumbnail'); else echo '<span class="rosa-preview-product__placeholder">ROSA</span>'; ?></a>
      <div class="rosa-preview-product__body"><p class="rosa-preview-product__family"><?php echo esc_html($familyLabel); ?></p><h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($name); ?></a></h3><p class="rosa-preview-product__price"><?php echo esc_html(rosa_preview_price_label($locale)); ?></p><a class="rosa-preview-product__action" href="<?php echo esc_url($url); ?>"><?php echo esc_html($detailLabel); ?></a></div>
    </article>
    <?php return;
}
if (is_array($family)) {
    $label = rosa_preview_family_label((string) ($family['label'] ?? ''), $locale);
    $url = (string) ($family['url'] ?? home_url('/shop/'));
    ?>
    <article class="rosa-preview-product rosa-preview-product--family"><a class="rosa-preview-product__media" href="<?php echo esc_url($url); ?>"><span class="rosa-preview-product__placeholder">ROSA</span></a><div class="rosa-preview-product__body"><p class="rosa-preview-product__family"><?php echo esc_html($locale === 'ar' ? 'فئة كتالوج' : 'Catalogue family'); ?></p><h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($label); ?></a></h3><a class="rosa-preview-product__action" href="<?php echo esc_url($url); ?>"><?php echo esc_html($locale === 'ar' ? 'تصفح الفئة' : 'Browse family'); ?></a></div></article>
<?php }
