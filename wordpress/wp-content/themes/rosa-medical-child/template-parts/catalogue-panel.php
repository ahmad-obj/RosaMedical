<?php
/** @var array{catalogue?:mixed} $args */

declare(strict_types=1);

$catalogue = $args['catalogue'] ?? null;
if (! is_array($catalogue) || empty($catalogue['url'])) {
    return;
}

$familyName = (string) ($catalogue['family_name'] ?? __('Product family', 'rosa-medical'));
$title = (string) ($catalogue['title'] ?? __('Reference catalogue', 'rosa-medical'));
?>
<aside class="rosa-catalogue-panel" aria-label="<?php echo esc_attr(sprintf(__('%s catalogue', 'rosa-medical'), $familyName)); ?>">
    <div>
        <p class="rosa-eyebrow"><?php esc_html_e('Catalogue PDF', 'rosa-medical'); ?></p>
        <h3><?php echo esc_html($familyName); ?></h3>
        <p><?php echo esc_html($title); ?></p>
    </div>
    <a class="rosa-button" href="<?php echo esc_url((string) $catalogue['url']); ?>" target="_blank" rel="noopener noreferrer">
        <?php esc_html_e('Open catalogue', 'rosa-medical'); ?><span class="screen-reader-text"> <?php esc_html_e('(opens in a new tab)', 'rosa-medical'); ?></span>
    </a>
</aside>
