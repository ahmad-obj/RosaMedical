<?php
/**
 * Production Rosa Product Detail presentation.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

use RosaMedical\Core\Catalogue\FamilyCatalogue;
use RosaMedical\Core\Catalogue\ProductPresentation;

$product = wc_get_product(get_the_ID());
$view = $product instanceof WC_Product ? ProductPresentation::forProduct($product) : null;
$catalogue = $product instanceof WC_Product ? FamilyCatalogue::forProduct($product) : null;

get_header();

if (! is_array($view) || ! $product instanceof WC_Product) :
?>
<section class="rosa-product-unavailable rosa-rail rosa-rail--reading">
    <p class="rosa-eyebrow"><?php esc_html_e('Products', 'rosa-medical'); ?></p>
    <h1 class="rosa-section-title"><?php esc_html_e('Product unavailable', 'rosa-medical'); ?></h1>
    <p><?php esc_html_e('This product cannot be displayed right now. Contact Rosa for procurement assistance.', 'rosa-medical'); ?></p>
    <a class="rosa-button rosa-button--primary" href="<?php echo esc_url(home_url('/contact/')); ?>"><?php esc_html_e('Contact Us', 'rosa-medical'); ?></a>
</section>
<?php
get_footer();
return;
endif;

$configurations = $view['configurations'];
$configurationCount = count($configurations);
$singleConfiguration = $configurationCount === 1 ? $configurations[0] : null;
$attributeKeys = [];
foreach ($configurations as $configuration) {
    foreach (array_keys($configuration['attributes']) as $attributeKey) {
        if (! in_array($attributeKey, $attributeKeys, true)) {
            $attributeKeys[] = $attributeKey;
        }
    }
}
$inquiryEnabled = (bool) $view['inquiry_enabled'];
$initialValid = $singleConfiguration !== null;
?>
<article
    class="rosa-product-detail"
    data-rosa-product-detail
    data-inquiry-enabled="<?php echo $inquiryEnabled ? '1' : '0'; ?>"
    data-sticky-action="<?php echo ($inquiryEnabled && $initialValid) ? 'true' : 'false'; ?>"
>
    <div class="rosa-rail rosa-rail--wide rosa-product-detail__breadcrumb">
        <a href="<?php echo esc_url(get_post_type_archive_link('product') ?: home_url('/products/')); ?>"><?php esc_html_e('Products', 'rosa-medical'); ?></a>
        <?php if (is_array($view['family'])) : ?>
            <span aria-hidden="true">/</span>
            <span><?php echo esc_html($view['family']['name']); ?></span>
        <?php endif; ?>
    </div>

    <div class="rosa-rail rosa-rail--wide rosa-product-detail__layout">
        <section class="rosa-product-detail__media" aria-label="<?php echo esc_attr__('Product media', 'rosa-medical'); ?>">
            <?php if (is_array($view['image'])) : ?>
                <img src="<?php echo esc_url($view['image']['url']); ?>" alt="<?php echo esc_attr($view['image']['alt'] !== '' ? $view['image']['alt'] : $view['name']); ?>">
            <?php else : ?>
                <div class="rosa-product-detail__media-placeholder" aria-hidden="true">ROSA</div>
            <?php endif; ?>
        </section>

        <div class="rosa-product-detail__summary">
            <?php if (is_array($view['family'])) : ?>
                <p class="rosa-eyebrow"><?php echo esc_html($view['family']['name']); ?></p>
            <?php endif; ?>
            <h1 class="rosa-product-detail__title"><?php echo esc_html($view['name']); ?></h1>
            <?php if ($view['description'] !== '') : ?>
                <div class="rosa-product-detail__description"><?php echo wp_kses_post(wpautop($view['description'])); ?></div>
            <?php endif; ?>

            <section class="rosa-product-detail__configuration-block" aria-labelledby="rosa-configuration-title">
                <h2 id="rosa-configuration-title"><?php esc_html_e('Select configuration', 'rosa-medical'); ?></h2>

                <?php if ($configurationCount === 0) : ?>
                    <p class="rosa-product-detail__unavailable"><?php esc_html_e('No valid configuration is currently available. Contact Rosa for procurement assistance.', 'rosa-medical'); ?></p>
                <?php elseif ($singleConfiguration !== null) : ?>
                    <div class="rosa-product-detail__single-configuration" data-rosa-single-configuration>
                        <strong><?php esc_html_e('Available configuration', 'rosa-medical'); ?></strong>
                        <span><?php echo esc_html($singleConfiguration['sku']); ?></span>
                    </div>
                <?php else : ?>
                    <fieldset class="rosa-product-detail__configuration-list">
                        <legend class="screen-reader-text"><?php esc_html_e('Available configurations', 'rosa-medical'); ?></legend>
                        <?php foreach ($configurations as $configuration) : ?>
                            <?php $attributesJson = wp_json_encode($configuration['attributes']); ?>
                            <label class="rosa-product-detail__configuration-option">
                                <input
                                    type="radio"
                                    name="rosa_configuration"
                                    value="<?php echo esc_attr((string) $configuration['id']); ?>"
                                    data-rosa-configuration
                                    data-sku="<?php echo esc_attr($configuration['sku']); ?>"
                                    data-rosa-attributes="<?php echo esc_attr(is_string($attributesJson) ? $attributesJson : '{}'); ?>"
                                >
                                <span class="rosa-product-detail__configuration-copy">
                                    <strong><?php echo esc_html($configuration['sku']); ?></strong>
                                    <?php foreach ($configuration['attributes'] as $key => $value) : ?>
                                        <span><?php echo esc_html(function_exists('wc_attribute_label') ? wc_attribute_label($key) : $key); ?>: <?php echo esc_html($value); ?></span>
                                    <?php endforeach; ?>
                                </span>
                            </label>
                        <?php endforeach; ?>
                    </fieldset>
                <?php endif; ?>

                <?php if ($configurationCount > 0) : ?>
                    <div class="rosa-product-detail__selected" aria-live="polite">
                        <h3><?php esc_html_e('Selected configuration', 'rosa-medical'); ?></h3>
                        <dl>
                            <div>
                                <dt><?php esc_html_e('SKU', 'rosa-medical'); ?></dt>
                                <dd data-rosa-selected-sku><?php echo esc_html($singleConfiguration['sku'] ?? __('Select a configuration', 'rosa-medical')); ?></dd>
                            </div>
                            <?php foreach ($attributeKeys as $attributeKey) : ?>
                                <?php $initialValue = $singleConfiguration['attributes'][$attributeKey] ?? ''; ?>
                                <div>
                                    <dt><?php echo esc_html(function_exists('wc_attribute_label') ? wc_attribute_label($attributeKey) : $attributeKey); ?></dt>
                                    <dd data-rosa-selected-attribute="<?php echo esc_attr($attributeKey); ?>"><?php echo esc_html($initialValue); ?></dd>
                                </div>
                            <?php endforeach; ?>
                        </dl>
                    </div>
                <?php endif; ?>
            </section>

            <section class="rosa-product-detail__procurement" aria-labelledby="rosa-procurement-title">
                <h2 id="rosa-procurement-title"><?php esc_html_e('Procurement', 'rosa-medical'); ?></h2>
                <div class="rosa-product-detail__price" data-rosa-price-state="<?php echo esc_attr($view['price']['kind']); ?>">
                    <span><?php esc_html_e('Effective price', 'rosa-medical'); ?></span>
                    <strong><?php echo esc_html($view['price']['label']); ?></strong>
                </div>
                <label class="rosa-product-detail__quantity">
                    <span><?php esc_html_e('Quantity', 'rosa-medical'); ?></span>
                    <input type="number" min="1" step="1" value="1" inputmode="numeric"<?php disabled($configurationCount === 0); ?>>
                </label>
                <button
                    class="rosa-button rosa-button--primary rosa-product-detail__inquiry-button"
                    type="button"
                    data-rosa-inquiry-action
                    <?php disabled(! $inquiryEnabled || ! $initialValid); ?>
                >
                    <?php esc_html_e('Add to Inquiry', 'rosa-medical'); ?>
                </button>
                <?php if (! $inquiryEnabled) : ?>
                    <p class="rosa-product-detail__scope-note"><?php esc_html_e('Inquiry submission will be enabled with the quotation system. Contact Rosa directly in the meantime.', 'rosa-medical'); ?></p>
                <?php endif; ?>
            </section>

            <?php if (is_array($catalogue)) : ?>
                <?php get_template_part('template-parts/catalogue-panel', null, ['catalogue' => $catalogue]); ?>
            <?php endif; ?>
        </div>
    </div>

    <section class="rosa-rail rosa-rail--wide rosa-product-detail__specifications" aria-labelledby="rosa-product-specifications-title">
        <p class="rosa-eyebrow"><?php esc_html_e('Product reference', 'rosa-medical'); ?></p>
        <h2 id="rosa-product-specifications-title" class="rosa-section-title"><?php esc_html_e('Configuration details', 'rosa-medical'); ?></h2>
        <p><?php esc_html_e('Use the exact SKU and configuration attributes shown above when preparing your procurement request.', 'rosa-medical'); ?></p>
    </section>

    <section class="rosa-product-detail__closure">
        <div class="rosa-rail rosa-rail--reading">
            <p class="rosa-eyebrow"><?php esc_html_e('Request a quotation', 'rosa-medical'); ?></p>
            <h2 class="rosa-section-title"><?php esc_html_e('Need help confirming the right instrument?', 'rosa-medical'); ?></h2>
            <p><?php esc_html_e('Send Rosa the product name, exact catalogue code and required quantity for procurement support.', 'rosa-medical'); ?></p>
            <a class="rosa-button rosa-button--primary" href="<?php echo esc_url(home_url('/inquiry/')); ?>"><?php esc_html_e('Request a quote', 'rosa-medical'); ?></a>
        </div>
    </section>

    <div class="rosa-product-detail__sticky-action" data-rosa-sticky-inquiry <?php echo ($inquiryEnabled && $initialValid) ? '' : 'hidden'; ?>>
        <span><?php echo esc_html($view['price']['label']); ?></span>
        <button class="rosa-button rosa-button--primary" type="button" data-rosa-inquiry-action <?php disabled(! $inquiryEnabled || ! $initialValid); ?>><?php esc_html_e('Add to Inquiry', 'rosa-medical'); ?></button>
    </div>
</article>
<?php
get_footer();
