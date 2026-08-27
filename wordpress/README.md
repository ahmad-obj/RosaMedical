# Rosa Medical WordPress migration workspace

This directory contains only Rosa-owned WordPress migration/custom-code tooling. WordPress core, proprietary plugin/template archives, secrets, database state and uploads are not source-controlled here.

## Gate 0 is free-first

The default compatibility spike uses WordPress + Hello Elementor + Elementor Free + WooCommerce. The purchased MedicaShop kit is then imported and inspected.

Elementor Pro is **not** a default prerequisite for starting the spike. Set `ROSA_GATE0_MODE=pro` only when the free pass has identified a concrete Pro-only template/feature worth comparing. The MedicaShop marketplace listing itself says some templates/features require Elementor Pro, so the purpose of the comparison is to determine whether Rosa benefits enough to justify paying for Pro or whether Rosa-owned theme/plugin rendering should replace those parts.

WPML is also not required for Gate 0. Representative RTL compatibility can be checked using an Arabic WordPress locale/test page. The final multilingual plugin decision is a later architecture/cost gate.

See `docs/runbooks/wordpress-local.md`.
