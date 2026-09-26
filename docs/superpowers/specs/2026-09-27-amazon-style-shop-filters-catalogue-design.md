# Specification: Amazon-Style Catalogue Shop Layout, Live Search Autocomplete, Card Quoting & Product Imagery Fixes

**Author**: Antigravity  
**Date**: 2026-09-27  
**Status**: In Review  
**Branch**: `feature/wordpress-dynamic-catalogue`

---

## 1. Executive Summary & Goals

This specification defines the transformation of the Rosa Medical public Shop/Catalogue into an Amazon-style e-commerce browsing experience, fixes single-image placeholder leaks in the product detail view, and eliminates friction in setting product quantities in WooCommerce admin.

### Goals
1. **Product Detail Single-Image Fix**: If a product has only 1 image, completely hide the thumbnail strip. Never render empty placeholder slots. If a product has $\ge 2$ images, render thumbnails strictly for the images that exist.
2. **WooCommerce Admin Quantity Convenience**: Automatically pre-check "Manage stock?" on the Product edit screen for new products so the numerical Quantity input field is immediately visible without digging through nested tabs.
3. **Amazon-Style Shop Layout**:
   - Left-hand sidebar on desktop with faceted filters (Family, Shape/Curvature, Instrument Grade/Feature, Size/Length).
   - Mobile-responsive collapsible filter sheet/drawer.
   - Compact, high-density 4-column product grid (desktop), 3-column (tablet), 2-column (mobile).
   - Clean, uncluttered layout stripped of verbose filler text.
4. **On-Card Direct Quantity & Quoting**:
   - Each product card contains a compact quantity stepper (`-` `[ 1 ]` `+`) and a direct **"Add to Quote"** button.
   - Direct integration with `RosaQuoteBasket` (`quote-selection.js`): updates the floating quote drawer badge and displays success notifications immediately without page reloads.
5. **Live Search Autocomplete Dropdown**:
   - As the user types into the existing search input ($\ge 2$ characters), display an instant suggestion dropdown directly underneath.
   - Suggestions include product thumbnail, title, family badge, SKU/reference code, and click-to-view navigation.
   - Full keyboard navigation (Arrow Up/Down, Enter, Escape) and click-outside dismissal.
6. **Arabic RTL Parity**:
   - Complete RTL alignment for sidebar filters, live search dropdown, compact product cards, and quotation actions.

### Non-Goals
- Adding retail checkout, payment gateways, or cart pages (Rosa Medical remains strictly an inquiry and quotation-driven medical procurement platform).
- Re-architecting the WooCommerce underlying data model (continues to use canonical `product`, `product_cat`, `product_variation`, and standard post/term metadata).

---

## 2. Product Detail Image Gallery Fix

### Problem
In `ProductWidgets.php` (line 206) and `product-detail-prototype.php` (line 135), the code explicitly enforced 4 thumbnails with `max(4, count($ids))` and rendered `media-slot` placeholders whenever fewer than 4 images existed.

### Required Behavior
- Collect all valid, non-empty image attachment IDs: featured image + gallery images.
- If total images $\le 1$:
  - Render the main image viewer only.
  - Omit `.rosa-product-detail__thumbnails` container completely from the DOM (or apply `display: none`).
- If total images $> 1$:
  - Render thumbnail buttons strictly for the actual images.
  - Zero placeholder slots.
- Apply to both the Elementor widget (`ProductWidgets.php`) and standalone prototype (`product-detail-prototype.php`).

---

## 3. WooCommerce Admin Quantity Helper

### Problem
When adding products in WooCommerce (`wp-admin/post-new.php?post_type=product`), WooCommerce defaults `_manage_stock` to `"no"`. The numerical "Quantity" (Stock quantity) field is hidden until the user clicks the "Inventory" tab and checks the "Manage stock?" checkbox.

### Solution
- Register an admin hook in `rosa-medical-core` (`includes/ProductAdminHelper.php`):
  - On the new product screen, default the `_manage_stock` checkbox to checked (`checked="checked"`), automatically exposing the stock quantity input field immediately.
  - Add inline admin guidance tooltip/badge highlighting where stock quantity is maintained.

---

## 4. Amazon-Style Shop Layout & Filters

### Layout Architecture
Below the header banner and search bar, the shop transitions to a two-column Amazon-style architecture:
- **Left Column / Sidebar (width: ~280px on desktop)**:
  - Sticky faceted filter panel.
  - Active filter chips with individual `✕` dismiss controls and a `Reset All Filters` button.
  - Collapsible accordion sections:
    1. **Family / Category**: `All Families` (radio/pill), followed by all dynamic published families with live product counts (e.g. `Scissors (42)`, `Cutters (28)`).
    2. **Curvature / Profile**: `All Profiles`, `Straight`, `Curved`, `Angled`.
    3. **Grade / Special Feature**: `Standard`, `Tungsten Carbide (TC / Gold)`, `Supercut (Black)`.
    4. **Size / Length Range**: `< 12 cm`, `12 – 16 cm`, `17 – 20 cm`, `> 20 cm`.
  - Mobile: A sticky "Filter & Sort" bar with a filter count badge triggers an off-canvas slide-out sheet.
- **Right Column / Product Grid**:
  - Live result summary: e.g. `Showing 42 instruments in Scissors` + sorting dropdown (`Default`, `Name A–Z`, `Catalogue Code`).
  - High-density CSS grid: 4 columns on large screens ($\ge 1200\text{px}$), 3 columns on tablet ($\ge 768\text{px}$), 2 columns on mobile ($< 768\text{px}$).

### Multi-Filter Conflict Prevention
1. **Dynamic Faceting (Disabling Dead Ends)**:
   - When a user selects a Family (e.g. `Punches`), attributes that have 0 matching products are disabled (greyed out with `(0)` and non-clickable).
2. **Graceful Empty State**:
   - If an exotic combination yields zero matches, show:
     *"No instruments match the selected filters."* with a prominent *"[ Clear All Filters ]"* button.
3. **URL State Synchronization**:
   - Filter state is reflected in URL query parameters (`?family=scissors&profile=curved&s=iris`), enabling bookmarking, sharing, and browser back/forward navigation.

---

## 5. High-Density Product Card & Direct Quotation Interaction

### Card Sizing & Hierarchy
- Remove filler marketing paragraphs and oversized whitespace.
- Card height is constrained to $\approx 360\text{px} - 390\text{px}$ (compared to previous $500\text{px}+$):
  - **Media Area**: Aspect ratio $\approx 1:1$ or $4:3$, max height $180\text{px}$, light neutral background, subtle border, smooth hover zoom.
  - **Category/Family Tag**: Small uppercase tracking badge (e.g. `SCISSORS`).
  - **Title**: 2-line clamp, clean typography, clickable linking to detail page.
  - **Catalogue SKU**: Subdued monospace/semi-bold code (e.g. `REF: 10-1002`).
  - **Quotation Bar**:
    - Quantity Stepper: Compact flex group with `[-]`, `input[type="number"]` (min=1, default=1), `[+]`.
    - Button: Compact primary accent button with icon and text `Add to Quote` / `أضف للطلب`.
- Clicking "Add to Quote":
  - Extracts the product ID, primary SKU / variation ID, and chosen quantity.
  - Dispatches `RosaQuoteBasket.add({ productId, variationId, sku, quantity })`.
  - Shows an inline confirmation badge ("✓ Added") and triggers the drawer counter bump.

---

## 6. Live Search Autocomplete Dropdown

### Behavior & UX
- Listens to input events on `#rosa-live-shop-search`.
- Debounced at $250\text{ms}$.
- Activates when query length $\ge 2$ characters.
- Query runs client-side against the pre-indexed catalogue dataset (or fast local REST endpoint `/wp-json/rosa/v1/search?q=...`).
- Renders an absolute dropdown floating directly under the search bar:
  - Header: `Suggested Instruments`
  - Max 6 results displayed with:
    - Thumbnail image ($44\times 44\text{px}$)
    - Title with matched letters highlighted
    - Family badge
    - Catalogue SKU
  - Footer: `View all results for "[query]" →`
- Keyboard Navigation:
  - `ArrowDown` / `ArrowUp` moves active selection highlight.
  - `Enter` on a highlighted item navigates to that product page.
  - `Enter` on the input submits full search.
  - `Escape` or clicking outside closes the dropdown.

---

## 7. Files Touched & Created

| Path | Action | Description |
| :--- | :--- | :--- |
| `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductWidgets.php` | Modify | Fix gallery loop: hide thumbnails if $\le 1$ image, zero empty placeholders. |
| `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php` | Modify | Mirror gallery fix in standalone template. |
| `wordpress/wp-content/plugins/rosa-medical-core/includes/ProductAdminHelper.php` | Create | Auto-check `_manage_stock` for new products in WP Admin. |
| `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php` | Modify | Wire `ProductAdminHelper` and autocomplete REST/AJAX endpoint. |
| `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php` | Modify | Render Amazon-style sidebar + high-density product grid + autocomplete container. |
| `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php` | Modify | Add quantity stepper and direct `data-rosa-add-to-quote` controls. |
| `wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css` | Create | High-density grid, sidebar filters, chips, mobile sheet, autocomplete dropdown styles. |
| `wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js` | Create | Faceted filtering, URL sync, live search autocomplete, quantity steppers. |
| `wordpress/scripts/tests/product-gallery-single-image.test.php` | Create | Automated unit test verifying no placeholder thumbnails when 1 image exists. |
| `wordpress/scripts/tests/shop-amazon-layout-contract.test.php` | Create | Automated contract test verifying sidebar, filters, compact cards, quoting controls, and autocomplete. |

---

## 8. Verification & Acceptance Criteria

1. **Product Gallery Single Image**:
   - A product with 1 image exhibits zero empty placeholder boxes and no visible empty thumbnail strip.
   - A product with 3 images exhibits exactly 3 thumbnails.
2. **WooCommerce Quantity Addition**:
   - Opening `wp-admin/post-new.php?post_type=product` displays the Quantity / Stock quantity input immediately accessible.
3. **Amazon-Style Shop Experience**:
   - The shop presents a clean left sidebar with Family, Shape, Grade, and Size filters.
   - Selecting a filter instantly filters the product grid with live counters and URL parameter sync.
   - Cards are compact (4-columns on desktop), uncluttered by long paragraphs.
4. **On-Card Quoting**:
   - Adjusting quantity stepper and clicking "Add to Quote" increments the quote basket correctly.
5. **Search Autocomplete**:
   - Typing $\ge 2$ characters displays an instant dropdown with matching thumbnails, titles, and SKUs.
6. **Arabic RTL**:
   - Complete layout mirroring in `/ar/shop/`.
7. **Regression Suite**:
   - Full automated test suite passes with zero regressions.
