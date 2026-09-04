# Rosa Medical WordPress MedicaShop Elementor Conversion Design

**Date:** 2026-09-04  
**Status:** Approved  
**Working branch:** `wordpress/client-content-controls`  
**Pinned finished-template source:** `wordpress/client-preview-medicashop-recreation` at `d0726eed34b4fc14267570853ade8b74df49ae9e`  
**Approved implementation approach:** Approach A — dedicated Rosa Elementor Free widgets preserving the finished template's DOM/CSS/behavior.

## 1. Decision and supersession

The visual target is the finished MedicaShop-derived Rosa WordPress template preserved on `wordpress/client-preview-medicashop-recreation`. The earlier 2026-09-03 latest-custom-frontend parity design is superseded as the visual authority for this conversion. Its useful WordPress authoring, migration-safety, RTL, WooCommerce, and verification infrastructure may be retained, but its seven-section custom-frontend Homepage and `latest-rosa-home*` visual layer are not the target.

This is not a redesign. The objective is to convert the already-finished Rosa template into a professionally editable Elementor Free implementation without visible drift.

## 2. Acceptance criterion

A rendered page produced by the Elementor implementation must be visually indistinguishable from the pinned finished template at matched content, data, locale, and viewport.

Parity includes:

- exact section order and grouping;
- exact shell/header/footer proportions;
- target typography, colors, spacing, radii, borders, and surfaces;
- target media placement, crop, aspect ratio, and responsive behavior;
- target product-grid density and promo geometry;
- target pre-footer CTA and footer topology;
- target desktop/tablet/mobile breakpoints;
- target Arabic/RTL behavior;
- no horizontal overflow, clipping, overlap, or broken media;
- preservation of the finished template's interaction behavior where present.

If Elementor is hidden from the reviewer, the underlying implementation change should not be perceptible.

## 3. Source-of-truth hierarchy

For this conversion use, in order:

1. pinned branch `wordpress/client-preview-medicashop-recreation` at `d0726eed34b4fc14267570853ade8b74df49ae9e`;
2. its browser geometry contract `wordpress/scripts/tests/client-preview-home-fidelity.test.mjs`;
3. its PHP page templates, template parts, `client-preview.css`, `client-preview-rtl.css`, `tokens.css`, and `client-preview.js`;
4. current production `rosamedical.org` only as external visual confirmation when directly observable;
5. current `wordpress/client-content-controls` only for newer authoring/migration/settings infrastructure, not as visual authority;
6. `apps/web/**` is not a visual authority for this conversion.

## 4. Architecture

### 4.1 Elementor ownership

Elementor Free owns the six marketing page bodies: EN/AR Home, About, and Contact.

Use dedicated Rosa widgets whose controls expose content and media only. Widget renderers must preserve target DOM classes and section boundaries. Do not expose arbitrary Elementor layout controls that can destroy target geometry.

### 4.2 Code-owned responsibilities

The child theme continues to own:

- header, footer, navigation, locale behavior, and protected shell;
- responsive and RTL CSS;
- shared CTA rendering;
- page template around `the_content()`;
- target-specific JavaScript behavior;
- WooCommerce shop/product templates.

### 4.3 WooCommerce ownership

WooCommerce remains the only truth for products, product media, categories/families, SKUs, variants, descriptions, and future pricing.

Homepage Featured Products and Latest Products remain dynamic WooCommerce queries. Elementor may expose section copy, but must not copy product records into page JSON.

### 4.4 Centralized settings

Business phone/email/address/WhatsApp and shared Site/CTA values remain centralized Rosa settings. They must not be duplicated as editable Elementor URLs or business records.

### 4.5 Migration safety

Never routine-force-reseed edited Elementor documents.

The conversion introduces a new Home topology marker/schema. Untouched generated Home documents may migrate automatically. Edited Home documents must return an explicit manual-required status unless a surgical mapping can preserve all user edits. About/Contact documents are not rewritten unless an audit identifies target drift.

## 5. Target page topology

### 5.1 Homepage

The pinned target Homepage is:

1. Hero
2. Who We Are
3. Featured Products + Procurement Support
4. Feature Banner
5. Latest Products
6. Promotions
7. Why Rosa
8. Proof
9. Evidence
10. shared pre-footer CTA

The Elementor document contains nine dedicated body widgets. The shared pre-footer CTA remains code/settings-owned outside the Elementor document.

Recommended widget names:

- `rosa-home-hero`
- `rosa-home-who`
- `rosa-home-featured`
- `rosa-home-feature`
- `rosa-home-latest`
- `rosa-home-promos`
- `rosa-home-why`
- `rosa-home-proof`
- `rosa-home-evidence`

The Featured widget preserves the target 4-product desktop grid plus procurement-benefit aside. The Latest widget preserves the target 10-product query and five-column desktop density.

### 5.2 About

The pinned target About topology is:

1. page hero
2. Who We Are split
3. statistics
4. information cards
5. feature banner
6. Why Rosa
7. family/proof strip
8. shared pre-footer CTA

The current seven About widgets already follow this conceptual topology and should be retained where their rendered markup matches the target. Changes are audit-driven, not a gratuitous rewrite.

### 5.3 Contact

The pinned target Contact topology is:

1. page hero
2. contact information + form presentation
3. map/location section
4. shared pre-footer CTA

The current three Contact widgets should be retained where their rendered markup matches the target. The form remains display/mailto-oriented; no submission backend is added.

### 5.4 Shop/product surfaces

Shop and product-detail surfaces remain code/WooCommerce-owned. They are regression-protected during this conversion but are not moved into Elementor.

## 6. Styling strategy

The target branch's `client-preview.css` and `client-preview-rtl.css` are the primary page/shell style layer. On the current branch `client-preview.css` is already the same preserved stylesheet, so conversion should reuse it rather than restyle sections.

Restore target token values for target selectors or introduce a narrowly scoped compatibility layer if global restoration would regress newer admin/runtime surfaces. The finished target token contract includes:

- `--rosa-red: #e00815`
- `--rosa-red-strong: #b90a14`
- `--rosa-ink: #111214`
- `--rosa-ink-soft: #2c2e33`
- `--rosa-surface: #f7f7f8`
- `--rosa-surface-strong: #eceef1`
- `--rosa-text: #18191c`
- `--rosa-muted: #686c74`
- `--rosa-border: #d9dce1`
- `--rosa-shell: 90rem`
- `--rosa-gutter: clamp(1rem, 2.5vw, 2.5rem)`

The current `latest-rosa-home.css`, `latest-rosa-home-fidelity.css`, and `latest-rosa-home.js` must not affect converted Home rendering. Remove or stop their enqueue path after tests prove the finished-template layer is sufficient.

## 7. Rendering strategy

Reuse the existing target-oriented template parts under `template-parts/client-preview/`. They already preserve target class names, and several current versions already accept Elementor `content`/`media` arguments via `AbstractRosaSectionWidget::renderSection()`.

Do not rebuild the target markup using generic Elementor containers. A widget should delegate to the target template part and pass only normalized settings/media arguments.

For sections that currently exist only inline in `client-preview-home.php`—notably Featured Products + Procurement Support and Latest Products—extract target-identical reusable partials or create focused Elementor renderer partials while preserving the exact target classes and WooCommerce query behavior.

## 8. Responsive and RTL verification

Required Home viewports:

- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 431×932
- 390×844
- 360×800

At minimum run EN at every width and AR at representative desktop/mobile widths. Keep the historical target geometry constraints unless direct target evidence proves they are wrong. Do not weaken thresholds to make a regression pass.

## 9. Authoring acceptance

After geometry parity is green:

- change one EN Home text field in Elementor and verify frontend persistence;
- change one AR Home text field and verify RTL output;
- replace one Home media item and verify persistence;
- verify Featured/Latest products still come from WooCommerce, not Elementor JSON;
- verify routine content/media/Elementor seeds preserve edits;
- verify shared Site/CTA and Business settings remain dynamic and independent;
- verify About/Contact Elementor editing still works.

## 10. Non-goals and boundaries

- No Elementor Pro.
- No new page design.
- No migration of WooCommerce product truth into Elementor.
- No new contact-submission backend.
- No full catalogue mutation during this conversion.
- No Hostinger or production deployment without separate explicit approval.
- Do not merge or delete `wordpress/client-content-controls` as part of this work.
- Do not use `elementor-authoring-seed.sh --force` as a normal migration path.
