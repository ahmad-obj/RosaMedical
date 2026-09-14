<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];

/*
 * The client-approved catalogue rail replaces the former four-card promotion
 * mosaic in this exact homepage slot.
 */
get_template_part('template-parts/client-preview/latest-home-family-discovery', null, $sectionArgs);
