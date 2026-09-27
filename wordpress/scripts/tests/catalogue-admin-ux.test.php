<?php

declare(strict_types=1);

namespace {
    if (! defined('ABSPATH')) {
        define('ABSPATH', __DIR__ . '/../../');
    }
    if (! defined('ROSA_MEDICAL_CORE_FILE')) {
        define('ROSA_MEDICAL_CORE_FILE', __DIR__ . '/../../wp-content/plugins/rosa-medical-core/rosa-medical-core.php');
    }

    $GLOBALS['mock_menu_pages'] = [];
    $GLOBALS['mock_submenu_pages'] = [];
    $GLOBALS['mock_terms'] = [];
    $GLOBALS['mock_term_meta'] = [];
    $GLOBALS['mock_post_terms'] = [];
    $GLOBALS['mock_posts'] = [];
    $GLOBALS['mock_attachments'] = [];

    function add_menu_page(string $page_title, string $menu_title, string $capability, string $menu_slug, ?callable $callback = null, string $icon_url = '', ?int $position = null): string {
        $GLOBALS['mock_menu_pages'][] = [
            'page_title' => $page_title,
            'menu_title' => $menu_title,
            'capability' => $capability,
            'menu_slug' => $menu_slug,
            'callback' => $callback,
            'icon_url' => $icon_url,
            'position' => $position,
        ];
        return $menu_slug;
    }

    function add_submenu_page(?string $parent_slug, string $page_title, string $menu_title, string $capability, string $menu_slug, ?callable $callback = null, ?int $position = null): string|false {
        $GLOBALS['mock_submenu_pages'][] = [
            'parent_slug' => $parent_slug,
            'page_title' => $page_title,
            'menu_title' => $menu_title,
            'capability' => $capability,
            'menu_slug' => $menu_slug,
            'callback' => $callback,
            'position' => $position,
        ];
        return $menu_slug;
    }

    function __(string $text, string $domain = 'default'): string {
        return $text;
    }

    function _e(string $text, string $domain = 'default'): void {
        echo $text;
    }

    function esc_html(string $text): string {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    function esc_html_e(string $text, string $domain = 'default'): void {
        echo htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    function esc_attr(string $text): string {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    function esc_attr_e(string $text, string $domain = 'default'): void {
        echo htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    function esc_textarea(string $text): string {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }

    function checked(mixed $checked, mixed $current = true, bool $echo = true): string {
        $result = ((string) $checked === (string) $current) ? " checked='checked'" : '';
        if ($echo) {
            echo $result;
        }
        return $result;
    }

    function esc_url(string $url): string {
        return $url;
    }

    function admin_url(string $path = ''): string {
        return 'http://example.com/wp-admin/' . ltrim($path, '/');
    }

    function home_url(string $path = ''): string {
        return 'http://example.com/' . ltrim($path, '/');
    }

    function wp_create_nonce(string $action): string {
        return 'mock_nonce_' . $action;
    }

    function wp_verify_nonce(string $nonce, string $action): bool {
        return $nonce === 'mock_nonce_' . $action;
    }

    function current_user_can(string $capability): bool {
        return true;
    }

    function get_terms(array $args = []): array {
        $taxonomy = $args['taxonomy'] ?? 'product_cat';
        $results = [];
        foreach ($GLOBALS['mock_terms'] as $term) {
            if (($term['taxonomy'] ?? '') === $taxonomy) {
                $results[] = (object) $term;
            }
        }
        return $results;
    }

    function get_term_by(string $field, string|int $value, string $taxonomy = 'product_cat'): object|false {
        foreach ($GLOBALS['mock_terms'] as $term) {
            if (($term['taxonomy'] ?? '') !== $taxonomy) {
                continue;
            }
            if ($field === 'id' && (int) $term['term_id'] === (int) $value) {
                return (object) $term;
            }
            if ($field === 'slug' && (string) $term['slug'] === (string) $value) {
                return (object) $term;
            }
        }
        return false;
    }

    function get_term(int $termId, string $taxonomy = 'product_cat'): object|false {
        return get_term_by('id', $termId, $taxonomy);
    }

    function get_term_meta(int $termId, string $key = '', bool $single = false): mixed {
        if ($key === '') {
            return $GLOBALS['mock_term_meta'][$termId] ?? [];
        }
        $val = $GLOBALS['mock_term_meta'][$termId][$key] ?? null;
        if ($single) {
            return $val !== null ? $val : '';
        }
        return $val !== null ? [$val] : [];
    }

    function update_term_meta(int $termId, string $key, mixed $value): bool {
        $GLOBALS['mock_term_meta'][$termId][$key] = $value;
        return true;
    }

    function wp_get_attachment_url(int $id): string|false {
        return $GLOBALS['mock_attachments'][$id] ?? false;
    }

    function wp_get_attachment_image_url(int $id, string $size = 'thumbnail'): string|false {
        return $GLOBALS['mock_attachments'][$id] ?? false;
    }

    function sanitize_title(string $title): string {
        return strtolower(trim(preg_replace('/[^a-zA-Z0-9_-]+/', '-', $title), '-'));
    }

    function sanitize_text_field(string $str): string {
        return trim(strip_tags($str));
    }

    function wp_kses_post(string $str): string {
        return $str;
    }

    function is_wp_error(mixed $thing): bool {
        return is_object($thing) && property_exists($thing, 'error');
    }

    function wp_die(string $message): void {
        throw new \RuntimeException($message);
    }

    function get_objects_in_term(int|array $termIds, string $taxonomy): array {
        $termIds = (array) $termIds;
        $objects = [];
        foreach ($GLOBALS['mock_post_terms'] as $postId => $terms) {
            foreach ($termIds as $tid) {
                if (in_array($tid, $terms, true)) {
                    $objects[] = $postId;
                    break;
                }
            }
        }
        return array_unique($objects);
    }

    function wp_set_object_terms(int $objectId, array|int|string $terms, string $taxonomy, bool $append = false): array {
        if (! isset($GLOBALS['mock_post_terms'][$objectId])) {
            $GLOBALS['mock_post_terms'][$objectId] = [];
        }
        $termArray = (array) $terms;
        if ($append) {
            $GLOBALS['mock_post_terms'][$objectId] = array_values(array_unique(array_merge($GLOBALS['mock_post_terms'][$objectId], $termArray)));
        } else {
            $GLOBALS['mock_post_terms'][$objectId] = $termArray;
        }
        return $termArray;
    }

    function wp_remove_object_terms(int $objectId, array|int|string $terms, string $taxonomy): bool {
        if (! isset($GLOBALS['mock_post_terms'][$objectId])) {
            return false;
        }
        $termsToRemove = (array) $terms;
        $GLOBALS['mock_post_terms'][$objectId] = array_values(array_diff($GLOBALS['mock_post_terms'][$objectId], $termsToRemove));
        return true;
    }

    function wp_enqueue_media(): void {}
    function wp_enqueue_style(string $handle, string $src = '', array $deps = [], string|bool|null $ver = false, string $media = 'all'): void {}
    function wp_enqueue_script(string $handle, string $src = '', array $deps = [], string|bool|null $ver = false, bool $in_footer = false): void {}
    function wp_localize_script(string $handle, string $object_name, array $l10n): bool { return true; }
    function plugins_url(string $path = '', string $plugin = ''): string {
        return 'http://example.com/wp-content/plugins/rosa-medical-core/' . ltrim($path, '/');
    }
}

namespace RosaMedical\Tests {
    // Load test targets
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/Capabilities.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyModel.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyService.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/CatalogueDashboardPage.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/FamilyEditorPage.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/ProductTemplatePage.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/ContentPage.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Settings/BusinessSettings.php';
    require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php';

    use RosaMedical\Core\Admin\RosaAdmin;
    use RosaMedical\Core\Admin\CatalogueDashboardPage;
    use RosaMedical\Core\Admin\FamilyEditorPage;

    // 1. Verify RosaAdmin registration registers Catalogue submenus
    RosaAdmin::register();

    $parentSlugs = array_column($GLOBALS['mock_menu_pages'], 'menu_slug');
    assert(in_array('rosa-medical', $parentSlugs, true), 'ROSA root menu must exist');

    $subSlugs = array_column($GLOBALS['mock_submenu_pages'], 'menu_slug');
    assert(in_array('rosa-medical-catalogue', $subSlugs, true), 'Catalogue dashboard submenu must be registered');
    assert(in_array('rosa-medical-families', $subSlugs, true), 'Families submenu must be registered');
    assert(in_array('edit.php?post_type=product', $subSlugs, true), 'Products deep link submenu must be registered');
    assert(in_array('post-new.php?post_type=product', $subSlugs, true), 'Add Product deep link submenu must be registered');

    // 2. Verify CatalogueDashboardPage renders HTML with metrics and family table
    ob_start();
    CatalogueDashboardPage::render();
    $dashboardHtml = ob_get_clean();

    assert(str_contains($dashboardHtml, 'Catalogue Overview') || str_contains($dashboardHtml, 'Catalogue Dashboard') || str_contains($dashboardHtml, 'Rosa Catalogue'), 'Dashboard title must render');
    assert(str_contains($dashboardHtml, 'Families') || str_contains($dashboardHtml, 'families'), 'Families section must render');

    // 3. Verify FamilyEditorPage renders form
    ob_start();
    FamilyEditorPage::render(0);
    $editorHtml = ob_get_clean();

    assert(str_contains($editorHtml, 'Add New Family') || str_contains($editorHtml, 'Family Details'), 'Editor title must render');
    assert(str_contains($editorHtml, 'name="name"'), 'Family name input must exist');
    assert(str_contains($editorHtml, 'name="name_ar"'), 'Family Arabic name input must exist');
    assert(str_contains($editorHtml, 'data-rosa-media-picker="image"'), 'Cover image picker trigger must exist');
    assert(str_contains($editorHtml, 'data-rosa-media-picker="pdf"'), 'PDF catalogue picker trigger must exist');

    // The selected destructive-action mode, not a hidden select value, controls
    // whether products move to another family. A stale select value must never
    // override the owner choosing “leave unassigned”.
    $deleteModeCases = [
        ['none', 77, 12, 0, 'Leave-unassigned mode must ignore a submitted reassign term ID'],
        ['reassign', 77, 12, 77, 'Reassign mode must retain the selected different target family'],
        ['reassign', 12, 12, 0, 'A family cannot be reassigned to itself during deletion'],
    ];
    foreach ($deleteModeCases as [$mode, $candidate, $target, $expected, $message]) {
        if (FamilyEditorPage::resolveReassignmentId($mode, $candidate, $target) !== $expected) {
            fwrite(STDERR, "Assertion failed: {$message}\n");
            exit(1);
        }
    }

    echo "PASS: Catalogue Admin UX contract\n";
}
