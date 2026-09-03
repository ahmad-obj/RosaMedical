# Rosa Medical WordPress Latest-Site Parity Design

**Date:** 2026-09-03  
**Status:** Approved direction; implementation pending plan  
**Working branch:** `wordpress/client-content-controls`  
**Visual/source authority:** `transfer/rose-medical-final-main-ready-2026-08-17` at `57f2df01916ec1d7de65196994913711e9fb3039`  
**Production acceptance URL:** `https://rosamedical.org/`

## 1. Problem

The WordPress/Elementor migration is technically functional and its current runtime verifier passes, but its visual target is wrong. The implementation currently reproduces an older MedicaShop-derived Rosa preview and even verifies against MedicaShop geometry. The current public Rosa site and the latest custom frontend use a newer, compact Rosa-specific design.

The WordPress migration must therefore be corrected from:

> MedicaShop-derived preview → WordPress

into:

> Latest Rosa custom frontend / current `rosamedical.org` → WordPress

This is a parity correction, not a redesign. No new visual language is to be invented.

## 2. Success Criterion

WordPress must reproduce the latest Rosa public site as closely as the platform permits across desktop, tablet, mobile, English and Arabic while preserving the editing architecture already validated.

"Exact copy" means:

- same page composition and section ordering;
- same visual hierarchy;
- same shell proportions and navigation treatment;
- same typography scale, weight, spacing and alignment;
- same Rosa colors and surface treatment;
- same media selection, crop, aspect-ratio and placement;
- same card/grid geometry;
- same CTA placement and emphasis;
- same breakpoint behavior and responsive stacking;
- same RTL mirroring and Arabic layout intent;
- same interactive behavior where WordPress/Elementor can reproduce it safely;
- no visible MedicaShop residue unless the latest Rosa source itself intentionally retains it.

The custom frontend source is the implementation oracle. The live production URL is the final acceptance oracle when reachable during verification.

## 3. Source-of-Truth Hierarchy for This Correction

For visual parity work only, use this order:

1. current live `https://rosamedical.org/` when directly observable;
2. `transfer/rose-medical-final-main-ready-2026-08-17` at `57f2df01916ec1d7de65196994913711e9fb3039`;
3. page-specific late frontend branches only when they are demonstrably ancestors/content already incorporated into the transfer snapshot;
4. current WordPress implementation only for WordPress behavior/data ownership, never as visual authority;
5. MedicaShop only as invisible migration/platform reference.

If current production and the pinned custom snapshot differ, production wins and the discrepancy must be documented before implementation continues.

## 4. Architecture That Must Be Preserved

The parity correction must not undo the completed WordPress authoring architecture.

Keep:

- WordPress child theme shell;
- Elementor Free ownership of the six marketing page bodies: EN/AR Home, About and Contact;
- deterministic Rosa Elementor widgets and page migration machinery;
- the v2 safe migration behavior that preserves client edits;
- WooCommerce ownership of product/catalogue data and product/shop administration;
- centralized Rosa business/site/CTA settings;
- protected Rosa header/footer and shared business logic;
- media-library based editable image controls;
- EN/AR independent authoring;
- RTL support;
- no Elementor Pro dependency;
- no new Contact submission backend;
- no Hostinger/production deployment until explicit authorization after parity acceptance.

The objective is to replace visual output and marketing-page composition without weakening ownership boundaries.

## 5. Latest Rosa Page Composition

### 5.1 Homepage

The custom frontend Homepage composition is authoritative and currently resolves in this order:

1. `PublicHeroCarousel`
2. `FamilyDiscovery`
3. `ComprehensivePlans`
4. `SecuringConfidence`
5. `HomeContactBand`
6. `ClientSuccessAssurance`
7. `QuotationCta`

The WordPress Homepage must follow this structure rather than the current MedicaShop-oriented hero/who/featured/banner/latest/promotions/why/proof/evidence stack.

The implementation may internally split these into multiple Rosa Elementor widgets where that improves editor usability, but the rendered output must preserve the custom frontend's visual grouping, rhythm and section boundaries.

### 5.2 About

The custom frontend About composition is authoritative:

1. `PublicHeroCarousel` for About
2. `AboutIntroduction`
3. zero or more ordered `AboutStorySection` blocks from the current model
4. `AboutContactBand`
5. `AboutCompliance`
6. `AboutDocuments`
7. `AboutQuotationCta`

The current WordPress About page hero/who/stats/cards/feature/why/proof topology is obsolete for visual parity and must be replaced.

### 5.3 Contact

The custom frontend Contact composition is authoritative:

1. `PublicHeroCarousel` for Contact
2. main contact section with contact-information panel + general contact form preview
3. social / "Follow Rosa" band
4. location/map section
5. product-quotation CTA section

Business values must still originate from centralized Rosa settings. The form remains presentation/contact-oriented and must not gain an unsupported submission backend as part of this parity pass.

### 5.4 Shared Shell

Header, navigation, locale switcher, mobile navigation, page width, footer, shared CTA treatment and overall spacing must be audited against the latest custom frontend and then ported to the WordPress child theme. The shell remains code-owned rather than Elementor-owned.

### 5.5 Products / Shop / Product Detail

These pages remain WooCommerce/data-owned. Their presentation must be audited against the corresponding latest custom frontend products overview, catalogue/family discovery and product-detail surfaces. Parity work may change templates/CSS/markup adapters, but must not duplicate WooCommerce product truth into Elementor.

## 6. Design-System Porting Rules

The WordPress child theme shall receive a Rosa parity layer derived from the latest custom frontend rather than ad-hoc page-specific guesses.

Port and normalize:

- Rosa color tokens;
- text colors and muted hierarchy;
- font families available under current licensing/deployment constraints;
- heading/body/button scales;
- content max-widths;
- horizontal gutters;
- section vertical spacing;
- card radii, borders and shadows;
- button dimensions and states;
- hero height/aspect behavior;
- image-fit and crop rules;
- grid gaps and responsive collapse rules;
- motion timings that can be reproduced without making editing brittle.

Where React-specific abstractions such as `Reveal` or carousel state cannot be copied literally, WordPress shall reproduce the visible behavior with minimal theme JavaScript/CSS. Elementor remains content-authoring infrastructure, not the animation engine for code-owned shared behavior.

## 7. Elementor Ownership Model After Parity

Do not expose low-level layout freedom that could easily destroy parity.

Each Rosa Elementor widget should expose only content/media controls appropriate to its source section. Structural DOM, classes, core grid behavior, breakpoints and critical spacing remain widget/theme controlled.

Migration strategy:

- introduce a new authoring schema version for the latest-site topology;
- migrate untouched legacy documents automatically;
- migrate edited legacy documents only through explicit, surgical transforms where client-authored values can be mapped safely;
- never force-reseed edited Elementor documents as a routine parity operation;
- preserve existing media IDs and centralized settings wherever the corresponding latest section still uses them;
- add new media keys only when a latest Rosa section requires an asset that is not already represented.

## 8. Responsive and RTL Parity

Parity must be verified at least at:

- wide desktop: 1440px;
- standard desktop/laptop: 1280px;
- tablet: 1024px and 768px;
- mobile: 430/431px and 390px;
- narrow mobile: 360px.

Requirements:

- no horizontal overflow;
- no section overlap;
- no clipped text or controls;
- grids collapse in the same conceptual order as the custom frontend;
- hero media remains intentionally cropped rather than accidentally truncated;
- Arabic uses the custom frontend's RTL ordering/alignment, not a blanket visual reversal when the source does not do so;
- mobile navigation and touch targets remain usable.

## 9. Verification Strategy

The existing verifier remains the execution harness, but its obsolete MedicaShop fidelity assumptions must be replaced.

### 9.1 Source contracts

Add tests that assert the WordPress topology mirrors the pinned latest Rosa topology for Home, About and Contact.

### 9.2 Browser geometry contracts

Replace `client-preview-home-fidelity.test.mjs` MedicaShop-oriented assertions with Rosa parity assertions. Add equivalent About/Contact parity assertions where necessary.

Measure stable relationships rather than fragile magic pixels where possible:

- section order;
- widths/max-widths;
- hero proportions;
- grid column counts;
- gap bands;
- CTA positions;
- image aspect/crop behavior;
- no-overlap/no-overflow;
- responsive transitions.

Exact pixel assertions are appropriate for stable shell dimensions and known source geometry, but tests must not preserve obsolete MedicaShop values merely because they already exist.

### 9.3 Visual acceptance

For every migrated page and locale:

- compare WordPress and custom-source screenshots at matched viewports;
- inspect above-the-fold and full-page captures;
- reject visible differences in composition, hierarchy, spacing, typography, media treatment or breakpoint behavior unless documented as a WordPress constraint;
- run console/network checks and accessibility acceptance after parity is reached.

### 9.4 Authoring acceptance

After visual parity:

- edit representative EN text in Elementor and confirm frontend persistence;
- edit representative AR text and confirm RTL output;
- replace a representative image and confirm media persistence;
- confirm routine seeds cannot erase edits;
- confirm WooCommerce/catalogue and centralized business settings remain independent.

## 10. Implementation Phases

### Phase P1 — Audit and Design-System Port

Inventory latest custom frontend tokens, shell, shared hero/carousel behavior, typography, spacing, media and breakpoints. Create a parity matrix from custom source → WordPress ownership/file/widget.

### Phase P2 — Homepage Exact Parity

Replace the obsolete WordPress Homepage topology and styling with the latest Rosa Homepage composition. Update seed data/migration, widgets, content schema/media mapping as needed, and replace Homepage fidelity tests.

### Phase P3 — About Exact Parity

Port latest About topology, story sections, document/compliance treatment, media and responsive behavior. Update migration and tests.

### Phase P4 — Contact Exact Parity

Port latest Contact topology, social/location/quotation sections and responsive behavior while preserving centralized business settings and no-backend form constraint.

### Phase P5 — Shared Shell + Product Surfaces

Finish header/footer/navigation parity, then audit and align WooCommerce Shop/product presentation to latest Rosa custom surfaces without moving product truth into Elementor.

### Phase P6 — Full Acceptance

Run source tests, PHP/shell/JS checks, complete WordPress verifier, viewport screenshot parity, EN/AR manual editing acceptance and production-readiness review.

No production deployment is part of P1–P6 unless separately authorized.

## 11. Non-Goals

This parity correction will not:

- redesign the current Rosa website;
- introduce new branding;
- preserve MedicaShop visual decisions that conflict with latest Rosa;
- move catalogue truth into Elementor;
- introduce Elementor Pro;
- add unsupported ecommerce checkout behavior;
- add a new contact backend;
- force overwrite client-edited Elementor content;
- deploy to Hostinger without explicit approval.

## 12. Completion Gate

The parity correction is complete only when all of the following are true:

1. WordPress Home, About and Contact match the pinned latest custom source in composition and visible design across required viewports.
2. Shared shell matches the latest Rosa presentation.
3. Product/Shop presentation has no obvious old-template visual drift.
4. EN/AR and RTL behavior are correct.
5. Elementor edits persist without reseed loss.
6. WooCommerce and centralized settings ownership remains intact.
7. Full automated verification passes with Rosa-specific parity contracts, not MedicaShop fidelity contracts.
8. Manual side-by-side acceptance finds no material visual drift.
9. Production has not been changed unless explicitly authorized after acceptance.
