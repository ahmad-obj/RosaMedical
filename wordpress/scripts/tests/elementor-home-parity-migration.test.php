<?php

declare(strict_types=1);

namespace Elementor {
    final class Plugin { public static object $instance; }
}

namespace {
    define('ABSPATH', __DIR__ . '/');
    $GLOBALS['rosa_meta'] = [];
    $GLOBALS['rosa_options'] = ['rosa_home_content' => [], 'rosa_about_content' => [], 'rosa_contact_content' => [], 'rosa_preview_media' => []];

    function get_option(string $name, mixed $default = false): mixed { return $GLOBALS['rosa_options'][$name] ?? $default; }
    function get_post_meta(int $postId, string $key, bool $single = false): mixed { return $GLOBALS['rosa_meta'][$postId][$key] ?? ''; }
    function update_post_meta(int $postId, string $key, mixed $value): bool { $GLOBALS['rosa_meta'][$postId][$key] = $value; return true; }
    function current_user_can(string $capability, mixed ...$args): bool { return true; }
    function wp_json_encode(mixed $value, int $flags = 0): string|false { return json_encode($value, $flags); }

    final class TestDocument {
        /** @var array<int,array<string,mixed>> */
        public array $elements;
        public bool $built = true;
        public function __construct(array $elements) { $this->elements = $elements; }
        public function save(array $payload): bool { $this->elements = is_array($payload['elements'] ?? null) ? $payload['elements'] : []; return true; }
        public function get_elements_data(): array { return $this->elements; }
        public function set_is_built_with_elementor(bool $value): self { $this->built = $value; return $this; }
        public function is_built_with_elementor(): bool { return $this->built; }
    }
    final class TestDocuments {
        /** @var array<int,TestDocument> */
        public array $documents = [];
        public function get(int $postId, bool $withAutosave = false): TestDocument|false { return $this->documents[$postId] ?? false; }
    }

    function fail_test(string $message): never { fwrite(STDERR, "FAIL: {$message}\n"); exit(1); }
    function document_hash(array $elements): string {
        $encoded = json_encode($elements, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return is_string($encoded) ? hash('sha256', $encoded) : '';
    }

    $base = __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/';
    foreach (['Settings/ContentSchema.php','Settings/ContentSettings.php','Settings/MediaSettings.php','Elementor/ElementorSeedData.php','Elementor/ElementorPageSeeder.php'] as $relative) {
        require_once $base . $relative;
    }

    use Elementor\Plugin;
    use RosaMedical\Core\Elementor\ElementorPageSeeder;

    if (! defined(ElementorPageSeeder::class . '::HOME_PARITY_META')) fail_test('Home parity meta constant missing');
    if (! defined(ElementorPageSeeder::class . '::HOME_PARITY_VERSION')) fail_test('Home parity version constant missing');
    if (ElementorPageSeeder::HOME_PARITY_VERSION !== '2') fail_test('finished-template Home parity must be version 2');

    $docs = new TestDocuments();
    Plugin::$instance = (object)['documents' => $docs];

    $latestCustomHome = [[
        'id' => 'latest-home-root', 'elType' => 'container', 'settings' => ['css_classes' => 'rosa-elementor-root public-page public-page--home'],
        'elements' => [
            ['id' => 'latest-hero', 'elType' => 'widget', 'widgetType' => 'rosa-home-hero-carousel', 'settings' => ['hero_1_title' => 'LATEST CUSTOM'], 'elements' => []],
            ['id' => 'latest-family', 'elType' => 'widget', 'widgetType' => 'rosa-home-family-discovery', 'settings' => ['family_title' => 'LATEST CUSTOM'], 'elements' => []],
        ],
    ]];

    // Untouched parity-v1 Home must migrate automatically back to the approved finished template.
    $docs->documents[101] = new TestDocument($latestCustomHome);
    $GLOBALS['rosa_meta'][101] = [
        ElementorPageSeeder::VERSION_META => ElementorPageSeeder::VERSION,
        ElementorPageSeeder::HASH_META => document_hash($latestCustomHome),
        ElementorPageSeeder::HOME_PARITY_META => '1',
        '_wp_page_template' => ElementorPageSeeder::TEMPLATE,
    ];
    $result = ElementorPageSeeder::seedPage(101, 'home', 'en');
    if (($result['status'] ?? '') !== 'migrated_home_parity') fail_test('untouched parity-v1 Home did not auto-migrate');
    if (($GLOBALS['rosa_meta'][101][ElementorPageSeeder::HOME_PARITY_META] ?? '') !== '2') fail_test('Home parity metadata did not advance to version 2');
    $widgets = $docs->documents[101]->elements[0]['elements'] ?? [];
    $names = array_map(static fn(array $widget): string => (string)($widget['widgetType'] ?? ''), is_array($widgets) ? $widgets : []);
    $expected = ['rosa-home-hero','rosa-home-who','rosa-home-featured','rosa-home-feature-banner','rosa-home-latest','rosa-home-promotions','rosa-home-why','rosa-home-proof','rosa-home-evidence'];
    if ($names !== $expected) fail_test('automatic Home migration did not restore finished-template topology');
    if (($docs->documents[101]->elements[0]['settings']['css_classes'] ?? '') !== 'rosa-elementor-root') fail_test('finished-template Home root class drifted during migration');
    if (($GLOBALS['rosa_meta'][101][ElementorPageSeeder::HASH_META] ?? '') !== document_hash($docs->documents[101]->elements)) fail_test('Home parity migration did not advance baseline hash');

    // An edited parity-v1 Home must be protected from silent topology replacement.
    $docs->documents[102] = new TestDocument($latestCustomHome);
    $GLOBALS['rosa_meta'][102] = [
        ElementorPageSeeder::VERSION_META => ElementorPageSeeder::VERSION,
        ElementorPageSeeder::HASH_META => hash('sha256', 'different-client-baseline'),
        ElementorPageSeeder::HOME_PARITY_META => '1',
        '_wp_page_template' => ElementorPageSeeder::TEMPLATE,
    ];
    $before = $docs->documents[102]->elements;
    $result = ElementorPageSeeder::seedPage(102, 'home', 'en');
    if (($result['status'] ?? '') !== 'home_parity_manual_required') fail_test('edited parity-v1 Home was not stopped for manual review');
    if ($docs->documents[102]->elements !== $before) fail_test('edited parity-v1 Home was overwritten');
    if (($GLOBALS['rosa_meta'][102][ElementorPageSeeder::HOME_PARITY_META] ?? '') !== '1') fail_test('edited Home parity marker changed despite manual stop');

    // Fresh Home gets version-2 parity metadata during ordinary first migration.
    $docs->documents[103] = new TestDocument([]);
    $result = ElementorPageSeeder::seedPage(103, 'home', 'ar');
    if (($result['status'] ?? '') !== 'seeded') fail_test('fresh Home did not seed normally');
    if (($GLOBALS['rosa_meta'][103][ElementorPageSeeder::HOME_PARITY_META] ?? '') !== '2') fail_test('fresh Home missing parity version 2');

    // Existing About remains on the generic authoring lifecycle and skips normally.
    $about = [[
        'id' => 'about-root', 'elType' => 'container', 'settings' => ['css_classes' => 'rosa-elementor-root'], 'elements' => [],
    ]];
    $docs->documents[201] = new TestDocument($about);
    $GLOBALS['rosa_meta'][201] = [
        ElementorPageSeeder::VERSION_META => ElementorPageSeeder::VERSION,
        ElementorPageSeeder::HASH_META => document_hash($about),
        '_wp_page_template' => ElementorPageSeeder::TEMPLATE,
    ];
    $result = ElementorPageSeeder::seedPage(201, 'about', 'en');
    if (($result['status'] ?? '') !== 'skipped') fail_test('About lifecycle changed during Home parity migration');

    fwrite(STDOUT, "PASS: finished-template Home parity v2 protects edits and upgrades untouched documents\n");
}
