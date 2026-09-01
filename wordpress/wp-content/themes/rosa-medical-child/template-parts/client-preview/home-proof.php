<?php
if (! defined('ABSPATH')) { exit; }
$locale = (string) ($args['locale'] ?? rosa_preview_locale());
?>
<section class="rosa-preview-proof" data-home-section="proof" aria-label="<?php echo esc_attr($locale === 'ar' ? 'فئات كتالوج روزا' : 'Rosa catalogue families'); ?>"><div class="rosa-preview-rail rosa-preview-proof__track"><?php foreach (['Knives', 'Scissors', 'Punches', 'Chisels', 'Cutters', 'Catalogues'] as $family) : ?><span><?php echo esc_html($family === 'Catalogues' ? ($locale === 'ar' ? 'الكتالوجات' : 'Catalogues') : rosa_preview_family_label($family, $locale)); ?></span><?php endforeach; ?></div></section>
