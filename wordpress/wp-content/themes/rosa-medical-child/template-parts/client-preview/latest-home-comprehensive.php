<?php
if (! defined('ABSPATH')) { exit; }
$sectionArgs = isset($args) && is_array($args) ? $args : [];
$locale = (string)($sectionArgs['locale'] ?? rosa_preview_locale());
$c = static fn(string $key): string => rosa_preview_section_value($sectionArgs, 'home', $key, $locale, '');
$m = static fn(string $key, string $slot): int => rosa_preview_section_media_id($sectionArgs, $key, $slot);
$specialties = [
    [$c('comprehensive_specialty_1'), $m('specialty_1_image', 'home-specialty-orthopedics'), '50% 50%'],
    [$c('comprehensive_specialty_2'), $m('specialty_2_image', 'home-specialty-maxillofacial'), '50% 48%'],
    [$c('comprehensive_specialty_3'), $m('specialty_3_image', 'home-specialty-orthodontics'), '50% 48%'],
    [$c('comprehensive_specialty_4'), $m('specialty_4_image', 'home-specialty-spine'), '50% 47%'],
];
$leadId = $m('lead_image', 'home-specialty-plastic-surgery');
$leadUrl = $leadId > 0 ? wp_get_attachment_image_url($leadId, 'full') : '';
?>
<section class="section home-comprehensive" data-section="comprehensive-plans" aria-labelledby="home-comprehensive-title">
    <div class="container container--wide">
        <h2 id="home-comprehensive-title" class="home-compact-section-title home-compact-section-title--center"><?php echo esc_html($c('comprehensive_title')); ?></h2>
        <div class="home-comprehensive__lead">
            <figure class="home-specialty home-specialty--lead">
                <div class="home-clinical-media home-clinical-media--landscape">
                    <?php if (is_string($leadUrl) && $leadUrl !== '') : ?><img class="home-clinical-media__image" src="<?php echo esc_url($leadUrl); ?>" alt="<?php echo esc_attr($c('comprehensive_lead_specialty')); ?>" loading="lazy" decoding="async" style="object-position:50% 44%"><?php endif; ?>
                </div>
                <figcaption><?php echo esc_html($c('comprehensive_lead_specialty')); ?></figcaption>
            </figure>
            <p class="home-editorial-copy"><?php echo esc_html($c('comprehensive_body')); ?></p>
        </div>
        <ul class="home-comprehensive__specialties" aria-label="<?php echo esc_attr($c('comprehensive_title')); ?>">
            <?php foreach ($specialties as [$label, $mediaId, $focal]) : $url = $mediaId > 0 ? wp_get_attachment_image_url($mediaId, 'full') : ''; ?>
            <li>
                <figure class="home-specialty">
                    <div class="home-clinical-media home-clinical-media--landscape">
                        <?php if (is_string($url) && $url !== '') : ?><img class="home-clinical-media__image" src="<?php echo esc_url($url); ?>" alt="<?php echo esc_attr($label); ?>" loading="lazy" decoding="async" style="object-position:<?php echo esc_attr($focal); ?>"><?php endif; ?>
                    </div>
                    <figcaption><?php echo esc_html($label); ?></figcaption>
                </figure>
            </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>
