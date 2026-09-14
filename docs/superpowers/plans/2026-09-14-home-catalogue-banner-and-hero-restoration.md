# Rosa WordPress Catalogue, Banner, and Secondary Hero Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the previous Rosa frontend's five-across full-color catalogue presentation and four-banner homepage hero, remove red photographic washes, and give About/Contact fixed photographic heroes.

**Architecture:** Keep the current WordPress/Elementor/WooCommerce ownership boundaries intact. Port only the approved visual behavior from `apps/web/**`: reuse the exact old hero binary blobs inside the child theme, add narrow theme-level fallback helpers and presentation rules, and preserve attachment-ID overrides ahead of defaults.

**Tech Stack:** WordPress/PHP 8+, Elementor Free, WooCommerce, vanilla JavaScript, CSS, existing PHP/shell/browser contracts.

**Spec:** `docs/superpowers/specs/2026-09-14-home-catalogue-banner-and-hero-restoration-design.md`

## Global Constraints

- The old non-WordPress frontend under `apps/web/**` is the visual/interaction oracle for this pass.
- Homepage catalogue order is Scissors, Cutters, Punches, Chisels, Knives.
- Desktop/tablet catalogue layout stays five-across; mobile remains horizontally usable rather than compressing five covers.
- Catalogue covers stay full color: no grayscale, desaturation, sepia, or red wash.
- Homepage uses exactly four old hero image pairs from `apps/web/public/media/editorial/home-hero/v1/`.
- Hero autoplay is 4750 ms and must pause for reduced motion, focus/interaction, and hidden documents.
- About defaults to old Hero 2; Contact defaults to old Hero 4.
- Red/pink photographic overlays are removed; neutral charcoal readability scrims are allowed.
- Existing WordPress/Elementor-selected media overrides defaults.
- Do not change Product Detail, WooCommerce data ownership, quote behavior, global navigation, or production infrastructure.
- Verify 1440, 1024, 768, 431, and 390 CSS-pixel layouts.
- Minimum touch target remains 44 px.
- Preserve EN/AR and RTL behavior.
- No production deployment.

---

### Task 1: Pin the restoration contract before production edits

**Files:**
- Create: `wordpress/scripts/tests/home-visual-restoration-contract.test.php`
- Read: `apps/web/src/features/homepage/home-hero-slides.ts`
- Read: `apps/web/src/features/homepage/hero-carousel-state.ts`
- Read: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php`
- Read: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php`

**Interfaces:**
- Consumes: old four-banner asset names, family order, current WordPress templates.
- Produces: a source-level contract that fails until the restoration implementation exists.

- [ ] **Step 1: Write the failing contract**

Create a PHP test that asserts all of the following:

```php
$expectedFamilies = ['scissors', 'cutters', 'punches', 'chisels', 'knives'];
$expectedHeroFiles = [
    'home-hero-01-desktop.webp', 'home-hero-01-mobile.webp',
    'home-hero-02-desktop.webp', 'home-hero-02-mobile.webp',
    'home-hero-03-desktop.webp', 'home-hero-03-mobile.webp',
    'home-hero-04-desktop.webp', 'home-hero-04-mobile.webp',
];
```

The test must fail unless:
- the five family slugs appear in the required order;
- the WordPress hero resolves exact `v1` default assets;
- a `4750` autoplay constant exists in the WordPress hero JS;
- About references Hero 2 defaults;
- Contact references Hero 4 defaults;
- catalogue cover CSS explicitly resets image filters to `none`;
- affected hero/photo overlay CSS contains neutral scrims rather than Rosa-red gradient color stops.

- [ ] **Step 2: Run the test and confirm RED**

Run:

```bash
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
```

Expected: FAIL because the old v1 hero assets, 4750 ms WordPress carousel behavior, full-color catalogue reset, and secondary-page photographic hero defaults are not all present.

- [ ] **Step 3: Commit the RED contract**

```bash
git add wordpress/scripts/tests/home-visual-restoration-contract.test.php
git commit -m "test(wordpress): pin catalogue and banner restoration"
```

---

### Task 2: Restore exact old hero assets and the four-banner homepage carousel

**Files:**
- Create binaries under: `wordpress/wp-content/themes/rosa-medical-child/assets/media/home-hero/v1/`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/home-visual-restoration.js`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`

**Interfaces:**
- Consumes: exact binary blobs already committed under `apps/web/public/media/editorial/home-hero/v1/`.
- Produces: `rosa_preview_reference_hero_url(int $slide, string $kind): string` and a four-slide carousel with old image defaults.

- [ ] **Step 1: Reuse the eight existing Git blobs under child-theme paths**

Copy without recompression:

```text
apps/web/public/media/editorial/home-hero/v1/home-hero-01-desktop.webp
-> wordpress/wp-content/themes/rosa-medical-child/assets/media/home-hero/v1/home-hero-01-desktop.webp

...repeat for 01-mobile through 04-mobile.
```

- [ ] **Step 2: Add one narrow fallback helper**

Add:

```php
function rosa_preview_reference_hero_url(int $slide, string $kind = 'desktop'): string {
    $slide = min(4, max(1, $slide));
    $kind = $kind === 'mobile' ? 'mobile' : 'desktop';
    $file = sprintf(
        'assets/media/home-hero/v1/home-hero-%02d-%s.webp',
        $slide,
        $kind
    );
    return trailingslashit(get_stylesheet_directory_uri()) . $file;
}
```

Do not change stored attachment IDs.

- [ ] **Step 3: Make old v1 images the default while preserving attachment precedence**

For each slide:

```php
$desktopUrl = $slide['desktop'] > 0
    ? wp_get_attachment_image_url($slide['desktop'], 'full')
    : rosa_preview_reference_hero_url($index + 1, 'desktop');

$mobileUrl = $slide['mobile'] > 0
    ? wp_get_attachment_image_url($slide['mobile'], 'full')
    : rosa_preview_reference_hero_url($index + 1, 'mobile');
```

The legacy single-hero partial must route through the same four-banner presentation rather than retaining a separate one-image visual path.

- [ ] **Step 4: Port carousel behavior into a dedicated script**

The script must use:

```js
const HERO_AUTOPLAY_MS = 4750;
```

It must:
- activate exactly one slide at a time;
- update dots and `aria-current`;
- pause while focus is inside the hero;
- pause during pointer manipulation;
- pause while `document.hidden`;
- disable autoplay when `prefers-reduced-motion: reduce`;
- restart the interval after manual selection;
- keep keyboard-operable dots.

- [ ] **Step 5: Enqueue the script only where needed**

Enqueue `home-visual-restoration.js` on the front page/latest Home authoring surface after the existing preview script.

- [ ] **Step 6: Run syntax/contract verification**

```bash
php -l wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
```

Expected: hero-related assertions turn GREEN.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/media/home-hero/v1         wordpress/wp-content/themes/rosa-medical-child/assets/js/home-visual-restoration.js         wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php         wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php         wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php         wordpress/wp-content/themes/rosa-medical-child/functions.php
git commit -m "feat(wordpress): restore four-banner homepage hero"
```

---

### Task 3: Restore the five-across full-color catalogue presentation

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/home-visual-restoration.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`

**Interfaces:**
- Consumes: existing theme catalogue covers under `assets/media/homepage-covers/` and existing PDF media IDs.
- Produces: stable five-across desktop/tablet catalogue layout and horizontal mobile gallery.

- [ ] **Step 1: Make the theme covers a real fallback instead of upload-directory-only URLs**

Resolve each cover from:

```php
$coverUrl = trailingslashit(get_stylesheet_directory_uri())
    . 'assets/media/homepage-covers/' . $family['cover'];
```

Uploaded/client-selected catalogue PDFs remain authoritative for link targets.

- [ ] **Step 2: Add exact five-column desktop/tablet CSS**

```css
.public-page--home .home-family-gallery,
.rosa-elementor-authoring .home-family-gallery {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(.5rem, 1.1vw, 1rem);
}

.home-family-gallery__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: none !important;
}
```

Do not apply `.rosa-preview-media-slot__image--curated-fallback` grayscale treatment to catalogue covers.

- [ ] **Step 3: Preserve the old compact mobile interaction**

Below 40rem:
- make the gallery horizontal and scrollable;
- keep each card large enough to read;
- retain 44 px previous/next controls;
- no five-way compressed grid.

- [ ] **Step 4: Restore restrained hover/focus treatment**

Use the old source behavior: modest `scale(1.14)`, neutral contrast/saturation, border emphasis, and shadow. Do not tint the image.

- [ ] **Step 5: Enqueue the restoration stylesheet after historical preview CSS**

This stylesheet is intentionally a narrowly scoped final override for Home/About/Contact restoration selectors.

- [ ] **Step 6: Run the focused contract**

```bash
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
```

Expected: catalogue order/layout/full-color assertions GREEN.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php         wordpress/wp-content/themes/rosa-medical-child/assets/css/home-visual-restoration.css         wordpress/wp-content/themes/rosa-medical-child/functions.php
git commit -m "feat(wordpress): restore full-color catalogue row"
```

---

### Task 4: Replace About/Contact gradients with fixed photographic heroes and neutralize red photo washes

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/home-visual-restoration.css`
- Modify only if required for specificity: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`

**Interfaces:**
- Consumes: `rosa_preview_reference_hero_url()`.
- Produces: About Hero 2 and Contact Hero 4 responsive pictures plus neutral overlays.

- [ ] **Step 1: Render responsive hero media behind existing copy**

About:

```php
$heroSlide = 2;
```

Contact:

```php
$heroSlide = 4;
```

Render:

```php
<picture class="rosa-preview-page-hero__media" aria-hidden="true">
  <source media="(max-width:40rem)" srcset="...mobile...">
  <img src="...desktop..." alt="" decoding="async">
</picture>
```

Keep the existing eyebrow/title/body markup unchanged.

- [ ] **Step 2: Replace red/pink page-hero gradients with neutral scrims**

Use:

```css
.rosa-preview-page-hero::after {
  background: linear-gradient(
    90deg,
    rgb(10 12 16 / .68),
    rgb(10 12 16 / .38) 48%,
    rgb(10 12 16 / .22)
  );
}
```

No `rgb(224 8 21 ...)`, pink, burgundy, or Rosa-red photographic wash is allowed on these hero/photo overlays.

- [ ] **Step 3: Remove red photo washes on affected About media**

Override only photographic pseudo-elements such as `.rosa-preview-about-feature__media::after` and `.rosa-preview-about-evidence__media::after` with neutral dark gradients or `background:none` where copy is not over the image.

Do not remove ordinary red brand buttons/lines/badges.

- [ ] **Step 4: Tune focal positions**

Desktop/tablet/mobile:
- About Hero 2 keeps the clinical/instrument subject visible.
- Contact Hero 4 keeps the instrument arrangement visible.
- text remains readable without recoloring the photograph.

- [ ] **Step 5: Run contract and syntax checks**

```bash
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
```

Expected: About/Contact image and neutral-overlay assertions GREEN.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php         wordpress/wp-content/themes/rosa-medical-child/assets/css/home-visual-restoration.css         wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css
git commit -m "feat(wordpress): restore photographic page heroes"
```

---

### Task 5: Full verification and responsive closeout

**Files:**
- Test: `wordpress/scripts/tests/home-visual-restoration-contract.test.php`
- Test: existing homepage/accessibility/link/Elementor contracts
- Browser: local WordPress at the repository-configured port

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: fresh evidence that no requested surface regressed.

- [ ] **Step 1: Run focused source verification**

```bash
php wordpress/scripts/tests/home-visual-restoration-contract.test.php
php wordpress/scripts/tests/latest-home-curated-media-contract.test.php
```

- [ ] **Step 2: Run PHP syntax checks on every modified PHP file**

```bash
php -l wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php
php -l wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php
php -l wordpress/wp-content/themes/rosa-medical-child/functions.php
```

- [ ] **Step 3: Run existing non-destructive public contracts**

Run the repository's existing homepage, accessibility, Elementor-authoring, link, RTL, and overflow checks relevant to Home/About/Contact. Do not weaken expectations to make this pass.

- [ ] **Step 4: Browser verification**

At 1440, 1024, 768, 431, and 390:
- catalogue is five-across on desktop/tablet;
- mobile catalogue remains readable and horizontally navigable;
- catalogue images are visibly full color;
- all four Home banners cycle and manual dots work;
- reduced-motion prevents autoplay;
- no reddish photographic wash remains;
- About uses Hero 2;
- Contact uses Hero 4;
- no missing/broken images;
- no horizontal overflow/collision;
- touch targets remain >=44px;
- EN/AR and RTL remain coherent.

- [ ] **Step 5: Review the diff for scope**

Confirm no Product Detail, WooCommerce data, quote behavior, header/footer redesign, production, DNS, Hostinger, or Cloudflare change is included.

- [ ] **Step 6: Final commit only after fresh GREEN evidence**

```bash
git status --short
git diff --check
```

Commit any verification-only fixture/document updates with:

```bash
git commit -m "test(wordpress): verify visual restoration"
```
