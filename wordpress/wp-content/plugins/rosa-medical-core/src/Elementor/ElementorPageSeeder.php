<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor;

final class ElementorPageSeeder
{
    public const VERSION_META = '_rosa_elementor_authoring_version';
    public const HASH_META = '_rosa_elementor_seed_hash';
    public const VERSION = '2';
    public const HOME_PARITY_META = '_rosa_elementor_home_parity_version';
    public const HOME_PARITY_VERSION = '1';
    public const TEMPLATE = 'page-templates/rosa-elementor-authoring.php';

    public static function state(int $postId): string
    {
        $version = function_exists('get_post_meta') ? (string) get_post_meta($postId, self::VERSION_META, true) : '';
        if ($version === '') {
            return 'never_migrated';
        }

        $seedHash = function_exists('get_post_meta') ? (string) get_post_meta($postId, self::HASH_META, true) : '';
        $currentHash = self::currentHash($postId);
        if ($seedHash !== '' && $currentHash !== '' && hash_equals($seedHash, $currentHash)) {
            return 'migrated_untouched';
        }

        return 'migrated_edited';
    }

    /** @return array{status:string,post_id:int} */
    public static function seedPage(int $postId, string $pageType, string $locale, bool $force = false): array
    {
        if (! function_exists('current_user_can') || ! current_user_can('edit_post', $postId)) {
            return ['status' => 'forbidden', 'post_id' => $postId];
        }

        $locale = $locale === 'ar' ? 'ar' : 'en';
        $elements = ElementorSeedData::build($pageType, $locale);
        if ($elements === []) {
            return ['status' => 'invalid_page_type', 'post_id' => $postId];
        }

        $state = self::state($postId);
        if (! $force && $state !== 'never_migrated') {
            $version = function_exists('get_post_meta') ? (string) get_post_meta($postId, self::VERSION_META, true) : '';
            if ($version === '1') {
                $migrationStatus = self::migrateV1RootClass($postId, $pageType, $locale, $state);
                if ($migrationStatus !== 'ok') {
                    return ['status' => $migrationStatus, 'post_id' => $postId];
                }
            }

            if ($pageType === 'home'
                && (string) get_post_meta($postId, self::HOME_PARITY_META, true) !== self::HOME_PARITY_VERSION) {
                // The latest Homepage topology is a structural replacement, so it
                // is automatic only when the existing Elementor document still
                // exactly matches its stored Rosa seed baseline.
                if ($state !== 'migrated_untouched') {
                    return ['status' => 'home_parity_manual_required', 'post_id' => $postId];
                }

                $document = self::document($postId);
                if (! is_object($document)
                    || ! method_exists($document, 'save')
                    || ! method_exists($document, 'set_is_built_with_elementor')) {
                    return ['status' => 'document_missing', 'post_id' => $postId];
                }

                if (! $document->save(['elements' => $elements])) {
                    return ['status' => 'save_failed', 'post_id' => $postId];
                }
                $document->set_is_built_with_elementor(true);
                update_post_meta($postId, '_wp_page_template', self::TEMPLATE);
                update_post_meta($postId, self::HOME_PARITY_META, self::HOME_PARITY_VERSION);

                $hash = self::currentHash($postId);
                if ($hash === '') {
                    return ['status' => 'reload_failed', 'post_id' => $postId];
                }
                update_post_meta($postId, self::HASH_META, $hash);

                return ['status' => 'migrated_home_parity', 'post_id' => $postId];
            }

            return ['status' => 'skipped', 'post_id' => $postId];
        }

        $document = self::document($postId);
        if (! is_object($document)) {
            return ['status' => 'document_missing', 'post_id' => $postId];
        }
        if (! method_exists($document, 'set_is_built_with_elementor')) {
            return ['status' => 'unsupported_document', 'post_id' => $postId];
        }

        $saved = $document->save(['elements' => $elements]);
        if (! $saved) {
            return ['status' => 'save_failed', 'post_id' => $postId];
        }

        // Elementor's Document::save() persists elements but does not turn an
        // existing WordPress page into an Elementor page. Core does this as a
        // separate operation when entering/saving through the editor.
        $document->set_is_built_with_elementor(true);
        update_post_meta($postId, '_wp_page_template', self::TEMPLATE);

        $normalizedHash = self::currentHash($postId);
        if ($normalizedHash === '') {
            return ['status' => 'reload_failed', 'post_id' => $postId];
        }

        update_post_meta($postId, self::VERSION_META, self::VERSION);
        update_post_meta($postId, self::HASH_META, $normalizedHash);
        if ($pageType === 'home') {
            update_post_meta($postId, self::HOME_PARITY_META, self::HOME_PARITY_VERSION);
        }

        return [
            'status' => $force ? 'seeded_forced' : 'seeded',
            'post_id' => $postId,
        ];
    }

    private static function migrateV1RootClass(int $postId, string $pageType, string $locale, string $priorState): string
    {
        $document = self::document($postId);
        if (! is_object($document) || ! method_exists($document, 'get_elements_data')) {
            return 'document_missing';
        }

        $elements = $document->get_elements_data();
        if (! is_array($elements)) {
            return 'reload_failed';
        }

        $rootId = ElementorSeedData::deterministicId($pageType . '-' . $locale . '-root');
        $found = false;
        $changed = false;

        foreach ($elements as &$element) {
            if (! is_array($element)
                || (string) ($element['id'] ?? '') !== $rootId
                || (string) ($element['elType'] ?? '') !== 'container') {
                continue;
            }

            $found = true;
            $settings = is_array($element['settings'] ?? null) ? $element['settings'] : [];
            $current = is_scalar($settings['css_classes'] ?? null) ? trim((string) $settings['css_classes']) : '';
            $legacy = is_scalar($settings['_css_classes'] ?? null) ? trim((string) $settings['_css_classes']) : '';
            $tokens = preg_split('/\s+/', trim($current . ' ' . $legacy)) ?: [];
            $tokens = array_values(array_unique(array_filter($tokens, static fn(string $token): bool => $token !== '')));
            if (! in_array('rosa-elementor-root', $tokens, true)) {
                $tokens[] = 'rosa-elementor-root';
            }
            $migrated = implode(' ', $tokens);

            if ($current !== $migrated || array_key_exists('_css_classes', $settings)) {
                $settings['css_classes'] = $migrated;
                unset($settings['_css_classes']);
                $element['settings'] = $settings;
                $changed = true;
            }
            break;
        }
        unset($element);

        if (! $found) {
            return 'root_missing';
        }

        if ($changed && ! $document->save(['elements' => $elements])) {
            return 'save_failed';
        }

        update_post_meta($postId, self::VERSION_META, self::VERSION);

        // Only move the seed baseline when the v1 document was untouched.
        // If the client had already edited the document, preserve the old seed
        // hash so state() continues to report migrated_edited after this
        // surgical root-setting repair.
        if ($priorState === 'migrated_untouched') {
            $normalizedHash = self::currentHash($postId);
            if ($normalizedHash === '') {
                return 'reload_failed';
            }
            update_post_meta($postId, self::HASH_META, $normalizedHash);
        }

        return 'ok';
    }

    private static function document(int $postId): object|false
    {
        if (! class_exists('\\Elementor\\Plugin')) {
            return false;
        }
        if (! isset(\Elementor\Plugin::$instance) || ! is_object(\Elementor\Plugin::$instance)) {
            return false;
        }
        $documents = \Elementor\Plugin::$instance->documents ?? null;
        if (! is_object($documents) || ! method_exists($documents, 'get')) {
            return false;
        }
        $document = $documents->get($postId, false);
        return is_object($document) ? $document : false;
    }

    private static function currentHash(int $postId): string
    {
        $document = self::document($postId);
        if (! is_object($document) || ! method_exists($document, 'get_elements_data')) {
            return '';
        }
        $elements = $document->get_elements_data();
        if (! is_array($elements)) {
            return '';
        }
        $encoded = function_exists('wp_json_encode')
            ? wp_json_encode($elements, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
            : json_encode($elements, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return is_string($encoded) ? hash('sha256', $encoded) : '';
    }
}
