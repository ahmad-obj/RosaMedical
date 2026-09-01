<?php

declare(strict_types=1);

namespace RosaMedical\Core\Settings;

final class ContentSettings
{
    public static function get(string $section, string $key, string $locale = 'en', string $fallback = ''): string
    {
        $locale = $locale === 'ar' ? 'ar' : 'en';
        $definition = ContentSchema::section($section);
        $field = $definition['fields'][$key] ?? null;
        if (! is_array($field)) {
            return $fallback;
        }

        $stored = get_option((string) ($definition['option'] ?? ''), []);
        if (is_array($stored)
            && isset($stored[$locale])
            && is_array($stored[$locale])
            && array_key_exists($key, $stored[$locale])
            && is_scalar($stored[$locale][$key])) {
            return (string) $stored[$locale][$key];
        }

        $default = ContentSchema::defaultValue($section, $locale, $key);
        return $default !== '' ? $default : $fallback;
    }

    /** @return array<string, array<string, string>> */
    public static function sanitizeSection(string $section, mixed $input): array
    {
        $definition = ContentSchema::section($section);
        if ($definition === [] || ! is_array($input)) {
            return [];
        }

        $clean = [];
        foreach (['en', 'ar'] as $locale) {
            $values = $input[$locale] ?? null;
            if (! is_array($values)) {
                continue;
            }
            foreach ($values as $key => $value) {
                if (! is_string($key) || ! is_scalar($value)) {
                    continue;
                }
                $field = $definition['fields'][$key] ?? null;
                if (! is_array($field)) {
                    continue;
                }
                $raw = (string) $value;
                $clean[$locale][$key] = ($field['type'] ?? 'text') === 'textarea'
                    ? sanitize_textarea_field($raw)
                    : sanitize_text_field($raw);
            }
        }
        return $clean;
    }

    public static function register(): void
    {
        if (! function_exists('register_setting')) {
            return;
        }
        foreach (ContentSchema::sections() as $section => $definition) {
            register_setting(
                'rosa_content_' . $section,
                (string) $definition['option'],
                [
                    'type' => 'array',
                    'sanitize_callback' => static fn(mixed $input): array => self::sanitizeSection($section, $input),
                    'default' => [],
                ]
            );
        }
    }

    public static function installDefaults(): void
    {
        foreach (ContentSchema::sections() as $definition) {
            $option = (string) $definition['option'];
            $existing = get_option($option, null);
            if ($existing !== null && $existing !== false) {
                continue;
            }
            $value = ['en' => [], 'ar' => []];
            foreach ($definition['fields'] as $key => $field) {
                $value['en'][$key] = (string) $field['en'];
                $value['ar'][$key] = (string) $field['ar'];
            }
            update_option($option, $value);
        }
    }
}
