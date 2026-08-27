# Rosa WordPress Paid-Dependencies Gate 0 Amendment

**Status:** superseded by `docs/superpowers/specs/2026-08-27-rosa-wordpress-free-custom-foundation-design.md`.

This document is retained as decision history only. It described an intermediate free-first experiment that still assumed a purchased MedicaShop kit. The later approved direction removes MedicaShop itself from the required architecture, so the MedicaShop-specific Gate 0 outcomes below are no longer controlling.

## Historical decision

1. Elementor Free was the default MedicaShop Gate 0 mode.
2. MedicaShop Pro-only dependencies were to be classified as irrelevant, replaceable, or materially valuable.
3. Elementor Pro was an escalation rather than a prerequisite.
4. WPML was deferred to a later multilingual cost/architecture gate.
5. ElementsKit Lite and Skyboot were dependency-on-demand only.

## Historical Gate 0 outcomes

- `FREE_PASS`: required Rosa foundation works without Pro.
- `FREE_WITH_CUSTOM_REPLACEMENTS`: MedicaShop Pro-only parts are replaced cleanly by Rosa child-theme/plugin/Elementor-Free surfaces.
- `PRO_JUSTIFIED`: a required surface materially benefits from Pro.
- `REJECT_KIT`: broad incompatibility exists beyond reasonable replacement boundaries.

These outcomes are obsolete because the current architecture does not require MedicaShop.

## Safety rule retained

Do not purchase or activate a paid subscription, access Hostinger, or publish anything to production without a separate explicit user action authorizing that exact step.
