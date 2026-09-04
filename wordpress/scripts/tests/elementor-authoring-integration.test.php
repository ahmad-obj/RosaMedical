<?php

declare(strict_types=1);

namespace Elementor {
    class Widget_Base
    {
        /** @var array<string,array<string,mixed>> */
        protected array $testControls = [];

        protected function start_controls_section(string $id, array $args = []): void {}
        protected function end_controls_section(): void {}
        protected function add_control(string $id, array $args): void
        {
            $this->testControls[$id] = $args;
        }
        protected function register_controls(): void {}
        protected function render(): void {}
        public function get_settings_for_display(): array { return []; }
        public function controlsForTest(): array
        {
            $this->testControls = [];
            $this->register_controls();
            return $this->testControls;
        }
    }

    final class Controls_Manager
    {
        public const TEXT = 'text';
        public const TEXTAREA = 'textarea';
        public const MEDIA = 'media';
        public const TAB_CONTENT = 'content';
    }

    class Repeater {}
}

namespace {
    $GLOBALS['rosa_test_actions'] = [];

    function add_action(string $hook, callable|array $callback, int $priority = 10, int $acceptedArgs = 1): void
    {
        $GLOBALS['rosa_test_actions'][$hook][] = [$callback, $priority, $acceptedArgs];
    }

    function __(string $text, string $domain = ''): string { return $text; }
    function esc_html__(string $text, string $domain = ''): string { return $text; }
    function esc_html(string $text): string { return $text; }
    function get_queried_object_id(): int { return 0; }
    function get_the_ID(): int { return 0; }
    function get_post_meta(int $postId, string $key, bool $single = false): mixed { return ''; }
    function locate_template(string $template): string { return ''; }
    function get_template_part(string $slug, ?string $name = null, array $args = []): void {}

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

    $categoryManager = new class {
        public array $calls = [];
        public function add_category(string $slug, array $definition): void
        {
            $this->calls[] = [$slug, $definition];
        }
    };
    WidgetRegistry::registerCategory($categoryManager);
    $expectedCategory = ['rosa-medical', ['title' => 'Rosa Medical', 'icon' => 'eicon-site-identity']];
    if (($categoryManager->calls[0] ?? null) !== $expectedCategory) {
        fail_test('Rosa Elementor category registration does not match contract');
    }

    $widgetsManager = new class {
        /** @var list<object> */
        public array $widgets = [];
        public function register(object $widget): void { $this->widgets[] = $widget; }
    };
    WidgetRegistry::registerWidgets($widgetsManager);

    $expected = [
        'rosa-home-hero' => ['hero_eyebrow', 'hero_title', 'hero_body', 'hero_button', 'image'],
        'rosa-home-who' => ['who_eyebrow', 'who_title', 'who_body', 'who_button', 'stat_1_value', 'stat_1_label', 'stat_2_value', 'stat_2_label', 'stat_3_value', 'stat_3_label', 'image'],
        'rosa-home-featured' => ['featured_title', 'benefit_1_title', 'benefit_1_body', 'benefit_2_title', 'benefit_2_body', 'benefit_3_title', 'benefit_3_body'],
        'rosa-home-feature-banner' => ['feature_eyebrow', 'feature_title', 'feature_body', 'feature_button', 'image'],
        'rosa-home-latest' => ['latest_title'],
        'rosa-home-promotions' => ['promo_1_title', 'promo_1_body', 'promo_2_title', 'promo_2_body', 'promo_3_title', 'promo_3_body', 'promo_4_title', 'promo_4_body', 'image_1', 'image_2', 'image_3', 'image_4'],
        'rosa-home-why' => ['why_eyebrow', 'why_title', 'why_1_title', 'why_1_body', 'why_2_title', 'why_2_body', 'why_3_title', 'why_3_body', 'image'],
        'rosa-home-proof' => ['proof_1', 'proof_2', 'proof_3', 'proof_4', 'proof_5', 'proof_6'],
        'rosa-home-evidence' => ['evidence_eyebrow', 'evidence_title', 'evidence_body', 'evidence_1_title', 'evidence_1_body', 'evidence_2_title', 'evidence_2_body', 'evidence_3_title', 'evidence_3_body', 'image'],
        'rosa-page-hero-about' => ['page_eyebrow', 'page_title', 'page_body'],
        'rosa-about-who' => ['who_eyebrow', 'who_title', 'who_body', 'image'],
        'rosa-about-stats' => ['stat_1_value', 'stat_1_label', 'stat_2_value', 'stat_2_label', 'stat_3_value', 'stat_3_label'],
        'rosa-about-cards' => ['card_1_title', 'card_1_body', 'card_1_cta', 'card_2_title', 'card_2_body', 'card_2_cta', 'card_3_title', 'card_3_body', 'card_3_cta'],
        'rosa-about-feature' => ['feature_eyebrow', 'feature_title', 'feature_body', 'image'],
        'rosa-about-why' => ['why_title', 'why_1_title', 'why_1_body', 'why_2_title', 'why_2_body', 'why_3_title', 'why_3_body'],
        'rosa-about-proof' => ['proof_1', 'proof_2', 'proof_3'],
        'rosa-page-hero-contact' => ['page_eyebrow', 'page_title', 'page_body'],
        'rosa-contact-layout' => ['location_label', 'phone_label', 'email_label', 'form_title', 'field_name', 'field_phone', 'field_subject', 'field_message', 'send_email'],
        'rosa-contact-map' => ['map_eyebrow', 'map_button'],
    ];

    $registered = [];
    foreach ($widgetsManager->widgets as $widget) {
        if (! method_exists($widget, 'get_name')) {
            continue;
        }
        $name = $widget->get_name();
        if (isset($expected[$name])) {
            $registered[$name] = $widget;
        }
    }

    if (array_keys($registered) !== array_keys($expected)) {
        fail_test('Rosa Elementor widgets were not registered in the required order');
    }

    foreach ($expected as $name => $expectedControls) {
        $widget = $registered[$name];
        if ($widget->get_categories() !== ['rosa-medical']) {
            fail_test("{$name} is not registered in the Rosa Medical category");
        }
        $actualControls = array_keys($widget->controlsForTest());
        if ($actualControls !== $expectedControls) {
            fail_test("{$name} controls mismatch: " . implode(',', $actualControls));
        }
    }

    $forbiddenContactControls = ['email', 'phone', 'address', 'address_ar', 'submit_endpoint', 'form_action'];
    foreach (['rosa-contact-layout', 'rosa-contact-map'] as $name) {
        $actualControls = array_keys($registered[$name]->controlsForTest());
        $leaked = array_values(array_intersect($forbiddenContactControls, $actualControls));
        if ($leaked !== []) {
            fail_test("{$name} duplicates protected Business/backend controls: " . implode(',', $leaked));
        }
    }

    fwrite(STDOUT, "PASS: Elementor integration and Rosa widget contracts\n");
}
