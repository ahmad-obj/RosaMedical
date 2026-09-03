<?php

declare(strict_types=1);

namespace Elementor {
    final class Plugin
    {
        public static object $instance;
    }
}

namespace RosaMedical\Core\Settings {
    final class ContentSettings
    {
        public static function get(string $section, string $key, string $locale = 'en', string $fallback = ''): string
        {
            return strtoupper($locale) . ':' . $section . ':' . $key;
        }
    }

    final class MediaSettings
    {
        public static function id(string $key): int
        {
            return 0;
        }
    }
}

namespace {
    $GLOBALS['rosa_root_meta'] = [];

    function current_user_can(string $capability, mixed ...$args): bool
    {
        return true;
    }

    function get_post_meta(int $postId, string $key, bool $single = false): mixed
    {
        return $GLOBALS['rosa_root_meta'][$postId][$key] ?? '';
    }

    function update_post_meta(int $postId, string $key, mixed $value): bool
    {
        $GLOBALS['rosa_root_meta'][$postId][$key] = $value;
        return true;
    }

    function wp_json_encode(mixed $value, int $flags = 0): string|false
    {
        return json_encode($value, $flags);
    }

    final class RosaRootTestDocument
    {
        /** @var array<int,array<string,mixed>> */
        public array $elements = [];
        public bool $builtWithElementor = true;

        public function save(array $payload): bool
        {
            $this->elements = is_array($payload['elements'] ?? null) ? $payload['elements'] : [];
            return true;
        }

        /** @return array<int,array<string,mixed>> */
        public function get_elements_data(): array
        {
            return $this->elements;
        }

        public function set_is_built_with_elementor(bool $built): self
        {
            $this->builtWithElementor = $built;
            return $this;
        }
    }

    final class RosaRootTestDocuments
    {
        /** @var array<int,RosaRootTestDocument> */
        public array $documents = [];

        public function get(int $postId, bool $withAutosave = false): RosaRootTestDocument|false
        {
            return $this->documents[$postId] ?? false;
        }
    }

    function fail_root_test(string $message): never
    {
        fwrite(STDERR, "FAIL: {$message}\n");
        exit(1);
    }

    function test_hash(array $elements): string
    {
        return hash('sha256', json_encode($elements, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
    }

    $base = __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Elementor/';
    require_once $base . 'ElementorSeedData.php';
    require_once $base . 'ElementorPageSeeder.php';

    use Elementor\Plugin;
    use RosaMedical\Core\Elementor\ElementorPageSeeder;
    use RosaMedical\Core\Elementor\ElementorSeedData;

    $fresh = ElementorSeedData::build('about', 'en');
    $root = $fresh[0] ?? [];
    $settings = is_array($root['settings'] ?? null) ? $root['settings'] : [];
    if (($settings['css_classes'] ?? '') !== 'rosa-elementor-root') {
        fail_root_test('Container seed must use Elementor container control css_classes');
    }
    if (array_key_exists('_css_classes', $settings)) {
        fail_root_test('Container seed must not use widget-only _css_classes');
    }

    $legacy = $fresh;
    $legacy[0]['settings']['_css_classes'] = 'rosa-elementor-root';
    unset($legacy[0]['settings']['css_classes']);

    $documents = new RosaRootTestDocuments();
    $documents->documents[77] = new RosaRootTestDocument();
    $documents->documents[77]->elements = $legacy;
    Plugin::$instance = (object) ['documents' => $documents];

    $GLOBALS['rosa_root_meta'][77][ElementorPageSeeder::VERSION_META] = '1';
    $GLOBALS['rosa_root_meta'][77][ElementorPageSeeder::HASH_META] = test_hash($legacy);
    $GLOBALS['rosa_root_meta'][77]['_wp_page_template'] = ElementorPageSeeder::TEMPLATE;

    if (ElementorPageSeeder::state(77) !== 'migrated_untouched') {
        fail_root_test('Legacy v1 fixture must begin as migrated_untouched');
    }

    $result = ElementorPageSeeder::seedPage(77, 'about', 'en');
    if (($result['status'] ?? '') !== 'skipped') {
        fail_root_test('Normal migration repair must remain a non-force skipped reseed');
    }

    $repaired = $documents->documents[77]->elements[0]['settings'] ?? [];
    if (($repaired['css_classes'] ?? '') !== 'rosa-elementor-root') {
        fail_root_test('Legacy v1 root class was not migrated to css_classes');
    }
    if (array_key_exists('_css_classes', $repaired)) {
        fail_root_test('Legacy invalid _css_classes key was not removed');
    }
    if (($GLOBALS['rosa_root_meta'][77][ElementorPageSeeder::VERSION_META] ?? '') !== '2') {
        fail_root_test('Root-class migration must advance authoring version to 2');
    }
    if (ElementorPageSeeder::state(77) !== 'migrated_untouched') {
        fail_root_test('Untouched v1 document must remain migrated_untouched after surgical repair');
    }

    $documents->documents[77]->elements[0]['elements'][0]['settings']['page_title'] = 'CLIENT EDIT';
    if (ElementorPageSeeder::state(77) !== 'migrated_edited') {
        fail_root_test('Client edit must be detected after root-class migration');
    }

    $result = ElementorPageSeeder::seedPage(77, 'about', 'en');
    if (($result['status'] ?? '') !== 'skipped') {
        fail_root_test('Edited migrated document must still skip normal reseeding');
    }
    if (($documents->documents[77]->elements[0]['elements'][0]['settings']['page_title'] ?? '') !== 'CLIENT EDIT') {
        fail_root_test('Root-class migration path overwrote client content');
    }
    if (ElementorPageSeeder::state(77) !== 'migrated_edited') {
        fail_root_test('Edited state must remain edited after a normal migration check');
    }

    fwrite(STDOUT, "PASS: Elementor container root class uses css_classes and v1 documents migrate without erasing edits\n");
}
