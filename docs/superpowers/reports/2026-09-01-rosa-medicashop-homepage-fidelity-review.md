# Rosa MedicaShop Homepage Fidelity Review

Date: 2026-09-01  
Branch: `wordpress/client-preview-medicashop-recreation`  
Implementation reviewed through: `59d7e7f`

## Milestone result

The English Rosa header, Homepage, and footer now follow the live MedicaShop Homepage's measured topology, geometry, density, and responsive transformations. This is an independent WordPress child-theme implementation: no MedicaShop source, paid Elementor JSON, proprietary plugin code, or Envato media is shipped.

This report closes only the user-requested first visual milestone. About, Contact, Shop, Single Product, Arabic, final Rosa media, and the final walkthrough video remain later phases and did not delay the client-ready Homepage comparison.

## Visual evidence

- Target: `wordpress/.medicashop-forensics/target/home/{390,430,768,1024,1366,1440,1920,2560}/`
- Local: `wordpress/.medicashop-forensics/local/home/{390,430,768,1024,1366,1440,1920,2560}/`
- Comparisons: `wordpress/.medicashop-forensics/diff/home/{390,430,768,1024,1366,1440,1920,2560}/`

Every width has a full page, header, hero, nine independent section captures, footer, and measurements. Responsive widths also include the open navigation state. The diff directory contains side-by-side, 50% overlay, and absolute-difference images. These working artifacts are intentionally ignored rather than committed.

## Exact Homepage composition

1. Overlay hero
2. Who-we-are split with overlapping three-stat panel
3. Featured four-product surface with three-role benefits rail
4. Full-width feature banner
5. Ten-card latest-products grid
6. Four-tile 30/70 promotional mosaic
7. Why-choose-us split with three raised value cards
8. Proof/family-label band
9. Three-card evidence/workflow band

The page then uses a target-shaped inquiry pre-footer and a white four-column footer with a separate lower strip.

## Geometry verification

The local document and all nine section heights match the target after rounding at 430, 1024, 1366, 1440, 1920, and 2560. The total-page delta is 2px at 390 and 3px at 768; individual Homepage bands still match after rounding.

Measured tokens reproduced include:

- 1280px desktop rail;
- 44px announcement plus 76px main desktop header;
- 41–43px announcement plus 62px responsive header;
- 681px desktop hero, 623px tablet hero, and 456px mobile hero;
- 58.92px desktop, 42.72px tablet, and 32.35px mobile hero headings;
- 44.2px desktop, 34.18px tablet, and 26.96px mobile section headings;
- four featured cards, a 5/4/2-column latest grid, and 30/70 desktop/tablet mosaic;
- 10px primary card radius, long soft raised-card shadow, and 300ms transition rhythm;
- 166px desktop inquiry band and 431px desktop main footer;
- 44px minimum interactive targets without horizontal overflow.

The centralized Rosa mapping replaces the target green with Rosa red while retaining the target's neutral surfaces and dark heading system.

## Review findings resolved

- Intermediate 431–767px content collisions were reproduced, protected by browser assertions, and corrected with flow-safe section heights.
- The 640–767px product-grid breakpoint was corrected to retain the target's two-column mobile topology through 767px.
- Tablet pre-footer/footer topology now matches the target's media silhouette, brand row, and three navigation/contact columns.
- Compact header actions now retain a 44px target.
- Unsupported `Editor's Choice` wording was replaced with the truthful `Featured Products` label.
- Mobile navigation was aligned to the target's full-width five-row dropdown while preserving focus trap, Escape close, inert background, and focus restoration.

Independent review found no remaining critical Homepage milestone issue after these repairs.

## Verification

- Full source/runtime/bilingual/product regression: PASS.
- Homepage fidelity browser contract at required and intermediate widths: PASS.
- Accessibility browser contract: PASS.
- PHP syntax, JavaScript syntax, content helpers, source boundaries, shell/Home/RTL contracts: PASS.
- Visual inspection: all eight full-page comparisons plus the responsive menus and representative section-level comparisons reviewed; no major mismatch remains in order, heights, grid density, card geometry, responsive stacking, header, or footer.

The unrelated user modification `apps/web/next-env.d.ts` was not modified, staged, reverted, or committed. Production, Hostinger, DNS, Cloudflare, and `main` were not touched.

## Intentional differences and deferred work

Large image/color differences visible in the comparison are intentional: Rosa red replaces target green; licensed target photography is represented by named neutral placeholders; retail prices, testimonials, partner logos, and newsletter claims are replaced with truthful Rosa procurement equivalents of comparable visual length.

Deferred to their own reference-driven phases:

- About and Contact page reconstruction;
- Shop archive and Single Product reconstruction, including the shared Single Product inquiry band;
- Arabic mirroring and conversion of the remaining physical-direction declaration to a logical property;
- final Rosa-owned media replacement;
- final all-page capture matrix and walkthrough video.

These deferred items do not alter the completed English Homepage/header/footer visual milestone.
