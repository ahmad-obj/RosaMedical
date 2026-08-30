<?php
/**
 * Production Rosa public header.
 */

if (! defined('ABSPATH')) {
    exit;
}

$navigation = rosa_theme_primary_navigation();
$quoteLabel = rosa_theme_business_value('primary_cta_label', __('Request a quote', 'rosa-medical'));
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="rosa-skip-link" href="#main"><?php esc_html_e('Skip to content', 'rosa-medical'); ?></a>
<header class="rosa-site-header" data-rosa-site-header>
    <div class="rosa-rail rosa-rail--wide rosa-site-header__inner">
        <a class="rosa-site-brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr__('ROSA home', 'rosa-medical'); ?>">
            <?php if (function_exists('has_custom_logo') && has_custom_logo()) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <span class="rosa-site-brand__wordmark">ROSA</span>
            <?php endif; ?>
        </a>

        <nav class="rosa-site-nav" aria-label="<?php echo esc_attr__('Primary navigation', 'rosa-medical'); ?>">
            <ul class="rosa-site-nav__list">
                <?php foreach ($navigation as $item) : ?>
                    <?php $active = rosa_theme_nav_is_active($item['key']); ?>
                    <li>
                        <a class="rosa-site-nav__link<?php echo $active ? ' is-active' : ''; ?>" href="<?php echo esc_url($item['url']); ?>"<?php echo $active ? ' aria-current="page"' : ''; ?>>
                            <?php echo esc_html($item['label']); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>

        <div class="rosa-site-header__actions">
            <?php if (has_action('rosa_medical_language_switcher')) : ?>
                <div class="rosa-language-slot"><?php do_action('rosa_medical_language_switcher'); ?></div>
            <?php endif; ?>
            <a class="rosa-button rosa-button--primary rosa-site-header__quote" href="<?php echo esc_url(home_url('/inquiry/')); ?>">
                <?php echo esc_html($quoteLabel); ?>
            </a>
            <button class="rosa-menu-trigger" type="button" aria-expanded="false" aria-controls="rosa-mobile-menu" data-rosa-menu-trigger>
                <span class="rosa-menu-trigger__label"><?php esc_html_e('Menu', 'rosa-medical'); ?></span>
            </button>
        </div>
    </div>

    <div class="rosa-menu-overlay" data-rosa-menu-overlay hidden></div>
    <aside id="rosa-mobile-menu" class="rosa-menu-drawer" role="dialog" aria-modal="true" aria-labelledby="rosa-mobile-menu-title" data-rosa-menu-drawer hidden>
        <div class="rosa-menu-drawer__header">
            <strong id="rosa-mobile-menu-title">ROSA</strong>
            <button class="rosa-menu-drawer__close" type="button" data-rosa-menu-close><?php esc_html_e('Close', 'rosa-medical'); ?></button>
        </div>
        <nav aria-label="<?php echo esc_attr__('Mobile navigation', 'rosa-medical'); ?>">
            <ul class="rosa-menu-drawer__nav">
                <?php foreach ($navigation as $item) : ?>
                    <?php $active = rosa_theme_nav_is_active($item['key']); ?>
                    <li><a href="<?php echo esc_url($item['url']); ?>"<?php echo $active ? ' aria-current="page"' : ''; ?>><?php echo esc_html($item['label']); ?></a></li>
                <?php endforeach; ?>
            </ul>
        </nav>
        <?php if (has_action('rosa_medical_language_switcher')) : ?>
            <div class="rosa-menu-drawer__language"><?php do_action('rosa_medical_language_switcher'); ?></div>
        <?php endif; ?>
        <a class="rosa-button rosa-button--primary rosa-menu-drawer__quote" href="<?php echo esc_url(home_url('/inquiry/')); ?>"><?php echo esc_html($quoteLabel); ?></a>
    </aside>
</header>
<main id="main" class="rosa-site-main">
