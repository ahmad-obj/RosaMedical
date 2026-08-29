# Rosa Medical WordPress Free Foundation Gate

Status: `PASS_WITH_FOUNDATION_REPAIRS`

Date recorded: 2026-08-29
Branch: `wordpress/medicashop-migration`

## Decision

The free WordPress foundation is accepted for continued Rosa Medical migration work.

The final clean gate run completed after a full disposable reset and rebuild. All source contracts, shell/PHP syntax checks, the representative WooCommerce variable-product fixture, shared Rosa Product Detail rendering, centralized settings checks, RTL runtime checks, and the final automated acceptance script passed. The previously completed manual Elementor persistence, responsive shell, and browser-console checks were reused as the explicit manual acceptance attestation for this gate.

Because the foundation required several bounded repairs before the final clean run, the decision is `PASS_WITH_FOUNDATION_REPAIRS` rather than `PASS`.

Under the implementation plan stop/go rule, the required repairs are documented below and the Task 7 checks were rerun green after those repairs. The next migration phase may therefore proceed.

## Final runtime

- WordPress: `7.1`
- PHP: `8.3.33`
- Database: `mariadb from 11.4.13-MariaDB, client 15.2 for debian-linux-gnu (x86_64) using EditLine wrapper`
- Active theme: `rosa-medical-child`
- `rosa-medical-child`: `0.1.0`
- Elementor: `4.2.3`
- WooCommerce: `11.0.1`
- `rosa-medical-core`: `0.1.0`

## Final source-level evidence

The final gate run reported PASS for:

- free foundation preflight contract
- free foundation compose/bootstrap contract
- Rosa child-theme contract
- foundation verification source contract
- Rosa product-template hook priority contract
- Product Detail landmark-structure contract

All shell scripts under `wordpress/scripts` passed `bash -n` in the final run.

All PHP files under `wordpress/wp-content` passed `php -l` in the final run.

## Final disposable-runtime evidence

After the safe local reset, the final bootstrap recreated the Rosa-only Compose network and persistent volumes and started a fresh MariaDB/WordPress runtime.

The bootstrap completed successfully and left WooCommerce public catalogue routes available rather than in WooCommerce Coming Soon mode.

The representative fixture was seeded as:

- Product: `Stevens Scissors — Regular`
- Product ID in the final disposable runtime: `11`
- Exact variation SKUs: `04-0901`, `04-0911`
- No invented variation combination is part of the fixture

The final fixture verification reported:

`PASS: Stevens Scissors Regular foundation fixture parity and shared detail rendering`

The final foundation verifier reported:

`PASS: automated foundation runtime + Elementor editability + responsive shell + browser-console acceptance confirmed`

## Acceptance coverage

1. WordPress bootstrap: PASS.
2. Hello Elementor + Rosa child theme activation: PASS.
3. Elementor Free activation and ordinary-page editing support: PASS.
4. Representative Home/About/Contact pages: PASS.
5. Elementor create/save/reopen/edit/save compatibility: manually accepted earlier and explicitly reused for the final gate.
6. Real WooCommerce variable-product fixture with exact Rosa SKUs: PASS.
7. Shared Product Detail prototype using dynamic WooCommerce product/variation data: PASS.
8. Centralized Rosa business/contact settings rendered in independent shell surfaces: PASS.
9. Arabic language pack / `is_rtl()` / RTL product-shell runtime assertion: PASS.
10. Representative responsive shell acceptance: manually accepted earlier and explicitly reused for the final gate.
11. Representative browser-console acceptance: manually accepted earlier and explicitly reused for the final gate.
12. Fatal/critical-error checks in representative public responses: PASS.
13. Safe disposable reset: completed before the final run; the subsequent bootstrap recreated the Rosa Compose network and both Rosa foundation volumes from a clean state.
14. No Hostinger, production database, production DNS, or production Cloudflare operation was part of this gate.

## Foundation repairs incorporated before final PASS

### 1. WP-CLI shared-volume ownership

The WP-CLI container originally ran as UID/GID `82:82`, while WordPress-owned directories on the shared volume were `33:33` and not writable by WP-CLI. This prevented theme/plugin installation and upgrade-directory creation.

Repair: run the `wpcli` service as `33:33` in the disposable Compose environment and lock that expectation in the foundation contract.

### 2. Runtime version reporter fail-fast behavior

The first reporter could render empty values after failed substitutions even under `set -e`.

Repair: resolve required runtime values through explicit required helpers before printing the report and fail on lookup/empty results.

### 3. Representative catalogue fixture correction

The initial tentative fixture associated SKUs `04-0901` and `04-0911` with Iris Scissors because flattened PDF text obscured the visual table grouping.

Repair: inspect the rendered catalogue layout and correct the fixture to Stevens Scissors, Regular, 10.5 cm, Straight/Curved, with exact SKUs `04-0901` and `04-0911`.

### 4. Product-template priority relative to Elementor Free

Rosa initially registered `template_include` before Elementor Free's page-template module, so Elementor could replace the Rosa Product Detail template afterward.

Repair: register `RosaMedical\Core\Plugin::productTemplate` at priority `100`, after Elementor's priority `11`, with a regression contract.

### 5. WooCommerce Coming Soon default blocked later template filters

WooCommerce 11.0.1 could leave a newly created store in `woocommerce_coming_soon=yes`. Its `ComingSoonRequestHandler::handle_template_include` runs at priority 10 and, for this non-block theme path, renders then exits before Elementor or Rosa's later `template_include` callbacks execute.

Repair: the disposable foundation bootstrap explicitly sets `woocommerce_coming_soon=no`; the verifier fails early if that state ever drifts back to `yes`.

This repair is deliberately scoped to the disposable local foundation runtime. It does not establish a production launch policy.

### 6. Foundation-verifier robustness

During Task 6, several verifier implementation defects were found while exercising the real runtime, including WP-CLI argument ordering and Bash occurrence-counting behavior.

Repair: use supported WP-CLI option updates/restoration and deterministic string-length occurrence counting, with source-contract coverage.

### 7. Product Detail landmark structure

The child theme header already opens the document's main content landmark, while the Product Detail prototype also opened a nested `<main>`.

Repair: add a structure regression contract and change the inner Product Detail wrapper to a non-main container while preserving the shared product marker and content structure.

## Non-blocking local warnings

The final run still emitted local development warnings that did not fail the acceptance criteria:

- WP-CLI may warn that it cannot create `/.wp-cli/cache/` because the container user has no writable home at `/`.
- WP-CLI may warn that regenerating `.htaccess` requires special configuration in the disposable container.

Neither warning prevented bootstrap, product routing, fixture parity, RTL checks, or the final acceptance verifier. They remain local-environment cleanup items rather than foundation blockers.

## Active architecture accepted by this gate

- WordPress
- Hello Elementor
- Rosa child theme
- Elementor Free for approved ordinary marketing-page editing
- WooCommerce for structured catalogue data
- `rosa-medical-core` for Rosa-specific business logic and centralized settings
- WordPress Media Library

The active baseline does not require MedicaShop, Elementor Pro, WPML, ElementsKit, Skyboot, or a paid template kit.

## Explicitly not proven by this gate

This gate does not claim completion of:

- full 113-product catalogue migration
- final catalogue discovery/search/filter behavior
- production pricing projection and price-on-request logic
- Inquiry / quotation persistence and admin workflow
- complete Arabic content translation and multilingual routing/SEO solution
- final production visual design across every page
- Rosa Content Manager role hardening
- production security/performance/backups
- Hostinger staging or production deployment

Those belong to subsequent phase plans.

## Go / stop result

`PASS_WITH_FOUNDATION_REPAIRS`

All bounded repairs above were incorporated before the final Task 7 rerun, and that rerun completed green. Proceed to the next phase: Rosa child-theme/design-system shell and `rosa-medical-core` foundations beyond the representative prototype, while preserving the approved free-stack and deployment-safety boundaries.
