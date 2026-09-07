# Phase 3 Standalone Visual Audit

**Branch:** `wordpress/client-content-controls`  
**Capture baseline:** `a4a4f2ae50bc9646491fb2897fe6f1c4e9c7cb65`  
**Evidence directory:** `wordpress/.client-preview-artifacts/handoff-phase3/`  
**Evidence package reviewed:** `handoff-phase3-screenshots.zip`  
**Evidence integrity:** 50 PNG captures; `manifest.tsv` contains 51 lines including its header  
**Method:** standalone full-page review only; no overlays, historical reference-image matching, or pixel-diff acceptance  
**Review matrix:** Home, About, Contact, Shop, and representative Product Detail in EN/AR at `1440x900`, `1024x768`, `768x1024`, `431x932`, and `390x844`

## Result

The 50-cell matrix contains **4 actionable standalone defects**. Twenty-six cells are standalone PASS cells; twenty-four cells contain one or more concrete defect IDs. No broad redesign is justified by this audit.

The defects are deliberately narrow:

- Product Detail has one severe exact-tablet composition break at 768px.
- The representative Woo product exposes internal foundation-fixture wording on every Product Detail viewport/locale.
- Contact carries a large historical blank spacer between its main cards and the procurement CTA at every viewport/locale.
- About carries an unnecessarily large mobile-only empty band between its Who-we-are copy and statistics row.

Home and Shop are protected as standalone-passing structures across the full bilingual handoff matrix.

## Matrix

| Locale | Surface | 1440x900 | 1024x768 | 768x1024 | 431x932 | 390x844 |
| --- | --- | --- | --- | --- | --- | --- |
| EN | Home | PASS | PASS | PASS | PASS | PASS |
| EN | About | PASS | PASS | PASS | P3-004 | P3-004 |
| EN | Contact | P3-003 | P3-003 | P3-003 | P3-003 | P3-003 |
| EN | Shop | PASS | PASS | PASS | PASS | PASS |
| EN | Product Detail | P3-002 | P3-002 | P3-001 + P3-002 | P3-002 | P3-002 |
| AR | Home | PASS | PASS | PASS | PASS | PASS |
| AR | About | PASS | PASS | PASS | P3-004 | P3-004 |
| AR | Contact | P3-003 | P3-003 | P3-003 | P3-003 | P3-003 |
| AR | Shop | PASS | PASS | PASS | PASS | PASS |
| AR | Product Detail | P3-002 | P3-002 | P3-001 + P3-002 | P3-002 | P3-002 |

## Defects

### P3-001 — Product Detail description/configuration collision at 768px

- **Priority:** 1 — broken composition / obvious visual blunder
- **Observed on:**
  - `en-product-768x1024.png`
  - `ar-product-768x1024.png`
- **Visible symptom:** The Product Details section stops behaving as a coherent layout at exactly 768px. The description media block intrudes into the description heading and configuration region. In EN the eyebrow and heading are visibly clipped from the left and the two configuration cards are squeezed into the overlapping row. AR shows the equivalent mirrored collision. The same section is coherent at 1024px, 431px, and 390px.
- **Scope:** Product Detail
- **Directionality:** both EN and AR
- **Responsive range:** exact 768px handoff breakpoint is proven affected; do not assume a wider range without runtime measurement
- **Owner:** Product Detail page CSS
- **Likely source files:**
  - `wordpress/wp-content/themes/rosa-medical-child/assets/css/product-detail-live-visual-recovery.css`
  - existing protective test: `wordpress/scripts/tests/live-product-detail-layout.test.mjs`
- **Source evidence:** The Product Detail stylesheet gives the description area a two-column grid below the 1024-specific tablet treatment, while the single-column mobile treatment begins only below `47.9375rem`. At 768px this leaves the description in the narrow two-column regime while its configuration cards still contain their own multi-column minimums.
- **Focused RED contract:** Add a 768x1024 EN+AR browser assertion that the visible bounding rectangles of `.rosa-product-detail__description-media` and the description/configuration content do not intersect; every `.rosa-product-detail__configuration` must remain contained by its section and viewport. Observe RED on the current baseline before any CSS change.
- **Phase 3B correction boundary:** Correct only the narrow Product Detail responsive layout. Preserve gallery, summary, procurement-support card, Woo-owned product data, related-products grid, and currently passing 1440/1024/431/390 compositions.

### P3-002 — Internal foundation-fixture wording is exposed as public product copy

- **Priority:** 1 — obvious client-facing handoff blunder
- **Observed on:**
  - `en-product-1440x900.png`
  - `en-product-1024x768.png`
  - `en-product-768x1024.png`
  - `en-product-431x932.png`
  - `en-product-390x844.png`
  - `ar-product-1440x900.png`
  - `ar-product-1024x768.png`
  - `ar-product-768x1024.png`
  - `ar-product-431x932.png`
  - `ar-product-390x844.png`
- **Visible symptom:** Public Product Detail copy displays the sentence `Foundation-gate fixture derived from the verified Rosa scissors catalogue.` directly beneath the title and again in the Product Details section. This is internal test/foundation terminology rather than client-facing product copy and materially reduces delivery credibility.
- **Scope:** Product Detail data/content
- **Directionality:** both EN and AR because the Arabic Product Detail route intentionally renders the same Woo product rather than a duplicate product
- **Responsive range:** all five handoff viewports
- **Owner:** Woo product data / foundation fixture seed path, not presentation CSS
- **Likely source files:**
  - `wordpress/scripts/foundation-seed.sh`
  - `wordpress/scripts/foundation-product-verify.sh`
  - Product Detail renderer only for verification if necessary; do not hard-code replacement copy in the theme
- **Source evidence:** `foundation-seed.sh` explicitly calls `set_description()` with the exact public sentence seen in the screenshots. The same fixture defines confirmed product facts including Stevens Scissors — Regular, 10.5 cm size, Straight/Curved directions, and SKUs `04-0901` / `04-0911`.
- **Focused RED contract:** First assert that both EN and AR public Product Detail text do not contain the exact internal `Foundation-gate fixture` wording and that the Woo description remains non-empty. Pair this with the foundation verification so the corrected seed continues to preserve the exact product slug, type, family, attributes, configurations, and SKUs. Observe RED before changing the seed/data path.
- **Phase 3B correction boundary:** Replace only the internal fixture description with concise client-facing copy supported by already verified Woo/catalogue facts. Do not invent specifications, translate official catalogue nomenclature by assumption, duplicate the Woo product for Arabic, or move Woo-owned copy into theme code.

### P3-003 — Contact carries an oversized dead-space band before the procurement CTA

- **Priority:** 2 — uncomfortable whitespace / oversized empty band / abrupt section transition
- **Observed on:**
  - `en-contact-1440x900.png`
  - `en-contact-1024x768.png`
  - `en-contact-768x1024.png`
  - `en-contact-431x932.png`
  - `en-contact-390x844.png`
  - `ar-contact-1440x900.png`
  - `ar-contact-1024x768.png`
  - `ar-contact-768x1024.png`
  - `ar-contact-431x932.png`
  - `ar-contact-390x844.png`
- **Visible symptom:** After the contact conversation/form cards finish, the page renders a very large empty light-gray/white band before the `Need an instrument reference or quotation?` procurement CTA. The gap dominates the page at every width and visually disconnects the contact task from the next action.
- **Measured evidence:** Representative low-activity runs are approximately 525px at 1440px, about 394px at 1024/768px, and roughly 436–443px on the 431/390 mobile captures.
- **Scope:** Contact
- **Directionality:** both EN and AR
- **Responsive range:** all five handoff viewports
- **Owner:** Contact page CSS
- **Likely source files:**
  - `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`
- **Source evidence:** The Contact recovery rules intentionally retain historical frozen-layout bottom padding: base `clamp(32rem, 38vw, 35rem)`, large desktop `clamp(34rem, 39vw, 37rem)`, tablet `27rem`, and mobile `27rem`. A source comment explicitly describes a retained wide blank procurement spacer. Historical fidelity is no longer the Phase 3 acceptance target.
- **Focused RED contract:** At all five EN+AR handoff widths, measure the vertical distance between the bottom of `.rosa-preview-contact__cards` and the top of the following procurement/prefooter CTA. Require the next action to begin within a normal handoff section-spacing interval, with a maximum dead gap of 192 CSS px, while preserving non-overlap and the existing card/form geometry. Observe RED on the current baseline.
- **Phase 3B correction boundary:** Remove only the obsolete spacer behavior. Preserve Contact hero, two-card desktop/tablet composition, mobile stacking, form fields, channel content, quotation-led behavior, and the existing prefooter/footer structure.

### P3-004 — About Who-we-are copy leaves an oversized mobile-only gap before statistics

- **Priority:** 2 — uncomfortable whitespace / section rhythm
- **Observed on:**
  - `en-about-431x932.png`
  - `en-about-390x844.png`
  - `ar-about-431x932.png`
  - `ar-about-390x844.png`
- **Visible symptom:** On the two mobile widths, the Who-we-are text finishes and is followed by roughly two hundred pixels of empty white space before the three-statistics row. This makes the media/copy/stats composition feel artificially stretched. The same About section is balanced at 768px, 1024px, and 1440px.
- **Scope:** About
- **Directionality:** both EN and AR
- **Responsive range:** 431x932 and 390x844 only
- **Owner:** About/mobile page CSS
- **Likely source files:**
  - `wordpress/wp-content/themes/rosa-medical-child/assets/css/live-visual-recovery.css`
  - `wordpress/wp-content/themes/rosa-medical-child/assets/css/about-live-visual-recovery.css` only if page-scoped override ownership proves cleaner after root-cause inspection
- **Source evidence:** The mobile Who-we-are section retains a fixed `height: 754px` while its content is flex-stacked with a 200px media block and fixed text padding. The standalone captures show the unused remainder accumulating between copy and stats.
- **Focused RED contract:** At 431x932 and 390x844 in EN+AR, assert that the vertical gap from the bottom of the Who-we-are final copy paragraph to the top of the statistics row is no more than 96 CSS px, with the media, copy, and statistics row remaining non-overlapping. Observe RED before changing the fixed-height behavior.
- **Phase 3B correction boundary:** Correct only mobile vertical rhythm for the Who-we-are composition. Preserve the accepted About desktop/tablet structure, cards, procurement feature, Why Rosa section, evidence CTA, Elementor ownership, and RTL ordering.

## Severity-ordered Phase 3B correction queue

1. **P3-001 — Product Detail 768px collision.** Highest severity because content visibly overlaps/clips and the page becomes structurally broken at a required handoff viewport.
2. **P3-002 — Public foundation-fixture wording.** Remove internal implementation terminology through the Woo/foundation data path while preserving verified product facts and existing fixture contracts.
3. **P3-003 — Contact oversized dead-space band.** Remove the historical frozen-layout spacer and restore normal section continuity across all handoff viewports.
4. **P3-004 — About mobile Who-we-are gap.** Tighten only the mobile Who/stats rhythm after the higher-impact defects are green.

Each correction is independently rejectable and must use the Phase 3 TDD cycle: root-cause inspection → focused RED → minimal production/data correction → focused GREEN → neighboring regressions → recapture only affected route/viewports before moving to the next defect.

## Protected accepted structures

The following are explicitly protected from opportunistic redesign during Phase 3B because the standalone evidence did not identify them as defective:

- **Home:** EN/AR at all five viewports. Preserve current hero, Who-we-are, featured/latest product grids, procurement banner, family/promo surfaces, support/evidence bands, quotation CTA, placeholder treatment, and responsive/RTL composition.
- **Shop:** EN/AR at all five viewports. Preserve search/hero, catalogue grid, procurement workflow, support sections, family links, quotation CTA, and current responsive/RTL product-card behavior.
- **About:** Preserve all desktop/tablet structure and all mobile structure except the specific P3-004 Who-copy-to-stats spacing. Do not reopen accepted cards, feature banner, Why Rosa, CTA, or footer composition.
- **Contact:** Preserve hero, conversation card, message card/form, channel content, responsive stacking, procurement CTA contents, and footer. P3-003 is only the vertical spacer between the main contact cards and next CTA.
- **Product Detail:** Preserve the gallery, thumbnails, title/summary structure, catalogue-pricing-on-request behavior, procurement-support card, exact Woo configurations/SKUs, related-instrument grid, quotation CTA, 1440/1024/431/390 responsive compositions, and virtual Arabic route model. P3-001 is confined to the 768 description/configuration composition; P3-002 is confined to Woo-owned description copy.
- **Global shell:** Preserve announcement/header/navigation/language switcher/mobile drawer, rail system, focus behavior, neutral Rosa media placeholders, prefooter, footer, and existing EN/AR ownership boundaries unless a later focused RED proves a separate defect.

## Phase 3A disposition

The screenshot evidence is sufficient to define the Phase 3B work without speculative redesign. Phase 3A introduces no visual production CSS/template mutation. Its output is this four-defect correction queue, derived from the complete standalone bilingual handoff matrix.
