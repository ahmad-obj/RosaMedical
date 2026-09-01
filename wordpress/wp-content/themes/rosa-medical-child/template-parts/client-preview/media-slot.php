<?php
if (! defined('ABSPATH')) { exit; }
$slot = sanitize_html_class((string) ($args['slot'] ?? 'media-slot'));
$label = (string) ($args['label'] ?? 'ROSA');
$class = trim((string) ($args['class'] ?? ''));
?>
<div class="rosa-preview-media-slot<?php echo $class !== '' ? ' ' . esc_attr($class) : ''; ?>" data-media-slot="<?php echo esc_attr($slot); ?>" role="img" aria-label="<?php echo esc_attr($label); ?>"><span aria-hidden="true">ROSA</span></div>
