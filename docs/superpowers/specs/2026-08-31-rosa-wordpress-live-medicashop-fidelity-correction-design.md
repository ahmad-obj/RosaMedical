# Rosa Medical WordPress — Live MedicaShop Fidelity Correction Design

Date: 2026-08-31  
Branch: `wordpress/client-preview-medicashop-recreation`  
Supersedes the visual-fidelity interpretation in the 2026-08-30 client-preview design; its architecture, truthfulness, licensing, bilingual, and non-production boundaries remain authoritative.

## 1. Correction

The current implementation interpreted “high fidelity” too loosely. It preserves several reference roles, but it does not look as though the MedicaShop template itself had been configured for Rosa. The client-preview goal requires a substantially closer reconstruction of the live public demo’s composition and visual system.

The correction is therefore:

```text
live MedicaShop appearance and geometry
→ independently authored Rosa implementation
→ Rosa logo/name/contact details
→ Rosa-owned imagery
→ truthful quotation/procurement content
→ English and mirrored Arabic/RTL
```

This is a visual reconstruction, not an import. No MedicaShop source, proprietary image, Elementor Pro template, paid plugin, or ThemeForest asset may enter the shipped WordPress implementation.

## 2. Live Visual Sources of Truth

The following public pages were captured directly on 2026-08-31 and are the primary visual baseline:

- Home: `https://fullkit.moxcreative.com/medicashop/template-kit/homepage/`
- About: `https://fullkit.moxcreative.com/medicashop/template-kit/about-us/`
- Contact: `https://fullkit.moxcreative.com/medicashop/template-kit/contact-us/`
- Shop: `https://fullkit.moxcreative.com/medicashop/shop/`

Live-reference screenshots are evidence only and remain under the ignored `wordpress/.client-preview-artifacts/reference-live/` directory. The previously supplied saved browser captures remain secondary evidence if the public demo changes or becomes unavailable.

The live Shop URL is outside `/template-kit/`; `/medicashop/template-kit/shop/` is a 404 page and must not be used as the Shop baseline.

## 3. Fidelity Contract

The Rosa preview must preserve the live template’s recognizable appearance, not merely its section names. At equivalent viewports it must closely reproduce:

- teal-green and white visual system;
- narrow announcement strip and compact white navigation header;
- bounded content rail and template typography scale;
- full-width image hero with teal overlay and centered white copy;
- section widths, vertical rhythm, whitespace, border radii, shadows, and card proportions;
- dense four-column desktop product grids and responsive transformations;
- full-width tinted feature banners;
- promotional mosaic proportions;
- three-card overlay bands;
- split “why choose us” composition;
- monochrome horizontal proof/family strip;
- compact grey inquiry band above the footer;
- four-column footer silhouette and lower copyright/social row.

The following are allowed to differ because the client explicitly requested them or truthfulness requires them:

- logo and brand name;
- address, phone, and email;
- images and banners, which must be Rosa-owned repository media;
- pharmacy, discount, consumer-purchase, payment, shipping, return, customer-count, testimonial, partner, and opening-hours claims;
- product names and catalogue information, which must come from verified Rosa data;
- English text length and Arabic translation/RTL geometry;
- cart, account, Checkout, price, rating, sale, and Add-to-Cart controls, which become quotation, catalogue, or inquiry actions.

These substitutions must keep the original block’s size, placement, density, and visual weight. Removing an unsupported claim does not authorize removing its layout role.

## 4. Global Shell

The shared shell will be rebuilt to match the live reference:

1. 30–40 px teal announcement strip with truthful catalogue/quotation copy on the inline start and Rosa email/phone on the inline end.
2. Compact white header with Rosa logo at the inline start and similarly spaced navigation/actions at the inline end.
3. Desktop navigation at wide breakpoints and a template-scaled accessible drawer on tablet/mobile.
4. Four-column footer matching the reference’s proportions, using Company, Product Families, Support, and verified contact content.
5. Grey pre-footer inquiry band matching the reference newsletter band’s height and composition without pretending that a newsletter service exists.

English remains LTR. Arabic uses the same component topology with logical properties and mirrors inline geometry rather than becoming a different design.

## 5. Home Composition

Home will follow the live page’s visual sequence:

1. full-width overlay hero;
2. who-we-are split with overlapping truthful three-stat panel;
3. featured-product row plus narrow three-benefit rail;
4. full-width overlay feature banner;
5. dense latest-catalogue/product grid;
6. one tall and three horizontal promotional tiles in the reference mosaic proportions;
7. why-choose-us split with one illustration/image and three raised value cards;
8. monochrome family/catalogue proof strip;
9. teal image-backed three-card evidence band;
10. grey inquiry band;
11. shared footer.

The evidence band must not invent testimonials. Its three cards will describe verifiable workflow roles such as catalogue identification, reference sharing, and direct quotation contact while retaining the template’s card geometry.

The proof strip must not invent partner logos. It will use the five verified instrument families and catalogue availability in the same restrained monochrome rhythm.

## 6. About Composition

About will follow the live page’s sequence and proportions:

1. compact image-backed title hero;
2. who-we-are split with overlapping truthful stats;
3. three equal cards in the reference service/opening-hours region;
4. full-width overlay feature banner;
5. why-choose-us split and raised cards;
6. teal image-backed three-card evidence band;
7. family/catalogue proof strip;
8. grey inquiry band and shared footer.

The opening-hours card becomes a catalogue/quotation availability panel with no fabricated hours. The pharmacy/store cards become truthful Rosa catalogue and procurement-support roles while retaining the same card sizes.

## 7. Contact Composition

Contact will follow the live page’s sequence and proportions:

1. image-backed title hero;
2. large light-grey content field;
3. paired raised white cards for verified contact information and the inquiry form;
4. location/search-on-maps role only when based on the verified address;
5. grey inquiry band and shared footer.

The contact card retains the reference icon/list rhythm. Form controls retain the reference field density and full-width teal action. No fake map coordinates or operating hours are introduced.

## 8. Shop Composition

Shop will follow the live Woo archive’s appearance:

1. image-backed “Find Product” hero and full-width search field;
2. compact sort/search row without fake filters;
3. dense four-column desktop card grid, three/two/one columns at narrower breakpoints as the live layout dictates;
4. teal image-backed evidence band;
5. why-choose-us split;
6. proof/family strip, inquiry band, and footer.

Published WooCommerce products remain the only entries presented as products. If there are too few published products to reproduce the template’s grid density, verified instrument-family cards may occupy additional grid slots only when explicitly labelled `Catalogue family` / `فئة كتالوج`. They must not display invented SKUs, prices, ratings, sale badges, or product claims. Real product cards use `Price on request` and `View details`.

No Single Product pixel-fidelity claim is added because no complete authoritative Single Product reference is available. The existing Stevens detail route retains the shared Rosa shell and functional foundation.

## 9. Media Strategy

Only Rosa-owned files already under `apps/web/public/media/**` may be imported. Each live visual role will be mapped to the closest suitable Rosa image by subject, aspect ratio, and crop behavior. CSS overlays, gradients, geometric backgrounds, and simple icons may be independently authored.

No image from the public demo or saved ThemeForest archives may be copied, downloaded into production, hotlinked, or committed. Reference network paths must never appear in rendered Rosa HTML or CSS.

## 10. Responsive and Arabic Behavior

The target will be captured at:

- 390×844
- 430×932
- 768×1024
- 1024×768
- 1366×768
- 1440×900
- 1920×1080
- 2560×1440

Home, About, Contact, and Shop will each have 32 live English reference screenshots. Rosa will retain the existing 64-shot English/Arabic matrix.

English screenshots are compared directly with the corresponding live reference. Arabic screenshots are compared against the same topology mirrored into RTL. Arabic is a full translation with `lang="ar" dir="rtl"`, Arabic-capable typography, LTR isolation for phone/email/product identifiers, logical icon direction, and paired routes.

Mobile acceptance includes the live reference’s compact density plus the existing keyboard/focus/inert/Escape/focus-restoration requirements. No horizontal scrolling, clipped text, inaccessible controls, or oversized empty regions are acceptable.

## 11. Visual Acceptance Method

Acceptance requires more than screenshot generation:

1. capture the four live pages at all eight viewports;
2. capture the eight Rosa pages at the same viewports;
3. inspect corresponding target/Rosa pairs side by side;
4. use overlays or image-difference tooling where it helps identify geometry drift;
5. record concrete observations for shell height, hero proportion, section order, grid density, promotional geometry, card treatment, footer silhouette, and responsive transitions;
6. repair all material divergence not caused by an approved Rosa/truthfulness/RTL substitution;
7. re-capture and re-review affected pairs.

The visual bar is: a viewer familiar with the public MedicaShop demo should immediately recognize the Rosa preview as that template’s appearance configured for Rosa, not as a separate design inspired by it.

## 12. Architecture and Safety Boundaries

The implementation architecture remains:

- WordPress;
- Hello Elementor;
- Rosa Medical child theme;
- Elementor Free;
- WooCommerce;
- `rosa-medical-core`;
- independently authored PHP/CSS/JavaScript.

There is no Elementor Pro, MedicaShop kit import, WPML, ElementsKit, Skyboot, proprietary code, or proprietary asset dependency. Business settings remain centralized. The seed remains deterministic. Hostinger, production, DNS, and Cloudflare remain untouched. Nothing is merged into `main`, `wordpress/medicashop-migration`, or the old Phase 2A branch.

## 13. Completion Criteria

Completion requires all of the following:

1. live 32-screenshot English target matrix captured and reviewed;
2. Rosa 64-screenshot bilingual matrix captured and reviewed against it;
3. all four English pages reproduce the live template’s shell, section topology, density, card treatment, and footer silhouette;
4. all four Arabic pages are true RTL counterparts of that same design;
5. Rosa branding/contact/media substitutions are visible and correct;
6. no unsupported retail or business claims appear;
7. no proprietary or paid dependency/source/asset leakage exists;
8. accessibility, runtime, route pairing, console/network, and Stevens regressions pass;
9. the walkthrough video visibly covers the corrected Home, About, Contact, Shop, English, Arabic, language switching, and mobile drawer;
10. an independent review finds no unresolved critical or important issue;
11. final evidence documents intentional limitations and confirms production was untouched.
