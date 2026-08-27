# Rosa Medical WordPress + MedicaShop Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the custom Next.js public runtime with a maintainable WordPress/Elementor implementation that preserves Rosa's verified catalogue, advanced discovery, configuration-aware SAR pricing, inquiry/quotation behavior, multilingual requirements, responsive quality and safe client editability.

**Architecture:** MedicaShop is only the visual foundation. WordPress + Elementor + the Rosa child theme own presentation, WooCommerce owns structured catalogue data, and the custom `rosa-medical-core` plugin owns Rosa-specific business logic and persistence. The existing Next.js/Supabase implementation remains read-only migration/reference material until each WordPress subsystem has passed parity acceptance.

**Tech Stack:** WordPress current stable; Hello Elementor; Elementor current stable + Elementor Pro; WooCommerce current stable; WPML + WooCommerce multilingual integration; ElementsKit Lite and Skyboot Custom Icons only where imported MedicaShop templates still require them; PHP/Composer tooling for `rosa-medical-core`; Docker Compose + WP-CLI for isolated local development; Playwright for browser acceptance; existing Next.js/TypeScript catalogue data as migration source.

**Spec:** `docs/superpowers/specs/2026-08-27-rosa-wordpress-medicashop-migration-design.md`

## Global Constraints

- Authoritative source branch at plan creation: `transfer/rose-medical-final-main-ready-2026-08-17` at `57f2df01916ec1d7de65196994913711e9fb3039`.
- Read the full root `README.md`, the migration spec above, `docs/architecture/2026-08-07-catalogue-field-parity.md`, `docs/architecture/2026-08-23-quotation-pricing-schema.md`, and `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md` before execution.
- Do not delete, rewrite or silently mutate the existing Next.js/Supabase implementation during migration. It remains the behavioural and data reference until cutover is explicitly accepted.
- Do not access Hostinger during Gate 0 or local implementation. Any Hostinger read/write requires a separate explicit user approval for the exact Rosa target.
- Never publish a Hostinger staging copy over production without a fresh backup, exact target confirmation, rollback path and explicit approval.
- Do not commit WordPress core, purchased Elementor Pro archives, the purchased MedicaShop ZIP, licences, secrets, database dumps containing sensitive data, or generated uploads.
- Use one WordPress installation for English and Arabic; technical identifiers such as SKU remain language-stable.
- Product families remain Knives, Scissors, Cutters, Chisels and Punches unless verified catalogue evidence requires another family.
- Product configurations must represent only real catalogue combinations; never generate a Cartesian product of Size × Direction × Variant.
- Code Group is derived from authoritative SKU/code, not manually maintained as a second source of truth.
- Pricing authoring source is `_rosa_base_price` and `_rosa_price_override`; effective price is `override ?? base ?? null`; `null` means `Price on request`; zero is valid; negative values are invalid; input precision is at most two decimals.
- Standard WooCommerce price fields are compatibility projections only and must be synchronized deterministically from Rosa pricing semantics.
- Rosa remains quotation-led. Do not add consumer checkout, payment gateways, shipping/tax calculations, stock reservation, customer accounts, wishlist, ratings/reviews, marketplace/vendor features, CRM, ERP or speculative marketing automation.
- Quotations use dedicated Rosa persistence and server-authoritative product/configuration/pricing validation. Do not use WooCommerce Orders as the primary quotation store.
- Client staff receive least-privilege operational access; ordinary content managers must not be able to change plugins, themes, PHP, Rosa business logic, deployment/security configuration or unrelated account-level settings.
- Responsive acceptance must explicitly cover approximately 390, 430, 768, 1024, 1366, 1440, 1920 and 2560 px widths in English and Arabic where relevant.
- Use TDD for `rosa-medical-core` domain behavior. Every task starts with a failing focused test or an explicit compatibility assertion, proves failure, implements the minimum change, then proves green.
- Prefer local verification over unnecessary GitHub Actions runs.

---

## File Structure Locked by This Plan

Only custom source and migration tooling are version-controlled. WordPress core/database/uploads remain environment state.

```text
RosaMedical/
├── apps/web/**                                  # existing custom reference; preserve
├── supabase/**                                  # existing reference/history; preserve
├── tools/
│   └── wordpress/
│       ├── export-catalogue-manifest.mjs        # produces canonical migration JSON
│       └── verify-catalogue-export.mjs          # parity checks against current source
├── wordpress/
│   ├── README.md
│   ├── .gitignore
│   ├── composer.json
│   ├── composer.lock
│   ├── phpcs.xml.dist
│   ├── phpunit.xml.dist
│   ├── dev/
│   │   ├── compose.yaml
│   │   ├── .env.example
│   │   └── wp-cli.yml
│   ├── scripts/
│   │   ├── gate0-preflight.sh
│   │   ├── gate0-bootstrap.sh
│   │   ├── gate0-version-report.sh
│   │   └── reset-local.sh
│   ├── migration/
│   │   ├── schema/rosa-catalogue-v1.schema.json
│   │   └── generated/rosa-catalogue-v1.json     # deterministic non-secret export
│   ├── tests/e2e/
│   │   ├── package.json
│   │   ├── playwright.config.ts
│   │   └── specs/
│   └── wp-content/
│       ├── plugins/
│       │   └── rosa-medical-core/
│       │       ├── rosa-medical-core.php
│       │       ├── src/
│       │       │   ├── Plugin.php
│       │       │   ├── Catalogue/
│       │       │   ├── Discovery/
│       │       │   ├── Pricing/
│       │       │   ├── Inquiry/
│       │       │   ├── Quotes/
│       │       │   ├── Import/
│       │       │   ├── Catalogues/
│       │       │   ├── Admin/
│       │       │   ├── Rest/
│       │       │   └── Elementor/
│       │       ├── assets/
│       │       │   ├── css/
│       │       │   └── js/
│       │       └── tests/
│       └── themes/
│           └── rosa-medical-child/
│               ├── style.css
│               ├── functions.php
│               └── assets/css/
├── docs/architecture/
│   ├── 2026-08-27-wordpress-runtime-baseline.md
│   ├── 2026-08-27-wordpress-catalogue-mapping.md
│   └── 2026-08-27-wordpress-quotation-storage.md
├── docs/runbooks/
│   ├── wordpress-local.md
│   ├── wordpress-staging-production.md
│   ├── wordpress-backup-restore.md
│   └── wordpress-client-editing.md
└── docs/superpowers/reports/
    └── 2026-08-27-medicashop-gate0-compatibility.md
```

The implementation may split large classes further, but must preserve the boundaries above: presentation, WooCommerce catalogue, and `rosa-medical-core` business logic must not collapse into one another.

---

### Task 1: Gate 0 — isolated MedicaShop compatibility environment

**Files:**
- Create: `wordpress/dev/compose.yaml`
- Create: `wordpress/dev/.env.example`
- Create: `wordpress/dev/wp-cli.yml`
- Create: `wordpress/scripts/gate0-preflight.sh`
- Create: `wordpress/scripts/gate0-bootstrap.sh`
- Create: `wordpress/scripts/gate0-version-report.sh`
- Create: `wordpress/scripts/reset-local.sh`
- Create: `wordpress/README.md`
- Create: `docs/runbooks/wordpress-local.md`

**Interfaces:**
- Consumes: locally supplied proprietary archives through environment variables `ROSA_ELEMENTOR_PRO_ZIP` and `ROSA_MEDICASHOP_KIT_ZIP`; no proprietary archive is copied into Git.
- Produces: isolated WordPress URL, WP-CLI access, exact runtime version report, and a reproducible reset procedure.

- [ ] **Step 1: Write the preflight failure contract**

`gate0-preflight.sh` must exit non-zero when either proprietary archive path is missing, when Docker is unavailable, or when a supplied archive path does not exist. Its output must name the missing prerequisite without printing licence keys or secrets.

- [ ] **Step 2: Run the preflight before creating the environment**

Run: `bash wordpress/scripts/gate0-preflight.sh`

Expected before local archive paths are configured: **FAIL** with a bounded prerequisite message. This proves Gate 0 cannot accidentally proceed with fake/free substitutes.

- [ ] **Step 3: Add the disposable Docker/WP-CLI environment**

`compose.yaml` must contain only Rosa-local services: WordPress, database and WP-CLI. Use named volumes dedicated to this project. Expose a non-production localhost port. Do not mount or connect to Hostinger, Cloudflare production data or any unrelated database.

- [ ] **Step 4: Implement bootstrap without proprietary files in Git**

`gate0-bootstrap.sh` must:

```bash
set -euo pipefail
bash "$(dirname "$0")/gate0-preflight.sh"
docker compose -f wordpress/dev/compose.yaml up -d
# install current stable free dependencies through wp-cli
# install Elementor Pro from "$ROSA_ELEMENTOR_PRO_ZIP"
# leave MedicaShop kit import for the documented Elementor import step
```

The script must be safe to rerun against the disposable local environment.

- [ ] **Step 5: Record exact versions instead of hard-coding stale plan values**

`gate0-version-report.sh` records WordPress, PHP, database, Elementor, Elementor Pro, WooCommerce, ElementsKit and Skyboot versions actually used. Save the accepted values later in `docs/architecture/2026-08-27-wordpress-runtime-baseline.md`.

- [ ] **Step 6: Verify reset isolation**

Run the documented reset and prove it destroys only the Rosa-local Docker volumes/containers. It must not contain commands targeting remote hosts.

- [ ] **Step 7: Commit**

```bash
git add wordpress/dev wordpress/scripts wordpress/README.md docs/runbooks/wordpress-local.md
git commit -m "build(wordpress): add isolated Gate 0 environment"
```

---

### Task 2: Gate 0 — import MedicaShop and make the compatibility decision

**Files:**
- Create: `docs/superpowers/reports/2026-08-27-medicashop-gate0-compatibility.md`
- Create: `docs/architecture/2026-08-27-wordpress-runtime-baseline.md`
- Create: `wordpress/tests/e2e/package.json`
- Create: `wordpress/tests/e2e/playwright.config.ts`
- Create: `wordpress/tests/e2e/specs/gate0-medicashop.spec.ts`

**Interfaces:**
- Consumes: Task 1 isolated environment and purchased MedicaShop kit.
- Produces: one explicit gate result: `PASS`, `PASS_WITH_REPAIRS`, or `REJECT_KIT`; exact current-runtime baseline; screenshots/browser evidence.

- [ ] **Step 1: Import the complete purchased kit through the supported Elementor kit workflow**

Import Home, About, Contact, Product Archive, Single Product, header/footer and global styles. Install ElementsKit Lite/Skyboot only if the imported kit reports a concrete dependency.

- [ ] **Step 2: Write browser assertions before repair work**

The Playwright spec must fail if any required imported template cannot render, if WooCommerce archive/single-product pages do not render, or if the representative RTL page has horizontal overflow.

Example assertion:

```ts
await page.goto('/shop/');
await expect(page.locator('body')).not.toContainText(/critical error|fatal error/i);
expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
```

- [ ] **Step 3: Run Gate 0 browser checks to establish RED/diagnostic state**

Run from `wordpress/tests/e2e`: `pnpm exec playwright test specs/gate0-medicashop.spec.ts`

Expected: any legacy incompatibility is captured as a concrete failing route/widget/layout assertion rather than hidden by manual optimism.

- [ ] **Step 4: Reopen and save each imported template in current Elementor**

Record whether each template reopens and saves without fatal PHP errors, missing required widget failures or console-breaking JavaScript errors.

- [ ] **Step 5: Inspect desktop/tablet/mobile and representative Arabic RTL**

Record screenshots around 390, 768, 1024, 1440 and 1920 px for Gate 0. This is compatibility evidence, not final Rosa visual acceptance.

- [ ] **Step 6: Apply only bounded compatibility repairs**

Repairs may address legacy container/widget import problems. Do not begin full Rosa page redesign inside Gate 0.

- [ ] **Step 7: Rerun the browser spec**

Expected for acceptance: PASS after bounded repairs, or a documented irreducible failure.

- [ ] **Step 8: Write the gate decision**

`PASS` → proceed.

`PASS_WITH_REPAIRS` → list every required compatibility patch and proceed.

`REJECT_KIT` → stop implementation before Tasks 3–16 and choose another visual template foundation while preserving the approved WordPress/WooCommerce/`rosa-medical-core` architecture.

- [ ] **Step 9: Commit Gate 0 evidence**

```bash
git add docs/superpowers/reports/2026-08-27-medicashop-gate0-compatibility.md \
        docs/architecture/2026-08-27-wordpress-runtime-baseline.md \
        wordpress/tests/e2e
git commit -m "test(wordpress): verify MedicaShop compatibility"
```

---

### Task 3: Create the version-controlled WordPress custom-code foundation

**Files:**
- Create: `wordpress/.gitignore`
- Create: `wordpress/composer.json`
- Create: `wordpress/phpunit.xml.dist`
- Create: `wordpress/phpcs.xml.dist`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Plugin.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/PluginTest.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/style.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/functions.php`

**Interfaces:**
- Consumes: accepted runtime baseline from Task 2.
- Produces: loadable `rosa-medical-core` plugin, minimal Hello Elementor child theme, Composer test/lint commands.

- [ ] **Step 1: Write a failing plugin bootstrap test**

The test asserts the plugin namespace/autoloader boots and `RosaMedical\Core\Plugin::VERSION` exists.

- [ ] **Step 2: Run PHPUnit and prove RED**

Run: `cd wordpress && composer test -- --filter PluginTest`

Expected: FAIL because the plugin class does not exist.

- [ ] **Step 3: Implement minimal plugin bootstrap**

```php
namespace RosaMedical\Core;

final class Plugin {
    public const VERSION = '0.1.0';
    public function register(): void {}
}
```

The entry file loads Composer autoload and calls `Plugin::register()` only after WordPress plugin load.

- [ ] **Step 4: Add child-theme metadata and enqueue only child assets**

Do not move business logic into `functions.php`.

- [ ] **Step 5: Add Composer commands**

Required scripts: `test`, `lint`, `phpcs` and `verify` (`test` + `phpcs`). Keep third-party dependencies development-only unless runtime code genuinely requires them.

- [ ] **Step 6: Run plugin unit + coding-standard checks**

Expected: PASS.

- [ ] **Step 7: Activate plugin and child theme in local WordPress**

Use WP-CLI. Confirm no fatal PHP error.

- [ ] **Step 8: Commit**

```bash
git add wordpress/.gitignore wordpress/composer.* wordpress/phpunit.xml.dist wordpress/phpcs.xml.dist \
        wordpress/wp-content/plugins/rosa-medical-core \
        wordpress/wp-content/themes/rosa-medical-child
git commit -m "feat(wordpress): add Rosa plugin and child-theme foundation"
```

---

### Task 4: Establish Rosa design tokens and presentation boundaries

**Files:**
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Create: `wordpress/tests/e2e/specs/rosa-design-foundation.spec.ts`

**Interfaces:**
- Consumes: accepted MedicaShop templates and current Rosa visual references.
- Produces: centralized Rosa visual token layer used by Elementor/global styles and custom widgets.

- [ ] **Step 1: Write browser assertions for global Rosa identity**

Assert the public shell exposes Rosa red, near-black, white/neutral surfaces, visible focus state and no MedicaShop pharmacy-green primary CTA treatment on the migrated test page.

- [ ] **Step 2: Run and prove RED against imported MedicaShop styling**

- [ ] **Step 3: Define CSS custom properties**

Create named variables for Rosa red, black/near-black, white, neutral surfaces, text, muted text, border, success/error/focus, content rails, spacing, radii, transition durations and easing. Use logical properties for direction-sensitive spacing.

- [ ] **Step 4: Mirror the approved values into Elementor Global Colors/Fonts**

Document the Elementor global token names in `wordpress/README.md`. Do not scatter one-off widget colours.

- [ ] **Step 5: Rerun browser assertions**

Expected: PASS without full page redesign.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/themes/rosa-medical-child wordpress/tests/e2e/specs/rosa-design-foundation.spec.ts
git commit -m "feat(wordpress): establish Rosa visual design system"
```

---

### Task 5: Define the WooCommerce catalogue schema and Rosa metadata contract

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/Attributes.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/CodeGroup.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductMetadata.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Catalogue/CodeGroupTest.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Catalogue/ProductMetadataTest.php`
- Create: `docs/architecture/2026-08-27-wordpress-catalogue-mapping.md`

**Interfaces:**
- Produces global attributes `pa_size`, `pa_direction`, `pa_variant`; product categories; derived Code Group; explicit product metadata for catalogue page/media/display semantics.
- `CodeGroup::fromSku(string $sku): string` is the only Code Group derivation entry point.

- [ ] **Step 1: Write representative Code Group tests**

Cover current `18-...`, `21-...` and other verified catalogue code patterns from the existing Product filtering specification. Assert raw SKU is never mutated.

- [ ] **Step 2: Prove RED**

Run the focused PHP unit tests.

- [ ] **Step 3: Implement deterministic Code Group derivation**

The implementation must reproduce the existing Rosa grouping rule from the approved custom-site helper/spec, not invent a new arbitrary taxonomy.

- [ ] **Step 4: Define typed product metadata accessors**

Store only Rosa-specific fields WooCommerce does not model cleanly, such as catalogue page reference and migration provenance. Do not duplicate SKU, standard product category or global attributes in custom meta without reason.

- [ ] **Step 5: Register global attributes/categories through idempotent setup code**

Repeated activation/setup must not create duplicate terms.

- [ ] **Step 6: Document exact mapping**

The architecture note maps current `CATALOGUE_METADATA_MANIFEST`, `catalogue-seed.sql`, media paths and catalogue PDFs into WooCommerce categories/products/variations/meta.

- [ ] **Step 7: Run tests + local WP-CLI inspection**

Verify exactly one Size, Direction and Variant global attribute exists and the five family categories exist.

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Catalogue \
        docs/architecture/2026-08-27-wordpress-catalogue-mapping.md
git commit -m "feat(wordpress): define WooCommerce catalogue model"
```

---

### Task 6: Export one canonical migration dataset from the existing Rosa source

**Files:**
- Create: `tools/wordpress/export-catalogue-manifest.mjs`
- Create: `tools/wordpress/verify-catalogue-export.mjs`
- Create: `wordpress/migration/schema/rosa-catalogue-v1.schema.json`
- Create: `wordpress/migration/generated/rosa-catalogue-v1.json`
- Test existing source: `apps/web/src/features/catalogue-migration/catalogue-metadata-manifest.ts`
- Reference existing source: `apps/web/catalogue-seed.sql`
- Reference existing media: `apps/web/public/media/catalogue-preview/**`
- Reference existing PDFs: `apps/web/public/media/catalogues/pdf/**`

**Interfaces:**
- Produces schema-versioned JSON containing family, public/db slug, name/code/descriptions, exact real configurations/SKUs/sizes/directions/variants, source display metadata, price fields when present, image references and catalogue PDF relationship.
- Export must represent the verified 113-product baseline: 22 Knives, 42 Scissors, 15 Punches, 20 Chisels, 14 Cutters.

- [ ] **Step 1: Write export verifier expectations first**

Verifier must reject wrong family counts, duplicate exported SKU identities where the source does not allow them, missing product slugs, missing family PDFs, invented fields and configuration records not traceable to approved source data.

- [ ] **Step 2: Run verifier before export exists**

Expected: FAIL because `rosa-catalogue-v1.json` does not exist.

- [ ] **Step 3: Implement the exporter as a source adapter, not a second catalogue**

The exporter consumes the existing approved `CATALOGUE_METADATA_MANIFEST` semantics plus the generated seed's exact product/variation/image rows. Where the field-parity audit says source metadata is richer than Supabase rows, the TypeScript manifest wins for display metadata. Never infer missing values from product names.

- [ ] **Step 4: Generate and validate JSON schema**

Every variation object must carry a stable migration key, exact SKU, only real source attributes, optional price override, and media reference when known.

- [ ] **Step 5: Run export + verifier twice**

Second run must produce byte-identical JSON. This proves deterministic export.

- [ ] **Step 6: Cross-check the known parity exception**

Verify the preserved duplicate-code/`18-0644` display case remains represented without weakening exact variation identity or silently deleting either source product.

- [ ] **Step 7: Commit generated non-secret migration artifact**

```bash
git add tools/wordpress wordpress/migration
git commit -m "feat(wordpress): export canonical Rosa catalogue migration data"
```

---

### Task 7: Build the idempotent WooCommerce catalogue importer

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Import/CatalogueImporter.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Import/ImportResult.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Import/MediaImporter.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Import/CatalogueCommand.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Import/CatalogueImporterTest.php`

**Interfaces:**
- `CatalogueImporter::import(array $manifest): ImportResult`
- Stable import identity uses explicit migration keys/slug + exact SKU mappings; reruns update the intended record instead of creating duplicates.
- Produces WooCommerce products, real variations, categories, attributes, image attachments and catalogue PDF relationships.

- [ ] **Step 1: Write failing importer tests**

Test one simple product, one multi-configuration product, one `Price on request` product and rerunning the same manifest twice.

- [ ] **Step 2: Prove RED**

- [ ] **Step 3: Implement import transaction/checkpoint strategy**

A failed product must report its migration key and leave rerun state understandable. Do not partially fabricate missing media/attributes.

- [ ] **Step 4: Create only real WooCommerce variations**

For each manifest configuration create exactly one corresponding variation. Do not call WooCommerce's generate-all-variations Cartesian helper.

- [ ] **Step 5: Import media by deterministic source reference**

Copy approved local catalogue/product media into WordPress Media Library once and reuse attachment IDs on reruns.

- [ ] **Step 6: Expose a WP-CLI command**

Example: `wp rosa catalogue import wordpress/migration/generated/rosa-catalogue-v1.json --dry-run` and the same command without `--dry-run` for local/staging application.

- [ ] **Step 7: Run dry-run and actual local import**

Verify family/product/variation counts and rerun idempotency.

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Import \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Import
git commit -m "feat(wordpress): import Rosa catalogue into WooCommerce"
```

---

### Task 8: Implement pricing semantics and WooCommerce compatibility synchronization

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Pricing/Price.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Pricing/EffectivePrice.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Pricing/PriceSynchronizer.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ProductPricingFields.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Pricing/EffectivePriceTest.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Pricing/PriceSynchronizerTest.php`

**Interfaces:**
- `EffectivePrice::resolve(?string $base, ?string $override): ?string`
- Authoring meta: `_rosa_base_price`, `_rosa_price_override`.
- Standard WooCommerce price metadata is projection only.

- [ ] **Step 1: Write RED tests for all money states**

Cases: null/null → null; base only → base; override → override; zero → `0.00`; negative rejected; >2 input decimals rejected; clearing override restores inheritance.

- [ ] **Step 2: Implement decimal-string normalization**

Never rely on binary floating-point arithmetic for stored quotation values.

- [ ] **Step 3: Add product and variation admin fields with nonce/capability/server validation**

Blank means `Price on request`; do not save fake zero.

- [ ] **Step 4: Implement WooCommerce price projection synchronization**

Synchronize on approved product save, variation save and importer execution. Clearing Rosa price must clear compatible numeric WooCommerce projections rather than inventing a value.

- [ ] **Step 5: Run focused unit tests**

Expected: PASS.

- [ ] **Step 6: Browser-check product admin save/clear behavior**

Verify non-Administrator content role access later in Task 15; this task verifies technical admin behavior only.

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Pricing \
        wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ProductPricingFields.php \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Pricing
git commit -m "feat(wordpress): add Rosa SAR pricing semantics"
```

---

### Task 9: Implement product discovery domain logic and shareable URL state

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Discovery/FilterState.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Discovery/SearchNormalizer.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Discovery/FacetEngine.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Discovery/RevealPolicy.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Rest/ProductDiscoveryController.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Discovery/FacetEngineTest.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Discovery/RevealPolicyTest.php`

**Interfaces:**
- Family single-select; Size/Direction/Variant/Code Group multi-select.
- OR within a facet; AND across facets; free-text search ANDs with all active facets.
- Search terms include localized name, English name, family, product code, variation SKU, Size, Direction, Variant and derived Code Group.
- URL keys: `q`, `family`, `size`, `direction`, `variant`, `codeGroup`, `sort`, `view`.

- [ ] **Step 1: Port behavior as tests, not React code**

Write PHP fixtures matching representative existing custom-site discovery cases, including selected zero-count options and contextual counts.

- [ ] **Step 2: Prove RED**

- [ ] **Step 3: Implement normalization and boolean filtering**

Case/whitespace tolerant. Preserve exact display labels separately from normalized comparison keys.

- [ ] **Step 4: Implement contextual counts**

When computing a facet's option counts, apply all other active filters but not the current facet's own selected values; keep selected zero-count values removable.

- [ ] **Step 5: Implement complete-row reveal policy**

`See more` reveals complete visual rows; genuine final partial row is allowed only at the true end. `See all N products` reveals all remaining matches. Search/filter changes reset reveal state.

- [ ] **Step 6: Add read-only REST endpoint**

Return only public/published product projection. Sanitize every query parameter. Do not expose protected admin data.

- [ ] **Step 7: Run unit + local REST tests**

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Discovery \
        wordpress/wp-content/plugins/rosa-medical-core/src/Rest/ProductDiscoveryController.php \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Discovery
git commit -m "feat(wordpress): add Rosa product discovery engine"
```

---

### Task 10: Build the Products discovery UI and Elementor widget

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductDiscoveryWidget.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/assets/js/product-discovery.js`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/assets/css/product-discovery.css`
- Create: `wordpress/tests/e2e/specs/products-discovery.spec.ts`

**Interfaces:**
- Consumes Task 9 REST/domain behavior.
- Produces accessible family radios, advanced accordion facets, contextual count UI, Clear Filters, search, results, `See more products`, `See all N products`, desktop sidebar and mobile disclosure/drawer.

- [ ] **Step 1: Write failing browser tests for the approved interaction model**

Test family radio, Size multi-select, Direction multi-select, OR/AND semantics, contextual counts, selected zero-count removal, URL refresh, Back/Forward, mobile filter disclosure and RTL alignment.

- [ ] **Step 2: Prove RED with the widget absent**

- [ ] **Step 3: Register one intentional Elementor Product Discovery widget**

Do not compose the behavior from unrelated shortcode/plugin fragments.

- [ ] **Step 4: Implement native semantic inputs beneath Rosa visuals**

Selected state must be visible beyond colour alone; focus-visible must remain obvious.

- [ ] **Step 5: Implement one-open-at-a-time advanced facets and bounded long lists**

Collapsed summaries display the selected value or `N selected`. Add within-facet search only when the option count crosses the explicit component threshold.

- [ ] **Step 6: Implement URL synchronization without full reload**

Back/Forward restores filters. Arabic route remains Arabic.

- [ ] **Step 7: Implement complete-row reveal + See All UI**

No artificial partial row before the reveal control.

- [ ] **Step 8: Run browser matrix at 390, 768, 1024, 1440 and 1920 px, then RTL**

- [ ] **Step 9: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductDiscoveryWidget.php \
        wordpress/wp-content/plugins/rosa-medical-core/assets \
        wordpress/tests/e2e/specs/products-discovery.spec.ts
git commit -m "feat(wordpress): build Rosa Products discovery experience"
```

---

### Task 11: Build shared Product Detail configuration/pricing behavior

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductConfiguration.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductConfigurationWidget.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/assets/js/product-configuration.js`
- Create: `wordpress/tests/e2e/specs/product-detail.spec.ts`

**Interfaces:**
- A selectable configuration is a real WooCommerce variation only.
- Selected configuration exposes variation ID, SKU, Size, Direction/Variant as available and effective SAR price or `Price on request`.

- [ ] **Step 1: Write failing browser tests**

Assert a multi-configuration product changes SKU/attributes/price when the real variation changes; a single-configuration product avoids redundant selector UI; impossible combinations never appear.

- [ ] **Step 2: Prove RED**

- [ ] **Step 3: Implement configuration projection from real variations**

Do not independently combine attribute values client-side.

- [ ] **Step 4: Register the Product Configuration/Pricing Elementor widget**

Use it inside one shared Elementor Theme Builder Single Product template.

- [ ] **Step 5: Show `Price on request` for null effective price**

Zero remains a numeric price.

- [ ] **Step 6: Verify no Related Products/recommendation rail is restored**

- [ ] **Step 7: Run English/Arabic responsive browser tests**

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Catalogue/ProductConfiguration.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductConfigurationWidget.php \
        wordpress/wp-content/plugins/rosa-medical-core/assets/js/product-configuration.js \
        wordpress/tests/e2e/specs/product-detail.spec.ts
git commit -m "feat(wordpress): add configuration-aware Product Detail"
```

---

### Task 12: Implement the inquiry basket without WooCommerce Checkout

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Inquiry/InquiryLine.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Inquiry/InquiryBasket.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/InquiryWidget.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/assets/js/inquiry-basket.js`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Inquiry/InquiryBasketTest.php`
- Create: `wordpress/tests/e2e/specs/inquiry-basket.spec.ts`

**Interfaces:**
- Duplicate line identity is `product + selected real variation/configuration`.
- Different configurations of the same product remain separate lines.
- Browser price is display state only.

- [ ] **Step 1: Write RED unit tests**

Test add, merge exact configuration duplicate, keep different configuration separate, quantity update, remove, clear, priced subtotal, mixed priced/unpriced state and all-unpriced state.

- [ ] **Step 2: Implement a small basket domain independent of WooCommerce Cart/Checkout**

Persist browser state with explicit schema versioning. Do not create WooCommerce Orders or checkout sessions.

- [ ] **Step 3: Wire Product Detail `Add to inquiry` to the basket**

Carry product ID, variation ID, display snapshots, quantity and client-side displayed price as non-authoritative UI data.

- [ ] **Step 4: Build the Inquiry page widget**

Show line image/name/SKU/configuration/quantity/note/remove plus correct priced/mixed/unpriced summaries.

- [ ] **Step 5: Run browser tests including reload persistence and mobile**

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Inquiry \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/InquiryWidget.php \
        wordpress/wp-content/plugins/rosa-medical-core/assets/js/inquiry-basket.js \
        wordpress/tests/e2e/specs/inquiry-basket.spec.ts
git commit -m "feat(wordpress): add Rosa inquiry basket"
```

---

### Task 13: Implement structured server-authoritative quotation persistence

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Quotes/QuoteSchema.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Quotes/QuoteRepository.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Quotes/QuoteService.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Rest/QuoteController.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/QuoteRequestsPage.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Quotes/QuoteServiceTest.php`
- Create: `docs/architecture/2026-08-27-wordpress-quotation-storage.md`

**Interfaces:**
- Dedicated plugin-versioned quote header + quote-line storage.
- Server resolves current product/variation/effective price again before persistence.
- Stored line snapshot includes product/variation IDs, product name, SKU/configuration, quantity, authoritative unit price or null, SAR currency, subtotal or null and note.

- [ ] **Step 1: Write RED tests for tamper resistance**

Submit a client payload containing a fake price and assert persisted unit price comes from current Rosa pricing metadata, not the request.

- [ ] **Step 2: Define plugin schema version and migration**

Create dedicated quote/header and quote-line tables with indexes, positive quantity checks enforced in service/schema where WordPress DB portability requires it, status/timestamps and deterministic schema upgrade version.

- [ ] **Step 3: Implement atomic application-level creation**

Use one database transaction where the selected WordPress database engine/runtime supports it; any child-line failure must roll back the request. Document transaction assumptions in the architecture note.

- [ ] **Step 4: Implement REST submission with nonce/CSRF strategy appropriate to public form, rate/abuse hook point, sanitization and bounded payloads**

No public endpoint may read quote administration.

- [ ] **Step 5: Build protected `Quote Requests` admin UI**

Render structured lines, priced subtotal, unpriced count, complete total only when every line is priced, status and private admin notes.

- [ ] **Step 6: Preserve migration reference semantics**

Use the existing Supabase `quote_request_items` architecture as behavior/history reference; do not alter or delete those Supabase migrations.

- [ ] **Step 7: Run unit + local submission/admin browser tests**

- [ ] **Step 8: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Quotes \
        wordpress/wp-content/plugins/rosa-medical-core/src/Rest/QuoteController.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Admin/QuoteRequestsPage.php \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Quotes \
        docs/architecture/2026-08-27-wordpress-quotation-storage.md
git commit -m "feat(wordpress): persist structured Rosa quote requests"
```

---

### Task 14: Make catalogue PDFs centrally editable

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Catalogues/CataloguePdfMeta.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/CataloguePdfFields.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/CataloguePdfWidget.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Catalogues/CataloguePdfMetaTest.php`
- Create: `wordpress/tests/e2e/specs/catalogue-pdfs.spec.ts`

**Interfaces:**
- Each product family/category owns one authoritative Media Library attachment relationship.
- Home/Products/Product Detail resolve the same relationship dynamically; no duplicated hard-coded PDF URLs in Elementor pages.

- [ ] **Step 1: Write RED metadata tests**

- [ ] **Step 2: Add family/category admin field backed by attachment ID**

Validate PDF MIME/type and capability.

- [ ] **Step 3: Add reusable Elementor Catalogue/PDF component**

- [ ] **Step 4: Import the five existing authoritative family PDFs through Task 7 importer mapping**

- [ ] **Step 5: Browser-test that replacing one family PDF changes every rendered link using that family relationship**

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Catalogues \
        wordpress/wp-content/plugins/rosa-medical-core/src/Admin/CataloguePdfFields.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/CataloguePdfWidget.php \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Catalogues \
        wordpress/tests/e2e/specs/catalogue-pdfs.spec.ts
git commit -m "feat(wordpress): centralize Rosa catalogue PDFs"
```

---

### Task 15: Migrate/customize the five public pages and shared templates

**Files:**
- Modify environment content through Elementor: Home, About, Products, Inquiry, Contact, header, footer, Product Archive, Single Product.
- Create: `wordpress/tests/e2e/specs/public-pages.spec.ts`
- Update: `docs/runbooks/wordpress-local.md` with Elementor template/export procedure.

**Interfaces:**
- Consumes Rosa tokens and custom widgets from Tasks 4, 10–14.
- Produces the approved five-page public IA plus dynamic Product Detail.

- [ ] **Step 1: Write page-level acceptance assertions before full visual conversion**

Assert exact main navigation, no consumer Checkout/My Account/Login retail flows, no pharmacy copy, no unverified testimonials/certifications and no horizontal overflow.

- [ ] **Step 2: Convert shared header/footer first**

Keep the five main navigation destinations: Home, About Us, Products, Inquiry, Contact Us. Add language control through WPML when Task 16 is active.

- [ ] **Step 3: Convert Home using MedicaShop composition only where useful**

Replace pharmacy hero/benefits/latest products/promos/newsletter semantics with Rosa company/families/featured instruments/catalogues/value proposition/inquiry surfaces. Keep all routine text/media in editable WordPress/Elementor fields.

- [ ] **Step 4: Convert About/Company**

Use verified company content only. Do not invent manufacturing, certifications, years, awards, export footprint or authority endorsements.

- [ ] **Step 5: Build Products around the custom Product Discovery widget**

The MedicaShop archive shell is visual support only; Rosa filtering/search/reveal behavior remains authoritative.

- [ ] **Step 6: Build Single Product around the shared Product Configuration widget**

Remove consumer purchase/related-product UX. Add quantity + Add to Inquiry + procurement context.

- [ ] **Step 7: Build Inquiry and Contact**

Inquiry uses the Rosa basket/quote flow, not Woo Checkout. Contact uses centralized verified Rosa contact data.

- [ ] **Step 8: Run screenshot/browser acceptance at 390, 430, 768, 1024, 1366, 1440, 1920 and 2560 px**

Do not accept merely because Elementor reports responsive mode; inspect actual browser output.

- [ ] **Step 9: Export/version the reusable Elementor template set or document the deterministic content-state backup method**

Git cannot represent all Elementor DB content, so the runbook must state exactly how template/content state is backed up and restored.

- [ ] **Step 10: Commit code/tests/runbook changes**

Elementor database changes are environment state and must be captured by backup/export evidence, not pretended to exist in Git.

---

### Task 16: Implement WPML English/Arabic and RTL acceptance

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Localization/Strings.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/rtl.css`
- Create: `wordpress/tests/e2e/specs/arabic-rtl.spec.ts`
- Update: `docs/runbooks/wordpress-client-editing.md`

**Interfaces:**
- One WordPress installation; stable SKU/technical IDs; translated pages/navigation/templates/products/categories/attribute labels/custom Rosa strings.

- [ ] **Step 1: Register every custom plugin string through WordPress/WPML-compatible localization APIs**

No hard-coded English inside JS/PHP widget UI that cannot be translated.

- [ ] **Step 2: Create representative Arabic content/product translations**

Use existing verified Arabic content where present; do not invent translations for unsupported claims.

- [ ] **Step 3: Write RTL browser assertions**

Cover header/nav, hero, breadcrumbs, product cards, facet accordions, chevrons/icons, Product Detail columns, configuration controls, inquiry basket, forms/tables, buttons and mobile navigation.

- [ ] **Step 4: Prove RED against any LTR assumptions**

- [ ] **Step 5: Fix with logical properties and bounded RTL-specific CSS only where necessary**

- [ ] **Step 6: Run English + Arabic browser matrix**

- [ ] **Step 7: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Localization \
        wordpress/wp-content/themes/rosa-medical-child/assets/css/rtl.css \
        wordpress/tests/e2e/specs/arabic-rtl.spec.ts \
        docs/runbooks/wordpress-client-editing.md
git commit -m "feat(wordpress): add Arabic and RTL support"
```

---

### Task 17: Create least-privilege client editing workflow

**Files:**
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/Capabilities.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ContentManagerRole.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/tests/Admin/ContentManagerRoleTest.php`
- Create: `wordpress/tests/e2e/specs/client-editability.spec.ts`
- Update: `docs/runbooks/wordpress-client-editing.md`

**Interfaces:**
- `Rosa Content Manager` can manage approved content/catalogue/media/translations and cannot manage plugins/themes/source/security/system configuration.
- `Rosa Administrator` remains trusted technical/owner administration.

- [ ] **Step 1: Write RED capability tests**

Assert allowed capabilities for approved page/media/product/category/attribute/PDF/translation/quote-view operations and denied plugin/theme/source/user-system operations.

- [ ] **Step 2: Implement role creation/update idempotently**

Do not grant `administrator` merely for convenience.

- [ ] **Step 3: Configure Elementor content-only editing restriction where practical**

The role may edit approved content surfaces but should not freely restructure global templates/business UI.

- [ ] **Step 4: Run the full client-editability acceptance flow as the non-admin role**

Verify they can change Home text/image, contact details, product name/description/image, authorized attributes/configuration data, base SAR price, variation override, family PDF, Arabic translation, publish/update, and see public changes.

- [ ] **Step 5: Verify denied operations**

The same account must not install plugins, switch themes, edit PHP, alter Rosa filter/pricing/quotation code or change deployment/security settings.

- [ ] **Step 6: Commit**

```bash
git add wordpress/wp-content/plugins/rosa-medical-core/src/Admin/Capabilities.php \
        wordpress/wp-content/plugins/rosa-medical-core/src/Admin/ContentManagerRole.php \
        wordpress/wp-content/plugins/rosa-medical-core/tests/Admin \
        wordpress/tests/e2e/specs/client-editability.spec.ts \
        docs/runbooks/wordpress-client-editing.md
git commit -m "feat(wordpress): add safe Rosa content-manager role"
```

---

### Task 18: Performance, security, backup and update hardening

**Files:**
- Create: `docs/runbooks/wordpress-backup-restore.md`
- Create: `docs/runbooks/wordpress-staging-production.md`
- Create: `wordpress/tests/e2e/specs/security-performance.spec.ts`
- Modify scoped plugin/theme files as findings require.

**Interfaces:**
- Produces documented backup/restore, staging update discipline, least-privilege security checks and public performance baseline.

- [ ] **Step 1: Inventory every production plugin and justify it**

Remove ElementsKit/Skyboot if no surviving production template/widget needs them. Do not accumulate overlapping search/filter/cart/security stacks.

- [ ] **Step 2: Audit request boundaries**

Verify nonces/capabilities for admin actions, sanitization/validation for all writes, bounded public quote payload, protected quote admin and no secrets in Git.

- [ ] **Step 3: Audit public query behavior**

Products/Product Detail must avoid obvious N+1 metadata/variation queries. Cache read projections where safe without caching user-specific inquiry state.

- [ ] **Step 4: Run image/script/performance review**

Optimize product media, lazy-load where appropriate, remove unnecessary autoplay/third-party scripts and record representative performance measurements.

- [ ] **Step 5: Write and test backup/restore runbook locally/staging**

Cover database, Media Library/uploads, Elementor templates/content, WooCommerce data, WPML data and versioned plugin/child-theme source. Git alone is not a complete backup.

- [ ] **Step 6: Write staging upgrade discipline**

Plugin/theme/WordPress updates are validated on staging before production.

- [ ] **Step 7: Commit**

```bash
git add docs/runbooks/wordpress-backup-restore.md docs/runbooks/wordpress-staging-production.md \
        wordpress/tests/e2e/specs/security-performance.spec.ts \
        wordpress/wp-content
git commit -m "chore(wordpress): harden Rosa runtime and operations"
```

---

### Task 19: Full WordPress acceptance and migration parity closeout

**Files:**
- Create: `docs/superpowers/completions/2026-08-27-rosa-wordpress-migration-acceptance.md`
- Update any focused tests/code only when a verified acceptance defect requires it.

**Interfaces:**
- Produces release-candidate evidence. Does **not** authorize production hosting changes.

- [ ] **Step 1: Run all PHP verification**

```bash
cd wordpress
composer verify
```

Expected: PASS.

- [ ] **Step 2: Run full WordPress browser suite**

Run Gate 0 regression plus Home, About, Products, Product Detail, Inquiry, Contact, filtering, search, contextual counts, See More, See All, configuration, numeric price, Price on request, inquiry totals, quotation submission/admin, PDFs, English/Arabic/RTL and client-editability tests.

- [ ] **Step 3: Run catalogue parity report**

Confirm 113 source products and family counts remain exact, all exported real configurations are represented, no invented Cartesian combinations exist, SKU/Code Group semantics are intact and the known legacy parity exceptions are deliberately preserved.

- [ ] **Step 4: Run responsive screenshot matrix**

Review approximately 390, 430, 768, 1024, 1366, 1440, 1920 and 2560 px. Record any intentional deviations.

- [ ] **Step 5: Re-test the non-admin client workflow from start to finish**

- [ ] **Step 6: Verify no production/Hostinger access occurred during local acceptance**

The completion record must explicitly state this.

- [ ] **Step 7: Commit the acceptance record**

```bash
git add docs/superpowers/completions/2026-08-27-rosa-wordpress-migration-acceptance.md
git commit -m "docs: record Rosa WordPress migration acceptance"
```

---

### Task 20: Production-hosting preparation — explicit permission gate

**Files:**
- Update: `docs/runbooks/wordpress-staging-production.md`
- Create after approved inspection: `docs/architecture/<date>-rosa-wordpress-hosting-target.md`

**Interfaces:**
- Consumes explicit user permission for the exact hosting inspection step.
- Produces exact Rosa staging/production target, backup/rollback evidence and deployment checklist.

- [ ] **Step 1: STOP before any Hostinger connector/browser action**

Ask the user for explicit permission to inspect the exact Rosa hosting target. Do not infer permission from this implementation plan.

- [ ] **Step 2: With approval, perform read-only scoped inspection first**

Identify the exact Rosa domain/WordPress install/plan. Do not modify unrelated domains, databases, sites, DNS, backups or account settings.

- [ ] **Step 3: Confirm hosting compatibility with the accepted runtime baseline**

Record PHP/database capabilities, staging availability, backup mechanism and deployment constraints.

- [ ] **Step 4: Create/confirm a fresh recoverable Rosa backup before significant changes**

- [ ] **Step 5: Deploy to Rosa staging and rerun Task 19 acceptance there**

- [ ] **Step 6: STOP before production publication**

Present the exact staging → production operation, target, fresh backup and rollback path to the user. Obtain explicit approval.

- [ ] **Step 7: Only after approval, publish/deploy the exact Rosa target and run production smoke tests**

Never use an account-wide or unrelated-site publish action.

- [ ] **Step 8: Record final production evidence and rollback point**

---

## Self-Review Against the Approved Spec

### Spec coverage

- Gate 0 compatibility spike: Tasks 1–2.
- Local/staging foundation and code/data separation: Tasks 1–3, 18, 20.
- Rosa visual conversion: Tasks 4, 15.
- WooCommerce families/attributes/real variations/Code Group: Tasks 5–7.
- Deterministic catalogue migration: Tasks 6–7.
- Advanced search/filter/contextual counts/URL state/See More/See All: Tasks 9–10.
- SAR pricing and WooCommerce compatibility synchronization: Task 8.
- Product Detail real configuration selection: Task 11.
- Inquiry basket: Task 12.
- Dedicated structured quotations + admin review: Task 13.
- Dynamic catalogue PDFs: Task 14.
- Elementor page/template migration: Task 15.
- English/Arabic/RTL: Task 16.
- Safe client editability/roles: Task 17.
- Security/performance/backups/upgrades: Task 18.
- Full responsive/client acceptance: Task 19.
- Hostinger/production safety gates: Task 20.

### Placeholder scan

This plan intentionally contains no `TBD`, `TODO`, “implement later”, invented prices, invented claims or unbounded “add error handling” steps. Values that must be resolved from the actual current runtime (plugin/PHP/WordPress versions and eventual hosting target) are outputs of explicit gate tasks rather than guessed constants.

### Type/interface consistency

- Pricing source is consistently `_rosa_base_price` / `_rosa_price_override` and `EffectivePrice::resolve()`.
- Code Group has one derivation entry point: `CodeGroup::fromSku()`.
- Catalogue export feeds the importer through `rosa-catalogue-v1.json`.
- Product discovery behavior is centralized in Task 9 and rendered by one Elementor widget in Task 10.
- Product Detail selects real variations and feeds configuration identity to Inquiry.
- Inquiry browser money remains display-only; Task 13 re-resolves authoritative prices before persistence.
- Catalogue PDFs are category-owned Media Library relationships used by all public surfaces.

## Execution Order / Hard Gates

1. Execute Tasks 1–2 first.
2. If Gate 0 result is `REJECT_KIT`, stop and replace only the visual template foundation; do not execute MedicaShop-dependent tasks.
3. After Gate 0 acceptance, execute Tasks 3–14 with focused verification after every task.
4. Execute public page conversion (Task 15) only after catalogue/discovery/pricing/inquiry foundations are real enough to render dynamically.
5. Execute Arabic/roles/hardening (Tasks 16–18) before release-candidate acceptance.
6. Task 19 must pass before any production-hosting work.
7. Task 20 contains two separate explicit user-approval gates: before Hostinger inspection and before staging-to-production publication.

## Execution Handoff

Plan implementation should begin from the authoritative accepted source using the Superpowers worktree workflow. Do not implement directly on the planning branch.

Recommended implementation branch after Gate 0 planning checkout:

`wordpress/medicashop-migration`

At execution start:

1. invoke `superpowers:using-git-worktrees`;
2. create the isolated worktree from the current authoritative source/accepted planning commit;
3. invoke `superpowers:executing-plans` or `superpowers:subagent-driven-development`;
4. invoke `superpowers:test-driven-development` for implementation tasks;
5. use `superpowers:systematic-debugging` for any unexpected failure;
6. use `superpowers:verification-before-completion` before every completion/deployment claim.
