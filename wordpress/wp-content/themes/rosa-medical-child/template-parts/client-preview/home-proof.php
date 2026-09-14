<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
get_template_part('template-parts/client-preview/latest-home-family-discovery', null, $sectionArgs);
