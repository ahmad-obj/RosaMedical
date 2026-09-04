<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$cards = [
    ['id' => 'customization', 'title' => $c('assurance_1_title'), 'body' => $c('assurance_1_body')],
    ['id' => 'compliance', 'title' => $c('assurance_2_title'), 'body' => $c('assurance_2_body')],
    ['id' => 'quality', 'title' => $c('assurance_3_title'), 'body' => $c('assurance_3_body')],
    ['id' => 'supply-chain', 'title' => $c('assurance_4_title'), 'body' => $c('assurance_4_body')],
];
$icon = static function(string $id): string {
    $common = 'width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    if ($id === 'customization') return '<svg '.$common.'><path d="M10.5 7.5h13v5.2h-13z"/><path d="M8 18.5h18M11.5 15v7M22.5 15v7"/><path d="M12 25.5h10"/><circle cx="17" cy="18.5" r="2.6"/></svg>';
    if ($id === 'compliance') return '<svg '.$common.'><path d="M17 5.5 25 8.7v6.8c0 5.2-3.1 9.3-8 12.7-4.9-3.4-8-7.5-8-12.7V8.7z"/><path d="m12.8 16.9 2.8 2.8 5.8-6.2"/></svg>';
    if ($id === 'quality') return '<svg '.$common.'><circle cx="17" cy="14" r="6.2"/><path d="m13.8 19.3-1 8.1 4.2-2.4 4.2 2.4-1-8.1"/><path d="m14.6 14.1 1.5 1.5 3.3-3.5"/></svg>';
    return '<svg '.$common.'><path d="M6.5 11.5h12v10h-12zM18.5 14.5h4.7l4.3 4v3h-9z"/><circle cx="11" cy="24.5" r="2.3"/><circle cx="24" cy="24.5" r="2.3"/><path d="M10 8h8M24 10.2v4.3"/></svg>';
};
?>
<section class="section home-assurance" data-section="client-success-assurance" aria-labelledby="home-assurance-title">
    <div class="container container--wide">
        <h2 id="home-assurance-title" class="home-assurance__heading"><?php echo esc_html($c('assurance_title')); ?> <span><?php echo esc_html($c('assurance_badge')); ?></span></h2>
        <ul class="home-assurance__grid">
            <?php foreach ($cards as $card) : ?>
            <li>
                <article class="home-assurance-card">
                    <h3><?php echo esc_html($card['title']); ?></h3>
                    <div class="home-assurance-card__body">
                        <span class="home-assurance-card__icon" aria-hidden="true"><?php echo $icon($card['id']); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
                        <p><?php echo esc_html($card['body']); ?></p>
                    </div>
                </article>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>
