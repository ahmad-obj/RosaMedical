<?php
/**
 * Site header.
 */

if (! defined('ABSPATH')) {
    exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="rosa-site-header">
    <div class="rosa-shell rosa-site-header__inner">
        <a class="rosa-site-brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php echo esc_html(get_bloginfo('name')); ?>
        </a>
        <nav class="rosa-site-nav" aria-label="<?php echo esc_attr__('Primary navigation', 'rosa-medical'); ?>">
            <?php
            wp_nav_menu([
                'theme_location' => 'primary',
                'container'      => false,
                'fallback_cb'    => false,
            ]);
            ?>
        </nav>
        <?php $phone = rosa_theme_business_value('phone'); ?>
        <?php if ($phone !== '') : ?>
            <a class="rosa-site-contact" href="<?php echo esc_url('tel:' . preg_replace('/[^0-9+]/', '', $phone)); ?>">
                <?php echo esc_html($phone); ?>
            </a>
        <?php endif; ?>
    </div>
</header>
<main id="main" class="rosa-site-main">
