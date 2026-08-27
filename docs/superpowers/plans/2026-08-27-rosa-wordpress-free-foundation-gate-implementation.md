# Rosa Medical Free WordPress Foundation Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove that Rosa Medical can begin its WordPress migration using only WordPress, Hello Elementor, Elementor Free, WooCommerce, the Rosa child theme, and `rosa-medical-core`, with no MedicaShop, Elementor Pro, WPML, Hostinger access, or paid dependency.

**Architecture:** Elementor Free is limited to ordinary editable marketing content. The Rosa child theme owns the protected site shell and responsive/RTL presentation primitives, WooCommerce owns structured catalogue data, and `rosa-medical-core` owns reusable business settings plus Rosa-specific behavior. This phase uses one representative product and representative pages only; the full catalogue, filters, pricing system, inquiry/quotation system, and multilingual solution are later phase plans after this gate passes.

**Tech Stack:** WordPress current stable; Hello Elementor current stable; Elementor Free current stable; WooCommerce current stable; PHP 8.x; MariaDB 11.4 local container; WP-CLI; Docker Compose v2; Bash test scripts; Rosa-owned PHP/CSS.

**Spec:** `docs/superpowers/specs/2026-08-27-rosa-wordpress-free-custom-foundation-design.md`

## Global Constraints

- No MedicaShop purchase or ZIP is required.
- No Elementor Pro purchase or plugin is required.
- No WPML or other paid multilingual plugin is required in this phase.
- Hostinger, Cloudflare production, live Rosa databases, unrelated domains and unrelated sites remain untouched.
- Existing `apps/web/**` and `supabase/**` remain read-only behavioral/data references during this phase.
- Only real Rosa product configurations may be represented; never create artificial Size × Direction × Variant combinations.
- Product identifiers/SKUs remain authoritative and language-independent.
- Complex Product Detail/catalogue behavior must not be implemented as manually duplicated Elementor pages.
- Theme code owns presentation only; Rosa business logic belongs in `rosa-medical-core`.
- Custom strings must be translation-ready and layout/CSS must be RTL-safe from the start.
- The gate is not complete until a disposable local WordPress instance proves the required behaviors and can be reset safely.

---

## File Structure Locked for This Phase

```text
wordpress/
├── README.md
├── dev/
│   ├── compose.yaml
│   ├── .env.example
│   └── wp-cli.yml
├── scripts/
│   ├── foundation-preflight.sh
│   ├── foundation-bootstrap.sh
│   ├── foundation-seed.sh
│   ├── foundation-verify.sh
│   ├── foundation-version-report.sh
│   ├── reset-local.sh
│   └── tests/
│       ├── foundation-preflight.test.sh
│       └── foundation-contract.test.sh
└── wp-content/
    ├── plugins/
    │   └── rosa-medical-core/
    │       ├── rosa-medical-core.php
    │       ├── src/
    │       │   ├── Plugin.php
    │       │   └── Settings/BusinessSettings.php
    │       └── templates/product-detail-prototype.php
    └── themes/
        └── rosa-medical-child/
            ├── style.css
            ├── functions.php
            ├── header.php
            ├── footer.php
            └── assets/css/
                ├── tokens.css
                └── base.css

docs/
├── runbooks/wordpress-local.md
└── superpowers/reports/2026-08-27-wordpress-free-foundation-gate.md
```

---

### Task 1: Remove the obsolete paid/template preflight contract

**Files:**
- Modify: `wordpress/scripts/gate0-preflight.sh` or replace it with `wordpress/scripts/foundation-preflight.sh`
- Modify: `wordpress/scripts/tests/gate0-preflight.test.sh` or replace it with `wordpress/scripts/tests/foundation-preflight.test.sh`
- Modify: `wordpress/dev/.env.example`
- Modify: `wordpress/README.md`
- Modify: `docs/runbooks/wordpress-local.md`

**Interfaces:**
- Consumes: local shell and Docker availability only.
- Produces: `foundation-preflight.sh` that validates Docker + Compose v2 and contains zero MedicaShop/Elementor-Pro requirements.

- [ ] **Step 1: Write the failing free-foundation preflight test**

The test must fail against the current script because current behavior requires `ROSA_MEDICASHOP_KIT_ZIP`.

```bash
output="$(PATH="$FAKE_DOCKER_PATH:$PATH" bash wordpress/scripts/foundation-preflight.sh 2>&1)"
[[ "$output" == *"Foundation preflight passed"* ]]
[[ "$output" != *"MEDICASHOP"* ]]
[[ "$output" != *"ELEMENTOR_PRO"* ]]
```

- [ ] **Step 2: Run the test and verify RED**

Run: `bash wordpress/scripts/tests/foundation-preflight.test.sh`

Expected: FAIL because the new free-foundation contract is not implemented yet.

- [ ] **Step 3: Implement the minimal preflight**

`foundation-preflight.sh` checks only:

```bash
command -v docker >/dev/null 2>&1
docker compose version >/dev/null 2>&1
```

Failure messages must explicitly identify Docker or Compose; success prints `Foundation preflight passed.`

- [ ] **Step 4: Remove obsolete environment variables/documentation**

Delete `ROSA_GATE0_MODE`, `ROSA_MEDICASHOP_KIT_ZIP`, and `ROSA_ELEMENTOR_PRO_ZIP` from the active local workflow. The previous historical plan/spec may remain for audit history, but active runbooks must identify the new free foundation spec as authoritative.

- [ ] **Step 5: Run tests and syntax checks**

Run:

```bash
bash wordpress/scripts/tests/foundation-preflight.test.sh
bash -n wordpress/scripts/foundation-preflight.sh
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add wordpress/scripts wordpress/dev/.env.example wordpress/README.md docs/runbooks/wordpress-local.md
git commit -m "build(wordpress): replace MedicaShop preflight with free foundation gate"
```

---

### Task 2: Make the disposable environment mount Rosa-owned source

**Files:**
- Modify: `wordpress/dev/compose.yaml`
- Modify: `wordpress/scripts/gate0-bootstrap.sh` → `wordpress/scripts/foundation-bootstrap.sh`
- Modify: `wordpress/scripts/gate0-version-report.sh` → `wordpress/scripts/foundation-version-report.sh`
- Test: `wordpress/scripts/tests/foundation-contract.test.sh`

**Interfaces:**
- Consumes: `foundation-preflight.sh`, `wordpress/wp-content/plugins/rosa-medical-core`, `wordpress/wp-content/themes/rosa-medical-child`.
- Produces: local WordPress at `http://localhost:${ROSA_WP_PORT:-8088}`, WP-CLI access, source-mounted plugin/theme, exact runtime report.

- [ ] **Step 1: Write a failing Compose/bootstrap contract test**

Assert the active files:

```bash
grep -q 'wordpress/wp-content/plugins' wordpress/dev/compose.yaml
grep -q 'wordpress/wp-content/themes' wordpress/dev/compose.yaml
! grep -qi 'medicashop\|elementor-pro' wordpress/scripts/foundation-bootstrap.sh
```

- [ ] **Step 2: Run contract test and verify RED**

Run: `bash wordpress/scripts/tests/foundation-contract.test.sh`

Expected: FAIL because the existing bootstrap still contains MedicaShop/Pro behavior and source mounts do not yet exist.

- [ ] **Step 3: Mount Rosa plugin/theme source into WordPress and WP-CLI containers**

Use bind mounts for only the Rosa-owned plugin/theme directories while retaining named volumes for WordPress runtime/database state.

- [ ] **Step 4: Implement idempotent free bootstrap**

The bootstrap must:

```bash
bash wordpress/scripts/foundation-preflight.sh
docker compose -f wordpress/dev/compose.yaml up -d db wordpress
# wait for WordPress
# install WordPress if not already installed
wp theme install hello-elementor
wp plugin install elementor --activate
wp plugin install woocommerce --activate
wp theme activate rosa-medical-child
wp plugin activate rosa-medical-core
```

It must not install or reference MedicaShop, Elementor Pro, ElementsKit, Skyboot, WPML or Hostinger.

- [ ] **Step 5: Update runtime reporting**

Report WordPress, PHP, MariaDB, active theme, Elementor, WooCommerce and `rosa-medical-core`. Do not report obsolete paid/template dependencies.

- [ ] **Step 6: Run shell contract tests**

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/dev wordpress/scripts
git commit -m "build(wordpress): mount Rosa free foundation source"
```

---

### Task 3: Add the Rosa child-theme shell and design tokens

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/style.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/header.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`

**Interfaces:**
- Consumes: Hello Elementor as parent theme.
- Produces: protected Rosa site shell, `rosa_business_value($key)` rendering hook supplied by Task 4, RTL-safe CSS primitives.

- [ ] **Step 1: Write a static contract assertion before implementation**

The contract test requires:

```bash
grep -q 'Template: hello-elementor' wordpress/wp-content/themes/rosa-medical-child/style.css
grep -q -- '--rosa-red:' wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css
grep -q 'dir="' wordpress/wp-content/themes/rosa-medical-child/header.php
```

- [ ] **Step 2: Run and verify RED**

Expected: FAIL because the child theme does not exist yet.

- [ ] **Step 3: Implement theme metadata and asset loading**

`functions.php` only performs presentation/theme setup and asset enqueueing. It must not implement pricing, filtering, quotes or product-domain logic.

- [ ] **Step 4: Implement Rosa tokens**

Define centralized CSS custom properties for Rosa red, near-black, white, neutral surfaces, text, muted text, borders, focus/error/success, spacing, content width, typography and motion. Use logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline-*`) for RTL safety.

- [ ] **Step 5: Implement header/footer shell**

Header/footer structural markup remains developer-controlled. Contact/company values must be rendered through the centralized settings interface from Task 4, never hard-coded across both files.

- [ ] **Step 6: Run PHP syntax and contract checks**

Run:

```bash
php -l wordpress/wp-content/themes/rosa-medical-child/functions.php
php -l wordpress/wp-content/themes/rosa-medical-child/header.php
php -l wordpress/wp-content/themes/rosa-medical-child/footer.php
bash wordpress/scripts/tests/foundation-contract.test.sh
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child wordpress/scripts/tests/foundation-contract.test.sh
git commit -m "feat(wordpress): add Rosa child-theme shell"
```

---

### Task 4: Add `rosa-medical-core` foundation and centralized business settings

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Settings/BusinessSettings.php`

**Interfaces:**
- Produces:
  - `RosaMedical\Core\Plugin::register(): void`
  - `RosaMedical\Core\Settings\BusinessSettings::get(string $key, string $default = ''): string`
  - global presentation helper `rosa_business_value(string $key, string $default = ''): string`
- Settings keys for this gate: `phone`, `email`, `address`, `whatsapp`, `primary_cta_label`.

- [ ] **Step 1: Write a failing pure-PHP settings contract test**

Create a test harness that stubs `get_option()` and verifies unknown keys return the supplied default and known values are escaped at output rather than mutated at storage.

- [ ] **Step 2: Run and verify RED**

Run with PHP CLI; expected FAIL because classes do not exist.

- [ ] **Step 3: Implement minimal plugin bootstrap**

The plugin registers translation-ready text domain hooks and the settings admin surface. No product/filter/pricing/quotation implementation belongs in this task.

- [ ] **Step 4: Implement centralized settings**

Use one option array, e.g. `rosa_business_settings`, with an allowlist of the five gate keys. Sanitize each field server-side using WordPress sanitizers appropriate to its value.

- [ ] **Step 5: Render the same setting in two independent surfaces**

Use `rosa_business_value('phone')` in both header and footer. Changing the option once must change both surfaces after refresh.

- [ ] **Step 6: Run PHP syntax/static contract checks**

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core wordpress/wp-content/themes/rosa-medical-child
git commit -m "feat(wordpress): add Rosa core settings foundation"
```

---

### Task 5: Seed one real representative WooCommerce variable product and shared Product Detail prototype

**Files:**
- Create: `wordpress/scripts/foundation-seed.sh`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php`

**Interfaces:**
- Consumes: WooCommerce; one verified configuration family from existing Rosa catalogue data.
- Produces: one published variable product with exact SKUs/configurations and one shared detail template that reads WooCommerce product/variation data dynamically.

- [ ] **Step 1: Select a small verified catalogue fixture**

Use catalogue evidence already present in the project. A valid example is Iris Scissors, whose catalogue lists distinct straight/curved SKUs at the same size; do not invent combinations beyond documented codes. The supplied Scissors catalogue is authoritative evidence for this fixture. fileciteturn1file2

- [ ] **Step 2: Write seed verification before seed implementation**

The verification must assert:

```text
parent product exists
expected exact variation SKUs exist
no extra variation SKU exists
product detail route resolves
selected variation exposes SKU + attributes
```

- [ ] **Step 3: Run verification and establish RED**

Expected: FAIL because fixture/product template does not exist.

- [ ] **Step 4: Implement idempotent seed script**

Use WP-CLI/WooCommerce APIs so rerunning updates or reuses the same fixture rather than duplicating products/attributes/variations.

- [ ] **Step 5: Implement one shared product-detail prototype**

Render product name, family, product image, available real configurations, selected variation SKU/attributes and a placeholder procurement CTA. Do not implement final Rosa pricing or Inquiry logic yet; those are later phase plans.

- [ ] **Step 6: Re-run seed + verification**

Expected: PASS with exact fixture parity.

- [ ] **Step 7: Commit**

```bash
git add wordpress/scripts/foundation-seed.sh wordpress/wp-content/plugins/rosa-medical-core
git commit -m "feat(wordpress): prove dynamic WooCommerce product rendering"
```

---

### Task 6: Prove Elementor Free editorial editing and RTL shell behavior

**Files:**
- Create/Modify: `wordpress/scripts/foundation-verify.sh`
- Modify: `docs/runbooks/wordpress-local.md`

**Interfaces:**
- Consumes: running free foundation, child theme, plugin, Elementor Free.
- Produces: reproducible gate checklist for Home/About/Contact editing plus RTL/runtime assertions.

- [ ] **Step 1: Bootstrap representative pages**

Create Home, About and Contact pages and assign the Home page as `show_on_front=page`. Ensure Elementor is enabled for `page` post type.

- [ ] **Step 2: Manually create/reopen/save one representative Elementor section on each page**

This is an explicit compatibility assertion because Elementor editor persistence cannot be truthfully proven by static source inspection. Record pass/fail for create → save → reopen → edit → save.

- [ ] **Step 3: Verify RTL shell programmatically**

Install the WordPress Arabic language pack locally, switch locale temporarily, and assert WordPress reports RTL while header/footer/product prototype produce no fatal error. Restore the normal development locale afterward.

- [ ] **Step 4: Verify representative responsive widths**

For this foundation gate inspect at minimum ~390, 768, 1024, 1440 and 1920 px. This proves shell integrity only; final 390/430/768/1024/1366/1440/1920/2560 acceptance remains a later phase.

- [ ] **Step 5: Check PHP/debug logs and browser console**

Gate fails on fatal PHP errors or console-breaking JavaScript errors.

- [ ] **Step 6: Verify safe reset**

Run:

```bash
ROSA_GATE0_CONFIRM_RESET=yes bash wordpress/scripts/reset-local.sh
```

Then confirm only Rosa local Compose containers/volumes are removed.

- [ ] **Step 7: Commit verification tooling/runbook**

```bash
git add wordpress/scripts/foundation-verify.sh docs/runbooks/wordpress-local.md
git commit -m "test(wordpress): add free foundation acceptance checks"
```

---

### Task 7: Record the foundation-gate decision

**Files:**
- Create: `docs/superpowers/reports/2026-08-27-wordpress-free-foundation-gate.md`

**Interfaces:**
- Consumes: all Task 1–6 evidence.
- Produces: exactly one decision: `PASS`, `PASS_WITH_FOUNDATION_REPAIRS`, or `FAIL_FREE_FOUNDATION`.

- [ ] **Step 1: Run all source-level checks**

```bash
bash wordpress/scripts/tests/foundation-preflight.test.sh
bash wordpress/scripts/tests/foundation-contract.test.sh
find wordpress/scripts -name '*.sh' -print0 | xargs -0 -n1 bash -n
find wordpress/wp-content -name '*.php' -print0 | xargs -0 -n1 php -l
```

Expected: PASS.

- [ ] **Step 2: Run full local WordPress gate**

```bash
bash wordpress/scripts/foundation-bootstrap.sh
bash wordpress/scripts/foundation-seed.sh
bash wordpress/scripts/foundation-verify.sh
bash wordpress/scripts/foundation-version-report.sh
```

Expected: WordPress/Elementor/WooCommerce/Rosa theme/plugin active; representative product/detail/settings/RTL/editability checks pass.

- [ ] **Step 3: Write evidence report**

The report records exact runtime versions, each acceptance item, any bounded repair performed, and one final status.

- [ ] **Step 4: Apply the stop/go rule**

- `PASS` → begin Phase 2 plan: Rosa child theme/design-system shell + plugin foundations beyond the prototype.
- `PASS_WITH_FOUNDATION_REPAIRS` → document repairs, rerun Task 7 checks, then proceed only when green.
- `FAIL_FREE_FOUNDATION` → stop. Do not start catalogue migration; revisit only the failed architectural assumption.

- [ ] **Step 5: Commit gate evidence**

```bash
git add docs/superpowers/reports/2026-08-27-wordpress-free-foundation-gate.md
git commit -m "docs: record free WordPress foundation gate"
```

---

## Self-Review Result

- Spec coverage for the foundation gate: WordPress boot, Elementor Free editing, WooCommerce real-variation fixture, shared Product Detail prototype, centralized business settings, responsive shell, RTL shell, fatal/console-error checks and safe reset are all assigned to explicit tasks.
- MedicaShop, Elementor Pro, ElementsKit, Skyboot and WPML are absent from the active baseline and only historical documents may still mention them.
- Full catalogue import, advanced filters/search, production pricing, Inquiry/quotation, complete Arabic translation, client-role hardening, performance/security and staging/production launch are intentionally excluded from this first plan and will receive separate phase plans after this gate passes.
- No Hostinger operation exists anywhere in this plan.
