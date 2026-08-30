# Rosa Medical WordPress Phase 2A — Balanced Visual Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the accepted free WordPress foundation into the approved Balanced Rosa visual foundation for the protected public shell, Products archive/product cards, Product Detail, responsive behavior, catalogue-PDF placement and accessibility contracts without implementing the later discovery, pricing-persistence, inquiry-persistence or catalogue-import subsystems.

**Architecture:** `rosa-medical-child` owns production presentation: tokens, shared shell, WooCommerce archive rendering, product-card rendering, Product Detail composition, responsive CSS and presentation JavaScript. WooCommerce remains the structured catalogue source. `rosa-medical-core` supplies normalized product/configuration and family-document presentation data, preserves the verified priority-100 Product Detail routing repair, and exposes explicit integration seams for later authoritative pricing, inquiry, filters and row-aware reveal rather than creating temporary competing implementations.

**Tech Stack:** WordPress 7.1 foundation runtime; PHP 8.3; MariaDB 11.4; Hello Elementor; Elementor Free 4.2.3; WooCommerce 11.0.1; Rosa PHP/CSS/vanilla JS; Docker Compose; WP-CLI; Bash/PHP contract tests; the repository's existing Playwright CLI for local screenshot capture only.

**Spec:** `docs/superpowers/specs/2026-08-30-rosa-wordpress-phase-2a-balanced-visual-foundation-design.md`

**Approval:** User explicitly approved the Phase 2A design specification on 2026-08-30 before this plan was written.

## Global Constraints

- Before Task 1, invoke `superpowers:using-git-worktrees` and create an isolated worktree/branch from the exact `docs/phase-2a-formal-design` HEAD containing this plan. Recommended branch: `wordpress/phase-2a-balanced-visual-foundation`.
- Do not implement directly on `wordpress/medicashop-migration`.
- Preserve the free-first stack: WordPress, Hello Elementor, Elementor Free, WooCommerce, WordPress Media Library, `rosa-medical-child`, `rosa-medical-core`.
- Do not add MedicaShop, Elementor Pro, WPML as a prerequisite, ElementsKit, Skyboot or another paid/proprietary template dependency.
- Do not touch Hostinger, production DNS, production databases, production Cloudflare configuration or unrelated sites.
- Do not mass-import the catalogue in this phase.
- Do not modify `apps/web/**`; it is read-only migration evidence.
- Preserve the canonical foundation fixture exactly: Scissors → Stevens Scissors — Regular; 10.5 cm; `04-0901` Straight/Sharp; `04-0911` Curved/Sharp; no invented configurations.
- Preserve `RosaMedical\Core\Plugin::productTemplate` at `template_include` priority `100` unless an equivalent later priority is separately proven. Preserve the WooCommerce Coming Soon foundation protection.
- Preserve exactly one page-level `<main>` landmark.
- Do not introduce cart, checkout, account, payment, shipping, ratings/reviews, sale badges, stock urgency, wishlist or related-products UX.
- Primary navigation is exactly Home, About Us, Products, Inquiry, Contact Us. Primary CTA defaults to `Request a quote`.
- At 1366/1440, the archive should generally render four to five readable cards when real-content minimum width permits. Five at 1440 is a target, not a universal hard-coded count.
- Product media uses contained presentation. Never crop long instruments merely to fill a card.
- Phase 2A must not invent authoritative pricing persistence. Without a later pricing provider, the truthful state is `Price on request`.
- Phase 2A must not invent inquiry/quotation persistence. Without a later inquiry provider, Add to Inquiry remains visibly present as the approved visual seam but non-submitting/disabled.
- Theme code owns presentation; business semantics stay in `rosa-medical-core`.
- Use logical CSS properties so the same DOM remains RTL-safe.
- Keep strings translation-ready with text domain `rosa-medical`.
- Repository-wide pnpm verification currently has two pre-existing React lint errors in `products-discovery-workspace.tsx`; targeted WordPress verification is authoritative for this phase, and unrelated failures must be reported separately.

## File Responsibility Map

### Existing files modified

- `wordpress/wp-content/themes/rosa-medical-child/functions.php` — theme support, protected navigation include, CSS/JS enqueueing.
- `wordpress/wp-content/themes/rosa-medical-child/header.php` — skip link, production header and drawer, single main landmark.
- `wordpress/wp-content/themes/rosa-medical-child/footer.php` — procurement footer and centralized business values.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css` — canonical Phase 2A visual tokens.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css` — typography, rails, focus and shared primitives.
- `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php` — require new catalogue services.
- `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php` — preserve priority-100 routing while preferring the production child-theme Product Detail template.
- `wordpress/scripts/tests/product-template-hook.test.sh` — protect routing priority/theme-preference/plugin-fallback contract.
- `wordpress/scripts/tests/product-detail-structure.test.sh` — protect one-main structure for the production detail template.
- `wordpress/scripts/foundation-product-verify.sh` — change only if the production marker requires an equivalent assertion; never weaken SKU/fixture parity.

### New child-theme files

- `wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js`
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js`
- `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/catalogue-panel.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php`

### New `rosa-medical-core` files

- `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php`

### New verification/documentation files

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

### Task 1: Establish the approved Rosa token and typography foundation

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`
- Create: `wordpress/scripts/tests/phase2a-theme-tokens.test.sh`

**Interfaces:**
- Consumes: approved Phase 2A visual contract.
- Produces: stable CSS variables and asset handles `rosa-medical-fonts`, `rosa-medical-tokens`, `rosa-medical-base` used by all later tasks.

- [ ] **Step 1: Write the failing token contract**

Create `phase2a-theme-tokens.test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
TOKENS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css"
BASE="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css"
FUNCTIONS="$ROOT_DIR/wordpress/wp-content/themes/rosa-medical-child/functions.php"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq -- '--color-rosa-red: #e00815' "$TOKENS" || fail 'Rosa red missing'
grep -Fq -- '--color-rosa-red-dark: #b9000b' "$TOKENS" || fail 'dark red missing'
grep -Fq -- '--color-ink: #191917' "$TOKENS" || fail 'ink missing'
grep -Fq -- '--color-warm-white: #f9f7f2' "$TOKENS" || fail 'warm white missing'
grep -Fq -- '--container-reading: 46rem' "$TOKENS" || fail 'reading rail missing'
grep -Fq -- '--container-standard: 72rem' "$TOKENS" || fail 'standard rail missing'
grep -Fq -- '--container-wide: 80rem' "$TOKENS" || fail 'wide rail missing'
grep -Fq -- '--container-archive: 90rem' "$TOKENS" || fail 'archive rail missing'
grep -Fq -- '--radius-control: 0.25rem' "$TOKENS" || fail 'control radius missing'
grep -Fq -- '--radius-surface: 0.125rem' "$TOKENS" || fail 'surface radius missing'
grep -Fq -- '--motion-micro: 160ms' "$TOKENS" || fail 'micro motion missing'
grep -Fq -- '--motion-component: 280ms' "$TOKENS" || fail 'component motion missing'
grep -Fq 'font-family: var(--font-interface)' "$BASE" || fail 'interface font not consumed'
grep -Fq 'rosa-medical-fonts' "$FUNCTIONS" || fail 'font stylesheet handle missing'
printf 'PASS: Phase 2A token contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
```

Expected: FAIL against the current generic WordPress prototype token layer.

- [ ] **Step 3: Replace prototype tokens with approved values**

`tokens.css` must define at least:

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

- [ ] **Step 4: Load the approved free font families with safe fallbacks**

In `functions.php`, enqueue:

```php
wp_enqueue_style(
    'rosa-medical-fonts',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@400;500;600&family=Tajawal:wght@400;500;700&display=swap',
    [],
    null
);
```

Then enqueue tokens/base after it. `base.css` must use `var(--font-interface)` for body, `var(--font-arabic)` when document direction/language is Arabic, and `var(--font-editorial)` only for approved display roles. A font-network failure must degrade to the defined fallbacks.

Add these rails:

```css
.rosa-rail {
  width: min(calc(100% - (2 * var(--page-gutter))), var(--container-standard));
  margin-inline: auto;
}
.rosa-rail--wide { max-width: var(--container-wide); }
.rosa-rail--archive { max-width: var(--container-archive); }
.rosa-rail--reading { max-width: var(--container-reading); }
```

Focus contract:

```css
:focus-visible { outline: 3px solid var(--color-ink); outline-offset: 3px; }
.rosa-surface--dark :focus-visible,
.rosa-action--brand:focus-visible { outline-color: var(--color-paper); }
```

- [ ] **Step 5: Run GREEN and syntax checks**

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
bash wordpress/scripts/tests/foundation-theme-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/functions.php
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/functions.php \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css \
  wordpress/scripts/tests/phase2a-theme-tokens.test.sh
git commit -m "feat(wordpress): establish Rosa Phase 2A design tokens"
```

---

### Task 2: Build the protected production header, accessible mobile drawer and procurement footer

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js`
- Create: `wordpress/scripts/tests/phase2a-shell-contract.test.sh`

**Interfaces:**
- Consumes: `rosa_theme_business_value(string $key, string $default = ''): string`; Task 1 tokens; WordPress/Woo route predicates.
- Produces: `rosa_theme_primary_navigation(): array`, `rosa_theme_nav_is_active(string $key): bool`, `[data-rosa-menu-*]` drawer hooks, exact one `<main id="main">`.

- [ ] **Step 1: Write the failing shell contract**

The test must assert:

```bash
NAV=wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
HEADER=wordpress/wp-content/themes/rosa-medical-child/header.php
FOOTER=wordpress/wp-content/themes/rosa-medical-child/footer.php
JS=wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js

grep -Fq "'Home'" "$NAV"
grep -Fq "'About Us'" "$NAV"
grep -Fq "'Products'" "$NAV"
grep -Fq "'Inquiry'" "$NAV"
grep -Fq "'Contact Us'" "$NAV"
grep -Fq 'href="#main"' "$HEADER"
grep -Fq 'data-rosa-menu-trigger' "$HEADER"
grep -Fq 'data-rosa-menu-drawer' "$HEADER"
grep -Fq 'data-rosa-menu-overlay' "$HEADER"
grep -Fq '<main id="main"' "$HEADER"
! grep -Fq 'wp_nav_menu' "$HEADER"
grep -Fq "rosa_theme_business_value('phone'" "$FOOTER"
grep -Fq "rosa_theme_business_value('email'" "$FOOTER"
grep -Fq '.inert = true' "$JS"
grep -Fq '.inert = false' "$JS"
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
```

Expected: FAIL because the current shell is the foundation prototype.

- [ ] **Step 3: Implement the protected navigation model**

`inc/navigation.php`:

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

`rosa_theme_nav_is_active('products')` returns true for the Woo product archive, product-category/taxonomy contexts and single product. Other keys resolve against their protected routes. Do not let client menu editing alter this five-destination structural contract.

- [ ] **Step 4: Add theme support and production header markup**

In `functions.php`, require `inc/navigation.php` and register `custom-logo`, `title-tag`, WooCommerce support.

`header.php` structural order:

```php
<a class="rosa-skip-link" href="#main"><?php esc_html_e('Skip to content', 'rosa-medical'); ?></a>
<header class="rosa-site-header" data-rosa-site-header>
  <div class="rosa-rail rosa-rail--wide rosa-site-header__inner">
    <!-- approved custom logo when configured, otherwise visible ROSA wordmark -->
    <!-- protected five-item desktop nav -->
    <!-- language slot only when a real locale switcher exists -->
    <!-- Request a quote -->
    <!-- menu trigger -->
  </div>
  <div class="rosa-menu-overlay" data-rosa-menu-overlay hidden></div>
  <aside class="rosa-menu-drawer" data-rosa-menu-drawer hidden aria-label="<?php echo esc_attr__('Site menu', 'rosa-medical'); ?>">
    <!-- close button, five nav links, optional real language control, quote CTA -->
  </aside>
</header>
<main id="main" class="rosa-site-main">
```

Use `ROSA` as visible fallback branding, not the WordPress site name as a new public logo treatment.

- [ ] **Step 5: Implement drawer focus, Escape, scroll lock and inert background**

`site-shell.js` must preserve and restore background interactivity:

```js
const trigger = document.querySelector('[data-rosa-menu-trigger]');
const drawer = document.querySelector('[data-rosa-menu-drawer]');
const overlay = document.querySelector('[data-rosa-menu-overlay]');
const main = document.querySelector('.rosa-site-main');
const footer = document.querySelector('.rosa-site-footer');

function setBackgroundInert(value) {
  [main, footer].forEach((node) => {
    if (node) node.inert = value;
  });
}

function openMenu() {
  trigger?.setAttribute('aria-expanded', 'true');
  drawer?.removeAttribute('hidden');
  overlay?.removeAttribute('hidden');
  document.documentElement.classList.add('rosa-menu-open');
  setBackgroundInert(true);
  drawer?.querySelector('a, button')?.focus();
}

function closeMenu({ restoreFocus = true } = {}) {
  trigger?.setAttribute('aria-expanded', 'false');
  drawer?.setAttribute('hidden', '');
  overlay?.setAttribute('hidden', '');
  document.documentElement.classList.remove('rosa-menu-open');
  setBackgroundInert(false);
  if (restoreFocus) trigger?.focus();
}
```

Add trigger/close/overlay handlers, Escape close, and a Tab/Shift+Tab focus loop over enabled drawer anchors/buttons/inputs. When a drawer navigation link is activated, close without forcing focus back to the trigger before navigation.

- [ ] **Step 6: Implement corporate procurement footer**

Desktop groups:

1. ROSA + concise procurement context + Request a quote.
2. Products: Knives, Scissors, Punches, Chisels, Cutters, Catalogues.
3. Company: About Us, Procurement support, Contact Us.
4. Support: Inquiry, Search, Privacy Policy, Terms.

Phone/email/address must come only from `rosa_theme_business_value()`. Do not add pharmacy services, newsletter, payment logos, shipping claims or fake certifications.

- [ ] **Step 7: Add `shell.css` and enqueue assets**

Use sticky white/paper header, subtle scrolled separation, near-black footer, logical-inline-end drawer, 44–48px practical targets and the 80rem wide rail. Collapse desktop nav around real-content fit near 70rem instead of truncating labels.

Enqueue `shell.css` after `base.css` and `site-shell.js` in footer scope.

- [ ] **Step 8: Run GREEN and structure checks**

```bash
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/inc/navigation.php
php -l wordpress/wp-content/themes/rosa-medical-child/header.php
php -l wordpress/wp-content/themes/rosa-medical-child/footer.php
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js
```

Expected: PASS; one theme-owned main remains.

- [ ] **Step 9: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/phase2a-shell-contract.test.sh
git commit -m "feat(wordpress): build Rosa production public shell"
```

---

### Task 3: Add the normalized WooCommerce product presentation adapter

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Create: `wordpress/scripts/tests/phase2a-product-presentation.test.php`

**Interfaces:**
- Consumes: `WC_Product`, published `WC_Product_Variation` children, Woo product categories and image attachment data.
- Produces: `ProductPresentation::forProduct(WC_Product $product): array`.
- Future integration seams: `rosa_medical_product_price_state`, `rosa_medical_inquiry_enabled`.

- [ ] **Step 1: Write the failing pure-helper contract**

Stub `__()`, `_n()` and `apply_filters()` and assert:

```php
expectSame(
    ['kind' => 'request', 'label' => 'Price on request'],
    ProductPresentation::defaultPriceState(),
    'Phase 2A must not invent numeric pricing'
);
expectSame(false, ProductPresentation::defaultInquiryEnabled(), 'inquiry persistence is not active in Phase 2A');
expectSame(
    ['type' => 'single-sku', 'label' => '04-0901'],
    ProductPresentation::referenceSummary(['04-0901'], null),
    'single configuration exposes exact SKU'
);
expectSame(
    ['type' => 'configuration-count', 'label' => '2 configurations'],
    ProductPresentation::referenceSummary(['04-0901', '04-0911'], null),
    'multiple variations do not misuse one variation SKU as product identity'
);
```

- [ ] **Step 2: Run RED**

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
```

Expected: FAIL because the class does not exist.

- [ ] **Step 3: Implement stable helpers**

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
            'label' => sprintf(
                _n('%d configuration', '%d configurations', count($skus), 'rosa-medical'),
                count($skus)
            ),
        ];
    }
}
```

- [ ] **Step 4: Implement `forProduct()` against real WooCommerce data**

Return this stable shape:

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

Only published real variations are projected. Resolve taxonomy-backed attribute slugs to display names; never generate Size × Direction × Variant combinations.

Price seam:

```php
$price = apply_filters(
    'rosa_medical_product_price_state',
    self::defaultPriceState(),
    $product
);
```

Inquiry seam:

```php
$inquiryEnabled = (bool) apply_filters(
    'rosa_medical_inquiry_enabled',
    self::defaultInquiryEnabled(),
    $product
);
```

Do not treat arbitrary standard Woo price fields as Rosa's authoritative source in this phase.

- [ ] **Step 5: Require class and run GREEN**

Update `rosa-medical-core.php` to require `ProductPresentation.php` before `Plugin.php`.

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductPresentation.php
php -l wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core \
  wordpress/scripts/tests/phase2a-product-presentation.test.php
git commit -m "feat(wordpress): add Rosa product presentation adapter"
```

---

### Task 4: Add the authoritative family catalogue-PDF relationship reader

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Modify: `wordpress/scripts/tests/phase2a-product-presentation.test.php`

**Interfaces:**
- Consumes: product-category meta `_rosa_catalogue_attachment_id`; WordPress Media Library attachment APIs.
- Produces: `FamilyCatalogue::fromAttachmentId(int $attachmentId): ?array`, `forTerm(WP_Term $term): ?array`, `forProduct(WC_Product $product): ?array`.

- [ ] **Step 1: Add failing PDF assertions**

Add stubs for `get_post_mime_type()`, `wp_get_attachment_url()` and `get_the_title()` and assert:

```php
expectSame(null, FamilyCatalogue::fromAttachmentId(0), 'missing attachment returns null');

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
    'valid PDF becomes authoritative document reference'
);
```

Also assert a non-PDF MIME returns null.

- [ ] **Step 2: Run RED**

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
```

Expected: FAIL because `FamilyCatalogue` does not exist.

- [ ] **Step 3: Implement one metadata contract**

```php
public const META_KEY = '_rosa_catalogue_attachment_id';
```

`fromAttachmentId()` returns null unless attachment ID is positive, MIME is exactly `application/pdf`, and URL is non-empty. `forTerm()` reads only `META_KEY`. `forProduct()` deterministically resolves the relevant product category and returns document data plus family name/slug; it must not hard-code PDF URLs.

- [ ] **Step 4: Require class and run GREEN**

```bash
php wordpress/scripts/tests/phase2a-product-presentation.test.php
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/FamilyCatalogue.php
php -l wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core \
  wordpress/scripts/tests/phase2a-product-presentation.test.php
git commit -m "feat(wordpress): add family catalogue PDF presentation source"
```

---

### Task 5: Build the dense Rosa WooCommerce archive and reusable product cards

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/catalogue-panel.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/scripts/tests/phase2a-catalogue-contract.test.sh`

**Interfaces:**
- Consumes: WooCommerce main query; `ProductPresentation`; `FamilyCatalogue`.
- Future visual integration seams: `rosa_medical_archive_filters`, `rosa_medical_archive_reveal`.
- Produces: protected `/products` archive composition and dense card partial.

- [ ] **Step 1: Write the failing archive/card contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
ARCHIVE=wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
CARD=wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css

grep -Fq 'rosa-products-search' "$ARCHIVE"
grep -Fq "has_action('rosa_medical_archive_filters')" "$ARCHIVE"
grep -Fq "do_action('rosa_medical_archive_filters')" "$ARCHIVE"
grep -Fq 'rosa-products-grid' "$ARCHIVE"
grep -Fq "do_action('rosa_medical_archive_reveal')" "$ARCHIVE"
grep -Fq 'ProductPresentation::forProduct' "$CARD"
grep -Fq 'object-fit: contain' "$CSS"
grep -Fq 'minmax(12rem, 1fr)' "$CSS"
! grep -Eqi 'add to cart|rating|stars|sale badge|shipping|checkout' "$CARD"
printf 'PASS: Phase 2A catalogue source contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
```

Expected: FAIL because production archive/card files do not exist.

- [ ] **Step 3: Implement archive anatomy and avoid an empty dead filter sidebar**

Use the Woo main loop, but own the presentation. Search action should resolve to the Woo product archive, with fallback to `/products/`:

```php
$productArchiveUrl = get_post_type_archive_link('product');
if (! is_string($productArchiveUrl) || $productArchiveUrl === '') {
    $productArchiveUrl = home_url('/products/');
}
$hasFilterProvider = has_action('rosa_medical_archive_filters');
```

Required composition:

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
    <form class="rosa-products-search" role="search" method="get" action="<?php echo esc_url($productArchiveUrl); ?>">
      <label for="rosa-product-search"><?php esc_html_e('Search products by name, code, size or option', 'rosa-medical'); ?></label>
      <input id="rosa-product-search" name="s" type="search" value="<?php echo esc_attr(get_search_query()); ?>">
      <input type="hidden" name="post_type" value="product">
    </form>
    <div class="rosa-products-layout<?php echo $hasFilterProvider ? ' has-filters' : ''; ?>">
      <?php if ($hasFilterProvider) : ?>
        <aside class="rosa-products-filters" aria-label="<?php echo esc_attr__('Product filters', 'rosa-medical'); ?>">
          <?php do_action('rosa_medical_archive_filters'); ?>
        </aside>
      <?php endif; ?>
      <div class="rosa-products-results">
        <!-- result header + grid -->
      </div>
    </div>
  </div>
</section>
<?php
get_footer();
```

Do **not** rely on CSS `:empty` for filter-sidebar suppression; template whitespace makes that brittle. No filter controls are faked before the later discovery subsystem registers the hook.

- [ ] **Step 4: Render Woo products through the Rosa card partial**

For each loop product, call `get_template_part('template-parts/product-card', null, ['product' => $product]);`. `product-card.php` calls `ProductPresentation::forProduct()` and renders exactly:

```text
contained product media
family signal
product title
truthful SKU/reference/configuration evidence
price state
View details
```

If image is missing, render a neutral Rosa placeholder. Do not substitute stock imagery.

- [ ] **Step 5: Implement the dense responsive grid**

Core desktop rule:

```css
.rosa-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--card-gap);
}

.rosa-product-card__media {
  aspect-ratio: 1;
  background: var(--color-paper);
}

.rosa-product-card__media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

When `.has-filters` exists at desktop content-fit widths, use a 14.5–17rem sidebar and results remainder. At narrow widths, the later filter provider supplies its compact disclosure; Phase 2A does not render a dead trigger. At `max-width:40rem`, permit a tested compact two-column minimum around 9rem, with a one-column/list fallback when real titles/SKUs fail readability. The 90rem archive rail prevents uncontrolled extra columns on 1920/2560.

- [ ] **Step 6: Add truthful empty/PDF/reveal seams**

- Replace generic empty-shop text with Rosa no-results copy and a reset/back-to-products path.
- Render `catalogue-panel.php` only when `FamilyCatalogue` returns a valid PDF.
- Keep `do_action('rosa_medical_archive_reveal')` after results. If no provider exists, it renders nothing; do not fake See More behavior in Phase 2A.

- [ ] **Step 7: Enqueue catalogue CSS only on Woo archive/product-taxonomy/product-search contexts**

Use route predicates in `functions.php`; do not load catalogue CSS on every editorial page.

- [ ] **Step 8: Run GREEN and PHP syntax checks**

```bash
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/product-card.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/catalogue-panel.php
```

Expected: PASS.

- [ ] **Step 9: Commit**

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
- Consumes: `ProductPresentation::forProduct()`, `FamilyCatalogue::forProduct()`, Task 1 tokens, priority-100 Product Detail routing.
- Produces: child-theme production detail template with real configuration controls, selected summary, price seam, non-submitting inquiry seam, PDF module and safe mobile action geometry.

- [ ] **Step 1: Write failing routing/detail contracts**

```bash
PLUGIN=wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php
DETAIL=wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php

grep -Fq "add_filter('template_include', [self::class, 'productTemplate'], 100)" "$PLUGIN"
grep -Fq 'template-parts/product-detail.php' "$PLUGIN"
! grep -Eq '<main([[:space:]>])' "$DETAIL"
grep -Fq 'data-rosa-product-detail' "$DETAIL"
grep -Fq 'data-rosa-configuration' "$DETAIL"
grep -Fq 'data-rosa-selected-sku' "$DETAIL"
grep -Fq 'data-rosa-price-state' "$DETAIL"
grep -Fq 'data-rosa-inquiry-action' "$DETAIL"
! grep -Eqi 'related products|add to cart|shipping|rating|wishlist|checkout' "$DETAIL"
```

- [ ] **Step 2: Run RED while preserving existing foundation contracts**

```bash
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
```

Expected: new Phase 2A contract FAIL; existing foundation contracts PASS before routing change.

- [ ] **Step 3: Prefer the child-theme production template without weakening priority 100**

In `Plugin::productTemplate()`:

```php
$themeTemplate = trailingslashit(get_stylesheet_directory()) . 'template-parts/product-detail.php';
if (is_readable($themeTemplate)) {
    return $themeTemplate;
}

$fallback = dirname(ROSA_MEDICAL_CORE_FILE) . '/templates/product-detail-prototype.php';
return is_readable($fallback) ? $fallback : $template;
```

Keep the existing filter registration at priority `100`. Update `product-template-hook.test.sh` so it requires priority 100, theme-template preference and plugin fallback. Do not change Coming Soon behavior.

- [ ] **Step 4: Implement the production Product Detail anatomy**

At file start:

```php
$product = wc_get_product(get_the_ID());
$view = $product instanceof WC_Product
    ? \RosaMedical\Core\Catalogue\ProductPresentation::forProduct($product)
    : null;
$catalogue = $product instanceof WC_Product
    ? \RosaMedical\Core\Catalogue\FamilyCatalogue::forProduct($product)
    : null;
get_header();
```

If `$view` is null, render a Rosa unavailable state inside the existing theme main, then footer.

Otherwise render:

```text
breadcrumb/family context
media + summary region
family + full h1 + concise description
Select configuration
selected SKU/Size/Direction/Variant summary
effective price / Price on request
quantity
Add to Inquiry presentation
family catalogue PDF when valid
specifications/procurement context
focused inquiry closure
```

Single-configuration products display one explicit configuration summary without a redundant selector. Multi-configuration products use semantic radio rows for the exact real variations only.

- [ ] **Step 5: Keep pricing and inquiry truthful**

Render `$view['price']`. Without a pricing provider, this is `Price on request`.

Render inquiry action as disabled/non-submitting until the future provider enables it:

```php
<button
  type="button"
  class="rosa-product-detail__inquiry-button"
  data-rosa-inquiry-action
  <?php disabled(! $view['inquiry_enabled']); ?>
>
  <?php esc_html_e('Add to Inquiry', 'rosa-medical'); ?>
</button>
```

If no valid configuration exists, action remains unavailable and the page shows a clear procurement-contact state. Do not redirect to Woo checkout.

- [ ] **Step 6: Implement presentation-only configuration synchronization**

`product-detail.js`:

```js
const root = document.querySelector('[data-rosa-product-detail]');

if (root) {
  root.addEventListener('change', (event) => {
    const input = event.target.closest('[data-rosa-configuration]');
    if (!input) return;

    const sku = root.querySelector('[data-rosa-selected-sku]');
    if (sku) sku.textContent = input.dataset.sku || '';

    root.querySelectorAll('[data-rosa-selected-attribute]').forEach((node) => {
      const key = node.dataset.rosaSelectedAttribute;
      node.textContent = key ? (input.dataset[key] || '') : '';
    });
  });
}
```

No inquiry persistence, Woo mutation or price arithmetic belongs in this JS.

- [ ] **Step 7: Implement desktop split and safe mobile sticky geometry**

Desktop uses approximately `1.1fr / 0.9fr` only when summary retains ~28rem. Otherwise stack. Media is contained and capped on large screens.

Mobile sticky action is permitted only when a valid configuration exists and must reserve document space:

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

Quantity stays in the main decision block. Do not create a second action state machine.

- [ ] **Step 8: Run GREEN and syntax checks**

```bash
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
php -l wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/product-detail.php
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/product-template-hook.test.sh \
  wordpress/scripts/tests/product-detail-structure.test.sh \
  wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
git commit -m "feat(wordpress): build Rosa production product detail"
```

---

### Task 7: Harden responsive, RTL and accessibility behavior

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/catalogue.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js`
- Create: `docs/runbooks/wordpress-phase2a-visual-acceptance.md`

**Interfaces:**
- Consumes: Tasks 1–6.
- Produces: approved breakpoint transformations, short-height behavior, RTL-safe geometry, reduced-motion and manual acceptance protocol.

- [ ] **Step 1: Extend source contracts so missing responsive safeguards fail**

Require:

```bash
grep -Fq 'margin-inline' wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css
grep -Fq 'inset-inline' wordpress/wp-content/themes/rosa-medical-child/assets/css/shell.css
grep -Fq '@media (prefers-reduced-motion: reduce)' wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css
grep -Fq '@media (max-height: 800px)' wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css
grep -Fq 'env(safe-area-inset-bottom)' wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail.css
```

- [ ] **Step 2: Run the Phase 2A source tests and verify RED only for newly missing safeguards**

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
```

Expected: newly introduced assertions fail until this task completes; previously completed task contracts remain green.

- [ ] **Step 3: Implement the exact responsive modes from the approved spec**

- 390/430: logo + menu header; quote CTA inside drawer; one/two card columns based on real-content readability; stacked Product Detail; bounded gallery; one-column footer; safe-area sticky action.
- 768: drawer navigation; no permanent filter sidebar; two/three cards; stacked detail; footer may be two columns.
- 1024: drawer is acceptable; permanent sidebar only if three readable card columns remain; otherwise three/four cards without it; detail splits only when summary retains ~28rem; test 1024×768.
- 1366: full nav; provider-backed 14.5–17rem sidebar; four/five cards; two-column detail; test 1366×768.
- 1440: five-card archive is a valid target when real cards remain readable.
- 1920/2560: 80–90rem functional rail remains bounded; no automatic extra columns or type scaling.

Use content-fit media/container queries rather than arbitrary framework defaults.

- [ ] **Step 4: Make geometry RTL-safe**

Use logical padding/margins/insets for drawer, product cards, filter slot, gallery/thumbnails, sticky action and footer. Mirror directional icons only when direction carries meaning. Do not duplicate templates for RTL.

- [ ] **Step 5: Enforce focus, target-size and reduced-motion behavior**

- practical targets >=44px; core controls approximately 48px;
- keyboard-visible focus on nav/menu/card/configuration/PDF/action controls;
- selected configuration not communicated by color alone;
- no hover-only information;
- reduced motion removes non-essential transitions/transforms;
- sticky action never obscures a focused element.

- [ ] **Step 6: Write the visual acceptance runbook**

The runbook must require Products + Stevens Product Detail at:

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

It must also require:

- mobile drawer keyboard traversal, Escape, focus return and inert background;
- 200% zoom/reflow;
- text-spacing override;
- `prefers-reduced-motion`;
- representative `dir="rtl"` shell/archive/detail rendering;
- no horizontal overflow;
- no sticky overlap;
- contained product imagery;
- readable title/reference at the actual chosen card count.

- [ ] **Step 7: Run GREEN**

```bash
bash wordpress/scripts/tests/phase2a-theme-tokens.test.sh
bash wordpress/scripts/tests/phase2a-shell-contract.test.sh
bash wordpress/scripts/tests/phase2a-catalogue-contract.test.sh
bash wordpress/scripts/tests/phase2a-product-detail-contract.test.sh
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/site-shell.js
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/product-detail.js
```

Expected: PASS.

- [ ] **Step 8: Commit**

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
- Modify only if required: `wordpress/scripts/foundation-product-verify.sh`
- Modify only if required: root `.gitignore` or `wordpress/.gitignore`

**Interfaces:**
- Consumes: disposable local foundation runtime, foundation seed/verifier, all Phase 2A source.
- Produces: repeatable targeted acceptance and ignored local screenshots.

- [ ] **Step 1: Implement a fail-fast `phase2a-runtime-verify.sh`**

It must run:

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

Then lint every PHP file under `wordpress/wp-content`, `bash -n` every shell script under `wordpress/scripts`, and `node --check` both Phase 2A JS files.

Then require the local runtime and run:

```bash
bash wordpress/scripts/foundation-seed.sh
bash wordpress/scripts/foundation-product-verify.sh
```

Resolve the seeded product URL via WP-CLI rather than hard-coding an ID, then `curl -fsS` Home, `/products/` and that Product Detail. Assert:

- each page has exactly one `<main` occurrence;
- Rosa shell marker is present;
- no Woo Coming Soon interception page;
- detail contains `04-0901`, `04-0911`, Straight and Curved;
- detail contains `Price on request` without a pricing provider;
- Rosa-owned detail output contains no Add to cart, Related products, rating, wishlist, shipping or checkout language.

- [ ] **Step 2: Run runtime verifier; debug systematically if it fails**

```bash
bash wordpress/scripts/phase2a-runtime-verify.sh
```

Expected: PASS. Any unexpected failure requires `superpowers:systematic-debugging` before code changes.

- [ ] **Step 3: Implement screenshot capture**

`phase2a-responsive-capture.sh` must create `wordpress/.phase2a-artifacts/`, discover the current Stevens product URL via WP-CLI, and capture Products + Product Detail at all eight approved sizes.

Use the existing workspace Playwright CLI without editing `apps/web/**`, e.g.:

```bash
pnpm --filter @rosa/web exec playwright screenshot \
  --viewport-size="1440,900" \
  "http://localhost:${ROSA_WP_PORT:-8088}/products/" \
  "wordpress/.phase2a-artifacts/products-1440x900.png"
```

Repeat for Product Detail and all specified dimensions.

- [ ] **Step 4: Ensure generated screenshots are ignored, without staging unrelated files**

Check:

```bash
git check-ignore -q wordpress/.phase2a-artifacts/ || true
git diff -- .gitignore wordpress/.gitignore
```

If no ignore rule exists, add exactly:

```gitignore
wordpress/.phase2a-artifacts/
```

to the appropriate tracked ignore file. Stage only the ignore file that actually changed.

- [ ] **Step 5: Capture and manually review every image using the runbook**

```bash
bash wordpress/scripts/phase2a-responsive-capture.sh
```

Record concrete pass/fail notes for each required width. Do not write only “looks good.” Revalidate drawer keyboard/focus, browser console, representative Elementor editorial-page shell rendering, RTL, 200% zoom and reduced motion before reusing any manual foundation attestation.

- [ ] **Step 6: Commit verification tooling**

Always stage:

```bash
git add wordpress/scripts/phase2a-runtime-verify.sh \
  wordpress/scripts/phase2a-responsive-capture.sh
```

If `foundation-product-verify.sh` changed, stage it explicitly:

```bash
git add wordpress/scripts/foundation-product-verify.sh
```

If an ignore file changed, stage that exact file only. Then:

```bash
git commit -m "test(wordpress): add Phase 2A runtime visual verification"
```

---

### Task 9: Run fresh final verification, independent review and record completion evidence

**Files:**
- Create: `docs/superpowers/completions/2026-08-30-wordpress-phase-2a-balanced-visual-foundation.md`
- Modify only if coordination requires an append-only factual entry: `README.md`

**Interfaces:**
- Consumes: Tasks 1–8 and their evidence.
- Produces: reviewable completion record. Does not integrate or deploy.

- [ ] **Step 1: Run final targeted verification from a clean worktree**

```bash
bash wordpress/scripts/phase2a-runtime-verify.sh
bash wordpress/scripts/phase2a-responsive-capture.sh
find wordpress/wp-content -type f -name '*.php' -print0 | xargs -0 -n1 php -l
find wordpress/scripts -type f -name '*.sh' -print0 | xargs -0 -n1 bash -n
git status --short
```

Expected: all Phase 2A/foundation checks PASS and no generated screenshots are tracked.

- [ ] **Step 2: Check forbidden-dependency and retail leakage**

```bash
grep -RniE 'medicashop|elementor[ -]?pro|elementskit|skyboot|wpml' \
  wordpress/wp-content wordpress/scripts || true

grep -RniE 'add to cart|checkout|my account|shipping|rating|wishlist|sale badge|related products' \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/wp-content/plugins/rosa-medical-core || true
```

Every match must be a deliberate negative assertion/comment or be removed before completion.

- [ ] **Step 3: Map final evidence to all 20 approved spec acceptance criteria**

Explicitly verify:

- recognizably Rosa, not recolored Woo/pharmacy;
- free-first architecture intact;
- protected shared shell/archive/card/detail;
- exact five-item nav;
- approved token/type/rail/geometry system;
- four/five-card standard-desktop density where readable;
- contained instrument imagery;
- SKU/configuration prominence;
- real variations only;
- truthful Price-on-Request default and no invented price persistence;
- non-submitting inquiry seam and no invented quote persistence;
- dynamic family PDF relationship;
- safe mobile detail action;
- bounded 1920/2560 rails;
- full 390/430/768/1024/1366/1440/1920/2560 evidence;
- one main landmark;
- keyboard/focus/touch/reduced-motion/zoom/RTL evidence;
- priority-100, Coming Soon and fixture repairs protected;
- no unverified claims promoted;
- no Hostinger/production work.

- [ ] **Step 4: Request independent review**

Invoke `superpowers:requesting-code-review`. Reviewer must inspect approved-spec compliance, theme/plugin boundaries, drawer/accessibility behavior, Product Detail routing priority/fallback, exact Stevens fixture, retail leakage, pricing/inquiry scope honesty, diff cleanliness and verification quality.

Fix accepted findings. Any bug or unexpected test failure discovered during review requires `superpowers:systematic-debugging` before repair.

- [ ] **Step 5: Verify again before claiming completion**

Invoke `superpowers:verification-before-completion`. Rerun every command whose evidence became stale after review fixes.

- [ ] **Step 6: Write the completion record with exact evidence**

Include:

```text
implementation branch and exact HEAD
approved spec path
implementation plan path
files added/modified
foundation checks
Phase 2A source tests
runtime verifier result
screenshot matrix result with per-width notes
keyboard/focus/inert/zoom/reduced-motion/RTL result
Stevens fixture proof
known unrelated repository-wide React lint blocker
independent-review findings and resolutions
explicit statement that Hostinger/production/catalogue mass import were untouched
future work still open: discovery, pricing persistence/sync, inquiry persistence, full catalogue import, multilingual, client-role hardening, security/performance and deployment
```

- [ ] **Step 7: Commit the completion record**

```bash
git add docs/superpowers/completions/2026-08-30-wordpress-phase-2a-balanced-visual-foundation.md
git commit -m "docs: record WordPress Phase 2A visual foundation"
```

If `README.md` genuinely needs a coordination entry, make it append-only, verify the diff, and commit it separately so the completion record remains reviewable.

- [ ] **Step 8: Stop before integration**

Do not merge into `wordpress/medicashop-migration`, open a PR, rebase, touch Hostinger or start the next migration subsystem without explicit user authorization.

---

## Plan Self-Review Record

### Spec coverage

- Tokens, fonts, rails, geometry, motion: Task 1.
- Header, five-item nav, inert accessible drawer, footer, centralized business values: Task 2.
- Real configuration projection and truthful card/detail reference semantics: Task 3.
- Dynamic Media Library family PDF relationship: Task 4.
- Filter-ready Products archive, dense card system, missing-image/no-results/PDF/reveal seams: Task 5.
- Production Product Detail, exact configuration selection, SKU/attributes, truthful price/inquiry seams and safe sticky geometry: Task 6.
- Full responsive matrix, short-height, RTL, focus, target size, reduced motion, zoom/reflow: Task 7.
- Real anonymous/public runtime checks, foundation regression protection and deterministic screenshots: Task 8.
- Fresh verification, independent review, completion evidence and stop-before-integration gate: Task 9.

### Placeholder/ambiguity review

- No `TBD`, `TODO`, “implement later,” or generic “add error handling” steps remain.
- Empty filter-sidebar handling is explicit through `has_action('rosa_medical_archive_filters')`; the plan does not rely on brittle `:empty` behavior.
- Search action targets the WooCommerce product archive with a `/products/` fallback.
- Drawer background inertness is explicit in code and in the shell contract.
- Screenshot staging is explicit and does not use broad `git add ... || true` commands.
- The Product Detail plugin fallback remains explicit while priority `100` is preserved.

### Intentional non-implementation boundaries

This plan intentionally does **not** implement advanced contextual filter/search semantics, complete-row reveal behavior, authoritative Rosa pricing persistence/synchronization, inquiry/quotation persistence, full catalogue import, multilingual routing/content, client-role hardening or deployment. It gives those future subsystems stable visual and integration seams without creating temporary competing implementations.

### Interface consistency

- Product templates consume `ProductPresentation::forProduct()`.
- Future pricing integrates through `rosa_medical_product_price_state`.
- Future inquiry capability integrates through `rosa_medical_inquiry_enabled`.
- Future discovery/reveal integrates through `rosa_medical_archive_filters` and `rosa_medical_archive_reveal`.
- Family documents consume `FamilyCatalogue` only.
- No later task renames these interfaces.
