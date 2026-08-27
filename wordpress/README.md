# Rosa Medical WordPress migration workspace

This directory contains Rosa-owned WordPress migration/custom-code tooling. WordPress core, secrets, database state and generated uploads are not source-controlled here.

## Active foundation

The authoritative baseline is now:

- WordPress
- Hello Elementor
- Elementor Free
- WooCommerce
- Rosa child theme
- `rosa-medical-core`

MedicaShop, Elementor Pro, ElementsKit, Skyboot and WPML are **not** baseline dependencies and are not required to start the migration.

The current architectural specification is:

`docs/superpowers/specs/2026-08-27-rosa-wordpress-free-custom-foundation-design.md`

Before full catalogue migration, run the disposable **Free Foundation Gate**. Its purpose is to prove WordPress/Elementor/WooCommerce plus Rosa-owned theme/plugin source can support editable marketing pages, shared dynamic product rendering, centralized business settings, responsive shell behavior and representative RTL behavior without paid dependencies.

Start with:

```bash
cp wordpress/dev/.env.example wordpress/dev/.env
bash wordpress/scripts/foundation-preflight.sh
```

See `docs/runbooks/wordpress-local.md` for the complete local workflow.

## Safety boundary

Hostinger, Cloudflare production, live Rosa databases and unrelated sites/domains are outside this local workspace. Do not access or modify them through these scripts.
