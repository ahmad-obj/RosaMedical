# Rosa Medical Client-Preview MedicaShop Recreation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity, independently authored Rosa Medical recreation of the supplied MedicaShop Home/About/Contact/Shop visual references using the existing free WordPress foundation, with Rosa branding/content, paired English/Arabic preview routes, RTL support, responsive verification, and a client-video-ready local result.

**Architecture:** Start from `wordpress/medicashop-migration` at `6744207b97507f07761b30dd2d9ff505bff82fa1` on a new implementation branch `wordpress/client-preview-medicashop-recreation`; do not merge the completed Phase 2A visual branch. The child theme owns the preview shell, page templates, responsive/RTL presentation and Woo archive recreation; `rosa-medical-core` continues to own centralized business settings; a deterministic WP-CLI seed imports only Rosa-owned repository media and creates paired English/Arabic preview pages. The supplied ThemeForest ZIPs are visual-analysis evidence only and are never copied into production source or committed.

**Tech Stack:** WordPress, Hello Elementor parent, Elementor Free (available but not required for every protected preview template), WooCommerce, PHP 8.x, WordPress Media Library, Bash/WP-CLI, vanilla CSS/JS, Playwright CLI for screenshot/video acceptance.

**Spec:** `docs/superpowers/specs/2026-08-30-rosa-wordpress-client-preview-medicashop-recreation-design.md`

## Global Constraints

- Implement from `wordpress/medicashop-migration` at `6744207b97507f07761b30dd2d9ff505bff82fa1`; create/use `wordpress/client-preview-medicashop-recreation` for implementation.
- Preserve `wordpress/phase-2a-balanced-visual-foundation` at user-reported completed HEAD `4f7fb7bf721b143c02f140c187e3c41d85b98276`; do not merge, cherry-pick, rewrite, or delete it during this plan.
- The first client preview must remain recognizably MedicaShop-like in composition: header/footer silhouette, section order, banner placement, card geometry, vertical rhythm and responsive transformations.
- Recreate independently; do not copy or ship MedicaShop source code, Elementor Pro code, proprietary MedicaShop images, ThemeForest CSS/JS, ElementsKit, Skyboot or paid-template assets.
- Required stack remains WordPress + Hello Elementor + Elementor Free + WooCommerce + `rosa-medical-child` + `rosa-medical-core` + Media Library. No Elementor Pro, WPML, MedicaShop, ElementsKit, Skyboot or another paid dependency.
- Replace visible MedicaShop identity, demo contact values and pharmacy/retail claims with truthful Rosa Medical content while preserving the visual role of each block.
- Do not fabricate certifications, testimonials, customer claims, shipping guarantees, return policies, payment methods, operating hours, business addresses, phone numbers, emails or product specifications.
- Business phone/email/address come from the existing `rosa_business_settings` option through `rosa_theme_business_value()` / `rosa_business_value()`; the preview verifier must fail if required values are absent rather than inventing them.
- Use project-owned media from `apps/web/public/media/**` as source material without modifying `apps/web/**`; import selected files into WordPress Media Library at seed time.
- English and Arabic preview routes are paired. Arabic pages output `lang="ar"`, `dir="rtl"`, Arabic-capable typography and logical CSS geometry. This is a preview pairing system, not permanent enterprise multilingual architecture.
- The Shop preview uses real WooCommerce data only. With no authoritative numeric pricing provider, display `Price on request`; do not expose Checkout/My Account/cart flow, ratings, wishlist, sale badges, shipping or payment UI.
- A complete MedicaShop Single Product reference is not available; do not claim or implement pixel-fidelity Single Product recreation in this plan.
- No Hostinger, production deployment, DNS, Cloudflare or catalogue mass import.
- Required viewport acceptance: 390×844, 430×932, 768×1024, 1024×768, 1366×768, 1440×900, 1920×1080 and 2560×1440.
- Final deliverable is a verified local client-preview and a repeatable client-video capture path. Stop before integration or deployment.

---

## File Structure

### New theme preview units

- `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php` — locale/pair helpers, safe preview copy, media option access, shop label helpers.
- `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview-navigation.php` — localized preview navigation definitions and language-switch target resolution.
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php` — deterministic Home composition.
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php` — deterministic About composition.
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php` — deterministic Contact composition.
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php` — Arabic paired Shop page using the same Woo query/card renderer as English archive.
- `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php` — English Woo Shop/archive high-fidelity preview shell.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/*.php` — reusable hero, product grid/card, value strip, CTA/newsletter-role block, footer content modules.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css` — shared MedicaShop-like preview composition.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css` — Arabic-only adjustments not expressible through shared logical properties.
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js` — mobile navigation only; no business-state logic.

### New verification/seed units

- `wordpress/scripts/client-preview-seed.sh` — deterministic Rosa media import, page creation, template assignment, locale/pair metadata, front-page setup.
- `wordpress/scripts/client-preview-runtime-verify.sh` — fail-fast source/runtime verification.
- `wordpress/scripts/client-preview-responsive-capture.sh` — English/Arabic screenshots and diagnostic captures.
- `wordpress/scripts/client-preview-video-capture.sh` — repeatable Playwright video walkthrough recording for client review.
- `wordpress/scripts/tests/client-preview-reference-boundary.test.sh`
- `wordpress/scripts/tests/client-preview-content.test.php`
- `wordpress/scripts/tests/client-preview-seed-contract.test.sh`
- `wordpress/scripts/tests/client-preview-shell-contract.test.sh`
- `wordpress/scripts/tests/client-preview-home-contract.test.sh`
- `wordpress/scripts/tests/client-preview-about-contract.test.sh`
- `wordpress/scripts/tests/client-preview-contact-contract.test.sh`
- `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- `wordpress/scripts/tests/client-preview-rtl-contract.test.sh`

### Documentation/evidence

- `docs/superpowers/reports/2026-08-30-client-preview-reference-manifest.md` — sanitized structure inventory of supplied Home/About/Contact/Shop references; no proprietary source copied.
- `docs/runbooks/wordpress-client-preview-visual-acceptance.md` — exact review matrix for fidelity, RTL, accessibility and client-video acceptance.
- `docs/superpowers/completions/2026-08-30-wordpress-client-preview-medicashop-recreation.md` — final evidence record after fresh verification.

---

### Task 1: Lock the supplied-reference boundary and sanitized page manifest

**Files:**
- Create: `docs/superpowers/reports/2026-08-30-client-preview-reference-manifest.md`
- Create: `wordpress/scripts/tests/client-preview-reference-boundary.test.sh`

**Interfaces:**
- Consumes: approved design spec and the four supplied browser-saved ThemeForest reference archives.
- Produces: a non-proprietary structural manifest used by Tasks 4–8 and a source guard preventing paid/demo code from entering WordPress production directories.

- [ ] **Step 1: Write the failing source-boundary test**

Create `wordpress/scripts/tests/client-preview-reference-boundary.test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
MANIFEST="$ROOT/docs/superpowers/reports/2026-08-30-client-preview-reference-manifest.md"
PRODUCTION="$ROOT/wordpress/wp-content"

fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$MANIFEST" ]] || fail 'client preview reference manifest missing'
grep -Fq 'Homepage: 23 captured Elementor sections' "$MANIFEST" || fail 'homepage reference count missing'
grep -Fq 'About: 19 captured Elementor sections' "$MANIFEST" || fail 'about reference count missing'
grep -Fq 'Contact: 13 captured Elementor sections' "$MANIFEST" || fail 'contact reference count missing'
grep -Fq 'Shop: asset/style evidence; saved shop HTML is not authoritative' "$MANIFEST" || fail 'shop evidence limitation missing'

if grep -RIlE 'fullkit\.moxcreative\.com|preview\.themeforest\.net|wp-content/plugins/elementor-pro|elements-kit-lite|skyboot-custom-icons' "$PRODUCTION" >/tmp/rosa-preview-proprietary-hits.txt; then
  cat /tmp/rosa-preview-proprietary-hits.txt >&2
  fail 'proprietary/demo source reference found under wordpress/wp-content'
fi

printf 'PASS: client preview reference/source boundary\n'
```

- [ ] **Step 2: Run RED**

Run:

```bash
bash wordpress/scripts/tests/client-preview-reference-boundary.test.sh
```

Expected: FAIL because the manifest does not exist yet.

- [ ] **Step 3: Write the sanitized reference manifest**

The manifest must record only structural observations, not copied Elementor source. Include these exact page sequences derived from the supplied captures:

```text
Homepage: 23 captured Elementor sections
- announcement/contact strip
- navigation/header + mobile/header inner sections
- hero banner
- who-we-are split image/copy
- three-stat strip
- Editor's Choice four-card product row
- three-column service assurance strip
- large feature banner
- Latest Product grid
- paired promo banners
- Why choose us/service block
- logo/partner-style strip (must be replaced/omitted if unsupported)
- testimonial-style section (must become non-fabricated value/social-proof role)
- newsletter CTA block (must become Rosa inquiry/contact CTA role)
- multi-column footer + copyright

About: 19 captured Elementor sections
- shared announcement/header
- title hero
- who-we-are split section
- three-stat strip
- three-card store/store/opening-hours role block
- large feature banner
- Why choose us
- testimonial-style section
- logo strip
- newsletter-role CTA
- footer

Contact: 13 captured Elementor sections
- shared announcement/header
- title hero
- contact-info + form split
- map region
- newsletter-role CTA
- footer

Shop: asset/style evidence; saved shop HTML is not authoritative
- WooCommerce product-card image proportions
- template header/footer assets
- product-grid visual language
- no pixel-fidelity claim for unavailable source markup
```

Also document that `preview.themeforest.net*.zip` must never be committed or copied under `wordpress/wp-content`.

- [ ] **Step 4: Run GREEN**

```bash
bash wordpress/scripts/tests/client-preview-reference-boundary.test.sh
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/reports/2026-08-30-client-preview-reference-manifest.md \
  wordpress/scripts/tests/client-preview-reference-boundary.test.sh
git commit -m "docs(wordpress): lock client preview reference boundary"
```

---

### Task 2: Add deterministic preview locale/content/media helpers

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview-navigation.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/scripts/tests/client-preview-content.test.php`

**Interfaces:**
- Consumes: WordPress page metadata `_rosa_preview_locale`, `_rosa_preview_pair_id`; option `rosa_preview_media`; existing `rosa_theme_business_value()`.
- Produces:
  - `rosa_preview_locale(?int $postId = null): string` returning `en` or `ar`.
  - `rosa_preview_pair_url(?int $postId = null): string`.
  - `rosa_preview_copy(string $key, ?string $locale = null): string`.
  - `rosa_preview_media_id(string $key): int`.
  - `rosa_preview_nav_items(?string $locale = null): array`.
  - `rosa_preview_price_label(): string` returning localized `Price on request`.

- [ ] **Step 1: Write a pure failing content contract**

Create `wordpress/scripts/tests/client-preview-content.test.php` with minimal WordPress stubs and assertions:

```php
<?php
declare(strict_types=1);

$GLOBALS['rosa_preview_meta'] = [];
$GLOBALS['rosa_preview_options'] = [
    'rosa_preview_media' => ['hero' => 42],
];

function get_the_ID(): int { return 100; }
function get_post_meta(int $id, string $key, bool $single = false): mixed {
    return $GLOBALS['rosa_preview_meta'][$id][$key] ?? '';
}
function get_permalink(int $id): string { return 'https://example.test/page-' . $id . '/'; }
function get_option(string $key, mixed $default = false): mixed { return $GLOBALS['rosa_preview_options'][$key] ?? $default; }
function __(string $text, string $domain = 'default'): string { return $text; }
function home_url(string $path = ''): string { return 'https://example.test' . $path; }

require_once __DIR__ . '/../../wp-content/themes/rosa-medical-child/inc/client-preview.php';
require_once __DIR__ . '/../../wp-content/themes/rosa-medical-child/inc/client-preview-navigation.php';

function same(mixed $expected, mixed $actual, string $message): void {
    if ($expected !== $actual) {
        fwrite(STDERR, "FAIL: {$message}\nExpected: " . var_export($expected, true) . "\nActual: " . var_export($actual, true) . "\n");
        exit(1);
    }
}

$GLOBALS['rosa_preview_meta'][100]['_rosa_preview_locale'] = 'ar';
$GLOBALS['rosa_preview_meta'][100]['_rosa_preview_pair_id'] = 200;

same('ar', rosa_preview_locale(100), 'page locale must come from preview metadata');
same('https://example.test/page-200/', rosa_preview_pair_url(100), 'language switch must resolve the paired page');
same(42, rosa_preview_media_id('hero'), 'preview media map must resolve attachment IDs');
same('اطلب عرض سعر', rosa_preview_copy('request_quote', 'ar'), 'Arabic interface copy must be explicit');
same('Price on request', rosa_preview_price_label('en'), 'English price fallback must stay truthful');
same('السعر عند الطلب', rosa_preview_price_label('ar'), 'Arabic price fallback must stay truthful');
same('الرئيسية', rosa_preview_nav_items('ar')[0]['label'], 'Arabic navigation must be paired, not mirrored English');

fwrite(STDOUT, "PASS: client preview content/locale helpers\n");
```

- [ ] **Step 2: Run RED**

```bash
php wordpress/scripts/tests/client-preview-content.test.php
```

Expected: FAIL because the helper files/functions do not exist.

- [ ] **Step 3: Implement `client-preview.php`**

Define constants and safe helpers:

```php
<?php
if (! defined('ABSPATH') && PHP_SAPI !== 'cli') { exit; }

const ROSA_PREVIEW_LOCALE_META = '_rosa_preview_locale';
const ROSA_PREVIEW_PAIR_META = '_rosa_preview_pair_id';
const ROSA_PREVIEW_MEDIA_OPTION = 'rosa_preview_media';

function rosa_preview_locale(?int $postId = null): string
{
    $id = $postId ?? get_the_ID();
    $locale = (string) get_post_meta($id, ROSA_PREVIEW_LOCALE_META, true);
    return $locale === 'ar' ? 'ar' : 'en';
}

function rosa_preview_pair_url(?int $postId = null): string
{
    $id = $postId ?? get_the_ID();
    $pair = (int) get_post_meta($id, ROSA_PREVIEW_PAIR_META, true);
    return $pair > 0 ? get_permalink($pair) : home_url(rosa_preview_locale($id) === 'ar' ? '/' : '/ar/');
}

function rosa_preview_media_id(string $key): int
{
    $media = get_option(ROSA_PREVIEW_MEDIA_OPTION, []);
    return is_array($media) && isset($media[$key]) ? max(0, (int) $media[$key]) : 0;
}

function rosa_preview_copy(string $key, ?string $locale = null): string
{
    $locale = $locale === 'ar' ? 'ar' : ($locale === 'en' ? 'en' : rosa_preview_locale());
    $copy = [
        'en' => [
            'request_quote' => 'Request a quote',
            'hero_eyebrow' => 'Rosa Medical',
            'hero_title' => 'Surgical instruments for professional procurement.',
            'hero_body' => 'Explore Rosa instrument families and contact our team for catalogue and quotation support.',
            'who_eyebrow' => 'Who we are',
            'who_title' => 'A focused medical-instrument supply partner.',
            'why_title' => 'Support built around instrument procurement',
            'contact_title' => 'Get in touch and let us know how we can help.',
            'price_request' => 'Price on request',
        ],
        'ar' => [
            'request_quote' => 'اطلب عرض سعر',
            'hero_eyebrow' => 'روزا ميديكال',
            'hero_title' => 'أدوات جراحية مخصصة لاحتياجات التوريد المهني.',
            'hero_body' => 'استكشف فئات أدوات روزا وتواصل مع فريقنا للحصول على الكتالوج ودعم عروض الأسعار.',
            'who_eyebrow' => 'من نحن',
            'who_title' => 'شريك متخصص في توريد الأدوات الطبية.',
            'why_title' => 'دعم يركز على احتياجات توريد الأدوات',
            'contact_title' => 'تواصل معنا وأخبرنا كيف يمكننا مساعدتك.',
            'price_request' => 'السعر عند الطلب',
        ],
    ];
    return $copy[$locale][$key] ?? '';
}

function rosa_preview_price_label(?string $locale = null): string
{
    return rosa_preview_copy('price_request', $locale);
}
```

Do not put phone/email/address in this copy array; those remain centralized business settings.

- [ ] **Step 4: Implement localized navigation**

`client-preview-navigation.php` returns the same structural navigation roles in each language:

```php
function rosa_preview_nav_items(?string $locale = null): array
{
    $locale = $locale === 'ar' ? 'ar' : ($locale === 'en' ? 'en' : rosa_preview_locale());
    $labels = $locale === 'ar'
        ? ['الرئيسية', 'من نحن', 'المنتجات', 'تفاصيل المنتج', 'اتصل بنا', 'الاستفسار']
        : ['Home', 'About us', 'Shop', 'Product', 'Contact us', 'Inquiry'];

    $paths = $locale === 'ar'
        ? ['/ar/', '/ar/about/', '/ar/shop/', '/product/rosa-foundation-stevens-scissors-regular/', '/ar/contact/', '/ar/contact/#inquiry']
        : ['/', '/about/', '/shop/', '/product/rosa-foundation-stevens-scissors-regular/', '/contact/', '/contact/#inquiry'];

    return array_map(
        static fn(string $label, string $path): array => ['label' => $label, 'url' => home_url($path)],
        $labels,
        $paths
    );
}
```

The Product nav item may point to the canonical Stevens foundation fixture. This does not claim Single Product visual fidelity; it merely avoids a dead navigation slot while preserving header density.

- [ ] **Step 5: Require helpers from `functions.php` and run GREEN**

Add `require_once` statements before enqueue logic, then run:

```bash
php wordpress/scripts/tests/client-preview-content.test.php
php -l wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php
php -l wordpress/wp-content/themes/rosa-medical-child/inc/client-preview-navigation.php
php -l wordpress/wp-content/themes/rosa-medical-child/functions.php
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/inc \
  wordpress/wp-content/themes/rosa-medical-child/functions.php \
  wordpress/scripts/tests/client-preview-content.test.php
git commit -m "feat(wordpress): add client preview locale and content helpers"
```

---

### Task 3: Add deterministic Rosa media/page seeding with English/Arabic pairs

**Files:**
- Create: `wordpress/scripts/client-preview-seed.sh`
- Create: `wordpress/scripts/tests/client-preview-seed-contract.test.sh`

**Interfaces:**
- Consumes: existing local Docker/WP-CLI foundation; source files:
  - `apps/web/public/media/brand/rosa-header-logo-v1.webp`
  - `apps/web/public/media/editorial/home-hero-surgical-instruments.jpg`
  - `apps/web/public/media/editorial/about-procurement.jpg`
  - `apps/web/public/media/editorial/about-hospitals.jpg`
  - `apps/web/public/media/editorial/about-international-buyers.webp`
  - `apps/web/public/media/editorial/procurement-support.jpg`
- Produces: Media Library attachments recorded in option `rosa_preview_media`; English/Arabic paired pages with locale/pair metadata and assigned preview templates.

- [ ] **Step 1: Write the failing seed-script contract**

Create `wordpress/scripts/tests/client-preview-seed-contract.test.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SEED="$ROOT/wordpress/scripts/client-preview-seed.sh"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$SEED" ]] || fail 'client preview seed script missing'
grep -Fq 'rosa-header-logo-v1.webp' "$SEED" || fail 'Rosa logo import missing'
grep -Fq 'home-hero-surgical-instruments.jpg' "$SEED" || fail 'Rosa hero import missing'
grep -Fq '_rosa_preview_locale' "$SEED" || fail 'locale metadata missing'
grep -Fq '_rosa_preview_pair_id' "$SEED" || fail 'page-pair metadata missing'
grep -Fq 'rosa_preview_media' "$SEED" || fail 'preview media option missing'
grep -Fq 'client-preview-home.php' "$SEED" || fail 'home template assignment missing'
grep -Fq 'client-preview-about.php' "$SEED" || fail 'about template assignment missing'
grep -Fq 'client-preview-contact.php' "$SEED" || fail 'contact template assignment missing'
grep -Fq 'client-preview-shop.php' "$SEED" || fail 'Arabic shop template assignment missing'
grep -Fq 'rosa_business_settings' "$SEED" || fail 'business settings guard missing'

printf 'PASS: client preview seed source contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-seed-contract.test.sh
```

Expected: FAIL because the seed script does not exist.

- [ ] **Step 3: Implement fail-fast WP-CLI wrapper and business-data guard**

Use the same compose/WP-CLI pattern as `foundation-seed.sh`. Before creating preview pages, read `rosa_business_settings` and require non-empty `phone`, `email`, and `address`. Support explicit local overrides without hard-coding client data:

```bash
current_json="$(wp option get rosa_business_settings --format=json 2>/dev/null || printf '{}')"

if [[ -n "${ROSA_PREVIEW_PHONE:-}" || -n "${ROSA_PREVIEW_EMAIL:-}" || -n "${ROSA_PREVIEW_ADDRESS:-}" ]]; then
  ROSA_PREVIEW_PHONE="${ROSA_PREVIEW_PHONE:-}" \
  ROSA_PREVIEW_EMAIL="${ROSA_PREVIEW_EMAIL:-}" \
  ROSA_PREVIEW_ADDRESS="${ROSA_PREVIEW_ADDRESS:-}" \
  wp eval '
    $settings = get_option("rosa_business_settings", []);
    if (!is_array($settings)) $settings = [];
    foreach (["phone" => getenv("ROSA_PREVIEW_PHONE"), "email" => getenv("ROSA_PREVIEW_EMAIL"), "address" => getenv("ROSA_PREVIEW_ADDRESS")] as $key => $value) {
      if (is_string($value) && $value !== "") $settings[$key] = $value;
    }
    update_option("rosa_business_settings", $settings);
  '
fi

wp eval '
  $settings = get_option("rosa_business_settings", []);
  foreach (["phone", "email", "address"] as $key) {
    if (!is_array($settings) || trim((string)($settings[$key] ?? "")) === "") {
      WP_CLI::error("Missing verified Rosa business setting: {$key}");
    }
  }
'
```

The script must fail rather than inserting demo data.

- [ ] **Step 4: Import only approved Rosa-owned media deterministically**

Add a Bash helper that resolves an existing Media Library item by `_rosa_preview_source_path` meta before importing a duplicate. Import the six exact source files listed in Interfaces. After each import, set `_rosa_preview_source_path` on the attachment and finally write this option shape:

```php
[
  'logo' => <attachment id>,
  'hero' => <attachment id>,
  'about_procurement' => <attachment id>,
  'about_hospitals' => <attachment id>,
  'about_international' => <attachment id>,
  'procurement_support' => <attachment id>,
]
```

Do not import any file from the ThemeForest ZIPs.

- [ ] **Step 5: Create/update paired pages idempotently**

Create/update these pages:

```text
English Home      slug: home       template: page-templates/client-preview-home.php    locale: en
English About     slug: about      template: page-templates/client-preview-about.php   locale: en
English Contact   slug: contact    template: page-templates/client-preview-contact.php locale: en
Arabic Home       slug: ar         template: page-templates/client-preview-home.php    locale: ar
Arabic About      slug: about, parent: ar  template: client-preview-about.php           locale: ar
Arabic Contact    slug: contact, parent: ar template: client-preview-contact.php        locale: ar
Arabic Shop       slug: shop, parent: ar   template: client-preview-shop.php            locale: ar
```

Set `_rosa_preview_pair_id` bidirectionally:

```text
English Home <-> Arabic Home
English About <-> Arabic About
English Contact <-> Arabic Contact
Woo Shop page/archive <-> Arabic Shop
```

Set English Home as `page_on_front` / `show_on_front=page`. Preserve the Woo Shop page assignment; do not replace it with a static page.

- [ ] **Step 6: Run GREEN and syntax**

```bash
bash wordpress/scripts/tests/client-preview-seed-contract.test.sh
bash -n wordpress/scripts/client-preview-seed.sh
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/scripts/client-preview-seed.sh \
  wordpress/scripts/tests/client-preview-seed-contract.test.sh
git commit -m "feat(wordpress): seed Rosa client preview pages and media"
```

---

### Task 4: Recreate the MedicaShop-like global shell and footer

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js`
- Create: `wordpress/scripts/tests/client-preview-shell-contract.test.sh`

**Interfaces:**
- Consumes: `rosa_preview_nav_items()`, `rosa_preview_pair_url()`, `rosa_preview_locale()`, `rosa_preview_media_id()`, `rosa_theme_business_value()`.
- Produces: announcement/contact strip, Rosa logo/navigation, inquiry action replacing cart semantics, language switch, mobile drawer, multi-column footer, one theme-owned `<main>`.

- [ ] **Step 1: Write the failing shell contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
THEME="$ROOT/wordpress/wp-content/themes/rosa-medical-child"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

grep -Fq 'data-rosa-preview-shell' "$THEME/header.php" || fail 'preview shell marker missing'
grep -Fq 'rosa-preview-announcement' "$THEME/header.php" || fail 'announcement/contact strip missing'
grep -Fq 'rosa_preview_media_id' "$THEME/header.php" || fail 'Rosa Media Library logo missing'
grep -Fq 'rosa_preview_nav_items' "$THEME/header.php" || fail 'localized preview nav missing'
grep -Fq 'rosa_preview_pair_url' "$THEME/header.php" || fail 'language switch target missing'
grep -Fq 'Inquiry' "$THEME/header.php" || fail 'retail cart role not replaced by inquiry role'
grep -Fq 'data-rosa-preview-menu-trigger' "$THEME/header.php" || fail 'mobile menu trigger missing'
grep -Fq 'rosa-preview-footer' "$THEME/footer.php" || fail 'preview footer missing'
grep -Fq 'rosa_theme_business_value' "$THEME/footer.php" || fail 'centralized business values missing'
grep -Fq 'client-preview.css' "$THEME/functions.php" || fail 'preview stylesheet not enqueued'
grep -Fq 'client-preview.js' "$THEME/functions.php" || fail 'preview JS not enqueued'
! grep -Eqi 'cart|checkout|payment|shipping|returns' "$THEME/header.php" || fail 'retail semantics leaked into header'

printf 'PASS: client preview shell contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
```

Expected: FAIL on missing preview shell markers/assets.

- [ ] **Step 3: Implement the header silhouette**

Preserve the reference structure:

```text
thin announcement/contact bar
main white header
Rosa logo
six-item desktop nav
right-side language switch + Inquiry action
compact mobile trigger/drawer
```

Announcement strip content must be truthful:

```php
<div class="rosa-preview-announcement">
  <div class="rosa-preview-rail rosa-preview-announcement__inner">
    <span><?php echo esc_html(rosa_preview_locale() === 'ar' ? 'دعم الكتالوج وطلبات عروض الأسعار' : 'Catalogue and quotation support'); ?></span>
    <div>
      <?php if (($email = rosa_theme_business_value('email')) !== '') : ?>
        <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
      <?php endif; ?>
      <?php if (($phone = rosa_theme_business_value('phone')) !== '') : ?>
        <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a>
      <?php endif; ?>
    </div>
  </div>
</div>
```

Do not reproduce the demo discount text.

Use `wp_get_attachment_image(rosa_preview_media_id('logo'), 'full', ...)` for the Rosa logo with a text fallback `ROSA` when attachment is unavailable.

- [ ] **Step 4: Implement accessible mobile drawer behavior**

`client-preview.js` must:

- toggle `aria-expanded`;
- show/hide drawer + overlay;
- close on Escape and overlay click;
- move focus into the drawer;
- trap Tab/Shift+Tab while open;
- restore focus to trigger on normal close;
- make `.rosa-site-main` and footer inert while drawer is open;
- lock page scrolling while open.

No animation/business logic beyond navigation behavior.

- [ ] **Step 5: Implement the multi-column footer**

Preserve the MedicaShop footer silhouette but use truthful columns:

```text
ROSA identity + concise procurement copy
Company: About us / Contact us / Inquiry
Products: Knives / Scissors / Punches / Chisels / Cutters
Support: Catalogue support / Request a quote / Contact
verified address + phone/email
copyright
```

Do not reproduce payment-logo slots, newsletter promises or unsupported company pages.

- [ ] **Step 6: Implement shared preview CSS**

Start `client-preview.css` with a self-contained preview token layer rather than importing paid CSS:

```css
:root {
  --preview-accent: #e00815;
  --preview-accent-dark: #b9000b;
  --preview-ink: #202124;
  --preview-muted: #6d7278;
  --preview-paper: #ffffff;
  --preview-soft: #f5f7f7;
  --preview-border: #e3e6e8;
  --preview-rail: 74rem;
  --preview-wide: 82rem;
  --preview-radius: 0.35rem;
  --preview-shadow: 0 1rem 2.5rem rgb(32 33 36 / 0.08);
}

.rosa-preview-rail {
  width: min(calc(100% - 2 * clamp(1rem, 4vw, 3rem)), var(--preview-rail));
  margin-inline: auto;
}

.rosa-preview-wide { max-width: var(--preview-wide); }
```

Use Open Sans/Inter-compatible fallbacks to stay visually near the reference while keeping Arabic text on Tajawal/system Arabic fallbacks.

- [ ] **Step 7: Enqueue preview assets only for preview pages/shop contexts**

In `functions.php`, detect preview page templates, Woo shop/product archives, or pages carrying `_rosa_preview_locale`, then enqueue `client-preview.css`, `client-preview-rtl.css` when locale is Arabic, and `client-preview.js` in footer scope. Do not globally replace foundation styles for unrelated admin/editor routes.

- [ ] **Step 8: Run GREEN and syntax**

```bash
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/header.php
php -l wordpress/wp-content/themes/rosa-medical-child/footer.php
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js
```

Expected: PASS; existing theme-owned single-main contract remains valid.

- [ ] **Step 9: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/client-preview-shell-contract.test.sh
git commit -m "feat(wordpress): recreate MedicaShop-like Rosa preview shell"
```

---

### Task 5: Recreate the Homepage composition with Rosa-owned media and truthful roles

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-grid.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/value-strip.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/cta-banner.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Create: `wordpress/scripts/tests/client-preview-home-contract.test.sh`

**Interfaces:**
- Consumes: locale/copy/media helpers; WooCommerce product/category queries; shared preview shell.
- Produces: the reference homepage roles in the same order without proprietary images, fake retail claims or fabricated testimonial content.

- [ ] **Step 1: Write the failing Homepage contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
HOME=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }

[[ -f "$HOME" ]] || fail 'preview home template missing'
for marker in \
  'data-preview-hero' \
  'data-preview-who-we-are' \
  'data-preview-stats' \
  'data-preview-featured-products' \
  'data-preview-value-strip' \
  'data-preview-feature-banner' \
  'data-preview-latest-products' \
  'data-preview-promos' \
  'data-preview-why-us' \
  'data-preview-proof-role' \
  'data-preview-contact-cta'; do
  grep -Fq "$marker" "$HOME" || fail "missing homepage role: $marker"
done

grep -Fq 'home-hero-surgical-instruments' wordpress/scripts/client-preview-seed.sh || fail 'hero source not seeded'
! grep -Eqi 'add to cart|30 days warranty|secure payment|international shipment|testimonial by|newsletter' "$HOME" || fail 'demo retail/fabricated copy leaked into homepage'
grep -Fq '.rosa-preview-products' "$CSS" || fail 'homepage product-grid CSS missing'

printf 'PASS: client preview homepage contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-home-contract.test.sh
```

Expected: FAIL because the Homepage template does not exist.

- [ ] **Step 3: Implement the hero and who-we-are split**

Use Media Library attachment `hero` as the full-bleed/right-weighted hero image and `about_procurement` for the split image section. Preserve the MedicaShop hero's large text block + CTA proportion. CTA links to Shop; secondary copy is locale-aware.

The who-we-are section uses the same image/copy alternating geometry as the reference and must not claim manufacturing/certification facts not supported by repository evidence.

- [ ] **Step 4: Implement a truthful three-stat strip**

Use facts already established by project scope:

```text
5 Product families
5 Catalogue PDFs
2 Preview languages
```

Arabic labels:

```text
5 فئات منتجات
5 كتالوجات
2 لغات للمعاينة
```

Do not reuse fake Happy Customer/Product Sold/Years Experience counters.

- [ ] **Step 5: Implement product sections without inventing catalogue rows**

`product-grid.php` accepts:

```php
$args = [
  'title' => string,
  'limit' => int,
  'context' => 'featured'|'latest',
];
```

Query published Woo products. Render real products only. If fewer than four published products exist, fill the remaining visual slots with **family cards**, not fake products, using the five verified families: Knives, Scissors, Punches, Chisels, Cutters. Family cards link to the Shop/archive filtered/category path where available and display `Catalogue family` instead of a SKU/price.

For real product cards, render:

```text
contained Woo product image or neutral ROSA placeholder
family/category
product name
Price on request
View details
```

Do not render Woo sale, rating or add-to-cart markup.

- [ ] **Step 6: Recreate service strip and banner roles truthfully**

The three reference assurance cards become:

```text
Catalogue Support — Find the correct family and product references.
Quotation Support — Contact Rosa for pricing and procurement details.
Instrument Families — Browse Knives, Scissors, Punches, Chisels and Cutters.
```

The large feature banner uses `procurement_support` Media Library asset and the same wide image/text role as the reference.

- [ ] **Step 7: Recreate paired promo/value/proof/CTA roles**

Preserve the paired promotional-card geometry but use:

```text
Browse surgical scissors -> /product-category/scissors/ or /shop/
Explore instrument catalogues -> /shop/
```

The logo/partner strip must **not** show invented customers/partners. Replace the same horizontal rhythm with five family-name tiles.

The testimonial-style section becomes a non-attributed procurement-value section using statements such as `Clear catalogue references`, `Exact configuration visibility`, and `Direct quotation support`; no quotation marks, names, avatars or customer claims.

The newsletter block becomes a `Need catalogue or quotation support?` contact CTA with the same split image/form-like visual weight. It must not collect newsletter subscriptions.

- [ ] **Step 8: Implement responsive Homepage CSS**

Required transformations:

- desktop hero: two-weight composition comparable to reference;
- 1024: preserve hero depth without text/image collision;
- <=768: stack split sections with intentional image crop;
- <=430: one-column promo/why/proof sections; product cards remain two columns only if actual title/reference text is readable, otherwise one column;
- bounded wide rails at 1920/2560.

- [ ] **Step 9: Run GREEN and syntax**

```bash
bash wordpress/scripts/tests/client-preview-home-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php
find wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview -name '*.php' -print0 | xargs -0 -n1 php -l
```

Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css \
  wordpress/scripts/tests/client-preview-home-contract.test.sh
git commit -m "feat(wordpress): recreate Rosa client preview homepage"
```

---

### Task 6: Recreate the About page without fabricated hours/testimonials

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Create: `wordpress/scripts/tests/client-preview-about-contract.test.sh`

**Interfaces:**
- Consumes: preview shell, locale/copy/media helpers; imported `about_procurement`, `about_hospitals`, `about_international` media.
- Produces: About title hero, who-we-are split, truthful three-stat strip, three-card informational role, feature banner, Why Us, non-fabricated proof role, family strip and contact CTA.

- [ ] **Step 1: Write RED contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
ABOUT=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$ABOUT" ]] || fail 'preview about template missing'
for marker in 'data-preview-page-hero' 'data-preview-who-we-are' 'data-preview-stats' 'data-preview-about-cards' 'data-preview-feature-banner' 'data-preview-why-us' 'data-preview-proof-role' 'data-preview-family-strip' 'data-preview-contact-cta'; do
  grep -Fq "$marker" "$ABOUT" || fail "missing about role: $marker"
done
! grep -Eqi 'opening hours|happy customer|product sold|years experience|testimonial|drug store|pharmacy store' "$ABOUT" || fail 'unsupported demo claims leaked into About'
printf 'PASS: client preview About contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
```

Expected: FAIL because template is missing.

- [ ] **Step 3: Implement About roles in reference order**

Use the same hero/split/stat geometry as Homepage. Replace the original Pharmacy Store / Drug Store / Opening hours triptych with:

```text
Product Families
Five focused catalogue families for instrument discovery.
CTA: Browse products

Catalogue Support
Use family catalogues and product references to identify requirements.
CTA: View shop

Quotation Support
Contact Rosa with the required instrument/reference for procurement assistance.
CTA: Contact us
```

Keep the three-card silhouette; do not invent operating hours.

- [ ] **Step 4: Implement feature/Why Us/proof/family/CTA roles**

Use `about_hospitals` / `about_international` / `about_procurement` only as Rosa-owned contextual imagery. The proof role remains non-attributed, with no fake logos/testimonials. Family strip uses the five product families.

- [ ] **Step 5: Run GREEN and syntax**

```bash
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php
```

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css \
  wordpress/scripts/tests/client-preview-about-contract.test.sh
git commit -m "feat(wordpress): recreate Rosa client preview About page"
```

---

### Task 7: Recreate Contact page with centralized contact data and preview-safe form

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Create: `wordpress/scripts/tests/client-preview-contact-contract.test.sh`

**Interfaces:**
- Consumes: `rosa_theme_business_value('address'|'phone'|'email')`, locale/copy helpers.
- Produces: reference-like title hero, contact information + form split, safe location block, contact CTA/footer.

- [ ] **Step 1: Write RED contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
CONTACT=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$CONTACT" ]] || fail 'preview contact template missing'
for marker in 'data-preview-page-hero' 'data-preview-contact-layout' 'data-preview-contact-location' 'data-preview-contact-phone' 'data-preview-contact-email' 'data-preview-contact-form' 'data-preview-map-role'; do
  grep -Fq "$marker" "$CONTACT" || fail "missing contact role: $marker"
done
grep -Fq "rosa_theme_business_value('address')" "$CONTACT" || fail 'address not centralized'
grep -Fq "rosa_theme_business_value('phone')" "$CONTACT" || fail 'phone not centralized'
grep -Fq "rosa_theme_business_value('email')" "$CONTACT" || fail 'email not centralized'
! grep -Eqi 'Jln Cempaka|yourdomain|6221\.2002' "$CONTACT" || fail 'demo contact value leaked'
printf 'PASS: client preview Contact contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
```

- [ ] **Step 3: Implement contact-information/form split**

Render Location / Call us / Email us in the same left-column rhythm as reference, but only when each business setting is non-empty. The seed/runtime verifier already requires all three for the client preview.

Render the form fields Name, Phone, Subject, Message to preserve composition, but keep submission explicitly preview-safe:

```php
<form class="rosa-preview-contact-form" data-preview-contact-form>
  ...fields...
  <a class="rosa-preview-button" href="mailto:<?php echo esc_attr($email); ?>">
    <?php echo esc_html($locale === 'ar' ? 'إرسال عبر البريد الإلكتروني' : 'Send by email'); ?>
  </a>
</form>
```

Do not add a fake successful submission path or write inquiry persistence in this phase.

- [ ] **Step 4: Implement map role without invented coordinates**

Preserve the full-width map-region height, but if no verified map embed/coordinates exist render a styled location panel containing the verified address and a generic external map-search link derived from `rawurlencode($address)`. Do not hard-code latitude/longitude.

- [ ] **Step 5: Run GREEN**

```bash
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php
```

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css \
  wordpress/scripts/tests/client-preview-contact-contract.test.sh
git commit -m "feat(wordpress): recreate Rosa client preview Contact page"
```

---

### Task 8: Recreate the Shop/archive visual language with real Woo data

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-grid.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Create: `wordpress/scripts/tests/client-preview-shop-contract.test.sh`

**Interfaces:**
- Consumes: WooCommerce main product query for English archive; `WP_Query` of published products for Arabic preview page; shared product-card renderer; localized price/action labels.
- Produces: recognizable template-like Shop title/banner + bounded product grid with real product data and no consumer-commerce behavior.

- [ ] **Step 1: Write RED Shop contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
ARCHIVE=wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
ARSHOP=wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php
CARD=wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php
CSS=wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$ARCHIVE" ]] || fail 'English Shop archive override missing'
[[ -f "$ARSHOP" ]] || fail 'Arabic Shop paired page missing'
grep -Fq 'data-preview-shop-hero' "$ARCHIVE" || fail 'Shop hero missing'
grep -Fq 'data-preview-shop-grid' "$ARCHIVE" || fail 'Shop grid missing'
grep -Fq 'data-preview-shop-grid' "$ARSHOP" || fail 'Arabic Shop grid missing'
grep -Fq 'rosa_preview_price_label' "$CARD" || fail 'truthful price-on-request label missing'
grep -Fq 'View details' "$CARD" || fail 'detail action missing'
! grep -Eqi 'add to cart|rating|wishlist|shipping|checkout|sale!' "$CARD" || fail 'consumer-retail Shop leakage'
grep -Fq 'object-fit: contain' "$CSS" || fail 'contained product imagery missing'
printf 'PASS: client preview Shop contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
```

- [ ] **Step 3: Implement English Woo archive**

Use Woo main query and preserve core pagination. Required composition:

```text
shared header
Shop title/banner hero
optional simple search field
bounded product grid
pagination
contact/quotation CTA
shared footer
```

Do not create fake filters if no filter subsystem is present.

- [ ] **Step 4: Implement Arabic paired Shop page**

`client-preview-shop.php` runs a read-only query for published Woo products and renders the same product-grid partial under Arabic locale. This page exists only to provide a bilingual client preview without changing WooCommerce rewrite/language architecture.

- [ ] **Step 5: Implement product cards**

For each real product:

```php
$product = wc_get_product($productId);
$name = $product instanceof WC_Product ? $product->get_name() : '';
$imageId = $product instanceof WC_Product ? $product->get_image_id() : 0;
```

Render contained image, product/family name, `rosa_preview_price_label()`, and localized `View details`/`عرض التفاصيل`. Use product permalink for detail action. No standard Woo price fields are rendered as authoritative price in this preview.

- [ ] **Step 6: Implement grid fidelity CSS**

Use the reference's compact Woo card proportions rather than Phase 2A dense-workspace styling:

```css
.rosa-preview-shop-grid,
.rosa-preview-products {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.rosa-preview-product__media {
  aspect-ratio: 1;
  background: var(--preview-paper);
}

.rosa-preview-product__media img {
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
}
```

At <=1024 use 3 columns; <=768 use 2; <=390 fall back to 1 if the real title/SKU content fails two-column readability. Keep the total rail bounded on 1920/2560.

- [ ] **Step 7: Run GREEN**

```bash
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php
php -l wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php
```

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/woocommerce \
  wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css \
  wordpress/scripts/tests/client-preview-shop-contract.test.sh
git commit -m "feat(wordpress): recreate Rosa client preview Shop"
```

---

### Task 9: Complete Arabic/RTL behavior and bilingual route pairing

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-about.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-contact.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php`
- Create: `wordpress/scripts/tests/client-preview-rtl-contract.test.sh`

**Interfaces:**
- Consumes: Task 2 locale helpers and Task 3 page metadata.
- Produces: Arabic pages with Arabic copy, `lang="ar"`/`dir="rtl"`, correct language-switch pairing and RTL-safe geometry.

- [ ] **Step 1: Write failing RTL contract**

```bash
#!/usr/bin/env bash
set -euo pipefail
THEME=wordpress/wp-content/themes/rosa-medical-child
RTL="$THEME/assets/css/client-preview-rtl.css"
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
[[ -f "$RTL" ]] || fail 'Arabic preview stylesheet missing'
grep -Fq 'dir="rtl"' "$THEME/header.php" || fail 'RTL html-direction hook missing'
grep -Fq 'lang="ar"' "$THEME/header.php" || fail 'Arabic lang output missing'
grep -Fq 'margin-inline' "$THEME/assets/css/client-preview.css" || fail 'logical margin usage missing'
grep -Fq 'padding-inline' "$THEME/assets/css/client-preview.css" || fail 'logical padding usage missing'
grep -Fq 'inset-inline' "$THEME/assets/css/client-preview.css" || fail 'logical inset usage missing'
grep -Fq 'font-family' "$RTL" || fail 'Arabic typography missing'
grep -Fq 'rosa_preview_pair_url' "$THEME/header.php" || fail 'paired language switch missing'
printf 'PASS: client preview RTL source contract\n'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-rtl-contract.test.sh
```

Expected: FAIL because Arabic-specific stylesheet/direction output is incomplete.

- [ ] **Step 3: Make root language/direction explicit**

In `header.php`, for preview pages determine `$previewLocale = rosa_preview_locale();` before `<html>`. Output standard WordPress `language_attributes()` for normal pages, but preview pages must render explicit compatible attributes:

```php
<html lang="<?php echo esc_attr($previewLocale === 'ar' ? 'ar' : 'en-US'); ?>" dir="<?php echo esc_attr($previewLocale === 'ar' ? 'rtl' : 'ltr'); ?>">
```

Do not force Arabic attributes on wp-admin/editor/non-preview pages.

- [ ] **Step 4: Complete Arabic page copy**

Every visible heading/action in Home/About/Contact/Shop must branch through locale-aware helpers or explicit paired strings. Do not leave mixed English interface labels except proper product/SKU names that have no verified Arabic translation.

- [ ] **Step 5: Implement RTL CSS only for actual directional differences**

Shared layout should already use logical properties. `client-preview-rtl.css` handles:

- Arabic font stack `Tajawal, "Noto Sans Arabic", sans-serif`;
- text alignment where reference composition requires start/end rather than physical left/right;
- directional icon mirroring only when the icon conveys direction;
- mobile drawer origin on inline-end;
- product/CTA icon order where needed.

Do not duplicate whole sections or use physical left/right offsets unless unavoidable.

- [ ] **Step 6: Run GREEN**

```bash
bash wordpress/scripts/tests/client-preview-rtl-contract.test.sh
php -l wordpress/wp-content/themes/rosa-medical-child/header.php
```

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child \
  wordpress/scripts/tests/client-preview-rtl-contract.test.sh
git commit -m "feat(wordpress): add Arabic RTL client preview"
```

---

### Task 10: Harden responsive/accessibility behavior and write visual acceptance runbook

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js`
- Create: `docs/runbooks/wordpress-client-preview-visual-acceptance.md`
- Modify: `wordpress/scripts/tests/client-preview-shell-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-home-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-shop-contract.test.sh`

**Interfaces:**
- Consumes: Tasks 4–9.
- Produces: exact responsive transformations, focus/target/reduced-motion behavior and manual comparison protocol.

- [ ] **Step 1: Extend contracts with missing safeguards before CSS changes**

Add assertions requiring:

```bash
grep -Fq '@media (prefers-reduced-motion: reduce)' wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
grep -Fq '@media (max-height: 800px)' wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
grep -Fq 'min-block-size: 44px' wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
grep -Fq ':focus-visible' wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
grep -Fq 'overflow-x: clip' wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
grep -Fq 'inert' wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js
```

- [ ] **Step 2: Run source tests and verify only the new assertions RED**

```bash
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
bash wordpress/scripts/tests/client-preview-home-contract.test.sh
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
```

Expected: existing behaviors remain green; new responsive/accessibility assertions fail until implemented.

- [ ] **Step 3: Implement exact breakpoint behavior**

```text
390×844: compact header, drawer, single/two-card content-fit grid, stacked hero/splits, no clipped Arabic.
430×932: same mobile mode with slightly wider two-card capability.
768×1024: drawer/tablet header, 2-column product grid, split promo/value cards may remain 2 columns where readable.
1024×768: compact desktop/tablet crossover; avoid oversized vertical gaps; 3-column Shop.
1366×768: full nav, 4-column Shop/home product row, feature banners remain short enough for viewport.
1440×900: full MedicaShop-like desktop rhythm.
1920×1080 and 2560×1440: content rails remain bounded; typography and columns do not scale endlessly.
```

- [ ] **Step 4: Enforce accessible controls**

All nav/menu/language/product/card/CTA/form controls must have practical >=44px hit areas where appropriate. Add `:focus-visible` outlines with sufficient contrast. Selected/active nav state cannot rely only on color. Reduced-motion mode removes non-essential transforms/transitions.

- [ ] **Step 5: Write `wordpress-client-preview-visual-acceptance.md`**

The runbook must require comparison of **English Home/About/Contact/Shop plus Arabic Home and one Arabic interior page** against the supplied reference roles at all eight viewports. For each screenshot record:

```text
reference silhouette/composition: PASS/FAIL + observation
Rosa content substitution: PASS/FAIL + observation
banner crop: PASS/FAIL + observation
header/footer fidelity: PASS/FAIL + observation
horizontal overflow: PASS/FAIL
RTL geometry where applicable: PASS/FAIL
unsupported retail/proprietary content: PASS/FAIL
```

Also require:

- keyboard drawer traversal, Escape, focus restore, inert background;
- 200% zoom/reflow;
- text-spacing override;
- `prefers-reduced-motion`;
- browser console check;
- no ThemeForest/MedicaShop assets visible in network/source paths;
- explicit acknowledgement that Shop source HTML and Single Product fidelity are limited by available references.

- [ ] **Step 6: Run GREEN**

```bash
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
bash wordpress/scripts/tests/client-preview-home-contract.test.sh
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
bash wordpress/scripts/tests/client-preview-rtl-contract.test.sh
node --check wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js
```

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets \
  wordpress/scripts/tests/client-preview-*.test.sh \
  docs/runbooks/wordpress-client-preview-visual-acceptance.md
git commit -m "refactor(wordpress): harden client preview responsive and RTL behavior"
```

---

### Task 11: Add full local runtime verification, screenshots and client-video capture

**Files:**
- Create: `wordpress/scripts/client-preview-runtime-verify.sh`
- Create: `wordpress/scripts/client-preview-responsive-capture.sh`
- Create: `wordpress/scripts/client-preview-video-capture.sh`
- Modify only if needed: `.gitignore`
- Create: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`

**Interfaces:**
- Consumes: disposable WordPress foundation, Task 3 seed, Tasks 4–10 preview implementation, existing workspace Playwright CLI.
- Produces: repeatable local PASS/FAIL evidence, ignored screenshots, and an ignored client-review video artifact.

- [ ] **Step 1: Write failing tooling contract**

Create `client-preview-runtime-tooling.test.sh` asserting the three scripts exist and contain:

```bash
grep -Fq 'client-preview-seed.sh' wordpress/scripts/client-preview-runtime-verify.sh
grep -Fq '390,844' wordpress/scripts/client-preview-responsive-capture.sh
grep -Fq '2560,1440' wordpress/scripts/client-preview-responsive-capture.sh
grep -Fq '/ar/' wordpress/scripts/client-preview-responsive-capture.sh
grep -Fq 'recordVideo' wordpress/scripts/client-preview-video-capture.sh
grep -Fq 'client-preview-artifacts' wordpress/scripts/client-preview-responsive-capture.sh
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
```

Expected: FAIL because tooling does not exist.

- [ ] **Step 3: Implement fail-fast `client-preview-runtime-verify.sh`**

Run, in order:

```bash
bash wordpress/scripts/tests/foundation-preflight.test.sh
bash wordpress/scripts/tests/foundation-contract.test.sh
bash wordpress/scripts/tests/foundation-theme-contract.test.sh
bash wordpress/scripts/tests/foundation-verify-contract.test.sh
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
bash wordpress/scripts/tests/client-preview-reference-boundary.test.sh
php wordpress/scripts/tests/client-preview-content.test.php
bash wordpress/scripts/tests/client-preview-seed-contract.test.sh
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
bash wordpress/scripts/tests/client-preview-home-contract.test.sh
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
bash wordpress/scripts/tests/client-preview-rtl-contract.test.sh
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
```

Then:

```text
php -l every PHP file under wordpress/wp-content
bash -n every shell script under wordpress/scripts
node --check client-preview.js
client-preview-seed.sh
foundation-seed.sh
foundation-product-verify.sh
```

Resolve routes through WP-CLI rather than hard-coding post IDs. HTTP-check:

```text
/
/about/
/contact/
Woo Shop permalink
/ar/
/ar/about/
/ar/contact/
/ar/shop/
canonical Stevens Product Detail route
```

Assertions:

- HTTP 200;
- exactly one `<main` per page;
- `data-rosa-preview-shell` present on preview pages;
- English pages use LTR and Arabic pages use `lang="ar" dir="rtl"`;
- verified business phone/email/address appear on Contact/footer;
- visible output contains no `Medicashop`, `MoxCreative`, demo phone/email/address, `Add to cart`, Checkout, ratings, wishlist, shipping, returns, secure payment or newsletter subscription language;
- no ThemeForest/demo URL is referenced by preview HTML;
- Stevens Product Detail foundation still resolves and preserves the canonical fixture.

Any failure requires `superpowers:systematic-debugging` before changes.

- [ ] **Step 4: Implement responsive screenshot capture**

Create ignored directory:

`wordpress/.client-preview-artifacts/`

Capture at all eight viewports:

```text
English: Home, About, Contact, Shop
Arabic: Home, About, Contact, Shop
```

This is 64 required captures (8 pages × 8 viewports). Use filenames such as:

```text
en-home-1440x900.png
en-shop-390x844.png
ar-home-1440x900.png
ar-contact-430x932.png
```

The script discovers the actual Woo Shop URL through WP-CLI and uses the fixed paired preview page permalinks from page metadata.

- [ ] **Step 5: Implement repeatable client-video capture**

Use a small Node/Playwright script generated/invoked by `client-preview-video-capture.sh`. Enable:

```js
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: 'wordpress/.client-preview-artifacts/video',
    size: { width: 1440, height: 900 },
  },
});
```

Walk through:

```text
English Home -> scroll hero/who/products/feature/CTA
About -> key sections
Contact -> business details + form/map role
Shop -> product grid
language switch to Arabic
Arabic Home -> scroll key sections
Arabic About or Contact
set viewport 390×844 -> show mobile Home + drawer briefly
```

Use deterministic waits (`page.waitForLoadState('networkidle')` or explicit locators) rather than arbitrary long sleeps. Save the final `.webm` inside ignored artifact directory; do not commit it.

- [ ] **Step 6: Add exact ignore rule if absent**

Add:

```gitignore
wordpress/.client-preview-artifacts/
```

only if `git check-ignore -q wordpress/.client-preview-artifacts/` fails.

- [ ] **Step 7: Run GREEN/tool syntax**

```bash
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
bash -n wordpress/scripts/client-preview-runtime-verify.sh
bash -n wordpress/scripts/client-preview-responsive-capture.sh
bash -n wordpress/scripts/client-preview-video-capture.sh
```

- [ ] **Step 8: Run real runtime verification and captures**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
bash wordpress/scripts/client-preview-responsive-capture.sh
bash wordpress/scripts/client-preview-video-capture.sh
```

Expected: runtime PASS, 64 required screenshots created, video artifact created.

- [ ] **Step 9: Inspect all images and the video using the runbook**

Do not accept based only on script exit status. Record concrete viewport/page notes. Compare silhouette/section order/crops against supplied reference material. Fix only spec violations, implementation bugs or responsive/accessibility regressions; do not introduce subjective redesign.

- [ ] **Step 10: Commit tooling only**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh \
  wordpress/scripts/client-preview-responsive-capture.sh \
  wordpress/scripts/client-preview-video-capture.sh \
  wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
# add .gitignore only if it changed
git commit -m "test(wordpress): add client preview runtime visual verification"
```

Do not commit `.client-preview-artifacts`.

---

### Task 12: Final independent review, fresh verification and completion evidence

**Files:**
- Create: `docs/superpowers/completions/2026-08-30-wordpress-client-preview-medicashop-recreation.md`
- Modify only if coordination requires an append-only factual note: `README.md`

**Interfaces:**
- Consumes: all prior tasks and fresh local evidence.
- Produces: reviewed, evidence-backed client-preview branch ready for user/client review; no integration/deployment.

- [ ] **Step 1: Run complete fresh verification**

After all fixes are finished:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
bash wordpress/scripts/client-preview-responsive-capture.sh
bash wordpress/scripts/client-preview-video-capture.sh
git diff --check
git status --short
```

Also run proprietary/dependency scan:

```bash
grep -RniE 'fullkit\.moxcreative\.com|preview\.themeforest\.net|elementor[ -]?pro|elements-kit-lite|skyboot|Medicashop|MoxCreative' \
  wordpress/wp-content wordpress/scripts || true
```

Every match must be evaluated; production dependency/source leakage is a failure. Negative tests/comments may be acceptable.

Run retail-leakage scan:

```bash
grep -RniE 'add to cart|checkout|my account|shipping|returns|secure payment|rating|wishlist|sale!' \
  wordpress/wp-content/themes/rosa-medical-child \
  wordpress/wp-content/plugins/rosa-medical-core || true
```

Public UX leakage is a failure; test assertions/comments are acceptable.

- [ ] **Step 2: Invoke `superpowers:requesting-code-review`**

Reviewer must inspect:

```text
high-fidelity template silhouette versus manifest
no copied paid/demo source
free-stack boundaries
business-setting truthfulness
Rosa logo/media provenance
Home/About/Contact/Shop section order
no fake customer/testimonial/partner/payment/shipping claims
Shop consumer-commerce leakage
Arabic copy + lang/dir
RTL geometry
mobile drawer/focus/inert behavior
responsive screenshots
client video path
existing Stevens foundation regression
Hostinger/production untouched
Phase 2A branch untouched
```

Resolve valid findings with TDD and rerun affected verification/captures.

- [ ] **Step 3: Invoke `superpowers:verification-before-completion`**

Use only fresh output from after the final review fixes. Do not claim completion from earlier runs.

- [ ] **Step 4: Write completion record**

`docs/superpowers/completions/2026-08-30-wordpress-client-preview-medicashop-recreation.md` must include:

```text
branch + exact final HEAD
base commit + approved spec/plan
reference archives used only as analysis evidence
files changed by category
TDD RED/GREEN evidence
business-settings source and non-empty verification
Rosa-owned media files imported
English routes + Arabic route pairs
Home/About/Contact/Shop reference-role acceptance
64-screenshot matrix summary
mobile/RTL/accessibility results
browser-console result
client-video artifact filename/path (artifact remains ignored)
proprietary-source/dependency scan
consumer-commerce leakage scan
Stevens foundation regression result
independent review findings/resolutions
known limitations: incomplete Shop markup reference, no Single Product fidelity claim
explicit non-actions: Phase 2A not merged, Hostinger/production/DNS/Cloudflare untouched, no mass import, no paid dependency
next step: send client video and wait for Hassan's explicit template-change instructions
```

- [ ] **Step 5: Commit completion evidence**

```bash
git add docs/superpowers/completions/2026-08-30-wordpress-client-preview-medicashop-recreation.md
# README only if an append-only coordination note was genuinely required
git commit -m "docs: record Rosa MedicaShop recreation client preview"
```

- [ ] **Step 6: Stop before integration**

Do not merge into `wordpress/medicashop-migration`, `main`, or the Phase 2A branch. Do not open a PR, deploy or start later catalogue/multilingual/inquiry work without explicit user authorization.

---

## Plan Self-Review Notes

- **Spec coverage:** High-fidelity Home/About/Contact/Shop recreation, Rosa identity/contact/banner substitution, Arabic/RTL, truthfulness, free-stack/no-paid-dependency rules, source/copyright boundary, responsive matrix, visual/video acceptance and non-integration are each mapped to Tasks 1–12.
- **Reference limitation preserved:** Shop archive capture is treated as asset/style evidence only; no Single Product pixel-fidelity claim is introduced.
- **Business-data ambiguity removed:** no address/phone/email is hard-coded; seeding/runtime verification fails until verified Rosa values exist or explicit local environment overrides are supplied.
- **Media provenance explicit:** only named Rosa-owned repository media files are imported; ThemeForest assets are analysis-only.
- **No fake product inventory:** real Woo products are used; empty visual slots fall back to verified family cards rather than invented SKUs/specifications.
- **Multilingual scope bounded:** paired preview pages and RTL are implemented without pretending this is the final multilingual catalogue architecture.
- **No placeholders:** implementation steps define exact functions, file paths, route metadata, tests, commands and acceptance behavior.
