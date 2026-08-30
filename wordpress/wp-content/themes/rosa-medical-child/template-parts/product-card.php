<?php
/** @var array{product?:mixed} $args */

declare(strict_types=1);

use RosaMedical\Core\Catalogue\ProductPresentation;

$product = $args['product'] ?? null;
if (! $product instanceof WC_Product) {
    return;
}

$view = ProductPresentation::forProduct($product);
$reference = $view['reference'];
$referenceLabel = (string) ($reference['label'] ?? '');
if (($reference['type'] ?? '') === 'product-reference' && isset($reference['count'])) {
    $referenceLabel .= ' · ' . sprintf(_n('%d configuration', '%d configurations', (int) $reference['count'], 'rosa-medical'), (int) $reference['count']);
}
?>
<article class="rosa-product-card">
    <a class="rosa-product-card__media" href="<?php echo esc_url($view['permalink']); ?>" tabindex="-1" aria-hidden="true">
        <?php if (is_array($view['image'])) : ?>
            <img src="<?php echo esc_url($view['image']['url']); ?>" alt="<?php echo esc_attr($view['image']['alt'] !== '' ? $view['image']['alt'] : $view['name']); ?>" loading="lazy">
        <?php else : ?>
            <span class="rosa-product-card__placeholder" aria-hidden="true">ROSA</span>
        <?php endif; ?>
    </a>
    <div class="rosa-product-card__body">
        <?php if (is_array($view['family'])) : ?>
            <p class="rosa-product-card__family"><?php echo esc_html($view['family']['name']); ?></p>
        <?php endif; ?>
        <h3 class="rosa-product-card__title"><a href="<?php echo esc_url($view['permalink']); ?>"><?php echo esc_html($view['name']); ?></a></h3>
        <?php if ($referenceLabel !== '') : ?><p class="rosa-product-card__reference"><?php echo esc_html($referenceLabel); ?></p><?php endif; ?>
        <p class="rosa-product-card__price"><?php echo esc_html($view['price']['label']); ?></p>
        <a class="rosa-product-card__action" href="<?php echo esc_url($view['permalink']); ?>"><?php esc_html_e('View details', 'rosa-medical'); ?> <span aria-hidden="true">→</span></a>
    </div>
</article>
