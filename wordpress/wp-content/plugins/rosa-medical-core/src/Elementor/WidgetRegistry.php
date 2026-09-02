<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor;

final class WidgetRegistry
{
    public static function registerCategory(object $elementsManager): void
    {
        $title = function_exists('__') ? __('Rosa Medical', 'rosa-medical') : 'Rosa Medical';
        $elementsManager->add_category('rosa-medical', [
            'title' => $title,
            'icon' => 'eicon-site-identity',
        ]);
    }

    public static function registerWidgets(object $widgetsManager): void
    {
        $groups = [
            __DIR__ . '/Widgets/AbstractRosaSectionWidget.php',
            __DIR__ . '/Widgets/HomeWidgets.php',
            __DIR__ . '/Widgets/AboutWidgets.php',
            __DIR__ . '/Widgets/ContactWidgets.php',
        ];
        foreach ($groups as $file) {
            if (is_readable($file)) {
                require_once $file;
            }
        }

        foreach (self::widgetClasses() as $class) {
            if (class_exists($class)) {
                $widgetsManager->register(new $class());
            }
        }
    }

    /** @return list<class-string> */
    public static function widgetClasses(): array
    {
        return [
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeHeroWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeWhoWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeFeaturedWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeFeatureBannerWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeLatestWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomePromotionsWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeWhyWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeProofWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\HomeEvidenceWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutHeroWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutWhoWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutStatsWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutCardsWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutFeatureWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutWhyWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\AboutProofWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\ContactHeroWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\ContactLayoutWidget',
            'RosaMedical\\Core\\Elementor\\Widgets\\ContactMapWidget',
        ];
    }
}
