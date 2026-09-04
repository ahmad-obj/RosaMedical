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
        'rosa-home-hero-carousel' => [
            'hero_1_eyebrow', 'hero_1_title', 'hero_1_body', 'desktop_1', 'mobile_1',
            'hero_2_eyebrow', 'hero_2_title', 'hero_2_body', 'desktop_2', 'mobile_2',
            'hero_3_eyebrow', 'hero_3_title', 'hero_3_body', 'desktop_3', 'mobile_3',
            'hero_4_eyebrow', 'hero_4_title', 'hero_4_body', 'desktop_4', 'mobile_4',
        ],
        'rosa-home-family-discovery' => ['family_title'],
        'rosa-home-comprehensive' => [
            'comprehensive_title', 'comprehensive_body', 'comprehensive_lead_specialty',
            'comprehensive_specialty_1', 'comprehensive_specialty_2', 'comprehensive_specialty_3', 'comprehensive_specialty_4',
            'lead_image', 'specialty_1_image', 'specialty_2_image', 'specialty_3_image', 'specialty_4_image',
        ],
        'rosa-home-confidence' => ['confidence_title', 'confidence_body', 'confidence_image_alt', 'image'],
        'rosa-home-contact-band' => ['contact_eyebrow', 'contact_title', 'contact_whatsapp_label', 'contact_email_label'],
        'rosa-home-assurance' => [
            'assurance_title', 'assurance_badge',
            'assurance_1_title', 'assurance_1_body', 'assurance_2_title', 'assurance_2_body',
            'assurance_3_title', 'assurance_3_body', 'assurance_4_title', 'assurance_4_body',
        ],
        'rosa-home-quotation' => ['quotation_eyebrow', 'quotation_title', 'quotation_body', 'quotation_button'],
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

    $forbiddenContactControls = ['email', 'phone', 'address', 'address_ar', 'whatsapp', 'whatsapp_href', 'email_href', 'submit_endpoint', 'form_action'];
    foreach (['rosa-home-contact-band', 'rosa-contact-layout', 'rosa-contact-map'] as $name) {
        $actualControls = array_keys($registered[$name]->controlsForTest());
        $leaked = array_values(array_intersect($forbiddenContactControls, $actualControls));
        if ($leaked !== []) {
            fail_test("{$name} duplicates protected Business/backend controls: " . implode(',', $leaked));
        }
    }

    fwrite(STDOUT, "PASS: Elementor integration and Rosa widget contracts\n");
}
