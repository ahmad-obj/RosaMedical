# Rosa Medical WordPress — Client-Preview MedicaShop Recreation Design

Date: 2026-08-30
Status: proposed for user review
Branch: `docs/client-preview-medicashop-recreation-design`
Base: `wordpress/medicashop-migration` at `6744207b97507f07761b30dd2d9ff505bff82fa1`

## 1. Purpose

The client has clarified that the immediate goal is not a custom Rosa redesign. The client wants the selected template to remain visually recognizable and wants only a controlled first-pass branding/content adaptation before giving further design instructions.

The client's current direction is:

- do not change the template structure yet;
- replace logo/name/address/phone/email;
- replace banners;
- provide a video preview;
- make later template changes only after the client reviews the preview;
- provide an Arabic version as well.

This specification therefore creates a new **client-preview lane** that is intentionally more conservative than the completed Phase 2A Balanced Rosa implementation.

The completed advanced Phase 2A work remains preserved on:

`wordpress/phase-2a-balanced-visual-foundation`

Known completed HEAD supplied by the user:

`4f7fb7bf721b143c02f140c187e3c41d85b98276`

That branch must not be deleted, rewritten, or merged into this preview lane unless the user later explicitly chooses to reuse parts of it.

## 2. Core Decision

The selected MedicaShop demo will be **recreated from scratch at high visual fidelity** using the approved free WordPress foundation.

We will not purchase, install, import, copy, or depend on the paid MedicaShop Template Kit or Elementor Pro.

The goal is not to clone proprietary implementation files. The goal is to reproduce the publicly visible composition closely enough that the client recognizes the same template while using Rosa-owned implementation and Rosa-appropriate public content.

The first client preview prioritizes:

1. template fidelity;
2. Rosa identity substitutions;
3. removal/rewording of obviously false pharmacy/consumer-retail claims without changing layout;
4. correct English and Arabic/RTL presentation;
5. a clean video-ready result;
6. deferring subjective redesign decisions until the client gives feedback.

## 3. Reference Material Available

Four browser-saved ThemeForest/demo captures were supplied and inspected locally.

### 3.1 Homepage reference

Archive:

`preview.themeforest.net.zip`

Contains the actual saved MedicaShop homepage HTML at:

`fullkit.moxcreative.com/medicashop/template-kit/homepage/index.html`

Observed evidence includes:

- approximately 160 KB of rendered page HTML;
- 23 section elements;
- 122 Elementor elements;
- downloaded Elementor/Elementor Pro/WooCommerce styles and assets;
- template typography dominated by Open Sans;
- existing demo content such as the pharmacy hero, product sections, service strips, promotional blocks, testimonials and footer.

### 3.2 About reference

Archive:

`preview.themeforest.net (1).zip`

Contains:

`fullkit.moxcreative.com/medicashop/template-kit/about-us/index.html`

Observed evidence includes:

- approximately 112 KB of rendered page HTML;
- 19 sections;
- 101 Elementor elements;
- About hero/title;
- large media/content composition;
- opening-hours section;
- service/value blocks;
- testimonial-style closure;
- common header/footer assets.

### 3.3 Contact reference

Archive:

`preview.themeforest.net (2).zip`

Contains:

`fullkit.moxcreative.com/medicashop/template-kit/contact-us/index.html`

Observed evidence includes:

- approximately 89 KB of rendered page HTML;
- 13 sections;
- 68 Elementor elements;
- Contact hero;
- address/phone/email information blocks;
- contact form layout;
- embedded map region;
- common header/footer assets.

### 3.4 Shop/archive reference

Archive:

`preview.themeforest.net (3).zip`

Contains the downloaded shop asset set, including WooCommerce styles, product-card imagery, header/footer assets and medical/shop background assets.

The saved `shop/index.html` itself is only a minimal/no-content stub, so this archive is treated as a **shop visual-asset/style reference**, not as authoritative complete archive markup.

It is still useful for reconstructing the visual language of product cards, image proportions, product-grid density and WooCommerce-facing styling.

### 3.5 Missing reference

A complete saved **Single Product** MedicaShop page is not currently available in the supplied archives.

The first client-preview scope therefore does not attempt to claim pixel-level fidelity for a MedicaShop Single Product page. Existing Rosa Product Detail foundation work remains available separately if needed later.

## 4. Copyright / Reference Boundary

The saved ThemeForest files are internal visual-analysis evidence only.

Do not ship or redistribute:

- MedicaShop source code;
- Elementor Pro code;
- MedicaShop proprietary images;
- MedicaShop proprietary CSS/JS as Rosa production source;
- logos or icons whose license does not permit redistribution.

The implementation must be independently authored using:

- Rosa-owned PHP/CSS/JS;
- WordPress/Hello Elementor/Elementor Free/WooCommerce;
- Rosa-owned or properly licensed imagery;
- Rosa catalogue imagery where suitable;
- newly created banner assets where necessary.

The public result may closely match the visible composition, spacing rhythm and hierarchy, but the codebase must remain Rosa-owned.

## 5. Architecture

The client-preview lane keeps the approved free-first foundation:

- WordPress;
- Hello Elementor parent;
- minimal `rosa-medical-child`;
- Elementor Free;
- WooCommerce;
- WordPress Media Library;
- `rosa-medical-core`;
- protected shared PHP/theme/plugin templates where necessary.

No required dependency on:

- MedicaShop;
- Elementor Pro;
- WPML;
- ElementsKit;
- Skyboot;
- another paid template dependency.

### 5.1 Presentation ownership

For the first preview:

- Home, About and Contact may use Elementor Free for editable editorial composition where that helps reproduce the template accurately;
- the child theme owns the global header/footer, language switcher, RTL-safe shell and any layout primitives that Elementor Free cannot reliably provide;
- WooCommerce owns product/shop data;
- `rosa-medical-core` continues to own centralized Rosa business settings and protected business semantics.

### 5.2 Branch isolation

Implementation must occur on a new branch created from the conservative `wordpress/medicashop-migration` foundation, not from the completed Phase 2A visual branch.

Recommended implementation branch:

`wordpress/client-preview-medicashop-recreation`

This prevents the advanced Phase 2A redesign from leaking into the client's first conservative preview.

## 6. Visual Fidelity Rule

For this preview, "do not change the template" means:

- preserve the recognizable page composition;
- preserve section order unless a section is technically impossible to reproduce without paid dependencies, in which case recreate the same visual role with free/native components;
- preserve the general vertical rhythm;
- preserve card and banner placement;
- preserve the header/footer silhouette;
- preserve the template's overall color treatment unless a local change is necessary for Rosa logo legibility or accessibility;
- preserve the relative prominence of headings, imagery and calls to action;
- preserve the mobile/tablet structural behavior as closely as practical.

Do **not** apply the Phase 2A custom Rosa redesign, denser catalogue workspace, bespoke product-card architecture or other visual reinterpretations to this first preview.

## 7. Content Adaptation Rule

The client's instruction names logo, company information and banners explicitly. However, leaving obviously false pharmacy/retail language would make the preview appear unfinished and potentially misleading.

Therefore the approved content policy is:

### 7.1 Must replace

- MedicaShop logo -> ROSA logo;
- MedicaShop/site name -> Rosa naming;
- demo address -> verified Rosa address;
- demo phone -> verified Rosa phone;
- demo email -> verified Rosa email;
- demo banner imagery -> Rosa surgical/medical-instrument imagery;
- obviously false pharmacy claims -> same-length/same-role Rosa procurement/instrument copy;
- fake shipping/returns/payment claims -> Rosa-appropriate service/procurement assurances occupying the same visual slots;
- demo pharmacy product names/images -> Rosa product/family/sample-instrument content where product blocks are visible in the client video;
- retail "Add to cart" semantics -> inquiry/quotation wording if an action must remain in the same visual position.

### 7.2 Preserve structurally

- section positions;
- count of major blocks where practical;
- hero/banner layout;
- card geometry;
- icon/text strip geometry;
- testimonial/value-block geometry;
- About page content/media alternation;
- Contact page information/form/map composition;
- footer grouping;
- Shop visual rhythm.

### 7.3 Must not fabricate

Do not invent:

- certifications;
- testimonials attributed to real customers;
- shipping guarantees;
- refund policies;
- payment methods;
- business addresses;
- phone numbers;
- email addresses;
- operating hours;
- product specifications.

If verified content is unavailable for a slot, use neutral non-factual copy or omit the unsupported claim while preserving the layout shell.

## 8. Homepage Design

The homepage should visually track the saved MedicaShop homepage.

Expected recreation areas:

1. shared top header/navigation;
2. hero/banner region;
3. primary value/service strip;
4. product/promotional cards in the same composition slots;
5. large image/content feature block;
6. additional product/service grid sections;
7. service/value blocks;
8. testimonial/value closure using non-fabricated Rosa-safe content;
9. shared footer.

The original hero copy such as "Our only priority is to keep you healthy" is not appropriate for Rosa. Replace it with professional surgical-instrument/procurement copy of similar visual length so line breaks and composition remain close to the reference.

The original shipping/returns/payment strip must keep its three-column visual form but use Rosa-safe themes such as procurement support, catalogue availability and international/supply support only where supported by verified Rosa information.

## 9. About Page Design

Recreate the saved About layout closely.

Maintain:

- title/hero treatment;
- primary image/text section;
- opening/business-hours style panel if verified hours exist;
- service/value blocks;
- secondary image/content composition;
- closing social-proof/value section geometry;
- shared header/footer.

Pharmacy wording is replaced with Rosa company/instrument/procurement positioning without changing section geometry.

If operating hours are not verified, the same visual panel may be repurposed to "Procurement support" or another verified company-information block instead of inventing hours.

## 10. Contact Page Design

Recreate the saved Contact page composition closely:

- title/hero;
- three primary contact-information blocks;
- contact form;
- map/location region;
- supporting copy;
- shared footer.

Phone/email/address are loaded from centralized Rosa business settings rather than duplicated manually.

If a verified precise map location is unavailable, do not invent coordinates. Use the verified address text and either a safe generic map/link treatment or omit live map placement until the address is confirmed.

## 11. Shop / Product Archive Design

Use the supplied shop archive assets/styles as visual evidence and the public MedicaShop composition as the high-fidelity target.

The Shop page should remain recognizably template-like:

- same broad banner/title treatment;
- comparable grid density;
- comparable card/image proportions;
- comparable product title/price/action hierarchy;
- comparable sidebar/filter geometry only where it can be functional.

Rosa adaptations:

- product names/images become Rosa instruments or the existing verified foundation fixture/sample content;
- price may read `Price on request` where no authoritative price exists;
- purchase/cart actions become inquiry/quotation actions while preserving placement and dimensions;
- no fake ratings, shipping claims or sale badges;
- no consumer Checkout/My Account dependency is introduced for the preview.

The goal is visual fidelity without adopting consumer-retail business semantics.

## 12. Header and Footer

### 12.1 Header

Preserve the MedicaShop header's overall silhouette and navigation density as closely as possible.

Replace:

- logo;
- site identity;
- relevant CTA/action wording;
- cart semantics with Inquiry where the template contains a cart-style action.

Add a compact EN / العربية language switch without disturbing the header composition.

### 12.2 Footer

Preserve the template footer's multi-column composition.

Replace pharmacy/retail information with:

- Rosa identity;
- verified address;
- verified phone/email;
- relevant site navigation;
- product family links where appropriate;
- inquiry/contact links.

Payment logos, fake badges and unsupported retail claims are not reproduced. Their visual slot may be omitted or repurposed with verified Rosa material without restructuring the whole footer.

## 13. Banner / Image Strategy

Banner changes are explicitly requested by the client and are part of the first preview.

Banner imagery should:

- feature surgical/medical instruments rather than pharmacy shelves, pills or consumer medicine;
- match the visual weight and aspect ratio of each MedicaShop banner slot;
- preserve text legibility and focal balance;
- work at desktop/tablet/mobile crops;
- avoid stock imagery that misrepresents Rosa operations;
- avoid proprietary MedicaShop images in production.

Preferred image sources, in order:

1. approved Rosa/catalogue imagery already owned by the project;
2. existing approved product-media derivatives;
3. user/client-supplied imagery;
4. newly generated/licensed banner imagery specifically designed for the slot.

Any generated banner should be reviewed at target crop sizes before acceptance.

## 14. Arabic / RTL Design

Arabic is required in the first client-facing preview.

The preview must provide a real Arabic counterpart, not only mirrored CSS.

### 14.1 Route/content model

Use paired English/Arabic editorial pages so both languages remain editable with Elementor Free.

Recommended routes:

- `/` <-> `/ar/`
- `/about/` <-> `/ar/about/`
- `/contact/` <-> `/ar/contact/`
- `/products/` or actual Woo archive <-> Arabic preview counterpart

A lightweight Rosa-controlled page-pair mapping provides the language switch for the preview.

This phase does not lock a permanent enterprise multilingual plugin or full-catalogue translation architecture.

### 14.2 Shared strings

Header/footer/shop interface strings use translation-ready WordPress strings and a Rosa Arabic translation set.

### 14.3 Direction and typography

Arabic pages must output:

- `lang="ar"`;
- `dir="rtl"`;
- Arabic-capable typography;
- logical CSS properties for spacing/inset/alignment;
- correctly mirrored directional affordances where meaning requires it.

### 14.4 Product content boundary

For the small preview dataset, Arabic sample product/family labels may be paired manually with verified English products.

Do not create a full multilingual catalogue-import subsystem in this preview phase. That remains future work once the client approves the template direction.

## 15. Responsive Requirements

The recreation must be checked at representative sizes including:

- 390;
- 430;
- 768;
- 1024;
- 1366;
- 1440;
- 1920;
- 2560 px widths.

Success means:

- the recreated template remains recognizable at desktop;
- mobile/tablet behavior is coherent rather than simply stacking large desktop gaps;
- no horizontal overflow;
- banners crop intentionally;
- navigation remains usable;
- Arabic/RTL preserves the same page hierarchy;
- forms and cards remain readable;
- large screens remain bounded rather than endlessly stretched.

## 16. Client Preview / Video Acceptance

The immediate delivery is a client-reviewable local/staging preview and video, not production deployment.

The video should show, at minimum:

1. English Homepage;
2. English About;
3. English Contact;
4. English Shop/archive;
5. language switch to Arabic;
6. Arabic Homepage;
7. at least one Arabic interior page;
8. responsive/mobile behavior briefly;
9. Rosa logo/contact information/banners clearly visible.

The purpose of the video is to obtain the client's next round of explicit template-change instructions.

Do not present speculative redesign work in this video.

## 17. Verification

Before sending the client video:

- verify all pages render locally without PHP fatal errors;
- verify no console-breaking JS errors;
- verify logo/name/address/phone/email are Rosa values from authoritative settings;
- verify no MedicaShop branding remains in visible public output;
- verify no proprietary MedicaShop image is shipped;
- verify English and Arabic navigation;
- verify `lang`/`dir` output;
- verify forms are non-broken even if backend submission is not yet production-connected;
- verify Shop has no accidental consumer Checkout dependency;
- verify responsive screenshots at the required widths;
- visually compare the recreation against supplied Home/About/Contact/Shop references;
- record intentional deviations caused by free-stack constraints or Rosa truthfulness.

## 18. Explicit Non-Goals

This preview phase does not include:

- merging completed Phase 2A into this lane;
- Hostinger work;
- production deployment;
- DNS/Cloudflare changes;
- catalogue mass import;
- final advanced filters;
- final inquiry persistence;
- final pricing persistence;
- permanent multilingual infrastructure for the full catalogue;
- custom redesign beyond client-requested substitutions;
- pixel-level Single Product recreation without a proper Single Product reference;
- purchasing MedicaShop or Elementor Pro.

## 19. Failure / Stop Conditions

Stop rather than guess if:

- authoritative Rosa phone/email/address are unavailable or contradictory;
- a requested banner would require using unlicensed proprietary media;
- the free stack cannot reproduce a critical template behavior without a major architectural compromise;
- Arabic routing would conflict with existing WordPress permalink/runtime behavior;
- the client requests new structural changes during implementation that exceed this approved preview scope.

Any such change becomes a new design decision rather than silent scope creep.

## 20. Acceptance Criteria

This design is accepted when the implementation can demonstrate all of the following:

1. client-preview work is isolated from completed Phase 2A;
2. no paid MedicaShop/Elementor Pro dependency exists;
3. Home visually tracks the supplied MedicaShop homepage composition;
4. About visually tracks the supplied About composition;
5. Contact visually tracks the supplied Contact composition;
6. Shop/archive visually tracks the supplied shop style evidence;
7. Rosa logo/name/contact details replace demo identity;
8. banners are Rosa-appropriate and independently owned/licensed;
9. obviously false pharmacy/retail content is replaced without redesigning section structure;
10. public cart/purchase semantics are adapted to inquiry/quotation where applicable;
11. no unsupported claims/certifications/testimonials are fabricated;
12. English and Arabic counterparts exist;
13. Arabic outputs `lang="ar"` and `dir="rtl"` and remains usable;
14. centralized Rosa business data is reused rather than duplicated;
15. responsive rendering works across required widths;
16. no MedicaShop branding/proprietary assets remain in the shipped public preview;
17. the client video can show the requested branding/banners/Arabic while keeping the selected template recognizable;
18. Hostinger/production remain untouched;
19. further structural redesign waits for explicit client feedback.

## 21. Next Step After Approval

After the user approves this written specification:

1. write a detailed implementation plan with Superpowers;
2. create an isolated implementation branch from the conservative WordPress foundation;
3. implement test-first where behavior is introduced;
4. recreate Home/About/Contact/Shop in controlled stages;
5. implement English/Arabic pairing and RTL;
6. verify against supplied visual references;
7. produce the client-review video;
8. stop and collect Hassan's next explicit changes before any redesign.
