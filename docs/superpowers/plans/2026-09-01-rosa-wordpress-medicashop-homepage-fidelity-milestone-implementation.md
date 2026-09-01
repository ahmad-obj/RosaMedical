# Rosa WordPress MedicaShop Homepage Fidelity Milestone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Use `superpowers:systematic-debugging`, `superpowers:test-driven-development`, and `superpowers:verification-before-completion` at their required gates.

**Goal:** Reconstruct the English Rosa WordPress global header, Homepage, and footer to match the measured MedicaShop target geometry while using Rosa red, truthful copy, neutral named media slots, accessible behavior, and the existing free WordPress/WooCommerce infrastructure.

**Architecture:** Keep protected behavior and data in the existing child theme, but replace the old visual markup with focused partials matching the nine measured target sections. Browser behavior tests establish geometry at 1440, 1024, 768, and 390; target/local captures and overlays establish final visual truth across the required matrix.

**Tech Stack:** WordPress, Hello Elementor child theme, WooCommerce, PHP 8.x, vanilla CSS/JS, Bash, WP-CLI, Docker Compose, Playwright/Chromium, ImageMagick.

**Spec:** `docs/superpowers/specs/2026-09-01-rosa-wordpress-medicashop-homepage-fidelity-milestone-design.md`

## Global Constraints

- Work only on `wordpress/client-preview-medicashop-recreation`.
- Never modify/stage/revert/commit `apps/web/next-env.d.ts`, `.superpowers/`, or `output.txt`.
- Do not touch production, Hostinger, DNS, Cloudflare, main, `wordpress/medicashop-migration`, or Phase 2A.
- Do not copy or ship paid template JSON, proprietary code/assets, demo images, Elementor Pro, ElementsKit, or Skyboot.
- Target imagery becomes neutral named placeholders during this milestone.
- Target green roles map only to Rosa red `#e00815`/`#b90a14`; neutral roles stay neutral.
- Preserve truthful quotation/procurement semantics and existing real WooCommerce product data.
- Stop after the English header/Home/footer target/local comparison gate.

---

## Task 1: Commit the approved milestone design boundary

**Files:**
- Create: `docs/superpowers/specs/2026-09-01-rosa-wordpress-medicashop-homepage-fidelity-milestone-design.md`
- Create: `docs/superpowers/plans/2026-09-01-rosa-wordpress-medicashop-homepage-fidelity-milestone-implementation.md`

**Interfaces:** The spec consumes the measured report and produces the only visual requirements used by Tasks 2–7.

- [ ] Run `git diff --check` and scan both documents for `TODO`, `TBD`, contradictory teal/image-selection/all-pages language, and incomplete milestone boundaries.
- [ ] Stage only the spec and plan.
- [ ] Commit `docs: define MedicaShop homepage fidelity milestone`.

## Task 2: Add browser-level fidelity contracts before changing the theme

**Files:**
- Create: `wordpress/scripts/tests/client-preview-home-fidelity.test.mjs`
- Modify: `wordpress/scripts/tests/client-preview-home-contract.test.sh`
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`

**Interfaces:**
- Consumes base URL as `process.argv[2]`, default `http://localhost:8088/`.
- Produces exit 0 only when the rendered English Home exposes nine ordered `[data-home-section]` bands and measured shell/grid behavior.

- [ ] Write a Playwright test using real rendered DOM. At every tested width, assert one main landmark, no horizontal overflow, 9 ordered Home sections, decoded images/zero external demo requests, and all required neutral `[data-media-slot]` roles.
- [ ] Add literal 1440 assertions with tolerances: announcement 42–46px; main header 74–78px; total header 118–122px; rail 1276–1284px; hero 660–700px; hero content 680–740px; 4 featured columns; 5 latest columns; 30/70 mosaic split; 3 evidence cards; pre-footer 155–180px; four footer columns.
- [ ] Add literal 1024 assertions: mobile trigger visible, desktop nav hidden, header 101–109px, 4 latest columns, 30/70 promo layout, no overflow.
- [ ] Add literal 768 assertions: same mobile header, 4 latest columns, stacked featured/benefits cards, no overflow.
- [ ] Add literal 390 assertions: 2 latest columns, four stacked promo tiles, stacked footer, hero 430–490px, open dropdown spans full viewport and begins below header.
- [ ] Mutate the existing source contract to protect the new ordered nine-role marker names and absence of unsupported retail/demo text, while removing old assertions for separate stats/value-strip/custom sections.
- [ ] Export the four business settings, start/seed the local Docker site if needed, and run the new browser test against the old implementation. Expected RED: wrong nine-section order/header/hero/grid/footer geometry.
- [ ] Add the new browser test invocation to `client-preview-runtime-verify.sh` only after the RED is observed.

## Task 3: Reconstruct the target-faithful global header

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js`
- Modify: `wordpress/scripts/tests/client-preview-shell-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`

**Interfaces:** Header exposes `.rosa-preview-announcement`, `.rosa-preview-header`, `.rosa-preview-header__inner`, desktop `.rosa-preview-nav`, two compact header actions, `[data-rosa-preview-menu-trigger]`, and full-width `[data-rosa-preview-menu-drawer]`.

- [ ] Strengthen the accessibility browser test to assert English Home `/` pairs to `/ar/` and Shop pairing remains correct; require the dropdown to begin within 2px of the rendered header bottom and span at least viewport width minus 2px.
- [ ] Run affected tests and observe RED against the side drawer/old shell.
- [ ] Pass `$previewPostId ?: null` to `rosa_preview_pair_url` while editing the header, preserving the known Shop pairing fix.
- [ ] Rebuild header markup to match target order: announcement text/contacts; menu/logo/nav/actions. Use non-retail language and inquiry/language circular actions rather than cart/account semantics.
- [ ] Change CSS to 44+76px desktop and 41–43+62px responsive bands; 1280px rail; non-sticky shell; compact logo/nav/action geometry; dropdown breakpoint through 1024px.
- [ ] Preserve focus trap, inert background, Escape, overlay close, focus restoration, 44px targets, and reduced motion. Position the drawer close control over the menu-trigger visual slot so the open screenshot matches the target cross icon without adding an extra menu row.
- [ ] Run PHP syntax, JS syntax, shell contract, RTL contract, accessibility test, and fidelity test. Header assertions must be GREEN; Home/footer assertions may remain RED.
- [ ] Commit `feat(wordpress): reconstruct MedicaShop-faithful global header`.

## Task 4: Build the Home media primitive and sections 1–5

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/media-slot.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-who.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/home-feature.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-grid.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-home.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-content.test.php`

**Interfaces:**
- `media-slot.php` consumes `slot`, `label`, and optional `class`; outputs one neutral `<div data-media-slot="…">`.
- Product grid consumes `variant=featured|latest`, `limit=4|10`, and locale; outputs `.rosa-preview-products--featured|latest`.
- `rosa_preview_home_cards(int $limit, string $locale): array` returns real product descriptors first and verified family descriptors to fill exact visual count without inventing products.

- [ ] Add pure helper tests for 4/10 exact card counts, real-product-first order where fixtures are supplied, family labels, and no invented SKU/price/rating fields. Observe RED.
- [ ] Add fidelity-test checks for media slot names `home-hero-01`, `home-who-01`, product slot sequence, and `home-feature-01`. Observe RED.
- [ ] Implement the media primitive and helper with escaped values and no target URLs/assets.
- [ ] Build section 1 as a 720px centered overlay hero at the measured heights and type scale.
- [ ] Build section 2 as the 60/40 split with overlapping 3-stat panel and one neutral media slot. Stats are limited to verified five families, five catalogue PDFs, and bilingual preview availability.
- [ ] Build section 3 as one raised featured-products card plus a separate 3-role benefits rail. Use four exact visual cards and truthful Catalogue/Quotation/Family roles.
- [ ] Build section 4 as the full-width feature overlay banner with `home-feature-01`.
- [ ] Build section 5 as ten cards: 5×2 desktop, 4-column tablet, 2-column mobile. Preserve square neutral media, title/price-role/action heights.
- [ ] Run pure content test, PHP syntax for every changed file, Home contract, boundary test, and fidelity browser test. Sections 1–5 assertions must be GREEN.
- [ ] Commit `feat(wordpress): reconstruct first MedicaShop homepage sections`.

## Task 5: Build Home sections 6–9

**Files:**
- Create: `template-parts/client-preview/home-promos.php`
- Create: `template-parts/client-preview/home-why.php`
- Create: `template-parts/client-preview/home-proof.php`
- Create: `template-parts/client-preview/home-evidence.php`
- Modify: `page-templates/client-preview-home.php`
- Modify: `inc/client-preview.php`
- Modify: `assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-home-fidelity.test.mjs`

**Interfaces:** Promos output four named slots; proof outputs five/six verified family labels in carousel-like horizontal rhythm; evidence outputs exactly three truthful workflow cards over `home-evidence-01`.

- [ ] Add RED browser assertions for 4 promo tiles, 30/70 desktop geometry, four stacked mobile tiles, one why media slot plus three value cards, proof band height, three evidence cards and section order.
- [ ] Implement the 30/70 mosaic with slots `home-promo-01` through `home-promo-04` and copy lengths comparable to target.
- [ ] Implement the why split with `home-why-01` and three stacked raised cards.
- [ ] Implement proof as restrained family typography/marks with no partner claim.
- [ ] Implement evidence as a full-width neutral overlay role with `home-evidence-01` and three equal workflow cards; do not use testimonial wording/avatar/customer names.
- [ ] Run PHP syntax, Home/content/reference contracts, and fidelity browser test. All nine Home section assertions must be GREEN except footer assertions.
- [ ] Commit `feat(wordpress): reconstruct remaining MedicaShop homepage sections`.

## Task 6: Reconstruct the target-faithful pre-footer and footer

**Files:**
- Modify: `template-parts/client-preview/cta-banner.php`
- Modify: `footer.php`
- Modify: `page-templates/client-preview-home.php`
- Modify: `assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-shell-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-home-fidelity.test.mjs`

**Interfaces:** CTA outputs the 166px desktop/stacked mobile light-grey inquiry band and sets a render flag. Footer renders the CTA only if no page already rendered it, then four columns and the bottom divider/copyright/social row.

- [ ] Add RED behavior assertions for pre-footer dimensions, `prefooter-person-01`, one CTA only, four footer columns, white footer surface, lower divider, verified contact text, and stacked mobile order.
- [ ] Rebuild `cta-banner.php` with heading, two controls/one action matching target form geometry, and a neutral person slot. Controls may link/route to Contact; they must not pretend to submit a newsletter.
- [ ] Rebuild `footer.php` with brand/about, Company, Support, Get in touch, payment-logo role removed, verified Rosa values, lower strip and restrained social/contact links only where already verified.
- [ ] Ensure Home emits one pre-footer and other pages temporarily inherit one corrected shared pre-footer without duplication.
- [ ] Run PHP syntax, shell/Home/contact/RTL/reference contracts, accessibility browser test, and fidelity browser test. Entire browser fidelity contract must be GREEN.
- [ ] Commit `feat(wordpress): reconstruct MedicaShop-faithful global footer`.

## Task 7: Target/local visual comparison and repair loop

**Files:**
- Create: `wordpress/.medicashop-forensics/capture-local-home.mjs` (ignored)
- Create: `wordpress/.medicashop-forensics/build-home-diffs.sh` (ignored)
- Create: `docs/superpowers/reports/2026-09-01-rosa-medicashop-homepage-fidelity-review.md`
- Modify theme/tests only for demonstrated defects.

**Interfaces:** Local paths mirror target paths under `local/home/{width}/`. Diff paths are `diff/home/{width}/{full,header,hero,section-01..09,footer}-{side-by-side,overlay,diff}.png`.

- [ ] Capture local full/header/hero/nine sections/footer/menu states at 390, 430, 768, 1024, 1366, 1440, 1920, and 2560 using the same media-settling behavior.
- [ ] Use ImageMagick to create side-by-side images, 50% alpha overlays, and absolute difference images. Pad only canvas height/width for comparison; never distort either source.
- [ ] Inspect target/local pairs for 390, 768, 1024, 1366, 1440, 1920, and 2560 section by section. Record measured height/position deltas, text-wrap differences, rail widths, grid/card dimensions, menu/footer behavior, and intentional color/media/copy differences.
- [ ] For each major mismatch, add/strengthen a real browser assertion, observe RED, make the minimum root-cause fix, run GREEN, recapture affected paths, and re-review.
- [ ] Run the full source/PHP/Node suite, runtime verification, accessibility acceptance, and Stevens Product Detail fixture regression.
- [ ] Request independent code/spec review. Resolve every critical/important finding with RED/GREEN evidence.
- [ ] Write the fidelity review report with exact target/local/diff roots, section list, tests, commit, and remaining visual differences.
- [ ] Commit visual fixes by root cause, then commit `docs: record MedicaShop homepage fidelity review`.
- [ ] Run `git status --short`; ensure `apps/web/next-env.d.ts` remains the only unrelated tracked modification and raw forensics remain ignored.

## Milestone completion gate

Stop and report for user visual review only when:

- all target capture paths exist;
- all local/diff paths exist;
- no major mismatch remains in header, footer, section order/proportion, typography scale, spacing rhythm, card geometry, grid density, or responsive stacking;
- placeholders and Rosa-red mapping are the only large intentional image/color differences;
- runtime/accessibility/product/safety tests pass;
- independent review has no unresolved critical/important finding.
