# Rosa Medical Phase 3B — Standalone Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to execute this plan. Every production/data correction must follow RED → minimal correction → GREEN → neighboring regressions → selective recapture before the next defect.

**Goal:** Correct only the four approved Phase 3 standalone defects `P3-001` through `P3-004`, preserve all protected structures from the Phase 3A audit, and produce selective post-fix evidence for every affected route/viewport without returning to historical overlay/pixel-diff acceptance.

**Architecture:** Phase 3B is four independent TDD batches executed in severity order. Product Detail responsive geometry stays in the Product Detail presentation stylesheet; Woo-owned product copy stays in the foundation/Woo data path; Contact and About rhythm corrections stay in the narrowest existing page-specific selectors. Existing historical “fidelity” tests remain neighboring topology protections only. Where an old exact-height assertion encodes a defect that Phase 3A explicitly rejected, replace only that obsolete assertion with the approved standalone behavior rather than preserving bad geometry.

**Tech Stack:** WordPress, Elementor Free, WooCommerce, Bash, Node.js 24, Playwright, Rosa child-theme CSS/templates, existing local Docker/WP-CLI runtime.

**Authority:**
- Design/finalization spec: `docs/superpowers/specs/2026-09-07-client-handoff-finalization-design.md`
- Approved visual audit: `docs/superpowers/reports/2026-09-07-phase3-standalone-visual-audit.md`
- Phase 3B baseline: `5129321fd710e4a0aee9dd53a193959bc953ed73`

---

## Global constraints

- Working branch: `wordpress/client-content-controls`.
- Start from `5129321fd710e4a0aee9dd53a193959bc953ed73` or a clean fast-forward descendant.
- No production/Hostinger deployment, production Woo mutation, DNS work, live database mutation, attachment deletion, broad Elementor reseed, merge, rebase, reset, or force push is authorized.
- All runtime mutations in this plan are local only. `foundation-seed.sh` remains the reproducible owner for the local representative Woo fixture.
- Elementor Free continues to own Home/About/Contact EN+AR body content and media.
- WooCommerce remains the source of truth for product/family/SKU/configuration/description data.
- The child theme owns shell, responsive layout, RTL and presentation.
- No public prices, checkout, stock, ratings, shipping or ecommerce flows may be introduced.
- Home and Shop are fully protected. Do not edit them for Phase 3B.
- About is protected except `P3-004`; Contact except `P3-003`; Product Detail except `P3-001` and `P3-002`.
- Do not use historical screenshots, overlays, pixel-diff thresholds, or frozen full-page height matching as the acceptance target.
- Do not commit screenshot PNGs or ZIPs. Runtime evidence stays under `wordpress/.client-preview-artifacts/`.
- If a focused RED fails for a reason different from the approved defect, stop and debug that failure before production changes.

## File map

**P3-001 — Product Detail 768px layout**
- Modify test: `wordpress/scripts/tests/live-product-detail-layout.test.mjs`
- Modify production CSS: `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css`

**P3-002 — Public foundation-fixture wording**
- Modify verification contract: `wordpress/scripts/foundation-product-verify.sh`
- Modify local fixture seed: `wordpress/scripts/foundation-seed.sh`
- Do **not** hard-code replacement product copy in the theme.

**P3-003 — Contact dead-space band**
- Create focused test: `wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs`
- Modify production CSS: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`

**P3-004 — About mobile Who/stats gap**
- Modify focused neighboring test: `wordpress/scripts/tests/live-about-fidelity.test.mjs`
- Modify production CSS: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`
- Do not touch `about-live-visual-recovery.css` unless source inspection proves a specificity conflict after the RED is established.

**Evidence only**
- Reuse: `wordpress/scripts/client-preview-capture.mjs`
- Write post-fix screenshots to: `wordpress/.client-preview-artifacts/handoff-phase3b/`

---

## Task 0: Reground and protect the approved baseline

- [ ] **Step 1: Confirm branch/worktree state before implementation**

```bash
git pull --ff-only
git branch --show-current
git status --short
git rev-parse HEAD
```

Required:
- branch is `wordpress/client-content-controls`;
- working tree has no unrelated changes;
- HEAD is `5129321...` or a known fast-forward descendant.

If `git pull --ff-only` fails or history diverges, stop and inspect; do not rebase/reset.

- [ ] **Step 2: Reconfirm the global pre-polish runtime gates**

```bash
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
```

Expected before Phase 3B mutations: all GREEN. These commands do not prove the four known standalone visual defects are absent; the focused RED contracts below intentionally expose them.

---

# Batch 1 — P3-001: Product Detail description/configuration collision at 768px

## Task 1.1: Extend the existing Product Detail layout test to reproduce the exact defect

**Files:**
- Modify: `wordpress/scripts/tests/live-product-detail-layout.test.mjs`

The current test protects `1440x900`, `1024x768`, and `390x844`, but it does not exercise the audited `768x1024` failure. Preserve those existing cases.

- [ ] **Step 1: Make `load()` and overflow assertions path-aware**

Change the helper signature so the same browser test can explicitly exercise both product routes:

```js
async function load(viewport, path = productPath) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60_000 });
  assert.ok(response?.ok(), `${path} returned ${response?.status() ?? 'no response'}`);
  await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
  await settlePageMedia(page, { scrollDelayMs: 10 });
  await page.evaluate(() => window.scrollTo(0, 0));
  return page;
}
```

Update horizontal-overflow error labels to receive `path` rather than relying only on the original global product path.

- [ ] **Step 2: Add exact rectangle-overlap helpers**

```js
function overlaps(a, b, tolerance = 1) {
  return !(
    a.x + a.width <= b.x + tolerance
    || b.x + b.width <= a.x + tolerance
    || a.y + a.height <= b.y + tolerance
    || b.y + b.height <= a.y + tolerance
  );
}

function containedBy(inner, outer, tolerance = 1) {
  return inner.x >= outer.x - tolerance
    && inner.y >= outer.y - tolerance
    && inner.x + inner.width <= outer.x + outer.width + tolerance
    && inner.y + inner.height <= outer.y + outer.height + tolerance;
}
```

- [ ] **Step 3: Add the exact 768x1024 EN+AR RED assertion**

Add a function such as:

```js
async function assertNarrowTabletDescription(page, path) {
  const section = await box(page, '[data-preview-product-configurations]');
  const description = await box(page, '.rosa-product-detail__description');
  const media = await box(page, '[data-preview-product-description-media]');
  const list = await box(page, '.rosa-product-detail__configuration-list');

  assert.equal(overlaps(media, description), false,
    `${path} 768px description media must not overlap description copy`);
  assert.equal(overlaps(media, list), false,
    `${path} 768px description media must not overlap configuration cards`);

  const cards = await page.locator('.rosa-product-detail__configuration').evaluateAll((elements) =>
    elements.filter((element) => element.checkVisibility()).map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }));

  assert.ok(cards.length >= 2, `${path} must retain the verified configurations`);
  for (const card of cards) {
    assert.ok(containedBy(card, section), `${path} 768px configuration card must stay inside its section`);
  }
}
```

Then run this assertion at `{ width: 768, height: 1024 }` for:

```js
[
  '/product/rosa-foundation-stevens-scissors-regular/',
  '/ar/product/rosa-foundation-stevens-scissors-regular/',
]
```

Also call the existing mobile/stacking and horizontal-overflow checks where applicable. Do not remove the existing 1440/1024/390 protections.

- [ ] **Step 4: Run and observe RED**

```bash
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
```

Expected: FAIL on a `768px description media must not overlap ...` or equivalent containment assertion for the approved P3-001 defect. A different failure must be debugged before continuing.

- [ ] **Step 5: Commit the RED contract**

```bash
git add wordpress/scripts/tests/live-product-detail-layout.test.mjs
git commit -m "test(wordpress): expose Product Detail 768px collision"
```

## Task 1.2: Apply the smallest Product Detail CSS correction

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css`

**Root cause already supported by source:** the Product Detail switches its general topology at `63.9375rem`, but the safe single-column description/configuration treatment begins only below `47.9375rem`. A 768px viewport equals 48rem, leaving it in the narrow two-column description regime.

- [ ] **Step 1: Do not broaden the entire mobile Product Detail block**

Do **not** simply change every `@media (max-width: 47.9375rem)` Product Detail rule to `48rem`; that would alter unrelated gallery, CTA, support and related-product behavior at 768px.

- [ ] **Step 2: Extend only the description/configuration sub-layout through 48rem**

Add a narrow rule after the existing responsive blocks:

```css
@media (max-width: 48rem) {
  .rosa-product-detail__description-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .rosa-product-detail__description-media {
    min-height: 0;
    aspect-ratio: 1.25 / 1;
  }

  .rosa-product-detail__description-content { display: contents; }
  .rosa-product-detail__description { order: -1; }

  .rosa-product-detail__configuration-list {
    grid-template-columns: 1fr;
    margin-block-start: .5rem;
  }

  .rosa-product-detail__configuration {
    grid-template-columns: 1fr;
    gap: .8rem;
    padding: 1rem;
  }
}
```

This intentionally duplicates only the already-approved mobile description/configuration behavior. At widths below 768px it produces no material new behavior; at exactly 768px it closes the one-pixel breakpoint gap proven by the audit.

If runtime measurement proves the collision extends above 768px, stop and record the actual first safe width before choosing a wider breakpoint. Do not guess from the 768/1024 screenshots.

- [ ] **Step 3: Run focused GREEN**

```bash
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
```

Expected: PASS, including EN+AR 768 assertions and the pre-existing 1440/1024/390 cases.

- [ ] **Step 4: Run neighboring Product Detail/global regressions**

```bash
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

All must be GREEN before recapture.

- [ ] **Step 5: Selectively recapture only the two P3-001 cells**

```bash
OUT=wordpress/.client-preview-artifacts/handoff-phase3b/P3-001
mkdir -p "$OUT"
node wordpress/scripts/client-preview-capture.mjs \
  http://localhost:8088/product/rosa-foundation-stevens-scissors-regular/ \
  "$OUT/en-product-768x1024.png" 768 1024
node wordpress/scripts/client-preview-capture.mjs \
  http://localhost:8088/ar/product/rosa-foundation-stevens-scissors-regular/ \
  "$OUT/ar-product-768x1024.png" 768 1024
```

Review both standalone: description must lead cleanly, media/configurations must not collide, and no new horizontal overflow may appear.

- [ ] **Step 6: Commit the focused fix**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css
git commit -m "fix(wordpress): stabilize Product Detail at 768px"
```

Do not proceed to P3-002 unless the focused test, neighboring regressions and both recaptures are accepted.

---

# Batch 2 — P3-002: Internal foundation-fixture wording exposed publicly

## Task 2.1: Strengthen the foundation verification contract first

**Files:**
- Modify: `wordpress/scripts/foundation-product-verify.sh`

Do not create a theme-level text override. The defect originates in Woo fixture data and must remain owned there.

- [ ] **Step 1: Add a Woo-description contract**

After resolving `$product_id`, read the product description through Woo/WP-CLI and assert:

```bash
description="$(wp eval "echo wc_get_product(${product_id})->get_description();")"
[[ -n "$description" ]] || fail 'fixture product description must not be empty'
[[ "$description" != *'Foundation-gate fixture'* ]] \
  || fail 'public product description exposes internal foundation-fixture wording'
```

- [ ] **Step 2: Extend rendered verification to both EN and AR routes**

Preserve the existing EN product checks for product name, exact SKUs and Straight/Curved configurations. Add:

```bash
[[ "$html" != *'Foundation-gate fixture'* ]] \
  || fail 'English product detail exposes internal foundation-fixture wording'

base_url="$(wp option get home)"
ar_url="${base_url%/}/ar/product/${slug}/"
ar_html="$(curl -fsS "$ar_url")" || fail "Arabic product detail route did not resolve: $ar_url"
[[ "$ar_html" != *'Foundation-gate fixture'* ]] \
  || fail 'Arabic product detail exposes internal foundation-fixture wording'
[[ "$ar_html" == *'04-0901'* ]] || fail 'Arabic product detail lost SKU 04-0901'
[[ "$ar_html" == *'04-0911'* ]] || fail 'Arabic product detail lost SKU 04-0911'
```

Do not require an Arabic translation of official product nomenclature in this batch; the approved architecture uses one Woo product behind the virtual AR route.

- [ ] **Step 3: Run and observe RED**

```bash
bash wordpress/scripts/foundation-product-verify.sh
```

Expected: FAIL specifically because the existing Woo description contains `Foundation-gate fixture`.

- [ ] **Step 4: Commit the RED contract**

```bash
git add wordpress/scripts/foundation-product-verify.sh
git commit -m "test(wordpress): forbid internal fixture copy on product detail"
```

## Task 2.2: Replace only the unsafe fixture description

**Files:**
- Modify: `wordpress/scripts/foundation-seed.sh`

- [ ] **Step 1: Replace the one internal description string**

Change only:

```php
$product->set_description('Foundation-gate fixture derived from the verified Rosa scissors catalogue.');
```

to concise client-facing copy supported by the already verified fixture facts:

```php
$product->set_description('Stevens Scissors — Regular, available in straight and curved 10.5 cm configurations. Contact Rosa Medical for catalogue and quotation support.');
```

Do not add unverified material, clinical claims, standards, country of origin, specifications, pricing or stock information.

- [ ] **Step 2: Apply the corrected seed to the local runtime only**

```bash
bash wordpress/scripts/foundation-seed.sh
```

This is a local reproducibility step, not production deployment.

- [ ] **Step 3: Run focused GREEN and fixture contracts**

```bash
bash wordpress/scripts/foundation-product-verify.sh
bash wordpress/scripts/tests/foundation-contract.test.sh
bash wordpress/scripts/tests/foundation-verify-contract.test.sh
```

Required: exact product slug/type/family, two variations, directions, size/variant, and SKUs `04-0901`/`04-0911` remain intact while the internal phrase is absent.

- [ ] **Step 4: Run Product Detail and bilingual neighboring regressions**

```bash
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
```

- [ ] **Step 5: Selectively recapture all ten Product Detail cells**

P3-002 affected every Product Detail viewport/locale, so all ten are legitimate selective evidence. The two 768 shots here supersede the P3-001 screenshots as final Product Detail evidence.

```bash
OUT=wordpress/.client-preview-artifacts/handoff-phase3b/P3-002
mkdir -p "$OUT"
for dims in 1440x900 1024x768 768x1024 431x932 390x844; do
  IFS=x read -r width height <<< "$dims"
  node wordpress/scripts/client-preview-capture.mjs \
    http://localhost:8088/product/rosa-foundation-stevens-scissors-regular/ \
    "$OUT/en-product-${dims}.png" "$width" "$height"
  node wordpress/scripts/client-preview-capture.mjs \
    http://localhost:8088/ar/product/rosa-foundation-stevens-scissors-regular/ \
    "$OUT/ar-product-${dims}.png" "$width" "$height"
done
```

Standalone review requirements:
- no `Foundation-gate fixture` wording;
- 768 collision remains corrected;
- configurations/SKUs remain visible;
- no new structural regression at 1440/1024/431/390.

- [ ] **Step 6: Commit the data-path correction**

```bash
git add wordpress/scripts/foundation-seed.sh
git commit -m "fix(wordpress): replace internal foundation product copy"
```

---

# Batch 3 — P3-003: Contact oversized dead-space band

## Task 3.1: Add the standalone Contact rhythm RED contract

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs`

The existing `live-contact-fidelity.test.mjs` protects topology, mailto-only behavior, two-card/stacked composition and no horizontal overflow; it does not encode the obsolete spacer, so keep it as a neighboring test rather than weakening it.

- [ ] **Step 1: Create a five-viewport EN+AR geometry test**

Use the same Playwright import pattern and `settlePageMedia()` helper as the existing browser tests. Exercise:

```js
const routes = ['/contact/', '/ar/contact/'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];
```

For each route/viewport obtain boxes for:

```js
'.rosa-preview-contact__cards'
'.rosa-preview-prefooter'
```

Use the exact standalone acceptance:

```js
const gap = prefooter.y - (cards.y + cards.height);
assert.ok(gap >= -1, `${path} ${viewport.width}px Contact cards must not overlap the procurement CTA`);
assert.ok(gap <= 192,
  `${path} ${viewport.width}px Contact dead space must be <= 192px, received ${Math.round(gap)}px`);
```

Also assert both regions are visible and `documentElement.scrollWidth <= clientWidth + 1`.

- [ ] **Step 2: Run and observe RED**

```bash
node wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs http://localhost:8088/
```

Expected: FAIL on the maximum-gap assertion. Phase 3A measured roughly 394–525px on representative captures.

- [ ] **Step 3: Commit the RED contract**

```bash
git add wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs
git commit -m "test(wordpress): expose Contact handoff dead space"
```

## Task 3.2: Remove only the historical Contact spacer

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`

The source currently keeps legacy/frozen bottom padding of roughly 27–37rem and explicitly describes the historical blank procurement spacer. Phase 3 standalone review supersedes that fidelity target.

- [ ] **Step 1: Normalize only Contact section-end spacing**

Change the base Contact rule from the oversized bottom value to:

```css
.rosa-preview-contact {
  padding-block: clamp(3.25rem, 4.8vw, 4.75rem) clamp(4rem, 6vw, 6rem);
  background: #f6f6f6;
}
```

In the large-desktop Contact media rule, retain the larger `padding-block-start` but remove the obsolete `padding-block-end: clamp(34rem, 39vw, 37rem);` so the normalized base end spacing applies.

In the tablet Contact rule, retain `padding-block-start: 3.5rem` but remove the obsolete `padding-block-end: 27rem`.

In the mobile Contact rule change only the bottom value:

```css
.rosa-preview-contact {
  padding-block: 2.35rem 4rem;
}
```

Update/remove source comments that claim the wide frozen spacer must remain. Do not alter Contact hero, card widths, form controls, channel layout, CTA content, or footer.

- [ ] **Step 2: Run focused GREEN**

```bash
node wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs http://localhost:8088/
```

Expected: all ten route/viewport cases have non-negative gap <=192px.

- [ ] **Step 3: Run Contact/global neighboring regressions**

```bash
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
```

The old Contact test is retained because it protects topology rather than the rejected spacer geometry.

- [ ] **Step 4: Selectively recapture all ten Contact cells**

```bash
OUT=wordpress/.client-preview-artifacts/handoff-phase3b/P3-003
mkdir -p "$OUT"
for dims in 1440x900 1024x768 768x1024 431x932 390x844; do
  IFS=x read -r width height <<< "$dims"
  node wordpress/scripts/client-preview-capture.mjs \
    http://localhost:8088/contact/ \
    "$OUT/en-contact-${dims}.png" "$width" "$height"
  node wordpress/scripts/client-preview-capture.mjs \
    http://localhost:8088/ar/contact/ \
    "$OUT/ar-contact-${dims}.png" "$width" "$height"
done
```

Standalone review requirements:
- cards flow naturally into the procurement CTA;
- no collapsed/negative transition;
- desktop/tablet cards remain side-by-side where already accepted;
- mobile remains stacked;
- form and footer remain intact.

- [ ] **Step 5: Commit the Contact correction**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css
git commit -m "fix(wordpress): remove obsolete Contact handoff spacer"
```

---

# Batch 4 — P3-004: About mobile Who-we-are copy-to-stats gap

## Task 4.1: Replace only obsolete frozen-height assertions with the approved mobile rhythm contract

**Files:**
- Modify: `wordpress/scripts/tests/live-about-fidelity.test.mjs`

This existing test currently asserts full mobile page heights (`5888` at 431 and `6007` at 390) and a `754px` combined Who+stats band. Those exact historical height assertions encode the P3-004 defect and are no longer authoritative. Preserve the unaffected hero/cards/feature/Why/evidence geometry checks.

- [ ] **Step 1: Add a focused mobile Who/stats rhythm helper**

```js
async function assertMobileWhoStatsRhythm(page, path, viewportLabel) {
  const media = await page.locator('[data-preview-who-we-are] .rosa-preview-split__media').first().boundingBox();
  const copy = await page.locator('[data-preview-who-we-are] .rosa-preview-split__grid > div:last-child').first().boundingBox();
  const finalParagraph = await page.locator('[data-preview-who-we-are] .rosa-preview-split__grid > div:last-child > p:last-child').first().boundingBox();
  const stats = await page.locator('[data-preview-stats]').first().boundingBox();
  assert.ok(media && copy && finalParagraph && stats, `${path} ${viewportLabel} Who/stats geometry missing`);

  const gap = stats.y - (finalParagraph.y + finalParagraph.height);
  assert.ok(gap >= -1, `${path} ${viewportLabel} Who copy must not overlap statistics`);
  assert.ok(gap <= 96,
    `${path} ${viewportLabel} Who-to-stats gap must be <= 96px, received ${Math.round(gap)}px`);
  assert.ok(media.y + media.height <= copy.y + 2,
    `${path} ${viewportLabel} Who media must finish before the copy block`);
}
```

- [ ] **Step 2: Replace only stale affected assertions**

For `431x932`:
- remove the exact `documentHeight(...) == 5888±24` assertion;
- call `assertMobileWhoStatsRhythm(...)`;
- retain no-overflow.

For `390x844`:
- remove the exact `documentHeight(...) == 6007±24` assertion;
- remove the exact `combinedHeight(Who, stats) == 754±28` assertion;
- call `assertMobileWhoStatsRhythm(...)`;
- retain the accepted hero, cards, feature, Why Rosa, family/evidence and no-overflow assertions.

Do not alter desktop/tablet assertions.

- [ ] **Step 3: Run and observe RED**

```bash
node wordpress/scripts/tests/live-about-fidelity.test.mjs http://localhost:8088/
```

Expected: FAIL at 431 and/or 390 because current copy-to-stats gap is approximately 200px. A desktop/tablet failure is not the approved RED and must be investigated separately.

- [ ] **Step 4: Commit the revised RED contract**

```bash
git add wordpress/scripts/tests/live-about-fidelity.test.mjs
git commit -m "test(wordpress): define standalone About mobile rhythm"
```

## Task 4.2: Remove the mobile-only fixed-height remainder

**Files:**
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`

- [ ] **Step 1: Change only the mobile Who section height behavior**

Inside the existing `@media (max-width: 47.9375rem)` block, change:

```css
.rosa-preview-split[data-preview-who-we-are] {
  height: 754px;
  align-items: start;
  padding-block: 58px 34px;
}
```

to:

```css
.rosa-preview-split[data-preview-who-we-are] {
  height: auto;
  min-height: 0;
  align-items: start;
  padding-block: 58px 34px;
}
```

Do not change the 200px mobile media block, 28px copy padding, statistics component, About card heights, feature banner, Why Rosa layout, evidence surface, or RTL ordering unless the focused GREEN proves another concrete defect.

- [ ] **Step 2: Run focused GREEN**

```bash
node wordpress/scripts/tests/live-about-fidelity.test.mjs http://localhost:8088/
```

Expected: 431/390 EN+AR copy-to-stats gap <=96px and all protected About geometry assertions remain GREEN.

- [ ] **Step 3: Run About/global neighboring regressions**

```bash
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
```

- [ ] **Step 4: Selectively recapture only the four P3-004 cells**

```bash
OUT=wordpress/.client-preview-artifacts/handoff-phase3b/P3-004
mkdir -p "$OUT"
for dims in 431x932 390x844; do
  IFS=x read -r width height <<< "$dims"
  node wordpress/scripts/client-preview-capture.mjs \
    http://localhost:8088/about/ \
    "$OUT/en-about-${dims}.png" "$width" "$height"
  node wordpress/scripts/client-preview-capture.mjs \
    http://localhost:8088/ar/about/ \
    "$OUT/ar-about-${dims}.png" "$width" "$height"
done
```

Standalone review requirements:
- no large empty band after Who copy;
- media → copy → stats remain visually ordered;
- stats do not collide with copy;
- Arabic remains correctly mirrored/aligned;
- following About cards start normally.

- [ ] **Step 5: Commit the About correction**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css
git commit -m "fix(wordpress): tighten About mobile Who rhythm"
```

---

# Task 5 — Phase 3B integrated verification and evidence closeout

Phase 3B is not complete merely because each focused test turned GREEN. Run the integrated gate after all four fixes are on the same branch state.

- [ ] **Step 1: Run all four focused contracts at final HEAD**

```bash
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/client-handoff-contact-rhythm.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-about-fidelity.test.mjs http://localhost:8088/
```

- [ ] **Step 2: Run the primary handoff regressions**

```bash
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs http://localhost:8088/
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-seed-contract.test.sh
bash wordpress/scripts/tests/client-handoff-neutral-media-slot.test.sh
```

- [ ] **Step 3: Run affected-surface neighboring contracts**

```bash
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
bash wordpress/scripts/tests/client-handoff-standalone-capture.test.sh
```

If `client-preview-content-zero-drift.test.sh` fails because it intentionally snapshots the old foundation fixture copy, inspect its scope before modifying it; do not weaken an unrelated content-ownership invariant. If it does not cover Woo product copy, it must remain GREEN unchanged.

- [ ] **Step 4: Independently verify the final selective evidence set**

Batch-local expected PNG counts:

```bash
find wordpress/.client-preview-artifacts/handoff-phase3b/P3-001 -maxdepth 1 -name '*.png' -type f | wc -l
find wordpress/.client-preview-artifacts/handoff-phase3b/P3-002 -maxdepth 1 -name '*.png' -type f | wc -l
find wordpress/.client-preview-artifacts/handoff-phase3b/P3-003 -maxdepth 1 -name '*.png' -type f | wc -l
find wordpress/.client-preview-artifacts/handoff-phase3b/P3-004 -maxdepth 1 -name '*.png' -type f | wc -l
```

Expected:

```text
2
10
10
4
```

There are 26 batch-local captures because the two 768 Product Detail cells are deliberately captured once after P3-001 and again after P3-002. The final unique corrected Phase 3A matrix cells are **24**: 10 Product Detail + 10 Contact + 4 About. Home/Shop and unaffected About cells do not need needless recapture because their structures were protected and no shared unscoped selector is changed.

- [ ] **Step 5: Review final corrected evidence standalone**

Final authority for corrected cells:
- Product Detail: use `P3-002/*` as final evidence for all ten Product cells; verify P3-001 remains fixed at the two 768 shots.
- Contact: use `P3-003/*` for all ten Contact cells.
- About: use `P3-004/*` for the four mobile About cells.

No overlays or historical reference matching.

- [ ] **Step 6: Record final repository state**

```bash
git status --short
git log --oneline --decorate -12
```

Required: no uncommitted implementation files; screenshot artifacts remain ignored/uncommitted.

---

## Phase 3B completion gate

Phase 3B can be signed off only when all of the following are true:

1. `P3-001`: EN+AR `768x1024` Product Detail geometry contract is GREEN and standalone recapture shows no collision.
2. `P3-002`: Woo description is non-empty, contains no `Foundation-gate fixture` wording, exact verified configurations/SKUs remain intact, and all ten Product Detail recaptures are clean.
3. `P3-003`: Contact card-to-prefooter gap is `0..192px` at all ten EN/AR handoff cells, existing Contact topology remains GREEN, and all ten recaptures show normal section continuity.
4. `P3-004`: About Who-copy-to-stats gap is `0..96px` at 431/390 EN+AR, protected About sections remain GREEN, and four recaptures show no collision or artificial dead band.
5. Global health, accessibility/RTL/console, safe rendered media, content ownership, seed and neutral-placeholder gates remain GREEN at final HEAD.
6. No Home or Shop production files were changed for Phase 3B.
7. No production/Hostinger mutation occurred.

After this gate, Phase 3B is ready for final client-handoff verification/documentation. Do not merge or deploy as part of this plan.