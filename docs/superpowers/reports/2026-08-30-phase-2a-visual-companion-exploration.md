# Phase 2A Visual Companion Exploration Report

Date: 2026-08-30
Project: Rosa Medical WordPress migration
Task classification: Architectural design exploration
Session outcome: **Balanced Rosa Adaptation confirmed**, with an additional preference to preserve a denser archive cadence
Implementation status: No Phase 2A production implementation was performed

## 1. Executive Summary

This session inspected the current custom Rosa frontend, the current WordPress free-foundation code, the controlling migration documents, the older MedicaShop migration material, the current product/discovery behavior, and rendered desktop/mobile states of the custom Products and Product Detail pages. It then used the Superpowers architectural brainstorming workflow and visual companion to compare three design directions and to test concrete shell, archive, product-card, Product Detail, catalogue-PDF, footer, and responsive compositions.

The validated direction is **Approach 2 — Balanced Rosa Adaptation**. This is not a compromise between Rosa and MedicaShop as brands. Rosa remains the identity, content, interaction, and information-architecture authority. Selected external/template ideas are limited to generic composition techniques that help users scan or understand content: clearer section grouping, a disciplined archive/sidebar relationship, stronger media/summary separation, and more explicit hierarchy within repeated catalogue components.

The recommended WordPress expression should:

- retain the existing Rosa red/black/warm-white palette, Inter/Lora/Tajawal typography character, compact sticky shell, exact five-destination public navigation, restrained corner geometry, catalogue-first product discovery, configuration/SKU prominence, and inquiry-led flow;
- preserve the custom archive's high-information density rather than adopting the visual companion's initially looser three-column demonstration grid; the user's browser feedback explicitly included “Make archive denser” alongside repeated Balanced confirmations;
- improve product-card hierarchy enough to distinguish family, product identity, representative/exact reference information, configuration count, effective price state, and detail action without turning cards into miniature retail storefronts;
- give catalogue PDFs first-class procurement treatment in family/archive context and a compact but visible family-reference treatment on Product Detail;
- make Product Detail configuration selection, selected SKU, attributes, effective price, quantity, and Add to Inquiry one coherent decision block;
- correct the current custom mobile Product Detail weakness where the fixed action region can obscure content and the page becomes unnecessarily tall;
- keep shared shell, archive, card, Product Detail, filters, and inquiry behavior in protected child-theme/plugin templates rather than Elementor page content;
- use Elementor Free only for normal client-editable editorial content and approved marketing sections.

The next required work remains a formal Phase 2A design specification, followed by explicit user approval, then a concrete implementation plan, then isolated TDD/verification-backed implementation. This report is design evidence and a specification input; it is not an implementation plan.

## 2. Session Scope

### In scope

- Repository and branch-state inspection.
- Full coordination/context review through the root `README.md`.
- Review of the controlling free-first WordPress architecture and the superseded MedicaShop migration material.
- Review of the relevant recent and foundational custom-site design specifications.
- Inspection of the actual custom public shell, Home/About/Contact compatibility context, Products workspace, product cards, Product Detail, inquiry controls, tokens, density rules, motion rules, and responsive behavior.
- Inspection of the actual WordPress child theme, `rosa-medical-core` plugin, product-template prototype, settings layer, hook ordering, and foundation verification scripts/tests.
- Rendered browser inspection of the current custom Products and Product Detail pages at desktop and narrow mobile widths.
- Visual comparison of three architectural design approaches.
- Visual exploration of the global shell, archive, product cards, Product Detail, catalogue access, footer, and responsive transformations.
- Concrete design recommendations that respect Elementor Free and the current child-theme/plugin architecture.
- Identification of conflicts, regressions, risks, and questions that the formal specification must resolve.

### Explicitly out of scope

- Phase 2A production code.
- Changes to the WordPress child-theme production styles/templates.
- Changes to `rosa-medical-core` production behavior.
- WooCommerce template implementation.
- Catalogue import or fixture mutation.
- Discovery/search/filter backend implementation.
- Inquiry/quotation backend implementation.
- Complete Home, About, or Contact redesign.
- Multilingual implementation.
- Hostinger access or deployment.
- MedicaShop installation or purchase.
- Elementor Pro, WPML, ElementsKit, Skyboot, or other paid/proprietary dependency installation.
- Branch switching, rebasing, merging, committing, pushing, or opening a pull request.

The only new visual files are isolated under `.superpowers/brainstorm/`. The only requested repository document created by this session is this report. No file under `wordpress/` was modified.

## 3. Repository State Inspected

### Verified repository state

- Repository path: `/home/mmm/Projects/RosaMedical`
- Branch: `wordpress/medicashop-migration`
- HEAD: `bb93bbcf0b4f11c90438e0ced1923a036d8bf228`
- HEAD subject: `fix(wordpress): avoid nested product main landmark`
- Remote tracking branch was at the same commit during inspection.
- The historical base commit `57f2df01916ec1d7de65196994913711e9fb3039` exists in this clone.
- At the start of visual inspection, the local migration branch and its stale remote-tracking reference both ended at `bb93bbcf0b4f11c90438e0ced1923a036d8bf228`; the prompt's known head `6744207b97507f07761b30dd2d9ff505bff82fa1` was not yet present locally. A later fetch made the actual remote state visible: `6744207` is a direct descendant of `bb93bbc` and adds the free-foundation gate report. This published documentation branch is rooted at that current remote tip, so it preserves the complete migration history without changing `wordpress/medicashop-migration`.

### Working-tree state

Before this session created visual companion artifacts, the repository already contained:

- modified tracked file: `apps/web/next-env.d.ts`;
- untracked file: `output.txt`.

Those pre-existing changes were preserved and not edited. This session added the untracked `.superpowers/` visual-companion directory. This report is intentionally uncommitted. The repository was therefore not clean during the session.

### Coordination and architecture documents inspected

- `README.md` — read in full. It remains a major coordination/history source, but older rules in it are subordinate to later explicit decisions and approved specifications. In particular, old “no public prices” language is superseded by the approved optional SAR/Price-on-Request model.
- `docs/superpowers/specs/2026-08-27-rosa-wordpress-free-custom-foundation-design.md`
- `docs/superpowers/specs/2026-08-27-rosa-wordpress-medicashop-migration-design.md`
- `docs/runbooks/wordpress-local.md`
- `docs/superpowers/plans/2026-08-27-rosa-wordpress-free-foundation-gate-implementation.md`
- `docs/superpowers/plans/2026-08-27-rosa-wordpress-medicashop-migration-implementation.md`, especially the visual token, discovery, Product Detail, catalogue-PDF, public-page, and responsive acceptance sections
- `docs/superpowers/plans/2026-08-27-rosa-wordpress-free-foundation-execution-order-amendment.md`
- `docs/superpowers/plans/2026-08-27-rosa-wordpress-foundation-fixture-correction.md`
- `docs/superpowers/plans/2026-08-27-rosa-wordpress-paid-dependencies-gate0-amendment.md`
- `docs/superpowers/reports/2026-08-27-foundation-fixture-source-correction.md`
- `docs/architecture/2026-08-23-quotation-pricing-schema.md`

The requested `docs/superpowers/reports/2026-08-27-wordpress-free-foundation-gate.md` was absent during the initial inspection because the local remote-tracking reference was stale. After fetching `origin/wordpress/medicashop-migration`, commit `6744207` supplied the report. It was then read in full before publication and confirms the prompt's `PASS_WITH_FOUNDATION_REPAIRS` status, recorded runtime versions, exact Stevens Scissors fixture, seven repairs, accepted free-stack architecture, and subsequent-phase exclusions. The expected artifact is therefore present on the actual remote migration branch; no restoration is required.

### Custom-design specifications inspected

- `docs/superpowers/specs/2026-08-22-client-products-site-shell-redesign-design.md`
- `docs/superpowers/specs/2026-08-23-products-pricing-navigation-polish-design.md`
- `docs/superpowers/specs/2026-08-17-client-about-compact-redesign-design.md`
- `docs/superpowers/specs/2026-08-13-client-homepage-compact-redesign-design.md`
- `docs/superpowers/specs/2026-08-13-homepage-media-smoothness-refinement-design.md`
- `docs/superpowers/specs/2026-08-09-public-responsive-density-design.md`
- `docs/superpowers/specs/2026-08-08-client-feedback-responsive-homepage-design.md`
- `docs/superpowers/specs/2026-08-06-media-crop-fullbleed-refinement-design.md`
- `docs/superpowers/specs/2026-08-03-premium-visual-polish-design.md`
- `docs/superpowers/specs/2026-08-01-rosa-medical-f3a-home-products-design.md`
- `docs/superpowers/specs/2026-08-01-rosa-medical-f3b-family-product-design.md`
- `docs/superpowers/specs/2026-08-01-rosa-medical-f3c-catalogues-inquiry-design.md`
- `docs/superpowers/specs/2026-07-30-rosa-medical-website-design.md`

### Custom implementation areas inspected

- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/layout/public-shell.tsx` and associated shell/contact-strip components
- `apps/web/src/features/homepage/` and its data/section components
- `apps/web/src/features/about/` and current content model
- `apps/web/src/features/contact-preview/`
- `apps/web/src/features/products/`
- `apps/web/src/features/family-listing/`
- `apps/web/src/features/product-detail/`
- `apps/web/src/features/inquiry/`
- `apps/web/src/styles/tokens.css`
- `apps/web/src/styles/base.css`
- `apps/web/src/styles/layout.css`
- `apps/web/src/styles/public-density.css`
- relevant products, Product Detail, shell, inquiry, motion, and responsive stylesheet modules

### WordPress foundation areas inspected

- `wordpress/wp-content/themes/rosa-medical-child/style.css`
- `wordpress/wp-content/themes/rosa-medical-child/functions.php`
- `wordpress/wp-content/themes/rosa-medical-child/header.php`
- `wordpress/wp-content/themes/rosa-medical-child/footer.php`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/tokens.css`
- `wordpress/wp-content/themes/rosa-medical-child/assets/css/base.css`
- the child-theme WooCommerce Product Detail prototype and template-selection integration
- `wordpress/wp-content/plugins/rosa-medical-core/` bootstrap, business settings, and WooCommerce/product-template integration
- foundation contract/version/seed/product verification scripts and tests

### Rendered states inspected

The current custom Next.js site was run locally for read-only visual inspection. Full-page screenshots were captured at 1440 px and 390 px for:

- Products archive/workspace;
- representative Product Detail.

These screenshots are recorded with the visual artifacts in Section 21.

## 4. Authority / Decision Hierarchy

The design decisions in this report follow this hierarchy:

1. The current user's explicit decisions in the session prompt and confirmation.
2. The approved free-first WordPress architecture in `2026-08-27-rosa-wordpress-free-custom-foundation-design.md`.
3. The current final custom Rosa implementation as observed in code and rendered output.
4. The latest approved custom-site design and refinement specifications, with later specifications superseding earlier ones where they conflict.
5. Existing catalogue, configuration, price, inquiry, and discovery behavior.
6. MedicaShop's generic composition ideas.
7. Generic web/WooCommerce conventions.

This hierarchy produces several concrete consequences:

- MedicaShop is not a dependency, architecture, brand, or authoritative UI.
- The custom Rosa site outranks WooCommerce defaults.
- Elementor Free does not imply that every surface should be Elementor-editable.
- Later pricing decisions supersede older no-price statements.
- The exact product discovery semantics survive the migration even though Phase 2A initially addresses their visual foundation rather than their full backend.
- The user's Balanced selection is already decided; Approach 1 and Approach 3 remain comparison controls only.

## 5. Existing Custom Rosa Visual System

This section distinguishes exact implementation values from recommendations. Unless labelled otherwise, the values below are present in current code.

### Color tokens — exact current implementation

- Rosa red: `#e00815`
- Rosa red dark: `#b9000b`
- Ink: `#191917`
- Soft ink: `#2d2d2a`
- Warm white: `#f9f7f2`
- Paper: `#ffffff`
- Mist: `#f1f1ee`
- Steel/muted: `#646b70`
- Border: `#d7d7d1`
- Success: `#1f6b45`
- Success surface: `#e9f5ed`
- Warning: `#9a5b00`
- Warning surface: `#fff5df`
- Danger surface: `#fff0f1`

The palette is intentionally narrow. Red communicates Rosa identity and primary action. Near-black grounds the professional/industrial tone. Warm white and restrained grays keep the site from feeling clinical in a generic blue-healthcare sense or retail in a pharmacy-green sense.

### Typography — exact current implementation

- Editorial display family: `Lora`, then Georgia/serif fallbacks.
- Interface family: `Inter`, then Arial/sans-serif fallbacks.
- Arabic family: `Tajawal`, then `GE SS Two`, `GE SS Text`, `GE SS`, Tahoma, Arial, sans-serif.
- `next/font` loads Inter, Lora, and Tajawal with `display: swap`.
- Body line height is approximately `1.55` in the base layer.
- Density token for hero title: `clamp(2.45rem, 4.2vw, 3.85rem)`.
- Density token for section title: `clamp(2rem, 3.1vw, 2.75rem)`.
- Density token for body copy: `clamp(1rem, 0.3vw + 0.94rem, 1.06rem)`.
- Narrow-mobile hero title: `clamp(2.25rem, 10.7vw, 2.9rem)`.
- Narrow-mobile section title: `clamp(1.9rem, 8.5vw, 2.4rem)`.

The current site mixes the editorial and interface families deliberately: Lora supplies measured brand character in major headings while Inter handles compact navigation, controls, metadata, filters, and dense catalogue content. The formal Phase 2A specification should document where each family is mandatory; it should not let Elementor or WooCommerce select arbitrary widget fonts.

### Content rails and gutters — exact current implementation

- Wide container: `80rem`.
- Standard container: `72rem`.
- Reading container: `46rem`.
- Original page gutter: `clamp(1.25rem, 4vw, 5rem)`.
- Later public-density gutter: `clamp(1.1rem, 3.25vw, 4rem)`.
- Narrow-mobile public-density gutter: `clamp(1rem, 4.8vw, 1.35rem)`.

The content-rail system is one of the strongest parts of the custom implementation. It prevents 1920/2560 layouts from becoming stretched and gives editorial, catalogue, and reading content different valid widths.

### Spacing and density — exact current implementation

Base scale:

- `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`.
- General section spacing: `clamp(4.5rem, 9vw, 8rem)` in the earlier token layer.

Later public-density controls:

- Header block: `clamp(4.25rem, 6.2vh, 4.75rem)`.
- Normal section block: `clamp(3.25rem, 6.2vw, 5.75rem)`.
- Compact section block: `clamp(2.5rem, 4.5vw, 4.25rem)`.
- Intro block: `clamp(2.5rem, 5vw, 4.75rem)`.
- Card gap: `clamp(1rem, 2vw, 1.5rem)`.
- Family/media block: `clamp(19rem, 33vw, 26rem)`.
- General media block: `clamp(19rem, 36vw, 31rem)`.
- Control height: `3rem`.
- Textarea height: `clamp(7.5rem, 14vh, 10rem)`.

For desktop viewports no taller than 800 px, section, intro, family, and media dimensions are explicitly reduced. This short-laptop accommodation is a material design feature and should survive the migration.

### Radii, borders, and shadows — exact current implementation

- Control radius: `0.25rem`.
- Surface radius: `0.125rem`.
- Lifted shadow: `0 1.25rem 3.5rem rgb(25 25 23 / 0.08)`.
- Cards and surfaces rely more on fine borders, restrained contrast, and media hierarchy than on large rounded containers or heavy elevation.

This geometry helps Rosa feel precise and industrial. It is incompatible with a generic “soft healthcare” system of oversized rounded cards, pills, and floating glass surfaces.

### Buttons and controls — actual behavior

- Primary actions use Rosa red with white text.
- Secondary actions use black/near-black, borders, or text-link treatment depending on importance.
- Current general buttons maintain roughly `2.875rem` or greater minimum block size; the public-density control target is `3rem`.
- Hover/press changes are restrained and quick.
- Selection controls in Products retain native semantic inputs beneath custom red visual states.
- Advanced facets use one-open-at-a-time disclosure, bounded long lists, contextual counts, and selected summaries.

### Focus and accessibility styling — actual behavior

- The custom base layer uses a visible `3px` focus outline with `3px` offset and a Rosa-red-derived mixed color.
- A skip link targets `#main-content`.
- Document language/direction are set early for English/Arabic routes.
- Reduced-motion media queries remove transition and transform behavior.

The WordPress prototype currently uses a separate blue focus token, `#0b66d4`. The formal design system should consciously reconcile this difference instead of inheriting both focus systems accidentally.

### Motion — exact current implementation

- Micro duration: `160ms`.
- Component duration: `280ms`.
- Section duration: `580ms`.
- Hero duration: `960ms`.
- Standard ease: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Emphasized ease: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Standard motion distance: `1.5rem`.
- Mobile motion distance: `0.75rem`.

Motion is meant to support hierarchy and media transitions, not create a showpiece. Reduced motion is already considered. Phase 2A should be more restrained than the editorial Home hero because Products and Product Detail are decision-making surfaces.

### Header/navigation — actual current implementation

- Compact sticky white header, approximately `4.25rem` to `4.75rem` tall.
- Current shared navigation: Home, About Us, Products, Inquiry, Contact Us.
- Rosa image logo on the left.
- Language control and red `Request a quote` action on the right.
- Active navigation uses a red underline/state.
- Scrolled state adds subtle shadow; the header uses a restrained translucent/blur treatment rather than a dramatic glass effect.
- Mobile navigation becomes a right-side drawer, up to roughly `31rem` wide, with overlay, focus transfer, Escape closing, and body-scroll lock.

### Footer/contact closure — actual current implementation

- A dark-red contact/social strip precedes a near-black footer.
- Desktop footer is four columns: brand/context, Products, Company, Support.
- Mobile footer collapses to one column.
- Small red uppercase headings give hierarchy.
- Repeated business/contact data is already conceptually centralized.

### Product archive and cards — actual current implementation

- Products opens with the shared image-led hero and a catalogue intro.
- Search appears above/within the discovery workspace.
- Desktop uses a narrow sticky filter sidebar, approximately `14.5rem` to `17rem` depending on layout.
- Results expose count, sorting, and grid/list controls.
- Current 1440 px output fits five dense cards per row.
- Mobile output uses two compact cards per row.
- Cards use white contained product media, thin borders, a small red family label, compact title, reference/configuration metadata, restrained price state, and a `View details` action.
- Reveal behavior is row-aware; `See more products` and `See all N products` must not create partial rows.
- Family catalogue cards/PDFs form a meaningful archive region rather than a generic download list.

### Product Detail — actual current implementation

- Desktop uses an approximately `1.12fr / 0.88fr` media/summary split.
- The gallery includes a thumbnail rail and large contained white product media.
- Summary includes family, title, product code, description, exact configuration selection, selected SKU, effective price/Price on Request, quantity, Add to Inquiry, optional note, and catalogue reference.
- Specifications and procurement information follow; related products are intentionally absent from the rendered page.
- The configuration implementation projects real valid combinations rather than constructing impossible Cartesian combinations.

The current mobile rendering exposed a visual defect important to Phase 2A: the sticky inquiry/price region can overlap the content flow near the title, the first title line can appear obscured, the media region consumes too much vertical space, and supporting content becomes excessively tall or hidden. The recommended mobile detail design explicitly reserves space for the sticky bar and keeps the complete product identity visible.

### Actual versus obsolete or inferred

- The exact token values above are current code.
- The free-foundation WordPress tokens are prototype values, not the final Rosa design system.
- Older specs contain earlier navigation, pricing, and content decisions that have been superseded by later specs and explicit user direction.
- Card-count behavior should be specified as complete-row responsive logic rather than copied from any one older fixed count.
- The visual companion's CSS instrument illustrations are compositional placeholders, not recommended imagery.

## 6. Existing Custom Rosa Content / UX Fundamentals

The WordPress migration must preserve the following product and content logic:

- Public navigation remains Home, About Us, Products, Inquiry, Contact Us.
- The primary conversion is a structured quotation/inquiry, not checkout.
- The catalogue is organized around professional instrument families, including Knives, Scissors, Punches, Chisels, and Cutters.
- Catalogue codes/SKUs are meaningful buyer references, not low-priority inventory metadata.
- Products can have multiple exact configurations; the selected configuration determines SKU, attributes, and effective price.
- Search and filters are part of product discovery, not a decorative sidebar.
- Family is single-select. Size, Direction, Variant, and Code Group are multi-select.
- Boolean semantics are OR within a facet and AND across facets; search ANDs with active facets.
- Counts are contextual; selected zero-count values remain removable.
- Filter state is shareable/restorable through URL state.
- Advanced facets use progressive disclosure and summarized selections.
- Product reveal maintains complete rows and supports both incremental reveal and `See all N products`.
- Numeric prices are SAR. Missing effective price is `Price on request`; zero remains numeric.
- Price is informative but subordinate to product/configuration identity.
- Catalogue PDFs are procurement/reference artifacts associated with product families.
- `Add to Inquiry` carries the exact configuration identity, SKU, quantity, and notes.
- Related products, ratings, shipping promises, sale language, account prompts, wishlist, cart, checkout, and consumer payment content are intentionally absent.

Meaningful current copy/positioning includes:

- Metadata description: “Medical instrument catalogues and structured quotation support for professional procurement teams.”
- About positioning: “Precision, clarity and dependable medical sourcing.”
- About support copy joins structured product information, catalogue references, and quotation support for professional buyers.
- Quotation CTA: “Prepare your instruments inquiry.” / “Build a structured product list and send one clear request to Rosa Medical.”
- Contact distinguishes the general contact form from product inquiries and directs exact product quantities/quotation requests into the product inquiry.
- Company positioning emphasizes clear product presentation, dependable communication, thoughtful sourcing support, regulatory channels, quality, and supply-chain assistance.

Some current About media labels explicitly say “pending.” Those are placeholders, not verified publishable claims or media. The formal Phase 2A spec should not silently promote them to approved content.

## 7. Current WordPress Foundation

### Accepted architecture

The controlling architecture is:

- WordPress;
- Hello Elementor parent theme;
- minimal `rosa-medical-child` theme;
- Elementor Free;
- WooCommerce;
- WordPress Media Library;
- custom `rosa-medical-core` plugin;
- protected shared PHP/theme/plugin templates and hooks where appropriate.

The fetched foundation-gate report confirms the accepted versions as WordPress 7.1, PHP 8.3.33, MariaDB 11.4.13, `rosa-medical-child` 0.1.0, Elementor Free 4.2.3, WooCommerce 11.0.1, and `rosa-medical-core` 0.1.0. This session inspected the source foundation, verification scripts, and final gate report but did not rerun the already-completed disposable foundation gate.

### What currently exists

- A functioning minimal child theme with tokens/base CSS, header, footer, menu registration, and WooCommerce support.
- A plugin bootstrap and centralized `BusinessSettings` service for repeated business values.
- WooCommerce integration that chooses the Rosa prototype Product Detail at a sufficiently late `template_include` priority to survive Elementor interception.
- A real rendered WooCommerce foundation product path.
- Contract and shell verification around local Docker/WordPress behavior.
- Source-mounted theme/plugin architecture suitable for version-controlled implementation.
- A single theme-owned `<main>` landmark after the latest repair.

### What is prototype quality

- The header is currently a simple site-name/nav/phone flex row, not the Rosa production shell.
- The footer is a basic business/address/contact layout, not the production corporate procurement footer.
- WordPress tokens use a more generic prototype set: white/light-gray surfaces, a `90rem` shell, `0.375rem` and `0.75rem` radii, system Inter fallback, and separate blue focus.
- The Product Detail prototype renders identity, description, and configuration cards but is not the Phase 2A production composition.
- There is no production archive/product-card visual system yet.

### Foundation repairs that must remain intact

- WP-CLI and web-process UID/GID consistency.
- Fail-fast version/report scripts.
- Source-corrected catalogue fixture interpretation.
- Correct late WooCommerce template-override hook ordering.
- WooCommerce Coming Soon/site-visibility interception handling.
- Exactly one appropriate `<main>` landmark.
- Real rendered-product verification, not source-only confidence.

## 8. MedicaShop Reference Analysis

The repository's older MedicaShop design/plan material and the external product description confirm that MedicaShop is a pharmacy/medical-store Elementor kit built around WooCommerce, Elementor Pro, and consumer-commerce templates including cart, checkout, account, archive, and single-product surfaces. That is precisely why it cannot be treated as Rosa's architecture or brand. Its value is limited to generic page composition.

### Idea 1: Strong section hierarchy

- Original idea: Distinct hero, promotional, category, product, and conversion bands.
- Why useful: Clear grouping helps users scan long pages and understand changing task contexts.
- Rosa adaptation: Use restrained tonal shifts among paper, warm white, mist, black, and Rosa red; group catalogue discovery, family reference, and inquiry support by purpose.
- Rejected baggage: Pharmacy promotion, benefit badges, sale zones, discount language, and newsletter pressure.

### Idea 2: Archive sidebar plus results field

- Original idea: Familiar ecommerce archive composition with filters alongside products.
- Why useful: Persistent relationship between narrowing controls and the result set is cognitively efficient at desktop widths.
- Rosa adaptation: A narrow, precise filter column for Family plus Size/Direction/Variant/Code Group; contextual counts, current selections, semantic controls, and URL-backed state; results remain dense.
- Rejected baggage: Price/category-brand filters designed for consumer shopping, promotional badges, cart controls, and generic Woo widgets.

### Idea 3: Media/summary Product Detail split

- Original idea: Large product media region paired with a buying summary.
- Why useful: Product recognition and decision details can be read without excessive vertical travel on desktop.
- Rosa adaptation: Media pairs with an exact configuration/procurement summary; selected SKU and attributes outrank price; inquiry replaces purchase.
- Rejected baggage: Add to cart, stock urgency, shipping, payment methods, ratings, wishlist, sale price, and related-product selling.

### Idea 4: Repeated product-card rhythm

- Original idea: Consistent media/card grid supports rapid browsing.
- Why useful: Catalogue users need predictable scan positions.
- Rosa adaptation: Fine-bordered, compact cards with controlled white product media, family signal, exact/representative reference, configuration count, restrained effective price, and `View details`.
- Rejected baggage: Rounded retail tiles, sale/bestseller badges, stars, crossed-out prices, quick-add, and lifestyle merchandising.

### Idea 5: Promotional/content cards

- Original idea: Strong cards interrupt the product grid to surface high-value material.
- Why useful: Family catalogues are legitimate reference documents and deserve more than a tiny metadata link.
- Rosa adaptation: A family-context catalogue panel or bounded PDF card with title, document type, family relationship, and explicit open/download action.
- Rejected baggage: Coupon/promotional language, campaign graphics, or fake urgency.

### Idea 6: Strong conversion closure

- Original idea: Repeated calls to action at page ends.
- Why useful: Users reaching the end of a result or detail context should have an obvious next step.
- Rosa adaptation: `Request a quote`, `Add to Inquiry`, direct professional support, and structured product inquiry.
- Rejected baggage: Checkout funnels, account creation, payment, shipping, newsletter signup, and purchase summaries.

### Idea 7: Asymmetric editorial composition

- Original idea: Alternating media/text regions and deliberate visual rhythm.
- Why useful: Later Home/About work can feel designed without becoming repetitive.
- Rosa adaptation: Preserve Rosa typography, content rails, restrained imagery, focal-position control, and short-laptop/mobile density rules.
- Rejected baggage: Unverified clinic/pharmacy copy, team/testimonial modules, consumer health imagery, and generic medical claims.

The external listing is useful only as provenance for the kit's pharmacy/consumer and paid-template assumptions: <https://themeforest.net/item/medicashop-pharmacy-medical-store-elementor-template-kit/39933128>. It is not an implementation requirement.

## 9. Three Design Approaches Compared

### Approach 1 — Conservative Rosa Port

Description: Translate the current custom frontend closely into WordPress child-theme/plugin templates with minimal compositional reinterpretation.

Advantages:

- Lowest identity and behavior drift.
- Strongest direct continuity with the existing site.
- Reuses proven density, rails, typography, catalogue semantics, and navigation.
- Easiest visual parity target.

Limitations:

- Can carry current mobile Product Detail problems into WordPress.
- Misses the opportunity to clarify metadata and configuration hierarchy.
- May reproduce composition shaped by the old implementation rather than by WordPress/WooCommerce's dynamic constraints.
- Risks treating migration as a pixel port rather than an improved expression.

### Approach 2 — Balanced Rosa Adaptation

Description: Preserve Rosa's identity, content, procurement behavior, catalogue density, and information hierarchy while improving composition, grouping, selected-state clarity, PDF treatment, and responsive behavior.

Advantages:

- Maintains recognition and intent.
- Improves the archive and Product Detail where evidence shows real weaknesses.
- Can use robust child-theme/WooCommerce template architecture without Elementor Pro.
- Adapts gracefully to dynamic product/configuration data.
- Supports future filters and Arabic/RTL without making them visual afterthoughts.

Tradeoffs:

- Requires a precise formal design specification; “balanced” cannot be left as subjective implementation freedom.
- Needs careful visual-regression testing to avoid drifting toward either a literal port or generic WooCommerce.

Decision: **Selected by the user before the session and confirmed again in both browser and terminal feedback.**

### Approach 3 — Template-Led Recomposition

Description: Heavily restructure pages around external medical-store template conventions while recoloring them Rosa.

Advantages:

- Can appear visually new quickly.
- Offers many ready-made section patterns.

Limitations:

- Highest risk of an unrelated redesign.
- Encourages consumer-shop hierarchy.
- Makes SKUs/configurations/PDFs feel secondary.
- Tends to introduce cart, account, promotional, rating, sale, and checkout assumptions.
- Usually increases Elementor/third-party dependency pressure.

Decision: Rejected as a control direction.

## 10. Recommended Direction

The recommended Phase 2A design is a **precise, restrained, high-information Rosa catalogue system**.

At first glance, the WordPress site should be unmistakably the same Rosa product: same logo treatment, red/black/warm-white palette, editorial/interface type pairing, compact shell, professional photography strategy, and controlled density. On closer use, the WordPress version should be clearer:

- the archive intro should identify the catalogue task quickly;
- the search/filter/results relationship should be visually explicit;
- cards should expose the minimum evidence needed to choose whether to inspect a product;
- exact configuration selection should be the core of Product Detail rather than an attached technical widget;
- the active SKU and attributes should remain visible next to the price/inquiry controls;
- catalogue PDFs should look like authoritative family references;
- mobile Product Detail should not hide the product identity behind a fixed action region;
- very-wide screens should increase calm surrounding space after reaching a bounded archive rail, not endlessly stretch cards and controls.

The visual companion initially showed three archive cards across to make hierarchy easy to compare. Browser feedback requested more density. The final recommendation is therefore to preserve a card width close to the current custom implementation and allow approximately four to five cards at standard desktop widths when the text and touch/focus targets remain readable. The exact number is responsive output, not a hard global constant; progressive reveal must always use complete rows.

## 11. Global Design System Recommendation

### Retained from current Rosa

- Brand palette: `#e00815`, `#b9000b`, `#191917`, `#2d2d2a`, `#f9f7f2`, `#ffffff`, `#f1f1ee`, `#646b70`, `#d7d7d1`.
- Inter for controls/body/dense metadata; Lora for selected brand/editorial headings; Tajawal and appropriate Arabic fallbacks for Arabic.
- Wide `80rem`, standard `72rem`, reading `46rem` rails.
- Public-density gutters rather than fixed Elementor paddings.
- Base spacing scale and short-laptop media query behavior.
- Small radii (`0.25rem` controls, `0.125rem` surfaces) and low-opacity shadows.
- Primary red actions, restrained secondary actions, fine borders, visible focus, reduced motion.
- Compact sticky header and bounded mobile drawer.

### Recommended adaptation

- Add an **archive workspace rail** up to approximately `90rem` only where the sidebar plus a dense card grid genuinely needs it. Normal editorial content should remain on the existing `80rem`/`72rem` rails.
- Define named semantic roles rather than raw page-specific colors: brand action, brand action hover, ink, muted ink, paper, warm surface, quiet surface, border, focus, success, warning, error.
- Reconcile the custom red-derived focus treatment and WordPress prototype blue focus into one tested focus system. Geometry should remain a `3px` outline with `3px` offset; the final color must be verified on white, warm, red, and black surfaces.
- Specify typography roles: display/section/editorial heading, page title, product title, body, compact body, eyebrow, navigation, metadata, control label, numeric/reference data.
- Give SKU/reference values tabular-number behavior where helpful and never render them as low-contrast microtext.
- Keep card corners essentially square. Reserve any medium radius for exceptional controls/drawers, not every surface.
- Define one border hierarchy: default quiet border, selected/active red border, strong dark separator.
- Keep shadows to sticky shell/drawer/lifted focus contexts. Product cards should not float like retail tiles.
- Limit Product/Archive motion to focus/hover/selected-state transitions around `160–280ms`; do not use long section entrances for core catalogue controls.
- Use CSS logical properties from the start so padding, separators, drawer direction, thumbnails, and chevrons are RTL-safe.
- Centralize the final tokens in the child theme and expose only the approved subset to Elementor Global Colors/Fonts for editable editorial content.

## 12. Header / Navigation Design

### Desktop

- Sticky white/paper header, approximately `4.25rem–4.75rem` high.
- Rosa logo left; it must use the approved public ROSA treatment rather than a generic WordPress site-name string.
- Center/primary navigation: Home, About Us, Products, Inquiry, Contact Us.
- Products receives a clear active state on archive/product-family/product-detail routes; use underline/weight plus color, not color alone.
- Right utility cluster: future language control plus primary `Request a quote` CTA.
- Do not put phone, search, account, cart, shipping, or opening-hours clutter into the primary header.
- Scrolled state may use subtle opacity/blur/shadow, but the header must remain readable on all underlying surfaces.
- Sticky behavior is recommended because catalogue users move through long result sets. It should collapse by only a small amount, if at all; large animated shrinking would be distracting.

### Tablet / compact desktop

- Keep the logo and quote action visible where width permits.
- Collapse primary navigation before labels become cramped; the current `70rem`-range behavior is a useful starting point.
- A compact menu button opens the same accessible drawer used on mobile.
- Do not create a hybrid row of truncated navigation labels.

### Mobile

- Header target remains approximately `4.25rem` with at least 44–48 px interactive targets.
- Logo left; menu trigger right; quote action can live prominently inside the drawer rather than crowding the bar.
- Drawer enters from the logical inline end, is bounded on larger phones, supports Escape, traps/manages focus correctly, and locks body scroll.
- Drawer order: primary navigation, language control, then primary quote action. Inquiry count/status may be attached to Inquiry if implemented later, but should not become a cart badge.
- The underlying page remains inert while the drawer is open.

### Language slot

Reserve the structural slot now, but render it only when a real locale switch is available. Do not ship a nonfunctional decorative toggle. The component and spacing must accommodate `العربية` and RTL without moving core navigation to unrelated positions.

## 13. Products Archive Design

### Page anatomy

1. Shared compact Rosa header.
2. Optional restrained image-led hero/intro consistent with the custom site, not an enormous retail banner.
3. Catalogue heading block with an eyebrow such as `Instrument catalogue`, a plain-language title, concise procurement-oriented support copy, and result context.
4. Search field with visible label/placeholder and support for product title, SKU/catalogue code, and relevant attributes.
5. Discovery workspace containing filter controls and results.
6. Complete-row product reveal controls.
7. Contextual family catalogue/PDF region.
8. Direct support/inquiry closure.
9. Shared contact strip/footer.

### Desktop discovery workspace

- Sticky filter sidebar approximately `14.5rem–17rem` wide.
- Search may sit above both columns or at the top of the sidebar depending on final spec, but it must visually apply to the entire result set.
- Family is a single-select radio group.
- Size, Direction, Variant, and Code Group are advanced multi-select disclosures.
- One advanced facet is open at a time; closed facets show `N selected` or the selected value.
- Counts sit near labels, use adequate contrast, and update contextually.
- Selected zero-count options remain enabled/removable.
- Long option sets gain within-facet search only at the documented threshold.
- Results header contains total/current context, sort, and grid/list controls. Avoid a generic WooCommerce “Showing x–y of z” style if it obscures the active family/filter context.
- Dense grid should aim for four to five cards at 1366/1440 where minimum card width is satisfied. At 1024 with a sidebar, three to four is more realistic.
- The archive rail is bounded around the proposed `90rem` maximum; 1920/2560 add outer whitespace rather than uncontrolled columns.

### Reveal behavior

- Initial content should be defined in complete responsive rows, preferably approximately two rows at the current layout rather than one hard cross-breakpoint number.
- `See more products` must name the next amount or communicate remaining items.
- `See all N products` remains available when approved behavior requires it.
- Loading/focus management must not jump the user's position unexpectedly.

### Mobile

- Intro and search remain visible before filters.
- Filters collapse into an explicit disclosure/sheet/drawer with selected count and `Clear filters` access.
- Applied-filter chips/summaries should be compact and removable.
- Two-column cards are retained at 390/430 only if the final card content remains readable without truncating the SKU/reference; otherwise use a one-column compact-list mode. Existing evidence shows two columns can work.
- Grid/list preference can remain available but must not consume excessive header height.
- `See more` appears after complete rows.

## 14. Product Card System

### Recommended balanced card

- Fine neutral border on paper background; essentially square corners.
- Product media area with a consistent contained aspect ratio. Use `object-fit: contain`; do not crop long instruments as lifestyle photography.
- Red uppercase family signal.
- Product title in compact Inter or carefully tested editorial treatment; line count is bounded but not so tightly that instrument identity disappears.
- A reference row showing a representative SKU/catalogue code when truthful, plus `N configurations` when multiple exact configurations exist.
- Effective price state beneath metadata: `SAR 000.00`, `From SAR 000.00` only when the underlying configuration range makes that statement true, or `Price on request`.
- `View details` is the action. Do not put `Add to Inquiry` on a card unless a product truly has only one configuration and the inquiry contract can preserve exact identity; even then, uniform detail-first behavior is safer.
- Hover may strengthen border/media contrast and shift the text arrow minimally. Focus must be equally obvious and must not rely on hover motion.

### Density

- Preserve the current custom site's compact vertical rhythm.
- Media should not consume the majority of the viewport on catalogue pages.
- Metadata should be legible rather than microscopic. The current custom cards approach the lower limit; Phase 2A should gain clarity through grouping and slightly stronger hierarchy, not by making cards substantially taller.
- Five-column standard-desktop output is acceptable when the actual minimum card width and content test pass. Do not hard-code five columns at all wide viewports.

### Rejected variants

- Editorial/spacious card: visually elegant but too tall for high-volume catalogue scanning.
- Template/retail card: rejected because sale/bestseller badges, stars, large price, quick add, rounded corners, and promotional metadata overwhelm exact reference/configuration information.
- Text-only ultra-dense card: rejected because product silhouette/media is important recognition evidence.

## 15. Product Detail Architecture

### Desktop anatomy

1. Breadcrumb/family context.
2. Two-column media/summary region, approximately the existing `1.1fr / 0.9fr` relationship.
3. Media gallery with contained instrument imagery, optional thumbnails, predictable aspect ratio, and keyboard-operable selection.
4. Identity block: family, full product title, product-level reference/context, concise description.
5. Configuration decision block.
6. Effective price and inquiry control block.
7. Family catalogue PDF module.
8. Specifications/details region.
9. Procurement/supporting-information region.
10. Focused inquiry closure; no related-products rail.

### Configuration decision block

- Label plainly: `Select configuration` or the approved localized equivalent.
- Project only real WooCommerce variations.
- Single-configuration products show the exact configuration as a summary rather than a redundant selector.
- Multi-configuration products use radio/list rows or a similarly explicit control; each row can expose SKU plus the minimum distinguishing attributes.
- Selected state uses native semantic input, red border/marker, and an explicit selected label/state—not color alone.
- Active SKU and attributes remain visible after selection, including Size, Direction, and Variant/type when present.
- Impossible combinations never appear.
- Changing configuration updates effective price and inquiry identity atomically.

### Price and inquiry block

- Price label is `Effective price` or a similarly neutral term.
- Numeric and `Price on request` states occupy the same typographic role; neither should produce a different retail-like composition.
- Price is visible but smaller/less dominant than product title, configuration, and SKU.
- Quantity is a clear bounded control with validation.
- `Add to Inquiry` is the dominant action.
- Requirement notes may be exposed after/below the primary action without breaking the initial decision block.
- Confirmation must name the selected SKU/configuration.

### Representative fixture

The visual companion followed the prompt and used:

- Family: Stevens
- Product: Stevens ophthalmic trolley
- SKUs: `04-0901` and `04-0911`

However, current repository source and the foundation correction report identify those same SKUs as **Stevens Scissors — Regular**, 10.5 cm, Straight/Curved, Sharp, in the Scissors family. This conflict must be resolved before the formal spec uses the fixture as normative copy. The mockup's composition remains valid regardless of the corrected name.

### Mobile architecture

- Gallery height is bounded; the full product title follows without being obscured.
- Configuration rows remain tap-friendly and may collapse secondary attributes only if the selected state remains unambiguous.
- Family PDF link sits after identity/configuration or in a compact disclosure, not at the distant page end only.
- Sticky inquiry bar is recommended after a configuration is valid. It must reserve bottom padding equal to its rendered height plus safe-area inset.
- Sticky bar shows a restrained effective price state and Add to Inquiry. Quantity can remain in the main content or be included only when space and accessibility permit.
- No fixed layer may overlap the product title, configuration controls, notices, or footer.
- Supporting specifications remain available; do not hide them merely to shorten mobile.

## 16. Catalogue PDF Placement

Catalogue PDFs should be presented as authoritative reference material, not incidental metadata.

### Products/family context

- Show a dedicated family catalogue panel when a family filter is active.
- Include family name, `Catalogue PDF` or `Reference catalogue`, optional document metadata when verified, and a clear `Open catalogue` action.
- On the all-products state, present a compact family-catalogue region after the initial result/reveal area or as a bounded horizontal rail on mobile.
- Do not interrupt every few product rows with promotional PDF cards.

### Product Detail

- Show a compact family-associated PDF module near the configuration/procurement region.
- The link resolves dynamically from the authoritative family/category attachment relation.
- It should name the family/document and communicate that it opens a PDF/new context.
- Do not hard-code URLs in templates or duplicate the association in Elementor content.

### Accessibility/operations

- Link text must be descriptive without relying on an icon.
- If the PDF opens a new tab, communicate that behavior.
- Media Library replacement must update every consuming surface.
- PDF MIME/type and capability validation remain plugin/admin responsibilities.

## 17. Footer Design

### Desktop

- Near-black background with restrained red accents.
- Four-column structure:
  1. Rosa identity, concise procurement positioning, and `Request a quote` action.
  2. Products/family links plus Catalogues.
  3. Company/About/procurement support/Contact.
  4. Inquiry/search/privacy/terms support links.
- Bottom row contains copyright/location and future language control/status where appropriate.
- Contact information is sourced centrally. Do not type phone/address/email independently into the footer template.

### Mobile

- Collapse to one column with clear group headings.
- Keep the primary quote action near the brand/context block.
- Use compact vertical spacing; avoid accordion behavior unless the final number of links makes it necessary.
- Maintain at least 44 px link targets through padding without creating enormous whitespace.

### Explicit rejection

No pharmacy-service taxonomy, app-download badge, consumer account, newsletter, payment logos, shipping claims, opening-hours promotion, or fake certification/testimonial content.

## 18. Responsive Matrix

### 390 px — narrow mobile

- Compact 4.25rem-class header; logo and menu only.
- Drawer from logical inline end; quote CTA inside.
- Archive intro, search, filter disclosure, then results.
- Two-column compact cards if final real-content testing passes; minimum reference/title readability is the gate.
- Product Detail gallery bounded around a compact viewport-aware height; complete title visible; configuration stacked; bottom inquiry bar reserves safe space.
- Catalogue cards may use a horizontal snap rail around 72–85vw per card or a compact vertical list.
- Footer single column.

### 430 px — wider mobile

- Same structural mode as 390; modestly more gutter and card text width.
- Do not prematurely add desktop navigation or a third card column.
- Sticky action can show slightly more price/context but remains compact.

### 768 px — tablet portrait

- Header likely still uses drawer navigation.
- Search plus filter disclosure/contained panel; avoid a permanently narrow sidebar that steals half the content width.
- Two or three card columns depending on tested minimum card width.
- Product Detail remains stacked, but gallery and summary can use wider internal subgrids for thumbnails/configurations.
- Footer can become two columns if link groups remain coherent.

### 1024 px — tablet landscape / compact desktop

- Treat height as well as width; short-laptop density tokens must apply.
- Header may remain drawer-based near the existing `70rem` threshold.
- Archive may introduce the sticky sidebar if at least three useful card columns remain; otherwise use an inline filter panel.
- Product Detail may switch to split view if summary retains a practical minimum width near 28rem.
- Avoid oversized hero/media heights.

### 1366 px — standard laptop

- Full navigation and sticky compact header.
- Sticky `14.5–17rem` filter sidebar.
- Approximately four to five cards depending on actual minimum card width.
- Two complete initial rows before reveal.
- Split Product Detail with contained gallery and summary visible without excessive first-screen scrolling.
- Short-height rules remain important at common 768 px viewport height.

### 1440 px — standard desktop

- Full shell and archive workspace.
- Five-card current-site density is a valid target after the user's denser-archive feedback.
- Archive rail remains bounded; metadata stays readable.
- Product Detail has comfortable two-column proportions and visible configuration/inquiry controls.

### 1920 px — large desktop

- Center archive on bounded `80–90rem` rail.
- Do not automatically add more columns after the target card density is reached.
- Use outer whitespace and slightly calmer inter-region spacing, not stretched search/filter controls.
- Product Detail gallery image retains a maximum useful size rather than scaling to the viewport.

### 2560 px — very large desktop

- Same bounded rail and column count as 1920 unless evidence supports a small increase.
- Header/footer internal content align to the same rail.
- Background surfaces may extend full bleed; functional content does not.
- Typography should not continue scaling merely because the viewport is wider.

## 19. Accessibility Requirements

- Exactly one appropriate `<main>` landmark per rendered page.
- Retain a functional skip link whose target exists once.
- Correct heading hierarchy: one page-level `h1`; section headings descend logically.
- Primary and mobile navigation require clear accessible names and current-page state.
- Mobile drawer requires focus entry/return, Escape close, inert background, and body-scroll management.
- All interactive targets should be at least 44 px in practical touch area; core controls target approximately 48 px.
- Focus-visible treatment must be unmistakable on paper, warm, red, and black backgrounds.
- Selected filter/configuration state must not rely on color alone.
- Native radio/checkbox/select semantics remain available to assistive technology.
- Contextual counts must not produce uncontrolled live-region chatter; announce meaningful result changes politely and in a debounced manner.
- URL state restoration must also restore understandable control state; browser Back/Forward must not strand focus.
- Product gallery controls require names, active-state semantics, keyboard operation, and meaningful image alternatives.
- Product images use informative alt text where the image communicates identity; decorative backgrounds remain empty-alt/presentational.
- Price state must be readable as text, including `Price on request`.
- SKU/catalogue codes should be announced as coherent values and visually use sufficient size/contrast.
- PDF links must identify the document and new-tab behavior where applicable.
- Sticky mobile action must not cover focused elements or content and must account for device safe-area insets.
- Motion must respect `prefers-reduced-motion`; catalogue controls should remain usable with transitions removed.
- Layout and logical icons/chevrons must be RTL-safe.
- Test zoom/reflow at 200% and text spacing in addition to fixed widths.

## 20. WordPress Implementation Constraints Discovered

- Elementor Free has no Theme Builder. The design cannot depend on Elementor Pro header/footer/archive/single-product templates.
- Shared header/footer/archive/card/Product Detail structures belong in the child theme, WooCommerce template/hooks, protected PHP components, and/or `rosa-medical-core` as defined by responsibility.
- Elementor Free is appropriate for ordinary editable Home/About/Contact sections, not for duplicating product templates or business logic.
- `rosa-medical-core` owns business semantics: metadata, real configuration projection, pricing, discovery behavior, PDFs, inquiry, persistence, and centralized business settings.
- The child theme owns global presentation: tokens, shell, template composition, shared visual components, responsive CSS.
- WooCommerce remains the structured catalogue source, but default consumer behavior must be removed or bypassed deliberately.
- The existing late `template_include` ordering is a verified repair and must not be casually replaced by an earlier override.
- WooCommerce Coming Soon/site visibility can intercept public rendering; acceptance must verify the actual public product, not only authenticated/admin output.
- Header currently opens the single `<main>` and footer closes it; Product templates must render interior containers, not a second main.
- Catalogue PDF associations must use attachment IDs and family/category metadata, not hard-coded Elementor URLs.
- Repeated phone/email/address/CTA content must use `BusinessSettings` or its approved successor.
- Product cards/archive/detail must be dynamic shared structures. No per-product Elementor duplication.
- The visual system must be a centralized token layer. Do not scatter values across Woo templates, Elementor widget settings, and plugin CSS.
- RTL feasibility requires logical properties and appropriate DOM order from the beginning, even though multilingual implementation is later.
- The current foundation's `90rem` shell, larger radii, system fonts, and blue focus are prototype values; Phase 2A must intentionally reconcile them with the custom Rosa system.

## 21. Visual Companion Artifacts

### Session

- Session root: `.superpowers/brainstorm/41017-1788077376/`
- Browser URL: `http://localhost:62222/?key=ac2cd72be73c383a09dfdd7a807f9a1da7cb211eaa7094659338605f3a5004b9`
- HTML comparison board: `.superpowers/brainstorm/41017-1788077376/content/rosa-phase2a-balanced-exploration-v1.html`
- Full-board screenshot: `.superpowers/brainstorm/41017-1788077376/content/rosa-visual-board-v1.png`

The local server is session-bound and may not remain running indefinitely. The HTML and PNG files are the persistent local evidence. `.superpowers/` is currently untracked and must not be accidentally committed with production code.

### Source-state screenshots

- `.superpowers/brainstorm/41017-1788077376/content/source-current-products-1440.png`
- `.superpowers/brainstorm/41017-1788077376/content/source-current-products-390.png`
- `.superpowers/brainstorm/41017-1788077376/content/source-current-detail-1440.png`
- `.superpowers/brainstorm/41017-1788077376/content/source-current-detail-390.png`

### Mockups/comparisons shown

1. **Three approaches** — Conservative Rosa Port, Balanced Rosa Adaptation, Template-Led Recomposition. Purpose: validate that Balanced preserves the correct authority hierarchy while allowing useful refinement. Winner: Balanced.
2. **Global shell triptych** — current custom Rosa, too-literal WordPress, balanced Rosa. Purpose: expose how a technically valid WordPress header can still lose the brand and information architecture. Winner: balanced Rosa.
3. **Products archive desktop anatomy** — filter-ready sidebar, search, result context, product grid, reveal, catalogue panel. Purpose: verify future discovery feasibility. Direction retained with increased final density.
4. **Three product cards** — editorial/spacious, structured catalogue, retail template. Purpose: compare scan density and professional product evidence. Winner: structured catalogue.
5. **Product Detail desktop** — media/summary split with exact configuration, SKU, price state, quantity, inquiry, PDF, procurement note. Purpose: make configuration the core decision.
6. **Product Detail mobile** — bounded media, visible complete identity, compact PDF access, non-overlapping sticky inquiry bar. Purpose: address current mobile evidence.
7. **Corporate procurement footer** — four-column desktop plus responsive matrix. Purpose: reject pharmacy/retail closure and preserve centralized company context.

### User reaction

- Terminal response: `balanced`.
- Browser event stream repeatedly selected `Confirm balanced` and `Balanced direction feels right`.
- One browser event selected `Make archive denser`.
- No browser selection requested more editorial cards, more technical Product Detail, Conservative, or Template-Led direction.

Interpretation: Balanced is confirmed. The denser-archive event is incorporated as a secondary refinement: preserve the custom archive's four/five-column catalogue cadence where readability permits.

## 22. Decisions Confirmed During Session

- Phase 2A remains an architectural design task, not implementation.
- Balanced Rosa Adaptation is the selected direction.
- Rosa identity, content, procurement behavior, exact SKU/configuration logic, and information hierarchy remain authoritative.
- MedicaShop remains composition-only reference material.
- No MedicaShop purchase or installation.
- No Elementor Pro Theme Builder dependency.
- The free-first WordPress architecture remains authoritative.
- Shared shell/archive/card/Product Detail structures remain developer-controlled.
- Archive should remain denser than the initial visual demonstration while preserving readability and complete-row behavior.
- Structured catalogue cards are preferred over both spacious editorial cards and retail template cards.
- Product Detail should use a media/summary split on desktop and a safe, compact sticky inquiry pattern on mobile.
- Catalogue PDFs need first-class, contextual placement.
- Footer remains corporate/procurement-led.
- No production code, branch topology, Hostinger, catalogue import, paid dependency, commit, or PR action occurred.

## 23. Open Questions Remaining

Only one material source conflict requires resolution before the formal spec treats the foundation fixture as normative content:

1. **Fixture identity conflict.** The session prompt says Family `Stevens`, Product `Stevens ophthalmic trolley`, SKUs `04-0901` and `04-0911`. The current repository's correction report and seed/verification code say Product `Stevens Scissors — Regular`, Family `Scissors`, 10.5 cm, Straight/Curved, Sharp, with the same SKUs. The coordinating session should confirm which source changed and correct either the prompt-level naming or repository fixture before writing final acceptance copy. Do not create new variants to reconcile the names.

No further visual direction question is blocking the formal Phase 2A specification.

## 24. Phase 2A Proposed Design Specification Outline

The receiving AI should create a formal design specification with at least the following structure and level of precision.

### A. Status, authority, and problem

- Mark the spec as proposed until explicit approval.
- State that it implements Balanced Rosa Adaptation.
- Identify controlling documents and superseded MedicaShop assumptions.
- Define the problem: convert a functioning free WordPress foundation into the production Rosa visual foundation without losing catalogue/procurement behavior.

### B. Scope and non-scope

- In scope: design system, shell, header/nav/footer, archive foundation, cards, Product Detail, configuration/SKU/price/PDF/inquiry presentation, responsive patterns.
- Non-scope: complete editorial page migration, full catalogue import, backend discovery, quote persistence, multilingual activation, Hostinger.

### C. Design principles

- Rosa-first continuity.
- Procurement evidence before retail promotion.
- Dense but legible.
- Shared dynamic templates over duplicated page content.
- Responsive transformations rather than desktop stacking.
- Bounded large-screen rails.
- Accessible and RTL-safe by construction.

### D. Token contract

- Exact retained palette and semantic role mapping.
- Inter/Lora/Tajawal role table, weights, sizes, line heights, and fallbacks.
- Rail widths: 46/72/80rem plus justified archive workspace maximum.
- Gutter formula and breakpoint changes.
- Spacing scale, section spacing, short-laptop reductions.
- Border/radius/shadow hierarchy.
- Button/control states.
- Focus system and verified contrast targets.
- Motion durations/easing and reduced-motion behavior.
- Token ownership between child-theme CSS and Elementor Globals.

### E. Global shell contract

- Header DOM/landmark structure.
- Exact navigation labels/destinations.
- Logo, active states, language-slot conditions, quote action.
- Sticky/scrolled behavior.
- Drawer interaction, focus, Escape, inert background, RTL direction.
- Footer columns, centralized content, legal/support links, mobile collapse.
- Exactly one main landmark and skip-link target.

### F. Products archive contract

- Page anatomy and content hierarchy.
- Filter/search/results spatial relationship at each breakpoint.
- Facet control visual states and selected summaries.
- Result count/sort/view controls.
- Card-grid minimum width and expected responsive column ranges.
- Complete-row reveal behavior.
- Loading, empty, no-results, error, and selected-zero-count states.
- Catalogue/PDF contextual module.
- Direct inquiry/support closure.

### G. Product card contract

- DOM/content order.
- Image aspect ratio and contain behavior.
- Family/title/reference/configuration/price/action hierarchy.
- Rules for representative SKU and `N configurations` language.
- Numeric, from-price, and Price-on-Request states.
- Hover, focus, selected/list-view states.
- Line-clamp rules and minimum readable sizes.
- No retail badges/ratings/quick-cart.

### H. Product Detail contract

- Desktop media/summary grid and minimum widths.
- Gallery/thumbnails behavior.
- Identity and breadcrumb hierarchy.
- Single- and multi-configuration variants.
- Active SKU/attribute display.
- Effective price logic and presentation.
- Quantity/inquiry behavior and confirmation.
- Requirement notes.
- Catalogue PDF module.
- Specifications and procurement sections.
- No related products.
- Mobile stacking and safe sticky action geometry.
- Loading/unavailable/invalid-variation/error states.

### I. Responsive acceptance matrix

- Explicit expected structure at 390, 430, 768, 1024, 1366, 1440, 1920, and 2560.
- Include short-height laptop acceptance.
- Define grid column expectations as ranges derived from minimum card width.
- Define header/drawer, filter/sidebar, Product Detail, PDF, footer, and sticky-action transformations.
- Include no-horizontal-overflow criteria.

### J. Accessibility and RTL

- Landmarks/headings/skip link.
- Control semantics and names.
- Keyboard paths and focus return.
- Result announcements.
- Touch targets.
- Contrast/focus.
- Reduced motion.
- Zoom/reflow/text-spacing.
- Logical properties and mirrored directional affordances.

### K. WordPress responsibility boundaries

- Child theme: tokens, shell, shared templates, presentational components.
- WooCommerce: catalogue/product/variation source.
- `rosa-medical-core`: business logic, discovery, configuration projection, pricing, PDF association, inquiry, settings.
- Elementor Free: editable editorial areas only.
- Identify hooks/template boundaries without writing the implementation plan.
- Preserve the late template override and single-main repairs.

### L. Content contract

- Exact navigation/CTA labels.
- Product/archive intro copy status.
- SKU/configuration/price/PDF labels.
- Centralized business data.
- Placeholder/unverified content policy.
- Resolve the Stevens fixture conflict before acceptance examples are locked.

### M. Failure/recovery and states

- Product image missing.
- PDF missing/unavailable.
- Product has no valid configurations.
- Price null versus zero.
- Search/filter no results.
- Network/API failure for future discovery.
- Inquiry state unavailable/full/invalid.
- Woo template interception/Coming Soon regression.

### N. Observability and verification strategy

- Token/source linting where feasible.
- PHPUnit/domain tests for business semantics.
- Browser tests for shell, controls, complete-row reveal, selected states, price states, Product Detail, PDF links, landmarks, and RTL.
- Screenshot comparison matrix at all required widths.
- Real WooCommerce product rendering, anonymous/public access, and no Coming Soon interception.
- Manual visual review of actual product imagery and long titles/SKUs.
- Independent design/spec and code review before integration.

### O. Acceptance criteria

- Visually recognizable as Rosa.
- No pharmacy/retail terminology or controls.
- All named components match the formal contracts.
- Exact SKU/configuration remains clear.
- Numeric and POR states both pass.
- PDFs are visible and dynamic.
- Mobile sticky action never overlaps content.
- Archive is filter-ready and dense without illegibility.
- One main landmark.
- No Elementor Pro dependency.
- No duplicated shared templates/business settings.
- Fresh evidence at the complete breakpoint matrix.

## 25. Risks / Regression Traps

### Identity risks

- Recoloring a pharmacy template red while leaving its hierarchy intact.
- Replacing Lora/Inter/Tajawal roles with Elementor defaults.
- Introducing large radii, gradient-heavy surfaces, glass cards, generic blue healthcare, or pharmacy green.
- Making the WordPress shell look like an unrelated site.

### Catalogue risks

- Allowing default WooCommerce loop markup to make price/cart the primary scan target.
- Removing the filter sidebar/disclosure space and making future facets awkward.
- Hard-coding a column count that breaks complete-row reveal.
- Lowering card density so catalogue scanning becomes slow.
- Making metadata so small that density becomes illegibility.
- Cropping long surgical instruments with `cover` instead of contained imagery.
- Treating SKU/configuration count as tertiary metadata.
- Inventing configuration combinations from flattened catalogue text.

### Product Detail risks

- Using Woo variation dropdowns without clear selected SKU/attributes.
- Making price larger than product/configuration identity.
- Adding cart, stock, shipping, rating, wishlist, account, or checkout elements.
- Restoring related products.
- Reproducing the current mobile sticky-bar overlap.
- Hiding specifications/procurement information to shorten mobile.
- Showing Add to Inquiry before a valid exact configuration exists.

### PDF/content risks

- Tiny or distant catalogue links.
- Duplicated PDF URLs in Elementor and templates.
- Duplicated phone/address/email/CTA content.
- Publishing placeholder media labels or unverified company/certification claims.
- Leaking old demo/template pharmacy terminology.

### Architecture risks

- Depending on Elementor Pro Theme Builder despite the free-first decision.
- Making shared product templates client-editable/duplicated.
- Putting business logic in the child theme or visual CSS in the plugin without a clear contract.
- Scattering tokens across one-off Elementor/widget CSS.
- Regressing template hook ordering.
- Reintroducing WooCommerce Coming Soon interception.
- Returning to nested `<main>` landmarks.
- Treating logged-in/admin rendering as proof of public rendering.

### Responsive/accessibility risks

- Designing only at 1440 px.
- Stretching content at 1920/2560.
- Stacking desktop widgets into an excessively tall mobile page.
- Ignoring short 1366×768-class laptops.
- Losing keyboard/focus states in custom filters/configurations.
- Using selection color without a semantic/native state.
- Forgetting RTL until after component geometry is fixed.
- Letting sticky UI cover focused controls, notices, or safe areas.

### Process risks

- Treating this visual report as an approved implementation plan.
- Implementing before the formal Phase 2A spec is written and approved.
- Silently resolving the fixture-name contradiction in code.
- Committing `.superpowers/` screenshots or other large exploratory artifacts without an explicit decision.
- Mixing unrelated cleanup or the pre-existing dirty files into Phase 2A work.

## 26. Recommended Next Step

The next step is to write the **formal Phase 2A design specification** using Section 24 as its outline and this report's visual evidence as support. That specification should resolve the fixture identity conflict, define exact component contracts and responsive acceptance behavior, and then be presented for explicit user approval.

Only after approval should the project proceed to:

1. detailed executable implementation plan with exact files, dependencies, tests, and acceptance evidence;
2. isolated feature branch/worktree implementation;
3. TDD for behavioral and control logic;
4. deterministic unit/integration/browser verification;
5. full responsive screenshot review;
6. independent review of spec compliance, architecture, accessibility, security/permissions, tests, and final diff;
7. integration only after all applicable Definition-of-Done gates pass.

No Phase 2A production implementation should be inferred from this report alone.
