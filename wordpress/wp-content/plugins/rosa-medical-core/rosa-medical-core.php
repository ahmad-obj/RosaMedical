<?php
/**
 * Plugin Name: Rosa Medical Core
 * Description: Rosa Medical catalogue and business-logic foundation.
 * Version: 0.1.0
 * Text Domain: rosa-medical
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('ROSA_MEDICAL_CORE_FILE', __FILE__);

require_once __DIR__ . '/src/Settings/BusinessSettings.php';
require_once __DIR__ . '/src/Catalogue/ProductPresentation.php';
require_once __DIR__ . '/src/Catalogue/FamilyCatalogue.php';
require_once __DIR__ . '/src/Plugin.php';

use RosaMedical\Core\Plugin;
use RosaMedical\Core\Settings\BusinessSettings;

function rosa_business_value(string $key, string $default = ''): string
{
    return BusinessSettings::get($key, $default);
}

Plugin::register();
