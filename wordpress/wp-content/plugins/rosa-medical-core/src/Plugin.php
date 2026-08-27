<?php

declare(strict_types=1);

namespace RosaMedical\Core;

use RosaMedical\Core\Settings\BusinessSettings;

final class Plugin
{
    public const VERSION = '0.1.0';

    public static function register(): void
    {
        add_action('init', static function (): void {
            load_plugin_textdomain(
                'rosa-medical',
                false,
                dirname(plugin_basename(ROSA_MEDICAL_CORE_FILE)) . '/languages'
            );
        });

        add_action('admin_init', [BusinessSettings::class, 'register']);
        add_action('admin_menu', [BusinessSettings::class, 'registerPage']);
        add_filter('template_include', [self::class, 'productTemplate']);
    }

    public static function productTemplate(string $template): string
    {
        if (! function_exists('is_product') || ! is_product()) {
            return $template;
        }

        $rosa_template = dirname(ROSA_MEDICAL_CORE_FILE) . '/templates/product-detail-prototype.php';

        return is_readable($rosa_template) ? $rosa_template : $template;
    }
}
