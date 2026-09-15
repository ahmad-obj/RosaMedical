<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$section = (string) ($sectionArgs['section'] ?? 'about');
$isContact = $section === 'contact';
$eyebrowFallback = 'ROSA';
$titleFallback = $isContact ? ($locale === 'ar' ? 'اتصل بنا' : 'Contact us') : ($locale === 'ar' ? 'من نحن' : 'About us');
$bodyFallback = $isContact
    ? ($locale === 'ar' ? 'تواصل معنا وأخبرنا كيف يمكننا مساعدتك.' : 'Get in touch and let us know how we can help.')
    : ($locale === 'ar' ? 'تعرف على نهج روزا في دعم اكتشاف الأدوات الطبية والتوريد.' : 'Learn about Rosa’s approach to medical-instrument discovery and procurement support.');
$classes = 'rosa-preview-page-hero' . ($isContact ? ' rosa-preview-page-hero--contact' : '');
$heroSlide = $isContact ? 4 : 2;
$desktopUrl = rosa_preview_reference_hero_url($heroSlide, 'desktop', 'webp');
$desktopAvifUrl = rosa_preview_reference_hero_url($heroSlide, 'desktop', 'avif');
$mobileUrl = rosa_preview_reference_hero_url($heroSlide, 'mobile', 'webp');
$desktopFocal = $isContact ? '46% 50%' : '63% 49%';
$mobileFocal = $isContact ? '50% 48%' : '50% 48%';
?>
<section class="<?php echo esc_attr($classes); ?>" data-preview-page-hero style="--page-hero-desktop-focal:<?php echo esc_attr($desktopFocal); ?>;--page-hero-mobile-focal:<?php echo esc_attr($mobileFocal); ?>;">
    <picture class="rosa-preview-page-hero__media" aria-hidden="true">
        <source media="(max-width: 40rem)" srcset="<?php echo esc_url($mobileUrl); ?>" type="image/webp">
        <source srcset="<?php echo esc_url($desktopAvifUrl); ?>" type="image/avif">
        <img src="<?php echo esc_url($desktopUrl); ?>" alt="" decoding="async" fetchpriority="high">
    </picture>
    <div class="rosa-preview-rail">
        <p class="rosa-preview-eyebrow"><?php echo esc_html(rosa_preview_section_value($sectionArgs, $section, 'page_eyebrow', $locale, $eyebrowFallback)); ?></p>
        <h1><?php echo esc_html(rosa_preview_section_value($sectionArgs, $section, 'page_title', $locale, $titleFallback)); ?></h1>
        <p><?php echo esc_html(rosa_preview_section_value($sectionArgs, $section, 'page_body', $locale, $bodyFallback)); ?></p>
    </div>
</section>
