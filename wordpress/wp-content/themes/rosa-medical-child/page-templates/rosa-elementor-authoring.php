<?php
/** Template Name: Rosa Elementor Authoring */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
get_header();
while (have_posts()) {
    the_post();
    echo '<div class="rosa-elementor-authoring" data-rosa-elementor-authoring>';
    the_content();
    echo '</div>';
}

// Latest Home already ends with its source-matched quotation CTA. Retain the
// legacy shared CTA for About/Contact and pre-parity Home only.
if (! function_exists('rosa_is_latest_home_page') || ! rosa_is_latest_home_page((int) get_the_ID())) {
    echo '<div data-preview-contact-cta>';
    get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]);
    echo '</div>';
}
get_footer();