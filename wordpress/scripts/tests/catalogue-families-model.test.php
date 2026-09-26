<?php

declare(strict_types=1);

namespace {
    if (! defined('ABSPATH')) {
        define('ABSPATH', __DIR__ . '/../../');
    }

    $GLOBALS['mock_terms'] = [];
    $GLOBALS['mock_term_meta'] = [];
    $GLOBALS['mock_post_terms'] = [];
    $GLOBALS['mock_posts'] = [];
    $GLOBALS['mock_attachments'] = [];

function get_terms(array $args = []): array {
    $taxonomy = $args['taxonomy'] ?? 'product_cat';
    $results = [];
    foreach ($GLOBALS['mock_terms'] as $term) {
        if (($term['taxonomy'] ?? '') === $taxonomy) {
            $termObj = (object) $term;
            $results[] = $termObj;
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

function wp_insert_term(string $name, string $taxonomy, array $args = []): array|object {
    $slug = $args['slug'] ?? sanitize_title($name);
    foreach ($GLOBALS['mock_terms'] as $term) {
        if ($term['taxonomy'] === $taxonomy && ($term['slug'] === $slug || $term['name'] === $name)) {
            return (object) ['error' => 'term_exists', 'term_id' => $term['term_id']];
        }
    }
    $id = count($GLOBALS['mock_terms']) + 1;
    $record = [
        'term_id' => $id,
        'term_taxonomy_id' => $id,
        'name' => $name,
        'slug' => $slug,
        'description' => $args['description'] ?? '',
        'parent' => $args['parent'] ?? 0,
        'count' => 0,
        'taxonomy' => $taxonomy,
    ];
    $GLOBALS['mock_terms'][$id] = $record;
    return ['term_id' => $id, 'term_taxonomy_id' => $id];
}

function wp_update_term(int $termId, string $taxonomy, array $args = []): array|object {
    if (! isset($GLOBALS['mock_terms'][$termId])) {
        return (object) ['error' => 'not_found'];
    }
    if (isset($args['name'])) {
        $GLOBALS['mock_terms'][$termId]['name'] = $args['name'];
    }
    if (isset($args['slug'])) {
        $GLOBALS['mock_terms'][$termId]['slug'] = $args['slug'];
    }
    if (isset($args['description'])) {
        $GLOBALS['mock_terms'][$termId]['description'] = $args['description'];
    }
    return ['term_id' => $termId, 'term_taxonomy_id' => $termId];
}

function wp_delete_term(int $termId, string $taxonomy): bool {
    if (isset($GLOBALS['mock_terms'][$termId])) {
        unset($GLOBALS['mock_terms'][$termId]);
        unset($GLOBALS['mock_term_meta'][$termId]);
        return true;
    }
    return false;
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

function delete_term_meta(int $termId, string $key): bool {
    unset($GLOBALS['mock_term_meta'][$termId][$key]);
    return true;
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

function wp_get_attachment_url(int $id): string|false {
    return $GLOBALS['mock_attachments'][$id] ?? false;
}

function is_wp_error(mixed $thing): bool {
    return is_object($thing) && property_exists($thing, 'error');
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

function wp_remove_object_terms(int $objectId, int|array $terms, string $taxonomy): bool {
    $terms = (array) $terms;
    if (isset($GLOBALS['mock_post_terms'][$objectId])) {
        $GLOBALS['mock_post_terms'][$objectId] = array_values(array_diff($GLOBALS['mock_post_terms'][$objectId], $terms));
    }
    return true;
}

function wp_set_object_terms(int $objectId, int|array $terms, string $taxonomy, bool $append = false): array|bool {
    $terms = (array) $terms;
    if ($append && isset($GLOBALS['mock_post_terms'][$objectId])) {
        $GLOBALS['mock_post_terms'][$objectId] = array_values(array_unique(array_merge($GLOBALS['mock_post_terms'][$objectId], $terms)));
    } else {
        $GLOBALS['mock_post_terms'][$objectId] = $terms;
    }
    return true;
}

// Load classes under test
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyModel.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyService.php';

use RosaMedical\Core\Catalogue\FamilyModel;
use RosaMedical\Core\Catalogue\FamilyService;

// 1. Test Model construction & localization fallbacks
$model = new FamilyModel(
    id: 1,
    slug: 'scissors',
    name: 'Scissors',
    nameAr: 'المقصات',
    description: 'Surgical scissors description',
    descriptionAr: 'وصف المقصات الجراحية',
    order: 1,
    visible: true,
    coverId: 101,
    coverUrl: 'http://example.com/scissors.svg',
    pdfId: 201,
    pdfUrl: 'http://example.com/scissors.pdf',
    productCount: 5
);

assert($model->getDisplayName('en') === 'Scissors', 'Model EN name must match');
assert($model->getDisplayName('ar') === 'المقصات', 'Model AR name must match');
assert($model->getDescription('en') === 'Surgical scissors description', 'Model EN description must match');
assert($model->getDescription('ar') === 'وصف المقصات الجراحية', 'Model AR description must match');
assert($model->order === 1, 'Model order must be 1');
assert($model->visible === true, 'Model visible must be true');

// Test Model fallback when Arabic is empty
$modelFallback = new FamilyModel(
    id: 2,
    slug: 'cutters',
    name: 'Cutters',
    nameAr: '',
    description: 'Bone cutters',
    descriptionAr: '',
    order: 2,
    visible: true,
    coverId: 0,
    coverUrl: '',
    pdfId: 0,
    pdfUrl: '',
    productCount: 0
);
assert($modelFallback->getDisplayName('ar') === 'Cutters', 'Model AR name must fall back to EN');
assert($modelFallback->getDescription('ar') === 'Bone cutters', 'Model AR description must fall back to EN');

// 2. Test FamilyService CRUD
$service = new FamilyService();

// Create Family
$createResult = $service->saveFamily([
    'name' => 'Punches',
    'name_ar' => 'المثاقب',
    'slug' => 'punches',
    'description' => 'Surgical punches',
    'description_ar' => 'مثاقب جراحية',
    'order' => 3,
    'visible' => 1,
    'cover_id' => 105,
    'pdf_id' => 205,
]);

assert(is_int($createResult) && $createResult > 0, 'Family creation must succeed with integer term ID');
$familyId = $createResult;

// Retrieve Family
$retrieved = $service->getFamily($familyId);
assert($retrieved instanceof FamilyModel, 'getFamily must return FamilyModel');
assert($retrieved->slug === 'punches', 'Retrieved slug must match');
assert($retrieved->nameAr === 'المثاقب', 'Retrieved nameAr must match');
assert($retrieved->order === 3, 'Retrieved order must match');
assert($retrieved->visible === true, 'Retrieved visible must match');
assert($retrieved->coverId === 105, 'Retrieved coverId must match');
assert($retrieved->pdfId === 205, 'Retrieved pdfId must match');

// Update Family
$updateResult = $service->saveFamily([
    'id' => $familyId,
    'name' => 'Punches & Forceps',
    'name_ar' => 'المثاقب والملاقط',
    'order' => 10,
    'visible' => 0,
]);
assert($updateResult === $familyId, 'Update must return term ID');

$updated = $service->getFamily('punches');
assert($updated instanceof FamilyModel, 'getFamily by slug must return FamilyModel');
assert($updated->name === 'Punches & Forceps', 'Updated name must match');
assert($updated->nameAr === 'المثاقب والملاقط', 'Updated nameAr must match');
assert($updated->order === 10, 'Updated order must match');
assert($updated->visible === false, 'Updated visible must be false');

// Visibility filtering: getFamilies()
$visibleFamilies = $service->getFamilies(includeHidden: false);
assert(count($visibleFamilies) === 0, 'Hidden family must not appear when includeHidden=false');

$allFamilies = $service->getFamilies(includeHidden: true);
assert(count($allFamilies) === 1, 'Hidden family must appear when includeHidden=true');

// 3. Test Safe Deletion
// Assign a mock product post to this family
$GLOBALS['mock_post_terms'][999] = [$familyId];

// Delete without reassignment: products remain intact, only term association removed
$deleted = $service->deleteFamily($familyId, 0);
assert($deleted === true, 'deleteFamily must succeed');
assert(! in_array($familyId, $GLOBALS['mock_post_terms'][999] ?? [], true), 'Term must be unassigned from product');
assert($service->getFamily($familyId) === null, 'Family must no longer exist');

echo "PASS: Catalogue FamilyModel and FamilyService contract\n";
}
