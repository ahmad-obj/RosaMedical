# Rosa WordPress Elementor Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the six Rosa Home/About/Contact EN/AR pages into genuine Elementor Free documents while preserving the verified MedicaShop-faithful public design, protected Rosa shell, WooCommerce behavior, shared settings, RTL behavior, and rollback path.

**Architecture:** Rosa Medical Core owns the Elementor integration, widget registration, seed/migration builder, and admin shortcuts. The child theme remains the visual renderer: existing section markup is refactored into argument-driven template parts, a protected Elementor page-shell template renders `the_content()` between the existing Rosa header/footer and shared CTA, and Rosa Elementor widgets feed editable settings into those same theme parts. Migration seeds deterministic Elementor documents through Elementor's document API, marks them with Rosa migration metadata, and never overwrites a migrated page unless an explicit force operation is invoked.

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

---

## File Structure

### Plugin integration

- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorIntegration.php` — Elementor lifecycle boundary; must be safe when Elementor is absent.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php` — Rosa widget category + widget registration.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AbstractRosaSectionWidget.php` — shared widget identity, locale resolution, control helpers, and theme-part rendering.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php` — Home section widgets.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php` — About section widgets.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php` — Contact section widgets.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php` — deterministic section-to-widget settings mapping from Rosa structured settings/media.
- Create `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php` — six-page document seeding, migration state, Elementor document save API, idempotency.
- Modify `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php` — load only Elementor-safe integration/seeder classes at plugin bootstrap; widget classes are loaded lazily after Elementor initializes.
- Modify `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php` — register Elementor integration without changing product-template behavior.
- Modify `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php` — replace Home/About/Contact content forms with Elementor shortcuts after cutover.

### Theme rendering

- Modify `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php` — add argument-first section content/media helpers.
- Create `wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php` — protected Rosa shell + Elementor body + shared CTA.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-featured.php` — extract current inline Featured Products + benefits markup.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-latest.php` — extract current inline Latest Products markup.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php` — shared About/Contact page hero renderer.
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-stats.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-feature.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-why.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-layout.php`
- Create `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-map.php`
- Modify current Home/About/Contact legacy templates to render those same parts with no explicit Elementor overrides; this is the zero-drift reference path.
- Modify existing Home template parts (`hero.php`, `home-who.php`, `home-feature.php`, `home-promos.php`, `home-why.php`, `home-proof.php`, `home-evidence.php`, `media-slot.php`) only as required to accept explicit widget arguments before falling back to current Rosa settings/media.
- Modify `wordpress/wp-content/themes/rosa-medical-child/functions.php` only if Elementor wrapper neutralization needs an additional authoring stylesheet; do not change existing preview stylesheet ordering without a regression test.
- Create `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css` only if required by measured geometry; it may neutralize the seeded root Elementor container/wrapper, not redesign the sections.

### Migration/runtime tooling

- Create `wordpress/scripts/elementor-authoring-seed.sh` — explicit migration command; not part of routine `client-preview-seed.sh`.
- Create `wordpress/scripts/tests/elementor-authoring-integration.test.php`
- Create `wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh`
- Create `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php`
- Create `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`
- Create `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Create `wordpress/scripts/tests/elementor-authoring-editor-links.test.sh`
- Modify `wordpress/scripts/client-preview-runtime-verify.sh` to include the new contracts/runtime gates only after the cutover task is complete.
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
- Consumes later: Elementor hook `elementor/elements/categories_registered` and `elementor/widgets/register`.

- [ ] **Step 1: Write the failing integration test**

Create a pure-PHP test with WordPress hook stubs. It must assert that loading Rosa Core without defining `\Elementor\Plugin` or `\Elementor\Widget_Base` does not fatal, and that `ElementorIntegration::register()` registers only lifecycle callbacks rather than eagerly requiring widget subclasses.

The expected assertions are:

```php
assert(ElementorIntegration::isAvailable() === false);
ElementorIntegration::register();
assert(isset($GLOBALS['rosa_test_actions']['elementor/init']));
```

Also stub an Elementor-present case and assert `WidgetRegistry::registerCategory()` calls:

```php
$manager->add_category('rosa-medical', [
    'title' => 'Rosa Medical',
    'icon' => 'eicon-site-identity',
]);
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

Expected: FAIL because the Elementor integration classes do not exist.

- [ ] **Step 3: Implement the lifecycle boundary**

`ElementorIntegration::register()` must hook `elementor/init` and do nothing destructive when Elementor never fires:

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

`WidgetRegistry::registerWidgets()` must `require_once` the widget files inside the callback, then call `$widgetsManager->register(new ...Widget())`. Do not require files extending `Widget_Base` from `rosa-medical-core.php`.

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

The contract must require:

```text
page-templates/client-preview-home.php -> home-featured.php + home-latest.php
page-templates/client-preview-about.php -> page-hero.php + about-* parts
page-templates/client-preview-contact.php -> page-hero.php + contact-layout.php + contact-map.php
```

It must also reject direct Elementor references inside those legacy templates.

- [ ] **Step 2: Capture current baseline HTML before extraction**

With the existing local foundation running:

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

Use explicit overrides first and legacy Rosa settings second:

```php
function rosa_preview_section_value(array $args, string $section, string $key, string $locale, string $fallback): string
{
    $content = isset($args['content']) && is_array($args['content']) ? $args['content'] : [];
    if (array_key_exists($key, $content) && is_scalar($content[$key])) {
        return (string) $content[$key];
    }
    return rosa_preview_content($section, $key, $locale, $fallback);
}
```

For media, accept Elementor media controls as `['id' => N]` and otherwise fall back to `rosa_preview_media_id($legacySlot)`.

- [ ] **Step 4: Extract the inline Home/About/Contact markup into focused parts**

Do not redesign markup. The legacy templates must call the new parts in exactly the existing section order. Each part reads `$args['locale']`, then uses `rosa_preview_section_value()` for editable copy. Fixed query limits remain fixed (`featured=4`, `latest=10`). Shared Business values continue to come from existing business helpers, not from `$args['content']`.

- [ ] **Step 5: Verify legacy output remains unchanged before Elementor exists**

Run:

```bash
bash wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
```

Also re-fetch the six pages and compare visible text/section markers to `/tmp/rosa-elementor-baseline`. Exact HTML may differ only where extraction changes insignificant PHP whitespace; geometry and visible content must not.

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
- Produces widget names:
  - `rosa-home-hero`
  - `rosa-home-who`
  - `rosa-home-featured`
  - `rosa-home-feature-banner`
  - `rosa-home-latest`
  - `rosa-home-promotions`
  - `rosa-home-why`
  - `rosa-home-proof`
  - `rosa-home-evidence`
- Produces: `AbstractRosaSectionWidget::renderPart(string $part, array $args): void`
- Produces: `AbstractRosaSectionWidget::locale(): string`

- [ ] **Step 1: Extend the integration test with widget registration assertions**

Stub `\Elementor\Widget_Base`, `Controls_Manager`, `Repeater`, and a widgets manager. Assert the nine Home widget names register exactly once and all return `['rosa-medical']` from `get_categories()`.

- [ ] **Step 2: Run test and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

Expected: FAIL for missing widgets.

- [ ] **Step 3: Implement the base widget**

The base must provide only content-oriented helpers, e.g.:

```php
protected function addText(string $id, string $label, string $default = ''): void;
protected function addTextarea(string $id, string $label, string $default = ''): void;
protected function addMedia(string $id, string $label, int $defaultId = 0): void;
protected function locale(): string;
protected function renderPart(string $part, array $args): void;
```

`renderPart()` must use `get_template_part('template-parts/client-preview/' . $part, null, $args)` only after confirming the part exists with `locate_template()`; in the editor, a missing theme part may render a small escaped admin-facing notice instead of fatalling.

- [ ] **Step 4: Implement Home section widgets**

Each widget exposes only the settings that exist in its section. Examples:

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

- [ ] **Step 5: Run focused registration tests and PHP syntax**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AbstractRosaSectionWidget.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php
```

Expected: PASS.

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
- Produces About widget names:
  - `rosa-page-hero-about`
  - `rosa-about-who`
  - `rosa-about-stats`
  - `rosa-about-cards`
  - `rosa-about-feature`
  - `rosa-about-why`
  - `rosa-about-proof`
- Produces Contact widget names:
  - `rosa-page-hero-contact`
  - `rosa-contact-layout`
  - `rosa-contact-map`

- [ ] **Step 1: Add failing widget-control assertions**

Assert Contact widgets do **not** expose controls named `email`, `phone`, `address`, `address_ar`, `submit_endpoint`, or `form_action`; those remain code/shared-settings-owned.

Assert About and Contact widget names register under `rosa-medical`.

- [ ] **Step 2: Run test and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

- [ ] **Step 3: Implement About widgets**

Map the current About schema exactly: page hero, Who copy/image, stats, three cards, feature copy/image, Why cards, proof labels. Keep current Shop/Contact route destinations code-owned in the theme part rather than editable URL controls.

- [ ] **Step 4: Implement Contact widgets**

`rosa-contact-layout` exposes only labels/copy (`location_label`, `phone_label`, `email_label`, `form_title`, `field_name`, `field_phone`, `field_subject`, `field_message`, `send_email`). Runtime address/phone/email values are read from current Rosa Business settings by the theme part.

`rosa-contact-map` exposes `map_eyebrow` and `map_button`; map query remains generated from the current English Business address as today.

No submission handler is introduced.

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
- Produces meta:
  - `_rosa_elementor_authoring_version` = `1`
  - `_rosa_elementor_seed_hash` = SHA-256 of canonical seeded elements JSON

- [ ] **Step 1: Write seed-data tests first**

Stub `ContentSettings::get()`, media lookups, post meta, and Elementor document access. Require deterministic IDs:

```php
assert(ElementorSeedData::deterministicId('home-en-root') === substr(md5('rosa:home-en-root'), 0, 8));
```

Require the Home seed order to be exactly the nine Home widgets; About seven; Contact three.

Require Arabic build calls to use Arabic Rosa structured values and media IDs while Business values are absent from Elementor settings.

- [ ] **Step 2: Run and verify RED**

```bash
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

- [ ] **Step 3: Implement the Elementor data builder**

Build one neutral root container using Elementor's documented element structure:

```php
[
    'id' => self::deterministicId("{$pageType}-{$locale}-root"),
    'elType' => 'container',
    'isInner' => false,
    'settings' => [
        'content_width' => 'full',
        'gap' => ['unit' => 'px', 'size' => 0, 'sizes' => []],
        'padding' => ['unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true],
    ],
    'elements' => [/* deterministic Rosa widget elements */],
]
```

Widget elements use:

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

Use:

```php
$document = \Elementor\Plugin::$instance->documents->get($postId, false);
if (! $document) { /* return explicit error status */ }
$document->save([
    'elements' => $elements,
    'settings' => ['template' => 'page-templates/rosa-elementor-authoring.php'],
]);
```

After a successful save, persist the Rosa version/hash metadata. `state()` compares current `$document->get_elements_data()` canonical hash with `_rosa_elementor_seed_hash`.

Seeding rules:

```text
never_migrated + force=false -> seed
migrated_untouched + force=false -> skip
migrated_edited + force=false -> skip
any migrated state + force=true -> reseed only after explicit caller request
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
- Create: `wordpress/scripts/elementor-authoring-seed.sh`
- Test: `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`
- Test: `wordpress/scripts/tests/elementor-authoring-editor-links.test.sh`

**Interfaces:**
- Consumes: `ElementorPageSeeder::seedPage(...)`
- Produces explicit CLI behavior:
  - default: seed only never-migrated target pages
  - `--force`: intentionally reset all six target Elementor documents from current Rosa migration sources

- [ ] **Step 1: Write the runtime contract first**

The shell contract must require `get_header()`, normal `the_content()`, shared `cta-banner`, and `get_footer()` in `rosa-elementor-authoring.php`, and reject `elementor_canvas`/canvas-template usage.

It must require `elementor-authoring-seed.sh` to target exactly:

```text
home -> en Home
about -> en About
contact -> en Contact
ar -> ar Home
ar/about -> ar About
ar/contact -> ar Contact
```

- [ ] **Step 2: Implement the protected page shell**

Use:

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

Do not render a second `<main>`; the existing Rosa header opens the protected main shell and footer closes it.

- [ ] **Step 3: Implement the explicit migration script**

Follow existing Docker/WP-CLI helper conventions. The script must:

1. require Elementor active;
2. locate each existing page by path;
3. assert locale metadata matches the target;
4. call `ElementorPageSeeder::seedPage()`;
5. print one state line per page;
6. never call this script from routine `client-preview-seed.sh`.

- [ ] **Step 4: Run seed against local Docker**

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
```

Expected first run: six `seeded` results.

Run it again immediately:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
```

Expected second run: six `skipped` results; no `_elementor_data` mutation.

- [ ] **Step 5: Verify Elementor document recognition**

For each target page, use WP-CLI to assert Elementor considers the document built with Elementor and the template is `page-templates/rosa-elementor-authoring.php`.

Also verify the standard editor URL contains `action=elementor` and `post=<id>`.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php wordpress/scripts/elementor-authoring-seed.sh wordpress/scripts/tests/elementor-authoring-*.test.sh
git commit -m "feat(wordpress): seed Rosa Elementor authoring pages"
```

---

### Task 7: Cut over Home/About/Contact admin entries to Elementor shortcuts

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ContentPage.php` only if a reusable shortcut renderer belongs there; otherwise add a focused `ElementorShortcutPage.php`.
- Test: `wordpress/scripts/tests/client-preview-admin-contract.test.sh`
- Test: `wordpress/scripts/tests/elementor-authoring-editor-links.test.sh`

**Interfaces:**
- Produces: English Home/About/Contact Rosa-menu entries that redirect/render buttons to Elementor editor URLs.
- Preserves: Shop, Site & CTA, Business as existing forms.

- [ ] **Step 1: Change tests before admin code**

Update the admin contract to reject content-setting forms for `home`, `about`, and `contact` as Rosa-menu destinations after cutover, while still requiring `ContentSettings` storage to remain loaded for migration/rollback.

Require shortcut URLs to be derived from actual page IDs, not hard-coded IDs.

- [ ] **Step 2: Run tests and verify RED**

```bash
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
```

- [ ] **Step 3: Implement shortcut behavior**

Resolve the English page by path, then use Elementor's document object when available:

```php
$document = \Elementor\Plugin::$instance->documents->get($pageId);
$url = $document ? $document->get_edit_url() : get_edit_post_link($pageId, '');
```

If Elementor is unavailable, show a standard WordPress warning plus normal Edit Page link; do not fatal.

Keep `Shop`, `Site & CTA`, and `Business` unchanged.

- [ ] **Step 4: Verify admin URLs and no duplicate editor**

Run the two tests again and manually open each Rosa shortcut once in local wp-admin.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Admin wordpress/scripts/tests/client-preview-admin-contract.test.sh wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
git commit -m "feat(wordpress): route Rosa page editing to Elementor"
```

---

### Task 8: Prove client edits persist and routine seed operations cannot erase them

**Files:**
- Create: `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Modify only if a failure proves necessary: `ElementorPageSeeder.php`, `client-preview-seed.sh`, theme widget renderers.

**Interfaces:**
- Validates the complete authoring data flow without relying on browser manual editing for every assertion.

- [ ] **Step 1: Write a runtime mutation test**

The test must save the current Home Elementor data/hash, mutate the `hero_title` setting inside the `rosa-home-hero` widget through Elementor's document API, and assert:

```text
English Home renders TEST ELEMENTOR HERO
Arabic Home remains unchanged
all nine Home section markers remain
```

Then run routine:

```bash
bash wordpress/scripts/client-preview-seed.sh
```

and assert `TEST ELEMENTOR HERO` still renders.

Then call:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
```

without `--force` and assert the edit still survives.

Finally restore the original document data through Elementor's document API.

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

### Task 9: Restore measured visual fidelity under Elementor wrappers

**Files:**
- Modify if needed: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create if needed: `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css`
- Modify: browser tests only to target the migrated output, never to weaken thresholds.
- Add: migrated About/Contact geometry/marker assertions where source-only tests are insufficient.

**Interfaces:**
- Must preserve existing acceptance behavior, not create new visual language.

- [ ] **Step 1: Run the browser gates immediately after migration before adding CSS**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
```

Also capture Home/About/Contact at existing responsive matrix sizes.

Expected: any failures are evidence of Elementor wrapper effects, not a reason to loosen tests.

- [ ] **Step 2: If wrappers cause drift, add the smallest authoring-only neutralization**

Scope CSS below `.rosa-elementor-authoring` and target only Elementor's seeded root wrapper/container. Example intent:

```css
.rosa-elementor-authoring > .elementor,
.rosa-elementor-authoring .e-con.rosa-elementor-root {
    inline-size: 100%;
    max-inline-size: none;
    margin: 0;
    padding: 0;
    gap: 0;
}
```

Do not set theme colors, typography, section heights, rail widths, or breakpoint values here unless an existing Rosa value is being restored exactly.

- [ ] **Step 3: Add About/Contact migrated geometry checks**

Protect at minimum the page hero, primary split/contact grid, CTA placement, no horizontal overflow at 390/430px, and EN/AR directionality.

- [ ] **Step 4: Re-run all browser gates**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child wordpress/scripts/tests
git commit -m "fix(wordpress): preserve Rosa geometry under Elementor authoring"
```

---

### Task 10: Integrate Elementor authoring into the full verifier and document the client workflow

**Files:**
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Modify: `docs/runbooks/wordpress-client-content-controls.md`
- Modify: root `README.md` only with a concise coordination checkpoint if the README's existing governance format requires it.

**Interfaces:**
- Produces one full verification path for source, runtime, Elementor migration, mutation, accessibility, RTL, WooCommerce regression, and geometry.

- [ ] **Step 1: Add the new source/runtime tests to the verifier**

Order them so cheap source/unit checks run before Docker/browser work:

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
```

- [ ] **Step 2: Update the runbook**

Document the client-facing ownership model exactly:

```text
Pages / Rosa shortcuts -> Elementor: Home, About, Contact, AR equivalents
Rosa Medical -> Site & CTA: global shared copy
Rosa Medical -> Business: phone/email/address/WhatsApp
Rosa Medical -> Shop: Shop interface copy
WooCommerce -> Products: product/catalogue data
```

Document rollback as assigning the original legacy page template and preserving Elementor data; do not tell operators to delete structured options or `_elementor_data`.

- [ ] **Step 3: Run the complete verifier**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected final line:

```text
PASS: Rosa client preview source, runtime, Elementor authoring, bilingual routes, editable content and Stevens foundation regression
```

- [ ] **Step 4: Perform one manual editor acceptance pass**

Using local wp-admin:

1. Rosa Medical → Homepage → Edit with Elementor.
2. Change English Home hero heading; Update; verify frontend; restore.
3. Open Arabic Home in Elementor; change one text value; Update; verify RTL; restore.
4. Change one Elementor image control; verify frontend; restore.
5. Open About and Contact in Elementor and confirm widgets are clearly named and editable.
6. Confirm Shop/Site & CTA/Business still open the existing Rosa forms.

Record only pass/fail observations; do not commit credentials.

- [ ] **Step 5: Commit documentation/verifier integration**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh docs/runbooks/wordpress-client-content-controls.md README.md
git commit -m "docs(wordpress): finalize Elementor client authoring workflow"
```

---

## Final Verification Gate

Before claiming this phase complete, run all of the following on the exact branch head:

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
bash wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Then confirm manually that all six target pages expose **Edit with Elementor** and that an EN text edit, AR text edit, and media edit can each be saved and restored without altering protected site structure.

Do not merge, deploy to Hostinger, retire legacy templates, or delete the structured Home/About/Contact options as part of this implementation plan.
