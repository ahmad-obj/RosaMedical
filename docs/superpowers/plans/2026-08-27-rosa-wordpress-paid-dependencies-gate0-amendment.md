# Rosa WordPress Paid-Dependencies Gate 0 Amendment

**Status:** approved by user after the original WordPress architecture/implementation plan.

This amendment supersedes only the assumption that Elementor Pro and WPML must be purchased before Gate 0. It does not change the approved three-layer architecture: Elementor/MedicaShop/child theme for presentation, WooCommerce for catalogue data, and `rosa-medical-core` for Rosa business logic.

## Decision

1. **Elementor Free is the default Gate 0 mode.** Import and inspect the purchased MedicaShop kit without Elementor Pro first.
2. The MedicaShop listing states that it was built with Elementor Pro and that some templates/features require Pro. Therefore a free-only import may intentionally expose missing Pro-only pieces; those failures are evidence, not an automatic rejection.
3. Classify every Pro dependency as either irrelevant demo/retail surface, replaceable by Rosa-owned rendering, or materially valuable for required dynamic/client-editable presentation.
4. **Elementor Pro becomes a controlled comparison/escalation, not a prerequisite.** Only compare it when a concrete required Rosa surface justifies the experiment. No purchase is authorized by this plan.
5. **WPML is deferred to its own multilingual cost/architecture gate.** Gate 0 RTL can be tested with WordPress Arabic locale and Rosa's RTL CSS. Before multilingual implementation, compare the paid WPML route against suitable lower-cost/free alternatives against Rosa's WooCommerce product/variation/translation/client-editing requirements.
6. ElementsKit Lite and Skyboot remain dependency-on-demand only.

## Revised Gate 0 outcomes

- `FREE_PASS`: required Rosa foundation works without Pro.
- `FREE_WITH_CUSTOM_REPLACEMENTS`: MedicaShop Pro-only parts are replaced cleanly by Rosa child-theme/plugin/Elementor-Free surfaces; Pro is not required.
- `PRO_JUSTIFIED`: a required dynamic/client-editable surface materially benefits from Pro and the evidence justifies presenting the paid option to the user.
- `REJECT_KIT`: broad incompatibility exists beyond reasonable Pro/custom replacement boundaries.

## Hard safety rule

Do not purchase, activate a paid subscription, access Hostinger, or publish anything to production as part of this gate without a separate explicit user action authorizing that exact step.
