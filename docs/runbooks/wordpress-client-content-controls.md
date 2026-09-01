# Rosa Medical WordPress Content Controls

## Purpose

The Rosa client-preview pages are deliberately rendered by the `rosa-medical-child` theme rather than Elementor page content. This keeps the approved MedicaShop-faithful layout, responsive geometry and bilingual shell stable while allowing non-technical editors to change approved content from WordPress Admin.

## Where to edit

| Need | WordPress location | Source of truth |
| --- | --- | --- |
| Homepage wording | Rosa Medical → Homepage | `rosa_home_content` |
| Homepage approved images | Rosa Medical → Homepage → Media | `rosa_preview_media` |
| About wording | Rosa Medical → About | `rosa_about_content` |
| About approved images | Rosa Medical → About → Media | `rosa_preview_media` |
| Contact labels/copy | Rosa Medical → Contact | `rosa_contact_content` |
| Shop headings/search copy | Rosa Medical → Shop | `rosa_shop_content` |
| Header/footer/navigation/shared CTA labels | Rosa Medical → Site & CTA | `rosa_site_content` |
| Header logo/shared pre-footer media | Rosa Medical → Site & CTA → Media | `rosa_preview_media` |
| Phone/email/address/Arabic address/WhatsApp | Rosa Medical → Business | `rosa_business_settings` |
| Product names/descriptions/SKUs/variations/product images | WooCommerce → Products | WooCommerce product data |
| Layout/CSS/responsive behavior/section order | Git/theme deployment | repository source |

## Editing model

English and Arabic values are stored independently. Use the English / العربية tabs on Rosa content pages. Saving one locale must not overwrite the other.

Page structure is intentionally not editable. There are no controls for grid columns, section order, spacing, typography, breakpoints, CSS classes or route targets. Those remain code-owned so content edits cannot destroy the approved layout.

## Media

Rosa media controls use the native WordPress Media Library and store attachment IDs in the existing `rosa_preview_media` option. Saves merge into the current media map and preserve legacy keys created by earlier seed/import workflows.

Homepage media slots remain the current placeholder treatment until an editor explicitly selects an image. Removing an image returns the slot to the coded placeholder without changing its geometry.

## Default/fallback behavior

Every editable field has the exact current public copy as its coded fallback. If a content option is missing, partially populated, or restored from an older database, the current approved text remains visible.

The local seed process does not own `rosa_site_content`, `rosa_home_content`, `rosa_about_content`, `rosa_contact_content` or `rosa_shop_content` and must not overwrite editor changes.

## What not to do

- Do not rebuild controlled Rosa pages in Elementor.
- Do not expect Pages → Edit/Edit with Elementor to represent the visible Home/About/Contact/Shop layout.
- Do not replace the production database to deploy CSS/PHP/JavaScript changes.
- Do not manually edit serialized content options in phpMyAdmin.
- Do not sync or delete the entire production `wp-content` directory for a theme/plugin deployment.

## Verification

Focused contracts:

```bash
php wordpress/scripts/tests/business-settings.test.php
php wordpress/scripts/tests/content-settings.test.php
php wordpress/scripts/tests/media-settings.test.php
php wordpress/scripts/tests/client-preview-content.test.php
bash wordpress/scripts/tests/client-preview-admin-contract.test.sh
```

Runtime/editing regression:

```bash
bash wordpress/scripts/tests/client-preview-content-zero-drift.test.sh
bash wordpress/scripts/tests/client-preview-content-mutation.test.sh
```

Full Rosa verification:

```bash
bash wordpress/scripts/client-preview-runtime-verify.sh
```

The full verifier must continue to pass the existing Home fidelity geometry, accessibility, English/Arabic route, RTL, WooCommerce and Hostinger migration contracts. Do not weaken existing fidelity thresholds to make content-control work pass.

## Production/deployment boundary

Normal content changes are saved in WordPress and remain in the production database. Theme/plugin code changes should eventually be deployed through the controlled Hostinger SSH/SFTP workflow; that deployment mechanism is intentionally separate from this content-controls feature.
