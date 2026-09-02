<?php

declare(strict_types=1);

$GLOBALS['rosa_test_actions'] = [];

function add_action(string $hook, callable|array $callback, int $priority = 10, int $acceptedArgs = 1): void
{
    $GLOBALS['rosa_test_actions'][$hook][] = [$callback, $priority, $acceptedArgs];
}

require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Elementor/ElementorIntegration.php';

use RosaMedical\Core\Elementor\ElementorIntegration;
use RosaMedical\Core\Elementor\WidgetRegistry;

function fail_test(string $message): never
{
    fwrite(STDERR, "FAIL: {$message}\n");
    exit(1);
}

if (ElementorIntegration::isAvailable()) {
    fail_test('Elementor must be reported unavailable when Elementor\\Plugin is absent');
}

ElementorIntegration::register();
if (! isset($GLOBALS['rosa_test_actions']['elementor/init'])) {
    fail_test('Elementor init hook was not registered');
}

ElementorIntegration::boot();
foreach (['elementor/elements/categories_registered', 'elementor/widgets/register'] as $hook) {
    if (! isset($GLOBALS['rosa_test_actions'][$hook])) {
        fail_test("Missing lifecycle hook: {$hook}");
    }
}

$manager = new class {
    public array $calls = [];
    public function add_category(string $slug, array $definition): void
    {
        $this->calls[] = [$slug, $definition];
    }
};
WidgetRegistry::registerCategory($manager);
$expected = ['rosa-medical', ['title' => 'Rosa Medical', 'icon' => 'eicon-site-identity']];
if (($manager->calls[0] ?? null) !== $expected) {
    fail_test('Rosa Elementor category registration does not match contract');
}

fwrite(STDOUT, "PASS: Elementor integration lifecycle contract\n");
