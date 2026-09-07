<?php
/** Template Name: Rosa Elementor Authoring */
if (! defined('ABSPATH')) { exit; }
get_header();
while (have_posts()) {
    the_post();
    echo '<div class="rosa-elementor-authoring" data-rosa-elementor-authoring>';
    the_content();
    echo '</div>';
}
get_footer();
