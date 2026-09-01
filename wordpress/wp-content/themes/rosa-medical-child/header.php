<?php
/** Client-preview public header. */
if (! defined('ABSPATH')) { exit; }
$isWooShop = function_exists('is_shop') && is_shop();
$isWooCatalogue = function_exists('is_shop') && (
    is_shop()
    || is_product_category()
    || is_product_tag()
    || (function_exists('is_product') && is_product())
);
$previewPostId = $isWooShop ? (int) get_option('woocommerce_shop_page_id', 0) : get_the_ID();
$rawPreviewLocale = (string) get_post_meta($previewPostId, ROSA_PREVIEW_LOCALE_META, true);
$isPreviewPage = in_array($rawPreviewLocale, ['en', 'ar'], true) || $isWooCatalogue;
$previewLocale = $rawPreviewLocale === 'ar' ? 'ar' : 'en';
$navItems = function_exists('rosa_preview_nav_items') ? rosa_preview_nav_items($previewLocale) : [];
$pairUrl = function_exists('rosa_preview_pair_url') ? rosa_preview_pair_url($previewPostId ?: null) : home_url('/');
$email = rosa_theme_business_value('email');
$phone = rosa_theme_business_value('phone');
$logoId = function_exists('rosa_preview_media_id') ? rosa_preview_media_id('logo') : 0;
?><!doctype html>
<?php if ($isPreviewPage && $previewLocale === 'ar') : ?>
<html lang="ar" dir="rtl">
<?php elseif ($isPreviewPage) : ?>
<html lang="en-US" dir="ltr">
<?php else : ?>
<html <?php language_attributes(); ?>>
<?php endif; ?>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-rosa-preview-shell>
<?php wp_body_open(); ?>
<div class="rosa-preview-announcement">
    <div class="rosa-preview-rail rosa-preview-announcement__inner">
        <span><?php echo esc_html($previewLocale === 'ar' ? 'دعم الكتالوج وطلبات عروض الأسعار' : 'Catalogue and quotation support'); ?></span>
        <div class="rosa-preview-announcement__contacts">
            <?php if ($email !== '') : ?><a href="mailto:<?php echo esc_attr($email); ?>"><bdi dir="ltr"><?php echo esc_html($email); ?></bdi></a><?php endif; ?>
            <?php if ($phone !== '') : ?><a href="tel:<?php echo esc_attr((string) preg_replace('/[^0-9+]/', '', $phone)); ?>"><bdi dir="ltr"><?php echo esc_html($phone); ?></bdi></a><?php endif; ?>
        </div>
    </div>
</div>
<header class="rosa-preview-header">
    <div class="rosa-preview-rail rosa-preview-header__inner">
        <button class="rosa-preview-menu-trigger" type="button" aria-expanded="false" aria-controls="rosa-preview-menu" data-rosa-preview-menu-trigger>
            <span class="rosa-preview-menu-trigger__icon" aria-hidden="true"></span>
            <span class="screen-reader-text"><?php echo esc_html($previewLocale === 'ar' ? 'القائمة' : 'Menu'); ?></span>
        </button>
        <a class="rosa-preview-brand" href="<?php echo esc_url(home_url($previewLocale === 'ar' ? '/ar/' : '/')); ?>" aria-label="ROSA">
            <?php if ($logoId > 0) : ?>
                <?php echo wp_get_attachment_image($logoId, 'full', false, ['class' => 'rosa-preview-brand__image', 'alt' => 'ROSA']); ?>
            <?php else : ?><span class="rosa-preview-brand__fallback">ROSA</span><?php endif; ?>
        </a>
        <nav class="rosa-preview-nav" aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'); ?>">
            <?php foreach ($navItems as $item) : ?>
                <a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['label']); ?></a>
            <?php endforeach; ?>
        </nav>
        <div class="rosa-preview-header__actions">
            <a class="rosa-preview-language rosa-preview-header-action" href="<?php echo esc_url($pairUrl); ?>" hreflang="<?php echo esc_attr($previewLocale === 'ar' ? 'en' : 'ar'); ?>" aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'English' : 'العربية'); ?>"><?php echo esc_html($previewLocale === 'ar' ? 'EN' : 'AR'); ?></a>
            <a class="rosa-preview-button rosa-preview-header-action rosa-preview-header-action--inquiry" href="<?php echo esc_url(home_url($previewLocale === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>" aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'الاستفسار' : 'Inquiry'); ?>">?</a>
        </div>
    </div>
    <div class="rosa-preview-menu-overlay" hidden data-rosa-preview-menu-overlay></div>
    <aside class="rosa-preview-menu" id="rosa-preview-menu" hidden data-rosa-preview-menu-drawer aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'قائمة الجوال' : 'Mobile menu'); ?>">
        <button type="button" class="rosa-preview-menu__close" data-rosa-preview-menu-close><span aria-hidden="true">×</span><span class="screen-reader-text"><?php echo esc_html($previewLocale === 'ar' ? 'إغلاق' : 'Close'); ?></span></button>
        <nav>
            <?php foreach ($navItems as $item) : ?><a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['label']); ?></a><?php endforeach; ?>
        </nav>
        <div class="rosa-preview-menu__actions"><a class="rosa-preview-language" href="<?php echo esc_url($pairUrl); ?>"><?php echo esc_html($previewLocale === 'ar' ? 'EN' : 'العربية'); ?></a><a class="rosa-preview-button rosa-preview-button--accent" href="<?php echo esc_url(home_url($previewLocale === 'ar' ? '/ar/contact/#inquiry' : '/contact/#inquiry')); ?>"><?php echo esc_html($previewLocale === 'ar' ? 'الاستفسار' : 'Inquiry'); ?></a></div>
    </aside>
</header>
<main id="main" class="rosa-site-main">
