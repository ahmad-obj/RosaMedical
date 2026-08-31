# Rosa Medical WordPress Live MedicaShop Fidelity Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task by task. Use `superpowers:systematic-debugging` for every unexpected result, `superpowers:test-driven-development` for every production change, and `superpowers:verification-before-completion` before any completion claim.

**Goal:** Replace the loose client-preview interpretation with an independently authored Rosa implementation whose shell, geometry, density, section topology, responsive transformations, and visual rhythm closely reproduce the live MedicaShop Home, About, Contact, and Shop pages while retaining truthful Rosa content, Rosa-owned media, English, Arabic/RTL, and a quotation-oriented experience.

**Architecture:** Keep the existing WordPress/Hello Elementor child-theme architecture. Shared PHP partials own the repeated MedicaShop-like visual roles; page templates own page topology; WooCommerce remains the source of published product entries; verified Rosa catalogue families may fill clearly labelled non-product grid slots. A deterministic seed imports only explicit Rosa-owned media. Playwright captures both the public reference and local Rosa matrices, validates geometry/accessibility, and proves the walkthrough scenes from the generated video artifact.

**Tech Stack:** WordPress, Hello Elementor, Elementor Free, WooCommerce, `rosa-medical-core`, PHP 8.x, Bash/WP-CLI, vanilla CSS/JavaScript, Playwright, Chromium, ffmpeg/ffprobe where already available.

**Spec:** `docs/superpowers/specs/2026-08-31-rosa-wordpress-live-medicashop-fidelity-correction-design.md`

## Global Constraints

- Work only on `wordpress/client-preview-medicashop-recreation`; never merge into `main`, `wordpress/medicashop-migration`, or the Phase 2A redesign.
- Do not modify, stage, revert, overwrite, or commit `apps/web/next-env.d.ts`. Do not alter unrelated `apps/web/**`; Rosa-owned media there is read-only input.
- Never touch Hostinger, production, DNS, or Cloudflare.
- Public MedicaShop pages are visual evidence only. Never copy, download into production, hotlink, or ship their source/assets.
- The implementation may use only WordPress, Hello Elementor, Elementor Free, WooCommerce, `rosa-medical-child`, `rosa-medical-core`, and independently authored PHP/CSS/JS. No Elementor Pro, MedicaShop package, WPML, ElementsKit/Elements Kit, Skyboot, or paid dependency.
- Preserve each unsupported live block's layout role and visual weight by replacing its content truthfully. Do not create prices, ratings, sale badges, checkout, cart, shipping/payment/return claims, testimonials, partners, opening hours, statistics, SKUs, certifications, or product claims.
- Use only verified business values: `+966 59 720 4394`, `info@rosamedical.org`, `King Fahd Road, Al Olaya, Riyadh 12214, Saudi Arabia`, and `طريق الملك فهد، العليا، الرياض 12214، المملكة العربية السعودية`.
- Use only Rosa-owned media below `apps/web/public/media/**`, copied into WordPress by the seed. Product imagery and identifiers must come from existing verified repository catalogue data.
- Keep English LTR and Arabic as a complete translated RTL counterpart with paired routes and logical geometry.
- Do not claim Single Product fidelity. Preserve the Stevens Product Detail foundation and shared shell.
- Test every production change RED then GREEN, run the relevant broader suite, and create focused commits. Never stage `apps/web/next-env.d.ts`, `.superpowers/`, or `output.txt`.
- Required matrices: 32 live-reference captures (4 English pages × 8 viewports) and 64 Rosa captures (8 bilingual pages × 8 viewports).

## File Map

### Shared implementation

- `wordpress/wp-content/themes/rosa-medical-child/header.php` — compact announcement/header, paired language action, accessible drawer.
- `wordpress/wp-content/themes/rosa-medical-child/footer.php` — dense four-column footer and bottom row.
- `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php` — localized copy, media, pair, family and truthful catalogue-card helpers.
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-{home,about,contact,shop}.php` — corrected page topology.
- `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php` — corrected English Shop topology.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/hero.php` — image-overlay Home hero.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-{grid,card}.php` — real-product and clearly labelled family-card rendering.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/{stats,feature-banner,why-us,evidence-band,proof-strip,cta-banner}.php` — shared live-reference roles.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css` — all shared live-fidelity layout and responsive rules.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css` — only irreducible RTL adjustments.
- `wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js` — accessible mobile drawer behavior.

### Seed and acceptance tooling

- `wordpress/scripts/client-preview-seed.sh` — mandatory bilingual settings and explicit Rosa media map.
- `wordpress/scripts/client-preview-reference-capture.sh` — fixed live URLs and 32-capture loop.
- `wordpress/scripts/client-preview-responsive-capture.sh` — 64 local captures.
- `wordpress/scripts/client-preview-visual-compare.mjs` — pair manifest/contact sheets and measurable topology checks.
- `wordpress/scripts/client-preview-video-capture.sh` — deterministic labelled client walkthrough.
- `wordpress/scripts/client-preview-video-review.mjs` — artifact metadata, nonblank frames, ordered scene-marker proof, review frames.
- `wordpress/scripts/client-preview-runtime-verify.sh` — complete local runtime gate.
- `wordpress/scripts/tests/client-preview-*.test.*` — source, pure behavior, browser, capture, accessibility, and video regression coverage.

### Evidence

- `docs/superpowers/reports/2026-08-31-client-preview-live-visual-review.md` — 32 target/64 Rosa pair review observations and repairs.
- `docs/superpowers/completions/2026-08-30-wordpress-client-preview-medicashop-recreation.md` — final current evidence record replacing stale claims.

---

## Task 1: Make live-reference evidence deterministic

**Files:**
- Create: `wordpress/scripts/client-preview-reference-capture.sh`
- Modify: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`

**Contract:** The script uses exactly the four approved public URLs, including `https://fullkit.moxcreative.com/medicashop/shop/`, captures eight named viewport sizes via the existing media-settling helper, writes only below ignored `wordpress/.client-preview-artifacts/reference-live/`, fails on a missing/empty capture, and reports exactly 32 files.

1. Add failing assertions to `client-preview-runtime-tooling.test.sh` for the new executable, four exact URLs, absence of `/medicashop/template-kit/shop/`, all eight dimensions, the existing `client-preview-capture.mjs`, and the expected count `32`. Run the test and observe RED.
2. Implement the smallest Bash capture loop with page names `home`, `about`, `contact`, `shop` and filenames `{page}-{width}x{height}.png`. Run `bash -n` and the contract test to GREEN.
3. Run `bash wordpress/scripts/client-preview-reference-capture.sh`; confirm all 32 files are nonempty. Do not commit generated artifacts.
4. Commit only the script and test as `test(wordpress): automate live preview reference capture`.

## Task 2: Close known runtime and dependency-boundary defects

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Modify: `wordpress/scripts/client-preview-seed.sh`
- Modify: `wordpress/scripts/tests/client-preview-{shell,rtl,seed-contract,reference-boundary}.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`

**Contracts:** English Woo Shop switches to `/ar/shop/`; Arabic Shop switches to `/shop/`; seed refuses an empty Arabic address before mutating WordPress; both source and runtime guards reject `elementskit`, `elementskit-lite`, `elements-kit`, and `elements-kit-lite` spellings.

1. Strengthen source tests first: require `rosa_preview_pair_url($previewPostId ?: null)` in the header, require `address_ar` in the seed's mandatory-value guard, and add exact dependency spelling fixtures to the boundary test. Extend the Playwright language-pair assertion to visit both Shop routes and verify their switch URLs. Observe RED.
2. Change the header to pass the resolved preview post ID. Add `ROSA_PREVIEW_ADDRESS_AR` to the seed preflight and pass it through the existing safe settings channel. Normalize forbidden regexes to `elements-?kit|elementskit` plus optional `-lite` without weakening other guards.
3. Run the five changed contracts, PHP syntax for `header.php`, Node syntax for the accessibility script, then the complete `wordpress/scripts/tests/client-preview-*.test.*` source/pure suite that does not require the live site.
4. Commit as two focused commits: `fix(wordpress): preserve paired Shop language routes` and `fix(wordpress): harden preview seed and dependency boundary`.

## Task 3: Create shared live-fidelity visual roles

**Files:**
- Create: `template-parts/client-preview/{stats,feature-banner,why-us,evidence-band,proof-strip}.php`
- Modify: `template-parts/client-preview/{hero,cta-banner,value-strip}.php`
- Modify: `header.php`, `footer.php`, `inc/client-preview.php`
- Modify: `assets/css/client-preview.css`, `assets/css/client-preview-rtl.css`
- Modify: `wordpress/scripts/tests/client-preview-{content,shell,home,about,rtl}-contract.test.*`

**Interfaces:** Every shared role accepts `$args['locale']`; image roles accept explicit media keys/IDs; all output uses escaped WordPress APIs; repeated sections expose stable `data-preview-*` markers. `evidence-band.php` renders three truthful workflow cards, never testimonials. `proof-strip.php` renders verified family names, never partner logos. `cta-banner.php` is the compact grey inquiry band. Stats are limited to verifiable catalogue facts.

1. Add RED contracts for the new partials, stable markers, three evidence cards, five proof items, image-overlay feature structure, four-column footer headings, green/teal token presence, and absence of the former red accent token and unsupported retail language.
2. Implement localized copy entries and the five partials. Rebuild the shared shell to the live proportions: 34 px announcement strip, 74–82 px white header, bounded 1180 px rail, compact navigation/actions, grey pre-footer inquiry band, and four-column dark footer.
3. Replace the CSS token system with teal/green, off-white, grey and charcoal values; use logical properties; implement reference-like radii, shallow shadows, card borders, and section spacing. Keep the current accessible drawer behavior intact.
4. Run changed contracts, `php -l` for every changed PHP file, JS syntax, RTL/source boundary tests, and the content pure test.
5. Commit as `feat(wordpress): build live-fidelity preview primitives`.

## Task 4: Reconstruct Home to the live topology and density

**Files:**
- Modify: `page-templates/client-preview-home.php`
- Modify: `template-parts/client-preview/product-{grid,card}.php`
- Modify: `inc/client-preview.php`
- Modify: `assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-home-contract.test.sh`
- Create: `wordpress/scripts/tests/client-preview-layout.test.mjs`

**Required ordered topology:** overlay hero; who split with overlapping stats; featured four-card row plus three-benefit rail; full-width overlay feature; dense eight-slot latest grid; one-tall/three-horizontal promo mosaic; why split with image and three raised cards; five-item proof strip; teal image-backed three-card evidence band; grey inquiry band; footer.

1. Make the Home source contract assert the ordered marker list and exact structural counts. Add browser assertions at 1440 px for four featured columns, four latest columns/two rows, asymmetric mosaic, overlapping stats, full-width banners, and footer columns. Add 390 px assertions for single-column content, non-overlapping readable cards, and no horizontal overflow. Observe RED.
2. Add a pure helper returning real Woo product cards first and then verified family cards labelled `Catalogue family` / `فئة كتالوج` until the requested visual slot count is met; family cards must contain no product ID/SKU/price/rating semantics.
3. Rebuild Home and CSS to the required order using explicit Rosa media roles and closest crop behavior. Keep real product details linked; family cards link to the locale-correct Shop route.
4. Run Home/content/shop/source/RTL contracts and, after seed/runtime is available, the layout test at desktop and mobile.
5. Commit as `feat(wordpress): match live MedicaShop Home composition`.

## Task 5: Reconstruct About to the live topology

**Files:**
- Modify: `page-templates/client-preview-about.php`
- Modify: `assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-about-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-layout.test.mjs`

**Required ordered topology:** compact image title hero; who split and overlapping stats; three equal service cards with two image cards and one green catalogue/quotation availability card; overlay feature; why split; evidence band; proof strip; grey inquiry band; footer.

1. Add RED source and browser assertions for marker order, 3-card geometry, image-role count, green availability card, overlay banners, and desktop/mobile column transitions.
2. Rebuild the template from the shared roles. The green card must explicitly avoid hours and say that catalogue identification and quotation contact are available through the site/contact channels.
3. Run About/content/shell/RTL/reference tests, PHP syntax, and affected browser layout checks.
4. Commit as `feat(wordpress): match live MedicaShop About composition`.

## Task 6: Reconstruct Contact to the live topology

**Files:**
- Modify: `page-templates/client-preview-contact.php`
- Modify: `assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-contact-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-layout.test.mjs`

**Required ordered topology:** compact image title hero; large light-grey field; paired raised contact/form cards with icon/list rhythm; verified-address map/search role; deliberate lower breathing space matching the reference; grey inquiry band; footer.

1. Add RED assertions for ordered markers, two raised cards, centralized business-value calls, no hard-coded fake coordinates/hours, reference-like desktop pairing and mobile stacking, and usable labelled form fields.
2. Rebuild the Contact template. Use a maps search URL generated from the verified address, not fabricated coordinates or an embedded third-party map. Keep the form explicitly a preview inquiry form unless a real submit handler already exists.
3. Run Contact/content/shell/RTL/reference contracts, PHP syntax, and layout/accessibility checks.
4. Commit as `feat(wordpress): match live MedicaShop Contact composition`.

## Task 7: Reconstruct English and Arabic Shop density

**Files:**
- Modify: `woocommerce/archive-product.php`
- Modify: `page-templates/client-preview-shop.php`
- Modify: `template-parts/client-preview/product-{grid,card}.php`
- Modify: `assets/css/client-preview.css`
- Modify: `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-layout.test.mjs`

**Required ordered topology:** image-backed Find Product hero with full-width search; compact sort/result row; dense card grid; evidence band; why split; proof strip; grey inquiry band; footer.

1. Add RED source/browser assertions for identical English/Arabic topology, four/three/two/one responsive columns where widths permit, real-product vs family-card labelling, no prices except localized `Price on request`, correct View Details labels, no cart/checkout/rating/sale controls, and correct Shop language pairing.
2. Implement one shared Shop renderer called by both templates so locale is the only topology difference. Populate enough clearly distinguished verified family cards to preserve density without manufacturing products.
3. Run Shop/content/RTL/reference/product-detail contracts, PHP syntax, layout test, and the accessibility Shop route checks.
4. Commit as `feat(wordpress): match live MedicaShop Shop composition`.

## Task 8: Expand deterministic Rosa media seeding

**Files:**
- Modify: `wordpress/scripts/client-preview-seed.sh`
- Modify: `wordpress/scripts/tests/client-preview-seed-contract.test.sh`

**Media map:** keep `logo`, `hero`, `about_procurement`, `about_hospitals`, `about_international`, and `procurement_support`; add explicit keys for the six existing `editorial/home-specialties/*.webp` images and the existing `editorial/about-client-*.webp` images used by corrected page roles. If a catalogue-family card needs an image, select a specific existing repository owner/preview file and name it explicitly; never glob or mass-import.

1. Add RED assertions for every exact source path/key, strict-mode-safe local initialization, missing-file failure, and media option persistence.
2. Extend the existing `import_media` calls only for files actually rendered. Reuse attachment IDs deterministically on repeat seeds.
3. Export all four business values and run the seed twice. Confirm both runs pass and attachment/page counts do not grow on the second run.
4. Run seed/content/reference contracts and commit as `feat(wordpress): seed corrected preview media roles`.

## Task 9: Enforce responsive, RTL, and accessibility acceptance

**Files:**
- Modify: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- Modify: `wordpress/scripts/tests/client-preview-layout.test.mjs`
- Modify: `assets/css/client-preview.css`, `assets/css/client-preview-rtl.css`, and JS only when a failing test identifies a defect.

**Acceptance:** all eight routes; 390/430 mobile behavior; 768 tablet; 1024 and wider desktop transformations; no horizontal scrolling; no clipped text/broken media; 44 px interactive targets; keyboard-visible focus; drawer focus trap, inert background, Escape close, and trigger restoration; reduced motion; 200% equivalent reflow; correct `lang`/`dir`; paired language routes; mirrored directional icons and logical layout.

1. Extend browser tests to enumerate all eight routes and key section markers, assert decoded images, console/network cleanliness, no forbidden dependency requests, no English-only controls on Arabic routes, and direction-aware drawer placement. Observe RED for any missed implementation behavior.
2. Make only evidence-driven CSS/JS/PHP fixes. Re-run the failing assertion after each minimal change, then both complete browser suites.
3. Run the entire source/pure test suite and `bash wordpress/scripts/client-preview-runtime-verify.sh` with all four environment values.
4. Commit as `fix(wordpress): complete live-fidelity responsive and RTL behavior`.

## Task 10: Produce comparable visual evidence and repair divergences

**Files:**
- Create: `wordpress/scripts/client-preview-visual-compare.mjs`
- Create: `wordpress/scripts/tests/client-preview-visual-compare.test.mjs`
- Create: `docs/superpowers/reports/2026-08-31-client-preview-live-visual-review.md`
- Modify implementation files only for defects demonstrated by pair review.

**Contract:** The compare tool validates the expected 32 live and 64 Rosa filenames, creates ignored English target/Rosa side-by-side contact sheets for each viewport/page, and emits a manifest. It must not treat raw pixel similarity as a pass because approved imagery/text substitutions are expected.

1. Write RED pure tests for expected matrix names, missing-file detection, and target-to-English-Rosa pairing. Implement exports and CLI to GREEN.
2. Run reference capture, runtime verify, then Rosa responsive capture with explicit status chaining. Run the compare tool.
3. Inspect every target/Rosa English pair and every Arabic capture. Record observations for header/hero heights, section order, grid density, banner/mosaic geometry, card size/shadow/radius, footer silhouette, responsive transitions, overflow/crops, Arabic leakage/collisions, and quotation semantics.
4. For every material defect, add/strengthen the smallest source/browser test, observe RED, fix minimally, re-run related suites, recapture affected files, and re-review. Record the repair in the report.
5. Commit tooling/report as `test(wordpress): record live preview visual acceptance`; commit visual fixes separately by root cause.

## Task 11: Prove walkthrough scenes from the video artifact

**Files:**
- Modify: `wordpress/scripts/client-preview-video-capture.sh`
- Modify: `wordpress/scripts/client-preview-video-review.mjs`
- Modify: `wordpress/scripts/tests/client-preview-video-review.test.mjs`

**Artifact contract:** video is 1440×900 and 15–180 seconds, begins with a nonblank Rosa slate, and contains ordered client-facing lower-third labels for `Home`, `About`, `Contact`, `Shop`, `Arabic`, and `Mobile navigation`. Each label uses a distinct predefined narrow brand-color key bar. The reviewer samples frames from the actual WebM and proves all six key colors occur in order; it also exports one-second review frames. Labels are presentation overlays, not debug UI.

1. Add RED pure tests for the ordered marker palette and detection state machine, including missing/out-of-order failure. Keep existing duration/dimension/opening assertions.
2. Inject a tasteful temporary lower-third before each walkthrough phase, with translated Arabic label where appropriate and deterministic key bar. Extend the actual video reviewer to sample the label region at 4 Hz and verify the six marker colors in order.
3. Generate the video, run the reviewer, and inspect every exported review frame for loading glitches, placeholders, false claims, broken UI, language switching, and mobile drawer behavior.
4. Commit as `test(wordpress): prove preview video walkthrough scenes`.

## Task 12: Full verification, independent review, evidence, and push

**Files:**
- Modify: `docs/superpowers/completions/2026-08-30-wordpress-client-preview-medicashop-recreation.md`
- Modify implementation/tests only for review findings.

1. Run all PHP, Bash, and Node syntax checks plus every test under `wordpress/scripts/tests/` in the same invocation/order documented by the completion record.
2. Export the four required business values and run, with explicit success chaining: runtime verify → 32 target capture → 64 Rosa capture → visual compare → video capture/review.
3. Perform final manual review of all target/Rosa contact sheets, all Arabic screenshots, accessibility evidence, and every video review frame.
4. Request independent code/spec review. Repair every critical or important finding using the RED/GREEN workflow and focused commits, then rerun the complete gate.
5. Rewrite the completion record with branch, exact HEAD, commands/results, runtime status, 32/64 matrix status, visual observations, accessibility/RTL status, video path, independent-review result, intentional Single Product limitation, and confirmation that production/Hostinger/DNS/Cloudflare were untouched.
6. Run `git status --short`; verify `apps/web/next-env.d.ts`, `.superpowers/`, and `output.txt` remain unstaged/uncommitted. Stage only the completion document, commit `docs(wordpress): record corrected client preview evidence`, and rerun the completion-document contract if present.
7. Push only `wordpress/client-preview-medicashop-recreation` to `origin`. Confirm remote HEAD equals local HEAD. Do not merge.

## Final Verification Command Set

```bash
export ROSA_PREVIEW_PHONE='+966 59 720 4394'
export ROSA_PREVIEW_EMAIL='info@rosamedical.org'
export ROSA_PREVIEW_ADDRESS='King Fahd Road, Al Olaya, Riyadh 12214, Saudi Arabia'
export ROSA_PREVIEW_ADDRESS_AR='طريق الملك فهد، العليا، الرياض 12214، المملكة العربية السعودية'

bash wordpress/scripts/client-preview-runtime-verify.sh && \
bash wordpress/scripts/client-preview-reference-capture.sh && \
bash wordpress/scripts/client-preview-responsive-capture.sh && \
node wordpress/scripts/client-preview-visual-compare.mjs && \
bash wordpress/scripts/client-preview-video-capture.sh
```

Expected final state: source/pure/browser/runtime gates pass; 32 live captures and 64 bilingual Rosa captures exist and have been visually reviewed; the video and ordered scene proof pass; independent review has no unresolved critical or important finding; only the explicitly preserved unrelated workspace changes remain outside the branch commits.
