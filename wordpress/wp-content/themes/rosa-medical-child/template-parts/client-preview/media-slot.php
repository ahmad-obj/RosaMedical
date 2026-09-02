<?php
if (! defined('ABSPATH')) { exit; }
$slot = sanitize_html_class((string) ($args['slot'] ?? 'media-slot'));
$label = (string) ($args['label'] ?? 'ROSA');
$class = trim((string) ($args['class'] ?? ''));
$imageId = isset($args['image_id']) && is_scalar($args['image_id'])
    ? max(0, (int) $args['image_id'])
    : (function_exists('rosa_preview_media_id') ? rosa_preview_media_id($slot) : 0);
?>
<div class="rosa-preview-media-slot<?php echo $class !== '' ? ' ' . esc_attr($class) : ''; ?>" data-media-slot="<?php echo esc_attr($slot); ?>" role="img" aria-label="<?php echo esc_attr($label); ?>"><?php if ($imageId > 0) : ?><?php echo wp_get_attachment_image($imageId, 'full', false, ['class' => 'rosa-preview-media-slot__image', 'alt' => '']); ?><?php else : ?><span aria-hidden="true">ROSA</span><?php endif; ?></div>
