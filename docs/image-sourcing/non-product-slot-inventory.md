# Rosa Medical Non-Product Imagery Slot Inventory

**Branch:** `preview/non-product-imagery-01`  
**Audited:** 2026-08-03  
**Design source:** approved Figma homepage node `3:6` and current `main` components  
**Ownership:** editorial/non-product imagery only

## Coordination Fence

This lane must not modify:

- individual product preview/detail media;
- product dimensions, variants or exact catalogue mappings;
- button components, button CSS or cinematic button-motion work;
- backend, Supabase, OpenAPI, authentication, admin or quotation behavior.

The shared `ProductMediaPlaceholder` remains available to the product-image lane. This branch replaces it only at confirmed editorial call sites, principally family cards and public editorial pages.

## Confirmed Required Slots

| Slot | Route | Component / surface | Current geometry | Meaning | Image behavior |
|---|---|---|---|---|---|
| H-01 | `/` | `HomeHero` / `.home-hero__visual` | Wide right column, minimum about 34rem high inside a 51rem hero | Premium first impression | Decorative; subject right, headline-safe negative space left; dark overlay |
| H-02 | `/` and family-card reuse | Knives `FamilyCard` | First asymmetric tile, approximately 5/12 width x 26.25rem | Category representation | Decorative; protect lower-left title/action |
| H-03 | `/` and family-card reuse | Scissors `FamilyCard` | Second asymmetric tile, approximately 7/12 width x 26.25rem | Category representation | Decorative; recognizable finger-ring silhouette; protect lower-left text |
| H-04 | `/` and family-card reuse | Punches `FamilyCard` | Third asymmetric tile, approximately 7/12 width x 26.25rem | Category representation | Decorative; long instrument geometry; protect lower-left text |
| H-05 | `/` and family-card reuse | Chisels `FamilyCard` | Fourth asymmetric tile, approximately 5/12 width x 26.25rem | Category representation | Decorative; strong vertical/diagonal steel detail |
| H-06 | `/` and family-card reuse | Cutters `FamilyCard` | Full-width tile x about 22.5rem | Category representation | Decorative; wide arrangement; protect lower-left title/action |
| H-07 | `/` | `ProcurementSupport` / `.procurement-editorial__visual` | Left editorial column, minimum about 32.5rem | Structured product selection | Meaningful editorial image; document/instrument review rather than surgery |
| H-08 | `/` | Homepage Knives catalogue card | 1 of 5 cards, minimum about 17.5rem | Premium catalogue access | Decorative document presentation under card text |
| H-09 | `/` | Homepage Scissors catalogue card | Same | Premium catalogue access | Decorative document presentation under card text |
| H-10 | `/` | Homepage Punches catalogue card | Same | Premium catalogue access | Decorative document presentation under card text |
| H-11 | `/` | Homepage Chisels catalogue card | Same | Premium catalogue access | Decorative document presentation under card text |
| H-12 | `/` | Homepage Cutters catalogue card | Same | Premium catalogue access | Decorative document presentation under card text |
| C-01 | `/catalogues` | Knives `CatalogueCover` | Portrait document cover | Technical document recognition | Meaningful; clean actual-document presentation |
| C-02 | `/catalogues` | Scissors `CatalogueCover` | Portrait document cover | Technical document recognition | Meaningful; clean actual-document presentation |
| C-03 | `/catalogues` | Punches `CatalogueCover` | Portrait document cover | Technical document recognition | Meaningful; clean actual-document presentation |
| C-04 | `/catalogues` | Chisels `CatalogueCover` | Portrait document cover | Technical document recognition | Meaningful; clean actual-document presentation |
| C-05 | `/catalogues` | Cutters `CatalogueCover` | Portrait document cover | Technical document recognition | Meaningful; clean actual-document presentation |
| A-01 | `/about` | About hero `.f3d-hero__media` | Portrait editorial | Precision and craftsmanship | Meaningful; macro steel/edge/joint detail; no factory claim |
| A-02 | `/about` | About procurement preview `.f3d-feature-panel__media` | Landscape feature-panel image | Practical buying process | Meaningful; catalogue/product-code/document arrangement |
| P-01 | `/procurement-support` | Procurement Support hero `.f3d-hero__media` | Portrait editorial | Organized requirement building | Meaningful; documents, instruments and structured selection |

**Required total:** 20 slots.

## Optional Slots

`A-03+` and `P-02+` remain optional only when an existing component or approved future timeline explicitly expects media. No new decorative section will be created merely to use extra images.

## Desktop and Mobile Crop Rules

### H-01 Hero

- Desktop: protect the left 44% for eyebrow, heading, body and actions.
- Desktop focal zone: right-center, extending from about 58% to 94% width.
- Mobile: image becomes atmospheric support; retain one readable instrument cluster rather than the full arrangement.
- Overlay: strongest at left; transparent enough at right to preserve metallic detail.

### Family tiles

- Existing title/action area remains lower-left.
- Instrument subject should sit center-right or upper-right.
- Dark tiles require a soft black lower gradient; light tiles require a warm-white lower gradient.
- Mobile crop must keep family identity recognizable without needing embedded labels.

### Catalogue cards

- Homepage cards remain graphic/editorial and can use cropped covers, layered spreads and controlled tint.
- Dedicated catalogue cards remain document-readable and use actual cover/spread material.
- Any source text visible in the image must be actual Rosa catalogue content.

### About and procurement

- Portrait slots must tolerate approximately 4:5 mobile crops.
- No face is required; hands are acceptable only when natural and unbranded.
- No scene may imply Rosa owns a visible factory, laboratory or certification process.

## Source Strategy by Slot Group

| Group | Production-safe primary source | Web-source role |
|---|---|---|
| H-01 | Custom editorial composition from Rosa-owned instrument photography | Free-stock/reference candidate used only when visibly superior and licensable |
| H-02-H-06 | Rosa catalogue instrument photography/cutouts | Free-stock reserve where family identity is clearer and visually coherent |
| H-07 | Free-stock document/instrument review or custom catalogue/document composition | Primary search priority |
| H-08-H-12 | Rosa-owned catalogue covers and spreads | Not required |
| C-01-C-05 | Rosa-owned catalogue covers and spreads | Not required |
| A-01 | Rosa instrument macro crop/composition or permissive craftsmanship macro | Free-stock primary/reserve comparison |
| A-02 | Rosa catalogue/document composition | Free-stock reserve |
| P-01 | Free-stock structured selection or Rosa catalogue/document composition | Primary search priority |

## Source Catalogue Findings

The supplied PDFs contain sufficiently clean, high-resolution instrument photography and document design to support:

- five coherent category tiles;
- a right-weighted dark hero composition;
- premium printed-catalogue mockups;
- clean dedicated catalogue covers;
- macro craftsmanship crops;
- document-led procurement compositions.

Useful source pages observed during render audit:

- Knives: cover and product-rich pages 2, 9, 12-15.
- Scissors: cover and broad representative pages 2-10.
- Punches: cover, strong long-instrument pages 2-5 and 27-31.
- Chisels: cover and large-detail pages 2-13, 16-21.
- Cutters: cover and strong jaw/plier pages 2-10.

## Baseline Limitation

The execution container cannot resolve `github.com`, so a full local clone and baseline Next.js test run are currently unavailable. Repository inspection and writes continue through the authenticated GitHub connector. Local PDF rendering and image composition remain available. This limitation must be carried into verification reporting rather than hidden.
