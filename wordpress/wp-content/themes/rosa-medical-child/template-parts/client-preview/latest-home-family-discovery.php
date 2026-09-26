<?php
if (! defined('ABSPATH')) { exit; }

$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$title = rosa_preview_section_value($sectionArgs, 'home', 'family_title', $locale, $locale === 'ar' ? 'مجموعة منتجاتنا' : 'Our range of products');
$coverBase = function_exists('get_stylesheet_directory_uri')
    ? trailingslashit(get_stylesheet_directory_uri()) . 'assets/media/homepage-covers/'
    : '';

$familyService = class_exists(\RosaMedical\Core\Catalogue\FamilyService::class)
    ? new \RosaMedical\Core\Catalogue\FamilyService()
    : null;

$families = $familyService ? $familyService->getFamilies(false, $locale) : [];

if (empty($families) && taxonomy_exists('product_cat')) {
    $terms = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => false,
        'exclude' => [get_option('default_product_cat', 0)],
    ]);
    if (! is_wp_error($terms) && is_array($terms)) {
        foreach ($terms as $term) {
            $families[] = (object) [
                'id' => (int) $term->term_id,
                'name' => (string) $term->name,
                'slug' => (string) $term->slug,
                'coverUrl' => '',
                'pdfUrl' => '',
            ];
        }
    }
}
?>
<section class="section home-product-range" data-section="family-discovery" aria-labelledby="family-discovery-title">
    <div class="rosa-preview-rail home-product-range__rail">
        <h2 id="family-discovery-title" class="home-compact-section-title home-compact-section-title--center"><?php echo esc_html($title); ?></h2>
        <div class="home-family-gallery-shell">
            <div class="home-family-gallery__mobile-controls" aria-label="<?php echo esc_attr($locale === 'ar' ? 'التنقل بين عائلات المنتجات' : 'Product family navigation'); ?>">
                <button type="button" class="home-family-gallery__arrow" data-family-gallery-prev aria-label="<?php echo esc_attr($locale === 'ar' ? 'العائلة السابقة' : 'Previous family'); ?>"><span aria-hidden="true">←</span></button>
                <button type="button" class="home-family-gallery__arrow" data-family-gallery-next aria-label="<?php echo esc_attr($locale === 'ar' ? 'العائلة التالية' : 'Next family'); ?>"><span aria-hidden="true">→</span></button>
            </div>
            <ul class="home-family-gallery" data-home-family-gallery aria-label="<?php echo esc_attr($locale === 'ar' ? 'منتجات روزا' : 'ROSA products'); ?>">
                <?php foreach ($families as $family) :
                    $slug = (string) $family->slug;
                    $name = $family instanceof \RosaMedical\Core\Catalogue\FamilyModel ? $family->getDisplayName($locale) : (string) $family->name;

                    $pdfUrl = ! empty($family->pdfUrl) ? $family->pdfUrl : '';
                    if ($pdfUrl === '' && function_exists('rosa_preview_media_id')) {
                        $pdfId = rosa_preview_media_id('catalogue-pdf-' . $slug);
                        if ($pdfId > 0) {
                            $pdfUrl = wp_get_attachment_url($pdfId) ?: '';
                        }
                    }
                    if (! is_string($pdfUrl) || $pdfUrl === '') {
                        $pdfUrl = home_url('/shop/#family-' . $slug);
                    }

                    $coverUrl = ! empty($family->coverUrl) ? $family->coverUrl : '';
                    if ($coverUrl === '' && $coverBase !== '') {
                        $coverFilename = $slug === 'punches' ? 'punches-family-cover.webp' : "{$slug}-family-cover-full.svg";
                        $coverUrl = $coverBase . $coverFilename;
                    }
                ?>
                <li class="home-family-gallery__panel" data-family-panel data-family="<?php echo esc_attr($slug); ?>">
                    <a class="home-family-gallery__link" href="<?php echo esc_url($pdfUrl); ?>" target="_blank" rel="noreferrer" aria-label="<?php echo esc_attr($locale === 'ar' ? 'فتح كتالوج ' . $name : 'Open ' . $name . ' catalogue'); ?>">
                        <div class="home-family-gallery__media home-family-gallery__media--catalogue-cover">
                            <?php if ($coverUrl !== '') : ?><img class="home-family-gallery__image" src="<?php echo esc_url($coverUrl); ?>" alt="<?php echo esc_attr($name); ?>" width="560" height="786" loading="lazy" decoding="async"><?php endif; ?>
                        </div>
                    </a>
                </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>