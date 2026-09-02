<?php
/** Template Name: Rosa Client Preview Home */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
get_header();
get_template_part('template-parts/client-preview/hero', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-who', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-featured', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-feature', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-latest', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-promos', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-why', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-proof', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/home-evidence', null, ['locale' => $locale]);
?>
<div data-preview-contact-cta><?php get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]); ?></div>
<?php get_footer();
