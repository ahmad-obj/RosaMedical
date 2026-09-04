# Rosa Medical WordPress Client Authoring

## Purpose

Rosa uses a split WordPress authoring model that gives the client useful editing control without moving protected site structure or catalogue truth into Elementor.

- **Elementor Free** owns the body content of Home, About, Contact, and their Arabic equivalents.
- **Rosa Medical admin settings** own shared/global site copy, Shop interface copy, and business/contact data.
- **WooCommerce** owns product/catalogue data.
- **Theme/plugin code** owns the header, footer, navigation, RTL foundations, responsive system, Shop/product templates, search/filter logic, quotation logic, and other protected behavior.

The Homepage is now governed by the **latest Rosa custom frontend**, not the earlier MedicaShop-derived preview. Its protected seven-section Elementor topology reproduces the current Rosa design while keeping the content and page-specific media editable.

## Where to edit

| Need | WordPress location | Source of truth |
| --- | --- | --- |
| English Homepage body | Rosa Medical → Homepage, or Pages → Home → Edit with Elementor | Elementor document |
| Arabic Homepage body | Pages → الرئيسية → Edit with Elementor | Elementor document |
| English About body | Rosa Medical → About, or Pages → About us → Edit with Elementor | Elementor document |
| Arabic About body | Pages → من نحن → Edit with Elementor | Elementor document |
| English Contact body/labels | Rosa Medical → Contact, or Pages → Contact us → Edit with Elementor | Elementor document |
| Arabic Contact body/labels | Pages → اتصل بنا → Edit with Elementor | Elementor document |
| Shop headings/search copy | Rosa Medical → Shop | `rosa_shop_content` |
| Header/footer/navigation/shared CTA labels | Rosa Medical → Site & CTA | `rosa_site_content` |
| Shared logo/pre-footer media | Rosa Medical → Site & CTA → Media | `rosa_preview_media` |
| Phone/email/address/Arabic address/WhatsApp | Rosa Medical → Business | `rosa_business_settings` |
| Product names/descriptions/SKUs/variations/product images | WooCommerce → Products | WooCommerce product data |
| Layout/CSS/responsive behavior/protected routes/business logic | Repository deployment | theme/plugin source |

## Latest Homepage Elementor model

English Home and Arabic Home each contain exactly these protected Rosa widgets in this order:

1. **Rosa Home — Hero Carousel**
2. **Rosa Home — Product Range**
3. **Rosa Home — Comprehensive Plans**
4. **Rosa Home — Securing Confidence**
5. **Rosa Home — Direct Support**
6. **Rosa Home — Client Success**
7. **Rosa Home — Quotation CTA**

The rendered structure deliberately mirrors the pinned latest Rosa custom frontend. The hero keeps four slides, desktop/mobile media, source focal points, 4.75-second autoplay, keyboard dots, pointer swipe/drag behavior, focus/visibility pauses and reduced-motion handling. The product-range gallery keeps the latest family order: Scissors, Cutters, Punches, Chisels, Knives.

Elementor controls expose copy and approved page-specific media only. Core DOM classes, layout, breakpoints, motion semantics, PDF links, business URLs and responsive rules remain code-owned so normal editing cannot accidentally redesign the page.

## Shared data remains dynamic

Do not copy shared values into Elementor widgets. The following remain global settings and update everywhere they are used:

- phone;
- email;
- English address;
- Arabic address;
- WhatsApp;
- header/navigation/footer copy;
- shared pre-footer CTA copy;
- Shop interface copy.

For example, the Homepage Direct Support widget exposes only its labels/headline. Its WhatsApp and email destinations are resolved from Rosa Business settings at render time.

The Contact page continues to use the existing contact-details/form-like UI with a `mailto:` action. This work does **not** add a server-side Contact backend or Elementor Pro.

## Legacy structured options

These options remain preserved:

- `rosa_home_content`
- `rosa_about_content`
- `rosa_contact_content`

They are migration/rollback inputs, not second live page-body editors. There is no two-way synchronization with Elementor.

The Homepage structured defaults now reflect the latest Rosa Home content model so a fresh migration produces the correct seven-widget document. Once the Elementor document exists, client edits live in Elementor and normal seeds do not overwrite them.

## Homepage media

The normal client preview seed idempotently imports the Rosa-owned source assets needed by the latest Home:

- four desktop hero images;
- four mobile hero images;
- Plastic Surgery, Orthopedics, Maxillofacial, Orthodontics and Spine editorial images;
- Securing Confidence image;
- five technical catalogue PDFs.

The exact five Homepage catalogue-cover assets are deployed with the child theme. Page-specific hero/editorial images are copied into Elementor media controls during a safe Home migration and can then be changed in Elementor. The five family PDF destinations remain code/data-owned rather than editable layout controls.

Old preview media keys and attachments remain preserved for rollback compatibility.

## Initial migration and normal reseeding

The Elementor migration is explicit and is not invoked by the routine Rosa preview seed.

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
```

For About/Contact, the existing authoring-version lifecycle remains unchanged. Home adds a separate latest-parity marker:

```text
_rosa_elementor_home_parity_version = 1
```

Safe Home behavior is:

```text
never migrated                       -> seeded + Home parity 1
old Home, exact stored seed baseline -> migrated_home_parity
old Home, client edited              -> home_parity_manual_required (hard stop, no overwrite)
already latest Home parity           -> skipped
```

`home_parity_manual_required` means the existing Elementor Home has edits that cannot safely be mapped automatically onto the new structural topology. Review them explicitly. Do **not** use `--force` as a routine way around this protection.

The ordinary content/media seed remains safe after migration:

```bash
bash wordpress/scripts/client-preview-seed.sh
```

It must not revert an Elementor page template or erase Elementor edits.

### Force reset

Only when an intentional destructive reset has been explicitly approved:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh --force
```

`--force` rebuilds all six Elementor documents from Rosa migration sources and therefore destroys later Elementor edits. It is not part of normal latest-Home migration or verification.

## Protected page shell

The six authoring documents use:

```text
page-templates/rosa-elementor-authoring.php
```

Elementor renders only the page body. The Rosa child theme still owns and renders:

- `<html lang>` and `dir`;
- announcement/header/navigation/mobile drawer;
- public language switch;
- one `<main>` shell;
- shared pre-footer CTA;
- footer;
- protected Rosa styles/scripts.

Do not switch these pages to Elementor Canvas or Elementor Header/Footer modes.

## Latest Homepage design layer

The current Home-specific parity layer is:

```text
wordpress/wp-content/themes/rosa-medical-child/assets/css/latest-rosa-home.css
wordpress/wp-content/themes/rosa-medical-child/assets/js/latest-rosa-home.js
```

They load only on EN Home and the paired AR Home authoring document. The stylesheet is deliberately loaded after legacy preview/Elementor wrapper CSS so obsolete MedicaShop geometry cannot become the effective Homepage layout.

The generic Elementor wrapper safeguard remains in `elementor-authoring.css`: zero root gap/padding, full width and non-wrapping vertical flow. Do not remove or weaken that fix.

## Rollback

Rollback remains non-destructive. If a migrated page must temporarily return to its older PHP renderer, change only that page template:

```text
Home    -> page-templates/client-preview-home.php
About   -> page-templates/client-preview-about.php
Contact -> page-templates/client-preview-contact.php
```

Do **not** delete:

- `_elementor_data`
- `_rosa_elementor_authoring_version`
- `_rosa_elementor_seed_hash`
- `_rosa_elementor_home_parity_version`
- `rosa_home_content`
- `rosa_about_content`
- `rosa_contact_content`
- Rosa media options/attachments.

## Verification

Latest Home source/model contracts:

```bash
bash wordpress/scripts/tests/latest-rosa-home-reference-contract.test.sh
php wordpress/scripts/tests/latest-rosa-home-elementor-contract.test.php
php wordpress/scripts/tests/elementor-home-parity-migration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
```

Runtime/editor contracts after migration:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Browser acceptance:

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/latest-rosa-home-parity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
```

Full verification:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

The old `client-preview-home-fidelity.test.mjs` is no longer the Home visual acceptance gate because it encodes the obsolete MedicaShop geometry. Do not weaken the replacement Rosa parity assertions to make a regression pass.

## Side-by-side screenshot acceptance

Capture matched live-reference and local WordPress screenshots at 1440, 1280, 1024, 768, 431, 390 and 360 pixels for both EN and AR:

```bash
node wordpress/scripts/latest-rosa-home-parity-capture.mjs \
  http://localhost:8088/ \
  https://rosamedical.org/ \
  artifacts/latest-rosa-home-parity
```

The command uses reduced motion and produces paired full-page PNGs. Review them side-by-side. Reject material drift in hero proportions/crop, five-family strip, typography hierarchy, spacing, clinical media crop, confidence split, black Direct Support band, assurance cards, quotation CTA or RTL composition.

## Manual Elementor acceptance

Before calling the latest Homepage parity phase complete:

1. EN Home: edit **Rosa Home — Product Range → Heading**, Update, verify frontend, restore.
2. AR Home: edit the same field, Update, verify RTL frontend, restore.
3. EN Home Hero Carousel: replace one slide image, verify desktop/mobile output, restore.
4. EN Home Securing Confidence: edit text and image, verify, restore.
5. Run `client-preview-seed.sh` and normal `elementor-authoring-seed.sh`; confirm edits are never silently reset.
6. Confirm About and Contact still open their Elementor documents.
7. Confirm Rosa Medical → Shop, Site & CTA, and Business still open their protected structured settings.

## What not to do

- Do not use Elementor Pro.
- Do not rebuild the Rosa header/footer in Elementor.
- Do not make Shop/product templates ordinary Elementor pages.
- Do not move WooCommerce product/catalogue truth into Elementor.
- Do not expose protected CSS classes, breakpoints, business destinations, route logic or quotation behavior as client controls.
- Do not use `--force` to bypass `home_parity_manual_required` without explicit intentional reset approval.
- Do not delete migration metadata or rollback options during normal operation.
- Do not replace production database/uploads when deploying code.

## Production/deployment boundary

Theme/plugin changes are deployed separately through the controlled Hostinger workflow. This latest-site parity work does **not** authorize Hostinger or production changes. Production deployment begins only after the Rosa-specific full verifier, matched screenshot review and manual Elementor acceptance are green, followed by separate explicit authorization.
