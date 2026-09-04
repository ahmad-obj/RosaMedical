<?php

declare(strict_types=1);

namespace RosaMedical\Core\Settings;

final class MediaSettings
{
    public const OPTION_NAME = 'rosa_preview_media';

    /** @return list<string> */
    public static function allowedKeys(): array
    {
        return [
            'logo',

            // Latest Rosa Homepage parity media. These are the active Home slots.
            'home-hero-01-desktop', 'home-hero-01-mobile',
            'home-hero-02-desktop', 'home-hero-02-mobile',
            'home-hero-03-desktop', 'home-hero-03-mobile',
            'home-hero-04-desktop', 'home-hero-04-mobile',
            'home-specialty-plastic-surgery', 'home-specialty-orthopedics',
            'home-specialty-maxillofacial', 'home-specialty-orthodontics',
            'home-specialty-spine', 'home-securing-confidence',
            'catalogue-pdf-scissors', 'catalogue-pdf-cutters', 'catalogue-pdf-punches',
            'catalogue-pdf-chisels', 'catalogue-pdf-knives',

            // Previous preview slots remain valid for rollback and existing attachments.
            'home-hero-01', 'home-who-01', 'home-feature-01',
            'home-promo-01', 'home-promo-02', 'home-promo-03', 'home-promo-04',
            'home-why-01', 'home-evidence-01', 'prefooter-person-01',
            'about_procurement', 'about_hospitals', 'about_international',
        ];
    }

    public static function id(string $key): int
    {
        if (! in_array($key, self::allowedKeys(), true)) {
            return 0;
        }
        $media = get_option(self::OPTION_NAME, []);
        return is_array($media) && isset($media[$key]) ? max(0, (int) $media[$key]) : 0;
    }

    /** @return array<string,int> */
    public static function mergeSanitize(mixed $input): array
    {
        $existing = get_option(self::OPTION_NAME, []);
        $clean = [];
        if (is_array($existing)) {
            foreach ($existing as $key => $value) {
                if (is_string($key) && is_scalar($value)) {
                    $clean[$key] = max(0, (int) $value);
                }
            }
        }
        if (! is_array($input)) {
            return $clean;
        }
        foreach (self::allowedKeys() as $key) {
            if (! array_key_exists($key, $input) || ! is_scalar($input[$key])) {
                continue;
            }
            $clean[$key] = max(0, (int) $input[$key]);
        }
        return $clean;
    }

    public static function register(): void
    {
        if (! function_exists('register_setting')) {
            return;
        }
        register_setting(
            'rosa_media',
            self::OPTION_NAME,
            [
                'type' => 'array',
                'sanitize_callback' => [self::class, 'mergeSanitize'],
            ]
        );
    }
}
