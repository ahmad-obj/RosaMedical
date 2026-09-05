# Rosa Medical Exact Elementor Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish converting the approved Rosa/MedicaShop-derived WordPress site into a genuinely Elementor Free-editable bilingual site while keeping Home, About, Contact, Shop, shared shell, and supported catalogue surfaces visually faithful to the finished Rosa implementation and preserving WooCommerce/settings ownership.

**Architecture:** Keep the pinned finished Rosa branch at `d0726eed34b4fc14267570853ade8b74df49ae9e` as the primary visual/source reference and run it as an isolated local reference runtime when visual diagnosis is required. Elementor remains only the editing interface for Home/About/Contact body content: custom Rosa widgets delegate to the existing theme partials and target CSS/RTL/JS. WooCommerce owns catalogue truth, Rosa settings own shared business/site values, and visual repairs must be root-cause fixes backed by RED→GREEN tests rather than new redesign CSS.

**Tech Stack:** WordPress/PHP 8+, Hello Elementor, Elementor Free, WooCommerce, Bash/WP-CLI, Docker Compose, vanilla CSS/JS, Playwright through `apps/web`, Git worktrees for isolated reference execution.

**Spec:** `docs/superpowers/specs/2026-09-05-rosa-wordpress-exact-elementor-parity-master-design.md`

## Global Constraints

- Working branch: `wordpress/client-content-controls`.
- Remote branch baseline when this plan was written: `e39e48781ee27ba2d6730c58903de9ddc0b0a7f0`.
- Pinned finished-template source: `wordpress/client-preview-medicashop-recreation` at `d0726eed34b4fc14267570853ade8b74df49ae9e`.
- Do not use `apps/web/**` as visual authority for this conversion.
- Do not redesign the site.
- Elementor Free owns EN/AR Home, About, and Contact body copy/media only.
- Theme/code owns announcement, header, footer, navigation, responsive/RTL behavior, shared pre-footer CTA structure, and Woo presentation.
- WooCommerce remains sole truth for products, categories/families, product media, SKUs, attributes/configurations, descriptions, publish state, and future pricing.
- Rosa centralized settings remain sole truth for phone, email, address, Arabic address, WhatsApp, and shared Site/CTA values.
- Do not serialize Woo product records or shared business data into Elementor documents.
- No Elementor Pro.
- No public checkout/payment/cart behavior.
- No new Contact backend; Contact remains presentation/mailto oriented.
- No routine use of `elementor-authoring-seed.sh --force`.
- Do not weaken historical geometry, accessibility, overflow, RTL, or interaction assertions to make a defect pass.
- Required visual viewports: 1440×900, 1280×800, 1024×768, 768×1024, 431×932, 390×844, 360×800; retain 1920/2560 where existing capture already supports them.
- Preserve `rosa-elementor-root` full-width/zero-gap/zero-padding/non-wrapping safeguards.
- Do not delete/stash/overwrite local untracked secondary-page work before inspecting it.
- Do not merge or delete the branch during this plan.
- Hostinger/production is out of scope until a separate explicit deployment approval.

---

## File Structure

### Existing production files to modify only when a failing test proves the need

- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css` — route-specific RTL corrections only.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css` — Elementor wrapper neutralization only.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php` — shared About/Contact hero renderer.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-stats.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-feature.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-why.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-layout.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-map.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/cta-banner.php`
- `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php`
- `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/BusinessSettings.php`

### Existing tests/tooling to strengthen

- `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- `wordpress/scripts/tests/client-preview-about-contract.test.sh`
- `wordpress/scripts/tests/client-preview-contact-contract.test.sh`
- `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- `wordpress/scripts/tests/client-preview-admin-contract.test.sh`
- `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- `wordpress/scripts/tests/client-preview-content-mutation.test.sh`
- `wordpress/scripts/tests/client-preview-content-zero-drift.test.sh`
- `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`
- `wordpress/scripts/client-preview-runtime-verify.sh`
- `wordpress/scripts/medicashop-elementor-parity-capture.mjs`

### Local untracked work that must be inspected before competing edits

The prior operator reported these local files; GitHub does not prove their current contents:

```text
docs/superpowers/plans/2026-09-01-rosa-wordpress-medicashop-secondary-pages-fidelity-implementation.md
docs/superpowers/reports/2026-09-01-medicashop-secondary-pages-visual-forensics.md
wordpress/scripts/tests/client-preview-inquiry-contract.test.sh
wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs
wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-evidence.php
wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-proof.php
wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-why.php
wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php
wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-products.php
```

If any exist, preserve them, read them completely, and either adopt them deliberately or leave them untouched. Never replace them merely because a tracked plan proposes a similarly named file.

---

### Task 0: Freeze the Execution Baseline and Protect Local Work

**Files:**
- Inspect only: repository state and the local untracked files listed above.
- Create local-only evidence directory: `artifacts/exact-elementor-parity/preflight/`.

**Interfaces:**
- Consumes: branch `wordpress/client-content-controls` and remote baseline `e39e48781ee27ba2d6730c58903de9ddc0b0a7f0`.
- Produces: a trusted execution-state report and an inventory of local work that later tasks must preserve.

- [ ] **Step 1: Record repository identity and dirty state without changing anything**

Run:

```bash
mkdir -p artifacts/exact-elementor-parity/preflight
{
  printf 'HEAD='; git rev-parse HEAD
  printf 'BRANCH='; git branch --show-current
  printf '\nSTATUS\n'; git status --short
  printf '\nREMOTE\n'; git ls-remote origin refs/heads/wordpress/client-content-controls
} | tee artifacts/exact-elementor-parity/preflight/repository-state.txt
```

Expected: branch is `wordpress/client-content-controls`. If local HEAD is not the current remote HEAD, record the difference; do not reset/rebase/stash automatically.

- [ ] **Step 2: Read every known local secondary-page artifact before touching the same area**

Run:

```bash
for file in \
  docs/superpowers/plans/2026-09-01-rosa-wordpress-medicashop-secondary-pages-fidelity-implementation.md \
  docs/superpowers/reports/2026-09-01-medicashop-secondary-pages-visual-forensics.md \
  wordpress/scripts/tests/client-preview-inquiry-contract.test.sh \
  wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-evidence.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-proof.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-why.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-products.php; do
  if [[ -f "$file" ]]; then
    printf '\n===== %s =====\n' "$file"
    sed -n '1,320p' "$file"
  fi
done | tee artifacts/exact-elementor-parity/preflight/local-secondary-work.txt
```

Expected: no file is modified. Before Task 2, write a short local note stating which untracked artifacts contain reusable evidence/code.

- [ ] **Step 3: Confirm the pinned reference commit exists locally**

Run:

```bash
git cat-file -e d0726eed34b4fc14267570853ade8b74df49ae9e^{commit}
```

Expected: exit 0. If absent, fetch the named branch/commit without changing the working branch.

- [ ] **Step 4: Commit nothing**

This task is deliberately read-only.

---

### Task 1: Close the Existing Arabic Home Who-Section RTL RED→GREEN Boundary

**Files:**
- Test already present: `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`

**Interfaces:**
- Consumes: existing `assertRtlHomeWhoPadding(page, width, expectedInlineEnd)` test.
- Produces: Home Who copy spacing mirrored logically in Arabic: desktop inline-end 74px, tablet 42px, mobile 0.

- [ ] **Step 1: Prepare the local runtime without force-reseeding edited documents**

Run:

```bash
bash wordpress/scripts/foundation-bootstrap.sh
bash wordpress/scripts/client-preview-seed.sh
bash wordpress/scripts/foundation-seed.sh
bash wordpress/scripts/elementor-authoring-seed.sh
```

Do not retry with `--force` if the seed script reports `home_parity_manual_required`.

- [ ] **Step 2: Observe RED before changing production CSS**

Run:

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected: FAIL on Arabic Home `.rosa-preview-who__copy` physical padding at 1440 and/or 1024. Record the exact assertion output.

- [ ] **Step 3: Apply the minimum Home-specific RTL correction**

Append to `client-preview-rtl.css` after the existing About RTL rule:

```css
html[dir="rtl"] [data-home-section="who"] .rosa-preview-who__copy {
  padding-inline-start: 0;
  padding-inline-end: 74px;
}

@media (max-width: 64rem) {
  html[dir="rtl"] [data-home-section="who"] .rosa-preview-who__copy {
    padding-inline-end: 42px;
  }
}

@media (max-width: 47.9375rem) {
  html[dir="rtl"] [data-home-section="who"] .rosa-preview-who__copy {
    padding-inline-end: 0;
  }
}
```

Do not modify `client-preview.css`; its hash is pinned to the finished target.

- [ ] **Step 4: Verify focused GREEN**

Run:

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 5: Run the broader verifier**

Run:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected final line:

```text
PASS: Rosa WordPress runtime matches the finished template with Elementor authoring, bilingual routes, editable content and catalogue regressions intact
```

- [ ] **Step 6: Refresh Home visual evidence**

Run:

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/home-after-rtl
```

Inspect EN/AR 1440, 1024, and 390 full-page captures. Freeze Home after this task unless later direct evidence proves a new defect.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css
git commit -m "fix(wordpress): mirror Home Who spacing in Arabic"
```

---

### Task 2: Build Deterministic Secondary-Page Reference/Local Parity Tooling

**Files:**
- Modify: `wordpress/scripts/medicashop-elementor-parity-capture.mjs`
- Adopt/modify after Task 0 inspection: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Modify: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`

**Interfaces:**
- Consumes: reference base URL, local base URL, Playwright.
- Produces: deterministic screenshots + geometry/style JSON for Home/About/Contact/Shop EN/AR and a reusable target/local browser comparison test.

- [ ] **Step 1: Extend capture route definitions**

Replace the Home-only locale list with:

```js
const routes = [
  { name: 'en-home', path: '/', kind: 'home' },
  { name: 'ar-home', path: '/ar/', kind: 'home' },
  { name: 'en-about', path: '/about/', kind: 'about' },
  { name: 'ar-about', path: '/ar/about/', kind: 'about' },
  { name: 'en-contact', path: '/contact/', kind: 'contact' },
  { name: 'ar-contact', path: '/ar/contact/', kind: 'contact' },
  { name: 'en-shop', path: '/shop/', kind: 'shop' },
  { name: 'ar-shop', path: '/ar/shop/', kind: 'shop' },
];
```

Keep the existing seven required viewports.

- [ ] **Step 2: Record route-specific section boxes and computed styles**

Add:

```js
const selectorsByKind = {
  home: [
    '.rosa-preview-announcement', '.rosa-preview-header',
    '[data-home-section="hero"]', '[data-home-section="who"]',
    '[data-home-section="featured"]', '[data-home-section="feature"]',
    '[data-home-section="latest"]', '[data-home-section="promos"]',
    '[data-home-section="why"]', '[data-home-section="proof"]',
    '[data-home-section="evidence"]', '.rosa-preview-prefooter',
    '[data-rosa-preview-footer]',
  ],
  about: [
    '.rosa-preview-announcement', '.rosa-preview-header',
    '[data-preview-page-hero]', '[data-preview-who-we-are]',
    '[data-preview-stats]', '[data-preview-about-cards]',
    '[data-preview-feature-banner]', '[data-preview-why-us]',
    '[data-preview-family-strip]', '.rosa-preview-prefooter',
    '[data-rosa-preview-footer]',
  ],
  contact: [
    '.rosa-preview-announcement', '.rosa-preview-header',
    '[data-preview-page-hero]', '[data-preview-contact-layout]',
    '[data-preview-map-role]', '.rosa-preview-prefooter',
    '[data-rosa-preview-footer]',
  ],
  shop: [
    '.rosa-preview-announcement', '.rosa-preview-header',
    '[data-preview-shop-hero]', '.rosa-preview-shop-search',
    '.rosa-preview-shop-grid', '.rosa-preview-pagination',
    '.rosa-preview-prefooter', '[data-rosa-preview-footer]',
  ],
};
```

For each selector that exists, store:

```js
{
  x, y, width, height,
  display,
  gridTemplateColumns,
  paddingTop, paddingRight, paddingBottom, paddingLeft,
  marginTop, marginRight, marginBottom, marginLeft,
  fontSize, lineHeight,
  backgroundColor,
  borderRadius,
}
```

- [ ] **Step 3: Make screenshots and JSON deterministic**

Use stems such as:

```text
reference/en-about-1440x900-full.png
reference/en-about-1440x900-metrics.json
local/en-about-1440x900-full.png
local/en-about-1440x900-metrics.json
```

Fail capture if visible images are broken or navigation fails.

- [ ] **Step 4: Track the secondary comparison test**

The test must accept:

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  http://localhost:8090/ \
  http://localhost:8088/
```

Use these tolerances:

```js
const tolerance = {
  position: 2,
  size: 2,
  font: 0.6,
  spacing: 1,
};
```

For every compared selector, print the route, viewport, selector, target value, and current value in the assertion failure. Do not widen tolerances to hide a known mismatch.

- [ ] **Step 5: Strengthen the tooling contract**

Add these source assertions to `client-preview-runtime-tooling.test.sh`:

```bash
grep -Fq "'/about/'" "$PARITY_CAPTURE" || fail 'About parity capture missing'
grep -Fq "'/ar/about/'" "$PARITY_CAPTURE" || fail 'Arabic About parity capture missing'
grep -Fq "'/contact/'" "$PARITY_CAPTURE" || fail 'Contact parity capture missing'
grep -Fq "'/ar/contact/'" "$PARITY_CAPTURE" || fail 'Arabic Contact parity capture missing'
grep -Fq "'/shop/'" "$PARITY_CAPTURE" || fail 'Shop parity capture missing'
grep -Fq "'/ar/shop/'" "$PARITY_CAPTURE" || fail 'Arabic Shop parity capture missing'
[[ -f "$ROOT/wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs" ]] || fail 'secondary fidelity test missing'
```

- [ ] **Step 6: Run syntax/tooling verification**

Run:

```bash
node --check wordpress/scripts/medicashop-elementor-parity-capture.mjs
node --check wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
```

Expected: PASS.

- [ ] **Step 7: Commit tooling only**

```bash
git add wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
git commit -m "test(wordpress): add secondary-page parity diagnostics"
```

---

### Task 3: Run the Pinned Finished Branch as an Isolated Local Reference

**Files:**
- No tracked production files.
- Create a detached reference worktree selected by `superpowers:using-git-worktrees`.
- Local-only `wordpress/dev/.env` in that worktree.

**Interfaces:**
- Consumes: pinned commit `d0726eed34b4fc14267570853ade8b74df49ae9e`.
- Produces: deterministic finished-template reference at `http://localhost:8090/`.

- [ ] **Step 1: Invoke the worktree skill before creating the checkout**

Use `superpowers:using-git-worktrees`. Then create a detached worktree equivalent to:

```bash
git worktree add --detach <reference-worktree> d0726eed34b4fc14267570853ade8b74df49ae9e
```

- [ ] **Step 2: Configure an isolated port/project**

Inside the reference worktree:

```bash
cp wordpress/dev/.env.example wordpress/dev/.env
cat >> wordpress/dev/.env <<'EOF'
ROSA_WP_PORT=8090
COMPOSE_PROJECT_NAME=rosa-medicashop-target
EOF
```

- [ ] **Step 3: Bootstrap and seed reference data**

Run:

```bash
COMPOSE_PROJECT_NAME=rosa-medicashop-target ROSA_WP_PORT=8090 bash wordpress/scripts/foundation-bootstrap.sh
COMPOSE_PROJECT_NAME=rosa-medicashop-target ROSA_WP_PORT=8090 bash wordpress/scripts/client-preview-seed.sh
COMPOSE_PROJECT_NAME=rosa-medicashop-target ROSA_WP_PORT=8090 bash wordpress/scripts/foundation-seed.sh
```

Use the same safe local business-setting inputs for current/reference if explicit values are needed for matched content.

- [ ] **Step 4: Smoke-check reference routes**

Run:

```bash
for path in / /about/ /contact/ /shop/ /ar/ /ar/about/ /ar/contact/ /ar/shop/; do
  curl -fsS "http://localhost:8090${path}" >/dev/null || exit 1
done
```

Expected: all return success.

- [ ] **Step 5: Capture target/current baseline evidence**

From the implementation worktree:

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  http://localhost:8090/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/secondary/baseline
```

Then capture production only as confirmation:

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/secondary/production-confirmation
```

If production differs materially from the pinned target, log the route/selector discrepancy. Do not silently change authority.

- [ ] **Step 6: Commit nothing**

Reference runtime and screenshot artifacts are local evidence.

---

### Task 4: Audit and Repair EN/AR About by Root Cause

**Files:**
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Test: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- Modify according to diagnosed source: `page-hero.php`, `about-who.php`, `about-stats.php`, `about-cards.php`, `about-feature.php`, `about-why.php`, `about-proof.php`, `elementor-authoring.css`, `client-preview-rtl.css`, `AboutWidgets.php`, `ElementorSeedData.php`.

**Interfaces:**
- Consumes: pinned About runtime at 8090 and existing seven-widget About topology.
- Produces: EN/AR About that matches the finished target while remaining Elementor editable.

- [ ] **Step 1: Run the About comparison and observe RED**

Run:

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Record the first About failure including route, viewport, selector, target/current values.

- [ ] **Step 2: Verify topology before any styling change**

Run:

```bash
for path in about ar/about; do
  curl -fsS "http://localhost:8088/${path}/" > "/tmp/rosa-${path//\//-}.html"
done
```

The current About output must contain exactly one each of:

```text
data-preview-page-hero
data-preview-who-we-are
data-preview-stats
data-preview-about-cards
data-preview-feature-banner
data-preview-why-us
data-preview-family-strip
data-preview-contact-cta
```

If topology differs, fix partial/widget output first. If topology matches, continue to geometry/style diagnosis.

- [ ] **Step 3: Pin the observed defect with a focused assertion**

Add the actual failing selector to the comparison test. The assertion pattern is:

```js
const targetBox = await targetPage.locator(selector).boundingBox();
const localBox = await localPage.locator(selector).boundingBox();
assert.ok(targetBox && localBox, `${label}: missing rendered box`);
assert.ok(
  Math.abs(localBox.y - targetBox.y) <= 2,
  `${label}: y target=${targetBox.y} local=${localBox.y}`,
);
```

For spacing bugs compare computed `paddingLeft/paddingRight`; for grid bugs compare `gridTemplateColumns`; for typography compare `fontSize/lineHeight`.

- [ ] **Step 4: Apply exactly one root-cause repair path**

Use this mapping:

```text
wrong editable/default copy -> AboutWidgets.php / ElementorSeedData.php
wrong media mapping          -> AboutWidgets.php / existing media mapping
extra Elementor spacing      -> elementor-authoring.css scoped to .rosa-elementor-authoring
partial DOM/class drift      -> specific about-*.php partial
Arabic-only logical spacing  -> client-preview-rtl.css scoped to About marker
```

Do not add a page-wide arbitrary transform, negative margin, or new design layer.

- [ ] **Step 5: Verify About GREEN**

Run:

```bash
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Expected: About EN/AR comparisons pass at every required viewport; no overflow/console errors.

- [ ] **Step 6: Capture and inspect About**

Run the parity capture and inspect EN/AR About at 1440×900, 1024×768, 390×844. Check full page, image crop, family/proof strip, CTA, footer, and RTL ordering.

- [ ] **Step 7: Commit only the focused repair**

```bash
git add wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-stats.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-feature.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-why.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css \
  wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php \
  wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php
```

Before committing, run `git diff --cached --name-only` and unstage unchanged/unrelated files. Then:

```bash
git commit -m "fix(wordpress): restore finished About parity"
```

---

### Task 5: Audit and Repair EN/AR Contact by Root Cause

**Files:**
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Test: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- Modify according to diagnosis: `page-hero.php`, `contact-layout.php`, `contact-map.php`, `elementor-authoring.css`, `client-preview-rtl.css`, `ContactWidgets.php`, `ElementorSeedData.php`.

**Interfaces:**
- Consumes: centralized Business settings at render time.
- Produces: target-matched EN/AR Contact, still presentation/mailto-only, with no duplicated business values in Elementor.

- [ ] **Step 1: Observe Contact RED**

Run the secondary fidelity test and record the first Contact mismatch.

- [ ] **Step 2: Pin Contact structural invariants**

Keep/add assertions:

```js
assert.equal(await page.locator('[data-preview-contact-layout]').count(), 1);
assert.equal(await page.locator('[data-preview-map-role]').count(), 1);
assert.equal(await page.locator('[data-preview-contact-form]').count(), 1);
assert.equal(await page.locator('[data-preview-contact-form]').getAttribute('action'), null);
assert.match(
  await page.locator('[data-preview-contact-form] .rosa-preview-button').getAttribute('href'),
  /^mailto:/,
);
```

- [ ] **Step 3: Pin exact finished-target hero content/defaults**

The pinned Contact target renders the hero body through `rosa_preview_copy('contact_title', $locale)`. Compare that target text against current Elementor `page_body`. If they differ, set Contact seed/widget default to the target value so the editable document starts from the finished target. Do not modify already client-edited documents automatically; use the existing edit-state/hash protection.

- [ ] **Step 4: Apply the diagnosed minimum repair**

Use the same source mapping as Task 4. Business values must continue to resolve inside `contact-layout.php` through:

```php
$address = rosa_preview_business_value('address', $locale);
$phone = rosa_theme_business_value('phone');
$email = rosa_theme_business_value('email');
```

Do not add `phone`, `email`, `address`, `address_ar`, `form_action`, or `submit_endpoint` controls to Contact widgets.

- [ ] **Step 5: Verify Contact GREEN**

Run:

```bash
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
php wordpress/scripts/tests/elementor-authoring-integration.test.php
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Expected: EN/AR Contact matches target geometry/styles; centralized values still render; form remains mailto/presentation only.

- [ ] **Step 6: Capture and manually inspect Contact**

Inspect EN/AR 1440, 1024, 390. Check form column geometry, detail cards, map block, CTA, footer, RTL field alignment, and LTR isolation for phone/email.

- [ ] **Step 7: Commit**

Stage only files changed for the diagnosed Contact defect and commit:

```bash
git commit -m "fix(wordpress): restore finished Contact parity"
```

---

### Task 6: Prove Shared Shell Parity Across Every Public Surface

**Files:**
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Test: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- Modify only if RED proves shared shell drift: `header.php`, `footer.php`, `cta-banner.php`, `client-preview-rtl.css`, `client-preview.js`.

**Interfaces:**
- Consumes: shared announcement/header/footer/CTA implementation.
- Produces: one shell implementation whose geometry/behavior matches across Home/About/Contact/Shop EN/AR.

- [ ] **Step 1: Add shell comparison assertions independent of page body**

For every route/viewport compare:

```text
.rosa-preview-announcement
.rosa-preview-header
.rosa-preview-header__inner
.rosa-preview-prefooter
.rosa-preview-footer
.rosa-preview-footer__grid
.rosa-preview-footer__bottom
```

At desktop also compare nav visibility and header action boxes; at mobile compare menu trigger box and drawer top/width after opening.

- [ ] **Step 2: Run and observe RED if any shared shell component differs**

Run:

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

- [ ] **Step 3: Fix shared shell only at the shared source**

If the same component drifts on multiple routes, repair `header.php`, `footer.php`, `cta-banner.php`, shared RTL, or shared JS. Never patch the same shell component separately inside page-specific partials.

- [ ] **Step 4: Verify every route after a shell change**

Run both commands from Step 2 again plus:

```bash
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  wordpress/scripts/tests/client-preview-accessibility.test.mjs \
  wordpress/wp-content/themes/rosa-medical-child/header.php \
  wordpress/wp-content/themes/rosa-medical-child/footer.php \
  wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/cta-banner.php \
  wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css \
  wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js
git commit -m "fix(wordpress): keep shared Rosa shell in target parity"
```

Unstage unchanged files before committing.

---

### Task 7: Audit and Repair Shop While Keeping WooCommerce as Data Owner

**Files:**
- Test: `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Modify according to diagnosis: `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`, `page-templates/client-preview-shop.php`, existing Shop/product-card partials, RTL CSS.

**Interfaces:**
- Consumes: WooCommerce query/product data and Rosa Shop content settings.
- Produces: target-matched Shop archive with dynamic Woo product cards and no Elementor Shop document.

- [ ] **Step 1: Pin ownership before visual repair**

Strengthen the Shop contract to require:

```bash
grep -Fq 'wc_get_products' "$THEME/template-parts/client-preview/product-grid.php" || true
! grep -R "rosa-page-.*shop\|rosa-shop-.*Widget" "$ROOT/wordpress/wp-content/plugins/rosa-medical-core/src/Elementor" >/dev/null
```

The exact query helper may differ; the invariant is that Shop cards come from WooCommerce objects/templates rather than Elementor JSON.

- [ ] **Step 2: Observe Shop RED against the pinned target runtime**

Run:

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Record the first EN/AR Shop mismatch: hero, search, grid, card geometry, pagination, CTA, or shell.

- [ ] **Step 3: Add a focused regression for the first Shop defect**

Examples:

```js
assert.equal(
  await columnCount(localPage.locator('.rosa-preview-shop-grid > *')),
  await columnCount(targetPage.locator('.rosa-preview-shop-grid > *')),
  `${label}: Shop column count drift`,
);
```

or compare the specific hero/search/card box.

- [ ] **Step 4: Repair only the Woo/theme renderer**

Do not create a Shop Elementor widget/page. Preserve `archive-product.php` as the primary Woo archive renderer and `client-preview-shop.php` only for the supported Arabic localized route.

- [ ] **Step 5: Verify dynamic Shop behavior**

Run:

```bash
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Confirm search remains usable and card links resolve to actual Woo products.

- [ ] **Step 6: Manual visual review**

Inspect EN/AR Shop at 1440, 1024, 390. Verify product image ratios/crop, card density, search layout, pagination, CTA/footer, and no public prices/checkout semantics unless already explicitly supported.

- [ ] **Step 7: Commit**

```bash
git commit -m "fix(wordpress): restore WooCommerce Shop parity"
```

Stage only Shop-related tests/renderers actually changed.

---

### Task 8: Verify Representative Product Detail and Public Category/Family Surfaces

**Files:**
- Test: `wordpress/scripts/tests/product-detail-structure.test.sh`
- Test: `wordpress/scripts/tests/product-template-hook.test.sh`
- Add browser coverage in `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs` for the representative product route and public category route when present.
- Modify only if pinned Rosa implementation proves drift: `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php` and relevant Woo/category renderer.

**Interfaces:**
- Consumes: canonical local product `rosa-foundation-stevens-scissors-regular` and its variations `04-0901`, `04-0911`.
- Produces: dynamic Product Detail and category/family coverage without fabricating unavailable MedicaShop Single Product fidelity.

- [ ] **Step 1: Add the representative product route to capture/comparison**

Resolve it dynamically in the current/reference runtime. The canonical expected path is:

```text
/product/rosa-foundation-stevens-scissors-regular/
```

Capture it at 1440×900, 1024×768, 390×844.

- [ ] **Step 2: Define Product Detail acceptance from the pinned Rosa implementation only**

Require visible dynamic values:

```text
Stevens Scissors
04-0901
04-0911
Straight
Curved
```

Require exactly one `<main>` shell path and no retail checkout/cart/payment language.

- [ ] **Step 3: Compare current and pinned Product Detail renderer source**

Run:

```bash
git diff d0726eed34b4fc14267570853ade8b74df49ae9e -- \
  wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php
```

Expected at plan-writing time: no content drift. If still identical, do not redesign it merely to resemble a MedicaShop Single Product page that was never authoritative.

- [ ] **Step 4: Verify public category/family route if WordPress exposes one**

Use WP-CLI to identify a public `product_cat` term permalink. If it resolves publicly, add one representative category route to the browser capture and assert shell, product cards, no overflow, and dynamic Woo data. If the taxonomy is intentionally non-public in the local foundation, record `not public by current model` and do not invent a route.

- [ ] **Step 5: Run product gates**

```bash
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 6: Commit only if tests/tooling or a proven renderer defect changed**

```bash
git commit -m "test(wordpress): cover representative catalogue surfaces"
```

---

### Task 9: Prove Real Elementor Editing on Home, About, and Contact in Both Languages

**Files:**
- Modify: `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-content-zero-drift.test.sh`

**Interfaces:**
- Consumes: six Elementor documents and existing safe document backup/restore pattern.
- Produces: automated proof that representative EN/AR Home/About/Contact text edits and media edits persist through routine seeds.

- [ ] **Step 1: Extend mutation backup to all six target pages**

Resolve IDs for:

```text
home
about
contact
ar
ar/about
ar/contact
```

Store each document's `get_elements_data()` in temporary WordPress options and restore them in `trap` exactly as the current Home mutation test does.

- [ ] **Step 2: Mutate representative widget settings**

Use these exact disposable values:

```text
EN Home:    rosa-home-hero.hero_title      = TEST ELEMENTOR HOME EN
AR Home:    rosa-home-hero.hero_title      = اختبار الصفحة الرئيسية
EN About:   rosa-page-hero-about.page_title = TEST ELEMENTOR ABOUT EN
AR About:   rosa-page-hero-about.page_title = اختبار من نحن
EN Contact: rosa-page-hero-contact.page_title = TEST ELEMENTOR CONTACT EN
AR Contact: rosa-page-hero-contact.page_title = اختبار اتصل بنا
```

Keep the existing Home media replacement test with a second Media Library image.

- [ ] **Step 3: Observe RED after extending the test**

Run:

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Expected before script implementation is complete: FAIL because About/Contact are not yet mutated/asserted by the current test.

- [ ] **Step 4: Save through Elementor documents and assert frontend independence**

For each locale/page, assert its disposable title appears only on that route and does not leak to its language pair.

- [ ] **Step 5: Run routine seeds and prove persistence**

Run inside the test:

```bash
bash wordpress/scripts/client-preview-seed.sh
bash wordpress/scripts/elementor-authoring-seed.sh
```

Require all six migrated documents to remain on `page-templates/rosa-elementor-authoring.php`, normal seed statuses to be safe/non-force, and every mutation to remain visible.

- [ ] **Step 6: Restore all documents and prove cleanup**

The test trap must restore the exact original Elementor document JSON, then refetch pages and assert no disposable marker remains.

- [ ] **Step 7: Run GREEN**

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add wordpress/scripts/tests/elementor-authoring-mutation.test.sh \
  wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
git commit -m "test(wordpress): prove six-page Elementor edit persistence"
```

---

### Task 10: Prove WooCommerce and Centralized Settings Ownership End-to-End

**Files:**
- Modify: `wordpress/scripts/tests/client-preview-content-mutation.test.sh`
- Modify: `wordpress/scripts/tests/business-settings.test.php`
- Add safe runtime assertions to `wordpress/scripts/client-preview-runtime-verify.sh` only after focused GREEN.

**Interfaces:**
- Consumes: Woo canonical fixture product and Rosa `rosa_business_settings` / `rosa_site_content` options.
- Produces: proof that shared business/site values update consuming surfaces and Woo product edits update Woo-driven surfaces without touching Elementor JSON.

- [ ] **Step 1: Back up local fixture state**

In the mutation test, save:

```text
rosa_business_settings
rosa_site_content
canonical fixture product name/description
```

Use a trap to restore all values.

- [ ] **Step 2: Apply safe disposable centralized values**

Use:

```text
phone: +966 55 000 1122
email: ownership-test@example.invalid
address: Ownership Test Address
address_ar: عنوان اختبار الملكية
cta_title EN: OWNERSHIP TEST CTA
```

- [ ] **Step 3: Assert centralized values render on all intended surfaces**

At minimum:

```text
phone/email -> announcement/header/footer/Contact where applicable
address      -> Contact/footer
address_ar   -> Arabic Contact/footer
cta_title    -> shared pre-footer CTA on Home/About/Contact
```

Do not require a business value on a surface that intentionally does not consume it.

- [ ] **Step 4: Mutate the canonical local Woo fixture product**

Temporarily change its name to:

```text
OWNERSHIP TEST STEVENS
```

Save through WooCommerce API/WP-CLI PHP, not Elementor.

- [ ] **Step 5: Assert Woo-driven surfaces update**

Require the new product name on Product Detail and on any Home/Shop card query where the fixture is present. If fixture ordering prevents it from appearing on Home Latest/Featured, assert Shop + Product Detail and separately inspect Home Elementor document JSON to prove no product names/SKUs are serialized there.

- [ ] **Step 6: Prove Elementor documents do not contain protected data**

Use WP-CLI to encode each Home document and fail if it contains:

```text
04-0901
04-0911
ownership-test@example.invalid
+966 55 000 1122
Ownership Test Address
```

- [ ] **Step 7: Restore state and run GREEN**

Run:

```bash
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
php wordpress/scripts/tests/business-settings.test.php
```

Expected: PASS and all disposable values restored.

- [ ] **Step 8: Commit**

```bash
git add wordpress/scripts/tests/client-preview-content-mutation.test.sh \
  wordpress/scripts/tests/business-settings.test.php
git commit -m "test(wordpress): enforce Woo and shared-settings ownership"
```

---

### Task 11: Make the WordPress Editing UX Clear and Protect Role Boundaries

**Files:**
- Test: `wordpress/scripts/tests/client-preview-admin-contract.test.sh`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php`
- Modify only if capability handling requires it: admin registration code in `Plugin.php` or `BusinessSettings.php`.

**Interfaces:**
- Consumes: Elementor edit URLs for six marketing pages, Rosa Business settings, Woo Products menu.
- Produces: one understandable client editing model without duplicate legacy marketing-page editors.

- [ ] **Step 1: Pin the desired admin navigation contract**

The Rosa admin surface must expose clear links for:

```text
Home — Edit with Elementor
About — Edit with Elementor
Contact — Edit with Elementor
Arabic Home — Edit with Elementor
Arabic About — Edit with Elementor
Arabic Contact — Edit with Elementor
Rosa Business
Products / WooCommerce
```

Legacy Home/About/Contact option editors must not be presented as the normal editing path for pages already migrated to Elementor.

- [ ] **Step 2: Write source/runtime admin assertions before changing UI**

Strengthen `client-preview-admin-contract.test.sh` to require `ElementorShortcutPage` to derive real Elementor edit URLs and to require the Rosa admin page to name the correct ownership surface for page content, business values, and products.

- [ ] **Step 3: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
```

Expected: fail on any missing/ambiguous shortcut or duplicate normal-editing path exposed by current admin UI.

- [ ] **Step 4: Apply the minimum admin UX correction**

Keep administrator-only technical settings under `manage_options`. For a future nontechnical content-manager role, use WordPress content capabilities rather than granting theme/plugin installation. This task does not create a custom role unless the existing project already has one; it ensures the UI does not imply that ordinary page edits require code/system settings.

- [ ] **Step 5: Verify editor links**

Run:

```bash
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts/tests/client-preview-admin-contract.test.sh \
  wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php \
  wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php
git commit -m "fix(wordpress): clarify Rosa client editing ownership"
```

---

### Task 12: Integrate Secondary Fidelity into the Full Runtime Verifier

**Files:**
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Modify: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`

**Interfaces:**
- Consumes: all focused GREEN contracts from Tasks 1–11.
- Produces: one local acceptance command that fails on structural/runtime/authoring/accessibility/secondary-fidelity regressions.

- [ ] **Step 1: Add syntax gate for the secondary fidelity test**

Add:

```bash
run node --check wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs
```

- [ ] **Step 2: Add secondary runtime execution behind an explicit reference URL**

Use:

```bash
if [[ -n "${ROSA_REFERENCE_URL:-}" ]]; then
  run node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
    "$ROSA_REFERENCE_URL" "$home_url"
fi
```

Do not make the normal verifier depend on public internet availability. The strict visual-parity run uses `ROSA_REFERENCE_URL=http://localhost:8090/`.

- [ ] **Step 3: Add tooling-contract assertions**

Require `ROSA_REFERENCE_URL` and the secondary test invocation to exist in the verifier source.

- [ ] **Step 4: Run ordinary verifier**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS without needing a reference runtime.

- [ ] **Step 5: Run strict parity verifier**

With target runtime running:

```bash
ROSA_REFERENCE_URL=http://localhost:8090/ bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS including secondary parity.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh \
  wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
git commit -m "test(wordpress): gate full runtime on optional target parity"
```

---

### Task 13: Final Deterministic Capture and Human Visual Acceptance

**Files:**
- No production changes unless a newly observed real defect starts a new focused RED→GREEN loop.
- Evidence: `artifacts/exact-elementor-parity/final/`.

**Interfaces:**
- Consumes: green strict verifier.
- Produces: final side-by-side evidence for human acceptance.

- [ ] **Step 1: Run final target/current capture matrix**

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  http://localhost:8090/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/final/pinned-target
```

- [ ] **Step 2: Run production confirmation capture**

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/final/production-confirmation
```

- [ ] **Step 3: Review the required route/viewport matrix manually**

At minimum review:

```text
Home EN/AR:     1440, 1024, 768, 390
About EN/AR:    1440, 1024, 390
Contact EN/AR:  1440, 1024, 390
Shop EN/AR:     1440, 1024, 390
Product Detail: 1440, 1024, 390
```

For each page check section order, vertical rhythm, typography, crop/aspect ratio, grids, CTA, footer, mobile stacking, RTL logical spacing, clipping, and broken media.

- [ ] **Step 4: Reject screenshot-only rationalization**

If a visible mismatch remains, identify its selector/source, write a focused failing assertion, repair it, rerun strict verification, then regenerate the affected captures. Do not mark the project complete with a known unexplained visual drift.

- [ ] **Step 5: Commit nothing solely for screenshots**

Artifacts remain untracked unless the repository already has an explicit approved evidence-commit convention.

---

### Task 14: Remove Only Proven-Dead Superseded Home Runtime Code

**Files:**
- Candidate stale runtime only after zero-reference proof:
  - `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-hero.php`
  - `latest-home-family-discovery.php`
  - `latest-home-comprehensive.php`
  - `latest-home-confidence.php`
  - `latest-home-contact-band.php`
  - `latest-home-assurance.php`
  - `latest-home-quotation.php`
- Candidate stale helper in `functions.php`: `rosa_is_latest_home_page()` if still unused.
- Candidate stale test: `wordpress/scripts/tests/latest-rosa-home-parity-capture-contract.test.sh` if it only references removed runtime tooling and provides no active negative guard value.

**Interfaces:**
- Consumes: final green site and repository search.
- Produces: smaller runtime with no superseded latest-custom Home implementation capable of being accidentally reactivated.

- [ ] **Step 1: Search references before deletion**

Run:

```bash
grep -RIn --exclude-dir=.git \
  -e 'latest-home-hero' \
  -e 'latest-home-family-discovery' \
  -e 'latest-home-comprehensive' \
  -e 'latest-home-confidence' \
  -e 'latest-home-contact-band' \
  -e 'latest-home-assurance' \
  -e 'latest-home-quotation' \
  -e 'rosa_is_latest_home_page' \
  wordpress docs
```

Classify each hit as active runtime, intentional negative guard, historical doc, or dead code.

- [ ] **Step 2: Write/update a negative runtime contract first**

Keep `medicashop-elementor-reference-contract.test.sh` asserting that latest-custom CSS/JS are not enqueued. Add source assertions that active Home widgets/seed topology contain only the nine finished-template widget names.

- [ ] **Step 3: Run the negative contract before deletion**

```bash
bash wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
```

Expected: PASS.

- [ ] **Step 4: Delete only files with zero active runtime references**

Do not delete historical specs/plans merely because they describe superseded work. Preserve them as history with explicit superseded status.

- [ ] **Step 5: Run full verification after cleanup**

```bash
ROSA_REFERENCE_URL=http://localhost:8090/ bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS.

- [ ] **Step 6: Commit cleanup**

```bash
git commit -m "chore(wordpress): remove superseded Home runtime remnants"
```

---

### Task 15: Final Local Acceptance and Deployment Stop Boundary

**Files:**
- Modify documentation only if current runbook is inaccurate: `docs/runbooks/wordpress-client-content-controls.md`.
- Do not touch Hostinger/production.

**Interfaces:**
- Consumes: all final local verification evidence.
- Produces: a local-complete handoff that is ready for a separate staging/deployment approval.

- [ ] **Step 1: Run the complete strict verifier from a cleanly understood worktree**

```bash
ROSA_REFERENCE_URL=http://localhost:8090/ bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS.

- [ ] **Step 2: Run responsive capture tooling**

```bash
bash wordpress/scripts/client-preview-responsive-capture.sh
```

Expected: 64 bilingual screenshots from the existing eight-route/eight-viewport matrix.

- [ ] **Step 3: Re-run editor/ownership acceptance**

```bash
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
bash wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 4: Update the runbook with the final client ownership model**

The runbook must state:

```text
Home/About/Contact -> Edit with Elementor
Products/categories/attributes -> WooCommerce
Phone/email/address/WhatsApp -> Rosa Business
Shared CTA/site copy -> Rosa Site & CTA
Routine seeds -> non-destructive; no --force for normal operation
```

- [ ] **Step 5: Record final git state**

```bash
git status --short
git log --oneline --decorate -15
```

Any remaining untracked files from Task 0 must be accounted for explicitly; do not silently delete them.

- [ ] **Step 6: Stop before production**

Do not run `hostinger-export.sh`, upload files, import databases, modify DNS, or run `hostinger-postdeploy-verify.sh` against production until the user separately approves deployment/staging work.

- [ ] **Step 7: Commit documentation only if changed**

```bash
git add docs/runbooks/wordpress-client-content-controls.md
git commit -m "docs(wordpress): finalize Elementor client editing runbook"
```

---

## Final Acceptance Checklist

Implementation is locally complete only when every statement below is true:

- [ ] Home matches the finished target and the Arabic Who RTL regression is green.
- [ ] About EN/AR matches the pinned finished target at required viewports.
- [ ] Contact EN/AR matches the pinned finished target at required viewports.
- [ ] Shop EN/AR preserves target Rosa appearance while remaining Woo-owned.
- [ ] Representative Product Detail remains dynamic and matches the approved Rosa implementation; no unsupported MedicaShop Single Product fidelity claim is made.
- [ ] Public category/family coverage is verified where that route is actually public.
- [ ] Shared announcement/header/footer/pre-footer CTA remains one global code-owned implementation.
- [ ] Home/About/Contact are genuine Elementor Free documents with real edit URLs.
- [ ] Representative EN and AR edits on all three page types persist.
- [ ] Home media edits persist.
- [ ] Routine seeds do not overwrite edited Elementor documents.
- [ ] Woo product truth is not serialized into Elementor.
- [ ] Business and Site/CTA values remain centralized and dynamic.
- [ ] Contact remains mailto/presentation-only; no backend submission was added.
- [ ] No Elementor Pro or proprietary demo runtime dependency is introduced.
- [ ] No unintended horizontal overflow, vertical collision, broken required media, console/page error, or RTL regression remains.
- [ ] Strict local verifier with `ROSA_REFERENCE_URL=http://localhost:8090/` passes.
- [ ] Final side-by-side human review passes.
- [ ] Superseded latest-custom Home runtime cannot override the finished-template target.
- [ ] Hostinger/production remains untouched pending separate approval.
