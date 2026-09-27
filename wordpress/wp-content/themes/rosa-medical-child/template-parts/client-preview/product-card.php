<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
$product = $args['product'] ?? null;
$family = $args['family'] ?? null;
$mediaSlot = (string) ($args['media_slot'] ?? 'catalogue-product');
$placeholder = ! empty($args['placeholder']);
$detailLabel = rosa_preview_content('site', 'view_details', $locale, $locale === 'ar' ? 'تفاصيل المنتج' : 'View details');

if ($product instanceof WC_Product) {
    $imageId = $product->get_image_id();
    $name = $product->get_name();
    $url = function_exists('rosa_preview_product_url')
        ? rosa_preview_product_url($product->get_id(), $locale)
        : get_permalink($product->get_id());
    $terms = wc_get_product_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
    $termObjs = wc_get_product_terms($product->get_id(), 'product_cat');
    $familySlug = ! empty($termObjs) && ! is_wp_error($termObjs) ? $termObjs[0]->slug : '';
    $fallbackInstrument = rosa_preview_content('site', 'medical_instrument', $locale, $locale === 'ar' ? 'أداة طبية' : 'Medical instrument');
    $familyLabel = $terms ? rosa_preview_family_label((string) $terms[0], $locale) : $fallbackInstrument;

    $sku = rosa_preview_product_reference($product);
    $isVariable = $product->is_type('variable');
    if ($isVariable) {
        $children = $product->get_children();
        if (! empty($children)) {
            $firstVar = wc_get_product($children[0]);
            if ($firstVar instanceof WC_Product_Variation) {
                if ($sku === '') {
                    $sku = (string) $firstVar->get_sku();
                }
            }
        }
    }
    if ($sku === '') {
        $sku = 'ROSA-' . $product->get_id();
    }
    ?>
    <article class="rosa-preview-product" data-product-id="<?php echo esc_attr((string) $product->get_id()); ?>" data-product-type="<?php echo esc_attr($isVariable ? 'variable' : 'simple'); ?>" data-family="<?php echo esc_attr($familySlug); ?>">
      <a class="rosa-preview-product__media" href="<?php echo esc_url($url); ?>"><?php if (! $placeholder && $imageId > 0) { echo wp_get_attachment_image($imageId, 'woocommerce_thumbnail', false, ['alt' => $name, 'loading' => 'lazy']); } else { get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $mediaSlot, 'label' => $name]); } ?></a>
      <div class="rosa-preview-product__body">
        <div class="rosa-preview-product__meta-top">
          <span class="rosa-preview-product__family"><?php echo esc_html($familyLabel); ?></span>
          <span class="rosa-preview-product__sku">REF: <?php echo esc_html($sku); ?></span>
        </div>
        <h3 class="rosa-preview-product__title"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($name); ?></a></h3>
        <p class="rosa-preview-product__price"><?php echo esc_html(rosa_preview_price_label($locale)); ?></p>
        <?php if ($isVariable) : ?>
          <a class="rosa-preview-button rosa-preview-button--accent rosa-card-quote-btn rosa-card-quote-btn--configuration" href="<?php echo esc_url($url); ?>" data-rosa-select-configuration>
            <span class="rosa-card-quote-btn__text"><?php echo esc_html($locale === 'ar' ? 'اختر التكوين' : 'Select configuration'); ?></span>
          </a>
        <?php else : ?>
          <div class="rosa-preview-product__quote-bar" data-rosa-quote-item>
            <div class="rosa-qty-stepper">
              <button type="button" class="rosa-qty-btn" data-rosa-qty-minus aria-label="<?php echo esc_attr($locale === 'ar' ? 'تقليل الكمية' : 'Decrease quantity'); ?>">−</button>
              <input type="number" class="rosa-qty-input" data-rosa-quote-quantity value="1" min="1" step="1" inputmode="numeric" aria-label="<?php echo esc_attr($locale === 'ar' ? 'الكمية' : 'Quantity'); ?>">
              <button type="button" class="rosa-qty-btn" data-rosa-qty-plus aria-label="<?php echo esc_attr($locale === 'ar' ? 'زيادة الكمية' : 'Increase quantity'); ?>">+</button>
            </div>
            <button type="button" class="rosa-preview-button rosa-preview-button--accent rosa-card-quote-btn" data-rosa-add-to-quote data-product-id="<?php echo esc_attr((string) $product->get_id()); ?>" data-sku="<?php echo esc_attr($sku); ?>" data-variation-id="0">
              <span class="rosa-card-quote-btn__icon" aria-hidden="true">+</span>
              <span class="rosa-card-quote-btn__text"><?php echo esc_html($locale === 'ar' ? 'أضف للطلب' : 'Add to Quote'); ?></span>
            </button>
          </div>
        <?php endif; ?>
      </div>
    </article>
    <?php return;
}

if (is_array($family)) {
    $label = rosa_preview_family_label((string) ($family['label'] ?? ''), $locale);
    $url = (string) ($family['url'] ?? home_url('/shop/'));
    $familyType = rosa_preview_content('site', 'catalogue_family', $locale, $locale === 'ar' ? 'فئة كتالوج' : 'Catalogue family');
    $browseFamily = rosa_preview_content('site', 'browse_family', $locale, $locale === 'ar' ? 'تصفح الفئة' : 'Browse family');
    ?>
    <article class="rosa-preview-product rosa-preview-product--family">
      <a class="rosa-preview-product__media" href="<?php echo esc_url($url); ?>"><?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $mediaSlot, 'label' => $label]); ?></a>
      <div class="rosa-preview-product__body">
        <p class="rosa-preview-product__family"><?php echo esc_html($familyType); ?></p>
        <h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($label); ?></a></h3>
        <p class="rosa-preview-product__price"><?php echo esc_html(rosa_preview_price_label($locale)); ?></p>
        <a class="rosa-preview-product__action" href="<?php echo esc_url($url); ?>"><?php echo esc_html($browseFamily); ?></a>
      </div>
    </article>
<?php }
