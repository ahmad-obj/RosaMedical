# Rosa Medical WordPress Phase 2A — Balanced Visual Foundation Design

Date: 2026-08-30
Status: proposed design specification; requires explicit user approval before implementation planning
Branch: `docs/phase-2a-formal-design`
Base lineage: `wordpress/medicashop-migration` at `6744207b97507f07761b30dd2d9ff505bff82fa1`, plus the validated visual-exploration report branch

## 1. Decision and purpose

Phase 2A converts the accepted free WordPress foundation into the production Rosa visual foundation for the protected public shell, Products archive, product cards and Product Detail.

The selected direction is **Balanced Rosa Adaptation**.

Balanced Rosa Adaptation means:

- the current custom Rosa website remains the primary visual, content, responsive and interaction reference;
- Rosa's brand, catalogue density, procurement hierarchy, exact SKU/configuration semantics and inquiry-led behavior are preserved;
- useful generic composition ideas may be borrowed from MedicaShop or other references only when they improve hierarchy, scanning, grouping or responsive behavior;
- no pharmacy/retail identity or consumer-commerce hierarchy may be imported with those composition ideas;
- WordPress implementation constraints may change how the design is expressed, but they must not change what the product experience means.

This specification does not authorize production implementation. After approval, a separate detailed implementation plan must be written before code changes begin.

## 2. Authority and precedence

For Phase 2A, conflicts are resolved in this order:

1. the user's latest explicit decisions, including Balanced Rosa Adaptation and the requirement to preserve a dense four-to-five-card desktop catalogue rhythm where readable;
2. this specification after explicit approval;
3. `docs/superpowers/specs/2026-08-27-rosa-wordpress-free-custom-foundation-design.md`;
4. the final custom Rosa implementation and its latest approved public-site/product refinements;
5. the accepted WordPress foundation gate and its repairs;
6. catalogue/configuration/pricing/inquiry source behavior;
7. the visual-exploration report `docs/superpowers/reports/2026-08-30-phase-2a-visual-companion-exploration.md`;
8. older MedicaShop migration material for composition ideas only;
9. generic WordPress/WooCommerce conventions.

The root `README.md` remains important historical coordination context, but its older “no public prices” rule is superseded by the later approved SAR / Price-on-Request pricing architecture recorded in the 2026-08-23 product/pricing design and the free-first WordPress architecture.

## 3. Stevens foundation fixture identity — resolved

The visual-exploration report recorded one remaining contradiction: a prompt-level handoff called the representative fixture “Stevens ophthalmic trolley,” while the repository's source-corrected foundation records identified the same SKUs as Stevens Scissors.

That contradiction is now resolved.

The canonical foundation fixture is:

- **Family:** Scissors
- **Product:** Stevens Scissors — Regular
- **Size:** 10.5 cm
- **Variant:** Regular
- **SKU `04-0901`:** Straight, Sharp
- **SKU `04-0911`:** Curved, Sharp

Evidence is consistent across:

- `docs/superpowers/reports/2026-08-27-foundation-fixture-source-correction.md`;
- `docs/superpowers/plans/2026-08-27-rosa-wordpress-foundation-fixture-correction.md`;
- `wordpress/scripts/foundation-seed.sh`;
- `wordpress/scripts/foundation-product-verify.sh`;
- `docs/superpowers/reports/2026-08-27-wordpress-free-foundation-gate.md`;
- independent visual re-check of the supplied Scissors catalogue page, where `04-0901` and `04-0911` appear under **Stevens Scissors, Regular**.

The phrase “Stevens ophthalmic trolley” has no supporting current repository or catalogue evidence for these SKUs and must not be used as normative fixture copy.

No new variants are created to reconcile the old label. The existing source-corrected fixture remains unchanged.

## 4. Phase 2A scope

### 4.1 In scope

Phase 2A defines the production visual and structural contract for:

- centralized Rosa design tokens;
- global public shell;
- header and primary navigation;
- mobile navigation drawer;
- footer and contact/procurement closure;
- Products archive visual foundation;
- filter/search/result spatial architecture ready for the later discovery subsystem;
- dense responsive product-card system;
- Product Detail visual architecture;
- real-configuration presentation;
- selected SKU and attribute presentation;
- numeric SAR / Price-on-Request presentation;
- quantity and Add-to-Inquiry presentation;
- family catalogue-PDF placement;
- responsive transformations at the required viewport matrix;
- accessibility, reduced-motion and RTL-safe structural requirements;
- empty/error/unavailable visual states needed by these surfaces.

### 4.2 Explicitly out of scope

Phase 2A does not include:

- complete Home migration;
- complete About migration;
- complete Contact migration;
- mass import of the full catalogue;
- final discovery/search/filter backend implementation;
- final pricing persistence/synchronization implementation;
- inquiry/quotation persistence implementation;
- Arabic content translation or multilingual routing implementation;
- client-role hardening;
- Hostinger, production DNS, production database or deployment work;
- MedicaShop installation or purchase;
- Elementor Pro Theme Builder;
- WPML as a foundation prerequisite;
- ElementsKit or Skyboot;
- consumer cart, checkout, account, payment, shipping, rating, review, sale or stock-urgency UX.

Home, About and Contact remain compatibility references so the Phase 2A token and shell contracts can support their later Elementor Free migration without redesigning the global system again.

## 5. Design principles

### 5.1 Rosa-first continuity

The WordPress site must be immediately recognizable as the same Rosa product. Migration is not permission for an unrelated medical-store redesign.

### 5.2 Procurement evidence before retail promotion

Product identity, family, exact configuration, SKU/catalogue code, attributes and reference documents outrank price, urgency or promotional treatment.

### 5.3 Dense but legible

The catalogue should preserve the current site's high-information rhythm. Standard desktop widths should generally support four to five readable cards per row when the minimum card width and real content permit it.

Density may never be achieved by shrinking metadata below comfortable readability or by collapsing exact reference information into ambiguous icons.

### 5.4 Shared dynamic templates over duplication

Header, footer, archive, cards and Product Detail are shared protected structures. Product data changes once in WooCommerce and flows through every consuming surface.

### 5.5 Responsive transformation, not desktop stacking

Mobile/tablet layouts are purpose-designed transformations. Desktop controls must not simply stack into an unnecessarily tall page.

### 5.6 Bounded large-screen rails

At 1920 and 2560 widths, functional content stops growing after a useful maximum. Extra viewport width becomes outer whitespace or full-bleed background, not stretched cards, search fields or unreadably long lines.

### 5.7 Accessibility and RTL by construction

Semantic controls, keyboard paths, visible focus, logical properties and direction-safe component geometry are design inputs, not later polish.

## 6. Architecture and ownership contract

The approved baseline remains:

- WordPress;
- Hello Elementor parent theme;
- minimal `rosa-medical-child`;
- Elementor Free;
- WooCommerce;
- WordPress Media Library;
- `rosa-medical-core`;
- protected shared PHP/theme/plugin templates.

Responsibilities are locked as follows.

### 6.1 `rosa-medical-child`

Owns presentation and shared visual structure:

- production token layer;
- global shell;
- header/footer markup;
- responsive visual contracts;
- shared presentational components;
- WooCommerce template presentation where appropriate;
- focus/motion/RTL visual primitives.

The theme must not become the owner of pricing rules, discovery algorithms, quote persistence or catalogue-domain logic.

### 6.2 WooCommerce

Owns structured catalogue data:

- products;
- categories/families;
- real attributes;
- exact variations/configurations;
- SKUs/catalogue codes;
- product/variation images;
- publish state;
- WooCommerce-compatible price projections.

### 6.3 `rosa-medical-core`

Owns Rosa business semantics:

- exact configuration projection;
- code-group derivation;
- pricing inheritance/source-of-truth fields and later WooCommerce synchronization;
- discovery/search/filter semantics;
- catalogue-PDF relationships;
- inquiry/quotation behavior;
- centralized business settings;
- custom persistence/admin behavior required by Rosa.

### 6.4 Elementor Free

Owns only approved ordinary editable editorial content, principally Home, About, Contact and later approved reusable marketing sections.

Elementor Free must not be used to manually duplicate Product Detail pages, archive cards, global shell structure or business logic.

### 6.5 Existing foundation repairs are protected

Phase 2A must preserve:

- WP-CLI/web-process UID/GID repair in the disposable environment;
- fail-fast foundation reporting;
- source-corrected Stevens fixture interpretation;
- Rosa Product Detail `template_include` ordering that wins after Elementor Free;
- WooCommerce local Coming Soon interception protection;
- exactly one appropriate `<main>` landmark;
- real public rendered-product verification.

Any later replacement of these mechanisms requires equivalent or stronger evidence; Phase 2A must not casually undo them.

## 7. Rosa visual token contract

The current custom Rosa token system is the baseline. The WordPress prototype values are transitional and are superseded where they conflict with this section.

### 7.1 Color roles

Retain these exact source colors:

- Rosa red / primary action: `#e00815`
- Rosa red dark / active-hover emphasis: `#b9000b`
- Ink: `#191917`
- Soft ink: `#2d2d2a`
- Warm white: `#f9f7f2`
- Paper: `#ffffff`
- Mist / quiet surface: `#f1f1ee`
- Steel / muted text: `#646b70`
- Border: `#d7d7d1`
- Success: `#1f6b45`
- Success surface: `#e9f5ed`
- Warning: `#9a5b00`
- Warning surface: `#fff5df`
- Danger surface: `#fff0f1`

Do not introduce pharmacy green, generic healthcare blue, gradient-heavy branding or unrelated accent palettes.

### 7.2 Focus system

The prototype blue focus token is not part of the final visual identity.

The Phase 2A focus contract is:

- `3px` visible outline;
- `3px` outline offset;
- use high-contrast ink on light/paper/warm surfaces;
- use white on dark/red surfaces;
- selected-state styling and focus styling remain visually distinct;
- no component may remove focus without replacing it with an equally visible state.

This avoids adding a second brand accent while maintaining contrast across the Rosa palette.

### 7.3 Typography families

- **Inter:** body copy, navigation, controls, metadata, filters, product cards, SKU/reference data, buttons and dense interface text.
- **Lora:** restrained editorial/display roles such as major page/section headings where the current Rosa character benefits from it.
- **Tajawal:** Arabic interface/body/display equivalent with existing Arabic fallbacks.

WooCommerce and Elementor defaults must not select arbitrary fonts inside shared Rosa surfaces.

### 7.4 Typography scale

Retain the current responsive scale as the starting contract:

- display/page title: `clamp(2.45rem, 4.2vw, 3.85rem)`, line-height approximately `1.08–1.12`;
- section title: `clamp(2rem, 3.1vw, 2.75rem)`, line-height approximately `1.1–1.2`;
- body: `clamp(1rem, 0.3vw + 0.94rem, 1.06rem)`, line-height approximately `1.55`;
- narrow-mobile display: `clamp(2.25rem, 10.7vw, 2.9rem)`;
- narrow-mobile section title: `clamp(1.9rem, 8.5vw, 2.4rem)`.

Phase 2A adds these component roles:

- Product Detail title: visually below the page-display maximum but clearly above configuration headings; target `clamp(2rem, 3vw, 3rem)`.
- Product card title: `0.95–1.05rem`, line-height `1.25–1.35`, with a maximum of three lines before truncation.
- Interface/metadata: never below `0.8125rem` for required product evidence such as SKU/configuration count; muted supporting text may be smaller only when it is non-essential.
- SKU/catalogue code uses Inter with tabular numerals where available and enough weight/contrast to scan reliably.

### 7.5 Content rails

Retain:

- reading rail: `46rem`;
- standard rail: `72rem`;
- wide rail: `80rem`.

Add one Phase 2A-specific maximum:

- archive workspace rail: up to `90rem` only for the combined filter sidebar + dense results grid.

Editorial copy does not automatically expand to `90rem`.

### 7.6 Gutters

Use the current public-density gutter contract:

- default: `clamp(1.1rem, 3.25vw, 4rem)`;
- narrow mobile: `clamp(1rem, 4.8vw, 1.35rem)`.

Header, footer and archive alignment should resolve against the same logical gutters/rails at each breakpoint.

### 7.7 Spacing

Retain the base spacing scale:

`0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem`.

Retain public-density section roles:

- header block: `clamp(4.25rem, 6.2vh, 4.75rem)`;
- normal section block: `clamp(3.25rem, 6.2vw, 5.75rem)`;
- compact section block: `clamp(2.5rem, 4.5vw, 4.25rem)`;
- intro block: `clamp(2.5rem, 5vw, 4.75rem)`;
- card gap: `clamp(1rem, 2vw, 1.5rem)`;
- control block target: `3rem`.

Short desktop/laptop viewports at or below approximately `800px` height must retain the existing density reductions rather than allowing large media/section dimensions to consume the screen.

### 7.8 Geometry and elevation

Retain:

- control radius: `0.25rem`;
- surface radius: `0.125rem`;
- lifted shadow: `0 1.25rem 3.5rem rgb(25 25 23 / 0.08)`.

Product cards should rely primarily on fine borders and hierarchy, not large rounded containers or floating shadows.

### 7.9 Motion

Retain source durations/easing:

- micro: `160ms`;
- component: `280ms`;
- section: `580ms`;
- hero: `960ms`;
- ease: `cubic-bezier(0.22, 1, 0.36, 1)`;
- emphasized ease: `cubic-bezier(0.16, 1, 0.3, 1)`.

Products/archive/Product Detail interactions should normally stay within `160–280ms`. Long editorial entrance motion does not belong on core catalogue controls.

`prefers-reduced-motion` removes non-essential transitions/transforms without reducing functionality.

### 7.10 Token ownership

The canonical Phase 2A tokens live in the child-theme CSS layer. Elementor Global Colors/Fonts may expose only the approved editorial subset so Home/About/Contact can visually match the protected system without becoming the source of truth.

## 8. Global shell contract

### 8.1 Header

Desktop header:

- paper/white surface;
- sticky;
- approximately `4.25–4.75rem` tall;
- ROSA logo at logical inline start using the approved public brand treatment;
- exact primary navigation: Home, About Us, Products, Inquiry, Contact Us;
- future language control slot at logical inline end;
- primary `Request a quote` action at logical inline end;
- active route communicated by underline/weight plus color, not color alone;
- Products remains active for archive and Product Detail contexts;
- subtle scrolled shadow/blur is allowed, but dramatic glass treatment is not.

The primary header must not contain cart, account, shipping, opening hours, sale messaging or payment clutter.

### 8.2 Header breakpoint behavior

Full navigation remains only while all labels, logo, language slot and quote action fit without crowding.

The design target is to switch to the drawer pattern around the existing `70rem` range rather than truncating navigation labels. Exact implementation breakpoint may be tuned by real-content fit, but acceptance is based on no crowding and stable target sizes, not on preserving a specific framework breakpoint.

### 8.3 Mobile/tablet drawer

Drawer requirements:

- opens from logical inline end;
- bounded width on larger phones/tablets rather than full desktop-width takeover;
- primary navigation first;
- language control second when real multilingual routing exists;
- primary quote action last/prominent;
- focus moves into drawer and returns to trigger on close;
- Escape closes;
- background is inert/unavailable to interaction;
- body scrolling is locked while open;
- target sizes are at least 44px and preferably 48px;
- RTL reverses directional geometry through logical properties rather than duplicated markup.

The header itself on narrow mobile shows logo + menu trigger. The quote action moves into the drawer rather than compressing the top bar.

### 8.4 Language control

Reserve the structural slot now. Do not render a decorative nonfunctional toggle. When implemented later, the control must accommodate `العربية` and direction changes without restructuring the entire shell.

### 8.5 Main landmark

The theme shell owns exactly one page-level `<main>` landmark and the skip-link target. Product/archive templates render interior containers, never nested `<main>` elements.

## 9. Footer and contact/procurement closure

The production footer remains corporate/procurement-led.

### 9.1 Desktop footer

Use a near-black footer with restrained Rosa-red headings/accents and four logical groups:

1. ROSA identity, concise procurement positioning and `Request a quote` action;
2. Products/family links plus Catalogues;
3. Company/About/Procurement support/Contact;
4. Inquiry/Search/Privacy/Terms support links.

A compact bottom row carries copyright/location context and later language status where appropriate.

### 9.2 Centralized data

Phone, email, address, WhatsApp and reusable CTA values come from `BusinessSettings` or its approved successor. They are not duplicated as literal values across PHP templates or Elementor content.

### 9.3 Mobile footer

Collapse to one column with clear group headings. Do not use accordions unless future link growth proves necessary. Maintain compact rhythm while giving links at least a 44px practical hit area through padding.

### 9.4 Explicit footer exclusions

No pharmacy-service taxonomy, app-store badges, consumer account links, payment logos, shipping claims, opening-hours promotion, newsletter pressure, fake testimonials or unsupported certifications.

## 10. Products archive contract

`/products` is the single authoritative discovery workspace.

### 10.1 Page anatomy

Order:

1. global header;
2. restrained Rosa page intro/hero compatible with the current site;
3. catalogue heading block with procurement-oriented support copy;
4. **full-width search field spanning the archive rail**;
5. discovery workspace containing filters + results;
6. complete-row reveal controls;
7. contextual family catalogue/PDF region;
8. direct inquiry/support closure;
9. global footer.

The search field is intentionally placed above both filter and results columns because it applies to the complete result set and must remain obvious on mobile before filter disclosure.

### 10.2 Search visual contract

Search must provide:

- persistent visible label or accessible label with unambiguous placeholder;
- a single primary search input, not duplicate desktop/mobile engines;
- clear control height around `3rem`;
- space for future active-state/result feedback without layout shift;
- no marketplace-style autosuggest advertising.

Later behavior must intentionally support product name, English/localized name, family, product code/SKU and relevant configuration attributes as already approved.

### 10.3 Desktop filter/result workspace

At widths where a permanent sidebar leaves at least three readable result columns, use:

- sticky filter sidebar approximately `14.5–17rem`;
- main results region with count/context, sort and grid/list controls;
- dense product grid.

The persistent-sidebar mode is expected at standard desktop widths, approximately from the `70rem` range upward, subject to real-content fit.

Below that, use the compact filter disclosure/sheet rather than squeezing both a narrow sidebar and unreadable cards.

### 10.4 Facet visual readiness

Phase 2A must reserve and style the later approved controls:

- Family: single-select;
- Size: multi-select;
- Direction: multi-select;
- Variant/type: multi-select;
- Code Group: multi-select;
- Clear filters.

Visual behavior:

- native semantic radio/checkbox semantics remain available;
- selected controls use Rosa-red border/fill/marker plus text emphasis;
- disabled/unavailable states remain readable;
- selected zero-count values remain removable;
- advanced facets use one-open-at-a-time disclosure;
- collapsed facets summarize selection (`N selected` or concise selected value);
- long lists have bounded internal height and later within-facet search only when needed;
- counts align consistently and do not dominate labels.

### 10.5 Result header

Include:

- contextual result count/status;
- deterministic sort control;
- grid/list controls where implemented.

Do not expose unsupported price sorting or generic WooCommerce retail ordering until the actual data/behavior contract supports it.

### 10.6 Dense grid contract

The grid is responsive by minimum readable card width rather than one hard column number.

Design target:

- preferred card inline size: approximately `13rem`;
- absolute minimum for the standard card: approximately `12rem`, subject to real-title/SKU testing;
- 1366/1440 with persistent sidebar: generally four to five cards;
- five cards at 1440 is an explicit valid target when real content passes readability/focus checks;
- 1024 without a permanent sidebar: generally three to four cards;
- 768: two to three cards;
- 390/430: two compact cards if real titles/SKUs remain readable, otherwise one-column/list fallback.

Do not hard-code five columns across all wide screens. Do not keep adding columns indefinitely at 1920/2560.

### 10.7 Complete-row progressive reveal

Reveal logic remains row-aware.

- initial display is approximately two complete rows for the current responsive column count;
- `See more products` reveals the next complete row group;
- `See all N products` remains available when more results remain;
- artificial partial rows must not be left before the reveal control;
- the genuine final result set may naturally end in a partial row;
- search/filter/sort changes reset to the normal initial disclosure;
- reduced-motion users receive immediate reveal;
- reveal must not cause an unexpected scroll jump.

The previous fixed 12/8 batch concept is subordinate to this later complete-row contract.

### 10.8 Mobile filter flow

At mobile/tablet widths:

- page intro then search remain directly visible;
- one explicit Filters trigger exposes a sheet/drawer/disclosure;
- trigger communicates selected-filter count when nonzero;
- Clear filters remains reachable;
- applied selections can appear as compact removable summaries/chips;
- the filter UI must not consume the entire page before users see results.

## 11. Product card contract

The card is a professional catalogue summary, not a miniature retail store.

### 11.1 Content order

1. contained product media;
2. family signal;
3. product title;
4. reference/configuration evidence;
5. effective price state;
6. `View details` action.

### 11.2 Media

- paper/white contained media area;
- default square `1:1` media box for predictable dense grid rhythm;
- `object-fit: contain`;
- product is never cropped merely to fill the box;
- image can use bounded internal padding so long instruments remain recognizable;
- missing-image state uses a restrained Rosa placeholder, not a broken image or unrelated stock photo.

### 11.3 Family and title

- family appears as a small uppercase/compact Rosa-red signal;
- title remains the primary text within the card;
- title may clamp to three lines on the standard grid;
- truncation must not remove the ability to distinguish common instrument names; list view may expose the full title.

### 11.4 SKU/configuration evidence

Rules must remain truthful:

- one exact configuration: show the exact SKU/catalogue code;
- multiple configurations: show `N configurations` plus an authoritative product-level code/code-group reference only when such a value truly exists;
- do not arbitrarily select one variation SKU and imply it identifies the whole product;
- required SKU/reference text must not be rendered as low-contrast microcopy.

### 11.5 Price states

The card supports:

- all configurations unpriced -> `Price on request`;
- one effective price across all configurations -> exact `SAR X.XX`;
- multiple numeric effective prices -> `From SAR X.XX`;
- mixed numeric + unpriced configurations -> compact `From SAR X.XX · some options on request` or approved equivalent.

Price remains visually subordinate to title/reference evidence.

Zero is a real numeric price and must never render as Price on Request.

### 11.6 Action

`View details` is the standard card action.

Do not add Quick Add / Add to Cart. `Add to Inquiry` belongs on Product Detail after exact configuration identity is known.

### 11.7 Interaction

Hover/focus may:

- strengthen border contrast;
- shift an arrow/underline minimally;
- apply a restrained media-scale change within `160–280ms`.

Hover may not change layout dimensions. Focus receives the same informational prominence without requiring hover.

### 11.8 Explicitly rejected card patterns

- sale/bestseller badges;
- ratings/stars;
- crossed-out pricing;
- quick cart;
- wishlist;
- large rounded retail tiles;
- promotional ribbons;
- giant price typography;
- text-only ultra-dense cards without product silhouette/media.

## 12. Product Detail contract

Product Detail is an exact configuration/procurement decision surface.

### 12.1 Desktop anatomy

Order:

1. breadcrumb/family context;
2. two-column media + summary region;
3. identity block;
4. configuration decision block;
5. effective price + inquiry controls;
6. family catalogue-PDF module;
7. specifications/details;
8. procurement/supporting information;
9. focused inquiry closure;
10. footer.

No related-products/recommendation rail is included.

### 12.2 Desktop grid

Use approximately the existing `1.1fr / 0.9fr` media/summary relationship.

The split is permitted only when the summary retains a practical minimum width around `28rem`. Otherwise the layout stacks.

Media has a maximum useful size; it does not keep scaling on 1920/2560 displays.

### 12.3 Gallery

- primary image remains contained on paper/white;
- optional thumbnails use a predictable rail/grid;
- thumbnail selection is keyboard-operable and exposes active state semantically;
- no thumbnail may rely only on a red border to communicate selection;
- long instruments remain fully visible unless the source image itself is already tightly cropped;
- missing images degrade to the approved placeholder without collapsing layout.

### 12.4 Identity block

Hierarchy:

- family/breadcrumb context;
- full product title;
- product-level reference where authoritative;
- concise description.

The title must remain fully visible on mobile and may not be obscured by sticky UI.

### 12.5 Configuration decision block

Label: `Select configuration` or localized equivalent.

Single-configuration product:

- show one explicit configuration summary;
- do not render a redundant selector.

Multiple-configuration product:

- render explicit radio/list rows or an equivalently transparent semantic control;
- each option exposes the minimum distinguishing attributes and SKU needed to understand the choice;
- only real WooCommerce variations appear;
- impossible Size × Direction × Variant combinations never appear;
- selected state uses native semantics + red marker/border + explicit state, not color alone.

After selection, keep an active configuration summary visible containing:

- SKU;
- Size when present;
- Direction when present;
- Variant/type when present;
- any other later-approved variation-defining attribute.

Changing configuration updates selected identity and effective price as one coherent state change.

### 12.6 Price/inquiry block

- label price neutrally as `Effective price` or approved localized equivalent;
- numeric and Price-on-Request states occupy the same structural role;
- price is clear but smaller/less dominant than title, configuration and SKU;
- quantity is a bounded, labeled control with validation;
- `Add to Inquiry` is the dominant action;
- the action is unavailable until an exact valid configuration is resolved when a choice is required;
- requirement notes may follow the primary action without displacing the core decision block;
- successful add confirmation names the selected product/configuration/SKU and offers a path to Inquiry.

### 12.7 Catalogue PDF module

Place a compact, visible family catalogue module adjacent to the configuration/procurement region rather than only at the distant page end.

It must:

- name the family;
- identify the artifact as Catalogue PDF / Reference catalogue;
- resolve dynamically from category/family attachment metadata;
- use descriptive link text;
- communicate new-tab behavior when applicable;
- disappear gracefully or show a truthful unavailable state if no authoritative PDF exists.

### 12.8 Specifications and procurement context

Supporting specifications remain available on mobile and desktop. Do not hide substantive product evidence simply to shorten the page.

Procurement support copy remains concise and professional. Do not insert shipping, stock urgency, payment methods, ratings, account prompts or consumer guarantee badges.

### 12.9 Mobile sticky inquiry action

A compact sticky bottom action is allowed after a valid configuration exists.

Requirements:

- shows restrained effective price state + `Add to Inquiry`;
- reserves document bottom padding equal to rendered bar height plus safe-area inset;
- does not cover title, configuration controls, notices, focused elements, specifications or footer;
- quantity normally remains in the main decision block unless accessibility/usability testing proves it fits in the bar;
- disappears or changes state correctly when configuration is invalid/unavailable;
- does not create a second conflicting Add-to-Inquiry state machine.

This explicitly corrects the current custom mobile overlap regression.

## 13. Catalogue PDF placement contract

PDFs are authoritative procurement/reference material.

### 13.1 Active family context

When one family is active in Products, show a dedicated catalogue panel near the result/reveal region containing:

- family name;
- `Catalogue PDF` / `Reference catalogue` label;
- verified document metadata when available;
- explicit `Open catalogue` action;
- optional separate download action only when it provides real value and does not duplicate the same control ambiguously.

### 13.2 All-products context

Provide a compact family catalogue region after the initial result/reveal experience rather than inserting promotional PDF cards every few rows.

On mobile this can become a bounded horizontal rail or compact vertical list.

### 13.3 Data relationship

One authoritative family/category -> Media Library attachment relationship is resolved dynamically by Rosa-owned logic. URLs are not copied into multiple Elementor widgets/templates.

Replacing the attachment in Admin updates all consuming public surfaces.

## 14. Responsive acceptance matrix

The following transformations are normative.

### 14.1 390px

- compact `4.25rem`-class header with logo + menu;
- quote CTA inside drawer;
- intro -> search -> filter trigger -> results;
- two compact card columns only if real title/SKU content passes readability; otherwise one-column/list fallback;
- Product Detail stacked;
- gallery height bounded relative to viewport;
- full title visible before configuration;
- configuration rows full-width/tap-friendly;
- catalogue link near decision block;
- sticky inquiry bar reserves safe space;
- footer one column.

### 14.2 430px

Same structural mode as 390 with modestly greater card/text width. Do not introduce a third column or desktop navigation prematurely.

### 14.3 768px

- drawer navigation;
- filter disclosure/contained panel rather than permanent sidebar;
- two or three result columns according to minimum card width;
- Product Detail primarily stacked, with gallery/summary internal layout allowed to use wider subgrids;
- footer may become two columns when coherent.

### 14.4 1024px

- short-height behavior is explicitly checked at 1024×768;
- navigation may remain drawer-based near the current threshold;
- filters remain compact unless a sidebar leaves at least three genuinely readable card columns;
- normal target is three to four result columns without permanent sidebar;
- Product Detail may enter split mode only if summary retains approximately `28rem` minimum width;
- hero/media heights stay restrained.

### 14.5 1366px

- full navigation;
- persistent `14.5–17rem` sticky filter sidebar;
- generally four to five cards depending on actual content/minimum width;
- approximately two complete initial rows before reveal;
- two-column Product Detail;
- 1366×768 short-laptop density is a required acceptance case.

### 14.6 1440px

- full shell and persistent archive sidebar;
- five-card density is a valid target and should be achieved when the real-card minimum width test passes;
- Product Detail two-column layout exposes configuration/inquiry controls without excessive first-screen travel.

### 14.7 1920px

- archive centered on bounded `80–90rem` functional rail;
- do not automatically add columns after target density is reached;
- increase outer whitespace rather than control width;
- Product Detail media remains capped to a useful size.

### 14.8 2560px

- same bounded functional rail principle as 1920;
- no automatic typography scaling simply because viewport is wider;
- background surfaces may extend full bleed while functional content remains bounded.

### 14.9 Cross-matrix requirements

At every width:

- no horizontal page overflow;
- no clipped controls or titles;
- no fixed/sticky overlap;
- complete-row reveal remains correct;
- touch/focus targets remain usable;
- Arabic/RTL geometry remains structurally feasible;
- product media remains contained;
- footer/header align to the intended rail.

## 15. Accessibility and RTL contract

### 15.1 Landmarks and headings

- exactly one page-level `<main>`;
- one working skip link target;
- one page-level `h1`;
- logical descending heading order;
- header/footer/nav landmarks have clear accessible names where multiple navs exist.

### 15.2 Keyboard/focus

- every interactive catalogue/configuration control is keyboard-operable;
- focus-visible state is always obvious;
- drawer focus enters/returns correctly;
- Escape closes modal/drawer contexts;
- gallery thumbnail/configuration selection exposes active/selected semantics;
- browser Back/Forward later restores understandable URL-backed discovery state without trapping focus.

### 15.3 Touch/reflow

- practical target size at least 44px, core controls around 48px;
- verify at 200% zoom/reflow;
- verify text-spacing overrides;
- no sticky action covers the focused element.

### 15.4 Announcements

Future dynamic result counts should use restrained/debounced polite announcements rather than narrating every checkbox count change.

Add-to-Inquiry confirmation must communicate selected SKU/configuration in text.

### 15.5 RTL

Use logical properties for:

- padding/margins;
- inline separators;
- drawer entry side;
- thumbnail rails;
- filter alignment;
- chevrons/directional icons;
- sticky-bar spacing.

DOM order should remain semantically correct in both directions. Do not create separate duplicated RTL templates.

## 16. Public content contract

### 16.1 Navigation and primary actions

Locked English labels:

- Home
- About Us
- Products
- Inquiry
- Contact Us
- Request a quote

Product actions:

- View details
- Select configuration
- Effective price
- Price on request
- Add to Inquiry
- Open catalogue

Exact later Arabic strings belong to the multilingual phase but theme/plugin strings must be translation-ready now.

### 16.2 Positioning

Maintain professional procurement positioning rather than generic healthcare retail copy. Existing meaningful language around structured product information, catalogue references, quotation support and dependable sourcing can be reused.

### 16.3 Unverified content

Placeholder media labels or unverified claims about manufacturing, certification, ownership, awards, export reach, legal status or clinical outcomes remain explicitly non-publishable until client evidence is supplied.

Phase 2A must not convert placeholders into polished factual claims merely because the visual layout has space for them.

## 17. Required visual/system states

Shared components must have designed states for:

### 17.1 Product image missing

Use a neutral Rosa placeholder with product identity intact; do not use unrelated stock photography.

### 17.2 Catalogue PDF missing

Do not render a broken link. Either omit the module when no document is expected or show a truthful unavailable state when the context requires users to know the reference is not present.

### 17.3 No valid configurations

Product Detail must not expose Add to Inquiry as though a valid exact line exists. Show a clear unavailable/procurement-contact state.

### 17.4 Price states

Distinguish:

- null -> Price on request;
- zero -> numeric zero;
- exact numeric;
- from-price;
- mixed numeric/unpriced configurations.

### 17.5 Search/filter no results

Show active-filter/search context, a clear reset action and a direct path back to all products. Do not show generic WooCommerce empty-shop messaging.

### 17.6 Loading/future discovery failure

When the later discovery endpoint is asynchronous, loading and error states must preserve layout stability and selected controls. A failed request must not silently clear user-selected filters.

### 17.7 Product unavailable

Return a professional unavailable/not-found state inside the shared Rosa shell. Do not expose raw WooCommerce template text or broken PHP output.

### 17.8 Inquiry unavailable/invalid

If Add to Inquiry cannot complete, keep selected configuration visible, retain quantity/notes where safe and provide a clear retry/support path. Do not redirect users into WooCommerce checkout.

## 18. MedicaShop composition boundary

Allowed borrowed ideas:

- strong section grouping;
- clear archive sidebar/results relationship;
- predictable repeated card rhythm;
- media/summary Product Detail split;
- explicit end-of-page conversion closure;
- strong document/reference cards;
- asymmetric editorial composition for later editorial-page work.

Every borrowed idea is translated into Rosa's palette, density, typography, procurement hierarchy and dynamic architecture.

Rejected baggage:

- pharmacy green;
- sale/bestseller/discount zones;
- stars/ratings;
- Add to Cart / Checkout / My Account;
- shipping/payment language;
- consumer urgency;
- newsletter pressure;
- opening hours retail treatment;
- generic pharmacy services;
- payment/provider logos;
- Elementor Pro-dependent shared templates.

## 19. Verification strategy for later implementation

This section defines evidence requirements, not an implementation task list.

Phase 2A implementation must eventually produce fresh evidence for:

- source/token contracts where practical;
- PHP syntax/static checks for changed WordPress code;
- domain tests for any business logic touched by visual integration;
- actual WooCommerce archive and Product Detail rendering;
- anonymous/public Product Detail routing, including no Coming Soon interception;
- exact Stevens fixture rendering using `04-0901` / `04-0911`;
- one-main landmark and skip-link behavior;
- header/drawer keyboard behavior;
- product-card states across real long titles/SKUs;
- configuration selected-state behavior;
- numeric, zero and Price-on-Request price states when the pricing layer exists;
- catalogue PDF state/link behavior;
- complete-row reveal behavior when discovery is implemented;
- mobile sticky inquiry non-overlap;
- reduced-motion behavior;
- RTL structural rendering;
- screenshot/visual review at 390, 430, 768, 1024, 1366, 1440, 1920 and 2560;
- 1366×768 and 1024×768 short-height cases;
- 200% zoom/reflow and text-spacing checks;
- independent review against this approved specification.

Repository-wide verification failures unrelated to Phase 2A must be reported accurately rather than attributed to the design work. The current known `products-discovery-workspace.tsx` lint failures are pre-existing and are not caused by the visual-exploration documentation.

## 20. Acceptance criteria

Phase 2A visual foundation is acceptable only when all applicable implemented surfaces satisfy the following:

1. The site is immediately recognizable as Rosa, not as a recolored pharmacy/WooCommerce theme.
2. The free-first stack remains intact; no MedicaShop, Elementor Pro, WPML prerequisite, ElementsKit or Skyboot is introduced.
3. Header/footer/archive/card/Product Detail are shared protected structures rather than duplicated Elementor pages.
4. Exact five-item primary navigation and procurement-led CTAs remain intact.
5. Source Rosa colors, typography character, rails, geometry and density are preserved or deliberately adapted according to this spec.
6. Standard desktop archive supports approximately four to five readable cards where minimum width permits; five at 1440 is a valid target, not a universal hard-coded count.
7. Product cards prioritize identity/reference/configuration evidence over price/promotion.
8. Product images remain contained and are not destructively cropped to fill cards.
9. Product Detail makes exact configuration selection, SKU/attributes, effective price, quantity and Add to Inquiry one coherent decision flow.
10. No invalid Cartesian product configuration is presented.
11. Numeric SAR, zero and Price-on-Request states are structurally supported without retail-style price dominance.
12. Catalogue PDFs are first-class contextual procurement references and resolve dynamically.
13. Mobile Product Detail has no sticky-action overlap and preserves full title/configuration/specification access.
14. Large screens remain bounded rather than stretched.
15. Required viewport matrix has no horizontal overflow, clipped controls or unreadable metadata.
16. Exactly one main landmark exists per page.
17. Keyboard, focus, touch-target, reduced-motion, zoom/reflow and RTL requirements are satisfied.
18. Existing foundation hook-ordering, Coming Soon, fixture and landmark repairs remain protected.
19. No placeholder/unverified claims are silently promoted to factual production content.
20. Hostinger and production infrastructure remain untouched until separately authorized.

## 21. Risks and regression traps

Implementation must actively guard against:

- copying MedicaShop hierarchy rather than merely useful composition;
- generic WooCommerce loop markup making price/cart the scan priority;
- reducing archive density so catalogue browsing becomes slow;
- achieving density through unreadable metadata;
- hard-coding five columns and breaking complete-row reveal;
- cropping long surgical instruments with `cover`;
- hiding SKU/configuration evidence;
- using variation dropdowns without a visible selected SKU/attribute summary;
- making price larger than configuration/product identity;
- restoring related products;
- reintroducing cart/checkout/account/shipping/payment/rating language;
- duplicating PDF/contact data in Elementor and templates;
- scattering tokens across one-off CSS and widget settings;
- turning product templates into client-editable duplicates;
- relying on Elementor Pro Theme Builder;
- losing the template priority repair;
- allowing WooCommerce Coming Soon to intercept public pages;
- returning to nested `<main>` landmarks;
- testing only logged-in/admin output;
- designing only at 1440px;
- stretching functional content at 1920/2560;
- making mobile excessively tall by stacking desktop composition unchanged;
- allowing sticky UI to cover title, notices, focused controls or footer;
- forgetting RTL until after component geometry is fixed;
- treating this specification as an implementation plan.

## 22. Approval gate and next step

This document is the formal Phase 2A design specification.

No production Phase 2A code should be written from it until the user explicitly approves the specification.

After approval, the only next Superpowers workflow step is to write a separate detailed implementation plan. That plan must define exact files, TDD sequence, isolation strategy, verification commands/evidence and independent-review gates before implementation begins.
