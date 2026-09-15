<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$title = isset($sectionArgs['title']) && is_scalar($sectionArgs['title'])
    ? (string) $sectionArgs['title']
    : rosa_preview_section_value($sectionArgs, 'home', 'hero_title', $locale, $locale === 'ar' ? 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.' : 'Surgical instruments for professional procurement.');
$body = isset($sectionArgs['body']) && is_scalar($sectionArgs['body'])
    ? (string) $sectionArgs['body']
    : rosa_preview_section_value($sectionArgs, 'home', 'hero_body', $locale, $locale === 'ar' ? 'استكشف فئات أدوات روزا وتواصل مع فريقنا للحصول على الكتالوج ودعم عروض الأسعار.' : 'Explore Rosa instrument families and contact our team for catalogue and quotation support.');
$eyebrow = rosa_preview_section_value($sectionArgs, 'home', 'hero_eyebrow', $locale, $locale === 'ar' ? 'روزا ميديكال' : 'Rosa Medical');
$button = rosa_preview_section_value($sectionArgs, 'home', 'hero_button', $locale, $locale === 'ar' ? 'تصفح المنتجات' : 'Browse products');
$imageId = rosa_preview_section_media_id($sectionArgs, 'image', 'home-hero-01');
$overrideUrl = $imageId > 0 ? wp_get_attachment_image_url($imageId, 'full') : '';

$slides = [
    ['left', '58% 50%', '50% 46%', $locale === 'ar' ? 'يد مرتدية قفازًا تختار أداة جراحية من مجموعة مرتبة' : 'Gloved hand selecting a surgical instrument from an arranged set'],
    ['left', '63% 49%', '50% 48%', $locale === 'ar' ? 'يد مرتدية قفازًا تمسك ملقطًا جراحيًا بحلقات بجوار أدوات أخرى' : 'Gloved hand holding ring-handled surgical forceps beside other instruments'],
    ['left', '62% 50%', '54% 48%', $locale === 'ar' ? 'يدان مرتديتان قفازات تفحصان مقصًا جراحيًا' : 'Gloved hands examining a surgical scissors instrument'],
    ['right', '46% 50%', '50% 48%', $locale === 'ar' ? 'أدوات جراحية داكنة مرتبة على سطح طبي منسوج' : 'Dark surgical instruments arranged on a textured sterile surface'],
];
?>
<section class="rosa-preview-hero public-hero-carousel" data-home-section="hero" data-restored-home-hero aria-roledescription="carousel" aria-label="<?php echo esc_attr($locale === 'ar' ? 'لافتات الصفحة الرئيسية' : 'Homepage banners'); ?>">
    <?php foreach ($slides as $index => [$copySide, $desktopFocal, $mobileFocal, $alt]) :
        $hasOverride = $index === 0 && is_string($overrideUrl) && $overrideUrl !== '';
        $desktopUrl = $hasOverride ? $overrideUrl : rosa_preview_reference_hero_url($index + 1, 'desktop', 'webp');
        $desktopAvifUrl = $hasOverride ? '' : rosa_preview_reference_hero_url($index + 1, 'desktop', 'avif');
        $mobileUrl = $hasOverride ? $overrideUrl : rosa_preview_reference_hero_url($index + 1, 'mobile', 'webp');
        $active = $index === 0;
    ?>
    <div class="public-hero-carousel__slide<?php echo $active ? ' is-active' : ''; ?>" data-rosa-hero-slide data-slide-index="<?php echo esc_attr((string)$index); ?>" data-copy-side="<?php echo esc_attr($copySide); ?>" aria-roledescription="slide" aria-label="<?php echo esc_attr(($index + 1) . ' of 4'); ?>" aria-hidden="<?php echo $active ? 'false' : 'true'; ?>" style="--hero-desktop-focal:<?php echo esc_attr($desktopFocal); ?>;--hero-mobile-focal:<?php echo esc_attr($mobileFocal); ?>;">
        <div class="rosa-restored-hero__media">
            <picture>
                <source media="(max-width: 40rem)" srcset="<?php echo esc_url($mobileUrl); ?>" type="image/webp">
                <?php if ($desktopAvifUrl !== '') : ?><source srcset="<?php echo esc_url($desktopAvifUrl); ?>" type="image/avif"><?php endif; ?>
                <img src="<?php echo esc_url($desktopUrl); ?>" alt="<?php echo esc_attr($alt); ?>" decoding="async" <?php echo $active ? 'fetchpriority="high"' : 'loading="lazy"'; ?>>
            </picture>
        </div>
    </div>
    <?php endforeach; ?>
    <span class="rosa-restored-hero__overlay" aria-hidden="true"></span>
    <div class="rosa-preview-rail rosa-preview-hero__inner">
        <div class="rosa-preview-hero__copy">
            <p class="rosa-preview-eyebrow rosa-preview-eyebrow--light"><?php echo esc_html($eyebrow); ?></p>
            <h1><?php echo esc_html($title); ?></h1>
            <p><?php echo esc_html($body); ?></p>
            <a class="rosa-preview-button rosa-preview-button--light" href="<?php echo esc_url(home_url($locale === 'ar' ? '/ar/shop/' : '/shop/')); ?>"><?php echo esc_html($button); ?></a>
        </div>
    </div>
    <div class="rosa-restored-hero__dots" role="group" aria-label="<?php echo esc_attr($locale === 'ar' ? 'شرائح الصفحة الرئيسية' : 'Homepage banner slides'); ?>">
        <?php for ($index = 0; $index < 4; $index++) : ?>
            <button type="button" class="rosa-restored-hero__dot" data-rosa-hero-dot data-slide-index="<?php echo esc_attr((string)$index); ?>" aria-label="<?php echo esc_attr($locale === 'ar' ? 'الشريحة ' . ($index + 1) : 'Go to slide ' . ($index + 1)); ?>" <?php echo $index === 0 ? 'aria-current="true" tabindex="0"' : 'tabindex="-1"'; ?>><span class="screen-reader-text"><?php echo esc_html($locale === 'ar' ? 'الشريحة ' . ($index + 1) : 'Slide ' . ($index + 1)); ?></span></button>
        <?php endfor; ?>
    </div>
</section>
