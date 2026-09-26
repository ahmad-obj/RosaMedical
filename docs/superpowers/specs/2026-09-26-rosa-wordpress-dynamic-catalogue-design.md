# Rosa Medical WordPress Dynamic Catalogue Design

- **Date**: 2026-09-26
- **Status**: Approved / In-progress
- **Harness**: Superpowers architectural execution
- **Target Branch**: `feature/dynamic-catalogue-architecture` (based on `audit/complete-image-qa-2026-09-15`)

---

## 1. Executive Summary & Goals

Rosa Medical requires a fully dynamic, client-maintainable surgical instrument catalogue in WordPress. The accepted public website visual language, typography, headers, footers, quotation basket flow, Elementor Free content model, and responsive RTL design must be preserved without redesign.

This design transitions the catalogue from static preview arrays and filler cards into a canonical WooCommerce data model with dedicated Rosa executive management UX:
1. **Canonical Store**: WooCommerce owns all products, variations, categories, attributes, and media. Zero parallel tables or duplicate database truths.
2. **Dynamic Families**: Catalogue families are WooCommerce `product_cat` terms extended with term metadata for bilingual Arabic labels, custom ordering, visibility, cover artwork, and attached PDF catalogues.
3. **Professional Instrument Grouping**: An instrument pattern (e.g. *Iris Scissors*, *Liston Cutters*, *Hoke Osteotomes*) is a single `WC_Product_Variable` with configurations (finishes, directions, point styles, sizes) modeled as `WC_Product_Variation` records with exact SKUs, avoiding raw SKU dumping in the catalogue grid.
4. **Rosa Admin UX**: A clear, dedicated `ROSA → Catalogue` dashboard inside WordPress Admin allowing non-technical administrators to manage families, reorder them, replace cover artwork, upload/assign PDFs, and route seamlessly into WooCommerce product editing.
5. **Dynamic Public Sections**: The public Shop page dynamically renders family-wise sections in defined order, with a compact anchor navigation rail, search integration, and RTL Arabic support.
6. **Automated Idempotent Migration**: An automated, repeatable migration mechanism to seed all 5 canonical families (*Scissors*, *Cutters*, *Punches*, *Chisels*, *Knives*), their verified product records, exact SKUs, and approved product imagery from the previous website and catalogue PDFs.

---

## 2. Core Architecture & Data Model

### 2.1 WooCommerce Catalogue Schema

All catalogue entities map 1:1 to standard WordPress and WooCommerce database structures:

| Concept | WordPress / WooCommerce Entity | Notes |
|---|---|---|
| Catalogue Family | Term in `product_cat` taxonomy | Hierarchical term, slug-indexed |
| Family Display Order | Term meta `_rosa_family_order` | Integer, ascending sort order |
| Family Visibility | Term meta `_rosa_family_visible` | Boolean `1` or `0` (default `1`) |
| Family Arabic Name | Term meta `_rosa_name_ar` | Text string, displayed when locale is `ar` |
| Family Arabic Description | Term meta `_rosa_description_ar` | Text string, displayed when locale is `ar` |
| Family PDF Catalogue | Term meta `_rosa_family_pdf_id` | Attachment ID of uploaded PDF catalogue |
| Family Cover Image | Term meta `thumbnail_id` / `_rosa_family_cover_id` | Standard WooCommerce category image attachment ID |
| Instrument Product | Post of type `product` | `WC_Product_Variable` (or `WC_Product_Simple` if single variant) |
| Instrument Configuration / SKU | Post of type `product_variation` | `WC_Product_Variation`, parent = instrument product |
| Configuration Attributes | Taxonomies: `pa_finish`, `pa_direction`, `pa_point_style`, `pa_size` | Standard WooCommerce product attributes |
| Product Primary Image | Post meta `_thumbnail_id` | WooCommerce featured attachment image |
| Product Gallery Images | Post meta `_product_image_gallery` | Comma-separated attachment IDs |
| Variation Image | Post meta `_thumbnail_id` on variation | Specific visual for finish/direction |

### 2.2 Grouping Rules: Product vs. Configuration

To maintain a professional surgical instrument catalogue rather than an unmanageable dump of 200+ raw SKUs:
1. **Instrument Identity (Product)**:
   - A single product represents a distinct named surgical instrument model with a common functional profile.
   - Examples:
     - *Scissors*: Iris Scissors, Stevens Scissors, Operating Scissors, Mayo Scissors, Metzenbaum Scissors.
     - *Cutters*: Liston, Cleveland, Bohler, Mc Indoe, Ruskin-Liston, Ruskin-Rowland, Stille-Liston, SC-01T Wire Cutter.
     - *Punches*: Yeoman Punch, Yeoman Punch 360° Turnable, Turrel Punch 360° Turnable, Fahlbusch Micro Scissors, Nicola Forceps, Citelly Laminectomy Punches, Beyer Laminectomy Punch, Biopsy Punch.
     - *Chisels / Osteotomes*: Osteotomes 13.5cm, Chisels 13.5cm, Gouges 13.5cm, Hoke Osteotomes, West Chisel, West Gouge, Andrews Gouge, Alexander Osteotome, Stille Osteotomes, Codman, Lambotte, Mini Lambotte, Farabeuf.
     - *Knives*: Scalpel Handle No. 3, Scalpel Handle No. 4, Scalpel Handle No. 7, Micro Surgery Handle, Liston Knife, Hexagonal Scalpel Handle, Keyes Dermal Punches, Amputation Knife, Resection Knife.
2. **Configuration / Variation**:
   - Distinct combinations of:
     - **Finish / Material**: Regular, Super Cut, Tungsten Carbide
     - **Direction / Angle**: Straight, Curved, Angled to side, Angled on flat
     - **Point / Jaw Style**: Sharp/Sharp, Sharp/Blunt, Blunt/Blunt, Perforated, Rectangular
     - **Working Size / Length**: e.g., 9.5 cm, 10.5 cm, 11.5 cm, 14.0 cm; 2 mm, 4 mm, 6 mm, etc.
   - Each configuration carries its exact catalogue reference code as the WooCommerce variation SKU (e.g. `04-0901`, `04-0911`, `06-0901`, `36-5101`, `18-0103`).
3. **Quotation Integration**:
   - The Product Detail page displays the instrument summary, primary image/gallery, and a dropdown/table selector populated dynamically with all available configurations.
   - Selecting a configuration updates the displayed SKU and sets `data-variation-id` / `data-sku` on the "Add to Quote" button, feeding directly into [quote-selection.js](file:///home/mmm/Projects/RosaMedical/wordpress/wp-content/themes/rosa-medical-child/assets/js/quote-selection.js) and the quotation drawer.

---

## 3. WordPress Admin UX & Catalogue Management

### 3.1 Admin Navigation Hierarchy

The Rosa Medical administration menu in WordPress Admin is structured to provide an immediate, obvious catalogue management destination:

```text
ROSA
 ├─ Overview (Dashboard & system health)
 ├─ Catalogue
 │   ├─ Families (Manage families, order, PDF, cover)
 │   ├─ Products (Deep link to WooCommerce Products list)
 │   └─ Add Product (Deep link to WooCommerce Add Product)
 ├─ Website Content
 │   ├─ Homepage
 │   ├─ About
 │   ├─ Contact
 │   ├─ Product Page (Elementor template shortcut)
 │   ├─ Shop (Catalogue page copy & hero settings)
 │   └─ Site & CTA
 └─ Business Settings (Phone, email, address, Arabic address)
```

### 3.2 Catalogue Dashboard (`ROSA → Catalogue`)

The Catalogue Dashboard acts as the primary hub for managing the catalogue without technical friction:
- **Metrics Summary**: Total published families, total published products, total configurations/SKUs, quotation readiness.
- **Family Cards / List**:
  - Cover image thumbnail (with quick replace action).
  - Family name in English and Arabic.
  - Slug and permalink link ("View on site").
  - Published product count with clickable filter link: `edit.php?post_type=product&product_cat={slug}`.
  - Attached PDF catalogue status with download link or upload button.
  - Public visibility badge (toggle switch or status pill).
  - Display order input or drag handles for sequencing.
  - Primary actions: **Edit Family**, **Manage Products**, **Add Product in Family**.
- **Action Links**:
  - "Add New Family" modal or sub-screen.
  - "Add Product" button linking directly to WooCommerce's `post-new.php?post_type=product`.

### 3.3 Family Editor & Safe Deletion

- **Family Fields**:
  1. Name (English, required)
  2. Arabic Name (optional, defaults to English if empty)
  3. Slug (auto-generated from English name or custom)
  4. Display Order (integer, default 0)
  5. Public Visibility (checkbox/switch, default visible)
  6. Description (English, rich text / textarea)
  7. Arabic Description (textarea)
  8. Cover Image (WordPress media modal integration)
  9. PDF Catalogue (WordPress media modal restricted to PDF mime-type)
- **Safe Deletion Protocol**:
  - When an administrator deletes a family:
    - If the family has zero products, delete immediately.
    - If the family contains products, require an explicit choice:
      - Option A (Default): Remove family assignment; products remain safely in WooCommerce as "Uncategorized" or available for other families.
      - Option B: Reassign all products in this family to another existing family selected via a dropdown.
    - Under no circumstances does deleting a family delete products from WooCommerce.

---

## 4. Public Catalogue Implementation

### 4.1 Family-Wise Dynamic Sections

The public catalogue (`/shop/` and `/ar/shop/`) renders dynamic sections for every published family where `_rosa_family_visible` is true (or unset):
1. **Compact Anchor Navigation Rail**:
   - Placed below the search hero and above the first family section.
   - Clean, accessible pills linking to `#family-{slug}` (e.g. `[Scissors] [Cutters] [Punches] [Chisels] [Knives]`).
   - Sticky on scroll, responsive with horizontal swipe on mobile, respecting RTL in Arabic.
2. **Family Section Architecture**:
   - Each family renders as:
     ```html
     <section class="rosa-catalogue-family-section" id="family-{slug}" data-family="{slug}">
       <header class="rosa-catalogue-family-header">
         <div class="rosa-catalogue-family-header__content">
           <p class="rosa-preview-eyebrow">FAMILY</p>
           <h2>{Family Name EN / AR}</h2>
           <p class="rosa-catalogue-family-description">{Description EN / AR}</p>
         </div>
         {if PDF attached}
         <div class="rosa-catalogue-family-header__actions">
           <a class="rosa-preview-button rosa-preview-button--outline" href="{pdfUrl}" target="_blank" rel="noopener">
             Download Catalogue (PDF)
           </a>
         </div>
         {endif}
       </header>
       <div class="rosa-preview-shop-grid rosa-live-shop-grid">
         {product cards...}
       </div>
     </section>
     ```
3. **Empty Family Safeguard**:
   - If a family has zero published products, its section does not render on the public site, and it is excluded from the anchor rail.
4. **Search Interaction**:
   - If the user executes a search (`?s={term}`):
     - The product query filters by search keyword.
     - Matching products are rendered grouped under their respective family sections.
     - If no products match, a clean localized empty state is rendered (`No products matched your search. Try another instrument name or code.`).

### 4.2 Homepage Integration

[template-parts/client-preview/latest-home-family-discovery.php](file:///home/mmm/Projects/RosaMedical/wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/latest-home-family-discovery.php):
- Queries published, visible families ordered by `_rosa_family_order`.
- For each family:
  - Cover image: uses assigned attachment image (`_rosa_family_cover_id` or `thumbnail_id`), falling back gracefully to the established SVG/WebP theme asset if no custom attachment is set.
  - Link: links to the assigned PDF catalogue (`_rosa_family_pdf_id`), falling back to `/shop/#family-{slug}`.

---

## 5. Catalogue Migration & Seed Pipeline

### 5.1 Canonical Dataset Recovery

The 5 supplied Rosa catalogue PDFs and previous approved media branches (`integration/catalogue-media-all-families`, `preview/*-image-batch-01`) supply the authoritative source data:
- **Scissors**: 5 primary instruments (*Iris*, *Stevens*, *Operating*, *Mayo*, *Metzenbaum*), 42 configuration combinations with finishes (*Regular*, *Super Cut*, *Tungsten Carbide*), directions (*Straight*, *Curved*), point styles, and sizes across ~100 exact SKUs. Approved transparent 1800x1800 AVIF/WebP assets in `catalogue-preview/scissors/`.
- **Cutters**: 8 instruments (*Liston*, *Cleveland*, *Bohler*, *Mc Indoe*, *Ruskin-Liston*, *Ruskin-Rowland*, *Stille-Liston*, *SC-01T*), 14 configurations across 35 exact SKUs. Approved assets in `catalogue-preview/cutters/`.
- **Punches**: 9 instruments (*Yeoman Punch*, *Yeoman 360°*, *Turrel 360°*, *Fahlbusch Micro Scissors*, *Nicola Forceps*, *Nicola Forceps Scissors*, *Yasargil-Nicola Forceps*, *Citelly Laminectomy Punches*, *Beyer Laminectomy Punch*, *Biopsy Punch*), 15 configurations across 33 exact SKUs. Approved assets in `catalogue-preview/punches/`.
- **Chisels / Osteotomes**: 14 instruments (*Osteotomes 13.5cm*, *Chisels 13.5cm*, *Gouges 13.5cm*, *Hoke Osteotomes*, *Round Handle Gouges*, *West Chisel*, *West Gouge*, *Andrews Gouge*, *Alexander Osteotome*, *Alexander Gouge*, *Alexander Chisel*, *Stille Osteotomes*, *Stille Gouges*, *Stille Chisels*, plus *Codman*, *Lambotte*, *Mini Lambotte*, *Farabeuf*), 20 configurations across 48 exact SKUs. Approved assets in `catalogue-preview/chisels/`.
- **Knives**: 16 instruments (*Scalpel Handle No. 3*, *No. 4*, *No. 7*, *No. 9*, *Micro Surgery*, *Long*, *Long Curved*, *Hexagonal*, *Round*, *Adjustable*, *Liston Knife*, *Saalfeld Comedo Extractor*, *Fox Lupus Curettes*, *Keyes Dermal Punches*, *Amputation Knife*, *Resection Knife*), 22 configurations across 36 exact SKUs. Approved assets in `catalogue-preview/knives/`.

### 5.2 Idempotent WP-CLI Migration Tool

Script: `wordpress/scripts/catalogue-seed.php` executable via `bash wordpress/scripts/catalogue-seed.sh`:
1. **Family Upsert**:
   - Iterates the 5 canonical families.
   - Finds or creates term in `product_cat`.
   - Imports/attaches the family PDF from `apps/web/public/media/catalogues/pdf/rosa-{family}-catalogue.pdf`.
   - Imports/attaches the full-color SVG/WebP family cover from `assets/media/homepage-covers/`.
   - Stores `_rosa_name_ar`, `_rosa_description_ar`, `_rosa_family_order`, `_rosa_family_visible`, and `_rosa_family_pdf_id`.
2. **Product Media Upsert**:
   - Imports reference images from `/rosa-reference-media/catalogue-preview/{family}/` into the WordPress Media Library once, tracking source path in attachment meta `_rosa_catalogue_source_path` to guarantee zero duplicate attachments.
3. **Product & Variation Upsert**:
   - For each instrument:
     - Finds or creates `WC_Product_Variable` by slug.
     - Sets title, description, category, catalog visibility (`visible`), status (`publish`).
     - Configures product attributes (`pa_finish`, `pa_direction`, `pa_point_style`, `pa_size`).
     - Associates primary featured image and gallery images.
     - For each configuration/variation:
       - Finds or creates `WC_Product_Variation` by SKU.
       - Sets attributes, variation image, status (`publish`), stock management (`false`).
     - Deletes obsolete variations not in the canonical dataset.
     - Calls `WC_Product_Variable::sync()` and flushes transients.

---

## 6. Testing, Verification & Visual Contracts

### 6.1 Automated Test Suite
- **Unit / Contract Tests**:
  - `wordpress/scripts/tests/catalogue-families-model.test.php`: Verifies family CRUD, term meta storage, bilingual resolution, order sorting, visibility filtering, and safe deletion reassignment.
  - `wordpress/scripts/tests/catalogue-admin-ux.test.php`: Verifies `ROSA → Catalogue` menu registration, capability guards, template rendering, and deep link routing.
  - `wordpress/scripts/tests/catalogue-public-sections.test.php`: Verifies family section rendering, empty family omission, anchor navigation rail, search integration, and RTL Arabic rendering.
  - `wordpress/scripts/tests/catalogue-import-idempotency.test.php`: Verifies that running the migration twice results in identical database counts, zero duplicate products, and zero duplicate media attachments.
- **Integration Tests**:
  - Elementor Free authoring compatibility: Product Detail Elementor template continues to render dynamic widgets with real WooCommerce data.
  - Quotation flow: Variation selection, "Add to Quote", quantity updates, quotation review drawer, and request submission verify end-to-end.
  - Regression: Home, About, Contact, and Header contracts remain 100% compliant.

### 6.2 Browser Visual Verification
Using automated Playwright/Puppeteer visual captures:
- Viewports: Desktop (1440px), Tablet (1024px, 768px), Mobile (390px).
- Locales: English (`/shop/`) and Arabic (`/ar/shop/`).
- Verifications: Zero horizontal overflow, zero broken images, correct header geometry, accessible touch targets (≥44px), proper Arabic text alignment and font rendering.

---

## 7. Implementation Plan

1. **Phase 1: Architecture & Data Model (TDD)**
   - Add `FamilyModel` and `FamilyService` in `rosa-medical-core` managing `product_cat` term metadata.
   - Add unit tests for family creation, update, reordering, visibility, PDF linking, and safe deletion.
2. **Phase 2: Rosa Admin UX**
   - Add `ROSA → Catalogue` dashboard and `Families` management page in `rosa-medical-core`.
   - Integrate WordPress Media Uploader for family covers and PDFs.
   - Wire deep-links to WooCommerce product editor.
3. **Phase 3: Automated Catalogue Migration**
   - Implement `catalogue-seed.php` and `catalogue-seed.sh`.
   - Seed all 5 canonical families, products, variations, exact SKUs, and approved product imagery.
   - Verify idempotency.
4. **Phase 4: Dynamic Public Catalogue & Shop Page**
   - Update `template-parts/client-preview/shop-page.php` to render dynamic family-wise sections and anchor navigation.
   - Update `latest-home-family-discovery.php` to read dynamic families.
   - Update search handling to preserve family grouping.
5. **Phase 5: Visual Verification & Acceptance**
   - Execute full test suite (`client-preview-runtime-verify.sh`).
   - Run responsive browser captures (Desktop, Tablet, Mobile 390px in EN & AR).
   - Verify quotation flow with new products.
   - Clean up any test artifacts.
