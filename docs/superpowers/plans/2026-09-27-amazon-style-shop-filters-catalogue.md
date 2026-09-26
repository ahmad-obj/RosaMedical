# Amazon-Style Shop Layout, Live Search Autocomplete, Card Quoting & Product Imagery Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Rosa Medical public shop into an Amazon-style e-commerce catalogue with faceted sidebar filtering, live search autocomplete, dense 4-column product cards with quantity steppers and direct quote actions, auto-enable product quantity in WooCommerce admin, and eliminate empty placeholder thumbnails on single-image product detail views.

**Architecture:**
- **Product Detail View**: Suppress thumbnail row when product image count $\le 1$; only render valid thumbnails for actual images.
- **WooCommerce Admin**: Hook into product screen initialization to auto-check `_manage_stock` for new products, making the Quantity input field immediately accessible.
- **Shop Architecture**: Amazon-style two-column layout below search banner featuring a sticky faceted sidebar (Family, Profile, Grade, Length) with dynamic conflict prevention (disabling 0-match combinations), dismissible filter badges, URL state synchronization, and a high-density 4-column product grid.
- **Card Interaction**: High-density card with compact thumbnail, family tag, title, catalogue code, quantity stepper (`-` `[1]` `+`), and direct "Add to Quote" button integrated into `RosaQuoteBasket`.
- **Search Autocomplete**: Live REST/AJAX endpoint `/wp-json/rosa/v1/search` and client-side autocomplete dropdown showing matching thumbnails, titles, family tags, and SKUs with full keyboard navigation.
- **Bilingual & RTL**: Complete LTR and RTL styling matching the existing Rosa Medical design system tokens.

**Tech Stack:** PHP 8+, WordPress 6.x, WooCommerce 9.x, Elementor Free, Vanilla JavaScript (ES6+), CSS3 Flexbox/Grid, Playwright test harness.

**Spec:** [`docs/superpowers/specs/2026-09-27-amazon-style-shop-filters-catalogue-design.md`](file:///home/mmm/Projects/RosaMedical/docs/superpowers/specs/2026-09-27-amazon-style-shop-filters-catalogue-design.md)

---

## Global Constraints
- Preserve accepted Rosa design system tokens: ink (`#191917`), brand red (`#b71920`), borders (`rgb(25 25 23 / 0.11)`), and typography.
- Never render empty placeholder slots (`home-clinical-media__placeholder` or empty media boxes) when a product has only 1 image.
- WooCommerce remains canonical for products, variations, categories, and inventory.
- Zero retail eCommerce checkout or shopping carts (quotation inquiry model preserved).
- Full Arabic RTL parity on `/ar/shop/` and `/ar/`.

## Review Focus
1. **Single-image product detail page**: Opening a product with only 1 uploaded image shows the main image viewer with zero empty thumbnail boxes below it.
2. **Filter combinations with 0 matches**: Selecting an exotic combination greys out / disables 0-match options and offers a prominent "Clear All Filters" button if zero results occur.
3. **Card quantity stepper boundary**: The quantity input cannot go below 1 or contain non-numeric characters.
4. **Search autocomplete debounce and dismiss**: Rapid typing does not flood network requests, and pressing Escape or clicking outside cleanly closes the dropdown.
5. **Arabic RTL alignment**: In RTL, the sidebar floats to the right, product card elements align right-to-left, and autocomplete dropdown mirrors properly.

---

## Tasks

### Task 1: Product Detail Single-Image Gallery Fix (TDD)

**Files:**
- Create: `wordpress/scripts/tests/product-gallery-single-image.test.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductWidgets.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css`

- [ ] **Step 1: Write failing test for single-image gallery rendering**
  Create `wordpress/scripts/tests/product-gallery-single-image.test.php` asserting that when image count $\le 1$:
  - No thumbnail buttons or `.rosa-product-detail__thumbnails` container are rendered.
  - Zero placeholder slots (`catalogue-product` or empty image tags) appear in thumbnails.
  - When image count $> 1$, thumbnail count equals exactly the image count.

- [ ] **Step 2: Run test to confirm failure**
  ```bash
  php wordpress/scripts/tests/product-gallery-single-image.test.php
  ```

- [ ] **Step 3: Implement single-image logic in `ProductWidgets.php` and `product-detail-prototype.php`**
  - In `ProductWidgets.php` (`render_gallery`):
    - Compute `$ids = array_values(array_unique(array_filter(array_merge([$product->get_image_id()], $product->get_gallery_image_ids()), fn($id) => (int) $id > 0)))`.
    - If `count($ids) > 1`, render the `.rosa-product-detail__thumbnails` loop strictly over `$ids`.
    - If `count($ids) <= 1`, do not output `.rosa-product-detail__thumbnails`.
  - Mirror the exact logic in `product-detail-prototype.php`.
  - In `product-detail-live-visual-recovery.css`, ensure `.rosa-product-detail__gallery-main` looks complete and well-proportioned when standalone without thumbnails.

- [ ] **Step 4: Run test to confirm pass**
  ```bash
  php wordpress/scripts/tests/product-gallery-single-image.test.php
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add wordpress/scripts/tests/product-gallery-single-image.test.php \
          wordpress/wp-content/plugins/rosa-medical-core/src/Elementor/Widgets/ProductWidgets.php \
          wordpress/wp-content/plugins/rosa-medical-core/templates/product-detail-prototype.php \
          wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css && \
  git commit -m "fix(gallery): hide thumbnail row for single-image products and remove placeholder boxes"
  ```

---

### Task 2: WooCommerce Admin Product Stock Quantity Default Helper (TDD)

**Files:**
- Create: `wordpress/scripts/tests/product-admin-quantity-helper.test.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/includes/ProductAdminHelper.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`

- [ ] **Step 1: Write failing test for admin quantity helper**
  Create `wordpress/scripts/tests/product-admin-quantity-helper.test.php` asserting that:
  - `ProductAdminHelper` exists and hooks into `admin_enqueue_scripts` and `woocommerce_product_options_stock_status`.
  - On `post-new.php?post_type=product`, inline script or default sets `_manage_stock` to checked, exposing stock quantity immediately.

- [ ] **Step 2: Run test to confirm failure**
  ```bash
  php wordpress/scripts/tests/product-admin-quantity-helper.test.php
  ```

- [ ] **Step 3: Implement `ProductAdminHelper.php`**
  - Implement `ProductAdminHelper` class:
    - Enqueues a lightweight admin script on `post-new.php?post_type=product` that checks `input#_manage_stock` by default and triggers change to expose `#_stock` input.
    - Adds an admin note/tooltip on the Inventory tab: `"Quantity is active. Enter stock quantity here."`.
  - Wire `ProductAdminHelper::init()` in `rosa-medical-core.php`.

- [ ] **Step 4: Run test to confirm pass**
  ```bash
  php wordpress/scripts/tests/product-admin-quantity-helper.test.php
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add wordpress/scripts/tests/product-admin-quantity-helper.test.php \
          wordpress/wp-content/plugins/rosa-medical-core/includes/ProductAdminHelper.php \
          wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php && \
  git commit -m "feat(admin): auto-enable manage stock quantity on new WooCommerce products"
  ```

---

### Task 3: Compact Product Cards with Quantity Stepper & Direct Quoting (TDD)

**Files:**
- Create: `wordpress/scripts/tests/catalogue-card-quoting-contract.test.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css`
- Create: `wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js`

- [ ] **Step 1: Write failing test for card quantity stepper and quote controls**
  Create `wordpress/scripts/tests/catalogue-card-quoting-contract.test.php` asserting that:
  - Product card contains `data-rosa-quote-item`, `input[data-rosa-quote-quantity]` with default value `1` and min `1`.
  - Product card contains stepper buttons `[data-rosa-qty-minus]` and `[data-rosa-qty-plus]`.
  - Product card contains `button[data-rosa-add-to-quote]` with `data-product-id`, `data-sku`, and `data-variation-id`.
  - Compact CSS rules exist for `.rosa-preview-product` and `.rosa-preview-product__quote-bar`.

- [ ] **Step 2: Run test to confirm failure**
  ```bash
  php wordpress/scripts/tests/catalogue-card-quoting-contract.test.php
  ```

- [ ] **Step 3: Implement compact card markup and styling**
  - In `product-card.php`:
    - Clean up layout: compact image thumbnail ($1:1$, max $180\text{px}$), family badge, product title link, catalogue code (`REF: [sku]`).
    - Add quote controls wrapper:
      ```html
      <div class="rosa-preview-product__quote-bar" data-rosa-quote-item>
        <div class="rosa-qty-stepper">
          <button type="button" class="rosa-qty-btn" data-rosa-qty-minus aria-label="Decrease quantity">-</button>
          <input type="number" class="rosa-qty-input" data-rosa-quote-quantity value="1" min="1" step="1" inputmode="numeric">
          <button type="button" class="rosa-qty-btn" data-rosa-qty-plus aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="rosa-preview-button rosa-preview-button--accent rosa-card-quote-btn" data-rosa-add-to-quote data-product-id="<?php echo esc_attr((string) $product->get_id()); ?>" data-sku="<?php echo esc_attr($primarySku); ?>" data-variation-id="<?php echo esc_attr((string) $primaryVariationId); ?>">
          <?php echo esc_html($locale === 'ar' ? 'أضف للطلب' : 'Add to Quote'); ?>
        </button>
      </div>
      ```
  - In `shop-filters-autocomplete.js`, add stepper click handlers (`-` decrements down to 1, `+` increments).
  - In `shop-amazon-layout.css`, style compact cards, steppers, and buttons.
  - Update `wordpress/scripts/tests/catalogue-card-navigation-only.test.php` or replace it with `catalogue-card-quoting-contract.test.php`.

- [ ] **Step 4: Run test to confirm pass**
  ```bash
  php wordpress/scripts/tests/catalogue-card-quoting-contract.test.php
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add wordpress/scripts/tests/catalogue-card-quoting-contract.test.php \
          wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/product-card.php \
          wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css \
          wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js && \
  git commit -m "feat(shop): add compact card layout with quantity stepper and direct quote button"
  ```

---

### Task 4: Fast Search Autocomplete Dropdown & Endpoint (TDD)

**Files:**
- Create: `wordpress/scripts/tests/search-autocomplete-contract.test.php`
- Create: `wordpress/wp-content/plugins/rosa-medical-core/includes/SearchAutocompleteController.php`
- Modify: `wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css`

- [ ] **Step 1: Write failing test for search autocomplete**
  Create `wordpress/scripts/tests/search-autocomplete-contract.test.php` asserting that:
  - `SearchAutocompleteController` registers route `/rosa/v1/search` with parameter `q`.
  - Returns matching products array containing `id`, `name`, `slug`, `sku`, `family`, `thumbnail`, and `url`.
  - JS in `shop-filters-autocomplete.js` handles input debounce ($250\text{ms}$), keyboard navigation (Up, Down, Enter, Esc), and renders `.rosa-search-autocomplete`.

- [ ] **Step 2: Run test to confirm failure**
  ```bash
  php wordpress/scripts/tests/search-autocomplete-contract.test.php
  ```

- [ ] **Step 3: Implement `SearchAutocompleteController.php` and client autocomplete**
  - Implement `SearchAutocompleteController`:
    - Handles `GET /wp-json/rosa/v1/search?q={query}&lang={locale}`.
    - Queries WooCommerce products by title, SKU, or family tag.
    - Limits to top 6 results, returning JSON with image URLs and localized links.
  - Wire in `rosa-medical-core.php`.
  - Implement autocomplete dropdown in `shop-filters-autocomplete.js`:
    - Mounts dropdown directly under `#rosa-live-shop-search`.
    - Handles click-to-view and keyboard navigation.
  - Add dropdown styling in `shop-amazon-layout.css` (elevated white card, smooth shadow, hover highlight).

- [ ] **Step 4: Run test to confirm pass**
  ```bash
  php wordpress/scripts/tests/search-autocomplete-contract.test.php
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add wordpress/scripts/tests/search-autocomplete-contract.test.php \
          wordpress/wp-content/plugins/rosa-medical-core/includes/SearchAutocompleteController.php \
          wordpress/wp-content/plugins/rosa-medical-core/rosa-medical-core.php \
          wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js \
          wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css && \
  git commit -m "feat(search): implement instant search autocomplete dropdown with thumbnails and SKUs"
  ```

---

### Task 5: Amazon-Style Faceted Sidebar Filters & Shop Grid Layout (TDD)

**Files:**
- Create: `wordpress/scripts/tests/shop-amazon-layout-contract.test.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css`
- Modify: `wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js`

- [ ] **Step 1: Write failing test for Amazon-style shop layout**
  Create `wordpress/scripts/tests/shop-amazon-layout-contract.test.php` asserting that:
  - `shop-page.php` renders sidebar container `.rosa-shop-sidebar` with filter groups:
    - Family filter with live count indicators.
    - Profile / Curvature filter (`Straight`, `Curved`, `Angled`).
    - Feature / Grade filter (`Standard`, `Tungsten Carbide`, `Supercut`).
    - Length / Size filter (`< 12 cm`, `12–16 cm`, `17–20 cm`, `> 20 cm`).
  - Active filter chips container `.rosa-active-filters` with `Clear all`.
  - Main products area `.rosa-shop-main` with 4-column grid `.rosa-shop-products-grid`.
  - Zero verbose filler paragraphs.

- [ ] **Step 2: Run test to confirm failure**
  ```bash
  php wordpress/scripts/tests/shop-amazon-layout-contract.test.php
  ```

- [ ] **Step 3: Implement Amazon-style layout in `shop-page.php` & assets**
  - Refactor `shop-page.php`:
    - Keep hero banner and search bar intact.
    - Below hero, render `.rosa-shop-container` with:
      - Left sidebar `.rosa-shop-sidebar` containing filter accordions and count badges.
      - Right content `.rosa-shop-main` with active filter chips, results count, sorting selector, and product grid.
      - Mobile filter toggle button and slide-out drawer.
  - In `shop-filters-autocomplete.js`:
    - Implement faceted filtering engine: filters cards based on active family, profile, grade, size, and search query.
    - Update live counts on other filters; disable filter options having 0 matches to prevent conflicts.
    - Synchronize filter selections with URL query parameters (`history.pushState`).
    - Render empty state with "Clear All Filters" button if 0 results match.
  - Enqueue `shop-amazon-layout.css` and `shop-filters-autocomplete.js` in `functions.php`.
  - Add complete desktop, tablet, mobile, and Arabic RTL styles in `shop-amazon-layout.css`.

- [ ] **Step 4: Run test to confirm pass**
  ```bash
  php wordpress/scripts/tests/shop-amazon-layout-contract.test.php
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add wordpress/scripts/tests/shop-amazon-layout-contract.test.php \
          wordpress/wp-content/themes/rosa-medical-child/template-parts/client-preview/shop-page.php \
          wordpress/wp-content/themes/rosa-medical-child/functions.php \
          wordpress/wp-content/themes/rosa-medical-child/assets/css/shop-amazon-layout.css \
          wordpress/wp-content/themes/rosa-medical-child/assets/js/shop-filters-autocomplete.js && \
  git commit -m "feat(shop): implement Amazon-style sidebar filters and high-density product grid"
  ```

---

### Task 6: Visual Verification, End-to-End Testing & Handoff

**Files:**
- Verify: Full test suite
- Generate: Responsive screenshots in `wordpress/.client-preview-artifacts/screenshots/`

- [ ] **Step 1: Run the full test suite**
  ```bash
  php wordpress/scripts/tests/product-gallery-single-image.test.php && \
  php wordpress/scripts/tests/product-admin-quantity-helper.test.php && \
  php wordpress/scripts/tests/catalogue-card-quoting-contract.test.php && \
  php wordpress/scripts/tests/search-autocomplete-contract.test.php && \
  php wordpress/scripts/tests/shop-amazon-layout-contract.test.php && \
  php wordpress/scripts/tests/home-visual-restoration-contract.test.php && \
  php wordpress/scripts/tests/latest-home-family-discovery.test.php && \
  php wordpress/scripts/tests/catalogue-families-model.test.php && \
  php wordpress/scripts/tests/catalogue-admin-ux.test.php && \
  php wordpress/scripts/tests/catalogue-import-idempotency.test.php && \
  bash wordpress/scripts/tests/client-preview-shop-contract.test.sh && \
  bash wordpress/scripts/tests/client-preview-home-contract.test.sh
  ```

- [ ] **Step 2: Capture responsive screenshots**
  Capture Desktop (1440x900) and Mobile (390x844) screenshots in English and Arabic:
  - `/shop/` (desktop & mobile)
  - `/ar/shop/` (desktop & mobile)
  - Search autocomplete active state
  - Single product detail view (confirming zero placeholder boxes)

- [ ] **Step 3: Push completed work to GitHub**
  ```bash
  git push origin feature/wordpress-dynamic-catalogue
  ```
