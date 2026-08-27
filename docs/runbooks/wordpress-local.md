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

## Runtime report

```bash
bash wordpress/scripts/foundation-version-report.sh
```

This reports the actual WordPress, PHP, MariaDB, active theme, Elementor, WooCommerce and Rosa plugin versions used by the local gate.

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
