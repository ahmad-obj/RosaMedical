# Rosa Medical WordPress Dynamic Catalogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Rosa Medical catalogue into a fully dynamic, client-maintainable WooCommerce catalogue organized by family, preserving accepted site visual language, quotation basket flows, Elementor authoring ownership, and bilingual RTL support.

**Architecture:** WooCommerce serves as canonical store (`product_cat` for families, `product` / `product_variation` for instruments and configurations, standard attributes for finish/direction/point/size). `rosa-medical-core` adds dedicated executive Rosa Admin UX for family and catalogue management with deep links to WooCommerce, while `rosa-medical-child` dynamically renders family-wise sections with anchor navigation and PDF links.

**Tech Stack:** PHP 8.3, WordPress 6.x, WooCommerce 9.x, Elementor Free, MariaDB, Docker / WP-CLI, Vanilla JS / CSS, Node test runner.

**Spec:** [`docs/superpowers/specs/2026-09-26-rosa-wordpress-dynamic-catalogue-design.md`](file:///home/mmm/Projects/RosaMedical/docs/superpowers/specs/2026-09-26-rosa-wordpress-dynamic-catalogue-design.md)

## Global Constraints

- Canonical store must remain WooCommerce; no parallel catalogue tables or duplicate database truths.
- Five initial authoritative families: Scissors (order 1), Cutters (order 2), Punches (order 3), Chisels (order 4), Knives (order 5).
- Instrument pattern is one `WC_Product_Variable` (or `Simple`); configurations are `WC_Product_Variation` records with exact SKUs.
- Bilingual Arabic labels stored in term meta (`_rosa_name_ar`, `_rosa_description_ar`) without requiring WPML.
- Safe deletion: deleting a family must never delete its products.
- Public catalogue must render family-wise sections with compact anchor navigation; empty families must not render.
- Search must continue to work across all families.
- Quotation flow, Add to Quote, variation selection, and basket drawer must work seamlessly with real products.
- Elementor Free marketing page ownership and child theme visual contracts must be preserved.
- No retail prices, Add to Cart, checkout, payment, or shipping.

## Review Focus

1. Deleting a family when products are assigned leaves products safely available without post deletion.
2. A hidden family (`_rosa_family_visible = 0`) or an empty family does not render a public section or anchor link.
3. Bilingual label fallback: when Arabic display name is blank, it falls back cleanly to the English name.
4. Duplicate import protection: running migration multiple times does not duplicate products, variations, or media attachments.
5. Search with zero matches displays a localized empty state without crashing or leaking empty family headings.

---

### Task 1: Catalogue Families Data Model & Service

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyModel.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyService.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php:40-60`
- Test: `wordpress/scripts/tests/catalogue-families-model.test.php`

**Interfaces:**
- Consumes: WordPress taxonomy functions (`get_terms`, `get_term_by`, `wp_insert_term`, `wp_update_term`, `wp_delete_term`, `get_term_meta`, `update_term_meta`).
- Produces:
  - `FamilyModel` struct: `id`, `slug`, `name`, `nameAr`, `description`, `descriptionAr`, `order`, `visible`, `coverId`, `coverUrl`, `pdfId`, `pdfUrl`, `productCount`.
  - `FamilyService::getFamilies(bool $includeHidden = false, string $locale = 'en'): list<FamilyModel>`
  - `FamilyService::getFamily(int|string $identifier, string $locale = 'en'): ?FamilyModel`
  - `FamilyService::saveFamily(array $data): int|WP_Error`
  - `FamilyService::deleteFamily(int $termId, int $reassignTermId = 0): bool|WP_Error`

- [ ] **Step 1: Write the failing unit test for FamilyModel and FamilyService**

```php
<?php
// wordpress/scripts/tests/catalogue-families-model.test.php
declare(strict_types=1);

namespace RosaMedical\Tests;

// Mock environment and required WP functions for isolated testing
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyModel.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyService.php';

use RosaMedical\Core\Catalogue\FamilyModel;
use RosaMedical\Core\Catalogue\FamilyService;

// Test family instantiation and normalization
$model = new FamilyModel(
    id: 10,
    slug: 'scissors',
    name: 'Scissors',
    nameAr: 'المقصات',
    description: 'Surgical scissors',
    descriptionAr: 'مقصات جراحية',
    order: 1,
    visible: true,
    coverId: 101,
    coverUrl: 'http://example.com/scissors.svg',
    pdfId: 202,
    pdfUrl: 'http://example.com/scissors.pdf',
    productCount: 5
);

assert($model->getDisplayName('en') === 'Scissors');
assert($model->getDisplayName('ar') === 'المقصات');
assert($model->order === 1);
assert($model->visible === true);

echo "PASS: Catalogue FamilyModel contract\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php wordpress/scripts/tests/catalogue-families-model.test.php`
Expected: FAIL (class not found)

- [ ] **Step 3: Implement FamilyModel and FamilyService**

Implement `FamilyModel.php` holding properties and localization helpers, and `FamilyService.php` handling CRUD on `product_cat` and term meta (`_rosa_name_ar`, `_rosa_description_ar`, `_rosa_family_order`, `_rosa_family_visible`, `_rosa_family_pdf_id`, `thumbnail_id`). Include safe deletion: unassigning products or reassigning to `$reassignTermId`.

- [ ] **Step 4: Expand test and run to verify it passes**

Run: `php wordpress/scripts/tests/catalogue-families-model.test.php`
Expected: PASS: Catalogue FamilyModel contract

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyModel.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyService.php \
        wordpress/scripts/tests/catalogue-families-model.test.php
git commit -m "feat(catalogue): implement FamilyModel and FamilyService with term meta"
```

---

### Task 2: Rosa Admin UX — Catalogue Dashboard & Family Management

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/CatalogueDashboardPage.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/FamilyEditorPage.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php:14-75`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/assets/admin/rosa-content-admin.css`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/assets/admin/rosa-content-admin.js`
- Test: `wordpress/scripts/tests/catalogue-admin-ux.test.php`

**Interfaces:**
- Consumes: `FamilyService`, WordPress admin menus (`add_menu_page`, `add_submenu_page`), Media modal script/styles (`wp_enqueue_media`).
- Produces:
  - Admin menu structure:
    `ROSA` -> Overview
    `ROSA -> Catalogue` (Dashboard)
    `ROSA -> Catalogue -> Families`
    `ROSA -> Catalogue -> Products` -> links to `edit.php?post_type=product`
    `ROSA -> Catalogue -> Add Product` -> links to `post-new.php?post_type=product`
  - Dashboard UI: Family summary cards with cover thumbnail, EN/AR labels, product count, PDF status, visibility toggle, actions.
  - Family Editor UI: Clean form with Media Uploader integration for cover image and PDF catalogue, plus safe deletion modal.

- [ ] **Step 1: Write the failing unit test for Catalogue Admin UX**

```php
<?php
// wordpress/scripts/tests/catalogue-admin-ux.test.php
declare(strict_types=1);

// Test menu registration and URL construction
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/Capabilities.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php';
require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Admin/CatalogueDashboardPage.php';

use RosaMedical\Core\Admin\RosaAdmin;
use RosaMedical\Core\Admin\CatalogueDashboardPage;

assert(defined('RosaMedical\Core\Admin\RosaAdmin::ROOT_SLUG'));
echo "PASS: Catalogue Admin UX contract\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php wordpress/scripts/tests/catalogue-admin-ux.test.php`
Expected: FAIL (CatalogueDashboardPage not found)

- [ ] **Step 3: Implement CatalogueDashboardPage, FamilyEditorPage and update RosaAdmin**

1. Create `CatalogueDashboardPage.php` rendering family grid, counts, PDF links, and quick actions.
2. Create `FamilyEditorPage.php` handling save/update/delete POST actions with nonces and validation.
3. Update `RosaAdmin.php` registering the `Catalogue` menu and submenus (`Families`, `Products`, `Add Product`), enqueuing media scripts and styles.
4. Add CSS styles in `rosa-content-admin.css` and JS media picker handlers in `rosa-content-admin.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `php wordpress/scripts/tests/catalogue-admin-ux.test.php`
Expected: PASS: Catalogue Admin UX contract

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ \
        wordpress/wp-content/plugins/rosa-medical-core/assets/admin/ \
        wordpress/scripts/tests/catalogue-admin-ux.test.php
git commit -m "feat(admin): add Rosa catalogue dashboard and family management UX"
```

---

### Task 3: Automated Idempotent Catalogue Importer & Seeder

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/CatalogueImporter.php`
- Create: `wordpress/scripts/catalogue-seed.php`
- Create: `wordpress/scripts/catalogue-seed.sh`
- Test: `wordpress/scripts/tests/catalogue-import-idempotency.test.php`

**Interfaces:**
- Consumes: Canonical catalogue registry data from `apps/web/src/features/catalogue-registry/`, media from `apps/web/public/media/catalogue-preview/` and `catalogues/pdf/`.
- Produces:
  - WP-CLI executable import script.
  - Synchronized WooCommerce variable/simple products, attributes (`pa_finish`, `pa_direction`, `pa_point_style`, `pa_size`), variations with exact SKUs, and attached media.
  - Zero duplicate records on repeated execution.

- [ ] **Step 1: Write the failing unit test for CatalogueImporter**

```php
<?php
// wordpress/scripts/tests/catalogue-import-idempotency.test.php
declare(strict_types=1);

require_once __DIR__ . '/../../wp-content/plugins/rosa-medical-core/src/Catalogue/CatalogueImporter.php';

use RosaMedical\Core\Catalogue\CatalogueImporter;

$dataset = CatalogueImporter::getCanonicalDataset();
assert(count($dataset['families']) === 5, 'Must contain 5 canonical families');
assert(isset($dataset['families']['scissors']), 'Scissors family must exist');
assert(isset($dataset['families']['cutters']), 'Cutters family must exist');
assert(isset($dataset['families']['punches']), 'Punches family must exist');
assert(isset($dataset['families']['chisels']), 'Chisels family must exist');
assert(isset($dataset['families']['knives']), 'Knives family must exist');

echo "PASS: CatalogueImporter dataset contract\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php wordpress/scripts/tests/catalogue-import-idempotency.test.php`
Expected: FAIL (CatalogueImporter not found)

- [ ] **Step 3: Implement CatalogueImporter, catalogue-seed.php and catalogue-seed.sh**

1. Build `CatalogueImporter.php` containing canonical dataset definitions (5 families with EN/AR names, orders, PDF references, cover assets, and product configuration matrices with exact SKUs).
2. Implement idempotent upsert methods:
   - `ensureFamilies()`: Creates/updates 5 families, sets term meta, imports PDFs and covers.
   - `ensureProductMedia()`: Imports images with `_rosa_catalogue_source_path` meta to avoid duplicates.
   - `ensureProducts()`: Creates variable products, configures attributes, attaches variations by SKU, sets featured and variation images.
3. Build `wordpress/scripts/catalogue-seed.sh` wrapping `wp eval-file`.

- [ ] **Step 4: Run test to verify dataset contract**

Run: `php wordpress/scripts/tests/catalogue-import-idempotency.test.php`
Expected: PASS: CatalogueImporter dataset contract

- [ ] **Step 5: Run catalogue-seed.sh in local Docker and verify idempotency**

Run: `bash wordpress/scripts/catalogue-seed.sh`
Run: `bash wordpress/scripts/catalogue-seed.sh` (second run to verify zero duplicates)
Expected: Success message with count of seeded products and variations.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/CatalogueImporter.php \
        wordpress/scripts/catalogue-seed.php \
        wordpress/scripts/catalogue-seed.sh \
        wordpress/scripts/tests/catalogue-import-idempotency.test.php
git commit -m "feat(catalogue): implement idempotent catalogue importer and seed script"
```

---

### Task 4: Dynamic Public Catalogue & Shop Page

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-live-visual-recovery.css`
- Test: `wordpress/scripts/tests/catalogue-public-sections.test.php`

**Interfaces:**
- Consumes: `FamilyService::getFamilies()`, `product-card.php`, WooCommerce product query (`WP_Query`).
- Produces:
  - Sticky compact family navigation rail (`#family-{slug}`) with EN/AR labels.
  - Dynamic family-wise sections (`<section class="rosa-catalogue-family-section" id="family-{slug}">`) rendered in order.
  - Section header: localized family name, description, PDF catalogue download button (when available).
  - Product grid: products in that family rendered via `product-card.php`.
  - Search integration: displays matching products under family sections or clean empty state.
  - Zero hardcoded filler cards.

- [ ] **Step 1: Write the failing unit test for dynamic public catalogue sections**

```php
<?php
// wordpress/scripts/tests/catalogue-public-sections.test.php
declare(strict_types=1);

$shopPageFile = __DIR__ . '/../../wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php';
$content = file_get_contents($shopPageFile) ?: '';

// Must use dynamic families and family sections
assert(str_contains($content, 'rosa-catalogue-family-section'), 'Must contain dynamic family sections');
assert(str_contains($content, 'rosa-catalogue-anchor-nav'), 'Must contain anchor navigation rail');
assert(! str_contains($content, '$familySequence'), 'Must not contain hardcoded filler sequence');

echo "PASS: dynamic catalogue public sections contract\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php wordpress/scripts/tests/catalogue-public-sections.test.php`
Expected: FAIL (missing dynamic sections)

- [ ] **Step 3: Update shop-page.php and CSS**

1. Replace static `$families` array and filler loop in `shop-page.php` with:
   - Querying published, visible families via `FamilyService::getFamilies(false, $locale)`.
   - Querying products per family or querying all matching products and grouping by `product_cat`.
   - Rendering the compact sticky anchor bar with AR/EN labels.
   - Rendering each family section with header, PDF link, and product grid.
   - Clean search handling with localized empty state.
2. Add CSS in `shop-live-visual-recovery.css` for `.rosa-catalogue-anchor-nav` and `.rosa-catalogue-family-section`.

- [ ] **Step 4: Run test to verify it passes**

Run: `php wordpress/scripts/tests/catalogue-public-sections.test.php`
Expected: PASS: dynamic catalogue public sections contract

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/ \
        wordpress/scripts/tests/catalogue-public-sections.test.php
git commit -m "feat(shop): render dynamic family sections with anchor navigation and PDF links"
```

---

### Task 5: Dynamic Homepage Family Discovery

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php`
- Test: `wordpress/scripts/tests/latest-home-family-discovery.test.php`

**Interfaces:**
- Consumes: `FamilyService::getFamilies(false, $locale)`.
- Produces:
  - Homepage "Our range of products" gallery dynamically rendering published families in order.
  - Cover image: uses assigned attachment, falling back to theme asset.
  - Link: links to assigned PDF catalogue, falling back to `/shop/#family-{slug}`.

- [ ] **Step 1: Write the failing unit test for dynamic homepage discovery**

```php
<?php
// wordpress/scripts/tests/latest-home-family-discovery.test.php
declare(strict_types=1);

$discoveryFile = __DIR__ . '/../../wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php';
$content = file_get_contents($discoveryFile) ?: '';

assert(! str_contains($content, "['slug' => 'scissors', 'name' =>"), 'Must not hardcode families array');
assert(str_contains($content, 'FamilyService') || str_contains($content, 'rosa_get_catalogue_families'), 'Must use dynamic family query');

echo "PASS: dynamic homepage family discovery contract\n";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php wordpress/scripts/tests/latest-home-family-discovery.test.php`
Expected: FAIL (still has hardcoded array)

- [ ] **Step 3: Update latest-home-family-discovery.php**

Refactor `latest-home-family-discovery.php` to fetch published, visible families dynamically, resolving cover images from term meta (or fallback SVG) and PDF URLs from term meta.

- [ ] **Step 4: Run test to verify it passes**

Run: `php wordpress/scripts/tests/latest-home-family-discovery.test.php`
Expected: PASS: dynamic homepage family discovery contract

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php \
        wordpress/scripts/tests/latest-home-family-discovery.test.php
git commit -m "feat(home): dynamically render homepage catalogue family discovery gallery"
```

---

### Task 6: Visual Contracts, Integration & E2E Verification

**Files:**
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Test: `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- Test: `wordpress/scripts/tests/shop-client-directive.test.php`

**Interfaces:**
- Consumes: Running WordPress runtime at `http://localhost:8088/`.
- Produces:
  - Complete verification of dynamic families, products, variations, quotation flow, and visual stability across viewports (1440px, 1024px, 768px, 390px) in EN and AR.

- [ ] **Step 1: Run focused unit and contract test suite**

Run: `php wordpress/scripts/tests/catalogue-families-model.test.php`
Run: `php wordpress/scripts/tests/catalogue-admin-ux.test.php`
Run: `php wordpress/scripts/tests/catalogue-import-idempotency.test.php`
Run: `php wordpress/scripts/tests/catalogue-public-sections.test.php`
Run: `php wordpress/scripts/tests/latest-home-family-discovery.test.php`
Run: `php wordpress/scripts/tests/shop-client-directive.test.php`
Run: `php wordpress/scripts/tests/catalogue-card-navigation-only.test.php`

- [ ] **Step 2: Run seed and verify WooCommerce database records**

Run: `bash wordpress/scripts/catalogue-seed.sh`
Verify: Check `wp term list product_cat`, `wp post list --post_type=product`, and variations.

- [ ] **Step 3: Test live admin workflow end-to-end**

Create a disposable test family via WP-CLI / Admin:
- Add test family `Forceps`.
- Assign disposable product to it.
- Verify public `/shop/` displays `Forceps` section.
- Reassign product and delete disposable family safely.
- Verify public `/shop/` no longer displays `Forceps` section and product remains safe.

- [ ] **Step 4: Run full client preview runtime verification**

Run: `bash wordpress/scripts/client-preview-runtime-verify.sh`

- [ ] **Step 5: Browser visual inspection and screenshot captures**

Capture screenshots of `/shop/`, `/ar/shop/`, and representative Product Detail in EN and AR at 1440px, 1024px, and 390px. Verify no horizontal overflow, zero broken images, and intact typography.

- [ ] **Step 6: Commit all verified changes**

```bash
git add wordpress/ README.md docs/
git commit -m "test(catalogue): verify dynamic catalogue end-to-end with visual checks"
```
