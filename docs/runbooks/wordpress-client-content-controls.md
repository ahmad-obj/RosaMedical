# Rosa Medical WordPress Client Authoring

## Purpose

Rosa uses a split WordPress authoring model so the finished public template remains visually stable while normal page content can be edited in Elementor Free.

The visual target for this conversion is the finished MedicaShop-derived Rosa template preserved at:

```text
wordpress/client-preview-medicashop-recreation
d0726eed34b4fc14267570853ade8b74df49ae9e
```

This conversion is not a redesign. The Elementor-authored pages must preserve that template's rendered DOM classes, section order, responsive behavior, RTL behavior, product-grid density, shared CTA, header and footer. The later seven-section custom-frontend Homepage is not the visual authority for this WordPress conversion.

## Ownership model

- **Elementor Free** owns the body content/media of EN/AR Home, About and Contact.
- **WooCommerce** owns products, product media, categories/families, SKUs, variations, descriptions and future pricing.
- **Rosa Site & CTA settings** own shared navigation/footer/CTA copy.
- **Rosa Business settings** own phone, email, address, Arabic address and WhatsApp.
- **Theme/plugin code** owns the header, footer, shared pre-footer CTA placement, responsive/RTL CSS, page shell, Shop/product templates, routes and protected behavior.

Do not duplicate WooCommerce product records or centralized business values inside Elementor JSON.

## Where to edit

| Need | WordPress location | Source of truth |
| --- | --- | --- |
| English Homepage body | Pages → Home → Edit with Elementor | Elementor document |
| Arabic Homepage body | Pages → الرئيسية → Edit with Elementor | Elementor document |
| English About body | Pages → About us → Edit with Elementor | Elementor document |
| Arabic About body | Pages → من نحن → Edit with Elementor | Elementor document |
| English Contact body/labels | Pages → Contact us → Edit with Elementor | Elementor document |
| Arabic Contact body/labels | Pages → اتصل بنا → Edit with Elementor | Elementor document |
| Shared header/footer/CTA copy | Rosa Medical → Site & CTA | `rosa_site_content` |
| Business contact values | Rosa Medical → Business | `rosa_business_settings` |
| Shop interface copy | Rosa Medical → Shop | `rosa_shop_content` |
| Product/catalogue truth | WooCommerce → Products | WooCommerce |
| Layout/breakpoints/shell behavior | Repository deployment | child theme/core plugin |

## Homepage Elementor model

English Home and Arabic Home each contain exactly these protected widgets in this order:

1. **Rosa Home — Hero** (`rosa-home-hero`)
2. **Rosa Home — Who We Are** (`rosa-home-who`)
3. **Rosa Home — Featured Products** (`rosa-home-featured`)
4. **Rosa Home — Feature Banner** (`rosa-home-feature-banner`)
5. **Rosa Home — Latest Products** (`rosa-home-latest`)
6. **Rosa Home — Promotions** (`rosa-home-promotions`)
7. **Rosa Home — Why Rosa** (`rosa-home-why`)
8. **Rosa Home — Catalogue Strip** (`rosa-home-proof`)
9. **Rosa Home — Workflow** (`rosa-home-evidence`)

These widgets render the same `rosa-preview-*` markup used by the finished PHP template. Elementor exposes copy and approved page media; it does not expose the protected grid system, breakpoints, product records, business destinations or shell.

### WooCommerce sections

`Rosa Home — Featured Products` and `Rosa Home — Latest Products` render live WooCommerce queries through the existing product-grid partial. Their headings/support copy are Elementor-editable, but product IDs/SKUs/cards are not serialized into the Elementor document.

## About and Contact Elementor models

About remains seven widgets:

1. page hero;
2. who we are;
3. statistics;
4. information cards;
5. feature banner;
6. why Rosa;
7. proof/family strip.

Contact remains three widgets:

1. page hero;
2. contact layout;
3. map.

The Contact form-like UI remains presentation/mailto only. No server-side submission backend and no Elementor Pro are introduced.

## Shared pre-footer CTA

The finished template renders one shared pre-footer CTA after the page body on Home, About and Contact. It is code/settings-owned, not an Elementor widget.

The authoring template therefore renders:

```text
Elementor body
→ shared Site/CTA pre-footer
→ Rosa footer
```

Changing `rosa_site_content` CTA fields must update this band without rewriting the Elementor document.

## Protected authoring shell

All six marketing documents use:

```text
page-templates/rosa-elementor-authoring.php
```

The theme still owns:

- `<html lang>` and `dir`;
- announcement/header/navigation/mobile drawer;
- exactly one main public shell;
- shared CTA;
- footer;
- preview/RTL/client JavaScript and CSS.

`elementor-authoring.css` keeps Elementor layout-neutral around Rosa sections: full width, zero root gap/padding, no mobile flex wrapping and no wrapper height ownership. Do not weaken those safeguards.

Do not switch these pages to Elementor Canvas or Elementor Header/Footer modes.

## Finished-template styles and behavior

The effective visual system comes from the original Rosa preview layers:

```text
wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css
wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css
wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview.css
wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-media.css   # only when editable slot media exists
wordpress/wp-content/themes/rosa-medical-child/assets/css/elementor-authoring.css
wordpress/wp-content/themes/rosa-medical-child/assets/css/client-preview-rtl.css     # Arabic
wordpress/wp-content/themes/rosa-medical-child/assets/js/client-preview.js
```

The `latest-rosa-home*` layer belongs to the superseded custom-frontend experiment and is not part of the approved runtime target.

## Home media

The active finished-template Home slots are:

```text
home-hero-01
home-who-01
home-feature-01
home-promo-01
home-promo-02
home-promo-03
home-promo-04
home-why-01
home-evidence-01
prefooter-person-01
```

Old/superseded stored media keys are tolerated so existing data is not destructively removed, but they are not used to define the finished Home visual topology.

The normal preview seed merges media state rather than replacing it and does not invoke Elementor migration.

## Content options and rollback data

These structured options remain preserved:

```text
rosa_home_content
rosa_about_content
rosa_contact_content
rosa_site_content
rosa_shop_content
rosa_preview_media
```

For migrated pages, Elementor is the live page-body editor. Structured Home/About/Contact options are seed/rollback inputs rather than a second live body editor.

When current settings are saved, already-stored fields from superseded schemas are preserved rather than destructively erased. New unknown submitted fields are still rejected.

## Safe migration

Run the explicit Elementor authoring migration with:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
```

The general authoring schema remains version `2`. Home has an independent target-parity marker:

```text
_rosa_elementor_home_parity_version = 2
```

Safe Home behavior:

```text
never migrated                         -> seeded + Home parity 2
parity 1 + exact stored seed baseline -> migrated_home_parity + parity 2
parity 1 + client edits                -> home_parity_manual_required, no write
already parity 2                       -> skipped
```

Do not use `--force` to bypass `home_parity_manual_required`. That status exists specifically to protect edited Elementor documents.

Routine preview seeding remains separate:

```bash
bash wordpress/scripts/client-preview-seed.sh
```

It must not change an Elementor page back to the legacy PHP template and must not erase Elementor edits.

### Intentional force reset

Only after explicit approval for a destructive reset:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh --force
```

This rebuilds the six Elementor documents from seed sources and destroys later Elementor body edits.

## Rollback

A page can temporarily return to its original PHP renderer by changing only its page template:

```text
Home    -> page-templates/client-preview-home.php
About   -> page-templates/client-preview-about.php
Contact -> page-templates/client-preview-contact.php
```

Do not delete Elementor data, migration hashes, parity metadata, structured options or media attachments as part of rollback.

## Verification

Focused source/authoring contracts:

```bash
bash wordpress/scripts/tests/medicashop-elementor-reference-contract.test.sh
php wordpress/scripts/tests/content-settings.test.php
php wordpress/scripts/tests/media-settings.test.php
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/medicashop-elementor-home-contract.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
bash wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
```

Runtime/editor contracts:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Browser acceptance:

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/medicashop-elementor-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
```

The Home fidelity gate retains the measured finished-template thresholds rather than weakening them for Elementor: target header/rail/hero dimensions, 4/5-column desktop product grids, tablet density, two-column mobile product grids, promo geometry, shared CTA/footer placement and mobile drawer geometry.

Full verification:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Expected final line only when every preceding gate passes:

```text
PASS: Rosa WordPress runtime matches the finished template with Elementor authoring, bilingual routes, editable content and catalogue regressions intact
```

## Side-by-side visual capture

After the full verifier passes, capture the deployed finished template and local Elementor implementation at matched EN/AR viewports:

```bash
node wordpress/scripts/medicashop-elementor-parity-capture.mjs \
  https://rosamedical.org/ \
  http://localhost:8088/
```

Output:

```text
artifacts/medicashop-elementor-parity/reference/
artifacts/medicashop-elementor-parity/local/
```

The utility captures 1440×900, 1280×800, 1024×768, 768×1024, 431×932, 390×844 and 360×800 for EN and AR, with reduced motion. It writes full-page captures, Home hero captures when the target marker exists, and page metrics.

Automated tests are not sufficient for final visual acceptance. Compare matched screenshots and reject material differences in section topology, shell dimensions, hero crop/height, product-grid density, promotional mosaic, typography, shared CTA, footer, responsive stacking, mobile drawer and RTL.

## Manual Elementor acceptance

Before production readiness:

1. edit an EN Home text field and verify the frontend;
2. edit an AR Home text field and verify RTL output;
3. replace one Home image and verify the frontend;
4. run routine preview and Elementor seeds and confirm those edits remain;
5. verify About and Contact still open/edit independently;
6. verify Featured/Latest cards still follow WooCommerce rather than Elementor data;
7. verify Site/CTA and Business edits still update their centralized surfaces.

Restore temporary test edits afterward.

## Production boundary

No Hostinger or production deployment is authorized by this conversion work. Deployment starts only after:

1. complete local verifier PASS;
2. matched screenshot review PASS;
3. manual Elementor editing acceptance PASS;
4. separate explicit production authorization.

Do not replace production database/uploads while deploying code.
