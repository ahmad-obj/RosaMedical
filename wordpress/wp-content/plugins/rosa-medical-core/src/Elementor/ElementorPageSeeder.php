<?php

declare(strict_types=1);

namespace RosaMedical\Core\Elementor;

final class ElementorPageSeeder
{
    public const VERSION_META = '_rosa_elementor_authoring_version';
    public const HASH_META = '_rosa_elementor_seed_hash';
    public const VERSION = '1';
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

        $elements = ElementorSeedData::build($pageType, $locale);
        if ($elements === []) {
            return ['status' => 'invalid_page_type', 'post_id' => $postId];
        }

        $state = self::state($postId);
        if (! $force && $state !== 'never_migrated') {
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

        return [
            'status' => $force ? 'seeded_forced' : 'seeded',
            'post_id' => $postId,
        ];
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
