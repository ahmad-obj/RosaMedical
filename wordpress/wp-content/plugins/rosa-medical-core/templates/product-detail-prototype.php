<?php
/**
 * Shared Rosa Product Detail presentation.
 *
 * WooCommerce remains the sole source of product, family, media, SKU,
 * configuration and description data. Theme/shared partials own the shell and
 * quotation CTA around this product-owned content.
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

$product = wc_get_product(get_the_ID());
if (! $product instanceof WC_Product) {
    status_header(404);
    nocache_headers();
    get_header();
    echo '<div class="rosa-product-detail"><p>' . esc_html__('Product unavailable.', 'rosa-medical') . '</p></div>';
    get_footer();
    return;
}

$locale = function_exists('rosa_preview_locale') ? rosa_preview_locale() : 'en';
$isArabic = $locale === 'ar';
$productId = $product->get_id();
$familyTerms = wc_get_product_terms($productId, 'product_cat');
$familyTerm = $familyTerms[0] ?? null;
$familyLabel = $familyTerm instanceof WP_Term ? $familyTerm->name : '';
$variations = [];

if ($product instanceof WC_Product_Variable) {
    foreach ($product->get_children() as $variationId) {
        $variation = wc_get_product((int) $variationId);
        if ($variation instanceof WC_Product_Variation && $variation->get_status() === 'publish') {
            $variations[] = $variation;
        }
    }
}

$imageIds = array_values(array_unique(array_filter(array_merge(
    [$product->get_image_id()],
    $product->get_gallery_image_ids()
), static fn($id): bool => (int) $id > 0)));
$primaryImageId = (int) ($imageIds[0] ?? 0);
$relatedProducts = [];

foreach (wc_get_related_products($productId, 4) as $relatedId) {
    $related = wc_get_product((int) $relatedId);
    if ($related instanceof WC_Product && $related->get_status() === 'publish') {
        $relatedProducts[] = $related;
    }
}

/*
 * Representative local fixtures can contain a single populated product family.
 * The public catalogue still exposes the five canonical Woo family navigation
 * surfaces. Use the same family-navigation model as Shop: resolve a real term
 * when it exists, otherwise link back to the Shop family filter. This never
 * creates or duplicates Woo product records.
 */
$relatedFamilies = [];
$shopUrl = $isArabic ? home_url('/ar/shop/') : (get_post_type_archive_link('product') ?: home_url('/shop/'));
$canonicalFamilies = [
    ['slug' => 'knives', 'label' => 'Knives'],
    ['slug' => 'scissors', 'label' => 'Scissors'],
    ['slug' => 'punches', 'label' => 'Punches'],
    ['slug' => 'chisels', 'label' => 'Chisels'],
    ['slug' => 'cutters', 'label' => 'Cutters'],
];
$currentFamilySlug = $familyTerm instanceof WP_Term ? (string) $familyTerm->slug : '';

foreach ($canonicalFamilies as $family) {
    if ($family['slug'] === $currentFamilySlug) {
        continue;
    }

    $term = get_term_by('slug', $family['slug'], 'product_cat');
    $url = add_query_arg('family', $family['slug'], $shopUrl);
    $displayLabel = $family['label'];

    if ($term instanceof WP_Term) {
        $termUrl = get_term_link($term);
        if (! is_wp_error($termUrl)) {
            $url = (string) $termUrl;
        }
        $displayLabel = $term->name;
    }

    $relatedFamilies[] = [
        'label' => $displayLabel,
        'url' => $url,
    ];

    if (count($relatedFamilies) >= 4) {
        break;
    }
}

$label = static fn(string $en, string $ar): string => $isArabic ? $ar : $en;

get_header();
?>
<div class="rosa-product-detail" id="main-content">
    <nav class="rosa-product-detail__breadcrumb" data-preview-product-breadcrumb aria-label="<?php echo esc_attr($label('Breadcrumb', 'مسار التنقل')); ?>">
        <div class="rosa-preview-rail">
            <a href="<?php echo esc_url(home_url($isArabic ? '/ar/' : '/')); ?>"><?php echo esc_html($label('Home', 'الرئيسية')); ?></a>
            <span aria-hidden="true">/</span>
            <a href="<?php echo esc_url(home_url($isArabic ? '/ar/shop/' : '/shop/')); ?>"><?php echo esc_html($label('Products', 'المنتجات')); ?></a>
            <?php if ($familyTerm instanceof WP_Term) :
                $familyUrl = get_term_link($familyTerm);
                if (! is_wp_error($familyUrl)) : ?>
                    <span aria-hidden="true">/</span>
                    <a href="<?php echo esc_url($familyUrl); ?>"><?php echo esc_html($familyLabel); ?></a>
                <?php endif;
            endif; ?>
            <span aria-hidden="true">/</span>
            <span aria-current="page"><?php echo esc_html($product->get_name()); ?></span>
        </div>
    </nav>

    <article class="rosa-product-detail__inner rosa-preview-rail">
        <div class="rosa-product-detail__topology">
            <section class="rosa-product-detail__gallery" data-preview-product-gallery aria-label="<?php echo esc_attr($label('Product gallery', 'معرض المنتج')); ?>">
                <div class="rosa-product-detail__gallery-main">
                    <?php if ($primaryImageId > 0) : ?>
                        <?php echo wp_get_attachment_image($primaryImageId, 'large', false, ['alt' => $product->get_name()]); ?>
                    <?php else : ?>
                        <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'catalogue-product', 'label' => $product->get_name()]); ?>
                    <?php endif; ?>
                </div>
                <div class="rosa-product-detail__thumbnails" data-preview-product-thumbnails>
                    <?php for ($thumbnailIndex = 0; $thumbnailIndex < 4; $thumbnailIndex++) :
                        $thumbnailImageId = (int) ($imageIds[$thumbnailIndex] ?? 0); ?>
                        <span class="rosa-product-detail__thumbnail">
                            <?php if ($thumbnailImageId > 0) : ?>
                                <?php echo wp_get_attachment_image($thumbnailImageId, 'woocommerce_thumbnail', false, ['alt' => $product->get_name()]); ?>
                            <?php else : ?>
                                <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'catalogue-product', 'label' => $product->get_name()]); ?>
                            <?php endif; ?>
                        </span>
                    <?php endfor; ?>
                </div>
            </section>

            <section class="rosa-product-detail__summary" data-preview-product-summary>
                <?php if ($familyLabel !== '') : ?>
                    <p class="rosa-product-detail__eyebrow"><?php echo esc_html($familyLabel); ?></p>
                <?php endif; ?>
                <h1><?php echo esc_html($product->get_name()); ?></h1>
                <?php if ($product->get_short_description() !== '') : ?>
                    <div class="rosa-product-detail__summary-copy"><?php echo wp_kses_post(wpautop($product->get_short_description())); ?></div>
                <?php elseif ($product->get_description() !== '') : ?>
                    <div class="rosa-product-detail__summary-copy"><?php echo wp_kses_post(wpautop($product->get_description())); ?></div>
                <?php endif; ?>
                <p class="rosa-product-detail__availability"><?php echo esc_html($label('Catalogue pricing on request', 'سعر الكتالوج عند الطلب')); ?></p>
                <a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url(home_url($isArabic ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>"><?php echo esc_html($label('Request a quotation', 'اطلب عرض سعر')); ?></a>
            </section>

            <aside class="rosa-product-detail__support" data-preview-product-support aria-label="<?php echo esc_attr($label('Procurement support', 'دعم المشتريات')); ?>">
                <p class="rosa-product-detail__support-eyebrow"><?php echo esc_html($label('Procurement support', 'دعم المشتريات')); ?></p>
                <h2><?php echo esc_html($label('Turn the reference into a clear request.', 'حوّل المرجع إلى طلب واضح.')); ?></h2>
                <?php
                $supportSteps = $isArabic
                    ? [
                        ['حدد التكوين', 'راجع الاتجاه والمقاس أو المتغير المطلوب.'],
                        ['أكد المرجع', 'استخدم رمز الكتالوج أو رقم SKU المتاح.'],
                        ['اطلب عرض سعر', 'شارك متطلباتك مع فريق روزا للمشتريات.'],
                    ]
                    : [
                        ['Identify the configuration', 'Review the direction, size or variant you need.'],
                        ['Confirm the reference', 'Use the available catalogue code or SKU.'],
                        ['Request a quotation', 'Share the requirement with the Rosa procurement team.'],
                    ];
                foreach ($supportSteps as $index => [$title, $copy]) : ?>
                    <div class="rosa-product-detail__support-step" data-preview-product-support-step>
                        <span><?php echo esc_html(sprintf('%02d', $index + 1)); ?></span>
                        <div><strong><?php echo esc_html($title); ?></strong><p><?php echo esc_html($copy); ?></p></div>
                    </div>
                <?php endforeach; ?>
            </aside>
        </div>

        <section class="rosa-product-detail__configurations" data-preview-product-configurations aria-labelledby="rosa-configurations-title">
            <nav class="rosa-product-detail__tabs" data-preview-product-tabs aria-label="<?php echo esc_attr($label('Product detail sections', 'أقسام تفاصيل المنتج')); ?>">
                <span class="is-active"><?php echo esc_html($label('Description', 'الوصف')); ?></span>
                <span><?php echo esc_html($label('Available configurations', 'التكوينات المتاحة')); ?></span>
            </nav>
            <div class="rosa-product-detail__description-layout">
                <div class="rosa-product-detail__description-media" data-preview-product-description-media>
                    <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => 'catalogue-product', 'label' => $product->get_name()]); ?>
                </div>
                <div class="rosa-product-detail__description-content">
                    <div class="rosa-product-detail__description">
                        <p class="rosa-product-detail__eyebrow"><?php echo esc_html($label('Product details', 'تفاصيل المنتج')); ?></p>
                        <h2 id="rosa-configurations-title"><?php echo esc_html($label('Description & configurations', 'الوصف والتكوينات')); ?></h2>
                        <?php if ($product->get_description() !== '') : ?>
                            <?php echo wp_kses_post(wpautop($product->get_description())); ?>
                        <?php else : ?>
                            <p><?php echo esc_html($label('Review the available catalogue configurations below.', 'راجع تكوينات الكتالوج المتاحة أدناه.')); ?></p>
                        <?php endif; ?>
                    </div>

                    <?php if ($variations !== []) : ?>
                        <div class="rosa-product-detail__configuration-list">
                            <?php foreach ($variations as $variation) :
                                $attributes = $variation->get_attributes();
                                $directionSlug = (string) ($attributes['pa_direction'] ?? '');
                                $sizeSlug = (string) ($attributes['pa_size'] ?? '');
                                $variantSlug = (string) ($attributes['pa_variant'] ?? '');

                                $directionTerm = $directionSlug !== '' ? get_term_by('slug', $directionSlug, 'pa_direction') : false;
                                $sizeTerm = $sizeSlug !== '' ? get_term_by('slug', $sizeSlug, 'pa_size') : false;
                                $variantTerm = $variantSlug !== '' ? get_term_by('slug', $variantSlug, 'pa_variant') : false;
                                $directionLabel = $directionTerm instanceof WP_Term ? $directionTerm->name : $directionSlug;
                                ?>
                                <article class="rosa-product-detail__configuration" data-variation-id="<?php echo esc_attr((string) $variation->get_id()); ?>">
                                    <div>
                                        <p class="rosa-product-detail__configuration-label"><?php echo esc_html($label('Configuration', 'التكوين')); ?></p>
                                        <h3><?php echo esc_html($directionLabel); ?></h3>
                                    </div>
                                    <dl>
                                        <div><dt><?php echo esc_html($label('SKU', 'SKU')); ?></dt><dd><?php echo esc_html($variation->get_sku()); ?></dd></div>
                                        <?php if ($sizeSlug !== '') : ?>
                                            <div><dt><?php echo esc_html($label('Size', 'المقاس')); ?></dt><dd><?php echo esc_html($sizeTerm instanceof WP_Term ? $sizeTerm->name : $sizeSlug); ?></dd></div>
                                        <?php endif; ?>
                                        <?php if ($variantSlug !== '') : ?>
                                            <div><dt><?php echo esc_html($label('Variant', 'النوع')); ?></dt><dd><?php echo esc_html($variantTerm instanceof WP_Term ? $variantTerm->name : $variantSlug); ?></dd></div>
                                        <?php endif; ?>
                                    </dl>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <section class="rosa-product-detail__related" data-preview-product-related>
            <div class="rosa-product-detail__related-heading">
                <p class="rosa-product-detail__eyebrow"><?php echo esc_html($label('Related instruments', 'أدوات ذات صلة')); ?></p>
                <h2><?php echo esc_html($label('Continue exploring the catalogue', 'واصل استكشاف الكتالوج')); ?></h2>
            </div>
            <div class="rosa-product-detail__related-grid">
                <?php foreach (array_slice($relatedProducts, 0, 4) as $relatedProduct) : ?>
                    <?php get_template_part('template-parts/client-preview/product-card', null, ['product' => $relatedProduct, 'locale' => $locale]); ?>
                <?php endforeach; ?>
                <?php
                $relatedCount = count($relatedProducts);
                foreach (array_slice($relatedFamilies, 0, max(0, 4 - $relatedCount)) as $relatedFamily) : ?>
                    <?php get_template_part('template-parts/client-preview/product-card', null, ['family' => $relatedFamily, 'locale' => $locale, 'placeholder' => true]); ?>
                <?php endforeach; ?>
            </div>
        </section>
    </article>
</div>
<?php
get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]);
get_footer();
