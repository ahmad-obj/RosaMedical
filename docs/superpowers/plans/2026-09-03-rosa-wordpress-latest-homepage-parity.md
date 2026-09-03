# Rosa WordPress Latest Homepage Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the obsolete MedicaShop-derived WordPress Homepage with an exact WordPress/Elementor reproduction of the latest Rosa custom Homepage while preserving the validated authoring, WooCommerce, EN/AR, RTL, and migration-safety architecture.

**Architecture:** Keep Elementor Free as the Home page-body authoring layer, but change its deterministic Home document from the old nine-widget MedicaShop topology to seven Rosa-specific widgets whose rendered HTML deliberately mirrors the latest custom frontend class names and section boundaries. Port the exact latest Rosa design tokens, Homepage CSS, hero/family interactions, and source media into WordPress; keep catalogue/business truth outside Elementor. Add a Home-only parity migration marker so untouched v2 Home documents can move automatically while edited documents are never silently overwritten.

**Tech Stack:** WordPress/PHP 8+, Elementor Free, WooCommerce, Bash/WP-CLI, vanilla JavaScript, CSS, Playwright via the existing `apps/web` package.

**Spec:** `docs/superpowers/specs/2026-09-03-rosa-wordpress-latest-site-parity-design.md`

## Global Constraints

- Visual/source authority is `transfer/rose-medical-final-main-ready-2026-08-17` at `57f2df01916ec1d7de65196994913711e9fb3039`; the same latest frontend source is present on the working branch under `apps/web/**`.
- Production acceptance URL is `https://rosamedical.org/`, but no production/Hostinger change is authorized by this plan.
- Exact copy means same composition, hierarchy, typography, spacing, media treatment, grid geometry, CTA emphasis, responsive behavior, RTL intent, and reproducible interaction behavior.
- Preserve Elementor Free ownership of EN/AR Home body content and media.
- Preserve WooCommerce ownership of products, SKUs, families/categories, variations, product media, descriptions, and future pricing.
- Preserve centralized Rosa Business and Site & CTA settings for phone, email, address, WhatsApp, navigation, and shared shell content.
- Do not add Elementor Pro.
- Do not add a new Contact submission backend.
- Do not force-reseed edited Elementor documents.
- Do not weaken existing no-overlap, no-overflow, accessibility, RTL, console, or mutation-preservation checks.
- Homepage parity viewports: 1440, 1280, 1024, 768, 431, 390, and 360 CSS pixels.
- Keep the verified Elementor root safeguards: zero wrapper gap/padding, non-wrapping vertical root, and `.rosa-elementor-root` rendered through container `css_classes`.
- The latest source Homepage order is exactly: `PublicHeroCarousel`, `FamilyDiscovery`, `ComprehensivePlans`, `SecuringConfidence`, `HomeContactBand`, `ClientSuccessAssurance`, `QuotationCta`.
- The latest source hero has four slides, autoplay interval `4750ms`, drag threshold `48px`, reduced-motion autoplay disabled, focus/drag/hidden-page autoplay pause, keyboard-operable dots, desktop/mobile media variants, and RTL-safe dot behavior.

---

## File Structure

### Reference source files — read-only implementation oracle

- `apps/web/src/features/homepage/homepage.tsx` — authoritative seven-section order.
- `apps/web/src/features/homepage/homepage.data.ts` — authoritative EN/AR Home copy and five-family order.
- `apps/web/src/features/homepage/sections/family-discovery.tsx` — authoritative Family Discovery wrapper.
- `apps/web/src/features/homepage/sections/home-family-gallery.tsx` — authoritative family ordering, covers, PDF interaction, mobile scroll behavior.
- `apps/web/src/features/homepage/sections/client-home-sections.tsx` — authoritative Comprehensive/Confidence/Contact/Assurance markup and media focal points.
- `apps/web/src/features/homepage/sections/quotation-cta.tsx` — authoritative quotation CTA composition.
- `apps/web/src/features/public-hero/public-hero-carousel.tsx` — authoritative carousel DOM/interaction behavior.
- `apps/web/src/features/public-hero/public-hero.data.ts` — authoritative Home hero copy/media/focal points.
- `apps/web/src/features/homepage/hero-carousel-state.ts` — authoritative `4750ms` autoplay and navigation semantics.
- `apps/web/src/styles/tokens.css` — authoritative Rosa design tokens.
- `apps/web/src/styles/public-hero.css` — authoritative hero geometry and responsive styling.
- `apps/web/src/styles/home-client-redesign.css` — authoritative compact Homepage layout.
- `apps/web/src/styles/home-client-redesign-polish.css` — authoritative final editorial-media/tablet polish.
- `apps/web/src/styles/home-client-interaction-fixes.css` — authoritative final family-card interaction rules.

### WordPress files to create

- `wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh` — pins the custom-source topology/tokens/behavior values the WordPress port must follow.
- `wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php` — validates seven new Home widgets, exact order, protected settings, media mapping, and root classes.
- `wordpress/scripts/tests/latest-rosa-home-parity.test.mjs` — local browser contract for Home topology, geometry, responsive layout, carousel, RTL, overflow, and collisions.
- `wordpress/scripts/latest-rosa-home-parity-capture.mjs` — side-by-side reference/local screenshots at all required viewports with reduced motion enabled.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css` — WordPress port of latest `public-hero.css` + Home-specific final-loaded CSS.
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/latest-rosa-home.js` — vanilla implementation of hero carousel and family-gallery mobile controls.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-comprehensive.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-confidence.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-contact-band.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-assurance.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-quotation.php`

### WordPress files to modify

- `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css` — make Rosa token values match latest source exactly while retaining compatibility aliases.
- `wordpress/wp-content/themes/rosa-medical-child/functions.php` — enqueue latest Home CSS/JS only when the current page is an EN/AR Home authoring page.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php` — replace obsolete Home structured defaults with exact latest Home EN/AR copy.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php` — allow exact latest Home hero/editorial media keys.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php` — replace old nine Home classes with seven latest-Rosa widgets.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php` — register exactly the seven new Home widget classes plus unchanged About/Contact classes.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php` — build the seven-widget Home document and add `public-page public-page--home` to the Home root.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php` — add safe Home-parity migration metadata/behavior without disturbing About/Contact v2 authoring.
- `wordpress/scripts/client-preview-seed.sh` — import the exact Rosa-owned latest Home media into the WordPress Media Library idempotently.
- `wordpress/scripts/elementor-authoring-seed.sh` — accept the explicit Home parity migration status; never imply `--force`.
- `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php` — update expected Home topology and validate fresh Home parity metadata.
- `wordpress/scripts/tests/elementor-authoring-mutation.test.sh` — prove normal seeds preserve post-parity Home Elementor edits.
- `wordpress/scripts/tests/elementor-authoring-runtime.test.sh` — verify Home is on latest parity schema while About/Contact stay valid on their existing authoring schema.
- `wordpress/scripts/client-preview-runtime-verify.sh` — replace the old MedicaShop Home fidelity gate with the new Rosa parity gates.
- `docs/runbooks/wordpress-client-content-controls.md` — document latest-Home authoring/migration behavior and reference capture command.

---

### Task 1: Pin the Latest Rosa Homepage Reference and Port Design Tokens

**Files:**
- Create: `wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- Test: `wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh`

**Interfaces:**
- Consumes: latest custom source files under `apps/web/**`.
- Produces: exact WordPress token aliases used by every later Home partial/CSS rule: `--color-rosa-red`, `--color-rosa-red-dark`, `--color-ink`, `--color-ink-soft`, `--color-warm-white`, `--color-paper`, `--color-mist`, `--color-steel`, `--color-border`, `--font-editorial`, `--font-interface`, `--font-arabic`, `--container-wide`, `--container-standard`, `--page-gutter`, spacing/radius/motion variables, plus existing `--rosa-*` compatibility aliases.

- [ ] **Step 1: Write the failing source/token contract**

Create a shell test that fails against the current WordPress tokens and pins the authoritative source values:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SOURCE_HOME="$ROOT/apps/web/src/features/homepage/homepage.tsx"
SOURCE_STATE="$ROOT/apps/web/src/features/homepage/hero-carousel-state.ts"
SOURCE_TOKENS="$ROOT/apps/web/src/styles/tokens.css"
WP_TOKENS="$ROOT/wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

expected=(PublicHeroCarousel FamilyDiscovery ComprehensivePlans SecuringConfidence HomeContactBand ClientSuccessAssurance QuotationCta)
last=0
for symbol in "${expected[@]}"; do
  line="$(grep -n "<$symbol\|$symbol model=\|$symbol intro=" "$SOURCE_HOME" | tail -n1 | cut -d: -f1)"
  [[ "$line" =~ ^[0-9]+$ && "$line" -gt "$last" ]] || fail "latest Homepage order drifted at $symbol"
  last="$line"
done

grep -Fq 'HERO_AUTOPLAY_MS = 4_750' "$SOURCE_STATE" || fail 'source hero autoplay changed'
for literal in '#e00815' '#b9000b' '#191917' '#2d2d2a' '#f9f7f2' '#ffffff' '#f1f1ee' '#646b70' '#d7d7d1' '80rem' '72rem' 'clamp(1.25rem, 4vw, 5rem)' 'cubic-bezier(0.22, 1, 0.36, 1)'; do
  grep -Fq -- "$literal" "$SOURCE_TOKENS" || fail "source token missing: $literal"
  grep -Fq -- "$literal" "$WP_TOKENS" || fail "WordPress token parity missing: $literal"
done

printf 'PASS: latest Rosa Homepage source order, hero timing and design tokens are pinned\n'
```

- [ ] **Step 2: Run it and verify RED**

Run:

```bash
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
```

Expected: FAIL on one or more WordPress token literals such as `#191917`, `80rem`, or `clamp(1.25rem, 4vw, 5rem)`.

- [ ] **Step 3: Port the authoritative token set with compatibility aliases**

Rewrite the WordPress `:root` token layer so the source names are exact and legacy WordPress names alias them rather than diverge. The beginning must be structurally equivalent to:

```css
:root {
  --color-rosa-red: #e00815;
  --color-rosa-red-dark: #b9000b;
  --color-ink: #191917;
  --color-ink-soft: #2d2d2a;
  --color-warm-white: #f9f7f2;
  --color-paper: #ffffff;
  --color-mist: #f1f1ee;
  --color-steel: #646b70;
  --color-border: #d7d7d1;

  --font-editorial: var(--font-lora), Georgia, serif;
  --font-interface: var(--font-inter), Arial, sans-serif;
  --font-arabic: var(--font-tajawal), "GE SS Two", "GE SS Text", "GE SS", Tahoma, Arial, sans-serif;

  --container-wide: 80rem;
  --container-standard: 72rem;
  --container-reading: 46rem;
  --page-gutter: clamp(1.25rem, 4vw, 5rem);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-section: clamp(4.5rem, 9vw, 8rem);
  --radius-control: 0.25rem;
  --radius-surface: 0.125rem;
  --motion-micro: 160ms;
  --motion-component: 280ms;
  --motion-section: 580ms;
  --motion-hero: 960ms;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);

  --rosa-red: var(--color-rosa-red);
  --rosa-red-strong: var(--color-rosa-red-dark);
  --rosa-ink: var(--color-ink);
  --rosa-ink-soft: var(--color-ink-soft);
  --rosa-white: var(--color-paper);
  --rosa-surface: var(--color-warm-white);
  --rosa-surface-strong: var(--color-mist);
  --rosa-text: var(--color-ink);
  --rosa-muted: var(--color-steel);
  --rosa-border: var(--color-border);
  --rosa-shell: var(--container-wide);
  --rosa-gutter: var(--page-gutter);
}
```

Keep the existing reduced-motion override, but map its WordPress motion aliases to `0ms` rather than altering the authoritative source values.

- [ ] **Step 4: Run the reference contract**

Run:

```bash
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
```

Expected: `PASS: latest Rosa Homepage source order, hero timing and design tokens are pinned`.

- [ ] **Step 5: Commit**

```bash
git add wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css
git commit -m "test(wordpress): pin latest Rosa homepage reference"
```

---

### Task 2: Seed Exact Latest Homepage Content and Media Inputs

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php`
- Modify: `wordpress/scripts/client-preview-seed.sh`
- Modify: `wordpress/scripts/tests/content-settings.test.php`
- Modify: `wordpress/scripts/tests/media-settings.test.php`

**Interfaces:**
- Consumes: exact EN/AR copy from `homepage.data.ts` and `public-hero.data.ts`; exact media files under `apps/web/public/media/**`.
- Produces: `ContentSettings::get('home', <key>, <locale>)` values for the seven latest Home widgets and `MediaSettings::id(<key>)` IDs for exact reference assets.

- [ ] **Step 1: Add failing content/media assertions**

Update the PHP tests to require the new Home keys. At minimum assert these exact defaults and media allow-list entries:

```php
if (ContentSettings::get('home', 'family_title', 'en') !== 'Our range of products') fail_test('latest Home family title missing');
if (ContentSettings::get('home', 'comprehensive_title', 'en') !== 'Comprehensive Plans') fail_test('latest Home comprehensive title missing');
if (ContentSettings::get('home', 'confidence_title', 'en') !== 'Securing Confidence') fail_test('latest Home confidence title missing');
if (ContentSettings::get('home', 'contact_title', 'en') !== 'Get in Touch Now') fail_test('latest Home contact title missing');
if (ContentSettings::get('home', 'assurance_title', 'en') !== 'Services Assure our Clients Success') fail_test('latest Home assurance title missing');
if (ContentSettings::get('home', 'quotation_title', 'en') !== 'Prepare your instruments inquiry.') fail_test('latest Home quotation title missing');
if (ContentSettings::get('home', 'hero_1_title', 'en') !== 'Precision instruments. Procurement made clear.') fail_test('latest Home hero slide 1 missing');
if (ContentSettings::get('home', 'hero_4_title', 'ar') !== 'حوّل تفاصيل الكتالوج إلى طلب واحد منظم.') fail_test('latest Arabic Home hero slide 4 missing');

$requiredMedia = [
    'home-hero-01-desktop', 'home-hero-01-mobile',
    'home-hero-02-desktop', 'home-hero-02-mobile',
    'home-hero-03-desktop', 'home-hero-03-mobile',
    'home-hero-04-desktop', 'home-hero-04-mobile',
    'home-specialty-plastic-surgery', 'home-specialty-orthopedics',
    'home-specialty-maxillofacial', 'home-specialty-orthodontics',
    'home-specialty-spine', 'home-securing-confidence',
];
foreach ($requiredMedia as $key) {
    if (! in_array($key, MediaSettings::allowedKeys(), true)) fail_test("latest Home media key missing: {$key}");
}
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
php wordpress/scripts/tests/content-settings.test.php
php wordpress/scripts/tests/media-settings.test.php
```

Expected: FAIL because latest Home keys are not yet in schema/allow-list.

- [ ] **Step 3: Replace the obsolete Home schema with latest source groups**

Keep the option name `rosa_home_content`, but replace the obsolete MedicaShop groups with these groups and exact source-derived EN/AR defaults:

```php
'groups' => [
    'Hero carousel' => [
        'hero_1_eyebrow','hero_1_title','hero_1_body',
        'hero_2_eyebrow','hero_2_title','hero_2_body',
        'hero_3_eyebrow','hero_3_title','hero_3_body',
        'hero_4_eyebrow','hero_4_title','hero_4_body',
    ],
    'Product range' => ['family_title'],
    'Comprehensive Plans' => [
        'comprehensive_title','comprehensive_body','comprehensive_lead_specialty',
        'comprehensive_specialty_1','comprehensive_specialty_2','comprehensive_specialty_3','comprehensive_specialty_4',
    ],
    'Securing Confidence' => ['confidence_title','confidence_body','confidence_image_alt'],
    'Direct Support' => ['contact_eyebrow','contact_title','contact_whatsapp_label','contact_email_label'],
    'Client Success' => [
        'assurance_title','assurance_badge',
        'assurance_1_title','assurance_1_body',
        'assurance_2_title','assurance_2_body',
        'assurance_3_title','assurance_3_body',
        'assurance_4_title','assurance_4_body',
    ],
    'Quotation' => ['quotation_eyebrow','quotation_title','quotation_body','quotation_button'],
],
```

Copy every default verbatim from `PUBLIC_HERO_COPY.home` and `HOME_PAGE_MODEL` / `HOME_PAGE_MODEL_AR`. Do not shorten or editorialize copy in this parity task.

- [ ] **Step 4: Add the exact media keys and idempotent imports**

Extend `MediaSettings::allowedKeys()` with the fourteen keys above. In `client-preview-seed.sh`, add idempotent imports using the existing `_rosa_preview_source_path` mechanism:

```bash
import_media home-hero-01-desktop 'apps/web/public/media/editorial/home-hero/client-v5/hero-01-desktop.webp'
import_media home-hero-01-mobile  'apps/web/public/media/editorial/home-hero/client-v5/hero-01-mobile.webp'
import_media home-hero-02-desktop 'apps/web/public/media/editorial/home-hero/client-v5/hero-02-desktop.webp'
import_media home-hero-02-mobile  'apps/web/public/media/editorial/home-hero/client-v5/hero-02-mobile.webp'
import_media home-hero-03-desktop 'apps/web/public/media/editorial/home-hero/client-v5/hero-03-desktop.webp'
import_media home-hero-03-mobile  'apps/web/public/media/editorial/home-hero/client-v5/hero-03-mobile.webp'
import_media home-hero-04-desktop 'apps/web/public/media/editorial/home-hero/client-v5/hero-04-desktop.webp'
import_media home-hero-04-mobile  'apps/web/public/media/editorial/home-hero/client-v5/hero-04-mobile.webp'
import_media home-specialty-plastic-surgery 'apps/web/public/media/editorial/home-specialties/plastic-surgery.webp'
import_media home-specialty-orthopedics 'apps/web/public/media/editorial/home-specialties/orthopedics.webp'
import_media home-specialty-maxillofacial 'apps/web/public/media/editorial/home-specialties/maxillofacial.webp'
import_media home-specialty-orthodontics 'apps/web/public/media/editorial/home-specialties/orthodontics.webp'
import_media home-specialty-spine 'apps/web/public/media/editorial/home-specialties/spine.webp'
import_media home-securing-confidence 'apps/web/public/media/editorial/home-specialties/securing-confidence.webp'
```

Keep the old media keys in `allowedKeys()` temporarily for rollback compatibility; stop using them in the latest Home seed. Do not delete existing attachments/options.

- [ ] **Step 5: Run tests and seed**

```bash
php wordpress/scripts/tests/content-settings.test.php
php wordpress/scripts/tests/media-settings.test.php
bash wordpress/scripts/client-preview-seed.sh
```

Expected: content/media tests PASS and seed reports success without duplicating existing attachments on a second run.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Settings/ContentSchema.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Settings/MediaSettings.php \
        wordpress/scripts/client-preview-seed.sh \
        wordpress/scripts/tests/content-settings.test.php \
        wordpress/scripts/tests/media-settings.test.php
git commit -m "feat(wordpress): seed latest Rosa homepage content and media"
```

---

### Task 3: Replace the Nine Old Home Elementor Widgets With Seven Latest-Rosa Widgets

**Files:**
- Create: `wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`
- Modify: `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php`

**Interfaces:**
- Produces these Elementor widget names in exactly this order:
  1. `rosa-home-hero-carousel`
  2. `rosa-home-family-discovery`
  3. `rosa-home-comprehensive`
  4. `rosa-home-confidence`
  5. `rosa-home-contact-band`
  6. `rosa-home-assurance`
  7. `rosa-home-quotation`
- Home root class: `rosa-elementor-root public-page public-page--home`.
- About/Contact widget names and registration remain unchanged.

- [ ] **Step 1: Write the failing seven-widget contract**

Create a PHP contract that loads `ElementorSeedData` and asserts:

```php
$widgets = rosa_test_widgets(ElementorSeedData::build('home', 'en'));
$expected = [
    'rosa-home-hero-carousel',
    'rosa-home-family-discovery',
    'rosa-home-comprehensive',
    'rosa-home-confidence',
    'rosa-home-contact-band',
    'rosa-home-assurance',
    'rosa-home-quotation',
];
$actual = array_map(static fn(array $widget): string => (string) ($widget['widgetType'] ?? ''), $widgets);
if ($actual !== $expected) fail_test('latest Rosa Home Elementor topology mismatch');

$root = ElementorSeedData::build('home', 'en')[0] ?? [];
$rootClasses = (string) (($root['settings']['css_classes'] ?? ''));
foreach (['rosa-elementor-root','public-page','public-page--home'] as $class) {
    if (! preg_match('/(?:^|\s)' . preg_quote($class, '/') . '(?:\s|$)/', $rootClasses)) {
        fail_test("Home root missing {$class}");
    }
}
```

Also assert the hero widget receives four desktop and four mobile media controls, while Contact-band hrefs are absent from Elementor settings so phone/email/WhatsApp remain centralized.

- [ ] **Step 2: Run it and verify RED**

```bash
php wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php
```

Expected: FAIL showing the old nine-widget sequence.

- [ ] **Step 3: Replace `HomeWidgets.php` with seven fixed-structure widgets**

Use the existing `AbstractRosaSectionWidget` helpers. The class interfaces must be:

```php
final class HomeHeroCarouselWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-hero-carousel'; }
    public function get_title(): string { return 'Rosa Home — Hero Carousel'; }
    protected function render(): void {
        $this->renderSection('latest-home-hero', [
            'desktop_1','mobile_1','desktop_2','mobile_2',
            'desktop_3','mobile_3','desktop_4','mobile_4',
        ]);
    }
}

final class HomeFamilyDiscoveryWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-family-discovery'; }
    public function get_title(): string { return 'Rosa Home — Product Range'; }
    protected function render(): void { $this->renderSection('latest-home-family-discovery'); }
}

final class HomeComprehensiveWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-comprehensive'; }
    public function get_title(): string { return 'Rosa Home — Comprehensive Plans'; }
    protected function render(): void {
        $this->renderSection('latest-home-comprehensive', ['lead_image','specialty_1_image','specialty_2_image','specialty_3_image','specialty_4_image']);
    }
}

final class HomeConfidenceWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-confidence'; }
    public function get_title(): string { return 'Rosa Home — Securing Confidence'; }
    protected function render(): void { $this->renderSection('latest-home-confidence', ['image']); }
}

final class HomeContactBandWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-contact-band'; }
    public function get_title(): string { return 'Rosa Home — Direct Support'; }
    protected function render(): void { $this->renderSection('latest-home-contact-band'); }
}

final class HomeAssuranceWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-assurance'; }
    public function get_title(): string { return 'Rosa Home — Client Success'; }
    protected function render(): void { $this->renderSection('latest-home-assurance'); }
}

final class HomeQuotationWidget extends AbstractRosaSectionWidget {
    public function get_name(): string { return 'rosa-home-quotation'; }
    public function get_title(): string { return 'Rosa Home — Quotation CTA'; }
    protected function render(): void { $this->renderSection('latest-home-quotation'); }
}
```

Register fixed content/media controls corresponding exactly to Task 2 keys. Do not expose layout, breakpoint, route, phone, email, WhatsApp number, catalogue family truth, or arbitrary CSS controls.

- [ ] **Step 4: Update WidgetRegistry and ElementorSeedData**

Replace only the nine Home class strings with the seven new classes. Keep all About/Contact registrations untouched.

For Home specs, use this exact seed shape:

```php
return [
    self::spec('rosa-home-hero-carousel', 'home', [
        'hero_1_eyebrow','hero_1_title','hero_1_body',
        'hero_2_eyebrow','hero_2_title','hero_2_body',
        'hero_3_eyebrow','hero_3_title','hero_3_body',
        'hero_4_eyebrow','hero_4_title','hero_4_body',
    ], [
        'desktop_1' => 'home-hero-01-desktop', 'mobile_1' => 'home-hero-01-mobile',
        'desktop_2' => 'home-hero-02-desktop', 'mobile_2' => 'home-hero-02-mobile',
        'desktop_3' => 'home-hero-03-desktop', 'mobile_3' => 'home-hero-03-mobile',
        'desktop_4' => 'home-hero-04-desktop', 'mobile_4' => 'home-hero-04-mobile',
    ]),
    self::spec('rosa-home-family-discovery', 'home', ['family_title']),
    self::spec('rosa-home-comprehensive', 'home', [
        'comprehensive_title','comprehensive_body','comprehensive_lead_specialty',
        'comprehensive_specialty_1','comprehensive_specialty_2','comprehensive_specialty_3','comprehensive_specialty_4',
    ], [
        'lead_image' => 'home-specialty-plastic-surgery',
        'specialty_1_image' => 'home-specialty-orthopedics',
        'specialty_2_image' => 'home-specialty-maxillofacial',
        'specialty_3_image' => 'home-specialty-orthodontics',
        'specialty_4_image' => 'home-specialty-spine',
    ]),
    self::spec('rosa-home-confidence', 'home', ['confidence_title','confidence_body','confidence_image_alt'], ['image' => 'home-securing-confidence']),
    self::spec('rosa-home-contact-band', 'home', ['contact_eyebrow','contact_title','contact_whatsapp_label','contact_email_label']),
    self::spec('rosa-home-assurance', 'home', [
        'assurance_title','assurance_badge',
        'assurance_1_title','assurance_1_body','assurance_2_title','assurance_2_body',
        'assurance_3_title','assurance_3_body','assurance_4_title','assurance_4_body',
    ]),
    self::spec('rosa-home-quotation', 'home', ['quotation_eyebrow','quotation_title','quotation_body','quotation_button']),
];
```

When building the root, set Home classes separately:

```php
$rootClasses = $pageType === 'home'
    ? 'rosa-elementor-root public-page public-page--home'
    : 'rosa-elementor-root';
```

- [ ] **Step 5: Run contracts**

```bash
php wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
php wordpress/scripts/tests/elementor-authoring-integration.test.php
```

Expected: PASS; About/Contact counts remain unchanged.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php \
        wordpress/scripts/tests/elementor-authoring-seed-contract.test.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/HomeWidgets.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/WidgetRegistry.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php
git commit -m "feat(wordpress): model latest Rosa homepage in Elementor"
```

---

### Task 4: Render the Latest Rosa Homepage DOM and Interactions

**Files:**
- Create: seven `latest-home-*.php` template parts listed in File Structure.
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/latest-rosa-home.js`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Test: `wordpress/scripts/tests/latest-rosa-home-parity.test.mjs` initially as topology/interaction RED test.

**Interfaces:**
- Consumes: widget `$args` supplied by `AbstractRosaSectionWidget::renderSection()` and centralized `rosa_theme_business_value()` / existing business helper functions.
- Produces: source-compatible classes/data attributes so the latest custom CSS can be ported directly.

- [ ] **Step 1: Write failing browser topology/interaction assertions**

Create `latest-rosa-home-parity.test.mjs` and first assert section order and basic carousel contract at 1440px:

```js
const expected = [
  'home-hero',
  'family-discovery',
  'comprehensive-plans',
  'securing-confidence',
  'home-contact-band',
  'client-success-assurance',
  'quotation-cta',
];
const actual = await page.locator('.public-page--home [data-section]').evaluateAll((els) =>
  els.map((el) => el.getAttribute('data-section')),
);
assert.deepEqual(actual, expected);
assert.equal(await page.locator('.public-hero-carousel__slide').count(), 4);
assert.equal(await page.locator('.public-hero-carousel__dot').count(), 4);
assert.deepEqual(
  await page.locator('[data-home-family-gallery] [data-family]').evaluateAll((els) => els.map((el) => el.getAttribute('data-family'))),
  ['scissors','cutters','punches','chisels','knives'],
);
```

Add a dot-click assertion: clicking dot 2 sets `aria-current="true"` on dot 2 and changes `[data-active-slide]`. Add `page.emulateMedia({ reducedMotion: 'reduce' })` so autoplay does not make geometry tests flaky.

- [ ] **Step 2: Run the browser test and verify RED**

```bash
node wordpress/scripts/tests/latest-rosa-home-parity.test.mjs http://localhost:8088/
```

Expected: FAIL because the old nine-section DOM is still rendered by current migrated Home documents.

- [ ] **Step 3: Implement source-compatible PHP markup**

Each partial must intentionally use the source classes. Examples:

Hero root:

```php
<section class="public-hero public-hero-carousel" data-section="home-hero" data-public-hero-page="home" data-active-slide="precision-instruments" aria-roledescription="carousel" aria-labelledby="home-title">
```

Family Discovery root/gallery:

```php
<section class="section home-product-range" data-section="family-discovery" aria-labelledby="family-discovery-title">
  <div class="container container--wide">
    <h2 id="family-discovery-title" class="home-compact-section-title home-compact-section-title--center"><?php echo esc_html($settings['family_title'] ?? ''); ?></h2>
    <div class="home-family-gallery-shell">
      <div class="home-family-gallery__mobile-controls">...</div>
      <ul class="home-family-gallery" data-home-family-gallery>...</ul>
    </div>
  </div>
</section>
```

Comprehensive/Confidence/Contact/Assurance/Quotation must mirror the classes in the corresponding React source (`home-comprehensive__lead`, `home-specialty`, `home-clinical-media`, `home-confidence__grid`, `home-contact-band__surface`, `home-assurance__grid`, `quotation-cta__surface`, `procurement-panel--premium-cta`, etc.). Keep semantic heading levels, lists, figures, labels, and `aria-labelledby` relationships equivalent.

For the direct-support band, derive hrefs from centralized business settings rather than Elementor:

```php
$phone = rosa_theme_business_value('whatsapp', rosa_theme_business_value('phone'));
$digits = preg_replace('/\D+/', '', $phone);
$whatsappHref = $digits !== '' ? 'https://wa.me/' . $digits : '';
$email = rosa_theme_business_value('email');
$emailHref = is_email($email) ? 'mailto:' . $email : '';
```

Do not add phone/email/WhatsApp number Elementor controls.

For family covers, use the five authoritative source images/order and existing catalogue/document URLs where already available. If a source family cover is SVG and Media Library import is unsuitable, copy that Rosa-owned file into `rosa-medical-child/assets/media/home/family-covers/` and render it code-owned; do not convert it to a made-up image or an Elementor content field.

- [ ] **Step 4: Implement vanilla carousel/family interactions**

`latest-rosa-home.js` must use the same public data attributes/classes and these fixed behavioral constants:

```js
const AUTOPLAY_MS = 4750;
const DRAG_THRESHOLD_PX = 48;
```

Behavior:
- four fixed slides;
- next index wraps `(index + 1) % count`;
- previous wraps `(index - 1 + count) % count`;
- autoplay stops when `prefers-reduced-motion: reduce`, focus is inside carousel, pointer drag is active, or `document.hidden` is true;
- manual dot click resets autoplay epoch;
- ArrowLeft/ArrowRight operate the dot group and focus the activated dot;
- horizontal pointer movement of at least 48px changes slide; vertical-dominant movement does not;
- update `data-active-slide`, slide hidden/current state, and dot `aria-current`/`tabIndex` atomically;
- mobile family arrows scroll `max(gallery.clientWidth * 0.72, 220)` pixels and invert horizontal sign in RTL.

Use CSS classes for fades/transforms; do not recreate React/Motion as a dependency.

- [ ] **Step 5: Enqueue Home-specific assets only on EN/AR Home**

In `functions.php`, resolve the page's preview locale/path or front-page identity, then enqueue:

```php
wp_enqueue_style(
    'rosa-latest-home',
    get_stylesheet_directory_uri() . '/assets/css/latest-rosa-home.css',
    ['rosa-elementor-authoring'],
    $version
);
wp_enqueue_script(
    'rosa-latest-home',
    get_stylesheet_directory_uri() . '/assets/js/latest-rosa-home.js',
    [],
    $version,
    true
);
```

Do not enqueue this layer on About/Contact/Shop yet.

- [ ] **Step 6: Syntax and topology checks**

```bash
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/latest-rosa-home.js
find wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview -name 'latest-home-*.php' -print0 | xargs -0 -n1 php -l
```

Expected: all syntax checks PASS. The browser topology test may remain RED until Task 6 migrates the existing document; do not force the document merely to make the test pass.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-*.php \
        wordpress/wp-content/themes/rosa-medical-child/assets/js/latest-rosa-home.js \
        wordpress/wp-content/themes/rosa-medical-child/functions.php \
        wordpress/scripts/tests/latest-rosa-home-parity.test.mjs
git commit -m "feat(wordpress): render latest Rosa homepage structure"
```

---

### Task 5: Port the Exact Latest Homepage CSS

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css`
- Modify: `wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh`
- Test: `wordpress/scripts/tests/latest-rosa-home-parity.test.mjs`

**Interfaces:**
- Consumes: source-compatible DOM from Task 4 and exact tokens from Task 1.
- Produces: final visual layout for the seven Home sections without changing About/Contact/Shop.

- [ ] **Step 1: Extend the reference contract to require key exact CSS values**

Require the WordPress Home parity stylesheet to contain the stable source values that define composition:

```bash
WP_HOME="$ROOT/wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css"
for literal in \
  'min-height: clamp(23.5rem, 44vw, 31rem)' \
  'height: min(57svh, 31rem)' \
  'font-size: clamp(2.05rem, 3.35vw, 3.05rem)' \
  'grid-template-columns: repeat(4, minmax(0, 1fr))' \
  'min-height: 5.6rem' \
  'aspect-ratio: 1.6 / 1' \
  'aspect-ratio: 5 / 6' \
  'transform: scale(1.14)'; do
  grep -Fq -- "$literal" "$WP_HOME" || fail "latest Home CSS parity missing: $literal"
done
```

- [ ] **Step 2: Run and verify RED**

```bash
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
```

Expected: FAIL because `latest-rosa-home.css` is absent/incomplete.

- [ ] **Step 3: Port source CSS in final-load order**

Build `latest-rosa-home.css` by preserving the latest effective cascade in this order:

1. Homepage-relevant rules from `apps/web/src/styles/public-hero.css`.
2. Homepage rules from `apps/web/src/styles/home-client-redesign.css`.
3. Overrides from `apps/web/src/styles/home-client-redesign-polish.css`.
4. Overrides from `apps/web/src/styles/home-client-interaction-fixes.css`.
5. Only the shared `Section`, `Container`, `procurement-panel`, button, and visually required typography primitives from source shared CSS that are not already equivalent in WordPress.

Keep the actual source numbers rather than translating them to the old MedicaShop values. In particular retain:

```css
.public-page--home .section { padding-block: clamp(2.05rem, 3.4vw, 3.1rem); }
.public-hero-carousel { min-height: clamp(23.5rem, 44vw, 31rem); height: min(57svh, 31rem); }
.home-comprehensive__lead { grid-template-columns: minmax(12rem, 0.72fr) minmax(0, 2.15fr); max-width: 70rem; }
.home-comprehensive__specialties { grid-template-columns: repeat(4, minmax(0, 1fr)); max-width: 70rem; }
.home-confidence__grid { grid-template-columns: minmax(0, 1.8fr) minmax(13rem, 0.7fr); }
.home-contact-band__surface { flex-direction: column; gap: 0.45rem; min-height: 5.6rem; }
.home-assurance__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.home-clinical-media { aspect-ratio: 1.6 / 1; }
.home-clinical-media--portrait { aspect-ratio: 5 / 6; }
```

Retain the source breakpoints `64rem` and `40rem`, including the tablet one-row five-family/four-specialty/four-assurance rhythm and mobile two-column specialty/assurance grids. Retain grayscale/contrast media treatment, focal points from markup, hover zoom, and reduced-motion transition removal.

Do not alter `elementor-authoring.css` except if an Elementor wrapper demonstrably prevents these source values from applying; wrapper fixes must stay generic and must not contain page design values.

- [ ] **Step 4: Run the reference contract**

```bash
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css \
        wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
git commit -m "style(wordpress): port latest Rosa homepage design"
```

---

### Task 6: Add a Safe Home-Only Parity Migration Without Force-Reseeding

**Files:**
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php`
- Modify: `wordpress/scripts/elementor-authoring-seed.sh`
- Create: `wordpress/scripts/tests/elementor-home-parity-migration.test.php`
- Modify: `wordpress/scripts/tests/elementor-authoring-seed-contract.test.php`
- Modify: `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Modify: `wordpress/scripts/tests/elementor-authoring-runtime.test.sh`

**Interfaces:**
- New metadata: `_rosa_elementor_home_parity_version = 1`.
- New successful status for untouched v2 Home: `migrated_home_parity`.
- New safety status for edited old Home: `home_parity_manual_required`.
- Existing About/Contact authoring version stays valid and unchanged.

- [ ] **Step 1: Write failing migration tests**

Model two Home documents with the test document double:

```php
// Untouched v2 Home: normal seed migrates to seven latest widgets.
update_post_meta(44, '_rosa_elementor_authoring_version', '2');
update_post_meta(44, '_rosa_elementor_seed_hash', $oldHash);
$result = ElementorPageSeeder::seedPage(44, 'home', 'en');
if (($result['status'] ?? '') !== 'migrated_home_parity') fail_test('untouched v2 Home did not migrate');
if ((string) get_post_meta(44, '_rosa_elementor_home_parity_version', true) !== '1') fail_test('Home parity marker missing');

// Edited v2 Home: normal seed must not overwrite.
$documents->documents[45]->elements = $editedOldHome;
update_post_meta(45, '_rosa_elementor_authoring_version', '2');
update_post_meta(45, '_rosa_elementor_seed_hash', $oldSeedHash);
$before = $documents->documents[45]->elements;
$result = ElementorPageSeeder::seedPage(45, 'home', 'en');
if (($result['status'] ?? '') !== 'home_parity_manual_required') fail_test('edited Home did not stop for manual migration');
if ($documents->documents[45]->elements !== $before) fail_test('edited Home was overwritten');
```

Also assert that About/Contact normal seed continues returning `skipped` when already migrated.

- [ ] **Step 2: Run and verify RED**

```bash
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
```

Expected: FAIL because Home parity metadata/statuses do not exist.

- [ ] **Step 3: Implement Home-only migration logic**

Add constants:

```php
public const HOME_PARITY_META = '_rosa_elementor_home_parity_version';
public const HOME_PARITY_VERSION = '1';
```

In `seedPage()`, after current v1 root-class migration and before the generic `skipped` return:

```php
if ($pageType === 'home'
    && (string) get_post_meta($postId, self::HOME_PARITY_META, true) !== self::HOME_PARITY_VERSION) {
    if ($state !== 'migrated_untouched') {
        return ['status' => 'home_parity_manual_required', 'post_id' => $postId];
    }

    $document = self::document($postId);
    if (! is_object($document) || ! $document->save(['elements' => $elements])) {
        return ['status' => 'save_failed', 'post_id' => $postId];
    }
    $document->set_is_built_with_elementor(true);
    update_post_meta($postId, '_wp_page_template', self::TEMPLATE);
    update_post_meta($postId, self::HOME_PARITY_META, self::HOME_PARITY_VERSION);
    $hash = self::currentHash($postId);
    if ($hash === '') return ['status' => 'reload_failed', 'post_id' => $postId];
    update_post_meta($postId, self::HASH_META, $hash);
    return ['status' => 'migrated_home_parity', 'post_id' => $postId];
}
```

For a never-migrated fresh Home, after normal save/hash logic also set the Home parity meta. Do not require or invoke `--force`.

- [ ] **Step 4: Update seed/runtime/mutation contracts**

`elementor-authoring-seed.sh` accepts `migrated_home_parity` as success and treats `home_parity_manual_required` as a hard stop with a clear message that an edited legacy Home requires explicit review.

`elementor-authoring-runtime.test.sh` verifies EN Home and AR Home have parity meta `1`; About/Contact remain only subject to their existing authoring version/built-with-Elementor checks.

`elementor-authoring-mutation.test.sh` must edit a representative latest Home widget field (for example `family_title` or `confidence_title`), run routine `client-preview-seed.sh` and normal `elementor-authoring-seed.sh`, and prove the edit remains.

- [ ] **Step 5: Run migration contracts**

```bash
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
bash wordpress/scripts/elementor-authoring-seed.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Expected: all PASS; seed output for EN/AR Home is either `migrated_home_parity` on first run or `skipped` on later runs; no `--force` required.

- [ ] **Step 6: Run the browser topology test**

```bash
node wordpress/scripts/tests/latest-rosa-home-parity.test.mjs http://localhost:8088/
```

Expected: the seven-section topology and basic hero/family interactions now PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorPageSeeder.php \
        wordpress/scripts/elementor-authoring-seed.sh \
        wordpress/scripts/tests/elementor-home-parity-migration.test.php \
        wordpress/scripts/tests/elementor-authoring-seed-contract.test.php \
        wordpress/scripts/tests/elementor-authoring-mutation.test.sh \
        wordpress/scripts/tests/elementor-authoring-runtime.test.sh
git commit -m "feat(wordpress): migrate Home safely to latest Rosa parity"
```

---

### Task 7: Replace MedicaShop Fidelity With Latest-Rosa Responsive/Visual Contracts

**Files:**
- Modify: `wordpress/scripts/tests/latest-rosa-home-parity.test.mjs`
- Create: `wordpress/scripts/latest-rosa-home-parity-capture.mjs`
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Modify: `docs/runbooks/wordpress-client-content-controls.md`

**Interfaces:**
- Produces the authoritative automated Home acceptance gate for this phase.
- Keeps the old `client-preview-home-fidelity.test.mjs` file available as historical diagnostic evidence if desired, but removes it from the full verifier so obsolete MedicaShop geometry can no longer define success.

- [ ] **Step 1: Expand the browser test to all required viewports**

Use viewports:

```js
const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
];
```

For every viewport and EN/AR Home, assert:
- exactly one `.public-page--home` and `.rosa-elementor-root`;
- exact seven-section order;
- no horizontal overflow (`scrollWidth <= clientWidth + 1`);
- no vertical collisions between the seven section boxes and shared pre-footer/footer;
- hero width equals viewport/root width within 1px;
- desktop/laptop hero height is within 2px of the CSS clamp/min result and never exceeds `31rem`;
- mobile hero is at least `31rem` and no more than `35rem` under the source rule;
- 4 hero dots/slides exist;
- family order is exact;
- at width > 640, family cards form one five-panel row; at <=640, the gallery is horizontally scrollable and mobile arrows are visible;
- Comprehensive supporting specialties are four columns at tablet/desktop and two columns at <=640;
- Assurance cards are four columns from tablet upward and two columns at <=640;
- Confidence becomes one column at <=640;
- Contact band remains compact and black-surfaced rather than turning into the old MedicaShop prefooter composition;
- Arabic `lang="ar" dir="rtl"` and English `lang="en-US" dir="ltr"` remain correct.

Keep reduced motion enabled during geometry loops.

- [ ] **Step 2: Add direct interaction checks outside reduced-motion geometry loop**

At 1280px:
- wait slightly longer than `4750ms` and verify active slide advances when page is unfocused and motion is allowed;
- focus a hero dot, wait >4750ms, verify the slide does not advance;
- click a different dot and verify active state changes;
- ArrowRight/ArrowLeft moves active dot focus;
- ensure no console/page errors.

At 390px:
- click family next arrow and verify gallery `scrollLeft` changes in LTR;
- on `/ar/`, verify the RTL control changes scroll position in the opposite logical direction without overflow.

- [ ] **Step 3: Create side-by-side reference capture utility**

Implement CLI:

```bash
node wordpress/scripts/latest-rosa-home-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/
```

The script must:
- emulate `prefers-reduced-motion: reduce` on both pages;
- capture EN Home and `/ar/` if the reference supports it;
- capture the seven required widths;
- save full-page PNGs under `artifacts/home-parity/<reference|wordpress>/<locale>/<width>.png`;
- also capture hero-only screenshots at each width;
- print the artifact paths and never mutate either site.

This tool is manual acceptance support; it is not a CI dependency on the network.

- [ ] **Step 4: Replace the full verifier's obsolete fidelity gate**

In `client-preview-runtime-verify.sh`, keep accessibility, mutation, runtime, About/Contact, Woo/Stevens, RTL and source checks. Replace:

```bash
run node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs "$home_url"
```

with:

```bash
run bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
run php wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php
run node wordpress/scripts/tests/latest-rosa-home-parity.test.mjs "$home_url"
```

Change the final PASS line to explicitly say latest-Rosa Homepage parity rather than MedicaShop fidelity.

- [ ] **Step 5: Run the focused and complete gates**

```bash
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
php wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php
node wordpress/scripts/tests/latest-rosa-home-parity.test.mjs http://localhost:8088/
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: all PASS, with no old MedicaShop Homepage fidelity assertion participating in acceptance.

- [ ] **Step 6: Capture and manually compare against the reference**

```bash
node wordpress/scripts/latest-rosa-home-parity-capture.mjs https://rosamedical.org/ http://localhost:8088/
```

Compare matched images for 1440, 1280, 1024, 768, 431, 390, and 360. Reject the task if there is material drift in section order, hero proportions/crop, five-family strip, typography hierarchy, section spacing, clinical media crop, confidence split, black direct-support band, assurance card geometry, quotation CTA, or RTL composition.

- [ ] **Step 7: Perform Elementor edit acceptance**

Manual browser acceptance:
1. EN Home: edit `family_title`, update, verify frontend, restore.
2. AR Home: edit `family_title`, update, verify RTL frontend, restore.
3. EN Home hero: replace one slide image, update, verify desktop/mobile rendering, restore.
4. EN Home confidence: edit text and image, verify, restore.
5. Run `bash wordpress/scripts/client-preview-seed.sh` and `bash wordpress/scripts/elementor-authoring-seed.sh`; confirm none of the temporary edits would have been silently reset before restoration.

- [ ] **Step 8: Update runbook**

Document:
- latest Homepage is now the reference, not MedicaShop;
- seven Elementor widgets and their ownership;
- Home parity migration marker/version;
- normal seed behavior and `home_parity_manual_required` safety stop;
- reference capture command;
- no `--force` in routine work;
- Hostinger still requires separate explicit authorization.

- [ ] **Step 9: Commit**

```bash
git add wordpress/scripts/tests/latest-rosa-home-parity.test.mjs \
        wordpress/scripts/latest-rosa-home-parity-capture.mjs \
        wordpress/scripts/client-preview-runtime-verify.sh \
        docs/runbooks/wordpress-client-content-controls.md
git commit -m "test(wordpress): gate Homepage on latest Rosa parity"
```

---

## Final Verification for This Plan

Run in this order after all seven tasks:

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
php wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php
bash wordpress/scripts/elementor-authoring-seed.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
node wordpress/scripts/tests/latest-rosa-home-parity.test.mjs http://localhost:8088/
bash wordpress/scripts/client-preview-runtime-verify.sh
node wordpress/scripts/latest-rosa-home-parity-capture.mjs https://rosamedical.org/ http://localhost:8088/
```

The implementation is not complete until the full runtime verifier passes and the matched reference/local captures show no material Homepage visual drift. Do not merge, delete `wordpress/client-content-controls`, or deploy to Hostinger as part of this plan.

## Plan Self-Review

- **Spec coverage:** P1 design-system/source audit is covered by Tasks 1–2; P2 Homepage topology, authoring, media, CSS, interactions, responsive/RTL, migration safety, automated acceptance, manual visual comparison, and edit persistence are covered by Tasks 3–7.
- **Scope isolation:** About, Contact, shared-shell-wide parity, Shop/product parity, and production deployment are intentionally excluded from this plan and receive separate plans after Homepage acceptance.
- **Placeholder scan:** No `TBD`, `TODO`, generic "handle errors", or unspecified test steps remain.
- **Interface consistency:** Seven widget names/order are identical in WidgetRegistry, seed contract, partial ownership, migration test, and browser topology gate. Home parity meta is consistently `_rosa_elementor_home_parity_version = 1`.
