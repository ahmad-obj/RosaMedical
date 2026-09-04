<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$title = rosa_preview_section_value($sectionArgs, 'home', 'family_title', $locale, $locale === 'ar' ? 'مجموعة منتجاتنا' : 'Our range of products');
$upload = wp_upload_dir();
$coverBase = empty($upload['error'])
    ? trailingslashit((string)$upload['baseurl']) . 'rosa-reference/homepage-covers/'
    : '';
$families = [
    ['slug' => 'scissors', 'name' => $locale === 'ar' ? 'المقصات' : 'Scissors', 'cover' => 'scissors-family-cover-full.svg', 'pdf' => 'catalogue-pdf-scissors'],
    ['slug' => 'cutters', 'name' => $locale === 'ar' ? 'القواطع' : 'Cutters', 'cover' => 'cutters-family-cover-full.svg', 'pdf' => 'catalogue-pdf-cutters'],
    ['slug' => 'punches', 'name' => $locale === 'ar' ? 'المثاقب' : 'Punches', 'cover' => 'punches-family-cover.webp', 'pdf' => 'catalogue-pdf-punches'],
    ['slug' => 'chisels', 'name' => $locale === 'ar' ? 'الأزاميل' : 'Chisels', 'cover' => 'chisels-family-cover-full.svg', 'pdf' => 'catalogue-pdf-chisels'],
    ['slug' => 'knives', 'name' => $locale === 'ar' ? 'السكاكين' : 'Knives', 'cover' => 'knives-family-cover-full.svg', 'pdf' => 'catalogue-pdf-knives'],
];
?>
<section class="section home-product-range" data-section="family-discovery" aria-labelledby="family-discovery-title">
    <div class="container container--wide">
        <h2 id="family-discovery-title" class="home-compact-section-title home-compact-section-title--center"><?php echo esc_html($title); ?></h2>
        <div class="home-family-gallery-shell">
            <div class="home-family-gallery__mobile-controls" aria-label="<?php echo esc_attr($locale === 'ar' ? 'التنقل بين عائلات المنتجات' : 'Product family navigation'); ?>">
                <button type="button" class="home-family-gallery__arrow" data-family-gallery-prev aria-label="<?php echo esc_attr($locale === 'ar' ? 'العائلة السابقة' : 'Previous family'); ?>"><span aria-hidden="true">←</span></button>
                <button type="button" class="home-family-gallery__arrow" data-family-gallery-next aria-label="<?php echo esc_attr($locale === 'ar' ? 'العائلة التالية' : 'Next family'); ?>"><span aria-hidden="true">→</span></button>
            </div>
            <ul class="home-family-gallery" data-home-family-gallery aria-label="<?php echo esc_attr($locale === 'ar' ? 'منتجات روزا' : 'ROSA products'); ?>">
                <?php foreach ($families as $family) :
                    $pdfId = rosa_preview_media_id($family['pdf']);
                    $pdfUrl = $pdfId > 0 ? wp_get_attachment_url($pdfId) : '';
                    if (! is_string($pdfUrl) || $pdfUrl === '') {
                        $pdfUrl = home_url('/shop/');
                    }
                    $coverUrl = $coverBase !== '' ? $coverBase . $family['cover'] : '';
                ?>
                <li class="home-family-gallery__panel" data-family-panel data-family="<?php echo esc_attr($family['slug']); ?>">
                    <a class="home-family-gallery__link" href="<?php echo esc_url($pdfUrl); ?>" target="_blank" rel="noreferrer" aria-label="<?php echo esc_attr($locale === 'ar' ? 'فتح كتالوج ' . $family['name'] : 'Open ' . $family['name'] . ' catalogue'); ?>">
                        <div class="home-family-gallery__media home-family-gallery__media--catalogue-cover">
                            <?php if ($coverUrl !== '') : ?><img class="home-family-gallery__image" src="<?php echo esc_url($coverUrl); ?>" alt="<?php echo esc_attr($family['name']); ?>" width="560" height="793" loading="lazy" decoding="async"><?php endif; ?>
                        </div>
                    </a>
                </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>