# Rosa Medical Client-Handoff Phase 1 Health-Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the first client-handoff gate by making the existing accessibility suite green, proving every primary EN/AR route is healthy across the handoff viewport matrix, and adding an explicit same-origin link/user-flow contract that exposes dead ends rather than relying on historical visual parity.

**Architecture:** Keep the current WordPress/Elementor/WooCommerce ownership model unchanged. Reuse the existing Playwright runtime stack and `settlePageMedia()` helper. The new health-flow contract is a handoff-oriented browser gate alongside—not inside—the existing accessibility and historical fidelity tests. It must discover the representative Product Detail's actual Arabic counterpart through the rendered language-switch relationship; it may not invent one.

**Tech Stack:** WordPress/PHP 8+, Elementor Free, WooCommerce, Rosa child theme/plugin, Docker Compose, WP-CLI, Node.js, Playwright through `apps/web`.

**Spec:** `docs/superpowers/specs/2026-09-07-client-handoff-finalization-design.md`

## Global Constraints

- Work only on `wordpress/client-content-controls`.
- Do not mutate Hostinger, live WordPress, production databases, DNS, or external services.
- Do not refresh or use frozen visual comparison as the acceptance target for this phase.
- Preserve Elementor ownership of Home/About/Contact EN+AR.
- Preserve Woo ownership of product data/media/SKUs/configurations.
- Preserve Rosa shared settings and the existing content-manager permission boundary.
- Every production correction follows RED -> minimal fix -> GREEN -> neighboring regression.
- Do not silently waive a missing Arabic Product Detail counterpart. Record it as a Phase 1 blocker.
- Do not fetch external mail/phone/WhatsApp/map destinations during automated link verification; validate their syntax only.

---

## Task 1: Fix the Shop Search Button 44px Target Under Existing RED

**Files:**
- Existing RED: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Regression: `wordpress/scripts/tests/live-shop-fidelity.test.mjs`

- [ ] **Step 1: Reproduce the existing RED**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

Expected current failure:

```text
Shop search button target height is below 44px
```

Do not change the test. It already expresses the required accessibility behavior.

- [ ] **Step 2: Apply the smallest production fix**

The Shop already uses an inline accessibility amendment for the search input in `functions.php`. Extend that existing Shop-only rule so the submit button also has a 44px minimum target:

```php
wp_add_inline_style(
    'rosa-shop-live-visual-recovery',
    '.rosa-live-shop-search input[type="search"]{min-height:44px;}'
    . '.rosa-live-shop-search input[type="search"]:focus-visible{outline:2px solid var(--preview-focus);outline-offset:2px;}'
    . '.rosa-live-shop-search .rosa-preview-button{min-height:44px;}'
);
```

This intentionally overrides the historical mobile `2.3rem` button height without reopening Shop layout tuning.

- [ ] **Step 3: Verify GREEN and Shop regression**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-shop-fidelity.test.mjs http://localhost:8088/
```

Expected: both PASS.

- [ ] **Step 4: Commit the isolated correction**

```bash
git add wordpress/wp-content/themes/rosa-medical-child/functions.php
git diff --cached --check
git commit -m "fix(wordpress): enforce Shop search touch targets"
```

---

## Task 2: Add the Focused Client-Handoff Health & Link Contract

**Files:**
- Create: `wordpress/scripts/tests/client-handoff-health-flow.test.mjs`
- Read/reuse: `wordpress/scripts/client-preview-capture.mjs`
- Read/protect: `wordpress/scripts/tests/client-preview-accessibility.test.mjs`

### Required contract structure

- [ ] **Step 1: Define the handoff route and viewport matrix**

Use exactly:

```js
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 431, height: 932 },
  { width: 390, height: 844 },
];

const marketingRoutes = [
  ['English Home', '/', 'en-US', 'ltr'],
  ['English About', '/about/', 'en-US', 'ltr'],
  ['English Contact', '/contact/', 'en-US', 'ltr'],
  ['English Shop', '/shop/', 'en-US', 'ltr'],
  ['Arabic Home', '/ar/', 'ar', 'rtl'],
  ['Arabic About', '/ar/about/', 'ar', 'rtl'],
  ['Arabic Contact', '/ar/contact/', 'ar', 'rtl'],
  ['Arabic Shop', '/ar/shop/', 'ar', 'rtl'],
];

const productPath = '/product/rosa-foundation-stevens-scissors-regular/';
```

- [ ] **Step 2: Discover—not invent—the Arabic Product Detail route**

At 1440px, open the representative English product and read `.rosa-preview-language`.

Require all of:

```text
href is same-origin
href does not resolve to generic /ar/
destination returns HTTP success
destination renders exactly one .rosa-product-detail
html lang="ar" and dir="rtl"
```

If the switch resolves to generic `/ar/` or the destination is not an Arabic product detail, fail with:

```text
representative Product Detail has no supported Arabic counterpart
```

The resolved path is then included in the full five-viewport health matrix.

- [ ] **Step 3: Implement per-route health assertions**

For every route and viewport:

```text
HTTP response is 2xx/3xx after normal redirect handling
exactly one main content region
exactly one shared footer/shell
expected lang/dir
scrollWidth <= clientWidth + 1
no pageerror
no console error
no forbidden reference/demo request
all rendered images settle successfully via settlePageMedia()
```

Use a fresh Playwright page for each route/viewport so event listeners and error arrays never leak between cases.

- [ ] **Step 4: Implement same-origin link collection and validation**

On representative desktop (`1440x900`) and mobile (`390x844`) only, collect rendered `a[href]` from all primary surfaces.

Reject:

```text
empty href
bare #
javascript: URLs
ThemeForest/MoxCreative/demo origins
same-origin destinations returning >= 400
fragment links whose target ID does not exist on the destination page
```

Validate without opening external services:

```text
mailto: has a non-empty valid mailbox before any ?query
tel: contains a dialable number
https://wa.me/... has a numeric recipient path
other external http(s) links are syntactically valid only
```

Deduplicate same-origin destinations before requesting them so the crawl stays fast.

- [ ] **Step 5: Encode explicit user flows**

Assert these relationships from actual rendered hrefs/behavior:

```text
Home -> Shop
Home shared CTA -> Contact #inquiry
About shared CTA -> Contact #inquiry
Shop real product card -> Product Detail
Product Detail quotation CTA -> Contact #inquiry
Header Home/About/Shop/Contact routes in EN and AR
EN Home language switch -> /ar/
AR Home language switch -> /
English Product language switch -> resolved Arabic Product Detail
Arabic Product language switch -> English Product Detail
mobile drawer opens and a real nav link navigates successfully
footer About/Contact/Products links resolve
footer mailto/tel links are syntactically valid
```

Do not make the test depend on link display copy where stable href/role/class selectors are available.

- [ ] **Step 6: Syntax-check and run the new contract**

```bash
node --check wordpress/scripts/tests/client-handoff-health-flow.test.mjs
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
```

Expected outcomes:

- PASS if all Phase 1 routing exists and is healthy; or
- one concrete actionable blocker, most likely the Product Detail bilingual pairing if it is not implemented yet.

Do not weaken the contract to turn a genuine missing bilingual route into PASS.

- [ ] **Step 7: Commit the contract independently**

```bash
git add wordpress/scripts/tests/client-handoff-health-flow.test.mjs
git diff --cached --check
git commit -m "test(wordpress): add client handoff health-flow gate"
```

---

## Task 3: Resolve Only Concrete Phase 1 Routing Defects Exposed by the Contract

**Files:** evidence-dependent; likely one or more of:
- `wordpress/wp-content/themes/rosa-medical-child/inc/client-preview.php`
- `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Woo/local fixture or pairing logic under `wordpress/wp-content/plugins/rosa-medical-core/**`
- Focused source/runtime test added before the production correction

- [ ] **Step 1: Stop on the first real RED**

Do not pre-implement an Arabic product URL. Inspect the actual WordPress/Woo pairing state first.

Suggested local diagnostics if Product Detail pairing fails:

```bash
docker compose -f wordpress/dev/compose.yaml run --rm wpcli post list \
  --post_type=product --post_status=publish \
  --fields=ID,post_title,post_name --format=table

docker compose -f wordpress/dev/compose.yaml run --rm wpcli post meta list \
  $(docker compose -f wordpress/dev/compose.yaml run --rm wpcli post list \
    --post_type=product --name=rosa-foundation-stevens-scissors-regular \
    --field=ID --format=ids | awk '{print $1}') --format=table
```

- [ ] **Step 2: Classify the defect before fixing**

Choose exactly one root cause:

```text
missing paired product record
existing paired record missing locale/pair metadata
language-switch resolver ignores an existing pair
fixture/seeder creates only an English representative product by design
```

- [ ] **Step 3: Add the smallest focused RED for that root cause**

Do not use the broad health-flow test as the only regression if a smaller PHP/source contract can precisely express the pairing rule.

- [ ] **Step 4: Implement the minimum architecture-consistent fix**

Keep product truth in WooCommerce. Do not serialize duplicate product data into Elementor or hard-code a fake Arabic product route.

- [ ] **Step 5: Rerun the health-flow and product regressions**

```bash
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/live-product-detail-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
```

Commit only after GREEN.

---

## Task 4: Wire the Health-Flow Gate into Normal Runtime Verification Once GREEN

**Files:**
- Modify first as RED source contract: `wordpress/scripts/tests/client-preview-runtime-tooling.test.sh`
- Then modify: `wordpress/scripts/client-preview-runtime-verify.sh`

- [ ] **Step 1: Extend the tooling contract first**

Require both syntax and runtime inclusion:

```bash
grep -Fq 'client-handoff-health-flow.test.mjs' "$RUNTIME" \
  || fail 'runtime verification omits client handoff health-flow gate'
```

Run and observe RED:

```bash
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
```

- [ ] **Step 2: Wire the GREEN health-flow test**

Add:

```bash
run node --check wordpress/scripts/tests/client-handoff-health-flow.test.mjs
...
run node wordpress/scripts/tests/client-handoff-health-flow.test.mjs "$home_url"
```

Do not make it conditional on frozen-live environment variables.

- [ ] **Step 3: Verify tooling and focused runtime gates**

```bash
bash wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
```

- [ ] **Step 4: Commit verifier integration**

```bash
git add wordpress/scripts/client-preview-runtime-verify.sh \
        wordpress/scripts/tests/client-preview-runtime-tooling.test.sh
git diff --cached --check
git commit -m "test(wordpress): gate runtime on client handoff flows"
```

---

## Task 5: Phase 1 Completion Regression

- [ ] **Step 1: Run focused Phase 1 suite**

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-handoff-health-flow.test.mjs http://localhost:8088/
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-about-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-contact-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-shop-fidelity.test.mjs http://localhost:8088/
bash wordpress/scripts/foundation-product-verify.sh
node wordpress/scripts/tests/live-product-detail-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-layout.test.mjs http://localhost:8088/
node wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs http://localhost:8088/
```

- [ ] **Step 2: Run ownership/editability regressions before declaring Phase 1 closed**

```bash
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
bash wordpress/scripts/tests/client-preview-content-manager-runtime.test.sh
```

- [ ] **Step 3: Run the normal master verifier**

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Do not set `ROSA_LIVE_BASELINE_DIR`; historical strict visual comparison is not part of handoff acceptance.

## Plan Self-Review

- Covers the approved Phase 1 route/viewports, functional flows, dead-link crawl, console/runtime/media/overflow checks, and 44px correction.
- Preserves Elementor/Woo/settings ownership boundaries.
- Explicitly treats Arabic Product Detail pairing as discovered runtime truth rather than a guessed URL.
- Uses the existing accessibility RED for the known button defect instead of duplicating tests.
- Keeps external service validation non-destructive.
- Defers master-verifier integration until the focused contract itself is GREEN, preventing a knowingly broken broad verifier from obscuring the root cause.
- Contains no placeholders or unspecified production changes; any newly discovered routing defect receives its own focused TDD cycle before implementation.
