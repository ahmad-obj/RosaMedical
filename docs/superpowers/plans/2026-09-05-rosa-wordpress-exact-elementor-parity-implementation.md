# Rosa Medical Exact Elementor Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish converting the approved Rosa/MedicaShop-derived WordPress site into a genuinely Elementor Free-editable bilingual site while preserving the finished public appearance, WooCommerce catalogue ownership, centralized Rosa settings, RTL behavior, and safe edit-preserving migrations.

**Architecture:** The pinned finished Rosa implementation at `d0726eed34b4fc14267570853ade8b74df49ae9e` remains the primary visual/source authority. Home/About/Contact stay genuine Elementor Free documents, but their Rosa widgets only pass editable content/media into the established child-theme renderers; Elementor does not own layout geometry. Shop/Product surfaces stay Woo/theme-owned, shared shell/CTA stays theme/settings-owned, and all visual repairs must begin with measured target/current evidence and a focused RED→GREEN regression.

**Tech Stack:** WordPress/PHP 8+, Hello Elementor, Elementor Free, WooCommerce, Docker Compose, Bash/WP-CLI, vanilla CSS/JS, Playwright via `apps/web`, Git worktrees for the isolated finished-target runtime.

**Spec:** `docs/superpowers/specs/2026-09-05-rosa-wordpress-exact-elementor-parity-master-design.md`

## Global Constraints

- Work on `wordpress/client-content-controls`; do not merge/delete it during this plan.
- Plan baseline commit: `e39e48781ee27ba2d6730c58903de9ddc0b0a7f0`.
- Finished visual/source authority: `d0726eed34b4fc14267570853ade8b74df49ae9e` from `wordpress/client-preview-medicashop-recreation`.
- `https://rosamedical.org/` is external confirmation only; if it materially conflicts with the pinned branch, document the conflict instead of silently changing authority.
- `apps/web/**` is not visual authority for this conversion.
- Do not redesign Rosa Medical.
- Elementor Free owns EN/AR Home, About, Contact body copy/media only.
- Child theme/code owns announcement, header, footer, navigation, target DOM/classes, CSS, RTL, JS, shared pre-footer CTA structure, and Woo public templates.
- WooCommerce owns products, categories/families, product media, SKUs, attributes/configurations, descriptions, publish state, and future pricing.
- Rosa centralized settings own phone, email, address, Arabic address, WhatsApp, and shared Site/CTA values.
- Do not duplicate Woo records or shared business values inside Elementor JSON.
- No Elementor Pro or proprietary MedicaShop runtime assets.
- No public cart/checkout/payment flow.
- Contact remains presentation/mailto-oriented; do not add a submission backend.
- `elementor-authoring-seed.sh --force` is never a routine migration path.
- Preserve `rosa-elementor-root` full-width, zero-gap, zero-padding, non-wrapping safeguards.
- Do not weaken existing geometry, RTL, overflow, accessibility, interaction, or console/network thresholds to make a failure disappear.
- Required viewports: 1440×900, 1280×800, 1024×768, 768×1024, 431×932, 390×844, 360×800. Retain existing 1920/2560 capture coverage.
- Inspect and preserve reported local untracked secondary-page work before touching competing files.
- No Hostinger/production action is authorized by this plan.

---

## File Map

### Visual/authoring production files

- `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css` — RTL-specific corrections only.
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css` — Elementor wrapper neutralization only.
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/page-hero.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-who.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-stats.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-cards.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-feature.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-why.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/about-proof.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-layout.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/contact-map.php`
- `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/cta-banner.php`
- `wordpress/wp-content/themes/rosa-medical-child/header.php`
- `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- `wordpress/wp-content/themes/rosa-medical-child/woocommerce/archive-product.php`
- `wordpress/wp-content/themes/rosa-medical-child/page-templates/client-preview-shop.php`
- `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/AboutWidgets.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ContactWidgets.php`
- `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/ElementorSeedData.php`

### Verification/tooling files

- `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs` — adopt the reported local file if present; otherwise create it in Task 2.
- `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- `wordpress/scripts/tests/client-preview-about-contract.test.sh`
- `wordpress/scripts/tests/client-preview-contact-contract.test.sh`
- `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- `wordpress/scripts/tests/client-preview-admin-contract.test.sh`
- `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- `wordpress/scripts/tests/client-preview-content-mutation.test.sh`
- `wordpress/scripts/tests/client-preview-content-zero-drift.test.sh`
- `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`
- `wordpress/scripts/medicashop-elementor-parity-capture.mjs`
- `wordpress/scripts/client-preview-runtime-verify.sh`

### Reported local untracked work — inspect first

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

Do not stage, delete, replace, or rename these until Task 0 records their contents and decides whether they are reusable.

---

### Task 0: Freeze State and Protect Existing Local Work

**Files:**
- Read only: repository/worktree state and every reported untracked file above.
- Local evidence: `artifacts/exact-elementor-parity/preflight/`.

**Interfaces:**
- Consumes: current local checkout plus remote branch.
- Produces: trusted baseline and local-work inventory used by all later tasks.

- [ ] **Step 1: Record branch, HEAD, remote, and dirty state**

```bash
mkdir -p artifacts/exact-elementor-parity/preflight
{
  printf 'HEAD='; git rev-parse HEAD
  printf 'BRANCH='; git branch --show-current
  printf '\nSTATUS\n'; git status --short
  printf '\nREMOTE\n'; git ls-remote origin refs/heads/wordpress/client-content-controls
} | tee artifacts/exact-elementor-parity/preflight/repository-state.txt
```

Expected: branch is `wordpress/client-content-controls`. Do not auto-reset/rebase/stash if local HEAD or status differs.

- [ ] **Step 2: Record every reported local secondary artifact**

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
    sed -n '1,400p' "$file"
  fi
done | tee artifacts/exact-elementor-parity/preflight/local-secondary-work.txt
```

Expected: no source file changes.

- [ ] **Step 3: Verify the pinned target commit exists**

```bash
git cat-file -e d0726eed34b4fc14267570853ade8b74df49ae9e^{commit}
```

Expected: exit 0. Fetch the named reference if missing; do not switch/reset the implementation branch.

- [ ] **Step 4: Commit nothing**

Task 0 is read-only.

---

### Task 1: Finish the Existing Arabic Home Who RTL RED→GREEN Boundary

**Files:**
- Test: `wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css`

**Interfaces:**
- Consumes: committed `assertRtlHomeWhoPadding()` regression.
- Produces: Arabic Home Who spacing mirrored logically: 74px desktop, 42px tablet, 0 mobile.

- [ ] **Step 1: Prepare local runtime without force reseeding**

```bash
bash wordpress/scripts/foundation-bootstrap.sh
bash wordpress/scripts/client-preview-seed.sh
bash wordpress/scripts/foundation-seed.sh
bash wordpress/scripts/elementor-authoring-seed.sh
```

If `home_parity_manual_required` appears, stop and preserve the edited Home document.

- [ ] **Step 2: Observe RED**

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected: fail on Arabic `.rosa-preview-who__copy` physical padding at 1440 and/or 1024. Save the exact failure output.

- [ ] **Step 3: Add the minimum RTL rule**

Append after the existing About RTL spacing rules:

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

Do not edit `client-preview.css`.

- [ ] **Step 4: Verify focused GREEN**

```bash
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 5: Verify full runtime**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected final line:

```text
PASS: Rosa WordPress runtime matches the finished template with Elementor authoring, bilingual routes, editable content and catalogue regressions intact
```

- [ ] **Step 6: Refresh Home captures and freeze Home**

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/home-after-rtl
```

Inspect EN/AR 1440, 1024, 390. Do not widen scope into Home cleanup unless new direct evidence proves another defect.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css
git commit -m "fix(wordpress): mirror Home Who spacing in Arabic"
```

---

### Task 2: Add Deterministic Secondary-Page Parity Tooling

**Files:**
- Modify: `wordpress/scripts/medicashop-elementor-parity-capture.mjs`
- Create/adopt: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Modify: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`

**Interfaces:**
- Consumes: two base URLs and Playwright.
- Produces: route/viewport screenshots plus computed geometry/style evidence; secondary test compares pinned target to current runtime.

- [ ] **Step 1: Expand capture routes**

Use:

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

Keep all seven required viewports.

- [ ] **Step 2: Record route-specific selectors**

```js
const selectorsByKind = {
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
    '.rosa-preview-shop-hero', '.rosa-preview-shop-search',
    '.rosa-preview-shop-grid', '.rosa-preview-pagination',
    '.rosa-preview-prefooter', '[data-rosa-preview-footer]',
  ],
};
```

For each existing selector write JSON containing box `{x,y,width,height}` and computed `display`, `gridTemplateColumns`, physical padding/margins, `fontSize`, `lineHeight`, `backgroundColor`, `borderRadius`.

- [ ] **Step 3: Use deterministic artifact names**

Example:

```text
reference/en-about-1440x900-full.png
reference/en-about-1440x900-metrics.json
local/en-about-1440x900-full.png
local/en-about-1440x900-metrics.json
```

Fail on visible broken images or page navigation failure.

- [ ] **Step 4: Implement secondary comparison contract**

Command:

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  http://localhost:8090/ \
  http://localhost:8088/
```

Compare About/Contact/Shop EN/AR only; Home keeps its dedicated historical fidelity test. Use:

```js
const tolerance = { position: 2, size: 2, font: 0.6, spacing: 1 };
```

Each assertion failure must print route, viewport, selector, target value, current value. Text/content mismatches are reported separately from geometry so intentional editor content does not get misdiagnosed as CSS drift.

- [ ] **Step 5: Strengthen tooling contract**

Add checks requiring `/about/`, `/ar/about/`, `/contact/`, `/ar/contact/`, `/shop/`, `/ar/shop/` in the capture script and requiring `client-preview-secondary-fidelity.test.mjs` to exist.

- [ ] **Step 6: Verify tooling**

```bash
node --check wordpress/scripts/medicashop-elementor-parity-capture.mjs
node --check wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
git commit -m "test(wordpress): add secondary-page parity diagnostics"
```

---

### Task 3: Run the Pinned Finished Branch as an Isolated Reference Runtime

**Files:**
- No production-file changes.
- Reference worktree: `.worktrees/rosa-medicashop-target` from the repository root.
- Local-only `.worktrees/rosa-medicashop-target/wordpress/dev/.env`.

**Interfaces:**
- Consumes: pinned commit `d0726eed34b4fc14267570853ade8b74df49ae9e`.
- Produces: finished-template reference runtime at `http://localhost:8090/`.

- [ ] **Step 1: Invoke `superpowers:using-git-worktrees` and perform its safety checks**

Confirm whether the implementation checkout is already linked, verify `.worktrees` is ignored, and use the project-local `.worktrees` location. If `.worktrees` is not ignored:

```bash
printf '\n.worktrees/\n' >> .gitignore
git add .gitignore
git commit -m "chore: ignore local worktrees"
```

- [ ] **Step 2: Create the exact reference checkout**

From repository root:

```bash
rm -rf .worktrees/rosa-medicashop-target 2>/dev/null || true
git worktree prune
git worktree add --detach .worktrees/rosa-medicashop-target d0726eed34b4fc14267570853ade8b74df49ae9e
```

Do not run the `rm -rf` command if `git worktree list` shows that path as a live worktree; remove it with `git worktree remove .worktrees/rosa-medicashop-target` first.

- [ ] **Step 3: Configure isolated runtime values**

```bash
cp .worktrees/rosa-medicashop-target/wordpress/dev/.env.example \
   .worktrees/rosa-medicashop-target/wordpress/dev/.env
cat >> .worktrees/rosa-medicashop-target/wordpress/dev/.env <<'EOF'
ROSA_WP_PORT=8090
COMPOSE_PROJECT_NAME=rosa-medicashop-target
EOF
```

- [ ] **Step 4: Bootstrap/seed the reference**

```bash
cd .worktrees/rosa-medicashop-target
COMPOSE_PROJECT_NAME=rosa-medicashop-target ROSA_WP_PORT=8090 bash wordpress/scripts/foundation-bootstrap.sh
COMPOSE_PROJECT_NAME=rosa-medicashop-target ROSA_WP_PORT=8090 bash wordpress/scripts/client-preview-seed.sh
COMPOSE_PROJECT_NAME=rosa-medicashop-target ROSA_WP_PORT=8090 bash wordpress/scripts/foundation-seed.sh
cd -
```

- [ ] **Step 5: Smoke-check target routes**

```bash
for path in / /about/ /contact/ /shop/ /ar/ /ar/about/ /ar/contact/ /ar/shop/; do
  curl -fsS "http://localhost:8090${path}" >/dev/null || exit 1
done
```

Expected: all success.

- [ ] **Step 6: Capture baseline pinned/current evidence**

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  http://localhost:8090/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/secondary/baseline
```

Also capture production confirmation separately. Do not blend production/pinned differences.

- [ ] **Step 7: Commit nothing**

Reference worktree and artifacts are local evidence.

---

### Task 4: Restore EN/AR About Parity by Root Cause

**Files:**
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Test: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- Repair source chosen from: `page-hero.php`, `about-who.php`, `about-stats.php`, `about-cards.php`, `about-feature.php`, `about-why.php`, `about-proof.php`, `elementor-authoring.css`, `client-preview-rtl.css`, `AboutWidgets.php`, `ElementorSeedData.php`.

**Interfaces:**
- Consumes: pinned target runtime and seven About widget topology.
- Produces: finished-target About geometry/styles in EN/AR while keeping content/media authorable.

- [ ] **Step 1: Observe first About RED**

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Record first About route/viewport/selector mismatch.

- [ ] **Step 2: Pin topology before styling**

Require exactly one each:

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

If topology differs, repair renderer/widget output before CSS.

- [ ] **Step 3: Add a focused regression for the observed mismatch**

Use the target/current selector directly:

```js
const targetBox = await targetPage.locator(selector).boundingBox();
const localBox = await localPage.locator(selector).boundingBox();
assert.ok(targetBox && localBox, `${label}: missing rendered box`);
assert.ok(
  Math.abs(localBox.y - targetBox.y) <= 2,
  `${label}: y target=${targetBox.y} current=${localBox.y}`,
);
```

Use computed padding/grid/font assertions instead when those are the actual failing property.

- [ ] **Step 4: Repair the actual source, not the symptom**

Use this deterministic ownership map:

```text
wrong generated editable/default value -> AboutWidgets.php / ElementorSeedData.php
wrong About media binding              -> AboutWidgets.php media mapping
Elementor wrapper spacing              -> elementor-authoring.css
partial DOM/class drift                -> the specific about-*.php partial
Arabic-only physical/logical spacing   -> client-preview-rtl.css scoped to About marker
```

If current page content is client-edited, do not reset it to target defaults; classify it as content-state difference and compare geometry separately.

- [ ] **Step 5: Verify GREEN**

```bash
bash wordpress/scripts/tests/client-preview-about-contract.test.sh
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Expected: About EN/AR geometry/style passes every required viewport with no overflow/console errors.

- [ ] **Step 6: Manual About review**

Inspect EN/AR 1440, 1024, 390 captures: section rhythm, image crop, stats/cards, feature, Why, family/proof strip, CTA/footer, RTL ordering.

- [ ] **Step 7: Commit only changed About/test files**

```bash
git diff --name-only
git add wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
  wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs
# Add only the diagnosed About production file(s), then:
git commit -m "fix(wordpress): restore finished About parity"
```

---

### Task 5: Restore EN/AR Contact Parity by Root Cause

**Files:**
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Test: `wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs`
- Repair source chosen from: `page-hero.php`, `contact-layout.php`, `contact-map.php`, `elementor-authoring.css`, `client-preview-rtl.css`, `ContactWidgets.php`, `ElementorSeedData.php`.

**Interfaces:**
- Consumes: centralized Business settings and pinned Contact reference.
- Produces: finished-target Contact EN/AR, still mailto/presentation-only.

- [ ] **Step 1: Observe first Contact RED**

Run the secondary fidelity test and record the first Contact mismatch.

- [ ] **Step 2: Pin structural/backend boundaries**

Keep/add:

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

- [ ] **Step 3: Verify centralized business ownership before repair**

`contact-layout.php` must continue resolving:

```php
$address = rosa_preview_business_value('address', $locale);
$phone = rosa_theme_business_value('phone');
$email = rosa_theme_business_value('email');
```

Contact widgets must not expose `phone`, `email`, `address`, `address_ar`, `form_action`, or `submit_endpoint`.

- [ ] **Step 4: Add focused property regression and repair its root source**

Use the same geometry/style assertion pattern as Task 4. If hero copy differs from the pinned target, classify whether it is a generated-default mismatch or an intentional Elementor edit before changing seed data. Never overwrite a `migrated_edited` document.

- [ ] **Step 5: Verify GREEN**

```bash
bash wordpress/scripts/tests/client-preview-contact-contract.test.sh
php wordpress/scripts/tests/elementor-authoring-integration.test.php
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

- [ ] **Step 6: Manual Contact review**

Inspect EN/AR 1440, 1024, 390: contact card/form split, map panel, CTA/footer, RTL labels, and LTR isolation for phone/email.

- [ ] **Step 7: Commit only changed Contact/test files**

```bash
git commit -m "fix(wordpress): restore finished Contact parity"
```

---

### Task 6: Prove Shared Shell Parity Across Home/About/Contact/Shop

**Files:**
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Test: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- Repair only if RED: `header.php`, `footer.php`, `cta-banner.php`, `client-preview-rtl.css`, `client-preview.js`.

**Interfaces:**
- Consumes: one shared shell implementation.
- Produces: identical shared shell geometry/behavior on all public routes.

- [ ] **Step 1: Compare shared selectors on every secondary route**

Require target/current parity for:

```text
.rosa-preview-announcement
.rosa-preview-header
.rosa-preview-header__inner
.rosa-preview-prefooter
.rosa-preview-footer
.rosa-preview-footer__grid
.rosa-preview-footer__bottom
```

At mobile also open the drawer and compare top, width, height, nav-row count, and RTL origin.

- [ ] **Step 2: Observe RED**

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

- [ ] **Step 3: Repair only the shared source**

If a shell component fails multiple routes, fix the shared file once; never patch About/Contact/Shop individually for the same shell component.

- [ ] **Step 4: Verify GREEN**

```bash
bash wordpress/scripts/tests/client-preview-shell-contract.test.sh
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

- [ ] **Step 5: Commit**

```bash
git commit -m "fix(wordpress): keep shared Rosa shell in target parity"
```

---

### Task 7: Restore Shop Parity Without Moving Shop into Elementor

**Files:**
- Test: `wordpress/scripts/tests/client-preview-shop-contract.test.sh`
- Test: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs`
- Repair only if RED: `woocommerce/archive-product.php`, `page-templates/client-preview-shop.php`, `product-card.php`, `client-preview-rtl.css`.

**Interfaces:**
- Consumes: WooCommerce product query/data and Shop content settings.
- Produces: target-matched EN/AR Shop while Woo/theme retains ownership.

- [ ] **Step 1: Pin Shop ownership with real source assertions**

Add to the Shop contract:

```bash
grep -Fq "new WP_Query(['post_type'=>'product'" \
  "$THEME/template-parts/client-preview/product-grid.php" \
  || fail 'Home product grids no longer query Woo products dynamically'

grep -Fq 'wc_get_product' "$THEME/woocommerce/archive-product.php" \
  || fail 'Shop archive no longer resolves Woo product objects'

if grep -RIlE 'rosa-shop-.*Widget|rosa-page-hero-shop' \
  "$ROOT/wordpress/wp-content/plugins/rosa-medical-core/src/Elementor" >/dev/null; then
  fail 'Shop must not become an Elementor-authored product page'
fi
```

- [ ] **Step 2: Observe first Shop RED**

```bash
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
```

Classify hero/search/grid/card/pagination/CTA/shell mismatch.

- [ ] **Step 3: Add a focused Shop regression**

For a grid issue, compare first-row column count; for search/hero/card drift compare target/current boxes/styles directly.

- [ ] **Step 4: Repair only Woo/theme rendering**

Do not add Shop widgets to `WidgetRegistry`. Preserve Woo product IDs/names/images/SKUs as dynamic data.

- [ ] **Step 5: Verify GREEN**

```bash
bash wordpress/scripts/tests/client-preview-shop-contract.test.sh
node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs http://localhost:8090/ http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Confirm search remains usable and product card links resolve.

- [ ] **Step 6: Manual Shop review**

Inspect EN/AR 1440, 1024, 390: image crop, grid density, search, pagination, CTA/footer, RTL, and absence of public checkout/payment semantics.

- [ ] **Step 7: Commit**

```bash
git commit -m "fix(wordpress): restore WooCommerce Shop parity"
```

---

### Task 8: Verify Representative Product Detail and Public Family/Category Surface

**Files:**
- Test: `wordpress/scripts/tests/product-detail-structure.test.sh`
- Test: `wordpress/scripts/tests/product-template-hook.test.sh`
- Extend: `wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs` only for product/category smoke geometry.
- Repair only if pinned Rosa implementation proves drift: `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php` and relevant Woo renderer.

**Interfaces:**
- Consumes: canonical local product `rosa-foundation-stevens-scissors-regular`, variations `04-0901`, `04-0911`.
- Produces: dynamic catalogue-surface verification without inventing unavailable MedicaShop Single Product fidelity.

- [ ] **Step 1: Add representative Product Detail capture**

Use:

```text
/product/rosa-foundation-stevens-scissors-regular/
```

Capture 1440×900, 1024×768, 390×844.

- [ ] **Step 2: Pin dynamic Product Detail content**

Require visible:

```text
Stevens Scissors
04-0901
04-0911
Straight
Curved
```

Require one public main shell and no cart/checkout/payment language.

- [ ] **Step 3: Confirm source parity before any visual rewrite**

```bash
git diff d0726eed34b4fc14267570853ade8b74df49ae9e -- \
  wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php
```

If still identical, do not redesign it to imitate an unavailable MedicaShop Single Product reference.

- [ ] **Step 4: Resolve one public product category route if the current model exposes it**

```bash
wp_term_url="$({ docker compose -f wordpress/dev/compose.yaml run --rm wpcli eval '
$terms=get_terms(["taxonomy"=>"product_cat","hide_empty"=>false]);
foreach($terms as $term){$url=get_term_link($term);if(!is_wp_error($url)){echo $url;break;}}
'; } | tail -n1)"
printf '%s\n' "$wp_term_url"
```

If no public term URL exists by current model, record that fact and do not invent one.

- [ ] **Step 5: Run product gates**

```bash
bash wordpress/scripts/tests/product-template-hook.test.sh
bash wordpress/scripts/tests/product-detail-structure.test.sh
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Expected: PASS.

- [ ] **Step 6: Commit only real test/renderer changes**

```bash
git commit -m "test(wordpress): cover representative catalogue surfaces"
```

---

### Task 9: Prove Six-Page Elementor Edit Persistence

**Files:**
- Modify: `wordpress/scripts/tests/elementor-authoring-mutation.test.sh`
- Modify: `wordpress/scripts/tests/client-preview-content-zero-drift.test.sh`

**Interfaces:**
- Consumes: six Elementor documents and current document backup/restore pattern.
- Produces: proof that EN/AR Home/About/Contact edits persist through routine seeds and remain language-independent.

- [ ] **Step 1: Extend mutation backup/restore to all six paths**

```text
home
about
contact
ar
ar/about
ar/contact
```

Back up `get_elements_data()` to temporary options and restore through `trap` exactly like the current Home test.

- [ ] **Step 2: Mutate these exact settings**

```text
EN Home     rosa-home-hero.hero_title           = TEST ELEMENTOR HOME EN
AR Home     rosa-home-hero.hero_title           = اختبار الصفحة الرئيسية
EN About    rosa-page-hero-about.page_title     = TEST ELEMENTOR ABOUT EN
AR About    rosa-page-hero-about.page_title     = اختبار من نحن
EN Contact  rosa-page-hero-contact.page_title   = TEST ELEMENTOR CONTACT EN
AR Contact  rosa-page-hero-contact.page_title   = اختبار اتصل بنا
```

Keep the existing Home media replacement with a second attachment.

- [ ] **Step 3: Save through Elementor document API and assert frontend isolation**

Each disposable title must appear on exactly its route and not its language pair.

- [ ] **Step 4: Run routine seed paths**

Inside the test:

```bash
bash wordpress/scripts/client-preview-seed.sh
bash wordpress/scripts/elementor-authoring-seed.sh
```

Require all six pages to remain on `page-templates/rosa-elementor-authoring.php`; no normal seed may erase the edits.

- [ ] **Step 5: Restore all six documents and prove cleanup**

After restore, refetch all six routes and fail if any disposable marker remains.

- [ ] **Step 6: Run acceptance**

```bash
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
```

Expected: PASS.

- [ ] **Step 7: Commit**

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

**Interfaces:**
- Consumes: canonical Woo fixture plus `rosa_business_settings` and `rosa_site_content`.
- Produces: proof that shared settings and Woo data update their public consumers without entering Elementor JSON.

- [ ] **Step 1: Back up local option/product state and register a restore trap**

Back up:

```text
rosa_business_settings
rosa_site_content
canonical fixture product name and description
```

- [ ] **Step 2: Apply disposable centralized values**

```text
phone: +966 55 000 1122
email: ownership-test@example.invalid
address: Ownership Test Address
address_ar: عنوان اختبار الملكية
whatsapp: +966 55 000 3344
site CTA title EN: OWNERSHIP TEST CTA
```

- [ ] **Step 3: Assert intended consumers update**

Verify phone/email on announcement/footer/Contact where consumed, English address on Contact/footer, Arabic address on Arabic Contact/footer, and CTA title on shared pre-footer CTA for Home/About/Contact.

- [ ] **Step 4: Mutate the local Woo fixture through Woo API/WP-CLI**

Temporary product name:

```text
OWNERSHIP TEST STEVENS
```

- [ ] **Step 5: Assert Woo surfaces update**

Require the changed name on Product Detail and Shop. If the fixture is selected by Home Latest/Featured ordering, require it there too; otherwise do not manipulate ordering merely for the test.

- [ ] **Step 6: Assert protected values are absent from Elementor JSON**

Fail if Home/About/Contact Elementor document JSON contains any of:

```text
04-0901
04-0911
ownership-test@example.invalid
+966 55 000 1122
Ownership Test Address
```

- [ ] **Step 7: Restore and run GREEN**

```bash
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
php wordpress/scripts/tests/business-settings.test.php
```

Expected: PASS with all temporary values restored.

- [ ] **Step 8: Commit**

```bash
git add wordpress/scripts/tests/client-preview-content-mutation.test.sh \
  wordpress/scripts/tests/business-settings.test.php
git commit -m "test(wordpress): enforce Woo and shared-settings ownership"
```

---

### Task 11: Implement a Clear Client Editing UX and a Real Content-Manager Permission Boundary

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/Capabilities.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/RosaAdmin.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ElementorShortcutPage.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ContentPage.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/BusinessSettings.php`
- Modify: `wordpress/scripts/tests/client-preview-admin-contract.test.sh`

**Interfaces:**
- Produces role `rosa_content_manager` and capability `rosa_manage_content`.
- Role combines safe page/media capabilities from Editor with catalogue capabilities from Woo Shop Manager, but must not gain plugin/theme installation/edit capabilities.
- Rosa Business, Site & CTA, Shop UI, and Elementor shortcuts use `rosa_manage_content`; Elementor page opening additionally requires `edit_post` for the target page.

- [ ] **Step 1: Write failing admin/capability source assertions**

Require:

```bash
grep -Fq "'rosa_manage_content'" "$PLUGIN/src/Admin/Capabilities.php" || fail 'Rosa content capability missing'
grep -Fq "'rosa_content_manager'" "$PLUGIN/src/Admin/Capabilities.php" || fail 'Rosa content-manager role missing'
! grep -Fq "'manage_options'" "$PLUGIN/src/Admin/RosaAdmin.php" || fail 'Rosa content menu is still administrator-only'
grep -Fq 'current_user_can(Capabilities::MANAGE_CONTENT)' "$PLUGIN/src/Admin/ElementorShortcutPage.php" || fail 'Elementor shortcut capability boundary missing'
```

- [ ] **Step 2: Run RED**

```bash
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
```

Expected: FAIL because `Capabilities.php`/custom capability do not exist yet and current menu uses `manage_options`.

- [ ] **Step 3: Implement `Capabilities`**

Use:

```php
final class Capabilities
{
    public const MANAGE_CONTENT = 'rosa_manage_content';
    public const ROLE = 'rosa_content_manager';
    private const VERSION = '1';

    public static function ensure(): void
    {
        if ((string) get_option('rosa_capabilities_version', '') === self::VERSION) {
            return;
        }
        self::install();
        update_option('rosa_capabilities_version', self::VERSION, false);
    }

    public static function install(): void
    {
        $caps = ['read' => true, 'upload_files' => true, self::MANAGE_CONTENT => true];
        foreach (['editor', 'shop_manager'] as $sourceName) {
            $source = get_role($sourceName);
            if (! $source) continue;
            foreach ($source->capabilities as $cap => $grant) {
                if ($grant) $caps[$cap] = true;
            }
        }

        $role = get_role(self::ROLE);
        if (! $role) {
            $role = add_role(self::ROLE, 'Rosa Content Manager', $caps);
        } elseif ($role) {
            foreach ($caps as $cap => $grant) if ($grant) $role->add_cap($cap);
        }

        $admin = get_role('administrator');
        if ($admin) $admin->add_cap(self::MANAGE_CONTENT);
    }

    public static function settingsCapability(): string
    {
        return self::MANAGE_CONTENT;
    }
}
```

- [ ] **Step 4: Register capability lifecycle and settings groups**

In plugin bootstrap require `Capabilities.php`. In `Plugin::register()`:

```php
add_action('init', [Capabilities::class, 'ensure'], 20);
foreach (['rosa_business', 'rosa_media', 'rosa_content_site', 'rosa_content_shop'] as $group) {
    add_filter('option_page_capability_' . $group, [Capabilities::class, 'settingsCapability']);
}
```

Do not lower technical plugin/theme configuration capabilities.

- [ ] **Step 5: Switch normal Rosa content UI to the custom capability**

Use `Capabilities::MANAGE_CONTENT` in Rosa menu/submenus, ContentPage, BusinessSettings render page, and ElementorShortcutPage. After resolving an Elementor page ID also require:

```php
if (! current_user_can('edit_post', $pageId)) {
    self::notice(__('You do not have permission to edit this page.', 'rosa-medical'), admin_url());
    return;
}
```

- [ ] **Step 6: Verify runtime role safety**

After bootstrap:

```bash
bash wordpress/scripts/foundation-bootstrap.sh
docker compose -f wordpress/dev/compose.yaml run --rm wpcli eval '
$role=get_role("rosa_content_manager");
if(!$role) WP_CLI::error("Rosa Content Manager role missing");
foreach(["rosa_manage_content","edit_pages","upload_files","edit_products"] as $cap){
  if(empty($role->capabilities[$cap])) WP_CLI::error("Missing capability: {$cap}");
}
foreach(["install_plugins","edit_plugins","update_plugins","switch_themes","edit_themes"] as $cap){
  if(!empty($role->capabilities[$cap])) WP_CLI::error("Forbidden capability: {$cap}");
}
WP_CLI::success("Rosa content-manager boundary verified");
'
```

- [ ] **Step 7: Verify admin/editor links**

```bash
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core \
  wordpress/scripts/tests/client-preview-admin-contract.test.sh
git commit -m "feat(wordpress): add Rosa content-manager editing boundary"
```

---

### Task 12: Integrate Secondary Fidelity into the Full Verifier

**Files:**
- Modify: `wordpress/scripts/client-preview-runtime-verify.sh`
- Modify: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`

**Interfaces:**
- Consumes: all focused tests.
- Produces: ordinary offline-friendly verifier plus strict target-parity mode when `ROSA_REFERENCE_URL` is supplied.

- [ ] **Step 1: Add syntax gate**

```bash
run node --check wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs
```

- [ ] **Step 2: Add strict parity execution without making normal verification internet-dependent**

After resolving `$home_url`:

```bash
if [[ -n "${ROSA_REFERENCE_URL:-}" ]]; then
  run node wordpress/scripts/tests/client-preview-secondary-fidelity.test.mjs \
    "$ROSA_REFERENCE_URL" "$home_url"
fi
```

- [ ] **Step 3: Pin this integration in tooling contract**

Require `ROSA_REFERENCE_URL` and `client-preview-secondary-fidelity.test.mjs` in verifier source.

- [ ] **Step 4: Run normal verifier**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS without reference runtime.

- [ ] **Step 5: Run strict verifier**

```bash
ROSA_REFERENCE_URL=http://localhost:8090/ bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS including secondary geometry/style parity.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh \
  wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
git commit -m "test(wordpress): gate strict runtime on finished target parity"
```

---

### Task 13: Final Visual Acceptance, Cleanup, and Local Completion Boundary

**Files:**
- Evidence: `artifacts/exact-elementor-parity/final/`.
- Candidate cleanup only after zero-reference proof: seven `latest-home-*.php` partials, stale `rosa_is_latest_home_page()` helper, stale `latest-rosa-home-parity-capture-contract.test.sh` if it no longer guards active behavior.
- Update if inaccurate: `docs/runbooks/wordpress-client-content-controls.md`.

**Interfaces:**
- Consumes: strict green verifier.
- Produces: accepted local implementation ready for a separate staging/deployment decision.

- [ ] **Step 1: Generate final pinned/current captures**

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  http://localhost:8090/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/final/pinned-target
```

- [ ] **Step 2: Generate production confirmation captures**

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/ \
  artifacts/exact-elementor-parity/final/production-confirmation
```

- [ ] **Step 3: Human-review matrix**

Review at minimum:

```text
Home EN/AR     1440, 1024, 768, 390
About EN/AR    1440, 1024, 390
Contact EN/AR  1440, 1024, 390
Shop EN/AR     1440, 1024, 390
Product Detail 1440, 1024, 390
```

Check section order, rail/spacing, typography, crop/aspect ratio, grids, CTA/footer, responsive stacking, RTL logical spacing, clipping/overlap, and media.

- [ ] **Step 4: If visual drift remains, reopen RED→GREEN instead of rationalizing it**

Identify the exact selector/source, add a focused failing assertion, make the minimum root-cause repair, rerun strict verifier, regenerate affected captures.

- [ ] **Step 5: Prove stale latest-custom Home code is dead before deletion**

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

Classify hits as active runtime, negative guard, historical documentation, or dead runtime. Delete only dead runtime; keep historical specs/plans.

- [ ] **Step 6: Verify after cleanup**

```bash
bash wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
ROSA_REFERENCE_URL=http://localhost:8090/ bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected: PASS.

- [ ] **Step 7: Run complete authoring/ownership/accessibility acceptance again**

```bash
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
bash wordpress/scripts/client-preview-responsive-capture.sh
```

Expected: all PASS; responsive capture creates its existing 64 screenshots.

- [ ] **Step 8: Update runbook ownership model**

Document exactly:

```text
Home/About/Contact -> Edit with Elementor
Products/categories/attributes -> WooCommerce
Phone/email/address/WhatsApp -> Rosa Business
Shared CTA/site copy -> Rosa Site & CTA
Routine seeds -> non-destructive; never use --force normally
Rosa Content Manager -> page/media/catalogue/content permissions without plugin/theme installation permissions
```

- [ ] **Step 9: Record final local state**

```bash
git status --short
git log --oneline --decorate -20
```

Account for every remaining Task-0 untracked file explicitly; do not silently delete it.

- [ ] **Step 10: Stop before Hostinger/production**

Do not run export/upload/database-import/DNS/production verification steps until the user separately approves staging/deployment.

- [ ] **Step 11: Commit cleanup/runbook changes if present**

```bash
git commit -m "chore(wordpress): finalize exact Elementor parity locally"
```

---

## Final Acceptance Checklist

Local completion requires every item:

- [ ] Arabic Home Who RTL regression is green and Home remains visually accepted.
- [ ] About EN/AR matches the pinned finished target at required viewports.
- [ ] Contact EN/AR matches the pinned finished target at required viewports.
- [ ] Shop EN/AR preserves finished Rosa appearance and remains Woo-owned.
- [ ] Representative Product Detail remains dynamic and matches the approved Rosa implementation; no unsupported MedicaShop Single Product fidelity claim is made.
- [ ] A public category/family route is verified when the current routing model actually exposes one.
- [ ] Shared announcement/header/footer/pre-footer CTA is one code-owned implementation across pages.
- [ ] Home/About/Contact are genuine Elementor Free documents with real editor URLs.
- [ ] Representative EN/AR edits on all three page types persist independently.
- [ ] Home media edit persists.
- [ ] Routine seeds do not erase client-edited Elementor documents.
- [ ] Woo product data and shared business values are absent from Elementor JSON.
- [ ] Business/Site values remain centralized and dynamic.
- [ ] Contact remains mailto/presentation-only.
- [ ] `rosa_content_manager` can edit approved page/media/catalogue/content surfaces but cannot install/edit/update plugins or themes.
- [ ] No Elementor Pro/proprietary demo runtime dependency exists.
- [ ] No unintended overflow, vertical collision, broken required media, browser error, or RTL regression remains.
- [ ] `ROSA_REFERENCE_URL=http://localhost:8090/ bash wordpress/scripts/client-preview-runtime-verify.sh` passes.
- [ ] Final side-by-side human review passes.
- [ ] Superseded latest-custom Home runtime cannot override the finished-template target.
- [ ] Hostinger/production remains untouched until separate approval.
