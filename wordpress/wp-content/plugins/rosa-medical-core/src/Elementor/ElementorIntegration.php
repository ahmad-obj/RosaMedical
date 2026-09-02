<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor;

final class ElementorIntegration
{
    public static function register(): void
    {
        add_action('elementor/init', [self::class, 'boot']);
    }

    public static function boot(): void
    {
        add_action('elementor/elements/categories_registered', [WidgetRegistry::class, 'registerCategory']);
        add_action('elementor/widgets/register', [WidgetRegistry::class, 'registerWidgets']);
    }

    public static function isAvailable(): bool
    {
        return class_exists('\\Elementor\\Plugin');
    }
}
