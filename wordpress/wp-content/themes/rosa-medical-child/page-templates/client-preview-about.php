<?php
/** Template Name: Rosa Client Preview About */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
get_header();
get_template_part('template-parts/client-preview/page-hero', null, ['locale' => $locale, 'section' => 'about']);
get_template_part('template-parts/client-preview/about-who', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/about-stats', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/about-cards', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/about-feature', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/about-why', null, ['locale' => $locale]);
get_template_part('template-parts/client-preview/about-proof', null, ['locale' => $locale]);
?>
<div data-preview-contact-cta><?php get_template_part('template-parts/client-preview/cta-banner',null,['locale'=>$locale,'image_id'=>rosa_preview_media_id('about_international')]); ?></div>
<?php get_footer();
