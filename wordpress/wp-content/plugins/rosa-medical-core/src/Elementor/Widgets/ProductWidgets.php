<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor\Widgets;

use Elementor\Controls_Manager;
use RosaMedical\Core\Elementor\ProductTemplate;
use WC_Product;
use WC_Product_Variable;
use WC_Product_Variation;
use WP_Term;

abstract class AbstractRosaProductWidget extends AbstractRosaSectionWidget
{
    /** @return list<string> */
    public function get_keywords(): array
    {
        return ['rosa', 'medical', 'product', 'woocommerce', 'catalogue'];
    }

    protected function product(): ?WC_Product
    {
        return ProductTemplate::currentProduct();
    }

    protected function productLocale(): string
    {
        return ProductTemplate::currentLocale();
    }

    protected function t(string $en, string $ar): string
    {
        return $this->productLocale() === 'ar' ? $ar : $en;
    }

    protected function family(?WC_Product $product = null): ?WP_Term
    {
        $product = $product ?? $this->product();
        if (! $product instanceof WC_Product || ! function_exists('wc_get_product_terms')) {
            return null;
        }

        $terms = wc_get_product_terms($product->get_id(), 'product_cat');
        return isset($terms[0]) && $terms[0] instanceof WP_Term ? $terms[0] : null;
    }

    /** @return list<WC_Product_Variation> */
    protected function variations(?WC_Product $product = null): array
    {
        $product = $product ?? $this->product();
        if (! $product instanceof WC_Product_Variable || ! function_exists('wc_get_product')) {
            return [];
        }

        $variations = [];
        foreach ($product->get_children() as $variationId) {
            $variation = wc_get_product((int) $variationId);
            if ($variation instanceof WC_Product_Variation && $variation->get_status() === 'publish') {
                $variations[] = $variation;
            }
        }
        return $variations;
    }

    /** @return array<string,string> */
    protected function variationAttributes(WC_Product_Variation $variation, WC_Product $product): array
    {
        $resolved = [];
        foreach ($variation->get_attributes() as $taxonomy => $value) {
            $value = (string) $value;
            if ($value === '') {
                continue;
            }

            $label = function_exists('wc_attribute_label') ? wc_attribute_label((string) $taxonomy, $product) : (string) $taxonomy;
            $display = $value;
            if (function_exists('taxonomy_exists') && taxonomy_exists((string) $taxonomy) && function_exists('get_term_by')) {
                $term = get_term_by('slug', $value, (string) $taxonomy);
                if ($term instanceof WP_Term) {
                    $display = $term->name;
                }
            }
            $resolved[(string) $label] = $display;
        }
        return $resolved;
    }

    protected function variationLabel(WC_Product_Variation $variation, WC_Product $product): string
    {
        $values = array_values($this->variationAttributes($variation, $product));
        return $values !== [] ? implode(' · ', $values) : ($variation->get_sku() !== '' ? $variation->get_sku() : $this->t('Configuration', 'التكوين'));
    }

    protected function unavailable(): void
    {
        echo '<div class="rosa-product-detail__editor-notice">' . esc_html($this->t('Choose a published WooCommerce product to preview this widget.', 'اختر منتج WooCommerce منشوراً لمعاينة هذه الأداة.')) . '</div>';
    }

    protected function addLocalizedText(string $id, string $label, string $en, string $ar): void
    {
        $this->addText($id . '_en', $label . ' — EN', $en);
        $this->addText($id . '_ar', $label . ' — AR', $ar);
    }

    protected function addLocalizedTextarea(string $id, string $label, string $en, string $ar): void
    {
        $this->addTextarea($id . '_en', $label . ' — EN', $en);
        $this->addTextarea($id . '_ar', $label . ' — AR', $ar);
    }

    /** @param array<string,mixed> $settings */
    protected function setting(array $settings, string $id, string $fallbackEn, string $fallbackAr): string
    {
        $suffix = $this->productLocale() === 'ar' ? '_ar' : '_en';
        $value = $settings[$id . $suffix] ?? '';
        return is_scalar($value) && trim((string) $value) !== '' ? trim((string) $value) : $this->t($fallbackEn, $fallbackAr);
    }
}

final class ProductBreadcrumbWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-breadcrumb'; }
    public function get_title(): string { return 'Rosa Product — Breadcrumb'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Labels');
        $this->addLocalizedText('home', 'Home label', 'Home', 'الرئيسية');
        $this->addLocalizedText('products', 'Products label', 'Products', 'المنتجات');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $locale = $this->productLocale();
        $family = $this->family($product);
        $homeUrl = home_url($locale === 'ar' ? '/ar/' : '/');
        $shopUrl = home_url($locale === 'ar' ? '/ar/shop/' : '/shop/');
        ?>
        <nav class="rosa-product-detail__breadcrumb" data-preview-product-breadcrumb aria-label="<?php echo esc_attr($this->t('Breadcrumb', 'مسار التنقل')); ?>">
            <div class="rosa-preview-rail">
                <a href="<?php echo esc_url($homeUrl); ?>"><?php echo esc_html($this->setting($settings, 'home', 'Home', 'الرئيسية')); ?></a>
                <span aria-hidden="true">/</span>
                <a href="<?php echo esc_url($shopUrl); ?>"><?php echo esc_html($this->setting($settings, 'products', 'Products', 'المنتجات')); ?></a>
                <?php if ($family instanceof WP_Term) :
                    $familyUrl = $locale === 'ar'
                        ? add_query_arg('family', $family->slug, home_url('/ar/shop/'))
                        : get_term_link($family);
                    if (! is_wp_error($familyUrl)) : ?>
                        <span aria-hidden="true">/</span>
                        <a href="<?php echo esc_url((string) $familyUrl); ?>"><?php echo esc_html($family->name); ?></a>
                    <?php endif;
                endif; ?>
                <span aria-hidden="true">/</span>
                <span aria-current="page"><?php echo esc_html($product->get_name()); ?></span>
            </div>
        </nav>
        <?php
    }
}

final class ProductGalleryWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-gallery'; }
    public function get_title(): string { return 'Rosa Product — Gallery'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Gallery');
        $this->addLocalizedText('label', 'Accessible label', 'Product gallery', 'معرض المنتج');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $ids = array_values(array_unique(array_filter(array_merge(
            [$product->get_image_id()],
            $product->get_gallery_image_ids()
        ), static fn($id): bool => (int) $id > 0)));
        $primary = (int) ($ids[0] ?? 0);
        ?>
        <section class="rosa-product-detail__gallery" data-preview-product-gallery aria-label="<?php echo esc_attr($this->setting($settings, 'label', 'Product gallery', 'معرض المنتج')); ?>">
            <div class="rosa-product-detail__gallery-main">
                <?php if ($primary > 0) :
                    $src = wp_get_attachment_image_url($primary, 'large') ?: '';
                    $srcset = wp_get_attachment_image_srcset($primary, 'large') ?: ''; ?>
                    <img data-rosa-product-main-image src="<?php echo esc_url($src); ?>" <?php echo $srcset !== '' ? 'srcset="' . esc_attr($srcset) . '"' : ''; ?> sizes="(max-width: 900px) 100vw, 52vw" alt="<?php echo esc_attr($product->get_name()); ?>">
                <?php elseif (function_exists('get_template_part')) : ?>
                    <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'catalogue-product', 'label' => $product->get_name()]); ?>
                <?php endif; ?>
            </div>
            <?php if ($ids !== []) : ?>
                <div class="rosa-product-detail__thumbnails" data-preview-product-thumbnails>
                    <?php foreach (array_slice($ids, 0, 5) as $index => $imageId) :
                        $thumb = wp_get_attachment_image_url((int) $imageId, 'woocommerce_thumbnail') ?: '';
                        $full = wp_get_attachment_image_url((int) $imageId, 'large') ?: '';
                        $srcset = wp_get_attachment_image_srcset((int) $imageId, 'large') ?: '';
                        $alt = (string) get_post_meta((int) $imageId, '_wp_attachment_image_alt', true);
                        $alt = $alt !== '' ? $alt : $product->get_name(); ?>
                        <button class="rosa-product-detail__thumbnail<?php echo $index === 0 ? ' is-active' : ''; ?>" type="button" data-rosa-product-thumb data-full-src="<?php echo esc_url($full); ?>" data-full-srcset="<?php echo esc_attr($srcset); ?>" data-alt="<?php echo esc_attr($alt); ?>" aria-pressed="<?php echo $index === 0 ? 'true' : 'false'; ?>" aria-label="<?php echo esc_attr(sprintf($this->t('View image %d', 'عرض الصورة %d'), $index + 1)); ?>">
                            <img src="<?php echo esc_url($thumb); ?>" alt="" loading="lazy">
                        </button>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </section>
        <?php
    }
}

final class ProductSummaryWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-summary'; }
    public function get_title(): string { return 'Rosa Product — Summary & Quote'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Labels');
        $this->addLocalizedText('price', 'Price label', 'Pricing on request', 'السعر عند الطلب');
        $this->addLocalizedText('sku', 'SKU label', 'Catalogue reference', 'مرجع الكتالوج');
        $this->addLocalizedText('family', 'Family label', 'Instrument family', 'فئة الأداة');
        $this->addLocalizedText('configuration', 'Configuration label', 'Configuration', 'التكوين');
        $this->addLocalizedText('quantity', 'Quantity label', 'Quantity', 'الكمية');
        $this->addLocalizedText('add', 'Quote button', 'Add to Quote', 'أضف إلى عرض السعر');
        $this->addLocalizedText('help', 'Quote helper', 'Select the exact catalogue configuration and quantity required.', 'اختر تكوين الكتالوج الدقيق والكمية المطلوبة.');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $family = $this->family($product);
        $variations = $this->variations($product);
        $quotable = array_values(array_filter($variations, static fn(WC_Product_Variation $variation): bool => trim($variation->get_sku()) !== ''));
        $description = trim($product->get_short_description());
        if ($description === '') {
            $description = trim($product->get_description());
        }
        $configurationCount = $product instanceof WC_Product_Variable ? count($variations) : 1;
        ?>
        <section class="rosa-product-detail__summary" data-preview-product-summary>
            <?php if ($family instanceof WP_Term) : ?><p class="rosa-product-detail__eyebrow"><?php echo esc_html($family->name); ?></p><?php endif; ?>
            <h1><?php echo esc_html($product->get_name()); ?></h1>
            <?php if ($description !== '') : ?><div class="rosa-product-detail__summary-copy"><?php echo wp_kses_post(wpautop($description)); ?></div><?php endif; ?>

            <div class="rosa-product-detail__meta" aria-label="<?php echo esc_attr($this->t('Product reference information', 'معلومات مرجع المنتج')); ?>">
                <?php if ($product->get_sku() !== '') : ?>
                    <div><span><?php echo esc_html($this->setting($settings, 'sku', 'Catalogue reference', 'مرجع الكتالوج')); ?></span><strong><?php echo esc_html($product->get_sku()); ?></strong></div>
                <?php endif; ?>
                <?php if ($family instanceof WP_Term) : ?>
                    <div><span><?php echo esc_html($this->setting($settings, 'family', 'Instrument family', 'فئة الأداة')); ?></span><strong><?php echo esc_html($family->name); ?></strong></div>
                <?php endif; ?>
                <div><span><?php echo esc_html($this->t('Configurations', 'التكوينات')); ?></span><strong><?php echo esc_html((string) $configurationCount); ?></strong></div>
            </div>

            <div class="rosa-product-detail__quote-panel">
                <p class="rosa-product-detail__availability"><span aria-hidden="true"></span><?php echo esc_html($this->setting($settings, 'price', 'Pricing on request', 'السعر عند الطلب')); ?></p>
                <p class="rosa-product-detail__quote-help"><?php echo esc_html($this->setting($settings, 'help', 'Select the exact catalogue configuration and quantity required.', 'اختر تكوين الكتالوج الدقيق والكمية المطلوبة.')); ?></p>

                <?php if ($quotable !== []) : ?>
                    <div class="rosa-product-detail__quote-form" data-rosa-quote-item>
                        <label for="rosa-product-configuration"><?php echo esc_html($this->setting($settings, 'configuration', 'Configuration', 'التكوين')); ?></label>
                        <select id="rosa-product-configuration" data-rosa-quote-configuration>
                            <?php foreach ($quotable as $variation) : ?>
                                <option value="<?php echo esc_attr((string) $variation->get_id()); ?>" data-variation-id="<?php echo esc_attr((string) $variation->get_id()); ?>" data-sku="<?php echo esc_attr($variation->get_sku()); ?>"><?php echo esc_html($this->variationLabel($variation, $product) . ' — ' . $variation->get_sku()); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <div class="rosa-product-detail__quote-actions">
                            <div class="rosa-product-detail__quantity">
                                <label for="rosa-product-quantity"><?php echo esc_html($this->setting($settings, 'quantity', 'Quantity', 'الكمية')); ?></label>
                                <input id="rosa-product-quantity" type="number" min="1" step="1" value="1" inputmode="numeric" data-rosa-quote-quantity>
                            </div>
                            <button type="button" class="rosa-preview-button rosa-preview-button--accent" data-rosa-add-to-quote data-product-id="<?php echo esc_attr((string) $product->get_id()); ?>" data-variation-id="<?php echo esc_attr((string) $quotable[0]->get_id()); ?>" data-sku="<?php echo esc_attr($quotable[0]->get_sku()); ?>"><?php echo esc_html($this->setting($settings, 'add', 'Add to Quote', 'أضف إلى عرض السعر')); ?></button>
                        </div>
                    </div>
                <?php elseif (! $product instanceof WC_Product_Variable && trim($product->get_sku()) !== '') : ?>
                    <div class="rosa-product-detail__quote-form" data-rosa-quote-item>
                        <div class="rosa-product-detail__quote-actions">
                            <div class="rosa-product-detail__quantity">
                                <label for="rosa-product-quantity"><?php echo esc_html($this->setting($settings, 'quantity', 'Quantity', 'الكمية')); ?></label>
                                <input id="rosa-product-quantity" type="number" min="1" step="1" value="1" inputmode="numeric" data-rosa-quote-quantity>
                            </div>
                            <button type="button" class="rosa-preview-button rosa-preview-button--accent" data-rosa-add-to-quote data-product-id="<?php echo esc_attr((string) $product->get_id()); ?>" data-variation-id="0" data-sku="<?php echo esc_attr($product->get_sku()); ?>"><?php echo esc_html($this->setting($settings, 'add', 'Add to Quote', 'أضف إلى عرض السعر')); ?></button>
                        </div>
                    </div>
                <?php else : ?>
                    <a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url(home_url($this->productLocale() === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>"><?php echo esc_html($this->t('Request a quotation', 'اطلب عرض سعر')); ?></a>
                <?php endif; ?>
            </div>
        </section>
        <?php
    }
}

final class ProductDetailsWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-details'; }
    public function get_title(): string { return 'Rosa Product — Details'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Copy');
        $this->addLocalizedText('eyebrow', 'Eyebrow', 'Product details', 'تفاصيل المنتج');
        $this->addLocalizedText('title', 'Heading', 'Built around an exact catalogue reference.', 'مصمم حول مرجع كتالوج دقيق.');
        $this->addLocalizedText('description_tab', 'Description tab', 'Description', 'الوصف');
        $this->addLocalizedText('configurations_tab', 'Configurations tab', 'Configurations', 'التكوينات');
        $this->addLocalizedText('related_tab', 'Related tab', 'Related instruments', 'أدوات ذات صلة');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $family = $this->family($product);
        $variations = $this->variations($product);
        $description = trim($product->get_description());
        if ($description === '') {
            $description = trim($product->get_short_description());
        }
        ?>
        <section id="product-details" class="rosa-product-detail__details rosa-preview-rail" data-preview-product-details>
            <nav class="rosa-product-detail__tabs" aria-label="<?php echo esc_attr($this->t('Product detail sections', 'أقسام تفاصيل المنتج')); ?>">
                <a class="is-active" href="#product-details"><?php echo esc_html($this->setting($settings, 'description_tab', 'Description', 'الوصف')); ?></a>
                <a href="#product-configurations"><?php echo esc_html($this->setting($settings, 'configurations_tab', 'Configurations', 'التكوينات')); ?></a>
                <a href="#related-instruments"><?php echo esc_html($this->setting($settings, 'related_tab', 'Related instruments', 'أدوات ذات صلة')); ?></a>
            </nav>
            <div class="rosa-product-detail__details-grid">
                <div class="rosa-product-detail__description">
                    <p class="rosa-product-detail__eyebrow"><?php echo esc_html($this->setting($settings, 'eyebrow', 'Product details', 'تفاصيل المنتج')); ?></p>
                    <h2><?php echo esc_html($this->setting($settings, 'title', 'Built around an exact catalogue reference.', 'مصمم حول مرجع كتالوج دقيق.')); ?></h2>
                    <?php if ($description !== '') : ?>
                        <div class="rosa-product-detail__long-copy"><?php echo wp_kses_post(wpautop($description)); ?></div>
                    <?php else : ?>
                        <p><?php echo esc_html($this->t('Use the configuration table below to identify the required reference.', 'استخدم جدول التكوين أدناه لتحديد المرجع المطلوب.')); ?></p>
                    <?php endif; ?>
                </div>
                <aside class="rosa-product-detail__spec-card" aria-label="<?php echo esc_attr($this->t('Catalogue summary', 'ملخص الكتالوج')); ?>">
                    <p><?php echo esc_html($this->t('Catalogue summary', 'ملخص الكتالوج')); ?></p>
                    <?php if ($product->get_sku() !== '') : ?><div><span>SKU</span><strong><?php echo esc_html($product->get_sku()); ?></strong></div><?php endif; ?>
                    <?php if ($family instanceof WP_Term) : ?><div><span><?php echo esc_html($this->t('Family', 'الفئة')); ?></span><strong><?php echo esc_html($family->name); ?></strong></div><?php endif; ?>
                    <div><span><?php echo esc_html($this->t('Configurations', 'التكوينات')); ?></span><strong><?php echo esc_html((string) ($product instanceof WC_Product_Variable ? count($variations) : 1)); ?></strong></div>
                    <div><span><?php echo esc_html($this->t('Commercial terms', 'الشروط التجارية')); ?></span><strong><?php echo esc_html($this->t('On request', 'عند الطلب')); ?></strong></div>
                </aside>
            </div>
        </section>
        <?php
    }
}

final class ProductConfigurationsWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-configurations'; }
    public function get_title(): string { return 'Rosa Product — Configurations'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Copy');
        $this->addLocalizedText('eyebrow', 'Eyebrow', 'Available configurations', 'التكوينات المتاحة');
        $this->addLocalizedText('title', 'Heading', 'Choose the exact instrument reference.', 'اختر مرجع الأداة الدقيق.');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $variations = $this->variations($product);
        ?>
        <section id="product-configurations" class="rosa-product-detail__configurations rosa-preview-rail" data-preview-product-configurations>
            <div class="rosa-product-detail__section-heading">
                <p class="rosa-product-detail__eyebrow"><?php echo esc_html($this->setting($settings, 'eyebrow', 'Available configurations', 'التكوينات المتاحة')); ?></p>
                <h2><?php echo esc_html($this->setting($settings, 'title', 'Choose the exact instrument reference.', 'اختر مرجع الأداة الدقيق.')); ?></h2>
            </div>
            <?php if ($variations !== []) : ?>
                <div class="rosa-product-detail__configuration-list">
                    <?php foreach ($variations as $variation) :
                        $sku = trim($variation->get_sku());
                        $attributes = $this->variationAttributes($variation, $product); ?>
                        <article class="rosa-product-detail__configuration" data-variation-id="<?php echo esc_attr((string) $variation->get_id()); ?>">
                            <div class="rosa-product-detail__configuration-head">
                                <p class="rosa-product-detail__configuration-label"><?php echo esc_html($this->t('Configuration', 'التكوين')); ?></p>
                                <h3><?php echo esc_html($this->variationLabel($variation, $product)); ?></h3>
                            </div>
                            <dl>
                                <div><dt>SKU</dt><dd><?php echo esc_html($sku); ?></dd></div>
                                <?php foreach ($attributes as $label => $value) : ?>
                                    <div><dt><?php echo esc_html($label); ?></dt><dd><?php echo esc_html($value); ?></dd></div>
                                <?php endforeach; ?>
                            </dl>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php else : ?>
                <article class="rosa-product-detail__configuration rosa-product-detail__configuration--simple">
                    <div class="rosa-product-detail__configuration-head"><p class="rosa-product-detail__configuration-label"><?php echo esc_html($this->t('Catalogue reference', 'مرجع الكتالوج')); ?></p><h3><?php echo esc_html($product->get_name()); ?></h3></div>
                    <dl><div><dt>SKU</dt><dd><?php echo esc_html($product->get_sku() !== '' ? $product->get_sku() : '—'); ?></dd></div></dl>
                </article>
            <?php endif; ?>
        </section>
        <?php
    }
}

final class ProductSupportWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-support'; }
    public function get_title(): string { return 'Rosa Product — Procurement Support'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Copy');
        $this->addLocalizedText('eyebrow', 'Eyebrow', 'Procurement support', 'دعم المشتريات');
        $this->addLocalizedText('title', 'Heading', 'From catalogue reference to a clear quotation request.', 'من مرجع الكتالوج إلى طلب عرض سعر واضح.');
        $this->addLocalizedText('step_1_title', 'Step 1 title', 'Identify the configuration', 'حدد التكوين');
        $this->addLocalizedTextarea('step_1_body', 'Step 1 body', 'Choose the exact size, direction or variant required.', 'اختر المقاس أو الاتجاه أو النوع المطلوب بدقة.');
        $this->addLocalizedText('step_2_title', 'Step 2 title', 'Confirm the reference', 'أكد المرجع');
        $this->addLocalizedTextarea('step_2_body', 'Step 2 body', 'Use the catalogue SKU shown on the selected configuration.', 'استخدم رمز SKU الظاهر في التكوين المحدد.');
        $this->addLocalizedText('step_3_title', 'Step 3 title', 'Send the request', 'أرسل الطلب');
        $this->addLocalizedTextarea('step_3_body', 'Step 3 body', 'Add required items and quantities, then send the quotation request to Rosa.', 'أضف الأدوات والكميات المطلوبة ثم أرسل طلب عرض السعر إلى روزا.');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $steps = [
            [$this->setting($settings, 'step_1_title', 'Identify the configuration', 'حدد التكوين'), $this->setting($settings, 'step_1_body', 'Choose the exact size, direction or variant required.', 'اختر المقاس أو الاتجاه أو النوع المطلوب بدقة.')],
            [$this->setting($settings, 'step_2_title', 'Confirm the reference', 'أكد المرجع'), $this->setting($settings, 'step_2_body', 'Use the catalogue SKU shown on the selected configuration.', 'استخدم رمز SKU الظاهر في التكوين المحدد.')],
            [$this->setting($settings, 'step_3_title', 'Send the request', 'أرسل الطلب'), $this->setting($settings, 'step_3_body', 'Add required items and quantities, then send the quotation request to Rosa.', 'أضف الأدوات والكميات المطلوبة ثم أرسل طلب عرض السعر إلى روزا.')],
        ];
        ?>
        <section class="rosa-product-detail__support-band" data-preview-product-support>
            <div class="rosa-product-detail__support rosa-preview-rail">
                <div class="rosa-product-detail__support-intro">
                    <p class="rosa-product-detail__support-eyebrow"><?php echo esc_html($this->setting($settings, 'eyebrow', 'Procurement support', 'دعم المشتريات')); ?></p>
                    <h2><?php echo esc_html($this->setting($settings, 'title', 'From catalogue reference to a clear quotation request.', 'من مرجع الكتالوج إلى طلب عرض سعر واضح.')); ?></h2>
                </div>
                <div class="rosa-product-detail__support-steps">
                    <?php foreach ($steps as $index => [$title, $body]) : ?>
                        <article class="rosa-product-detail__support-step" data-preview-product-support-step><span><?php echo esc_html(sprintf('%02d', $index + 1)); ?></span><div><strong><?php echo esc_html($title); ?></strong><p><?php echo esc_html($body); ?></p></div></article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php
    }
}

final class ProductRelatedWidget extends AbstractRosaProductWidget
{
    public function get_name(): string { return 'rosa-product-related'; }
    public function get_title(): string { return 'Rosa Product — Related Instruments'; }

    protected function register_controls(): void
    {
        $this->beginContentSection('Copy');
        $this->addLocalizedText('eyebrow', 'Eyebrow', 'Related instruments', 'أدوات ذات صلة');
        $this->addLocalizedText('title', 'Heading', 'Continue exploring the catalogue.', 'واصل استكشاف الكتالوج.');
        $this->end_controls_section();
    }

    protected function render(): void
    {
        $product = $this->product();
        if (! $product instanceof WC_Product) { $this->unavailable(); return; }
        $settings = $this->get_settings_for_display();
        $settings = is_array($settings) ? $settings : [];
        $locale = $this->productLocale();
        $related = [];
        if (function_exists('wc_get_related_products') && function_exists('wc_get_product')) {
            foreach (wc_get_related_products($product->get_id(), 4) as $id) {
                $candidate = wc_get_product((int) $id);
                if ($candidate instanceof WC_Product && $candidate->get_status() === 'publish') {
                    $related[] = $candidate;
                }
            }
        }

        $family = $this->family($product);
        $currentSlug = $family instanceof WP_Term ? $family->slug : '';
        $fallbacks = [];
        foreach ([['knives', 'Knives'], ['scissors', 'Scissors'], ['punches', 'Punches'], ['chisels', 'Chisels'], ['cutters', 'Cutters']] as [$slug, $label]) {
            if ($slug === $currentSlug) { continue; }
            $url = add_query_arg('family', $slug, home_url($locale === 'ar' ? '/ar/shop/' : '/shop/'));
            $term = get_term_by('slug', $slug, 'product_cat');
            if ($term instanceof WP_Term) {
                if ($locale !== 'ar') {
                    $termUrl = get_term_link($term);
                    if (! is_wp_error($termUrl)) { $url = (string) $termUrl; }
                }
                $label = $term->name;
            }
            $fallbacks[] = ['label' => $label, 'url' => $url];
        }
        ?>
        <section id="related-instruments" class="rosa-product-detail__related rosa-preview-rail" data-preview-product-related>
            <div class="rosa-product-detail__related-heading"><p class="rosa-product-detail__eyebrow"><?php echo esc_html($this->setting($settings, 'eyebrow', 'Related instruments', 'أدوات ذات صلة')); ?></p><h2><?php echo esc_html($this->setting($settings, 'title', 'Continue exploring the catalogue.', 'واصل استكشاف الكتالوج.')); ?></h2></div>
            <div class="rosa-product-detail__related-grid">
                <?php foreach (array_slice($related, 0, 4) as $relatedProduct) :
                    get_template_part('template-parts/client-preview/product-card', null, ['product' => $relatedProduct, 'locale' => $locale]);
                endforeach;
                foreach (array_slice($fallbacks, 0, max(0, 4 - count($related))) as $fallback) :
                    get_template_part('template-parts/client-preview/product-card', null, ['family' => $fallback, 'locale' => $locale, 'placeholder' => true]);
                endforeach; ?>
            </div>
        </section>
        <?php
    }
}
