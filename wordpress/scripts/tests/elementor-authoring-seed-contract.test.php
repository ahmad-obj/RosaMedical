<?php

declare(strict_types=1);

namespace Elementor {
    final class Plugin
    {
        public static object $instance;
    }
}

namespace {
    define('ABSPATH', __DIR__ . '/');

    $GLOBALS['rosa_options'] = [
        'rosa_home_content' => [
            'en' => ['hero_title' => 'EN TEST HERO'],
            'ar' => ['hero_title' => 'AR TEST HERO'],
        ],
        'rosa_about_content' => [],
        'rosa_contact_content' => [],
        'rosa_preview_media' => [
            'home-hero-01' => 101,
            'home-who-01' => 102,
            'home-feature-01' => 103,
            'home-promo-01' => 104,
            'home-promo-02' => 105,
            'home-promo-03' => 106,
            'home-promo-04' => 107,
            'home-why-01' => 108,
            'home-evidence-01' => 109,
            'about_procurement' => 201,
            'about_hospitals' => 202,
        ],
    ];
    $GLOBALS['rosa_meta'] = [];
    $GLOBALS['rosa_can_edit'] = true;

    function get_option(string $name, mixed $default = false): mixed
    {
        return array_key_exists($name, $GLOBALS['rosa_options']) ? $GLOBALS['rosa_options'][$name] : $default;
    }
    function get_post_meta(int $postId, string $key, bool $single = false): mixed
    {
        return $GLOBALS['rosa_meta'][$postId][$key] ?? '';
    }
    function update_post_meta(int $postId, string $key, mixed $value): bool
    {
        $GLOBALS['rosa_meta'][$postId][$key] = $value;
        return true;
    }
    function current_user_can(string $capability, mixed ...$args): bool
    {
        return $GLOBALS['rosa_can_edit'];
    }
    function wp_json_encode(mixed $value, int $flags = 0): string|false
    {
        return json_encode($value, $flags);
    }

    final class RosaTestDocument
    {
        /** @var array<int,array<string,mixed>> */
        public array $elements = [];
        public bool $saveSucceeds = true;
        public bool $builtWithElementor = false;

        public function set_is_built_with_elementor(bool $built): self
        {
            $this->builtWithElementor = $built;
            return $this;
        }

        public function is_built_with_elementor(): bool
        {
            return $this->builtWithElementor;
        }

        public function save(array $payload): bool
        {
            if (! $this->saveSucceeds) {
                return false;
            }
            $this->elements = is_array($payload['elements'] ?? null) ? $payload['elements'] : [];
            return true;
        }

        /** @return array<int,array<string,mixed>> */
        public function get_elements_data(): array
        {
            return $this->elements;
        }
    }

    final class RosaTestDocuments
    {
        /** @var array<int,RosaTestDocument> */
        public array $documents = [];
        public function get(int $postId, bool $withAutosave = false): RosaTestDocument|false
        {
            return $this->documents[$postId] ?? false;
        }
    }

    function fail_test(string $message): never
    {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }

    $base = __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/';
    foreach ([
        'Settings/ContentSchema.php',
        'Settings/ContentSettings.php',
        'Settings/MediaSettings.php',
        'Elementor/ElementorSeedData.php',
        'Elementor/ElementorPageSeeder.php',
    ] as $relative) {
        $path = $base . $relative;
        if (! is_file($path)) {
            fail_test("Missing production file: {$relative}");
        }
        require_once $path;
    }

    use Elementor\Plugin;
    use RosaMedical\Core\Elementor\ElementorPageSeeder;
    use RosaMedical\Core\Elementor\ElementorSeedData;

    if (ElementorSeedData::deterministicId('home-en-root') !== substr(md5('rosa:home-en-root'), 0, 8)) {
        fail_test('Deterministic Elementor IDs do not match contract');
    }

    /** @return list<array<string,mixed>> */
    function rosa_test_widgets(array $elements): array
    {
        $root = $elements[0] ?? [];
        $widgets = is_array($root['elements'] ?? null) ? $root['elements'] : [];
        return array_values(array_filter($widgets, 'is_array'));
    }

    $expectedNames = [
        'home' => ['rosa-home-hero', 'rosa-home-who', 'rosa-home-featured', 'rosa-home-feature-banner', 'rosa-home-latest', 'rosa-home-promotions', 'rosa-home-why', 'rosa-home-proof', 'rosa-home-evidence'],
        'about' => ['rosa-page-hero-about', 'rosa-about-who', 'rosa-about-stats', 'rosa-about-cards', 'rosa-about-feature', 'rosa-about-why', 'rosa-about-proof'],
        'contact' => ['rosa-page-hero-contact', 'rosa-contact-layout', 'rosa-contact-map'],
    ];

    foreach ($expectedNames as $pageType => $names) {
        $widgets = rosa_test_widgets(ElementorSeedData::build($pageType, 'en'));
        $actualNames = array_map(static fn(array $widget): string => (string) ($widget['widgetType'] ?? ''), $widgets);
        if ($actualNames !== $names) {
            fail_test("{$pageType} seed widget order mismatch");
        }
        $root = ElementorSeedData::build($pageType, 'en')[0] ?? null;
        if (! is_array($root) || ($root['settings']['css_classes'] ?? '') !== 'rosa-elementor-root') {
            fail_test("{$pageType} seed root class drifted");
        }
    }

    $enHome = rosa_test_widgets(ElementorSeedData::build('home', 'en'));
    $arHome = rosa_test_widgets(ElementorSeedData::build('home', 'ar'));
    if (($enHome[0]['settings']['hero_title'] ?? '') !== 'EN TEST HERO') {
        fail_test('English seed did not use English structured content');
    }
    if (($arHome[0]['settings']['hero_title'] ?? '') !== 'AR TEST HERO') {
        fail_test('Arabic seed did not use Arabic structured content');
    }
    if ((int) ($enHome[0]['settings']['image']['id'] ?? 0) !== 101) {
        fail_test('Home seed did not map existing Rosa media to Elementor media control');
    }

    $forbidden = ['phone', 'email', 'address', 'address_ar', 'whatsapp', 'form_action', 'submit_endpoint'];
    foreach (['home', 'about', 'contact'] as $pageType) {
        foreach (rosa_test_widgets(ElementorSeedData::build($pageType, 'en')) as $widget) {
            $settings = is_array($widget['settings'] ?? null) ? $widget['settings'] : [];
            $leaked = array_intersect($forbidden, array_keys($settings));
            if ($leaked !== []) {
                fail_test("{$pageType} seed duplicated protected settings: " . implode(',', $leaked));
            }
        }
    }

    $documents = new RosaTestDocuments();
    $documents->documents[44] = new RosaTestDocument();
    Plugin::$instance = (object) ['documents' => $documents];

    if (ElementorPageSeeder::state(44) !== 'never_migrated') {
        fail_test('Unmarked page must be never_migrated');
    }

    $GLOBALS['rosa_can_edit'] = false;
    $forbiddenResult = ElementorPageSeeder::seedPage(44, 'home', 'en');
    if (($forbiddenResult['status'] ?? '') !== 'forbidden' || $documents->documents[44]->elements !== [] || $documents->documents[44]->builtWithElementor) {
        fail_test('Seeder must not write or mark Elementor mode when edit_post capability is missing');
    }

    $GLOBALS['rosa_can_edit'] = true;
    $seeded = ElementorPageSeeder::seedPage(44, 'home', 'en');
    if (($seeded['status'] ?? '') !== 'seeded') {
        fail_test('Never-migrated page was not seeded');
    }
    if (! $documents->documents[44]->is_built_with_elementor()) {
        fail_test('Seeder saved Elementor data but did not mark page as built with Elementor');
    }
    if (($GLOBALS['rosa_meta'][44]['_wp_page_template'] ?? '') !== 'page-templates/rosa-elementor-authoring.php') {
        fail_test('Seeder did not assign the protected Rosa Elementor page template');
    }
    if (($GLOBALS['rosa_meta'][44]['_rosa_elementor_authoring_version'] ?? '') !== '2') {
        fail_test('Seeder did not store authoring version 2');
    }
    if (($GLOBALS['rosa_meta'][44][ElementorPageSeeder::HOME_PARITY_META] ?? '') !== '2') {
        fail_test('Seeder did not store finished-template Home parity version 2');
    }
    if (ElementorPageSeeder::state(44) !== 'migrated_untouched') {
        fail_test('Freshly seeded page must be migrated_untouched');
    }

    $documents->documents[44]->elements[0]['elements'][0]['settings']['hero_title'] = 'CLIENT EDIT';
    if (ElementorPageSeeder::state(44) !== 'migrated_edited') {
        fail_test('Changed Elementor document must be migrated_edited');
    }
    $skipped = ElementorPageSeeder::seedPage(44, 'home', 'en');
    if (($skipped['status'] ?? '') !== 'skipped' || ($documents->documents[44]->elements[0]['elements'][0]['settings']['hero_title'] ?? '') !== 'CLIENT EDIT') {
        fail_test('Normal reseed must preserve client-edited Elementor content');
    }
    $forced = ElementorPageSeeder::seedPage(44, 'home', 'en', true);
    if (($forced['status'] ?? '') !== 'seeded_forced' || ($documents->documents[44]->elements[0]['elements'][0]['settings']['hero_title'] ?? '') !== 'EN TEST HERO' || ! $documents->documents[44]->is_built_with_elementor()) {
        fail_test('Force reseed did not intentionally restore Rosa migration source and Elementor built state');
    }

    fwrite(STDOUT, "PASS: Elementor seed data and finished-template migration contract\n");
}
