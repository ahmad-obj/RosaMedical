<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string) ($sectionArgs['locale'] ?? rosa_preview_locale());
$title = rosa_preview_section_value($sectionArgs, 'home', 'latest_title', $locale, $locale === 'ar' ? 'أحدث المنتجات' : 'Latest Products');
?>
<section class="rosa-preview-latest" data-home-section="latest"><div class="rosa-preview-rail"><?php get_template_part('template-parts/client-preview/product-grid', null, ['title' => $title, 'limit' => 10, 'context' => 'latest', 'locale' => $locale]); ?></div></section>
