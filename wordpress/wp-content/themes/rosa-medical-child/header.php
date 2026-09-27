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
$isQuoteRequest = function_exists('rosa_is_quote_request_route') && rosa_is_quote_request_route();
$previewPostId = $isWooShop ? (int) get_option('woocommerce_shop_page_id', 0) : get_the_ID();
$rawPreviewLocale = (string) get_post_meta($previewPostId, ROSA_PREVIEW_LOCALE_META, true);
$isPreviewPage = in_array($rawPreviewLocale, ['en', 'ar'], true) || $isWooCatalogue || $isQuoteRequest;
$previewLocale = $isQuoteRequest && function_exists('rosa_quote_request_route_locale')
    ? (rosa_quote_request_route_locale() === 'ar' ? 'ar' : 'en')
    : (function_exists('rosa_preview_locale')
        ? rosa_preview_locale($previewPostId ?: null)
        : ($rawPreviewLocale === 'ar' ? 'ar' : 'en'));
$navItems = function_exists('rosa_preview_nav_items') ? rosa_preview_nav_items($previewLocale) : [];
$pairUrl = $isQuoteRequest
    ? home_url($previewLocale === 'ar' ? '/quote-request/' : '/ar/quote-request/')
    : (function_exists('rosa_preview_pair_url') ? rosa_preview_pair_url($previewPostId ?: null) : home_url('/'));
$email = rosa_theme_business_value('email');
$phone = rosa_theme_business_value('phone');
$logoId = function_exists('rosa_preview_media_id') ? rosa_preview_media_id('logo') : 0;
$announcement = rosa_preview_content(
    'site',
    'announcement_text',
    $previewLocale,
    $previewLocale === 'ar' ? 'دعم الكتالوج وطلبات عروض الأسعار' : 'Catalogue and quotation support'
);
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
        <span><?php echo esc_html($announcement); ?></span>
        <div class="rosa-preview-announcement__contacts">
            <?php if ($email !== '') : ?><a href="mailto:<?php echo esc_attr($email); ?>"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M3 6.5 12 13l9-6.5M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5Z"/></svg><bdi dir="ltr"><?php echo esc_html($email); ?></bdi></a><?php endif; ?>
            <?php if ($phone !== '') : ?><a href="tel:<?php echo esc_attr((string) preg_replace('/[^0-9+]/', '', $phone)); ?>"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M6.6 3.5 9.2 3a1.6 1.6 0 0 1 1.8 1.1l1.1 3.4a1.6 1.6 0 0 1-.6 1.8l-1.8 1.3a15 15 0 0 0 3.7 3.7l1.3-1.8a1.6 1.6 0 0 1 1.8-.6l3.4 1.1a1.6 1.6 0 0 1 1.1 1.8l-.5 2.6a2.1 2.1 0 0 1-2.1 1.7C10.1 19.1 4.9 13.9 4.9 5.6A2.1 2.1 0 0 1 6.6 3.5Z"/></svg><bdi dir="ltr"><?php echo esc_html($phone); ?></bdi></a><?php endif; ?>
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
            <?php else : ?>
                <span class="rosa-preview-brand__wordmark">ROSA</span>
            <?php endif; ?>
        </a>
        <nav class="rosa-preview-nav" aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'); ?>">
            <?php foreach ($navItems as $item) : ?>
                <a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['label']); ?></a>
            <?php endforeach; ?>
        </nav>
        <div class="rosa-preview-header__actions">
            <a class="rosa-preview-language rosa-preview-header-action" href="<?php echo esc_url($pairUrl); ?>" hreflang="<?php echo esc_attr($previewLocale === 'ar' ? 'en' : 'ar'); ?>" aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'English' : 'العربية'); ?>"><?php echo esc_html($previewLocale === 'ar' ? 'English' : 'العربية'); ?></a>
            <a class="rosa-preview-button rosa-preview-header-action rosa-preview-header-action--inquiry" href="<?php echo esc_url(home_url($previewLocale === 'ar' ? '/ar/quote-request/' : '/quote-request/')); ?>"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M6 3h9l3 3v15H6V3Zm3 5h6m-6 4h6m-6 4h4"/></svg><span><?php echo esc_html($previewLocale === 'ar' ? 'اطلب عرض سعر' : 'Request a quote'); ?></span></a>
        </div>
    </div>
    <div class="rosa-preview-menu-overlay" hidden data-rosa-preview-menu-overlay></div>
    <aside class="rosa-preview-menu" id="rosa-preview-menu" hidden data-rosa-preview-menu-drawer aria-label="<?php echo esc_attr($previewLocale === 'ar' ? 'قائمة الجوال' : 'Mobile menu'); ?>">
        <button type="button" class="rosa-preview-menu__close" data-rosa-preview-menu-close><span aria-hidden="true">×</span><span class="screen-reader-text"><?php echo esc_html($previewLocale === 'ar' ? 'إغلاق' : 'Close'); ?></span></button>
        <nav>
            <?php foreach ($navItems as $item) : ?><a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['label']); ?></a><?php endforeach; ?>
        </nav>
    </aside>
</header>
<main id="main" class="rosa-site-main">
