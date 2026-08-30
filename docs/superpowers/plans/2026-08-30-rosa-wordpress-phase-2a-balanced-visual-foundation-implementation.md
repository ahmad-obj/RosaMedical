# Rosa Medical WordPress Phase 2A — Balanced Visual Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the accepted free WordPress foundation into the approved Balanced Rosa visual foundation for the protected public shell, Products archive/product cards, Product Detail, responsive behavior, catalogue-PDF placement and accessibility contracts without implementing the later discovery, pricing-persistence, inquiry-persistence or catalogue-import subsystems.

**Architecture:** `rosa-medical-child` owns production presentation: tokens, shared shell, WooCommerce archive rendering, product-card rendering, Product Detail composition, responsive CSS and presentation JavaScript. WooCommerce remains the structured product/variation source. `rosa-medical-core` supplies normalized product/configuration and catalogue-document presentation data, preserves the verified late Product Detail template-routing hook, and exposes explicit integration seams for later authoritative pricing and inquiry behavior instead of inventing simplified retail logic now.

**Tech Stack:** WordPress 7.1 foundation runtime; PHP 8.3; MariaDB 11.4; Hello Elementor; Elementor Free 4.2.3; WooCommerce 11.0.1; Rosa PHP/CSS/vanilla JS; Docker Compose; WP-CLI; Bash/PHP contract tests; existing repo Playwright CLI for screenshot capture only.

**Spec:** `docs/superpowers/specs/2026-08-30-rosa-wordpress-phase-2a-balanced-visual-foundation-design.md`

**Approval:** The user explicitly approved the Phase 2A specification on 2026-08-30 before this plan was written.

## Global Constraints

- Execute implementation in an isolated worktree/branch created from `docs/phase-2a-formal-design` after this plan commit; do not implement directly on `wordpress/medicashop-migration`.
- Invoke `superpowers:using-git-worktrees` before Task 1. Recommended implementation branch: `wordpress/phase-2a-balanced-visual-foundation`.
- Preserve the free-first stack: WordPress, Hello Elementor, Elementor Free, WooCommerce, WordPress Media Library, `rosa-medical-child`, `rosa-medical-core`.
- Do not add MedicaShop, Elementor Pro, WPML as a prerequisite, ElementsKit, Skyboot or another paid/proprietary template dependency.
- Do not touch Hostinger, production DNS, production databases, production Cloudflare configuration or unrelated sites.
- Do not mass-import the catalogue in this phase.
- Do not modify `apps/web/**` except to read it as migration evidence. The existing Next.js application is a reference, not an implementation target.
- Preserve the canonical foundation fixture exactly: Scissors → Stevens Scissors — Regular; 10.5 cm; `04-0901` Straight/Sharp; `04-0911` Curved/Sharp; no invented combinations.
- Preserve `RosaMedical\Core\Plugin::productTemplate` at `template_include` priority `100` or an equivalent later priority proven to remain after Elementor Free. Do not regress WooCommerce Coming Soon handling.
- Preserve exactly one page-level `<main>` landmark.
- Do not introduce consumer cart, checkout, account, payment, shipping, rating, review, sale, stock-urgency or related-product UI.
- Primary navigation is exactly Home, About Us, Products, Inquiry, Contact Us. Primary CTA copy defaults to `Request a quote`.
- Products archive should generally produce four to five readable cards at 1366/1440 where minimum width permits; five at 1440 is a valid target, not a hard-coded global count.
- Product images use contained media; never force long instruments through destructive `object-fit: cover` card crops.
- Price is structurally supported but Phase 2A must not invent authoritative pricing persistence. Until the dedicated pricing subsystem supplies a state through the integration seam, the truthful default is `Price on request`.
- Add-to-Inquiry is structurally supported but Phase 2A must not invent quote/inquiry persistence. Until the inquiry subsystem supplies capability through the integration seam, the control remains non-submitting/disabled.
- Theme code owns presentation. Rosa business rules stay in `rosa-medical-core`.
- Use logical CSS properties so the same DOM is RTL-safe.
- Keep all strings translation-ready with the `rosa-medical` text domain.
- Run targeted WordPress checks even though repository-wide pnpm verification currently has two pre-existing React lint failures in `products-discovery-workspace.tsx`; report those separately rather than attributing them to this work.

## Implementation File Map

### Existing files to modify

- `wordpress/wp-content/themes/rosa-medical-child/functions.php` — enqueue production Rosa CSS/fonts/JS and shared theme helpers only.
- `wordpress/wp-content/themes/rosa-medical-child/header.php` — production header, skip link, primary nav and mobile drawer shell.
- `wordpress/wp-content/themes/rosa-medical-child/footer.php` — production procurement footer using centralized business values.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css` — authoritative Phase 2A token contract.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css` — reset, typography, rails, focus, buttons and generic accessibility primitives.
- `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php` — require new catalogue presentation services.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php` — preserve priority-100 routing while switching the preferred Product Detail view to the child-theme production template.
- `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php` — remain as safe plugin fallback only; do not expand it into the production design.
- `wordpress/scripts/foundation-product-verify.sh` — preserve the existing foundation assertions; only add checks if production-template routing changes require an equivalent marker.
- `wordpress/scripts/tests/product-detail-structure.test.sh` — preserve one-main contract while recognizing the production child-theme detail template.
- `wordpress/scripts/tests/product-template-hook.test.sh` — preserve priority `100` and fallback behavior.

### New child-theme files

- `wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php` — exact protected public-navigation model and active-route helpers.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css` — header, drawer, footer and shared closure styles.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css` — archive workspace, filter integration slot, card grid/cards, result states and catalogue panels.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css` — gallery, configuration decision block, price/inquiry presentation, PDF module and sticky mobile action geometry.
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js` — accessible mobile drawer behavior only.
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js` — client-side presentation synchronization for real configuration radio selection; no persistence.
- `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php` — protected Rosa WooCommerce archive composition.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php` — reusable dense catalogue card.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/catalogue-panel.php` — reusable family catalogue/reference module.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php` — production Product Detail composition selected by the priority-100 plugin routing hook.

### New `rosa-medical-core` files

- `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php` — normalized product/card/detail/configuration data derived from WooCommerce without implementing future pricing persistence.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php` — validated family/category → Media Library PDF relationship reader.

### New verification files

- `wordpress/scripts/tests/phase2a-theme-tokens.test.sh`
- `wordpress/scripts/tests/phase2a-shell-contract.test.sh`
- `wordpress/scripts/tests/phase2a-product-presentation.test.php`
- `wordpress/scripts/tests/phase2a-catalogue-contract.test.sh`
- `wordpress/scripts/tests/phase2a-product-detail-contract.test.sh`
- `wordpress/scripts/phase2a-runtime-verify.sh`
- `wordpress/scripts/phase2a-responsive-capture.sh`
- `docs/runbooks/wordpress-phase2a-visual-acceptance.md`
- `docs/superpowers/completions/2026-08-30-wordpress-phase-2a-balanced-visual-foundation.md`

---

### Task 1: Replace prototype visual tokens with the approved Rosa token foundation

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`
- Create: `wordpress/scripts/tests/phase2a-theme-tokens.test.sh`

**Interfaces:**
- Consumes: approved Phase 2A token contract; Hello Elementor child-theme enqueueing.
- Produces: CSS custom properties used by every later Phase 2A theme file and stable asset handles `rosa-medical-fonts`, `rosa-medical-tokens`, `rosa-medical-base`.

- [ ] **Step 1: Write the failing token contract**

Create `phase2a-theme-tokens.test.sh` with exact assertions for the Rosa source palette, rails, radii, motion and font roles:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TOKENS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css"
BASE="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css"
FUNCTIONS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/functions.php"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq -- '--color-rosa-red: #e00815' "$TOKENS" || fail 'Rosa red token missing'
grep -Fq -- '--color-rosa-red-dark: #b9000b' "$TOKENS" || fail 'Rosa dark red token missing'
grep -Fq -- '--color-ink: #191917' "$TOKENS" || fail 'ink token missing'
grep -Fq -- '--color-warm-white: #f9f7f2' "$TOKENS" || fail 'warm white token missing'
grep -Fq -- '--container-reading: 46rem' "$TOKENS" || fail 'reading rail missing'
grep -Fq -- '--container-standard: 72rem' "$TOKENS" || fail 'standard rail missing'
grep -Fq -- '--container-wide: 80rem' "$TOKENS" || fail 'wide rail missing'
grep -Fq -- '--container-archive: 90rem' "$TOKENS" || fail 'archive rail missing'
grep -Fq -- '--radius-control: 0.25rem' "$TOKENS" || fail 'control radius missing'
grep -Fq -- '--radius-surface: 0.125rem' "$TOKENS" || fail 'surface radius missing'
grep -Fq -- '--motion-micro: 160ms' "$TOKENS" || fail 'micro motion missing'
grep -Fq -- '--motion-component: 280ms' "$TOKENS" || fail 'component motion missing'
grep -Fq 'font-family: var(--font-interface)' "$BASE" || fail 'body must consume interface font token'
grep -Fq "rosa-medical-fonts" "$FUNCTIONS" || fail 'font stylesheet handle missing'
printf 'PASS: Phase 2A Rosa token contract\n'
```

- [ ] **Step 2: Run the token test and verify RED**

Run:

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
```

Expected: FAIL because the current WordPress prototype uses `--rosa-*` prototype values, a 90rem generic shell, larger radii, system-only typography and blue focus.

- [ ] **Step 3: Replace `tokens.css` with the approved semantic token layer**

Use the approved values directly, including this core structure:

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
  --color-success: #1f6b45;
  --color-success-surface: #e9f5ed;
  --color-warning: #9a5b00;
  --color-warning-surface: #fff5df;
  --color-danger-surface: #fff0f1;

  --font-interface: "Inter", Arial, sans-serif;
  --font-editorial: "Lora", Georgia, serif;
  --font-arabic: "Tajawal", "GE SS Two", "GE SS Text", Tahoma, Arial, sans-serif;

  --container-reading: 46rem;
  --container-standard: 72rem;
  --container-wide: 80rem;
  --container-archive: 90rem;
  --page-gutter: clamp(1.1rem, 3.25vw, 4rem);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;

  --header-block: clamp(4.25rem, 6.2vh, 4.75rem);
  --section-block: clamp(3.25rem, 6.2vw, 5.75rem);
  --section-block-compact: clamp(2.5rem, 4.5vw, 4.25rem);
  --intro-block: clamp(2.5rem, 5vw, 4.75rem);
  --card-gap: clamp(1rem, 2vw, 1.5rem);
  --control-block: 3rem;

  --radius-control: 0.25rem;
  --radius-surface: 0.125rem;
  --shadow-lifted: 0 1.25rem 3.5rem rgb(25 25 23 / 0.08);

  --motion-micro: 160ms;
  --motion-component: 280ms;
  --motion-section: 580ms;
  --motion-hero: 960ms;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 40rem) {
  :root { --page-gutter: clamp(1rem, 4.8vw, 1.35rem); }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-micro: 0ms;
    --motion-component: 0ms;
    --motion-section: 0ms;
    --motion-hero: 0ms;
  }
}
```

- [ ] **Step 4: Update base primitives and font loading**

In `functions.php`, enqueue the free Google Fonts CSS for Inter, Lora and Tajawal before Rosa tokens. Keep system fallbacks in CSS so a font-network failure never makes the site unusable:

```php
wp_enqueue_style(
    'rosa-medical-fonts',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap',
    [],
    null
);
```

Update `base.css` so body uses `var(--font-interface)`, Arabic document direction uses `var(--font-arabic)`, headings opt into `var(--font-editorial)` only for approved display roles, and focus is `3px`/`3px` with ink on light surfaces and white on dark/red component contexts.

Also add reusable rail classes:

```css
.rosa-rail { width: min(calc(100% - (2 * var(--page-gutter))), var(--container-standard)); margin-inline: auto; }
.rosa-rail--wide { max-width: var(--container-wide); }
.rosa-rail--archive { max-width: var(--container-archive); }
.rosa-rail--reading { max-width: var(--container-reading); }
```

- [ ] **Step 5: Run token, PHP and foundation theme checks**

Run:

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
bash wordpress/scripts/tests/foundation-theme-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/functions.php
```

Expected: all PASS.

- [ ] **Step 6: Commit Task 1**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/functions.php \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css \
  wordpress/scripts/tests/phase2a-theme-tokens.test.sh
git commit -m "feat(wordpress): establish Rosa Phase 2A design tokens"
```

---

### Task 2: Build the protected production header, mobile drawer and procurement footer

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js`
- Create: `wordpress/scripts/tests/phase2a-shell-contract.test.sh`

**Interfaces:**
- Consumes: `rosa_theme_business_value(string $key, string $default = ''): string`; WordPress route predicates; Task 1 tokens.
- Produces: `rosa_theme_primary_navigation(): array`, `rosa_theme_nav_is_active(string $key): bool`, accessible drawer markup using `[data-rosa-menu-*]`, exact single `<main id="main">`, four-group footer.

- [ ] **Step 1: Write a failing shell contract**

Assert the exact five destinations, skip link, drawer hooks, centralized settings and one-main ownership:

```bash
grep -Fq "'Home'" wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
grep -Fq "'About Us'" wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
grep -Fq "'Products'" wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
grep -Fq "'Inquiry'" wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
grep -Fq "'Contact Us'" wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
grep -Fq 'href="#main"' wordpress/wp-content/themes/rosa-medical-child/header.php
grep -Fq 'data-rosa-menu-trigger' wordpress/wp-content/themes/rosa-medical-child/header.php
grep -Fq 'data-rosa-menu-drawer' wordpress/wp-content/themes/rosa-medical-child/header.php
grep -Fq '<main id="main"' wordpress/wp-content/themes/rosa-medical-child/header.php
! grep -Fq 'wp_nav_menu' wordpress/wp-content/themes/rosa-medical-child/header.php
grep -Fq "rosa_theme_business_value('phone'" wordpress/wp-content/themes/rosa-medical-child/footer.php
grep -Fq "rosa_theme_business_value('email'" wordpress/wp-content/themes/rosa-medical-child/footer.php
```

- [ ] **Step 2: Run shell contract and verify RED**

Run:

```bash
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
```

Expected: FAIL because the current shell is the foundation site-name/nav/phone prototype and has no production drawer or footer groups.

- [ ] **Step 3: Implement protected navigation helpers**

`inc/navigation.php` returns exactly these entries:

```php
function rosa_theme_primary_navigation(): array
{
    return [
        ['key' => 'home', 'label' => __('Home', 'rosa-medical'), 'url' => home_url('/')],
        ['key' => 'about', 'label' => __('About Us', 'rosa-medical'), 'url' => home_url('/about/')],
        ['key' => 'products', 'label' => __('Products', 'rosa-medical'), 'url' => home_url('/products/')],
        ['key' => 'inquiry', 'label' => __('Inquiry', 'rosa-medical'), 'url' => home_url('/inquiry/')],
        ['key' => 'contact', 'label' => __('Contact Us', 'rosa-medical'), 'url' => home_url('/contact/')],
    ];
}
```

`rosa_theme_nav_is_active()` must treat WooCommerce archive and single-product contexts as active `products`, without changing the five-item navigation.

- [ ] **Step 4: Implement header markup**

Required structural order:

```php
<a class="rosa-skip-link" href="#main"><?php esc_html_e('Skip to content', 'rosa-medical'); ?></a>
<header class="rosa-site-header" data-rosa-site-header>
  <div class="rosa-rail rosa-rail--wide rosa-site-header__inner">
    <!-- ROSA brand -->
    <!-- desktop nav -->
    <!-- reserved language slot only when a real switcher exists -->
    <!-- Request a quote -->
    <!-- mobile menu trigger -->
  </div>
  <!-- accessible overlay + drawer -->
</header>
<main id="main" class="rosa-site-main">
```

Use the current site name only as an accessible fallback; visible brand text must be `ROSA` unless an approved custom logo is available through WordPress custom-logo support. Add `add_theme_support('custom-logo')` and `add_theme_support('title-tag')` in `after_setup_theme`.

- [ ] **Step 5: Implement accessible drawer behavior in vanilla JS**

`site-shell.js` must:

```js
const trigger = document.querySelector('[data-rosa-menu-trigger]');
const drawer = document.querySelector('[data-rosa-menu-drawer]');
const overlay = document.querySelector('[data-rosa-menu-overlay]');

function openMenu() {
  trigger?.setAttribute('aria-expanded', 'true');
  drawer?.removeAttribute('hidden');
  overlay?.removeAttribute('hidden');
  document.documentElement.classList.add('rosa-menu-open');
  drawer?.querySelector('a, button')?.focus();
}

function closeMenu() {
  trigger?.setAttribute('aria-expanded', 'false');
  drawer?.setAttribute('hidden', '');
  overlay?.setAttribute('hidden', '');
  document.documentElement.classList.remove('rosa-menu-open');
  trigger?.focus();
}
```

Add Escape close, overlay close, close-button support and a Tab-key focus loop across drawer focusables. Do not add a JS framework.

- [ ] **Step 6: Implement the production footer**

Render four logical groups on desktop and one/two columns at smaller widths:

1. ROSA + procurement positioning + `Request a quote`.
2. Products: Knives, Scissors, Punches, Chisels, Cutters, Catalogues.
3. Company: About Us, Procurement support, Contact Us.
4. Support: Inquiry, Search, Privacy Policy, Terms.

Phone/email/address come only from `rosa_theme_business_value()`. Do not hard-code business data. Do not add retail/payment/shipping/newsletter content.

- [ ] **Step 7: Add shell CSS and enqueue shell assets**

Use `--header-block`, bounded rails, sticky white header, subtle scrolled separation, a logical-inline-end drawer, near-black footer and 44–48px practical targets. Desktop nav collapses around the real-content fit threshold near 70rem.

Enqueue `shell.css` after `base.css` and `site-shell.js` in the footer with `defer` semantics via normal WordPress script enqueueing.

- [ ] **Step 8: Run shell and foundation structure checks**

Run:

```bash
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
php -l wordpress/wp-content/themes/rosa-medical-child/header.php
php -l wordpress/wp-content/themes/rosa-medical-child/footer.php
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js
```

Expected: PASS. `product-detail-structure.test.sh` must still confirm one theme-owned `<main>`.

- [ ] **Step 9: Commit Task 2**

```bash
git add wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/phase2a-shell-contract.test.sh
git commit -m "feat(wordpress): build Rosa production public shell"
```

---

### Task 3: Add a normalized WooCommerce product presentation adapter without inventing future business logic

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Create: `wordpress/scripts/tests/phase2a-product-presentation.test.php`

**Interfaces:**
- Consumes: `WC_Product`, published `WC_Product_Variation` children, product categories, image attachment data.
- Produces: `RosaMedical\Core\Catalogue\ProductPresentation::forProduct(WC_Product $product): array` with stable keys used by card/detail templates.
- Produces integration filters: `rosa_medical_product_price_state` and `rosa_medical_inquiry_enabled`.

- [ ] **Step 1: Write the failing pure helper contract**

The test stubs only WordPress translation/filter functions and verifies normalization helpers that do not require a live database. The normalized price seam must default truthfully to Price on Request and inquiry capability must default false:

```php
expectSame(
    ['kind' => 'request', 'label' => 'Price on request'],
    ProductPresentation::defaultPriceState(),
    'Phase 2A must not invent numeric pricing'
);
expectSame(false, ProductPresentation::defaultInquiryEnabled(), 'inquiry persistence is not enabled in Phase 2A');
expectSame(
    ['type' => 'single-sku', 'label' => '04-0901'],
    ProductPresentation::referenceSummary(['04-0901'], null),
    'single exact configuration should expose its SKU'
);
expectSame(
    ['type' => 'configuration-count', 'label' => '2 configurations'],
    ProductPresentation::referenceSummary(['04-0901', '04-0911'], null),
    'multiple variations should not pretend one variation SKU identifies the product'
);
```

- [ ] **Step 2: Run and verify RED**

Run:

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
```

Expected: FAIL because `ProductPresentation` does not exist.

- [ ] **Step 3: Implement stable normalization helpers**

Define:

```php
final class ProductPresentation
{
    public static function defaultPriceState(): array
    {
        return ['kind' => 'request', 'label' => __('Price on request', 'rosa-medical')];
    }

    public static function defaultInquiryEnabled(): bool
    {
        return false;
    }

    public static function referenceSummary(array $skus, ?string $productReference): array
    {
        $skus = array_values(array_unique(array_filter(array_map('strval', $skus))));
        if (count($skus) === 1) {
            return ['type' => 'single-sku', 'label' => $skus[0]];
        }
        if ($productReference !== null && trim($productReference) !== '') {
            return ['type' => 'product-reference', 'label' => $productReference, 'count' => count($skus)];
        }
        return [
            'type' => 'configuration-count',
            'label' => sprintf(_n('%d configuration', '%d configurations', count($skus), 'rosa-medical'), count($skus)),
        ];
    }
}
```

- [ ] **Step 4: Implement `forProduct()` against real WooCommerce data**

Return a normalized array containing:

```php
[
    'id' => int,
    'name' => string,
    'permalink' => string,
    'family' => ['id' => int, 'name' => string, 'slug' => string] | null,
    'image' => ['id' => int, 'url' => string, 'alt' => string] | null,
    'description' => string,
    'configurations' => list<array{
        id:int,
        sku:string,
        attributes:array<string,string>
    }>,
    'reference' => array,
    'price' => array{kind:string,label:string},
    'inquiry_enabled' => bool,
]
```

Only published real variations are projected. Attribute labels/term names must be resolved through WooCommerce/WordPress taxonomies; do not synthesize Cartesian combinations.

Resolve price through:

```php
$price = apply_filters('rosa_medical_product_price_state', self::defaultPriceState(), $product);
```

Resolve inquiry capability through:

```php
$inquiryEnabled = (bool) apply_filters('rosa_medical_inquiry_enabled', self::defaultInquiryEnabled(), $product);
```

Do not read arbitrary Woo price fields here as authoritative Rosa pricing.

- [ ] **Step 5: Require the new class and rerun tests**

Update `rosa-medical-core.php` to require the class before `Plugin.php`.

Run:

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php
php -l wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php
```

Expected: PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core \
  wordpress/scripts/tests/phase2a-product-presentation.test.php
git commit -m "feat(wordpress): add Rosa product presentation adapter"
```

---

### Task 4: Add the dynamic family catalogue-PDF relationship reader

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Extend: `wordpress/scripts/tests/phase2a-product-presentation.test.php`

**Interfaces:**
- Consumes: WooCommerce product category term; category meta `_rosa_catalogue_attachment_id`; WordPress Media Library attachment APIs.
- Produces: `FamilyCatalogue::forTerm(WP_Term $term): ?array` and `FamilyCatalogue::forProduct(WC_Product $product): ?array`.

- [ ] **Step 1: Add failing PDF relationship assertions**

Stub the attachment APIs and assert the reader rejects non-PDF or missing URLs and accepts a valid PDF:

```php
expectSame(
    null,
    FamilyCatalogue::fromAttachmentId(0),
    'missing attachment must not create a broken catalogue link'
);

$GLOBALS['rosa_test_attachment_mime'][42] = 'application/pdf';
$GLOBALS['rosa_test_attachment_url'][42] = 'https://example.test/scissors.pdf';
$GLOBALS['rosa_test_attachment_title'][42] = 'Scissors Catalogue';

expectSame(
    [
        'attachment_id' => 42,
        'url' => 'https://example.test/scissors.pdf',
        'title' => 'Scissors Catalogue',
    ],
    FamilyCatalogue::fromAttachmentId(42),
    'valid PDF attachment must become the authoritative catalogue reference'
);
```

- [ ] **Step 2: Run and verify RED**

Run:

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
```

Expected: FAIL because `FamilyCatalogue` does not exist.

- [ ] **Step 3: Implement the validated attachment reader**

Use exactly one taxonomy-meta key:

```php
public const META_KEY = '_rosa_catalogue_attachment_id';
```

`fromAttachmentId()` returns null unless:

```php
get_post_mime_type($attachmentId) === 'application/pdf'
```

and `wp_get_attachment_url()` returns a non-empty URL.

`forTerm()` reads `get_term_meta($term->term_id, self::META_KEY, true)` and delegates to `fromAttachmentId()`.

`forProduct()` resolves the product's first/primary `product_cat` term deterministically and returns the same normalized document array plus family name/slug.

- [ ] **Step 4: Require class, run tests and PHP syntax**

Run:

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php
```

Expected: PASS.

- [ ] **Step 5: Commit Task 4**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core \
  wordpress/scripts/tests/phase2a-product-presentation.test.php
git commit -m "feat(wordpress): add family catalogue PDF presentation source"
```

---

### Task 5: Replace the generic WooCommerce archive with the dense Rosa catalogue workspace and product-card system

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/catalogue-panel.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/scripts/tests/phase2a-catalogue-contract.test.sh`

**Interfaces:**
- Consumes: WooCommerce main product loop; `ProductPresentation::forProduct()`; `FamilyCatalogue`; Task 1 tokens; future extension hooks `rosa_medical_archive_filters` and `rosa_medical_archive_reveal`.
- Produces: protected `/products` archive composition and reusable `product-card.php`.

- [ ] **Step 1: Write the failing archive/card contract**

Assert the archive owns the required anatomy without shipping dead advanced filters:

```bash
ARCHIVE=wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
CARD=wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css

grep -Fq 'rosa-products-search' "$ARCHIVE"
grep -Fq "do_action('rosa_medical_archive_filters'" "$ARCHIVE"
grep -Fq 'rosa-products-grid' "$ARCHIVE"
grep -Fq "do_action('rosa_medical_archive_reveal'" "$ARCHIVE"
grep -Fq 'ProductPresentation::forProduct' "$CARD"
grep -Fq 'object-fit: contain' "$CSS"
grep -Fq 'minmax(12rem, 1fr)' "$CSS"
! grep -Eqi 'add to cart|rating|stars|sale badge|shipping|checkout' "$CARD"
```

- [ ] **Step 2: Run and verify RED**

Run:

```bash
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
```

Expected: FAIL because the archive/card production files do not exist.

- [ ] **Step 3: Implement archive anatomy**

`archive-product.php` must use the normal WooCommerce query but own Rosa composition:

```php
get_header();
?>
<section class="rosa-products-intro">
  <div class="rosa-rail rosa-rail--archive">
    <p class="rosa-eyebrow"><?php esc_html_e('Product catalogue', 'rosa-medical'); ?></p>
    <h1><?php esc_html_e('Medical Devices', 'rosa-medical'); ?></h1>
    <p><?php esc_html_e('Search the Rosa catalogue and open the exact instrument before adding it to your quotation inquiry.', 'rosa-medical'); ?></p>
  </div>
</section>
<section class="rosa-products-workspace">
  <div class="rosa-rail rosa-rail--archive">
    <form class="rosa-products-search" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>">
      <label for="rosa-product-search"><?php esc_html_e('Search products by name, code, size or option', 'rosa-medical'); ?></label>
      <input id="rosa-product-search" name="s" type="search" value="<?php echo esc_attr(get_search_query()); ?>">
      <input type="hidden" name="post_type" value="product">
    </form>
    <div class="rosa-products-layout">
      <aside class="rosa-products-filters" aria-label="<?php echo esc_attr__('Product filters', 'rosa-medical'); ?>">
        <?php do_action('rosa_medical_archive_filters'); ?>
      </aside>
      <div class="rosa-products-results">
        <!-- contextual count + Woo loop rendered through product-card partial -->
      </div>
    </div>
  </div>
</section>
<?php
get_footer();
```

If no filter provider is registered, hide the empty aside with `:empty` and let results consume full width. This deliberately avoids nonfunctional advanced filter controls in production while preserving the exact structural integration point required by the approved future discovery subsystem.

- [ ] **Step 4: Implement the dense product card**

`product-card.php` obtains the current WooCommerce product and calls `ProductPresentation::forProduct()`.

Required order:

```text
contained image
family eyebrow
product title
reference/configuration evidence
price state
View details
```

For missing images render a neutral inline placeholder label/silhouette container. Do not substitute stock imagery.

- [ ] **Step 5: Implement the grid CSS**

Desktop result grid:

```css
.rosa-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--card-gap);
}

.rosa-product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

Use the 90rem archive rail and a 14.5–17rem sidebar when the sidebar provider exists. At narrow widths hide/collapse the permanent aside and let a later filter provider supply the mobile disclosure through the same hook. At `max-width:40rem`, allow a tested compact two-column mode with a smaller grid minimum around 9rem; provide a one-column fallback class when real content fails readability.

Do not let 1920/2560 automatically add unbounded columns because the rail caps at 90rem.

- [ ] **Step 6: Add truthful empty/result states and catalogue slot**

Replace generic WooCommerce empty-shop text with Rosa copy and a reset/back-to-products path. Render family catalogue panel only when `FamilyCatalogue` returns a valid document. If no PDF exists, render no broken link.

Keep `do_action('rosa_medical_archive_reveal')` after the grid. No fake See More control is rendered until the discovery subsystem provides it.

- [ ] **Step 7: Enqueue `catalogue.css` only on product archive/search/product taxonomy contexts**

Use WordPress/WooCommerce route predicates in `functions.php`; do not load every catalogue stylesheet on all editorial pages.

- [ ] **Step 8: Run archive tests and syntax checks**

Run:

```bash
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/catalogue-panel.php
```

Expected: PASS.

- [ ] **Step 9: Commit Task 5**

```bash
git add wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
git commit -m "feat(wordpress): build dense Rosa product archive"
```

---

### Task 6: Replace the Product Detail prototype with the production configuration/procurement presentation

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php`
- Modify: `wordpress/scripts/tests/product-template-hook.test.sh`
- Modify: `wordpress/scripts/tests/product-detail-structure.test.sh`
- Create: `wordpress/scripts/tests/phase2a-product-detail-contract.test.sh`

**Interfaces:**
- Consumes: `ProductPresentation::forProduct()`, `FamilyCatalogue::forProduct()`, Task 1 tokens, plugin priority-100 template selection.
- Produces: theme-owned production Product Detail template with real configuration radios, selected summary, price slot, non-submitting inquiry presentation, responsive gallery and PDF module.

- [ ] **Step 1: Write failing routing and Product Detail contracts**

Assert:

```bash
PLUGIN=wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php
DETAIL=wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php

grep -Fq "add_filter('template_include', [self::class, 'productTemplate'], 100)" "$PLUGIN"
grep -Fq "template-parts/product-detail.php" "$PLUGIN"
! grep -Eq '<main([[:space:]>])' "$DETAIL"
grep -Fq 'data-rosa-product-detail' "$DETAIL"
grep -Fq 'data-rosa-configuration' "$DETAIL"
grep -Fq 'data-rosa-selected-sku' "$DETAIL"
grep -Fq 'data-rosa-price-state' "$DETAIL"
grep -Fq 'data-rosa-inquiry-action' "$DETAIL"
! grep -Eqi 'related products|add to cart|shipping|rating|wishlist|checkout' "$DETAIL"
```

- [ ] **Step 2: Run and verify RED**

Run:

```bash
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
```

Expected: new Phase 2A contract FAIL; existing foundation contracts remain green until routing changes are made.

- [ ] **Step 3: Change Product Detail routing without losing the verified hook repair**

Keep priority `100`. In `Plugin::productTemplate()` prefer the child-theme production file:

```php
$themeTemplate = trailingslashit(get_stylesheet_directory()) . 'template-parts/product-detail.php';
if (is_readable($themeTemplate)) {
    return $themeTemplate;
}

$fallback = dirname(ROSA_MEDICAL_CORE_FILE) . '/templates/product-detail-prototype.php';
return is_readable($fallback) ? $fallback : $template;
```

This keeps routing authority late in `rosa-medical-core` while moving final presentation into the child theme. Update the hook tests to require priority `100`, production-theme preference and plugin fallback.

- [ ] **Step 4: Implement Product Detail anatomy**

`product-detail.php` must:

```php
$product = wc_get_product(get_the_ID());
$view = $product instanceof WC_Product ? ProductPresentation::forProduct($product) : null;
$catalogue = $product instanceof WC_Product ? FamilyCatalogue::forProduct($product) : null;
get_header();
```

Then render, without another `<main>`:

```text
breadcrumb/family
media + summary split
family + full h1 + concise description
Select configuration
selected SKU/attributes summary
Effective price / Price on request
quantity
Add to Inquiry presentation
catalogue PDF module when valid
specifications/procurement context
focused inquiry closure
```

Single-configuration products show a configuration summary without a redundant radio group. Multiple configurations render semantic radios and only the real variations returned by the presenter.

- [ ] **Step 5: Keep Phase 2A pricing and inquiry seams truthful**

Render the normalized price state returned by the presenter. With no pricing provider registered, the fixture displays `Price on request`.

Render Add to Inquiry as a disabled/non-submitting button when `inquiry_enabled === false`:

```php
<button
    class="rosa-product-detail__inquiry-button"
    type="button"
    data-rosa-inquiry-action
    <?php disabled(! $view['inquiry_enabled']); ?>
>
    <?php esc_html_e('Add to Inquiry', 'rosa-medical'); ?>
</button>
```

This is an explicit scope boundary, not a fake shopping action. The later inquiry subsystem enables the existing integration seam rather than replacing this visual structure.

- [ ] **Step 6: Implement configuration presentation JS**

`product-detail.js` handles only display synchronization:

```js
const root = document.querySelector('[data-rosa-product-detail]');
if (root) {
  root.addEventListener('change', (event) => {
    const input = event.target.closest('[data-rosa-configuration]');
    if (!input) return;
    root.querySelector('[data-rosa-selected-sku]').textContent = input.dataset.sku || '';
    root.querySelectorAll('[data-rosa-selected-attribute]').forEach((node) => {
      const key = node.dataset.rosaSelectedAttribute;
      node.textContent = key ? (input.dataset[key] || '') : '';
    });
  });
}
```

Do not store inquiry items, mutate WooCommerce variations or calculate prices in JS.

- [ ] **Step 7: Implement Product Detail CSS and mobile sticky geometry**

Desktop uses approximately `1.1fr / 0.9fr` only when the summary can remain near 28rem. Otherwise stack.

Mobile sticky action styling must reserve space:

```css
.rosa-product-detail[data-sticky-action="true"] {
  padding-block-end: calc(var(--rosa-sticky-action-height, 4.5rem) + env(safe-area-inset-bottom) + 1rem);
}

.rosa-product-detail__sticky-action {
  position: fixed;
  inset-inline: 0;
  inset-block-end: 0;
  padding-block-end: env(safe-area-inset-bottom);
}
```

Only show the sticky region after a valid configuration is resolved; do not create a second state model. Ensure it cannot cover title, configuration controls, notices or footer.

- [ ] **Step 8: Run Product Detail tests, syntax and JS checks**

Run:

```bash
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js
```

Expected: PASS.

- [ ] **Step 9: Commit Task 6**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/product-template-hook.test.sh \
  wordpress/scripts/tests/product-detail-structure.test.sh \
  wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
git commit -m "feat(wordpress): build Rosa production product detail"
```

---

### Task 7: Complete responsive, RTL and accessibility behavior across shell, archive and Product Detail

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js`
- Create: `docs/runbooks/wordpress-phase2a-visual-acceptance.md`

**Interfaces:**
- Consumes: all completed Phase 2A structures.
- Produces: normative breakpoint transformations, short-height behavior, reduced-motion/RTL/zoom requirements and manual acceptance procedure.

- [ ] **Step 1: Add a source contract for logical properties and reduced motion**

Extend Phase 2A shell/catalogue/detail tests to require:

```bash
grep -Fq 'margin-inline' wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css
grep -Fq 'inset-inline' wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css
grep -Fq '@media (prefers-reduced-motion: reduce)' wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css
grep -Fq '@media (max-height: 800px)' wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css
```

- [ ] **Step 2: Run contracts and verify the newly added assertions RED where behavior is missing**

Run all Phase 2A source tests. Expected: at least the newly required short-height/logical-property assertions fail until the CSS is completed.

- [ ] **Step 3: Implement the responsive matrix directly from the approved spec**

Required modes:

- `390/430`: logo + menu header; quote action in drawer; one/two card columns based on readability; stacked Product Detail; bounded gallery; one-column footer; sticky action safe-area reserved.
- `768`: drawer navigation; no permanent filter sidebar; two/three cards; stacked Product Detail; footer may become two columns.
- `1024`: drawer allowed; no permanent sidebar unless three readable cards remain; three/four cards; split Product Detail only when summary keeps ~28rem; explicit 1024×768 short-height tuning.
- `1366`: full nav; 14.5–17rem sidebar when provider exists; four/five cards; two-column Product Detail; 1366×768 tuning.
- `1440`: five cards is a valid target with readable real content.
- `1920/2560`: no unbounded extra columns; 80–90rem functional rails stay centered.

Use media/container queries based on content fit rather than framework defaults.

- [ ] **Step 4: Implement RTL-safe geometry**

No duplicated RTL templates. Use logical properties for drawer direction, card separators, padding, gallery/thumb rail, sticky action and footer groups. Any directional arrow icon must mirror through `[dir="rtl"]` only when direction carries meaning.

- [ ] **Step 5: Implement focus/touch/reduced-motion safeguards**

- practical target size >=44px; core controls around 48px;
- visible focus on every nav/menu/card/configuration/PDF action;
- selected radio/configuration state not color-only;
- no hover-only information;
- motion removed under `prefers-reduced-motion`;
- sticky action never covers focused elements.

- [ ] **Step 6: Write the exact manual visual acceptance runbook**

`wordpress-phase2a-visual-acceptance.md` must prescribe checks at:

```text
390×844
430×932
768×1024
1024×768
1366×768
1440×900
1920×1080
2560×1440
```

For each width, inspect `/products/` and the Stevens Product Detail. Also require:

- desktop + mobile menu keyboard path;
- Escape and focus return;
- 200% browser zoom/reflow;
- text-spacing override;
- `prefers-reduced-motion`;
- representative `dir="rtl"` shell/detail rendering;
- no horizontal overflow;
- no sticky overlap;
- contained instrument imagery;
- readable card title/reference at the chosen column count.

- [ ] **Step 7: Run all source checks**

Run:

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js
```

Expected: PASS.

- [ ] **Step 8: Commit Task 7**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets \
  wordpress/scripts/tests \
  docs/runbooks/wordpress-phase2a-visual-acceptance.md
git commit -m "refactor(wordpress): harden Rosa responsive visual foundation"
```

---

### Task 8: Add integrated local-runtime verification and deterministic screenshot capture

**Files:**
- Create: `wordpress/scripts/phase2a-runtime-verify.sh`
- Create: `wordpress/scripts/phase2a-responsive-capture.sh`
- Modify only if required by equivalent production marker: `wordpress/scripts/foundation-product-verify.sh`

**Interfaces:**
- Consumes: existing disposable foundation runtime, `foundation-bootstrap.sh`, `foundation-seed.sh`, all Phase 2A source/runtime structures.
- Produces: one command for Phase 2A runtime acceptance and one repeatable screenshot matrix under a local ignored output directory.

- [ ] **Step 1: Write `phase2a-runtime-verify.sh` as a fail-fast aggregator**

It must run source contracts first:

```bash
bash wordpress/scripts/tests/foundation-preflight.test.sh
bash wordpress/scripts/tests/foundation-contract.test.sh
bash wordpress/scripts/tests/foundation-theme-contract.test.sh
bash wordpress/scripts/tests/foundation-verify-contract.test.sh
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
php wordpress/scripts/tests/phase2a-product-presentation.test.php
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
```

Then verify PHP/shell/JS syntax for all changed files.

Then require the running disposable runtime and execute:

```bash
bash wordpress/scripts/foundation-seed.sh
bash wordpress/scripts/foundation-product-verify.sh
```

Finally `curl -fsS` Home, `/products/`, and the Stevens Product Detail URL and assert:

- exactly one `<main` occurrence;
- ROSA shell markers present;
- no `woocommerce-coming-soon` interception marker;
- Product Detail includes `04-0901` and `04-0911`;
- Product Detail includes `Price on request` when no pricing provider is registered;
- no `Add to cart`, `Related products`, rating or shipping strings in Rosa-owned Product Detail markup.

- [ ] **Step 2: Run runtime verifier before completion and fix only Phase 2A-caused failures**

Run:

```bash
bash wordpress/scripts/phase2a-runtime-verify.sh
```

Expected: PASS after Tasks 1–7. If a failure occurs, invoke `superpowers:systematic-debugging` before changing implementation.

- [ ] **Step 3: Implement deterministic screenshot capture**

`phase2a-responsive-capture.sh` creates an ignored local directory such as `wordpress/.phase2a-artifacts/` and captures `/products/` and the discovered Stevens Product Detail URL at all eight viewport sizes.

Use the already-installed workspace Playwright CLI without modifying `apps/web/**`. Example command shape:

```bash
pnpm --filter @rosa/web exec playwright screenshot \
  --viewport-size="1440,900" \
  "http://localhost:${ROSA_WP_PORT:-8088}/products/" \
  "wordpress/.phase2a-artifacts/products-1440x900.png"
```

The script repeats this for both routes and every approved viewport. Add `wordpress/.phase2a-artifacts/` to the appropriate local ignore file if it is not already ignored; never commit screenshots by default.

- [ ] **Step 4: Run screenshot capture and perform the runbook review**

Run:

```bash
bash wordpress/scripts/phase2a-responsive-capture.sh
```

Review every capture according to `docs/runbooks/wordpress-phase2a-visual-acceptance.md`. Record specific pass/fail notes rather than “looks good.”

- [ ] **Step 5: Rerun the final foundation verifier with the previously accepted manual foundation attestations only if those checks are genuinely revalidated**

Do not blindly reuse environment variables. Re-run representative browser/editor checks affected by changed shell CSS before attesting.

Expected final automated result remains compatible with:

```text
PASS: automated foundation runtime + Elementor editability + responsive shell + browser-console acceptance confirmed
```

- [ ] **Step 6: Commit Task 8**

```bash
git add wordpress/scripts/phase2a-runtime-verify.sh \
  wordpress/scripts/phase2a-responsive-capture.sh \
  wordpress/scripts/foundation-product-verify.sh \
  .gitignore wordpress/.gitignore 2>/dev/null || true
git commit -m "test(wordpress): add Phase 2A runtime visual verification"
```

Stage only ignore files that actually changed; do not use the command above to accidentally stage unrelated files.

---

### Task 9: Run final verification, independent review and record Phase 2A completion evidence

**Files:**
- Create: `docs/superpowers/completions/2026-08-30-wordpress-phase-2a-balanced-visual-foundation.md`
- Modify only if coordination requires a factual append-only entry: `README.md`

**Interfaces:**
- Consumes: all Task 1–8 commits and verification evidence.
- Produces: reviewable completion record; no production deployment.

- [ ] **Step 1: Run the full Phase 2A targeted verification from a clean worktree**

Run:

```bash
bash wordpress/scripts/phase2a-runtime-verify.sh
bash wordpress/scripts/phase2a-responsive-capture.sh
git status --short
```

Also run every PHP file in `wordpress/wp-content` through `php -l` and every shell script under `wordpress/scripts` through `bash -n`.

Expected: all Phase 2A and foundation checks PASS. The worktree contains no unintended generated artifacts.

- [ ] **Step 2: Check forbidden dependencies and consumer-commerce leakage**

Run repository-scoped searches over changed WordPress source:

```bash
grep -RniE 'medicashop|elementor[ -]?pro|elementskit|skyboot|wpml' wordpress/wp-content wordpress/scripts || true
grep -RniE 'add to cart|checkout|my account|shipping|rating|wishlist|sale badge|related products' \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/wp-content/plugins/rosa-medical-core || true
```

Any match must be either a deliberate negative test/comment or removed before completion.

- [ ] **Step 3: Review the final diff against the approved specification**

Explicitly map final evidence to all 20 acceptance criteria in the spec. Confirm especially:

- 4–5-card desktop density where readable;
- no destructive image crop;
- exact configuration/SKU prominence;
- truthful Price-on-Request default;
- inquiry control non-submitting until its subsystem exists;
- dynamic PDF relationship support;
- one-main landmark;
- priority-100 template repair preserved;
- no Coming Soon regression;
- 390/430/768/1024/1366/1440/1920/2560 visual evidence;
- 1024×768 and 1366×768 short-height evidence;
- no Hostinger/production activity.

- [ ] **Step 4: Request independent code/spec review**

Invoke `superpowers:requesting-code-review`. Reviewer must inspect:

- approved spec compliance;
- theme/plugin responsibility boundary;
- accessibility/drawer/focus behavior;
- Product Detail routing priority/fallback;
- exact fixture preservation;
- no dead retail controls;
- no invented pricing/inquiry persistence;
- diff cleanliness and tests.

Resolve review findings before claiming completion.

- [ ] **Step 5: Use verification-before-completion before writing the completion record**

Invoke `superpowers:verification-before-completion` and rerun any command whose evidence became stale after review fixes.

- [ ] **Step 6: Write the completion record**

The completion record must include:

```text
branch + exact HEAD
spec path
plan path
files added/modified
foundation checks
Phase 2A source tests
runtime verification result
screenshot matrix review result
manual keyboard/focus/zoom/RTL result
Stevens fixture proof
known unrelated repository-wide lint blocker
independent review findings/resolution
explicit statement that Hostinger/production/catalogue mass import were untouched
remaining future phases: discovery, pricing persistence, inquiry persistence, full catalogue import, multilingual/client-role/security/deployment work
```

Do not claim those future subsystems are complete.

- [ ] **Step 7: Commit the completion record**

```bash
git add docs/superpowers/completions/2026-08-30-wordpress-phase-2a-balanced-visual-foundation.md
git commit -m "docs: record WordPress Phase 2A visual foundation"
```

- [ ] **Step 8: Stop before integration**

Do not merge into `wordpress/medicashop-migration`, open a PR, rebase, touch Hostinger or begin the next migration subsystem unless the user explicitly authorizes the next action.

---

## Plan Self-Review Record

### Spec coverage

- Design tokens/typography/rails/geometry/motion: Task 1.
- Header/nav/mobile drawer/footer/centralized business values: Task 2.
- Exact real configuration projection and truthful reference semantics: Task 3.
- Dynamic Media Library family PDF relationship: Task 4.
- Filter-ready Products archive, dense 4–5 card target, card hierarchy, missing-image/no-results states: Task 5.
- Production Product Detail, configuration selection, SKU/attributes, Price-on-Request default, inquiry presentation, sticky mobile geometry: Task 6.
- Full responsive matrix, short-height, accessibility, reduced motion, RTL, zoom/reflow procedure: Task 7.
- Real public rendering, foundation-regression protection and deterministic screenshots: Task 8.
- Independent review, fresh verification, exact completion evidence and stop-before-integration gate: Task 9.

### Intentional non-implementation boundaries

This plan intentionally does not implement advanced contextual filter/search semantics, complete-row reveal behavior, authoritative Rosa pricing persistence/synchronization, inquiry/quotation persistence, full catalogue import, multilingual routing/content, client-role hardening or deployment. It gives those future subsystems stable visual and integration seams without creating temporary competing implementations.

### Type/interface consistency

The theme consumes one normalized `ProductPresentation::forProduct()` structure. Future pricing integrates through `rosa_medical_product_price_state`; future inquiry capability integrates through `rosa_medical_inquiry_enabled`; future filters and row-aware reveal integrate through `rosa_medical_archive_filters` and `rosa_medical_archive_reveal`. Family PDF rendering consumes only `FamilyCatalogue` output. No later task renames these interfaces.
