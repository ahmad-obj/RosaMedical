<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$m = static fn(string $key, string $slot): int => rosa_preview_section_media_id($sectionArgs, $key, $slot);
$specialties = [
    [$c('comprehensive_specialty_1'), $m('specialty_1_image', 'home-specialty-orthopedics'), '50% 50%', 'home-specialty-orthopedics'],
    [$c('comprehensive_specialty_2'), $m('specialty_2_image', 'home-specialty-maxillofacial'), '50% 48%', 'home-specialty-maxillofacial'],
    [$c('comprehensive_specialty_3'), $m('specialty_3_image', 'home-specialty-orthodontics'), '50% 48%', 'home-specialty-orthodontics'],
    [$c('comprehensive_specialty_4'), $m('specialty_4_image', 'home-specialty-spine'), '50% 47%', 'home-specialty-spine'],
];
$leadSlot = 'home-specialty-plastic-surgery';
$leadId = $m('lead_image', $leadSlot);
$leadLabel = $c('comprehensive_lead_specialty');
?>
<section class="section home-comprehensive" data-section="comprehensive-plans" aria-labelledby="home-comprehensive-title">
    <div class="container container--wide">
        <h2 id="home-comprehensive-title" class="home-compact-section-title home-compact-section-title--center"><?php echo esc_html($c('comprehensive_title')); ?></h2>
        <div class="home-comprehensive__lead">
            <figure class="home-specialty home-specialty--lead">
                <div class="home-clinical-media home-clinical-media--landscape">
                    <?php if ($leadId > 0) : ?>
                        <?php echo wp_get_attachment_image($leadId, 'large', false, [
                            'class' => 'home-clinical-media__image',
                            'alt' => $leadLabel,
                            'loading' => 'lazy',
                            'decoding' => 'async',
                            'sizes' => '(max-width: 40rem) 100vw, 55vw',
                            'style' => 'object-position:50% 44%',
                        ]); ?>
                    <?php else : ?>
                        <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $leadSlot, 'label' => $leadLabel, 'class' => 'home-clinical-media__placeholder', 'image_id' => 0]); ?>
                    <?php endif; ?>
                </div>
                <figcaption><?php echo esc_html($leadLabel); ?></figcaption>
            </figure>
            <p class="home-editorial-copy"><?php echo esc_html($c('comprehensive_body')); ?></p>
        </div>
        <ul class="home-comprehensive__specialties" aria-label="<?php echo esc_attr($c('comprehensive_title')); ?>">
            <?php foreach ($specialties as [$label, $mediaId, $focal, $slot]) : ?>
            <li>
                <figure class="home-specialty">
                    <div class="home-clinical-media home-clinical-media--landscape">
                        <?php if ($mediaId > 0) : ?>
                            <?php echo wp_get_attachment_image($mediaId, 'large', false, [
                                'class' => 'home-clinical-media__image',
                                'alt' => $label,
                                'loading' => 'lazy',
                                'decoding' => 'async',
                                'sizes' => '(max-width: 40rem) 48vw, (max-width: 64rem) 24vw, 20vw',
                                'style' => 'object-position:' . $focal,
                            ]); ?>
                        <?php else : ?>
                            <?php get_template_part('template-parts/client-preview/media-slot', null, ['slot' => $slot, 'label' => $label, 'class' => 'home-clinical-media__placeholder', 'image_id' => 0]); ?>
                        <?php endif; ?>
                    </div>
                    <figcaption><?php echo esc_html($label); ?></figcaption>
                </figure>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>
