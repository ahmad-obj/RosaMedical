<?php
/** Template Name: Rosa Client Preview Contact */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
get_header();
get_template_part('template-parts/client-preview/page-hero', null, ['locale' => $locale, 'section' => 'contact']);
get_template_part('template-parts/client-preview/contact-layout', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/contact-map', null, ['locale' => $locale]);
get_footer();
