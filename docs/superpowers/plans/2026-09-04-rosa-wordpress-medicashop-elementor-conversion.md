# Rosa WordPress MedicaShop Elementor Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the pinned finished MedicaShop-derived Rosa marketing template into Elementor Free page bodies without visible drift, while preserving the current safe authoring, WooCommerce, centralized settings, EN/AR, RTL, and migration infrastructure.

**Architecture:** Keep the finished template's child-theme DOM/CSS/JS as the rendering authority and expose its page-body sections through dedicated Rosa Elementor widgets. Home becomes nine target-topology widgets that delegate to target-compatible PHP partials; About and Contact keep their current dedicated widgets unless a parity audit proves drift. WooCommerce remains the source for Featured/Latest products, the shared pre-footer CTA remains code/settings-owned, and untouched Home documents migrate automatically through a bumped Home parity marker while edited documents require manual intervention.

**Tech Stack:** WordPress/PHP 8+, Elementor Free, WooCommerce, Bash/WP-CLI, vanilla JavaScript, CSS, Playwright via the existing `apps/web` package.

**Spec:** `docs/superpowers/specs/2026-09-04-rosa-wordpress-medicashop-elementor-conversion-design.md`

## Global Constraints

- Visual authority is pinned to `wordpress/client-preview-medicashop-recreation` at `d0726eed34b4fc14267570853ade8b74df49ae9e`.
- The 2026-09-03 latest-custom-frontend parity design is superseded as a visual target; retain only useful infrastructure from that work.
- Do not use `apps/web/**` as a visual authority for this conversion.
- Preserve Elementor Free ownership of EN/AR Home, About, and Contact body content/media.
- Preserve WooCommerce ownership of products, categories/families, SKUs, variants, product media, descriptions, and future pricing.
- Preserve centralized Rosa Business and Site/CTA settings for phone, email, address, WhatsApp, navigation, and shared CTA content.
- The shared pre-footer CTA remains outside Elementor and must render exactly once on Home, About, and Contact.
- Do not add Elementor Pro.
- Do not add a Contact submission backend.
- Do not force-reseed edited Elementor documents.
- Do not weaken existing overflow, collision, accessibility, RTL, console/network, or geometry thresholds merely to pass tests.
- Required Home viewports: 1440×900, 1280×800, 1024×768, 768×1024, 431×932, 390×844, 360×800.
- Keep the Elementor root safeguards: full-width root, zero gap/padding, vertical non-wrapping flow, and `css_classes` containing `rosa-elementor-root`.
- No Hostinger or production deployment is authorized by this plan.
- Do not merge or delete `wordpress/client-content-controls` as part of this plan.

---

## File Structure

### Read-only target references

- `wordpress/client-preview-medicashop-recreation@d0726eed34b4fc14267570853ade8b74df49ae9e:wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php` — exact Home topology.
- `.../page-templates/client-preview-about.php` — exact About topology.
- `.../page-templates/client-preview-contact.php` — exact Contact topology.
- `.../assets/css/tokens.css` — exact target token values.
- `.../assets/css/client-preview.css` — exact target shell/page geometry.
- `.../assets/css/client-preview-rtl.css` — exact target RTL layer.
- `.../assets/js/client-preview.js` — exact target interaction behavior.
- `.../scripts/tests/client-preview-home-fidelity.test.mjs` — measured target Home geometry contract.

### Files to create

- `wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh` — pins the target commit, critical target hashes/literals, current token parity, target asset gating, and shared CTA ownership.
- `wordpress/scripts/tests/medicashop-elementor-home-contract.test.php` — validates the nine Home Elementor widget classes, exact order, control ownership, media mapping, and root classes.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-featured.php` — target-identical Featured Products + Procurement Support renderer using dynamic WooCommerce data.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-latest.php` — target-identical Latest Products renderer using dynamic WooCommerce data.
- `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs` — runs the historical target geometry expectations against the Elementor-authored Home route.
- `wordpress/scripts/medicashop-elementor-parity-capture.mjs` — captures reference/local EN/AR screenshots at the required viewports.

### Files to modify

- `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css` — restore target `--rosa-*` values; remove latest-custom aliases from target rendering if they alter geometry.
- `wordpress/wp-content/themes/rosa-medical-child/functions.php` — stop enqueuing `latest-rosa-home*` assets; retain target preview/Elementor/RTL assets.
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php` — render the shared CTA once after `the_content()` for all marketing pages.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php` — restore target Home content groups/keys while leaving persisted unknown option keys non-destructively untouched.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php` — mark the original target Home media slots as active; keep now-unused latest Home keys accepted for data preservation but do not seed/use them for target Home.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php` — replace seven latest-custom Home widgets with nine target-template widgets.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php` — register the nine Home widgets followed by existing About/Contact widgets.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php` — build the exact nine-widget Home document and target media mapping.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php` — bump Home parity version from `1` to `2` and safely migrate only untouched Home documents.
- `wordpress/scripts/client-preview-seed.sh` — make original target Home media slots the seeded active Home set; stop relying on latest-custom Home assets.
- `wordpress/scripts/tests/content-settings.test.php` — pin target Home defaults/keys.
- `wordpress/scripts/tests/media-settings.test.php` — pin target active Home media keys and non-destructive retention behavior.
- `wordpress/scripts/tests/elementor-authoring-integration.test.php` — expect target Home widget order.
- `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php` — expect Home parity version `2` and target topology.
- `wordpress/scripts/tests/elementor-home-parity-migration.test.php` — cover parity `1 → 2` untouched/edited/fresh behavior.
- `wordpress/scripts/tests/elementor-authoring-mutation.test.sh` — mutate representative target Home text/media and prove routine seed preservation.
- `wordpress/scripts/tests/client-preview-content-mutation.test.sh` — require shared Site/CTA persistence and rendering on target Home again.
- `wordpress/scripts/tests/elementor-authoring-runtime.test.sh` — require nine target Home widgets plus existing About/Contact documents.
- `wordpress/scripts/client-preview-runtime-verify.sh` — remove latest-custom Home gates and add the target Elementor reference/fidelity gates.
- `docs/runbooks/wordpress-client-content-controls.md` — document target-template Elementor editing and migration behavior.

### Files to retire from runtime

Do not delete these until all target tests are green; first stop their enqueue/use, then remove them in the final cleanup task if no repository reference remains:

- `wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home-fidelity.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/latest-rosa-home.js`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-comprehensive.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-confidence.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-contact-band.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-assurance.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-quotation.php`

---

### Task 1: Pin and Restore the Finished Template Style Authority

**Files:**
- Create: `wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php`

**Interfaces:**
- Consumes: pinned target commit `d0726eed34b4fc14267570853ade8b74df49ae9e`.
- Produces: target token contract, target-only Home asset gating, and exactly one shared CTA after Elementor content.

- [ ] **Step 1: Write the failing reference/style contract**

Create:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$ROOT"
TARGET=d0726eed34b4fc14267570853ade8b74df49ae9e
TOKENS=wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css
FUNCTIONS=wordpress/wp-content/themes/rosa-medical-child/functions.php
AUTHORING=wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

git cat-file -e "$TARGET^{commit}" 2>/dev/null || fail "pinned MedicaShop target commit unavailable"
[[ "$(git show "$TARGET:wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css" | sha1sum | awk '{print $1}')" == "$(sha1sum wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css | awk '{print $1}')" ]] || fail "client-preview.css drifted from target"

for literal in \
  '--rosa-red: #e00815' \
  '--rosa-red-strong: #b90a14' \
  '--rosa-ink: #111214' \
  '--rosa-ink-soft: #2c2e33' \
  '--rosa-surface: #f7f7f8' \
  '--rosa-surface-strong: #eceef1' \
  '--rosa-text: #18191c' \
  '--rosa-muted: #686c74' \
  '--rosa-border: #d9dce1' \
  '--rosa-shell: 90rem' \
  '--rosa-gutter: clamp(1rem, 2.5vw, 2.5rem)'; do
  grep -Fq -- "$literal" "$TOKENS" || fail "target token missing: $literal"
done

! grep -Fq 'latest-rosa-home.css' "$FUNCTIONS" || fail "latest custom Home CSS still enqueued"
! grep -Fq 'latest-rosa-home-fidelity.css' "$FUNCTIONS" || fail "latest custom Home fidelity CSS still enqueued"
! grep -Fq 'latest-rosa-home.js' "$FUNCTIONS" || fail "latest custom Home JS still enqueued"
grep -Fq "get_template_part('template-parts/client-preview/cta-banner'" "$AUTHORING" || fail "shared CTA missing from authoring template"
! grep -Fq 'rosa_is_latest_home_page' "$AUTHORING" || fail "Home still suppresses the target shared CTA"

printf 'PASS: finished MedicaShop-derived Rosa style authority is restored\n'
```

- [ ] **Step 2: Run the contract and verify RED**

Run:

```bash
bash wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh
```

Expected: FAIL first on current target-token mismatch or one of the `latest-rosa-home*` enqueue checks.

- [ ] **Step 3: Restore target tokens exactly**

Replace the current compatibility remap with the pinned target `--rosa-*` values from the spec. Preserve reduced-motion zeroing for `--rosa-motion-fast` and `--rosa-motion-standard`. Do not keep `--rosa-shell: var(--container-wide)` or `--rosa-gutter: var(--page-gutter)` because those currently change target geometry from `90rem` / `clamp(1rem, 2.5vw, 2.5rem)`.

- [ ] **Step 4: Remove latest-custom Home asset gating and restore shared CTA**

In `functions.php`, delete the conditional block that enqueues `rosa-latest-home`, `rosa-latest-home-fidelity`, and `rosa-latest-home` JS. Keep `rosa-client-preview`, `rosa-elementor-authoring`, `rosa-client-preview-rtl`, and `rosa-client-preview` JS.

In `rosa-elementor-authoring.php`, render:

```php
while (have_posts()) {
    the_post();
    echo '<div class="rosa-elementor-authoring" data-rosa-elementor-authoring>';
    the_content();
    echo '</div>';
}
echo '<div data-preview-contact-cta>';
get_template_part('template-parts/client-preview/cta-banner', null, ['locale' => $locale]);
echo '</div>';
```

Remove the latest-Home suppression branch from this template.

- [ ] **Step 5: Re-run the focused contract**

Run:

```bash
bash wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh
```

Expected: `PASS: finished MedicaShop-derived Rosa style authority is restored`.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css \
  wordpress/wp-content/themes/rosa-medical-child/functions.php \
  wordpress/wp-content/themes/rosa-medical-child/page-templates/rosa-elementor-authoring.php
git commit -m "fix(wordpress): restore finished Rosa template style authority"
```

---

### Task 2: Restore Target Homepage Content and Media Contracts

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php`
- Modify: `wordpress/scripts/client-preview-seed.sh`
- Modify: `wordpress/scripts/tests/content-settings.test.php`
- Modify: `wordpress/scripts/tests/media-settings.test.php`

**Interfaces:**
- Produces content keys consumed by the nine Home widgets.
- Produces active media IDs for `home-hero-01`, `home-who-01`, `home-feature-01`, `home-promo-01..04`, `home-why-01`, `home-evidence-01`, and shared `prefooter-person-01`.

- [ ] **Step 1: Add failing target Home schema assertions**

Require these Home groups/keys in `content-settings.test.php`:

```php
$requiredHomeKeys = [
    'hero_eyebrow','hero_title','hero_body','hero_button',
    'who_eyebrow','who_title','who_body','who_button',
    'stat_1_value','stat_1_label','stat_2_value','stat_2_label','stat_3_value','stat_3_label',
    'featured_title','benefit_1_title','benefit_1_body','benefit_2_title','benefit_2_body','benefit_3_title','benefit_3_body',
    'feature_eyebrow','feature_title','feature_body','feature_button',
    'latest_title',
    'promo_1_title','promo_1_body','promo_2_title','promo_2_body','promo_3_title','promo_3_body','promo_4_title','promo_4_body',
    'why_eyebrow','why_title','why_1_title','why_1_body','why_2_title','why_2_body','why_3_title','why_3_body',
    'proof_1','proof_2','proof_3','proof_4','proof_5','proof_6',
    'evidence_eyebrow','evidence_title','evidence_body',
    'evidence_1_title','evidence_1_body','evidence_2_title','evidence_2_body','evidence_3_title','evidence_3_body',
];
```

Pin representative exact defaults from the existing target partials:

```php
assert_same('Surgical instruments for professional procurement.', ContentSettings::get('home', 'hero_title', 'en'));
assert_same('Expect more than an instrument catalogue.', ContentSettings::get('home', 'who_title', 'en'));
assert_same('From catalogue reference to a clear quotation request.', ContentSettings::get('home', 'feature_title', 'en'));
assert_same('Support built around instrument procurement', ContentSettings::get('home', 'why_title', 'en'));
assert_same('Turn an instrument need into a clear procurement request.', ContentSettings::get('home', 'evidence_title', 'en'));
```

- [ ] **Step 2: Add failing media assertions**

Require:

```php
$targetHomeMedia = [
    'home-hero-01','home-who-01','home-feature-01',
    'home-promo-01','home-promo-02','home-promo-03','home-promo-04',
    'home-why-01','home-evidence-01','prefooter-person-01',
];
```

Also assert `mergeSanitize()` retains unknown/existing IDs and does not zero old `latest` keys merely because they are no longer active.

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
php wordpress/scripts/tests/content-settings.test.php
php wordpress/scripts/tests/media-settings.test.php
```

Expected: Home schema test FAIL because the current schema exposes seven latest-custom groups instead of the target keys.

- [ ] **Step 4: Restore the target Home schema**

Replace only `ContentSchema::sections()['home']` with target groups corresponding to the nine target widgets. Use the existing target partial defaults as the exact EN/AR values. Do not reset the `rosa_home_content` option; schema changes must be non-destructive to unknown stored keys.

- [ ] **Step 5: Make target media the active seed set**

Keep target media keys in `MediaSettings::allowedKeys()`. The now-unused latest-custom media keys may remain allowed for data retention, but `client-preview-seed.sh` must seed/use the original target Home slots for the converted Home.

Do not delete existing WordPress attachments for the latest-custom assets.

- [ ] **Step 6: Re-run tests**

Run:

```bash
php wordpress/scripts/tests/content-settings.test.php
php wordpress/scripts/tests/media-settings.test.php
bash wordpress/scripts/tests/client-preview-seed-contract.test.sh
```

Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php \
  wordpress/wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php \
  wordpress/scripts/client-preview-seed.sh \
  wordpress/scripts/tests/content-settings.test.php \
  wordpress/scripts/tests/media-settings.test.php
git commit -m "feat(wordpress): restore target Rosa homepage content schema"
```

---

### Task 3: Build the Nine Dedicated Target Homepage Widgets

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-featured.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-latest.php`
- Reuse unchanged where parity holds: `hero.php`, `home-who.php`, `home-feature.php`, `home-promos.php`, `home-why.php`, `home-proof.php`, `home-evidence.php`, `product-grid.php`.
- Create: `wordpress/scripts/tests/medicashop-elementor-home-contract.test.php`

**Interfaces:**
- Consumes: `AbstractRosaSectionWidget::renderSection(string $part, array $mediaKeys = [], array $extraArgs = [])`.
- Produces exact widget names: `rosa-home-hero`, `rosa-home-who`, `rosa-home-featured`, `rosa-home-feature`, `rosa-home-latest`, `rosa-home-promos`, `rosa-home-why`, `rosa-home-proof`, `rosa-home-evidence`.

- [ ] **Step 1: Write the failing widget contract**

The contract must instantiate/inspect the nine classes and require this exact order and renderer mapping:

```php
$expected = [
    'rosa-home-hero',
    'rosa-home-who',
    'rosa-home-featured',
    'rosa-home-feature',
    'rosa-home-latest',
    'rosa-home-promos',
    'rosa-home-why',
    'rosa-home-proof',
    'rosa-home-evidence',
];
```

It must forbid controls for product IDs, product titles, prices, SKU values, phone, email, address, or WhatsApp URLs.

- [ ] **Step 2: Run and verify RED**

Run:

```bash
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
```

Expected: FAIL because current Home widgets are `rosa-home-hero-carousel`, `rosa-home-family-discovery`, `rosa-home-comprehensive`, `rosa-home-confidence`, `rosa-home-contact-band`, `rosa-home-assurance`, `rosa-home-quotation`.

- [ ] **Step 3: Implement the nine widget classes**

Use the existing abstract class and keep renderers thin. The pattern must be:

```php
final class HomeHeroWidget extends AbstractRosaSectionWidget
{
    public function get_name(): string { return 'rosa-home-hero'; }
    public function get_title(): string { return 'Rosa Home — Hero'; }
    protected function register_controls(): void
    {
        $this->beginContentSection('Hero');
        $this->addText('hero_eyebrow', 'Eyebrow', 'Rosa Medical');
        $this->addText('hero_title', 'Heading', 'Surgical instruments for professional procurement.');
        $this->addTextarea('hero_body', 'Body', 'Explore Rosa instrument families and contact our team for catalogue and quotation support.');
        $this->addText('hero_button', 'Button label', 'Browse products');
        $this->addMedia('image', 'Hero image');
        $this->end_controls_section();
    }
    protected function render(): void { $this->renderSection('hero', ['image']); }
}
```

Create equivalent focused classes for the remaining eight sections using the exact keys listed in Task 2. `HomeFeaturedWidget` and `HomeLatestWidget` expose copy only; product records are not controls.

- [ ] **Step 4: Extract target-identical dynamic product renderers**

`home-featured.php` must preserve the original inline target structure and call:

```php
get_template_part('template-parts/client-preview/product-grid', null, [
    'title' => $featuredTitle,
    'limit' => 4,
    'context' => 'featured',
    'locale' => $locale,
]);
```

It must render the three procurement-support benefit articles beside that grid with the exact existing classes `rosa-preview-featured`, `rosa-preview-featured__layout`, `rosa-preview-featured__products`, and `rosa-preview-benefits`.

`home-latest.php` must call:

```php
get_template_part('template-parts/client-preview/product-grid', null, [
    'title' => $latestTitle,
    'limit' => 10,
    'context' => 'latest',
    'locale' => $locale,
]);
```

inside `section.rosa-preview-latest[data-home-section="latest"] > .rosa-preview-rail`.

- [ ] **Step 5: Re-run widget contract**

Run:

```bash
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-featured.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-latest.php \
  wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
git commit -m "feat(wordpress): expose finished Home as target Elementor widgets"
```

---

### Task 4: Seed the Exact Nine-Widget Home Document

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`
- Modify: `wordpress/scripts/tests/elementor-authoring-integration.test.php`
- Modify: `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php`

**Interfaces:**
- Consumes the nine widget names from Task 3.
- Produces deterministic EN/AR Home Elementor JSON with media controls mapped to target slots.

- [ ] **Step 1: Update tests first**

Require registry order:

```php
[
  HomeHeroWidget::class,
  HomeWhoWidget::class,
  HomeFeaturedWidget::class,
  HomeFeatureWidget::class,
  HomeLatestWidget::class,
  HomePromosWidget::class,
  HomeWhyWidget::class,
  HomeProofWidget::class,
  HomeEvidenceWidget::class,
  // existing About classes, then existing Contact classes
]
```

Require Home seed widget order to equal the nine string names from Task 3.

- [ ] **Step 2: Run and verify RED**

Run:

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

Expected: FAIL on current seven-widget Home order.

- [ ] **Step 3: Update registry and `ElementorSeedData::specs('home')`**

Use these media mappings exactly:

```php
'rosa-home-hero'     => ['image' => 'home-hero-01'],
'rosa-home-who'      => ['image' => 'home-who-01'],
'rosa-home-featured' => [],
'rosa-home-feature'  => ['image' => 'home-feature-01'],
'rosa-home-latest'   => [],
'rosa-home-promos'   => [
    'image_1' => 'home-promo-01',
    'image_2' => 'home-promo-02',
    'image_3' => 'home-promo-03',
    'image_4' => 'home-promo-04',
],
'rosa-home-why'      => ['image' => 'home-why-01'],
'rosa-home-proof'    => [],
'rosa-home-evidence' => ['image' => 'home-evidence-01'],
```

Keep Home root classes `rosa-elementor-root public-page public-page--home`, full width, zero gap, zero padding.

- [ ] **Step 4: Re-run focused integration tests**

Run:

```bash
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php \
  wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php \
  wordpress/scripts/tests/elementor-authoring-integration.test.php \
  wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
git commit -m "feat(wordpress): seed target Rosa Home Elementor topology"
```

---

### Task 5: Migrate Current Home Parity `1 → 2` Without Losing Edits

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php`
- Modify: `wordpress/scripts/tests/elementor-home-parity-migration.test.php`
- Modify: `wordpress/scripts/elementor-authoring-seed.sh`

**Interfaces:**
- Existing meta key remains `_rosa_elementor_home_parity_version`.
- New value is `2`.
- Untouched parity-1 Home → `migrated_home_parity` with target nine-widget document.
- Edited parity-1 Home → `home_parity_manual_required`, no write.
- Fresh Home → normal `seeded` with parity `2`.

- [ ] **Step 1: Change the migration test first**

Require:

```php
if (ElementorPageSeeder::HOME_PARITY_VERSION !== '2') fail_test('Home parity version must be 2');
```

Test four cases:

1. parity `1` + `migrated_untouched` → nine-widget save, parity `2`, refreshed hash, `migrated_home_parity`;
2. parity `1` + `migrated_edited` → no save, parity remains `1`, `home_parity_manual_required`;
3. fresh Home → parity `2` after seed;
4. About/Contact → no Home parity mutation.

- [ ] **Step 2: Run and verify RED**

Run:

```bash
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
```

Expected: FAIL because current `HOME_PARITY_VERSION` is `1`.

- [ ] **Step 3: Bump only the Home parity marker**

In `ElementorPageSeeder` set:

```php
public const HOME_PARITY_VERSION = '2';
```

Retain the existing state/hash protection. Do not bump the general authoring version merely for this Home-only topology correction.

- [ ] **Step 4: Keep CLI status handling explicit**

`elementor-authoring-seed.sh` must accept `migrated_home_parity` as success and treat `home_parity_manual_required` as a hard stop with instructions to preserve the edited document. It must not automatically retry with `--force`.

- [ ] **Step 5: Re-run migration tests**

Run:

```bash
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php \
  wordpress/scripts/tests/elementor-home-parity-migration.test.php \
  wordpress/scripts/elementor-authoring-seed.sh
git commit -m "feat(wordpress): migrate Home back to finished target topology safely"
```

---

### Task 6: Re-establish the Historical Home Geometry Contract on Elementor Runtime

**Files:**
- Create: `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- Modify: `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-content-mutation.test.sh`

**Interfaces:**
- Consumes the exact measured geometry from pinned `client-preview-home-fidelity.test.mjs`.
- Produces a browser contract that tests the Elementor-authored Home instead of the legacy static Home template.

- [ ] **Step 1: Create the new fidelity test by porting the target assertions without loosening them**

Keep the target section order:

```js
const expectedSections = ['hero', 'who', 'featured', 'feature', 'latest', 'promos', 'why', 'proof', 'evidence'];
```

Keep the target media slots:

```js
const expectedMediaSlots = [
  'home-hero-01','home-who-01','home-feature-01',
  'home-promo-01','home-promo-02','home-promo-03','home-promo-04',
  'home-why-01','home-evidence-01','prefooter-person-01',
];
```

Keep the original target geometry thresholds, including:

- 1440 announcement 42–46px;
- 1440 main header 74–78px;
- 1440 combined header 118–122px;
- 1440 rail width 1276–1284px;
- 1440 hero 660–700px;
- 1440 hero copy 680–740px;
- 4 featured columns at 1440;
- 5 latest columns at 1440;
- 4 latest columns at 1024 and 768;
- 2 featured/latest columns at 431/639/767 and 390;
- 390 hero 430–490px;
- target mobile drawer width/height/top and five-row navigation density;
- no vertical collisions and no horizontal overflow.

Change only the route/runtime assumptions needed to hit the Elementor authoring Home.

- [ ] **Step 2: Run the new fidelity test and verify RED**

After local seed/migration:

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected before all runtime fixes: FAIL on the first real DOM/geometry difference. Do not pre-emptively weaken the assertion.

- [ ] **Step 3: Fix only source-of-drift causes**

Use browser evidence to correct renderer markup or target token/style loading. Do not introduce a new redesign CSS layer. Prefer matching the target template part/class structure so the preserved `client-preview.css` supplies the geometry.

- [ ] **Step 4: Restore target shared CTA mutation expectations**

In `client-preview-content-mutation.test.sh`, require `LIVE SHARED CTA TITLE` to render on Home again after Site/CTA mutation and after routine reseed. Retain assertions that the Elementor-owned Home body is not replaced by legacy `rosa_home_content` mutations.

- [ ] **Step 5: Run the focused runtime gates**

Run:

```bash
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs \
  wordpress/scripts/tests/elementor-authoring-runtime.test.sh \
  wordpress/scripts/tests/client-preview-content-mutation.test.sh
git commit -m "test(wordpress): enforce finished Home geometry on Elementor runtime"
```

---

### Task 7: Prove About and Contact Stayed on the Finished Template

**Files:**
- Modify only if a failing target comparison requires it: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php`
- Modify only if a failing target comparison requires it: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php`
- Modify only if needed by real drift: About/Contact partials under `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/`.
- Modify: `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`
- Reuse: existing `client-preview-about-contract.test.sh`, `client-preview-contact-contract.test.sh`, accessibility/RTL tests.

**Interfaces:**
- About remains seven widgets: page hero, who, stats, cards, feature, why, proof.
- Contact remains three widgets: page hero, contact layout, map.
- Both receive the shared CTA from the authoring template.

- [ ] **Step 1: Add zero-drift assertions before changing code**

Require About and Contact Elementor output to preserve the target markers already present in the pinned static templates:

```text
About: data-preview-page-hero, data-preview-who-we-are, data-preview-stats,
       data-preview-about-cards, data-preview-feature-banner,
       data-preview-why-us, data-preview-family-strip, data-preview-contact-cta

Contact: data-preview-page-hero, data-preview-contact-layout,
         data-preview-map-role, data-preview-contact-cta
```

- [ ] **Step 2: Run tests**

Run:

```bash
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
```

Expected: if current About/Contact conversion already matches, PASS without production code changes. If a test fails, treat that exact difference as RED and make the smallest markup/control fix needed to match the pinned target.

- [ ] **Step 3: Verify no forbidden ownership leaked into Elementor**

Confirm Contact Elementor settings do not store phone/email/address values; they must resolve from centralized Business settings at render time. Confirm the form remains presentation/mailto only.

- [ ] **Step 4: Commit only if files changed**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php \
  wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview \
  wordpress/scripts/tests/elementor-authoring-runtime.test.sh
git commit -m "fix(wordpress): keep About and Contact on finished template"
```

If no production files changed, commit only the strengthened runtime test with message `test(wordpress): pin About and Contact finished-template topology`.

---

### Task 8: Prove Elementor Edits Persist Without Owning WooCommerce or Shared Business Data

**Files:**
- Modify: `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-content-zero-drift.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-content-mutation.test.sh`

**Interfaces:**
- Elementor-owned mutation: Home text/media.
- Woo-owned data: Featured/Latest products.
- Site/CTA-owned data: shared pre-footer CTA.
- Business-owned data: phone/email/address/WhatsApp.

- [ ] **Step 1: Change mutation targets to the target Home schema**

Mutate one text setting and one image setting in the seeded Home Elementor document, for example:

```text
rosa-home-who.who_title = "LIVE ELEMENTOR WHO TITLE"
rosa-home-hero.image = a temporary attachment ID
```

- [ ] **Step 2: Run routine seeds and verify the test is RED until preservation logic matches the new topology**

Run:

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Expected during migration work: FAIL if the script still searches for latest-custom widget names/settings.

- [ ] **Step 3: Update assertions**

After `client-preview-seed.sh` and `elementor-authoring-seed.sh` without `--force`, assert:

- the mutated Elementor text remains;
- the mutated Elementor image remains;
- Home parity meta remains `2`;
- Featured/Latest product cards still come from WooCommerce queries and are not serialized into Home Elementor settings;
- a changed Site CTA still changes the shared Home CTA;
- changed Business contact values still change Contact/shared contact surfaces;
- routine seeds do not rewrite edited About/Contact documents.

- [ ] **Step 4: Run mutation/zero-drift gates**

Run:

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress/scripts/tests/elementor-authoring-mutation.test.sh \
  wordpress/scripts/tests/client-preview-content-zero-drift.test.sh \
  wordpress/scripts/tests/client-preview-content-mutation.test.sh
git commit -m "test(wordpress): protect target Elementor ownership boundaries"
```

---

### Task 9: Integrate Full Verification, Visual Capture, and Retire Latest-Custom Home Code

**Files:**
- Create: `wordpress/scripts/medicashop-elementor-parity-capture.mjs`
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Modify: `docs/runbooks/wordpress-client-content-controls.md`
- Delete only after search proves unreferenced: the `latest-rosa-home*` CSS/JS files and seven `latest-home-*.php` partials listed in File Structure.

**Interfaces:**
- Full verifier must gate reference contract → static contracts → seeding → migration/runtime → mutation/zero-drift → accessibility/RTL → target Home fidelity.
- Capture accepts reference URL first and local URL second.

- [ ] **Step 1: Add the target gates to the full verifier**

Add, in dependency order:

```bash
bash wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
# existing static/settings/seed tests
# existing Elementor migration/runtime/mutation tests
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Remove `latest-rosa-home-reference-contract.test.sh`, `latest-rosa-home-elementor-contract.test.php`, and `latest-rosa-home-parity.test.mjs` from the active verification path.

- [ ] **Step 2: Create the capture utility**

Capture EN and AR at 1440, 1280, 1024, 768, 431, 390, and 360 widths with `prefers-reduced-motion: reduce`. Save full-page and above-the-fold images under:

```text
artifacts/medicashop-elementor-parity/
  reference/
  local/
```

The CLI must be:

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/
```

- [ ] **Step 3: Run the complete verifier**

Run:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected final line only after every preceding gate passes:

```text
PASS: Rosa WordPress runtime matches the finished template with Elementor authoring, bilingual routes, editable content and catalogue regressions intact
```

- [ ] **Step 4: Run visual capture and manually compare matched viewports**

Run the capture command above. Reject differences in section topology, hero height, rail width, product grid density, promo mosaic, CTA, footer, mobile menu, typography, media crop, RTL, or responsive stacking.

Do not declare parity from automated tests alone.

- [ ] **Step 5: Search for obsolete latest-custom runtime references**

Run:

```bash
git grep -nE 'latest-rosa-home|latest-home-(hero|family-discovery|comprehensive|confidence|contact-band|assurance|quotation)' -- wordpress ':!docs/superpowers/**'
```

Expected before cleanup: only obsolete files/tests themselves. If active PHP/scripts still reference them, remove those references first.

- [ ] **Step 6: Delete obsolete latest-custom Home runtime files only after the search is clean**

Remove the three `latest-rosa-home*` assets and seven `latest-home-*.php` partials. Remove obsolete latest-custom Home test files only after their replacement gates are green and `client-preview-runtime-verify.sh` no longer calls them.

- [ ] **Step 7: Re-run the full verifier after deletion**

Run:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: same complete PASS line as Step 3.

- [ ] **Step 8: Update the runbook**

Document:

- pinned visual target commit;
- nine Home Elementor widgets;
- seven About widgets and three Contact widgets;
- shared CTA ownership;
- WooCommerce product ownership;
- Home parity version `2` migration behavior;
- normal seed commands and explicit warning against routine `--force`;
- full verifier command;
- parity capture command;
- no Hostinger deployment in this phase.

- [ ] **Step 9: Commit**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh \
  wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests \
  docs/runbooks/wordpress-client-content-controls.md
git commit -m "chore(wordpress): finalize finished-template Elementor parity"
```

---

## Final Acceptance Checklist

Before calling the conversion complete, all of the following must be evidenced in the same final verification cycle:

- `medicashop-elementor-reference-contract.test.sh` passes.
- `medicashop-elementor-home-contract.test.php` passes.
- Home seed order is exactly nine target widgets.
- untouched parity-1 Home migrates to parity 2; edited parity-1 Home is not overwritten.
- Home renders `hero → who → featured → feature → latest → promos → why → proof → evidence → shared CTA`.
- About and Contact preserve the pinned finished-template topology.
- target 1440/1280/1024/768/431/390/360 Home geometry passes without weakened thresholds.
- EN and AR have no overflow/collision and correct RTL behavior.
- Featured/Latest products remain dynamic WooCommerce output.
- Elementor EN text, AR text, and representative media edits persist through routine seeds.
- shared Site/CTA and Business settings remain dynamic and independent.
- no broken images, forbidden proprietary/reference requests, console errors, or accessibility regressions.
- matched reference/local screenshots have been manually reviewed.
- obsolete latest-custom Home runtime code is no longer active.
- no Hostinger/production mutation occurred.
