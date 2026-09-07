# Rosa Medical Phase 2 Media Provenance Audit

**Date:** 2026-09-07  
**Branch:** `wordpress/client-content-controls`  
**Inventory baseline:** `ef4f885e398e640b26bc6590765a764404512d4d`  
**Source artifact:** `/tmp/rosa-media-inventory.tsv` produced by `wordpress/scripts/client-handoff-media-inventory.sh`  
**Status:** Batch 2B classification complete; sanitization targets identified; no production mutation performed.

## 1. Audit rule

This report applies the approved Phase 2 rule exactly:

- **KEEP** — client-supplied Rosa asset, catalogue-confirmed media, or otherwise clearly approved/provenanced.
- **REMOVE-PLACEHOLDER** — stock/reference/demo/temporary imagery, or any unresolved provenance item after conservative review.
- **REVIEW** — provenance cannot initially be established.

No asset is promoted to KEEP solely because it is locally hosted, has a plausible filename, or lacks an external URL.

## 2. Inventory normalization

The runtime inventory contains **250 total lines**, of which **241 are normalized data rows** after excluding the version marker, TSV header, six `# SOURCE` markers, and the final summary line.

| Evidence source | Data rows |
|---|---:|
| `rosa_preview_media` | 26 |
| Elementor `_elementor_data` | 6 |
| Woo product image fields | 0 |
| Woo `product_cat` thumbnails | 0 |
| Media Library attachments | 27 |
| Repository grep references | 182 |
| **Total data rows** | **241** |

The Woo sections are present but emit no image records in this runtime. Product 11 therefore has no Woo featured/gallery/variation image reference to sanitize, and no product-category thumbnail is explicitly assigned.

The 182 repository grep rows are intentionally broad. Most are CSS `background` declarations, PHP calls containing `url`, or other non-media false positives. After filtering for actual image/PDF filenames, the meaningful repository media paths are the preview-seed assets plus five catalogue-derived family covers.

## 3. Final disposition summary

### WordPress Media Library attachments

- **KEEP:** 15 attachments
- **REMOVE-PLACEHOLDER:** 12 attachments
- **REVIEW:** 0 after conservative resolution

Of the 12 REMOVE-PLACEHOLDER attachments:
- **11 have Rosa settings and/or Elementor references that Batch 2C must clear.**
- **1 (`ID 39`, Weberaise reference) is orphaned/unreferenced in delivered settings/Elementor/Woo output; it does not require destructive deletion for Phase 2.**

### Hardcoded delivered theme media

- **KEEP:** 5 catalogue-family cover assets
- **REMOVE-PLACEHOLDER:** 5 generic editorial seed source paths must stop being reintroduced by `client-preview-seed.sh`
- **REVIEW:** 0

## 4. WordPress attachment disposition

| Attachment | Source path | Disposition | Current consumers | Evidence / reason |
|---:|---|---|---|---|
| 5 | `(none recorded)` | **KEEP** | No delivered settings/Elementor/Woo consumer | Local WooCommerce neutral placeholder; no delivered consumer; not photography/reference media. |
| 18 | `apps/web/public/media/brand/rosa-header-logo-v1.webp` | **KEEP** | settings `logo` | Rosa brand asset; project-approved logo lineage. Repo history includes compact header logo commit `16918839`. |
| 19 | `apps/web/public/media/editorial/home-hero-surgical-instruments.jpg` | **REMOVE-PLACEHOLDER** | settings `hero` | Generic editorial/seed asset with no client/license/source attribution. History only ties it to generic public-site/media integration (`01b5167f`). Unknown provenance resolved conservatively to removal. |
| 20 | `apps/web/public/media/editorial/about-procurement.jpg` | **REMOVE-PLACEHOLDER** | settings `about_procurement`; Elementor `/about/` + `/ar/about/` element 1 image | Generic editorial/seed asset with no client/license/source attribution. History only ties it to generic public-site/media integration (`01b5167f`). Unknown provenance resolved conservatively to removal. |
| 21 | `apps/web/public/media/editorial/about-hospitals.jpg` | **REMOVE-PLACEHOLDER** | settings `about_hospitals`; Elementor `/about/` + `/ar/about/` element 4 image | Generic editorial/seed asset with no client/license/source attribution. History only ties it to generic public-site/media integration (`01b5167f`). Unknown provenance resolved conservatively to removal. |
| 22 | `apps/web/public/media/editorial/about-international-buyers.webp` | **REMOVE-PLACEHOLDER** | settings `about_international`, `home-hero-01`; Elementor `/` + `/ar/` hero image | Generic editorial/seed asset with no client/license/source attribution. History only ties it to generic public-site/media integration (`01b5167f`). Unknown provenance resolved conservatively to removal. |
| 23 | `apps/web/public/media/editorial/procurement-support.jpg` | **REMOVE-PLACEHOLDER** | settings `procurement_support` | Generic editorial/seed asset with no client/license/source attribution. History only ties it to generic public-site/media integration (`01b5167f`). Unknown provenance resolved conservatively to removal. |
| 39 | `(none recorded)` | **REMOVE-PLACEHOLDER** | No delivered settings/Elementor/Woo consumer | Unrelated `weberaise-symbol-reference-2048.png`; no Rosa source metadata and no delivered consumer. |
| 72 | `apps/web/public/media/editorial/home-hero/client-v5/hero-01-desktop.webp` | **KEEP** | settings `home-hero-01-desktop` | Explicit client-hero lineage. Repo history for `client-v5` includes `fc61ac01` (“ship full-resolution client hero media”); earlier hero integration `84fbc40d` is explicitly “client-supplied homepage hero media”. |
| 73 | `apps/web/public/media/editorial/home-hero/client-v5/hero-01-mobile.webp` | **KEEP** | settings `home-hero-01-mobile` | Same explicit client-hero lineage. |
| 74 | `apps/web/public/media/editorial/home-hero/client-v5/hero-02-desktop.webp` | **KEEP** | settings `home-hero-02-desktop` | Same explicit client-hero lineage. |
| 75 | `apps/web/public/media/editorial/home-hero/client-v5/hero-02-mobile.webp` | **KEEP** | settings `home-hero-02-mobile` | Same explicit client-hero lineage. |
| 76 | `apps/web/public/media/editorial/home-hero/client-v5/hero-03-desktop.webp` | **KEEP** | settings `home-hero-03-desktop` | Same explicit client-hero lineage. |
| 77 | `apps/web/public/media/editorial/home-hero/client-v5/hero-03-mobile.webp` | **KEEP** | settings `home-hero-03-mobile` | Same explicit client-hero lineage. |
| 78 | `apps/web/public/media/editorial/home-hero/client-v5/hero-04-desktop.webp` | **KEEP** | settings `home-hero-04-desktop` | Same explicit client-hero lineage. |
| 79 | `apps/web/public/media/editorial/home-hero/client-v5/hero-04-mobile.webp` | **KEEP** | settings `home-hero-04-mobile` | Same explicit client-hero lineage. |
| 80 | `apps/web/public/media/editorial/home-specialties/plastic-surgery.webp` | **REMOVE-PLACEHOLDER** | settings `home-specialty-plastic-surgery` | Clinical photography added by `0917547e` but no source/license/client-ownership evidence. Unknown provenance resolved conservatively to removal. |
| 81 | `apps/web/public/media/editorial/home-specialties/orthopedics.webp` | **REMOVE-PLACEHOLDER** | settings `home-specialty-orthopedics` | Same unresolved clinical-photography provenance. |
| 82 | `apps/web/public/media/editorial/home-specialties/maxillofacial.webp` | **REMOVE-PLACEHOLDER** | settings `home-specialty-maxillofacial` | Same unresolved clinical-photography provenance. |
| 83 | `apps/web/public/media/editorial/home-specialties/orthodontics.webp` | **REMOVE-PLACEHOLDER** | settings `home-specialty-orthodontics` | Same unresolved clinical-photography provenance. |
| 84 | `apps/web/public/media/editorial/home-specialties/spine.webp` | **REMOVE-PLACEHOLDER** | settings `home-specialty-spine` | Same unresolved clinical-photography provenance. |
| 85 | `apps/web/public/media/editorial/home-specialties/securing-confidence.webp` | **REMOVE-PLACEHOLDER** | settings `home-securing-confidence` | Same unresolved clinical-photography provenance. |
| 86 | `apps/web/public/media/catalogues/pdf/rosa-scissors-catalogue.pdf` | **KEEP** | settings `catalogue-pdf-scissors` | Client/project-supplied Rosa catalogue PDF for the approved Scissors family. |
| 87 | `apps/web/public/media/catalogues/pdf/rosa-cutters-catalogue.pdf` | **KEEP** | settings `catalogue-pdf-cutters` | Client/project-supplied Rosa catalogue PDF for the approved Cutters family. |
| 88 | `apps/web/public/media/catalogues/pdf/rosa-punches-catalogue.pdf` | **KEEP** | settings `catalogue-pdf-punches` | Client/project-supplied Rosa catalogue PDF for the approved Punches family. |
| 89 | `apps/web/public/media/catalogues/pdf/rosa-chisels-catalogue.pdf` | **KEEP** | settings `catalogue-pdf-chisels` | Client/project-supplied Rosa catalogue PDF for the approved Chisels family. |
| 90 | `apps/web/public/media/catalogues/pdf/rosa-knives-catalogue.pdf` | **KEEP** | settings `catalogue-pdf-knives` | Client/project-supplied Rosa catalogue PDF for the approved Knives family. |

## 5. Static/hardcoded media disposition

| Repository asset/reference | Disposition | Consumer | Evidence |
|---|---|---|---|
| `apps/web/public/media/families/homepage-covers/scissors-family-cover-full.svg` | **KEEP** | `latest-home-family-discovery.php` | Explicit catalogue cover lineage; commit `066cbdbc` is `media(web): add full scissors catalogue cover`. |
| `apps/web/public/media/families/homepage-covers/cutters-family-cover-full.svg` | **KEEP** | `latest-home-family-discovery.php` | Explicit catalogue cover lineage; commit `ccd02d33` is `media(web): add full cutters catalogue cover`. |
| `apps/web/public/media/families/homepage-covers/punches-family-cover.webp` | **KEEP** | `latest-home-family-discovery.php` | Explicit catalogue source lineage; commit `e9d74af5` is `fix(web): upgrade Punches homepage cover from catalogue source`. |
| `apps/web/public/media/families/homepage-covers/chisels-family-cover-full.svg` | **KEEP** | `latest-home-family-discovery.php` | Explicit catalogue cover lineage; commit `abb3c06e` is `media(web): add full chisels catalogue cover`. |
| `apps/web/public/media/families/homepage-covers/knives-family-cover-full.svg` | **KEEP** | `latest-home-family-discovery.php` | Explicit catalogue cover lineage; commit `18f23b45` is `media(web): add full knives catalogue cover`. |
| `apps/web/public/media/editorial/home-hero-surgical-instruments.jpg` | **REMOVE-PLACEHOLDER** | `client-preview-seed.sh` key `hero` | No client/license/source attribution established. Seed labels are not provenance evidence. |
| `apps/web/public/media/editorial/about-procurement.jpg` | **REMOVE-PLACEHOLDER** | `client-preview-seed.sh` key `about_procurement` | No client/license/source attribution established. |
| `apps/web/public/media/editorial/about-hospitals.jpg` | **REMOVE-PLACEHOLDER** | `client-preview-seed.sh` key `about_hospitals` | No client/license/source attribution established. |
| `apps/web/public/media/editorial/about-international-buyers.webp` | **REMOVE-PLACEHOLDER** | `client-preview-seed.sh` key `about_international` | No client/license/source attribution established. |
| `apps/web/public/media/editorial/procurement-support.jpg` | **REMOVE-PLACEHOLDER** | `client-preview-seed.sh` key `procurement_support` | No client/license/source attribution established. |

The test-only references in `client-preview-seed-contract.test.sh` are not delivered media, but its assertions must be updated in the same TDD change if the production seed stops importing the unsafe hero/editorial assets.

## 6. Provenance decisions

### KEEP — Rosa/client/catalogue assets

- **Rosa logo (`ID 18`)**: retained as the approved Rosa brand asset. Repository lineage includes `16918839` (`perf(media): add compact header logo asset`).
- **Client hero family (`IDs 72-79`)**: retained. The exact `client-v5` path has repository history `fc61ac01` (`fix(web): ship full-resolution client hero media`), while earlier hero integration `84fbc40d` explicitly says `client-supplied homepage hero media`.
- **Catalogue PDFs (`IDs 86-90`)**: retained as the five Rosa catalogue source documents used by this project.
- **Catalogue family covers**: retained because repository history explicitly identifies them as catalogue covers/source-derived media.
- **WooCommerce placeholder (`ID 5`)**: retained as a neutral local platform placeholder with no delivered consumer.

### REMOVE-PLACEHOLDER — generic editorial imagery (`IDs 19-23`)

These files were imported by the preview seed, but available history only establishes generic public-site/media integration (`01b5167f`), not client ownership, licensing, catalogue provenance, or explicit approval as safe final-delivery media. They are therefore conservatively removed from delivered usage.

### REMOVE-PLACEHOLDER — clinical specialty photography (`IDs 80-85`)

These six files were introduced by `0917547e` (`feat(web): add compact clinical homepage photography`). That commit describes purpose, not origin or license. No client-supplied/source/license evidence was found for this image family, so all six are conservatively REMOVE-PLACEHOLDER.

### REMOVE-PLACEHOLDER — unrelated orphan (`ID 39`)

`weberaise-symbol-reference-2048.png` is unrelated to Rosa Medical, has no `_rosa_preview_source_path`, and has no delivered settings/Elementor/Woo consumer. It does not require destructive attachment deletion for Phase 2.

## 7. Exact Batch 2C sanitization targets

### 7.1 `rosa_preview_media` keys to clear to `0`

| Attachment | Keys |
|---:|---|
| 19 | `hero` |
| 20 | `about_procurement` |
| 21 | `about_hospitals` |
| 22 | `about_international`, `home-hero-01` |
| 23 | `procurement_support` |
| 80 | `home-specialty-plastic-surgery` |
| 81 | `home-specialty-orthopedics` |
| 82 | `home-specialty-maxillofacial` |
| 83 | `home-specialty-orthodontics` |
| 84 | `home-specialty-spine` |
| 85 | `home-securing-confidence` |

KEEP keys — especially `logo`, `home-hero-01-desktop/mobile` through `home-hero-04-desktop/mobile`, and all five `catalogue-pdf-*` keys — must remain unchanged.

### 7.2 Elementor media controls to clear only

| Page | Attachment | Exact inventory path |
|---|---:|---|
| `/about/` | 20 | `_elementor_data/0/elements/1/settings/image` |
| `/ar/about/` | 20 | `_elementor_data/0/elements/1/settings/image` |
| `/about/` | 21 | `_elementor_data/0/elements/4/settings/image` |
| `/ar/about/` | 21 | `_elementor_data/0/elements/4/settings/image` |
| `/` | 22 | `_elementor_data/0/elements/0/settings/image` |
| `/ar/` | 22 | `_elementor_data/0/elements/0/settings/image` |

No Contact Elementor media controls were emitted by the inventory.

The sanitizer must preserve all widget/container IDs, all text/content settings, Elementor structure/order, unrelated settings, and the six page documents' non-media edit state.

### 7.3 Woo targets

**None.**

The runtime inventory contains the Woo source markers but no Woo product, gallery, variation, or `product_cat` thumbnail data row. Batch 2C must therefore not mutate any Woo image metadata.

### 7.4 Seed/reintroduction targets

`wordpress/scripts/client-preview-seed.sh` currently imports all five generic editorial REMOVE-PLACEHOLDER source files. Batch 2C must stop routine seed execution from reintroducing them. The seed must continue to preserve/import the provenanced Rosa logo as required and must not replace unsafe slots with another unprovenanced image.

The six `home-specialties/*` REMOVE-PLACEHOLDER files are currently stored in `rosa_preview_media` but are not introduced by the current preview seed; their option keys still need clearing.

### 7.5 Orphaned attachment

`ID 39` has no delivered consumer. Phase 2 does not require destructive deletion. The sanitizer contract must prove it is not referenced by `rosa_preview_media`, Elementor, Woo product media, or Woo category thumbnails.

## 8. Batch 2C TDD acceptance requirements

The next RED contract must fail on the exact unsafe delivered references above and snapshot/protect:

1. all KEEP `rosa_preview_media` IDs;
2. all six Elementor documents' non-media content/structure;
3. Woo Product 11 ID/SKUs/image metadata;
4. Woo category thumbnail metadata;
5. the exact REMOVE-PLACEHOLDER settings/Elementor consumers;
6. seed source references that would reintroduce IDs 19-23.

GREEN means every listed unsafe settings key is zero/absent, the six listed Elementor media controls are empty, no KEEP ID changes, no Woo media mutation, no routine seed path reintroduces generic editorial media, and attachment deletion remains unnecessary.

## 9. Phase 2 status after Batch 2B

- Inventory contract: GREEN from local runtime report.
- Unique WordPress attachment assets dispositioned: **27 / 27**.
- Final REVIEW count: **0**.
- REMOVE-PLACEHOLDER attachments: **12**.
- REMOVE-PLACEHOLDER attachments with delivered/stored Rosa consumers requiring Batch 2C: **11**.
- KEEP attachments: **15**.
- Catalogue-family hardcoded covers: **5 KEEP**.
- Woo media sanitization targets: **0**.
- Production/Hostinger mutations during Batch 2B: **none**.

Phase 2 is **not complete** yet. Batch 2C must remove the 11 unsafe delivered/stored references and prevent the five unsafe preview-seed imports from returning.
