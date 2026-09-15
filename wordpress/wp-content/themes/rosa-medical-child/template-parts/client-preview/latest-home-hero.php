<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$m = static fn(string $key, string $slot): int => rosa_preview_section_media_id($sectionArgs, $key, $slot);

$slides = [
    [
        'id' => 'precision-instruments', 'copy_side' => 'left', 'desktop_focal' => '58% 50%', 'mobile_focal' => '50% 46%',
        'eyebrow' => $c('hero_1_eyebrow'), 'title' => $c('hero_1_title'), 'body' => $c('hero_1_body'),
        'desktop' => $m('desktop_1', 'home-hero-01-desktop'), 'mobile' => $m('mobile_1', 'home-hero-01-mobile'),
        'alt' => $locale === 'ar' ? 'يد مرتدية قفازًا تختار أداة جراحية من مجموعة مرتبة' : 'Gloved hand selecting a surgical instrument from an arranged set',
    ],
    [
        'id' => 'clinical-instrument-context', 'copy_side' => 'left', 'desktop_focal' => '63% 49%', 'mobile_focal' => '50% 48%',
        'eyebrow' => $c('hero_2_eyebrow'), 'title' => $c('hero_2_title'), 'body' => $c('hero_2_body'),
        'desktop' => $m('desktop_2', 'home-hero-02-desktop'), 'mobile' => $m('mobile_2', 'home-hero-02-mobile'),
        'alt' => $locale === 'ar' ? 'يد مرتدية قفازًا تمسك ملقطًا جراحيًا بحلقات بجوار أدوات أخرى' : 'Gloved hand holding ring-handled surgical forceps beside other instruments',
    ],
    [
        'id' => 'surgical-instrument-selection', 'copy_side' => 'left', 'desktop_focal' => '62% 50%', 'mobile_focal' => '54% 48%',
        'eyebrow' => $c('hero_3_eyebrow'), 'title' => $c('hero_3_title'), 'body' => $c('hero_3_body'),
        'desktop' => $m('desktop_3', 'home-hero-03-desktop'), 'mobile' => $m('mobile_3', 'home-hero-03-mobile'),
        'alt' => $locale === 'ar' ? 'يدان مرتديتان قفازات تفحصان مقصًا جراحيًا' : 'Gloved hands examining a surgical scissors instrument',
    ],
    [
        'id' => 'catalogue-to-quotation', 'copy_side' => 'right', 'desktop_focal' => '46% 50%', 'mobile_focal' => '50% 48%',
        'eyebrow' => $c('hero_4_eyebrow'), 'title' => $c('hero_4_title'), 'body' => $c('hero_4_body'),
        'desktop' => $m('desktop_4', 'home-hero-04-desktop'), 'mobile' => $m('mobile_4', 'home-hero-04-mobile'),
        'alt' => $locale === 'ar' ? 'أدوات جراحية داكنة مرتبة على سطح طبي منسوج' : 'Dark surgical instruments arranged on a textured sterile surface',
    ],
];
?>
<section class="public-hero public-hero-carousel" data-section="home-hero" data-public-hero-page="home" data-active-slide="precision-instruments" data-latest-rosa-home-hero aria-roledescription="carousel" aria-labelledby="home-title">
    <?php foreach ($slides as $index => $slide) :
        $desktopImage = rosa_preview_attachment_image_data((int) $slide['desktop'], 'full');
        $mobileImage = rosa_preview_attachment_image_data((int) $slide['mobile'], 'full');
        $desktopOverride = $desktopImage['url'] !== '';
        $mobileOverride = $mobileImage['url'] !== '';

        $desktopUrl = $desktopOverride
            ? $desktopImage['url']
            : rosa_preview_reference_hero_url($index + 1, 'desktop', 'webp');
        $desktopAvifUrl = $desktopOverride
            ? ''
            : rosa_preview_reference_hero_url($index + 1, 'desktop', 'avif');
        $mobileUrl = $mobileOverride
            ? $mobileImage['url']
            : rosa_preview_reference_hero_url($index + 1, 'mobile', 'webp');
        $mobileSrcset = $mobileOverride && $mobileImage['srcset'] !== ''
            ? $mobileImage['srcset']
            : $mobileUrl;
        $active = $index === 0;
    ?>
    <div class="public-hero-carousel__slide<?php echo $active ? ' is-active' : ''; ?>" data-rosa-hero-slide data-slide-index="<?php echo esc_attr((string)$index); ?>" data-slide-id="<?php echo esc_attr($slide['id']); ?>" data-copy-side="<?php echo esc_attr($slide['copy_side']); ?>" data-tone="dark" aria-roledescription="slide" aria-label="<?php echo esc_attr(($index + 1) . ' of 4'); ?>" aria-hidden="<?php echo $active ? 'false' : 'true'; ?>" style="--hero-desktop-focal:<?php echo esc_attr($slide['desktop_focal']); ?>;--hero-mobile-focal:<?php echo esc_attr($slide['mobile_focal']); ?>;">
        <div class="public-hero-carousel__media" data-media-slot="public-hero-active" data-entry-motion="slide-settle">
            <picture class="public-hero-carousel__picture">
                <?php if ($mobileUrl !== '') : ?>
                    <source media="(max-width: 40rem)" srcset="<?php echo $mobileOverride ? esc_attr($mobileSrcset) : esc_url($mobileUrl); ?>"<?php echo $mobileOverride ? ' sizes="100vw"' : ' type="image/webp"'; ?>>
                <?php endif; ?>
                <?php if ($desktopAvifUrl !== '') : ?><source srcset="<?php echo esc_url($desktopAvifUrl); ?>" type="image/avif"><?php endif; ?>
                <?php if ($desktopUrl !== '') : ?>
                    <img
                        src="<?php echo esc_url($desktopUrl); ?>"
                        <?php if ($desktopOverride && $desktopImage['srcset'] !== '') : ?>srcset="<?php echo esc_attr($desktopImage['srcset']); ?>" sizes="100vw"<?php endif; ?>
                        <?php echo $desktopOverride && $desktopImage['width'] > 0 ? 'width="' . esc_attr((string) $desktopImage['width']) . '"' : ''; ?>
                        <?php echo $desktopOverride && $desktopImage['height'] > 0 ? 'height="' . esc_attr((string) $desktopImage['height']) . '"' : ''; ?>
                        alt="<?php echo esc_attr($slide['alt']); ?>"
                        decoding="async"
                        <?php echo $active ? 'fetchpriority="high"' : 'loading="lazy"'; ?>
                    >
                <?php endif; ?>
            </picture>
        </div>
        <span class="public-hero-carousel__overlay" aria-hidden="true"></span>
        <div class="public-hero-carousel__content">
            <div class="public-hero-carousel__copy" data-entry-motion="rise">
                <p class="public-eyebrow"><?php echo esc_html($slide['eyebrow']); ?></p>
                <<?php echo $index === 0 ? 'h1 id="home-title"' : 'h2'; ?> class="public-hero-carousel__title"><?php echo esc_html($slide['title']); ?></<?php echo $index === 0 ? 'h1' : 'h2'; ?>>
                <p class="public-hero-carousel__copy-text"><?php echo esc_html($slide['body']); ?></p>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
    <div class="public-hero-carousel__dots" role="group" aria-label="<?php echo esc_attr($locale === 'ar' ? 'شرائح الصفحة' : 'Page hero slides'); ?>">
        <?php foreach ($slides as $index => $slide) : ?>
            <button type="button" class="public-hero-carousel__dot" data-rosa-hero-dot data-slide-index="<?php echo esc_attr((string)$index); ?>" aria-label="<?php echo esc_attr($locale === 'ar' ? 'الشريحة ' . ($index + 1) : 'Go to slide ' . ($index + 1)); ?>" <?php echo $index === 0 ? 'aria-current="true" tabindex="0"' : 'tabindex="-1"'; ?>><span class="screen-reader-text"><?php echo esc_html($slide['title']); ?></span></button>
        <?php endforeach; ?>
    </div>
</section>
