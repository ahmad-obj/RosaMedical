# Rosa Medical Complete Image QA and Correction Design

**Date:** 2026-09-15  
**Target branch:** `wordpress/curated-grey-imagery-2026-09-14`

## Purpose

Perform a complete professional audit and correction pass of every image used by the current Rosa Medical WordPress website.

This is not a broken-image sweep. The pass combines:

- image QA
- visual-design review
- responsive-design review
- semantic/content relevance review
- crop/focal-point review
- implementation review
- brand-consistency review
- image-performance review

The deliverable is an improved website, not a long report.

## Scope

Audit all public image-bearing surfaces in the current WordPress implementation, including:

- Home
- About
- Contact
- Shop/catalogue surfaces
- family/category surfaces
- representative Product Detail routes
- quotation/request surfaces where imagery is rendered
- shared header/footer/prefooter media
- Elementor-authored media
- WooCommerce product and variation media
- CSS background images
- template fallbacks
- responsive/mobile variants
- dynamically selected media
- carousel/banner media
- catalogue cover assets
- product galleries and thumbnails

Inspect both English and Arabic/RTL where the same image system can produce different crops or composition.

The legacy `apps/web/**` implementation is reference material only where it still represents approved visual/media intent. The active WordPress architecture remains authoritative for rendering, ownership, WooCommerce data, Elementor overrides, and public behavior.

## Current baseline that must be preserved unless evidence proves a defect

The current branch already contains substantial image-system hardening. Do not undo it casually.

Protected baseline includes:

- approved `client-v5` homepage hero family;
- responsive AVIF/WebP hero delivery;
- responsive WordPress attachment helpers;
- runtime rejection of known unsafe historical attachments;
- retirement of generic About stock defaults;
- instrument-led About fallbacks;
- neutral photographic overlays instead of Rosa-red washes;
- catalogue covers exempt from editorial grayscale treatment;
- responsive attachment rendering in Home specialty/confidence media;
- Product Detail primary-image intrinsic sizing, `srcset`, async decoding, and high fetch priority;
- client-selected WordPress/Elementor media taking precedence over theme fallbacks;
- WooCommerce as product/image truth where product media exists;
- Elementor Free as editable content/media ownership layer;
- EN/AR and RTL behavior;
- quotation-only product flow.

## Audit method

Use a runtime-first, source-backed process.

### 1. Build the image inventory

For every rendered image or image-bearing slot, identify:

- route and section;
- source asset or attachment ID;
- file path / URL origin;
- fallback vs client-selected media;
- rendered dimensions;
- intrinsic dimensions when available;
- aspect ratio;
- object-fit / object-position / background positioning;
- intended focal subject;
- nearby message/CTA;
- semantic role;
- desktop/mobile source behavior;
- whether the same asset is reused elsewhere.

Include CSS backgrounds and image references in configuration/helper code.

### 2. Technical QA

Check for:

- broken sources;
- missing binaries;
- path/case errors;
- duplicate or accidental fallback use;
- transparent/unwanted backgrounds;
- low-resolution or visibly compressed output;
- stretching or aspect-ratio distortion;
- incorrect width/height;
- layout shift;
- overflow/clipping;
- wrong `object-fit` or `object-position`;
- bad background positioning;
- mobile-only or desktop-only failures;
- oversized delivery;
- blurry responsive output;
- missing lazy loading where appropriate;
- incorrect hero/LCP loading.

Correct root causes, not symptoms.

### 3. Composition and crop QA

For each major image, identify the real visual focal point and decide what must remain visible.

Inspect for:

- cut-off instruments or hands;
- hidden focal subjects;
- excessive dead space;
- text covering the subject;
- source composition unsuitable for the container;
- default-centered crops that are visibly wrong;
- mobile crops that lose the meaning of the image.

Tune focal positions individually. Desktop and mobile may use different positioning.

Change container geometry only when the container is the actual problem.

### 4. Professional visual-design QA

Judge whether each image should be present at all.

An image is acceptable only if it materially improves the section by supporting:

- the message;
- product communication;
- visual hierarchy;
- brand quality;
- page balance;
- industry relevance.

Remove or de-emphasize filler imagery if the section is stronger without it.

Avoid unrelated doctor portraits, generic hospital stock, pharmaceutical/lab imagery, or medical scenes that do not communicate Rosa's actual surgical/dental instrument business.

### 5. Message-to-image relevance

Read the adjacent heading, paragraph, CTA, and category/product label.

The image should reinforce that exact message.

Examples:

- precision / quality-control copy should favor instrument detail, inspection, craftsmanship, or manufacturing context;
- catalogue-family content should show the correct instrument family or catalogue cover;
- procurement support should not be represented by unrelated clinical stock;
- surgical-scissors copy must not be dominated by unrelated dental or orthopedic tools.

### 6. Cross-site image consistency

Review the website as one visual system.

Check:

- lighting;
- saturation;
- temperature;
- sharpness;
- subject scale;
- background complexity;
- negative space;
- clinical/product tone;
- premium-vs-stock feel.

Do not force identical treatment everywhere, but remove obvious discontinuity.

### 7. Performance

Optimize only where it materially improves delivery without hurting image quality.

Prefer:

- responsive `srcset` / WordPress generated sizes;
- intrinsic dimensions;
- AVIF/WebP where already supported;
- lazy loading for below-the-fold media;
- high priority only for actual LCP imagery;
- removal of unused heavy assets;
- no duplicate rendered image nodes solely for responsive composition.

Do not over-compress hero or product imagery.

## Responsive verification matrix

At minimum inspect:

- 1440 px
- 1024 px
- 768 px
- 431 px
- 390 px

Add targeted widths if a breakpoint-specific defect is discovered.

For every important visual at each required width, inspect:

- crop;
- focal subject;
- scale;
- spacing;
- text/image balance;
- overlap;
- readability;
- hierarchy;
- container height;
- image prominence;
- horizontal overflow.

Evaluate EN and AR/RTL where direction or text density can change composition.

## Asset-selection decision rules

Use the following order of preference:

1. existing approved/client-supplied Rosa media;
2. catalogue-confirmed product/family imagery;
3. existing provenanced Rosa instrument-led media;
4. client-selected WordPress/Elementor media;
5. current safe theme fallback;
6. new external/generated asset only when the available source is objectively unsuitable.

If an asset cannot be cropped professionally for the target slot, treat that as an asset-selection failure rather than forcing layout hacks.

When a new asset is required but unavailable, produce a direct replacement specification containing:

- intended subject;
- context/message;
- composition;
- orientation/aspect ratio;
- subject scale;
- negative space requirement;
- focal position;
- lighting/color treatment;
- realism level;
- forbidden content;
- desktop/mobile crop requirements.

## Implementation boundaries

Allowed changes include:

- media source selection;
- fallback ordering;
- responsive source markup;
- image dimensions;
- `srcset` / `sizes`;
- loading/decoding/fetch priority;
- object-fit;
- object-position;
- background-position;
- breakpoint-specific crop tuning;
- image-container geometry;
- removal of unnecessary decorative imagery;
- narrowly scoped section layout changes required by the image;
- deletion of genuinely retired/dead media when proven unused;
- focused image QA tests.

Do not:

- redesign the site;
- change brand identity;
- change WooCommerce product truth;
- alter quotation architecture;
- alter unrelated navigation/footer structure;
- rewrite public copy merely to justify an image;
- modify Hostinger/Cloudflare/production;
- replace approved client imagery without runtime evidence;
- reintroduce previously rejected generic stock.

## TDD and verification

Every code/data correction that fixes a newly proven defect should follow:

1. reproduce/observe the defect;
2. add or extend a focused failing contract when practical;
3. make the smallest correct fix;
4. rerun focused verification;
5. rerun neighboring image/accessibility/layout contracts;
6. recapture affected route/viewports;
7. visually inspect the result.

Existing relevant tests include:

- `wordpress/scripts/tests/image-qa-professional-audit-contract.test.php`
- `wordpress/scripts/tests/home-visual-restoration-contract.test.php`
- `wordpress/scripts/tests/latest-home-curated-media-contract.test.php`
- `wordpress/scripts/tests/client-preview-accessibility.test.mjs`
- `wordpress/scripts/tests/client-handoff-rendered-media-placeholders.test.mjs`
- `wordpress/scripts/tests/live-about-fidelity.test.mjs`
- `wordpress/scripts/tests/live-contact-fidelity.test.mjs`
- `wordpress/scripts/tests/live-product-detail-fidelity.test.mjs`
- `wordpress/scripts/tests/live-product-detail-layout.test.mjs`
- `wordpress/scripts/tests/live-product-detail-visual-contract.test.mjs`
- Elementor authoring contracts
- quotation and catalogue navigation contracts

Use the existing responsive capture/audit tooling where possible rather than inventing parallel infrastructure.

## Required runtime review sequence

1. capture current baseline;
2. inventory all image-bearing surfaces;
3. classify issues by severity and root cause;
4. correct technical failures first;
5. correct crop/focal problems;
6. correct clearly weak/irrelevant asset choices;
7. correct responsive/performance issues;
8. recapture all affected surfaces;
9. run the complete image-focused regression set;
10. review the final site as one continuous visual experience.

## Severity model

Prioritize:

1. broken/missing/wrong imagery;
2. misleading or semantically wrong imagery;
3. severe crop/composition failures;
4. obvious low-quality/placeholder imagery;
5. responsive visual failures;
6. repeated/filler imagery reducing professionalism;
7. performance issues with visible UX impact;
8. minor polish.

Do not spend time on invisible micro-optimizations before visible client-facing problems are corrected.

## Completion criteria

The pass is complete only when:

- every public image-bearing surface has been inventoried;
- no visible broken image remains;
- no known unsafe historical placeholder reappears;
- major crops preserve the intended subject;
- mobile crops remain meaningful;
- image/content pairing is semantically appropriate;
- repeated imagery is intentional rather than accidental;
- catalogue and product imagery remain truthful to family/product data;
- client/Elementor overrides continue to work;
- image rendering is responsive and avoids obvious waste;
- EN/AR layouts remain coherent;
- no new horizontal overflow or layout collision is introduced;
- focused image QA tests are green;
- final browser captures have been visually reviewed.

## Final handoff format

Keep the final report concise.

### Fixed
Only material issues actually corrected.

### Replacements Recommended
Only underlying assets that remain unsuitable and genuinely require new media.

### Intentional Decisions
Important image removals, replacements, or crop/layout changes made for design reasons.

### Remaining Issues
Only blockers requiring a new asset, missing client information, or external dependency.

The improved website is the primary deliverable.
