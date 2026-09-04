<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor;

use RosaMedical\Core\Settings\ContentSettings;
use RosaMedical\Core\Settings\MediaSettings;

final class ElementorSeedData
{
    public static function deterministicId(string $key): string
    {
        return substr(md5('rosa:' . $key), 0, 8);
    }

    /** @return list<array<string,mixed>> */
    public static function build(string $pageType, string $locale): array
    {
        $locale = $locale === 'ar' ? 'ar' : 'en';
        $specs = self::specs($pageType);
        if ($specs === []) {
            return [];
        }

        $widgets = [];
        foreach ($specs as $index => $spec) {
            $settings = [];
            foreach ($spec['content'] as $key) {
                $settings[$key] = ContentSettings::get($spec['section'], $key, $locale);
            }
            foreach ($spec['media'] as $control => $mediaKey) {
                $id = MediaSettings::id($mediaKey);
                $settings[$control] = $id > 0 ? ['id' => $id] : [];
            }
            $instanceKey = sprintf('%s-%s-%02d-%s', $pageType, $locale, $index + 1, $spec['widget']);
            $widgets[] = [
                'id' => self::deterministicId($instanceKey),
                'elType' => 'widget',
                'widgetType' => $spec['widget'],
                'isInner' => false,
                'settings' => $settings,
                'elements' => [],
            ];
        }

        $rootClasses = $pageType === 'home'
            ? 'rosa-elementor-root public-page public-page--home'
            : 'rosa-elementor-root';

        return [[
            'id' => self::deterministicId($pageType . '-' . $locale . '-root'),
            'elType' => 'container',
            'isInner' => false,
            'settings' => [
                'css_classes' => $rootClasses,
                'content_width' => 'full',
                'gap' => ['unit' => 'px', 'size' => 0, 'sizes' => []],
                'padding' => [
                    'unit' => 'px',
                    'top' => '0',
                    'right' => '0',
                    'bottom' => '0',
                    'left' => '0',
                    'isLinked' => true,
                ],
            ],
            'elements' => $widgets,
        ]];
    }

    /** @return list<array{widget:string,section:string,content:list<string>,media:array<string,string>}> */
    private static function specs(string $pageType): array
    {
        if ($pageType === 'home') {
            return [
                self::spec('rosa-home-hero-carousel', 'home', [
                    'hero_1_eyebrow', 'hero_1_title', 'hero_1_body',
                    'hero_2_eyebrow', 'hero_2_title', 'hero_2_body',
                    'hero_3_eyebrow', 'hero_3_title', 'hero_3_body',
                    'hero_4_eyebrow', 'hero_4_title', 'hero_4_body',
                ], [
                    'desktop_1' => 'home-hero-01-desktop', 'mobile_1' => 'home-hero-01-mobile',
                    'desktop_2' => 'home-hero-02-desktop', 'mobile_2' => 'home-hero-02-mobile',
                    'desktop_3' => 'home-hero-03-desktop', 'mobile_3' => 'home-hero-03-mobile',
                    'desktop_4' => 'home-hero-04-desktop', 'mobile_4' => 'home-hero-04-mobile',
                ]),
                self::spec('rosa-home-family-discovery', 'home', ['family_title']),
                self::spec('rosa-home-comprehensive', 'home', [
                    'comprehensive_title', 'comprehensive_body', 'comprehensive_lead_specialty',
                    'comprehensive_specialty_1', 'comprehensive_specialty_2', 'comprehensive_specialty_3', 'comprehensive_specialty_4',
                ], [
                    'lead_image' => 'home-specialty-plastic-surgery',
                    'specialty_1_image' => 'home-specialty-orthopedics',
                    'specialty_2_image' => 'home-specialty-maxillofacial',
                    'specialty_3_image' => 'home-specialty-orthodontics',
                    'specialty_4_image' => 'home-specialty-spine',
                ]),
                self::spec('rosa-home-confidence', 'home', ['confidence_title', 'confidence_body', 'confidence_image_alt'], ['image' => 'home-securing-confidence']),
                self::spec('rosa-home-contact-band', 'home', ['contact_eyebrow', 'contact_title', 'contact_whatsapp_label', 'contact_email_label']),
                self::spec('rosa-home-assurance', 'home', [
                    'assurance_title', 'assurance_badge',
                    'assurance_1_title', 'assurance_1_body', 'assurance_2_title', 'assurance_2_body',
                    'assurance_3_title', 'assurance_3_body', 'assurance_4_title', 'assurance_4_body',
                ]),
                self::spec('rosa-home-quotation', 'home', ['quotation_eyebrow', 'quotation_title', 'quotation_body', 'quotation_button']),
            ];
        }

        if ($pageType === 'about') {
            return [
                self::spec('rosa-page-hero-about', 'about', ['page_eyebrow', 'page_title', 'page_body']),
                self::spec('rosa-about-who', 'about', ['who_eyebrow', 'who_title', 'who_body'], ['image' => 'about_procurement']),
                self::spec('rosa-about-stats', 'about', ['stat_1_value', 'stat_1_label', 'stat_2_value', 'stat_2_label', 'stat_3_value', 'stat_3_label']),
                self::spec('rosa-about-cards', 'about', ['card_1_title', 'card_1_body', 'card_1_cta', 'card_2_title', 'card_2_body', 'card_2_cta', 'card_3_title', 'card_3_body', 'card_3_cta']),
                self::spec('rosa-about-feature', 'about', ['feature_eyebrow', 'feature_title', 'feature_body'], ['image' => 'about_hospitals']),
                self::spec('rosa-about-why', 'about', ['why_title', 'why_1_title', 'why_1_body', 'why_2_title', 'why_2_body', 'why_3_title', 'why_3_body']),
                self::spec('rosa-about-proof', 'about', ['proof_1', 'proof_2', 'proof_3']),
            ];
        }

        if ($pageType === 'contact') {
            return [
                self::spec('rosa-page-hero-contact', 'contact', ['page_eyebrow', 'page_title', 'page_body']),
                self::spec('rosa-contact-layout', 'contact', ['location_label', 'phone_label', 'email_label', 'form_title', 'field_name', 'field_phone', 'field_subject', 'field_message', 'send_email']),
                self::spec('rosa-contact-map', 'contact', ['map_eyebrow', 'map_button']),
            ];
        }

        return [];
    }

    /** @param list<string> $content @param array<string,string> $media */
    private static function spec(string $widget, string $section, array $content, array $media = []): array
    {
        return [
            'widget' => $widget,
            'section' => $section,
            'content' => $content,
            'media' => $media,
        ];
    }
}
