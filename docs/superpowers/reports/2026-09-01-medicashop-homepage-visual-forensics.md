# MedicaShop Homepage Visual Forensics

Date: 2026-09-01  
Scope: English global header, Homepage, and global footer  
Branch: `wordpress/client-preview-medicashop-recreation`

## Evidence boundary

This report records independently measured rendered geometry and visual observations. It does not reproduce MedicaShop HTML, CSS, JavaScript, Elementor JSON, images, or plugin code.

Primary requested source:

`https://preview.themeforest.net/item/medicashop-pharmacy-medical-store-elementor-template-kit/full_screen_preview/39933128`

Headless Chromium currently receives a ThemeForest Cloudflare challenge at that wrapper. Multiple supplied saved wrappers identify the rendered iframe as:

`https://fullkit.moxcreative.com/medicashop/template-kit/homepage/`

The live iframe URL, its canonical metadata, and the corresponding supplied archives agree. Measurements and screenshots below use that live rendered page. Localhost was not used as a design reference.

Ten supplied ZIPs were found in `/home/mmm/Downloads`, extracted separately below ignored `wordpress/.medicashop-forensics/zip-01` through `zip-10`, and inventoried in ignored `wordpress/.medicashop-forensics/archive-manifest.md`. The archives cover Home, About, Contact, Shop, Single Product, and shared resources. Nothing extracted is production source.

## Target capture evidence

The target Homepage capture root is:

`wordpress/.medicashop-forensics/target/home/`

Required full-page captures:

- `390/full.png`
- `430/full.png`
- `768/full.png`
- `1024/full.png`
- `1366/full.png`
- `1440/full.png`
- `1920/full.png`
- `2560/full.png`

Each width also contains:

- `header.png`
- `hero.png`
- `section-01.png` through `section-09.png`
- `footer.png`
- `measurements.json`

Responsive menu evidence exists at 390, 430, 768, and 1024 as `mobile-menu-open.png`. The 1440 evidence additionally contains header navigation hover, product hover before/after, and both visible carousel states. The capture set contains 121 files, excluding generated contact sheets.

## Global visual system

### Target tokens measured from the live page

| Role | Computed target value |
|---|---|
| Body typeface | `Open Sans, sans-serif` |
| Desktop body | 16px / 24px |
| Tablet body | 15px / 22.5px |
| Mobile body | 14px / 21px |
| Desktop hero heading | 58.92px / 58.92px, 700, -2px tracking |
| Tablet hero heading | 42.72px, 700, -2px tracking |
| Mobile hero heading | 32.35px / 32.35px, 700, -2px tracking |
| Desktop section heading | 44.2px / 48.62px, 700, -2px tracking |
| Tablet section heading | 34.18px, 700, -2px tracking |
| Mobile section heading | 26.96px / 29.656px, 700, -2px tracking |
| Product title | 16px / 24px desktop; 14px / 21px mobile, weight 600 |
| Target primary accent | `#009f7f` (`rgb(0,159,127)`) |
| Heading ink | `#1f2937` |
| Muted text | `#868686` |
| Page surface | `#fafafa` |
| Card surface | `#ffffff` |
| Main card radius | 10px |
| Primary button radius | 5px; product buttons 3px |
| Raised-card shadow | `0 30px 60px rgba(0,0,0,0.10)` |
| Common transition | 300ms background/border/radius/shadow/opacity |
| Desktop content rail | 1280px maximum |
| Desktop product gap | 28px featured; approximately 28px latest |
| Mobile product gap | 14px horizontal, 21px vertical |

### Approved Rosa mapping

Geometry and component hierarchy remain unchanged. Color roles map centrally:

- target `#009f7f` primary accent → `--rosa-red: #e00815`;
- target dark heading → `--rosa-ink: #111214` / near-target charcoal where needed;
- target muted grey → `--rosa-muted: #686c74`;
- white/light target surfaces remain white, `#fafafa`, and subtle Rosa-tinted neutrals;
- focus stays a separate visible blue token rather than becoming decorative red.

This mapping is intentional. Red is used only where the target uses primary green; it is not spread across neutral surfaces.

## Header measurements and behavior

### Desktop (1366px and wider)

- Total height: 120px.
- Announcement bar: 44px, full-width accent background.
- Announcement inner rail: 1280px; approximately 65/35 text/contact columns.
- Main header: 76px, white, shallow long shadow.
- Main inner rail: 1280px.
- Navigation/logo region: 90% of rail; action/icon region: 10%.
- Logo occupies the inline start, navigation is compact and centered/right-biased, account/cart actions occupy the inline end.
- The header is not visually oversized and does not remain sticky during the captured page scroll.

### Tablet/mobile (1024px and below)

- Total height: 103–105px.
- Announcement bar: 41px at 390/430 and 43px at 768/1024.
- Main header: 62px.
- Mobile order: menu toggle, centered logo, account/action icons.
- Desktop navigation is replaced by a full-width dropdown through 1024px.
- Open menu begins immediately below the header, is white with a 205px content height at 390px, uses 41px rows, and shows a filled accent active row.
- Mobile toggle target is approximately 39×42px; Rosa must retain or improve the practical 44px target without changing the visual footprint materially.

## Homepage section topology

The live page has nine top-level Homepage sections. The older archive count of 23 includes nested Elementor sections; it is not 23 independent full-width bands.

### 1. Overlay hero

- Full-width background slot with dark-to-accent overlay and centered white content.
- Desktop height: 681px; 160px block padding.
- Desktop content width: 720px.
- Mobile height: 456px; tablet height: 623px.
- Content order: pill eyebrow, two-line heading, short paragraph, white CTA.
- Desktop CTA: approximately 203×58px with 40px inline/20px block padding.
- Placeholder implementation must preserve the cover slot and overlay but use a neutral non-proprietary media block.

### 2. Who-we-are split with overlapping stats

- Desktop height: 632px; top padding 112px.
- 1280px rail split 60/40 (768px/512px at 1440 viewport).
- Copy is on the wide inline-start side; the media card sits on the inline-end and is visually pulled into the copy area.
- Media slot is 500px tall on desktop with 10px radius.
- Three-stat white panel is approximately 748×137px, 10px radius, and uses the main 30/60 shadow.
- The panel overlaps the lower copy/media region rather than becoming a separate normal-flow band.
- Mobile reverses the visual order: media first, copy second, then a compact stats panel; media is about 200px high.

### 3. Featured products plus benefits rail

- Desktop height: 817px with 112px top/bottom padding.
- Rail split 80/20 (1024px products / 256px benefits).
- Featured surface is a raised white card with 10px radius and 32px internal padding.
- Four products in one row; square media; title, price/action rhythm below.
- Benefits rail is a separate raised white card with three vertically stacked icon/text roles.
- At 768/1024 the product card and benefits rail stack, but the four featured products remain a single readable row.
- At 390/430, products become two columns and benefits become three compact stacked rows.

### 4. Full-width feature banner

- Desktop height: 546px; 112px block padding.
- Tablet height: 465px; mobile height: 375px.
- 720px centered content rail with centered white heading/copy/action.
- Full-cover media slot and overlay; no inset card or split composition.

### 5. Latest products

- Desktop height: 1209px; 80px top and 112px bottom padding.
- Ten products in a 5×2 grid.
- At 1440 each product is approximately 230px wide; media is square at approximately 230×230px with 10px radius.
- Title is 16/24 semibold; price occupies a distinct 24px line; action is approximately 102×40px.
- At 768/1024 the target uses four columns, wrapping ten cards into three rows.
- At 390/430 the target uses two columns and five rows.
- Product cards themselves are visually unboxed; the square media surface, typography, sale badge, and compact action establish the rhythm.

### 6. Promotional mosaic

- Desktop height: 675px; 1280px rail.
- Primary split: 30/70 (384px/896px at 1440).
- Inline-start tile is tall and fills the section height.
- Inline-end contains two equal top tiles and one full-width bottom tile.
- Gap is approximately 20px; tile radius is 10px.
- 1024 retains the 30/70 layout; 768 retains the same visual logic at narrower proportions.
- 390/430 stacks four tiles: tall promo, two horizontal promos, one larger final promo.
- Each placeholder must retain its unique aspect/crop slot; one generic repeated rectangle is not acceptable.

### 7. Why choose us

- Desktop height: 703px with a two-column split.
- Inline-start contains eyebrow, heading, and a wide illustration/media slot.
- Inline-end contains three raised white value cards stacked vertically.
- Value cards use 10px radius, accent icon, white background, and the main long shadow.
- Tablet compresses the same topology; mobile centers the heading/media and stacks the three cards.

### 8. Proof/logo carousel

- Desktop height: 158px; mobile height: 122–130px.
- Restrained white band with six low-contrast monochrome marks visible on desktop.
- Carousel exposes five slides per desktop configuration and three per mobile configuration.
- Rosa replacement must use truthful family/catalogue marks or typographic family labels, not invented partners.

### 9. Testimonial-shaped evidence band

- Desktop height: 698px; teal/accent-tinted full-cover media role.
- Centered eyebrow, heading, short paragraph, then three white cards.
- Cards are equal width, white, 10px radius, with avatar/name hierarchy in the target.
- Mobile height: approximately 500px; cards remain a compact three-card horizontal row in the captured target, with very small text.
- Rosa may not fabricate testimonials. The same three-card geometry will hold truthful catalogue-identification, reference-sharing, and quotation-support workflow evidence.

## Footer topology

The target footer consists of two visual sections.

### Pre-footer inquiry/newsletter role

- Desktop height: 166px; light grey 135° gradient.
- 1280px rail split approximately 83/17.
- Copy/form occupies the broad region; medical-person media overlaps at the inline end.
- Heading is approximately 24.88px / 32.34px, weight 600.
- Rosa replacement becomes a quotation/contact band with the same height, control geometry, and media-slot silhouette; it must not claim a newsletter subscription.
- Mobile height: approximately 520px with copy, stacked controls, and lower media slot.

### Main footer

- Desktop height: approximately 431px including bottom strip; white surface.
- 48px top padding and 1280px content rail.
- Four columns: brand/about, Company, Support, Get in touch.
- Brand/contact column density is much greater than the current Rosa footer and includes a distinct lower divider/copyright/social row.
- Mobile stacks the brand, two compact navigation columns, contact, and lower social row; main footer height is approximately 779px at 390px.

## Responsive height matrix

All values are measured pixels rounded to the nearest whole number.

| Width | Page | Header | Hero | Who | Featured | Feature | Latest | Mosaic | Why | Proof | Evidence | Pre-footer | Main footer |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 390 | 8924 | 103 | 456 | 754 | 1078 | 375 | 1948 | 1269 | 998 | 122 | 524 | 520 | 779 |
| 430 | 9041 | 103 | 456 | 754 | 1085 | 375 | 2048 | 1277 | 1025 | 130 | 496 | 519 | 773 |
| 768 | 6855 | 105 | 623 | 565 | 830 | 465 | 1430 | 780 | 549 | 140 | 535 | 221 | 613 |
| 1024 | 7234 | 105 | 623 | 565 | 871 | 465 | 1487 | 923 | 578 | 150 | 565 | 252 | 650 |
| 1366 | 6836 | 120 | 681 | 632 | 817 | 546 | 1209 | 675 | 703 | 158 | 698 | 166 | 431 |
| 1440 | 6836 | 120 | 681 | 632 | 817 | 546 | 1209 | 675 | 703 | 158 | 698 | 166 | 431 |
| 1920 | 6836 | 120 | 681 | 632 | 817 | 546 | 1209 | 675 | 703 | 158 | 698 | 166 | 431 |
| 2560 | 6836 | 120 | 681 | 632 | 817 | 546 | 1209 | 675 | 703 | 158 | 698 | 166 | 431 |

The unchanged 6836px desktop height from 1366 through 2560 confirms that widths, type, cards, and section padding must remain bounded rather than scaling continuously.

## Responsive breakpoints and transformations

- Desktop layout begins above 1024px.
- Tablet band is 768–1024px: 15px base type, 42.72px hero heading, mobile-style navigation, four-column product grids, compressed two-column/mosaic layouts.
- Mobile is 767px and below: 14px base type, 32.35px hero heading, 26.96px section headings, two-column products, stacked promotional tiles and stacked footer.
- The target contains no horizontal page overflow at any required width.
- The Rosa reconstruction will use logical layout properties and accessible controls while keeping these visible transformations.

## Implementation consequences

The current Rosa Home cannot be retained as the visual template. It must be reconstructed around the measured nine-section system above. Tests may preserve route, business, accessibility, product, and truthfulness contracts, but obsolete assertions that freeze the old section markup must be replaced.

Media in this milestone is deliberately neutral. Every media role receives a named `data-media-slot` with the target box, crop, radius, overlay, and responsive behavior. No MedicaShop or Envato image enters the implementation.

The milestone acceptance comparison must normalize only approved differences:

- target green versus Rosa red;
- target text versus truthful Rosa copy of comparable length;
- target proprietary imagery versus neutral geometry-preserving placeholders;
- unsupported retail/testimonial/newsletter/partner claims versus truthful equivalent roles.

Section order, heights, rail widths, column ratios, card geometry, typography scale, spacing, responsive transformations, header, and footer are not approved differences.
