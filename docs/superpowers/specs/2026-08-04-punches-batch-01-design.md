# Punches Batch 01 Design

Date: 2026-08-04 PKT
Branch: `preview/punches-image-batch-01`

## Goal

Create the first production-media Punches batch from client-supplied printed catalogue pages 1–3, preserving exact code/size mappings and avoiding duplicate public products.

## Approved scope

- Client source: `Punches Catalog(1).pdf`
- Printed catalogue pages: 1, 2, and 3
- Visible configurations: 14
- Exact catalogue codes: 32
- Runtime derivatives: 28 — 14 AVIF and 14 WebP
- Rights mode: `preferred-safe`
- Review status before Ahmad's visual review: `candidate`

## Catalogue inventory

### Printed page 1 — 4 Yeoman configurations, 12 codes

1. Yeoman code group `21-10xx`
   - `21-1001` — 28.0 cm
   - `21-1002` — 35.0 cm
   - `21-1003` — 42.0 cm
2. Yeoman code group `21-11xx`
   - `21-1101` — 28.0 cm
   - `21-1102` — 35.0 cm
   - `21-1103` — 42.0 cm
3. Yeoman code group `21-12xx`
   - `21-1201` — 28.0 cm
   - `21-1202` — 35.0 cm
   - `21-1203` — 42.0 cm
4. Yeoman code group `21-13xx`
   - `21-1301` — 28.0 cm
   - `21-1302` — 35.0 cm
   - `21-1303` — 42.0 cm

The catalogue shows four visibly distinct working-end configurations but does not print four distinct descriptive names. Product names and descriptions therefore use conservative code-group language rather than inventing unsupported morphology.

### Printed page 2 — 4 configurations, 12 codes

5. Yeoman code group `21-14xx`
   - `21-1401` — 28.0 cm
   - `21-1402` — 35.0 cm
   - `21-1403` — 40.0 cm
6. Yeoman code group `21-15xx`
   - `21-1501` — 28.0 cm
   - `21-1502` — 35.0 cm
   - `21-1503` — 40.0 cm
7. Turrel code group `21-16xx`
   - `21-1601` — 28.0 cm
   - `21-1602` — 35.0 cm
   - `21-1603` — 40.0 cm
8. Turrel code group `21-17xx`
   - `21-1701` — 28.0 cm
   - `21-1702` — 35.0 cm
   - `21-1703` — 40.0 cm

Each group represents one unchanged visible working-end configuration with shaft-length-only variants.

### Printed page 3 — 6 configurations, 8 codes

9. Fahlbusch Micro Scissors, horizontal cutting
   - `38-2401`
10. Nicola Forceps spoon-shaped
    - `38-2410`
11. Nicola Forceps biopsy, straight
    - `38-2402`
12. Yasargil-Nicola Forceps
    - `038-2420`
13. Citelly Laminectomy Punches
    - `38-2501` — 1.0 mm
    - `38-2502` — 2.0 mm
    - `38-2503` — 3.0 mm
14. Beyer Laminectomy Punch
    - `38-2510`

Citelly groups only the printed opening-size variants because the catalogue presents one unchanged body configuration.

## Route and migration behavior

The current registry already contains three page-1 Yeoman placeholders:

- `product_yeoman` / `yeoman`
- `product_yeoman_perforated` / `yeoman-perforated`
- `product_yeoman_rectangular` / `yeoman-rectangular`

Batch 01 upgrades these three existing routes in place for the corresponding `21-10xx`, `21-11xx`, and `21-12xx` configurations. It does not create duplicate products or duplicate routes.

The existing unrelated Biopsy Punch record remains preserved without Batch 01 media.

Expected public Punches total after integration:

- 14 Batch 01 configurations
- 1 preserved Biopsy Punch
- 15 total products

## Media architecture

- Add `punches` to the shared catalogue-media family union and validator allow-list.
- Add one manifest record per visible configuration.
- Store runtime files under `/media/catalogue-preview/punches/`.
- Produce a transparent 1800 × 1800 AVIF and WebP for each configuration.
- Preserve the printed instrument and working-end geometry exactly.
- Do not generate, redraw, stretch, straighten, curve, rotate non-proportionally, or combine working ends across code groups.
- For page 1 and page 2, retain the full-body instrument context and the exact printed working-end detail associated with each code group.
- For page 3, isolate the complete printed instrument presentation for each named configuration.

## Registry behavior

Each Batch 01 product exposes:

- exact first catalogue code as `code`
- all grouped catalogue codes through `catalogueCodes`
- unique local AVIF and WebP paths
- source ledger URL
- conservative review note
- printed catalogue page reference

No ecommerce, inventory, certification, rating, or clinical claims are added.

## Test design

### Inventory tests

Require:

- 14 visible configurations
- page distribution 4 / 4 / 6
- 32 exact codes
- no duplicate codes
- grouping only for shaft-length or opening-size variants
- unique IDs, slugs, and media IDs
- preservation of the three established Yeoman routes

### Media tests

Require:

- all 14 expected media IDs
- 14 AVIF and 14 WebP paths
- all files local, unique, and non-empty
- complete client-catalogue provenance
- `candidate` review status before approval

### Registry and composition tests

Require:

- 15 public Punches products
- 14 products with Batch 01 local media
- 32 grouped Batch 01 catalogue-code records
- preserved Biopsy Punch without Batch 01 media
- updated overall catalogue total

### Playwright tests

Across desktop, tablet, and mobile:

- `/products/punches` renders 15 cards
- exactly 14 local Punches pictures load successfully
- the preserved Biopsy Punch remains visible
- the established `/products/punches/yeoman` route resolves with exact `21-1001` and `28.0 cm` data
- the primary image uses the local Punches AVIF/WebP pair with `object-fit: contain`
- no horizontal overflow

## Review and completion gate

The generated contact sheet is reviewed by Ahmad before any asset moves from `candidate` to `approved`. Approval does not authorize merge, deployment, Supabase transfer, or backend persistence.
