# Rosa Medical WordPress Client Authoring

## Purpose

Rosa now uses a split authoring model designed to give the client useful WordPress autonomy without transferring ownership of protected site structure into Elementor.

- **Elementor Free** owns the body content of Home, About, Contact, and their Arabic equivalents.
- **Rosa Medical admin settings** own shared/global site copy, Shop interface copy, and business/contact data.
- **WooCommerce** owns product/catalogue data.
- **Theme/plugin code** owns the header, footer, navigation, RTL foundations, responsive system, Shop/product templates, search/filter logic, quotation logic, and other protected behavior.

The verified MedicaShop-faithful section markup remains implemented by the Rosa theme. Core page sections appear inside Elementor as clearly named Rosa widgets, so the client edits real Elementor documents without requiring Elementor Pro or rebuilding the visual system from generic containers.

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
| Header logo/shared pre-footer media | Rosa Medical → Site & CTA → Media | `rosa_preview_media` |
| Phone/email/address/Arabic address/WhatsApp | Rosa Medical → Business | `rosa_business_settings` |
| Product names/descriptions/SKUs/variations/product images | WooCommerce → Products | WooCommerce product data |
| Layout/CSS/responsive behavior/protected routes/business logic | Repository deployment | theme/plugin source |

## Elementor editing model

The six authoring pages are independent Elementor Free documents:

- English Home
- English About
- English Contact
- Arabic Home
- Arabic About
- Arabic Contact

English and Arabic page content are therefore edited independently. The existing Rosa page-pair metadata continues to drive the public language switch.

Core page content is represented by Rosa widgets such as **Rosa Home — Hero**, **Rosa Home — Who We Are**, **Rosa About — Information Cards**, and **Rosa Contact — Details & Email Form**. Their controls expose page copy and approved page-specific media while keeping protected query limits, route logic, business values, and responsive foundations in code.

The client may add normal Elementor Free marketing content when needed. That additional generic Elementor content is intentionally less protected than the seeded Rosa sections and should not be used to replace the site header/footer, Shop/product templates, or business logic.

## Shared data remains dynamic

Do not copy shared values into Elementor widgets.

The following remain live global settings and update everywhere they are used:

- phone
- email
- English address
- Arabic address
- WhatsApp
- header/navigation/footer copy
- shared pre-footer CTA copy
- Shop interface copy

For example, the Contact Elementor widget renders the current Rosa Business phone/email/address dynamically. Its Elementor controls change only labels such as “Call us” or “Email us.”

The Contact page still uses the existing contact-details/form-like UI with a `mailto:` action. This phase does **not** add a server-side inquiry or quotation submission backend.

## Legacy structured Home/About/Contact options

The existing options remain preserved:

- `rosa_home_content`
- `rosa_about_content`
- `rosa_contact_content`

They are migration inputs and rollback data after Elementor cutover. They are **not** a second live editor for the public page body and there is no two-way synchronization with Elementor.

`Rosa Medical → Homepage`, `About`, and `Contact` therefore route to the real Elementor editor instead of displaying those old structured forms.

## Initial migration / reseeding

The Elementor migration is explicit and is not part of the normal Rosa preview seed.

Run:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh
```

The command resolves all six page IDs, runs Elementor document saves under an existing WordPress administrator account, assigns the protected Rosa Elementor page template, and records migration metadata.

Normal behavior is idempotent:

```text
never migrated      -> seeded
already migrated    -> skipped
client edited        -> skipped
```

A normal rerun must never overwrite client-edited Elementor content.

### Force reset

Only when an intentional reset is required:

```bash
bash wordpress/scripts/elementor-authoring-seed.sh --force
```

`--force` rebuilds all six Elementor documents from the preserved Rosa structured content/media migration sources. Treat it as destructive to subsequent Elementor edits. Do not run it casually on staging or production.

The routine command below is safe after migration and must not switch migrated pages back to legacy templates:

```bash
bash wordpress/scripts/client-preview-seed.sh
```

## Media ownership

Page-specific Home/About media selected at migration time is copied into the corresponding Elementor widget controls and can then be changed in Elementor.

Shared logo/pre-footer media remains under Rosa Medical → Site & CTA because those assets are global rather than page-body content.

Routine seeding preserves the existing `rosa_preview_media` map. It must not erase editor-selected mappings or migrated Elementor documents.

## Protected page shell

The six Elementor documents use:

```text
page-templates/rosa-elementor-authoring.php
```

Elementor renders only the page body. The Rosa child theme still renders:

- `<html lang>` and `dir`
- announcement bar
- header/navigation/mobile drawer
- public language switch
- single `<main>` shell
- shared pre-footer CTA
- footer
- Rosa styles/scripts

Do not change these pages to Elementor Canvas or another mode that removes the Rosa shell.

## Rollback

Rollback is deliberately non-destructive.

If one migrated page must temporarily return to its old PHP renderer, change only that page's WordPress template back to the matching legacy template:

```text
Home    -> page-templates/client-preview-home.php
About   -> page-templates/client-preview-about.php
Contact -> page-templates/client-preview-contact.php
```

Do **not** delete:

- `_elementor_data`
- `_rosa_elementor_authoring_version`
- `_rosa_elementor_seed_hash`
- `rosa_home_content`
- `rosa_about_content`
- `rosa_contact_content`
- Rosa media options

Keeping both the Elementor document and rollback data makes recovery reversible.

## Verification

Fast source/unit contracts:

```bash
php wordpress/scripts/tests/elementor-authoring-integration.test.php
php wordpress/scripts/tests/elementor-authoring-seed-contract.test.php
bash wordpress/scripts/tests/elementor-authoring-theme-contract.test.sh
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
```

Runtime/editor contracts after migration:

```bash
bash wordpress/scripts/tests/elementor-authoring-runtime.test.sh
bash wordpress/scripts/tests/elementor-authoring-editor-links.test.sh
bash wordpress/scripts/tests/elementor-authoring-mutation.test.sh
```

Browser acceptance:

```bash
node wordpress/scripts/tests/client-preview-accessibility.test.mjs http://localhost:8088/
node wordpress/scripts/tests/client-preview-home-fidelity.test.mjs http://localhost:8088/
node wordpress/scripts/tests/elementor-authoring-about-contact.test.mjs http://localhost:8088/
```

Full Rosa verification:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

Do not weaken existing geometry/accessibility/RTL thresholds to make Elementor pass. Wrapper regressions are fixed in the scoped `elementor-authoring.css`, not by redesigning Rosa sections.

## Manual editor acceptance

Before production deployment, verify once in local/staging WordPress Admin:

1. Rosa Medical → Homepage opens **Edit with Elementor**.
2. Change the English Hero heading, Update, verify the frontend, then restore it.
3. Open Arabic Home in Elementor, change one text field, verify RTL, then restore it.
4. Change one Elementor image control, verify the frontend, then restore it.
5. Open About and Contact and confirm Rosa widgets are clearly named/editable.
6. Confirm Rosa Medical → Shop, Site & CTA, and Business still open their structured settings forms.

## What not to do

- Do not use Elementor Pro for this architecture.
- Do not rebuild the Rosa header/footer in Elementor.
- Do not make Shop/product templates ordinary Elementor pages.
- Do not expose protected WooCommerce query limits, route destinations, CSS classes, breakpoints, or quotation logic as client controls.
- Do not run the Elementor seed with `--force` unless an intentional reset has been approved.
- Do not delete migration metadata or structured rollback options during normal operation.
- Do not replace the production database or uploads when deploying theme/plugin code.

## Production/deployment boundary

Normal WordPress/Elementor content changes live in the database and uploads. Theme/plugin changes are deployed separately through the controlled Hostinger workflow. This Elementor-authoring phase does not itself authorize Hostinger rollout; production deployment starts only after the full verifier and manual editor acceptance are green.