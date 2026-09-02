# Rosa WordPress Elementor Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the six Rosa Home/About/Contact EN/AR pages into genuine Elementor Free documents while preserving the verified MedicaShop-faithful public design, protected Rosa shell, WooCommerce behavior, shared settings, RTL behavior, and rollback path.

**Architecture:** Rosa Medical Core owns the Elementor integration, widget registration, seed/migration builder, and admin shortcuts. The child theme remains the visual renderer: existing section markup is refactored into argument-driven template parts, a protected Elementor page-shell template renders `the_content()` between the existing Rosa header/footer and shared CTA, and Rosa Elementor widgets feed editable settings into those same theme parts. Migration seeds deterministic Elementor documents through Elementor's document API under an administrator-capable WP-CLI identity, marks them with Rosa migration metadata derived from Elementor's reloaded normalized data, and never overwrites a migrated page unless an explicit force operation is invoked.

**Tech Stack:** WordPress, PHP 8+, Elementor Free, WooCommerce, WP-CLI, Bash, Playwright/Node, existing Rosa child theme CSS/JS and Docker foundation.

**Spec:** `docs/superpowers/specs/2026-09-02-rosa-wordpress-elementor-authoring-design.md`

## Global Constraints

- Elementor Pro is not required and must not be referenced.
- Elementor owns only the body of English/Arabic Home, About, and Contact.
- Rosa theme keeps header, footer, navigation, language pairing, shared CTA, responsive foundations, and RTL foundations.
- `Site & CTA`, `Business`, and `Shop` remain authoritative Rosa admin settings.
- WooCommerce remains authoritative for product/catalogue data.
- Existing structured Home/About/Contact options remain migration/rollback data; there is no two-way sync after cutover.
- No routine bootstrap/seed command may overwrite client-edited Elementor content.
- Current Contact behavior remains contact details + form-like fields + `mailto:` action; do not add a submission backend in this phase.
- Untouched migrated pages must continue to pass the existing accessibility, RTL, responsive-overflow, console, catalogue, and Homepage measured-geometry gates.
- Legacy code-rendered page templates remain available for rollback until the Elementor cutover is fully accepted.
- Elementor widget registration uses the documented `elementor/widgets/register` hook; custom category registration uses `elementor/elements/categories_registered`.
- Elementor documents are saved through `\Elementor\Plugin::$instance->documents->get($postId)->save(['elements' => ...])`; WordPress page-template assignment remains explicit through `_wp_page_template`.

---

## File Structure

### Plugin integration

- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorIntegration.php` — Elementor lifecycle boundary; safe when Elementor is absent.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php` — Rosa widget category + widget registration.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AbstractRosaSectionWidget.php` — shared widget identity, page-locale resolution, content/media controls, and theme-part rendering.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php` — nine Home section widgets.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php` — seven About section widgets.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php` — three Contact section widgets.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php` — deterministic section-to-widget settings mapping from Rosa structured settings/media.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php` — six-page document seeding, migration-state detection, Elementor document save API, normalized seed hashes, and idempotency.
- Modify `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php` — load only Elementor-safe integration/seeder classes at plugin bootstrap; widget classes are loaded lazily after Elementor initializes.
- Modify `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php` — register Elementor integration without changing product-template behavior.
- Modify `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php` — replace Home/About/Contact content forms with Elementor shortcuts after cutover.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php` — resolve English target pages and render safe Elementor edit shortcuts/fallback notices.

### Theme rendering

- Modify `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php` — add argument-first section content/media helpers.
- Create `wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php` — protected Rosa shell + Elementor body + shared CTA.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-featured.php` — extract current inline Featured Products + benefits markup.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-latest.php` — extract current inline Latest Products markup.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php` — shared About/Contact page hero renderer.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-stats.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-feature.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-why.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-layout.php`.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-map.php`.
- Modify `client-preview-home.php`, `client-preview-about.php`, and `client-preview-contact.php` to render those same parts with no explicit Elementor overrides; these remain the rollback/zero-drift path.
- Modify `hero.php`, `home-who.php`, `home-feature.php`, `home-promos.php`, `home-why.php`, `home-proof.php`, `home-evidence.php`, and `media-slot.php` so each accepts explicit widget arguments before falling back to current Rosa settings/media.
- Create `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css` — neutralize only Elementor's authoring wrappers/root container so the existing Rosa section CSS remains authoritative.
- Modify `wordpress/wp-content/themes/rosa-medical-child/functions.php` — enqueue `elementor-authoring.css` only on pages assigned `page-templates/rosa-elementor-authoring.php`, after `rosa-client-preview` and before RTL overrides.

### Migration/runtime tooling

- Create `wordpress/scripts/elementor-authoring-seed.sh` — explicit migration command; never called by routine `client-preview-seed.sh`.
- Create `wordpress/scripts/tests/elementor-authoring-integration.test.php`.
- Create `wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh`.
- Create `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php`.
- Create `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`.
- Create `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`.
- Create `wordpress/scripts/tests/elementor-authoring-editor-links.test.sh`.
- Modify `wordpress/scripts/client-preview-runtime-verify.sh` to include the new contracts/runtime gates after the cutover task is complete.
- Update `docs/runbooks/wordpress-client-content-controls.md` with the final Elementor editing workflow and rollback command.

---

### Task 1: Add the Elementor-safe plugin lifecycle boundary

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorIntegration.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php`
- Test: `wordpress/scripts/tests/elementor-authoring-integration.test.php`

**Interfaces:**
- Produces: `RosaMedical\Core\Elementor\ElementorIntegration::register(): void`
- Produces: `RosaMedical\Core\Elementor\ElementorIntegration::isAvailable(): bool`
- Produces: `RosaMedical\Core\Elementor\WidgetRegistry::registerCategory(object $elementsManager): void`
- Produces: `RosaMedical\Core\Elementor\WidgetRegistry::registerWidgets(object $widgetsManager): void`

- [ ] **Step 1: Write the failing integration test**

Create a pure-PHP test with WordPress hook stubs. It must assert that loading Rosa Core without defining `\Elementor\Plugin` or `\Elementor\Widget_Base` does not fatal, and that `ElementorIntegration::register()` registers only lifecycle callbacks rather than eagerly requiring widget subclasses.

Expected assertions:

```php
assert(ElementorIntegration::isAvailable() === false);
ElementorIntegration::register();
assert(isset($GLOBALS['rosa_test_actions']['elementor/init']));
```

Stub an Elementor-present case and assert `WidgetRegistry::registerCategory()` calls:

```php
$manager->add_category('rosa-medical', [
    'title' => 'Rosa Medical',
    'icon' => 'eicon-site-identity',
]);
```

- [ ] **Step 2: Run the test and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

Expected: FAIL because the Elementor integration classes do not exist.

- [ ] **Step 3: Implement the lifecycle boundary**

```php
public static function register(): void
{
    add_action('elementor/init', [self::class, 'boot']);
}

public static function boot(): void
{
    add_action('elementor/elements/categories_registered', [WidgetRegistry::class, 'registerCategory']);
    add_action('elementor/widgets/register', [WidgetRegistry::class, 'registerWidgets']);
}

public static function isAvailable(): bool
{
    return class_exists('\\Elementor\\Plugin');
}
```

`WidgetRegistry::registerWidgets()` must `require_once` the three widget-group files and abstract base only inside the Elementor callback, then call `$widgetsManager->register(new ...Widget())`. Do not require files extending `Widget_Base` from `rosa-medical-core.php`.

Wire `ElementorIntegration::register()` from `Plugin::register()` without touching the existing Woo product template filter.

- [ ] **Step 4: Run focused verification**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorIntegration.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php
```

Expected: PASS / no syntax errors.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core wordpress/scripts/tests/elementor-authoring-integration.test.php
git commit -m "feat(wordpress): add safe Elementor integration boundary"
```

---

### Task 2: Refactor verified page markup into argument-driven theme sections

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php`
- Create/modify the theme parts listed in **Theme rendering** above.
- Test: `wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh`
- Reuse: existing zero-drift, accessibility, RTL and Homepage geometry tests.

**Interfaces:**
- Produces: `rosa_preview_section_value(array $args, string $section, string $key, string $locale, string $fallback): string`
- Produces: `rosa_preview_section_media_id(array $args, string $settingKey, string $legacySlot): int`
- Consumes later: every Elementor widget passes `['locale' => ..., 'content' => [...], 'media' => [...]]` to the same theme parts.

- [ ] **Step 1: Write a source contract before refactoring**

Require these exact template-part transitions:

```text
client-preview-home.php -> home-featured.php + home-latest.php
client-preview-about.php -> page-hero.php + about-who/stats/cards/feature/why/proof.php
client-preview-contact.php -> page-hero.php + contact-layout.php + contact-map.php
```

Reject direct Elementor references inside the three legacy templates.

- [ ] **Step 2: Capture current baseline HTML before extraction**

```bash
mkdir -p /tmp/rosa-elementor-baseline
curl -fsSL http://localhost:8088/ > /tmp/rosa-elementor-baseline/home.html
curl -fsSL http://localhost:8088/about/ > /tmp/rosa-elementor-baseline/about.html
curl -fsSL http://localhost:8088/contact/ > /tmp/rosa-elementor-baseline/contact.html
curl -fsSL http://localhost:8088/ar/ > /tmp/rosa-elementor-baseline/ar-home.html
curl -fsSL http://localhost:8088/ar/about/ > /tmp/rosa-elementor-baseline/ar-about.html
curl -fsSL http://localhost:8088/ar/contact/ > /tmp/rosa-elementor-baseline/ar-contact.html
```

- [ ] **Step 3: Add argument-first helpers**

```php
function rosa_preview_section_value(array $args, string $section, string $key, string $locale, string $fallback): string
{
    $content = isset($args['content']) && is_array($args['content']) ? $args['content'] : [];
    if (array_key_exists($key, $content) && is_scalar($content[$key])) {
        return (string) $content[$key];
    }
    return rosa_preview_content($section, $key, $locale, $fallback);
}

function rosa_preview_section_media_id(array $args, string $settingKey, string $legacySlot): int
{
    $media = isset($args['media']) && is_array($args['media']) ? $args['media'] : [];
    $value = $media[$settingKey] ?? null;
    if (is_array($value) && isset($value['id'])) {
        return max(0, (int) $value['id']);
    }
    if (is_scalar($value)) {
        return max(0, (int) $value);
    }
    return rosa_preview_media_id($legacySlot);
}
```

- [ ] **Step 4: Extract the inline Home/About/Contact markup into focused parts**

Do not redesign markup. Legacy templates call the new parts in exactly the current section order. Each part reads `$args['locale']`, then uses `rosa_preview_section_value()` for editable copy. Fixed product query limits stay `featured=4` and `latest=10`. Shared Business values continue to come from existing business helpers, never from Elementor content arguments.

Update the listed existing Home partials to use the same argument-first helpers and explicit media keys.

- [ ] **Step 5: Verify legacy output remains unchanged before Elementor cutover**

```bash
bash wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
```

Re-fetch the six target pages and compare visible text/section markers to `/tmp/rosa-elementor-baseline`. Exact HTML may differ only in insignificant PHP whitespace introduced by extraction; geometry and visible content must remain unchanged.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
git commit -m "refactor(wordpress): expose verified Rosa sections for Elementor"
```

---

### Task 3: Implement the reusable Rosa Elementor widget base and Home widgets

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AbstractRosaSectionWidget.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php`
- Test: `wordpress/scripts/tests/elementor-authoring-integration.test.php`

**Interfaces:**
- Produces widget names: `rosa-home-hero`, `rosa-home-who`, `rosa-home-featured`, `rosa-home-feature-banner`, `rosa-home-latest`, `rosa-home-promotions`, `rosa-home-why`, `rosa-home-proof`, `rosa-home-evidence`.
- Produces: `AbstractRosaSectionWidget::renderPart(string $part, array $args): void`
- Produces: `AbstractRosaSectionWidget::locale(): string`

- [ ] **Step 1: Extend the integration test with widget registration assertions**

Stub `\Elementor\Widget_Base`, `Controls_Manager`, `Repeater`, and a widgets manager. Assert the nine Home widget names register exactly once and all return `['rosa-medical']` from `get_categories()`.

- [ ] **Step 2: Run test and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

- [ ] **Step 3: Implement the base widget**

Provide these exact helpers:

```php
protected function addText(string $id, string $label, string $default = ''): void;
protected function addTextarea(string $id, string $label, string $default = ''): void;
protected function addMedia(string $id, string $label, int $defaultId = 0): void;
protected function locale(): string;
protected function renderPart(string $part, array $args): void;
```

`locale()` resolves the current document post ID in this order: `get_queried_object_id()`, `get_the_ID()`, then sanitized `$_GET['post']` only when present in wp-admin/editor context. It reads `ROSA_PREVIEW_LOCALE_META`; only exact `ar` returns Arabic, otherwise English.

`renderPart()` resolves `template-parts/client-preview/<part>.php` via `locate_template()`. If absent, render an escaped editor-facing notice instead of fatalling.

- [ ] **Step 4: Implement Home section widgets**

Expose only these settings:

```text
Home Hero: hero_eyebrow, hero_title, hero_body, hero_button, image
Home Who: who_eyebrow, who_title, who_body, who_button, 3 stat value/label pairs, image
Home Featured: featured_title, 3 benefit title/body pairs
Home Feature Banner: feature_eyebrow, feature_title, feature_body, feature_button, image
Home Latest: latest_title
Home Promotions: 4 promo title/body pairs + 4 images
Home Why: why_eyebrow, why_title, 3 card title/body pairs, image
Home Proof: existing six proof labels
Home Evidence: evidence/workflow eyebrow, title, body, 3 card title/body pairs, image
```

Do not expose product limits, route structure, global typography, CSS, spacing, breakpoints, or Woo queries.

- [ ] **Step 5: Run focused verification**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AbstractRosaSectionWidget.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php
```

Expected: PASS / no syntax errors.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor wordpress/scripts/tests/elementor-authoring-integration.test.php
git commit -m "feat(wordpress): add Rosa Home Elementor widgets"
```

---

### Task 4: Implement About and Contact widgets without moving shared/business logic into Elementor

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php`
- Test: `wordpress/scripts/tests/elementor-authoring-integration.test.php`

**Interfaces:**
- About widget names: `rosa-page-hero-about`, `rosa-about-who`, `rosa-about-stats`, `rosa-about-cards`, `rosa-about-feature`, `rosa-about-why`, `rosa-about-proof`.
- Contact widget names: `rosa-page-hero-contact`, `rosa-contact-layout`, `rosa-contact-map`.

- [ ] **Step 1: Add failing widget-control assertions**

Assert Contact widgets do **not** expose controls named `email`, `phone`, `address`, `address_ar`, `submit_endpoint`, or `form_action`. Assert About and Contact widget names register under `rosa-medical`.

- [ ] **Step 2: Run test and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

- [ ] **Step 3: Implement About widgets**

Map the current About schema exactly: page hero, Who copy/image, stats, three cards, feature copy/image, Why cards, proof labels. Keep current Shop/Contact route destinations code-owned in the theme parts rather than editable URL controls.

- [ ] **Step 4: Implement Contact widgets**

`rosa-contact-layout` exposes only `location_label`, `phone_label`, `email_label`, `form_title`, `field_name`, `field_phone`, `field_subject`, `field_message`, and `send_email`. Runtime address/phone/email values stay dynamic from Rosa Business settings.

`rosa-contact-map` exposes only `map_eyebrow` and `map_button`; the map query stays generated from the current English Business address exactly as today. No submission handler is introduced.

- [ ] **Step 5: Run focused tests**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

Expected: PASS, including rejection of duplicated Business controls.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor wordpress/scripts/tests/elementor-authoring-integration.test.php
git commit -m "feat(wordpress): add Rosa About and Contact Elementor widgets"
```

---

### Task 5: Build deterministic Elementor seed data and migration state

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Test: `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php`

**Interfaces:**
- Produces: `ElementorSeedData::build(string $pageType, string $locale): array`
- Produces: `ElementorSeedData::deterministicId(string $key): string`
- Produces: `ElementorPageSeeder::state(int $postId): string` returning `never_migrated`, `migrated_untouched`, or `migrated_edited`.
- Produces: `ElementorPageSeeder::seedPage(int $postId, string $pageType, string $locale, bool $force = false): array{status:string,post_id:int}`
- Produces meta `_rosa_elementor_authoring_version=1` and `_rosa_elementor_seed_hash=<sha256>`.

- [ ] **Step 1: Write seed-data tests first**

Stub `ContentSettings::get()`, media lookups, post meta, and Elementor document access. Require:

```php
assert(ElementorSeedData::deterministicId('home-en-root') === substr(md5('rosa:home-en-root'), 0, 8));
```

Require Home order to be the nine Home widgets; About seven; Contact three. Arabic builds use Arabic structured values/media mappings. Business values must never appear inside Elementor widget settings.

- [ ] **Step 2: Run and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

- [ ] **Step 3: Implement the Elementor data builder**

Build one neutral root container:

```php
[
    'id' => self::deterministicId("{$pageType}-{$locale}-root"),
    'elType' => 'container',
    'isInner' => false,
    'settings' => [
        '_css_classes' => 'rosa-elementor-root',
        'content_width' => 'full',
        'gap' => ['unit' => 'px', 'size' => 0, 'sizes' => []],
        'padding' => ['unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true],
    ],
    'elements' => [/* deterministic Rosa widget elements */],
]
```

Widget elements:

```php
[
    'id' => self::deterministicId($instanceKey),
    'elType' => 'widget',
    'widgetType' => $widgetName,
    'isInner' => false,
    'settings' => $settings,
    'elements' => [],
]
```

- [ ] **Step 4: Implement migration state and save through Elementor's document API**

`seedPage()` requires `current_user_can('edit_post', $postId)` and returns status `forbidden` without writing when false.

Save elements through Elementor, assign the WordPress page template explicitly, then reload Elementor data before hashing:

```php
$document = \Elementor\Plugin::$instance->documents->get($postId, false);
if (! $document) {
    return ['status' => 'document_missing', 'post_id' => $postId];
}

$saved = $document->save(['elements' => $elements]);
if (! $saved) {
    return ['status' => 'save_failed', 'post_id' => $postId];
}

update_post_meta($postId, '_wp_page_template', 'page-templates/rosa-elementor-authoring.php');

$reloaded = \Elementor\Plugin::$instance->documents->get($postId, false);
$normalized = $reloaded ? $reloaded->get_elements_data() : [];
$hash = hash('sha256', wp_json_encode($normalized, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
update_post_meta($postId, '_rosa_elementor_authoring_version', '1');
update_post_meta($postId, '_rosa_elementor_seed_hash', $hash);
```

`state()` reloads `get_elements_data()`, canonicalizes it identically, and compares the current hash with `_rosa_elementor_seed_hash`.

Seeding rules:

```text
never_migrated + force=false -> seeded
migrated_untouched + force=false -> skipped
migrated_edited + force=false -> skipped
migrated_* + force=true -> seeded_forced
```

- [ ] **Step 5: Run unit tests**

```bash
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
git commit -m "feat(wordpress): add idempotent Elementor page seeding"
```

---

### Task 6: Add the protected Elementor page shell and explicit six-page migration command

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/scripts/elementor-authoring-seed.sh`
- Test: `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`
- Test: `wordpress/scripts/tests/elementor-authoring-editor-links.test.sh`

**Interfaces:**
- Consumes: `ElementorPageSeeder::seedPage(...)`.
- Produces explicit CLI behavior: default seeds only never-migrated target pages; `--force` intentionally resets all six target Elementor documents from current Rosa migration sources.

- [ ] **Step 1: Write the runtime contract first**

Require `get_header()`, normal `the_content()`, shared `cta-banner`, and `get_footer()` in `rosa-elementor-authoring.php`. Reject Elementor Canvas/template-removal modes.

Require `elementor-authoring-seed.sh` to target exactly:

```text
home -> en Home
about -> en About
contact -> en Contact
ar -> ar Home
ar/about -> ar About
ar/contact -> ar Contact
```

Require `functions.php` to enqueue `elementor-authoring.css` only when `_wp_page_template` equals `page-templates/rosa-elementor-authoring.php`.

- [ ] **Step 2: Implement the protected page shell**

```php
<?php
/** Template Name: Rosa Elementor Authoring */
if (! defined('ABSPATH')) { exit; }
$locale = rosa_preview_locale();
get_header();
while (have_posts()) {
    the_post();
    echo '<div class="rosa-elementor-authoring" data-rosa-elementor-authoring>';
    the_content();
    echo '</div>';
}
get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]);
get_footer();
```

Do not render a second `<main>`; the existing Rosa header/footer shell already owns it.

- [ ] **Step 3: Add deterministic wrapper-neutralization CSS and enqueue it**

Start with only:

```css
.rosa-elementor-authoring,
.rosa-elementor-authoring > .elementor,
.rosa-elementor-authoring .rosa-elementor-root {
    inline-size: 100%;
    max-inline-size: none;
    margin: 0;
    padding: 0;
}

.rosa-elementor-authoring .rosa-elementor-root {
    gap: 0;
}
```

Do not duplicate Rosa section typography, colors, rail widths, or breakpoint rules in this file.

- [ ] **Step 4: Implement the explicit migration script with administrator capability**

Follow existing Docker/WP-CLI conventions. Resolve an administrator dynamically:

```bash
admin_id="$(wp user list --role=administrator --field=ID | head -n1)"
[[ "$admin_id" =~ ^[0-9]+$ ]] || fail 'No WordPress administrator available for Elementor document save'
wp_admin(){ wp --user="$admin_id" "$@"; }
```

Use `wp_admin eval` for calls to `ElementorPageSeeder::seedPage()` because Elementor document `save()` checks edit capability. Never hard-code `rosa_foundation_admin` or any password into the repository.

The script must locate each page by path, assert locale metadata, call `seedPage()`, and print one result line per page. Do not call this script from `client-preview-seed.sh`.

- [ ] **Step 5: Run seed twice against local Docker**

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
bash wordpress/scripts/elementor-authoring-seed.sh
```

Expected first run: six `seeded`. Expected second run: six `skipped`; no Elementor data mutation.

- [ ] **Step 6: Verify Elementor document recognition**

For each target page, assert Elementor reports it built with Elementor, `_wp_page_template` is `page-templates/rosa-elementor-authoring.php`, and standard editor URL contains `action=elementor&post=<id>` (argument order may differ).

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css wordpress/wp-content/themes/rosa-medical-child/functions.php wordpress/scripts/elementor-authoring-seed.sh wordpress/scripts/tests/elementor-authoring-*.test.sh
git commit -m "feat(wordpress): seed Rosa Elementor authoring pages"
```

---

### Task 7: Cut over Home/About/Contact admin entries to Elementor shortcuts

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php`
- Test: `wordpress/scripts/tests/client-preview-admin-contract.test.sh`
- Test: `wordpress/scripts/tests/elementor-authoring-editor-links.test.sh`

**Interfaces:**
- Produces English Home/About/Contact Rosa-menu entries that open Elementor edit URLs.
- Preserves Shop, Site & CTA, and Business as existing forms.

- [ ] **Step 1: Change tests before admin code**

Update the admin contract to reject content-setting forms for `home`, `about`, and `contact` as Rosa-menu destinations after cutover, while still requiring `ContentSettings` storage to remain loaded for migration/rollback.

Require shortcut URLs to derive from actual page IDs, not hard-coded IDs.

- [ ] **Step 2: Run tests and verify RED**

```bash
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
```

- [ ] **Step 3: Implement shortcut behavior**

`ElementorShortcutPage::render(string $path, string $label): void` resolves the page, then:

```php
$document = class_exists('\\Elementor\\Plugin')
    ? \Elementor\Plugin::$instance->documents->get($pageId)
    : false;
$url = $document ? $document->get_edit_url() : get_edit_post_link($pageId, '');
```

If Elementor is unavailable, render a standard WordPress warning and normal Edit Page link. Do not fatal.

`RosaAdmin` maps:

```text
Homepage -> path home
About -> path about
Contact -> path contact
```

Shop/Site & CTA/Business remain unchanged.

- [ ] **Step 4: Verify admin URLs and no duplicate editor**

Run the two tests and manually open each Rosa shortcut once in local wp-admin.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Admin wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php wordpress/scripts/tests/client-preview-admin-contract.test.sh wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
git commit -m "feat(wordpress): route Rosa page editing to Elementor"
```

---

### Task 8: Prove client edits persist and routine seed operations cannot erase them

**Files:**
- Create: `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Modify on test-proven defect only: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php`, theme widget renderers, or `client-preview-seed.sh`.

**Interfaces:**
- Validates the complete authoring data flow without relying on manual browser editing for every assertion.

- [ ] **Step 1: Write a runtime mutation test**

Save the current Home Elementor elements/hash, mutate the `hero_title` setting inside the `rosa-home-hero` widget through Elementor's document API, and assert:

```text
English Home renders TEST ELEMENTOR HERO
Arabic Home remains unchanged
all nine Home section markers remain
```

Then run:

```bash
bash wordpress/scripts/client-preview-seed.sh
bash wordpress/scripts/elementor-authoring-seed.sh
```

without `--force` and assert the edit still survives both commands. Restore the original elements through Elementor's document API in a shell `trap` so restoration occurs on pass or failure.

- [ ] **Step 2: Add Arabic and media mutation cases**

Mutate one Arabic text setting and one Home media-control ID. Assert Arabic remains `lang="ar" dir="rtl"`, English text remains independent, the selected image renders, and routine seeds do not erase either edit.

- [ ] **Step 3: Run mutation test**

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Expected: PASS with explicit restoration message.

- [ ] **Step 4: Commit**

```bash
git add wordpress/scripts/tests/elementor-authoring-mutation.test.sh wordpress/wp-content/plugins/rosa-medical-core/src/Elementor
git commit -m "test(wordpress): protect Elementor client edits from reseeding"
```

---

### Task 9: Restore and lock measured visual fidelity under Elementor wrappers

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css`
- Modify: browser tests only to target migrated output; thresholds must not be weakened.
- Create: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`

**Interfaces:**
- Preserves existing visual language; only wrapper effects introduced by Elementor may be neutralized.

- [ ] **Step 1: Run browser gates immediately after migration**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
```

Capture Home/About/Contact at the existing responsive matrix sizes. Any failure is treated as an Elementor wrapper regression to fix, not a reason to loosen acceptance thresholds.

- [ ] **Step 2: Adjust only authoring-wrapper neutralization when evidence requires it**

Changes stay scoped below `.rosa-elementor-authoring` / `.rosa-elementor-root`. Do not set new theme colors, typography, section heights, rail widths, or breakpoint values. Each CSS change must correspond to a measured failing property from Step 1.

- [ ] **Step 3: Add About/Contact migrated browser contracts**

`elementor-authoring-about-contact.test.mjs` must assert at desktop and 390/430px:

```text
About page hero visible
About primary split visible
About CTA remains after Elementor body
Contact page hero visible
Contact details/form grid visible
Contact map visible
Contact CTA remains after Elementor body
no horizontal overflow
English dir=ltr
Arabic dir=rtl
```

- [ ] **Step 4: Re-run all browser gates**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css wordpress/scripts/tests
git commit -m "fix(wordpress): preserve Rosa geometry under Elementor authoring"
```

---

### Task 10: Integrate Elementor authoring into the full verifier and document the client workflow

**Files:**
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Modify: `docs/runbooks/wordpress-client-content-controls.md`
- Modify: `README.md` with the new verified WordPress checkpoint following the README's existing coordination format.

**Interfaces:**
- Produces one full verification path for source, runtime, Elementor migration, mutation, accessibility, RTL, WooCommerce regression, and geometry.

- [ ] **Step 1: Add new source/runtime tests to the verifier**

Order cheap tests before Docker/browser work:

```text
elementor-authoring-integration.test.php
elementor-authoring-theme-contract.test.sh
elementor-authoring-seed-contract.test.php
existing syntax/source checks
foundation bootstrap
client preview seed
Elementor authoring seed
elementor-authoring-runtime.test.sh
elementor-authoring-editor-links.test.sh
elementor-authoring-mutation.test.sh
existing accessibility/fidelity gates
elementor-authoring-about-contact.test.mjs
```

- [ ] **Step 2: Update the runbook**

Document:

```text
Pages / Rosa shortcuts -> Elementor: Home, About, Contact, AR equivalents
Rosa Medical -> Site & CTA: global shared copy
Rosa Medical -> Business: phone/email/address/WhatsApp
Rosa Medical -> Shop: Shop interface copy
WooCommerce -> Products: product/catalogue data
```

Rollback instructions: assign the original legacy page template to the affected page and leave both Elementor data and structured Rosa options intact. Do not tell operators to delete `_elementor_data`, Rosa content options, or migration metadata during rollback.

- [ ] **Step 3: Update the coordination README**

Record branch name, phase scope, exact verifier command, green acceptance requirements, and explicit remaining roadmap items. Do not mark Hostinger deployment ready until this verifier and manual editor pass are green.

- [ ] **Step 4: Run the complete verifier**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected final line:

```text
PASS: Rosa client preview source, runtime, Elementor authoring, bilingual routes, editable content and Stevens foundation regression
```

- [ ] **Step 5: Perform one manual editor acceptance pass**

Using local wp-admin:

1. Rosa Medical → Homepage → Edit with Elementor.
2. Change English Home hero heading; Update; verify frontend; restore.
3. Open Arabic Home in Elementor; change one text value; Update; verify RTL; restore.
4. Change one Elementor image control; verify frontend; restore.
5. Open About and Contact in Elementor and confirm widgets are clearly named/editable.
6. Confirm Shop/Site & CTA/Business still open the existing Rosa forms.

Record pass/fail observations only; never commit credentials.

- [ ] **Step 6: Commit documentation/verifier integration**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh docs/runbooks/wordpress-client-content-controls.md README.md
git commit -m "docs(wordpress): finalize Elementor client authoring workflow"
```

---

## Final Verification Gate

Before claiming this phase complete, run on the exact branch head:

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
bash wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Then manually confirm all six target pages expose **Edit with Elementor** and that an EN text edit, AR text edit, and media edit can each be saved and restored without altering protected site structure.

Do not merge, deploy to Hostinger, retire legacy templates, or delete structured Home/About/Contact options as part of this implementation plan.
