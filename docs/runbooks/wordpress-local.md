# Rosa Medical WordPress local / Free Foundation Gate runbook

## Safety boundary

This environment is disposable and local. It must not connect to Hostinger, the live Rosa database, Cloudflare production runtime, or unrelated domains/sites.

## Prerequisites

- Docker
- Docker Compose v2

No MedicaShop ZIP, Elementor Pro archive, WPML licence or other paid dependency is required.

## Active architecture

Use:

- WordPress
- Hello Elementor
- Elementor Free
- WooCommerce
- Rosa child theme
- `rosa-medical-core`

The controlling specification is `docs/superpowers/specs/2026-08-27-rosa-wordpress-free-custom-foundation-design.md`.

## Preflight and bootstrap

```bash
cp wordpress/dev/.env.example wordpress/dev/.env
bash wordpress/scripts/foundation-preflight.sh
bash wordpress/scripts/foundation-bootstrap.sh
```

Expected preflight output:

```text
Foundation preflight passed.
```

The bootstrap starts only the disposable Rosa WordPress/MariaDB environment, installs Hello Elementor, Elementor Free and WooCommerce, then activates the version-controlled `rosa-medical-child` theme and `rosa-medical-core` plugin.

The bootstrap also sets WooCommerce's local `woocommerce_coming_soon` option to `no`. This is required for the disposable acceptance runtime: WooCommerce's coming-soon handler can otherwise intercept public catalogue requests before Rosa's shared product template runs.

Verify the local state with:

```bash
docker compose -f wordpress/dev/compose.yaml run --rm wpcli option get woocommerce_coming_soon
```

Expected:

```text
no
```

## Runtime report

```bash
bash wordpress/scripts/foundation-version-report.sh
```

This reports the actual WordPress, PHP, MariaDB, active theme, Elementor, WooCommerce and Rosa plugin versions used by the local gate.

## Representative product fixture

Seed the verified Stevens Scissors foundation fixture:

```bash
bash wordpress/scripts/foundation-seed.sh
```

Verify exact catalogue parity and shared Product Detail rendering:

```bash
bash wordpress/scripts/foundation-product-verify.sh
```

Expected final line:

```text
PASS: Stevens Scissors Regular foundation fixture parity and shared detail rendering
```

The fixture contains only the two catalogue-confirmed Regular configurations used by this gate:

- `04-0901` — 10.5 cm, Straight, Sharp
- `04-0911` — 10.5 cm, Curved, Sharp

Do not add inferred Cartesian combinations.

## Automated foundation verification

Run:

```bash
bash wordpress/scripts/foundation-verify.sh
```

The script verifies the active theme/plugins, WooCommerce live-mode prerequisite, representative Home/About/Contact pages, Elementor page support, the shared Rosa product template, exact fixture SKUs, centralized business settings, Arabic/RTL runtime behavior and fatal/critical-error absence.

A successful automated run intentionally stops with `MANUAL_PENDING` until the browser/editor checks below are explicitly completed.

## Manual Elementor acceptance

The verifier prints direct Elementor editor URLs for Home, About and Contact.

For **each** page:

1. Open the page in Elementor Free.
2. Add or edit a small Heading/Text section.
3. Save/Update.
4. Leave the editor.
5. Reopen the same page in Elementor.
6. Confirm the saved content remains.
7. Edit it a second time and Save/Update again.
8. Open the public page and confirm the second change is rendered.

This create → save → reopen → edit → save cycle is a browser/editor compatibility assertion and must not be replaced by a WP-CLI metadata check.

## Manual responsive acceptance

Inspect representative public pages at approximately:

- 390 px
- 768 px
- 1024 px
- 1440 px
- 1920 px

At minimum inspect Home, one normal content page, and the Stevens foundation Product Detail page. Check for horizontal overflow, overlapping shell elements, clipped text, broken configuration content, unusable spacing or controls that leave the viewport.

This foundation gate proves shell integrity only. Final production acceptance uses the broader responsive matrix defined by the later design/migration phases.

## Browser-console acceptance

Open browser developer tools and inspect the Console on at least:

- Home
- the Stevens foundation Product Detail page

The gate fails on JavaScript errors that break representative page behavior. Non-breaking browser notices or unrelated favicon warnings are not sufficient by themselves to fail the gate.

## Confirming manual checks

Only after all three manual checks have actually passed, rerun:

```bash
ROSA_ELEMENTOR_MANUAL_EDIT_CONFIRMED=yes \
ROSA_RESPONSIVE_MANUAL_CONFIRMED=yes \
ROSA_BROWSER_CONSOLE_CONFIRMED=yes \
bash wordpress/scripts/foundation-verify.sh
```

Expected final line:

```text
PASS: automated foundation runtime + Elementor editability + responsive shell + browser-console acceptance confirmed
```

The environment variables are attestations of completed manual checks; they do not perform those checks.

## Foundation-gate acceptance

Before full catalogue migration, prove all of the following in the disposable local runtime:

1. WordPress boots cleanly.
2. Elementor Free can create, reopen, edit and save representative Home/About/Contact content.
3. WooCommerce can represent one verified real Rosa variable product without invented combinations.
4. One shared Rosa Product Detail prototype reads WooCommerce product/variation/SKU data dynamically.
5. Centralized Rosa business/contact settings render in at least two separate surfaces.
6. Representative desktop/tablet/mobile shell layouts remain structurally sound.
7. Representative Arabic/RTL shell rendering does not structurally break.
8. No fatal PHP errors occur.
9. No console-breaking JavaScript errors occur.
10. The environment resets safely.

## Reset

The reset script is limited to the local Rosa Compose project:

```bash
ROSA_FOUNDATION_CONFIRM_RESET=yes bash wordpress/scripts/reset-local.sh
```

The older `ROSA_GATE0_CONFIRM_RESET=yes` variable is accepted temporarily for compatibility with the superseded local script, but new usage should use `ROSA_FOUNDATION_CONFIRM_RESET`.

The reset command must never target remote infrastructure.
