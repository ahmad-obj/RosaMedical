# Rosa WordPress MedicaShop Homepage Fidelity Milestone Design

Date: 2026-09-01  
Branch: `wordpress/client-preview-medicashop-recreation`  
Status: approved by the user's 2026-09-01 reconstruction directive

## Purpose and authority

This milestone replaces the current Rosa client-preview presentation with an independently authored reconstruction of the selected MedicaShop template's English global header, Homepage, and global footer.

The user's 2026-09-01 directive and the measured report at `docs/superpowers/reports/2026-09-01-medicashop-homepage-visual-forensics.md` supersede conflicting visual assumptions in the 2026-08-30 and 2026-08-31 preview documents. Working WordPress, WooCommerce, business-setting, route, locale, test, and accessibility infrastructure remains in force.

## Visual acceptance statement

At equivalent viewports, the Rosa page must look like the MedicaShop Homepage with its branding, copy, accent color, and imagery replaced. It is not enough to preserve a silhouette or similar section names.

The reconstruction must match:

- the 44px/76px desktop and 41–43px/62px responsive header bands;
- the 1280px desktop rail;
- Open Sans typography and measured three-tier type scale;
- nine top-level Home sections in the measured order;
- section heights, padding, column ratios, product density, promotional mosaic, card radii/shadows, proof band, evidence band, pre-footer and footer density;
- desktop above 1024px, tablet 768–1024px, and mobile at 767px and below;
- five-column desktop/two-column mobile latest products and four-column featured products;
- full-width dropdown mobile navigation through 1024px;
- unchanged bounded desktop geometry from 1366 through 2560.

## Rosa substitution system

The target primary green role maps to Rosa red `#e00815`; hover/pressed roles use `#b90a14`. Ink, white, light grey, muted text, borders, focus blue, radii, and shadows are centralized tokens. Red appears only where the template uses its primary accent.

Text uses truthful Rosa procurement/catalogue wording with comparable line count and measure. No price, discount, shipping, payment, return, testimonial, partner, customer-count, certification, or medical claim is fabricated.

Unsupported target roles remain geometrically present:

- retail benefits become catalogue identification, quotation support, and family navigation;
- sale/price regions become truthful family or `Price on request` labels;
- Add to Cart becomes View details/Browse family;
- promotional commerce tiles become instrument-family/catalogue/inquiry tiles;
- partner logos become verified Rosa family labels;
- testimonials become three truthful workflow cards;
- newsletter becomes a quotation/contact band.

## Media placeholders

Final imagery is explicitly out of scope for this milestone. Every target image role becomes a neutral, named placeholder with `data-media-slot` and the measured box, crop, radius, overlay, and responsive geometry. Placeholders use light neutral gradients and a restrained Rosa accent detail; they do not use or hotlink MedicaShop/Envato assets.

Named roles include:

- `home-hero-01`;
- `home-who-01`;
- fourteen product slots across featured/latest grids;
- `home-feature-01`;
- `home-promo-01` through `home-promo-04`;
- `home-why-01`;
- `home-evidence-01`;
- `prefooter-person-01`.

## Component architecture

The child theme remains authoritative and does not require Elementor Pro or paid plugins.

- `header.php` owns the measured announcement/header and accessible responsive dropdown.
- `footer.php` owns the four-column footer and lower strip.
- `client-preview-home.php` owns only the nine-section sequence.
- focused partials own media slots, who/stats, product grids, feature banner, promotional mosaic, why-us, proof, evidence, and pre-footer.
- `client-preview.css` owns centralized tokens and exact responsive geometry.
- `client-preview.js` keeps keyboard reachability, focus containment, Escape, overlay close, inert background, and focus restoration while presenting the target-like full-width dropdown.
- WooCommerce remains the source of real published products. Verified family cards may fill visual slots only when labelled `Catalogue family`; repeated fill must not pretend to be a new product.

## Acceptance workflow

1. Update behavior/safety contracts without freezing obsolete old markup.
2. Reconstruct header, Homepage, and footer from measured roles.
3. Run source, PHP, JS, runtime, interaction, accessibility, and product-fixture tests.
4. Capture local full/header/hero/section/footer/menu/hover states at the same eight viewports under `wordpress/.medicashop-forensics/local/home/`.
5. Generate side-by-side, 50% overlay, and absolute-difference evidence under `wordpress/.medicashop-forensics/diff/home/`.
6. Inspect every section at 390, 768, 1024, 1366, 1440, 1920, and 2560; repair major geometry, typography, spacing, wrapping, stacking, header, or footer drift.
7. Request independent code/spec review and resolve critical/important findings.

## Milestone boundary

This milestone stops after the English header/Home/footer comparison gate and reports exact remaining visual differences. About, Contact, Shop, Single Product, final Rosa imagery, Arabic propagation, and the final client video remain later phases. Existing routes must remain functional while visually unmodified pages temporarily inherit the corrected shared shell.

Production, Hostinger, DNS, Cloudflare, main, `wordpress/medicashop-migration`, and the Phase 2A redesign are untouched.
