<?php

declare(strict_types=1);

namespace RosaMedical\Core\Admin;

use RosaMedical\Core\Settings\MediaSettings;

final class MediaField
{
    /** @return array<string,string> */
    public static function fieldsForSection(string $section): array
    {
        return match ($section) {
            'home' => [
                'home-hero-01' => 'Hero image',
                'home-who-01' => 'Who We Are image',
                'home-feature-01' => 'Feature banner image',
                'home-promo-01' => 'Promo 1 image',
                'home-promo-02' => 'Promo 2 image',
                'home-promo-03' => 'Promo 3 image',
                'home-promo-04' => 'Promo 4 image',
                'home-why-01' => 'Why Rosa image',
                'home-evidence-01' => 'Workflow image',
            ],
            'about' => [
                'about_procurement' => 'Who We Are image',
                'about_hospitals' => 'Feature banner image',
                'about_international' => 'Pre-footer image',
            ],
            'site' => [
                'logo' => 'Header logo',
                'prefooter-person-01' => 'Shared pre-footer image',
            ],
            default => [],
        };
    }

    public static function renderSection(string $section): void
    {
        $fields = self::fieldsForSection($section);
        if ($fields === []) {
            return;
        }
        ?>
        <div class="rosa-content-admin__group rosa-content-admin__media-group">
            <h3><?php echo esc_html__('Media', 'rosa-medical'); ?></h3>
            <p class="description"><?php echo esc_html__('Choose images from the WordPress Media Library. Layout and crop behavior remain controlled by the Rosa theme.', 'rosa-medical'); ?></p>
            <div class="rosa-media-fields">
                <?php foreach ($fields as $key => $label) : self::render($key, $label); endforeach; ?>
            </div>
        </div>
        <?php
    }

    private static function render(string $key, string $label): void
    {
        $id = MediaSettings::id($key);
        $url = $id > 0 ? wp_get_attachment_image_url($id, 'medium') : false;
        ?>
        <div class="rosa-media-field" data-rosa-media-field>
            <strong><?php echo esc_html($label); ?></strong>
            <div class="rosa-media-field__preview" data-rosa-media-preview>
                <?php if (is_string($url) && $url !== '') : ?><img src="<?php echo esc_url($url); ?>" alt=""><?php else : ?><span><?php echo esc_html__('No image selected', 'rosa-medical'); ?></span><?php endif; ?>
            </div>
            <input type="hidden" name="<?php echo esc_attr(MediaSettings::OPTION_NAME); ?>[<?php echo esc_attr($key); ?>]" value="<?php echo esc_attr((string) $id); ?>" data-rosa-media-input>
            <div class="rosa-media-field__actions">
                <button type="button" class="button" data-rosa-media-select><?php echo esc_html($id > 0 ? __('Replace', 'rosa-medical') : __('Select image', 'rosa-medical')); ?></button>
                <button type="button" class="button-link-delete" data-rosa-media-remove<?php echo $id <= 0 ? ' hidden' : ''; ?>><?php echo esc_html__('Remove', 'rosa-medical'); ?></button>
            </div>
        </div>
        <?php
    }
}
