# Rosa Medical Non-Product Imagery Design

**Date:** 2026-08-03  
**Branch:** `preview/non-product-imagery-01`  
**Scope owner:** Non-product imagery sourcing and preview only  
**Base:** Current authoritative `main`

## 1. Purpose

Replace the Rosa Medical website's non-product visual placeholders with premium, realistic and professionally composed imagery that strengthens credibility, supports the quotation-led user journey and preserves the approved visual system.

This work does not source individual product photographs or product-size/variant imagery. A separate agent owns that lane. This work also does not alter backend behavior, public claims, typography, button-animation work or protected design controls.

## 2. Approved Direction

The selected approach is a curated hybrid system:

- real free-commercial-use photography for the homepage hero, procurement-support scenes and craftsmanship imagery;
- Rosa-owned catalogue material for document and catalogue presentations;
- restrained representative instrument or document compositions for the five family/category tiles;
- people, hands or object-only scenes may be used when the strongest candidate naturally supports the section;
- the About direction prioritizes macro craftsmanship rather than historical or factory storytelling;
- homepage catalogues use richer editorial presentation while the dedicated Catalogues page uses cleaner document-led presentation;
- the homepage hero retains left-side copy and right-side visual emphasis;
- current layouts remain intact, with only restrained crop, focal-point, overlay and contrast tuning.

## 3. Legal and Sourcing Boundary

The deliverable pool prioritizes imagery that is free for commercial use and can be archived with licence evidence.

Restricted copyrighted imagery may be recorded only as reference material when it is exceptionally useful for visual direction. It must not be silently downloaded into the distributable asset package, committed as a production candidate or included in the final ZIP unless the rights position permits redistribution.

Paid-stock imagery is not part of the sourcing plan.

## 4. Visual Principles

Every selected image must support the Rosa Medical identity:

- professional, composed, elegant and non-AI-looking;
- realistic surgical-instrument geometry and metallic response;
- controlled near-black, white, steel and restrained red compatibility;
- premium material detail rather than glossy advertising spectacle;
- negative space that respects adjacent copy;
- believable procurement and document-review behavior;
- no unsupported manufacturing, certification, factory, ownership, export or clinical claims;
- no visible third-party brands;
- no graphic surgery, blood, operating procedures or distress;
- no fake laboratories, staged handshake photography or generic clipboard stock scenes;
- no embedded text that conflicts with the interface;
- no malformed instruments, impossible reflections or obvious generative artifacts.

## 5. Slot Inventory

### 5.1 Homepage

#### H-01 — Cinematic hero

- **Role:** establish premium surgical-instrument credibility immediately.
- **Composition:** dark cinematic macro or arranged instruments, with visual weight concentrated on the right and clean negative space on the left.
- **Minimum target:** preferably 2400 px wide.
- **Primary crop:** wide desktop landscape.
- **Responsive behavior:** mobile crop may move the focal subject upward/right while preserving headline legibility.
- **Avoid:** bright hospital environments, visible surgery, flat ecommerce cutouts, crowded trays and third-party branding.

#### H-02 to H-06 — Five family/category tiles

Families remain in the locked order: Knives, Scissors, Punches, Chisels and Cutters.

The five tiles use a hybrid category-representation strategy rather than pretending to show exact catalogue variants.

- **Knives:** controlled blade/scalpel arrangement or refined technical-document crop.
- **Scissors:** recognizable finger-ring silhouette or elegant arranged scissors.
- **Punches:** representative punch geometry or document-led composition where photography is weak.
- **Chisels:** aligned tips, handles or steel-detail arrangement with strong geometry.
- **Cutters:** precision jaw detail or arranged wire cutters with a readable silhouette.

Each tile must protect the existing title and action area, remain legible across its asymmetric grid size and use a distinct focal direction without looking like five unrelated stock images.

#### H-07 — Procurement editorial

- **Role:** show structured buying support and practical decision-making.
- **Direction:** careful instrument selection, code checking, documentation, catalogue consultation, quality review or neutral packaging.
- **Human presence:** optional hands or partial professional presence; faces are not required.
- **Avoid:** diagnostic activity, surgery, claims of inspection certification, branded packaging or fake industrial premises.

#### H-08 to H-12 — Homepage catalogue presentations

- **Role:** make the five technical catalogues feel like premium parts of the product journey.
- **Direction:** printed cover, layered paper, open spread or refined desk/surface presentation.
- **Source:** actual Rosa catalogue material should anchor the design.
- **Treatment:** richer editorial styling than the dedicated Catalogues page while remaining truthful to the documents.

### 5.2 Dedicated Catalogues page

#### C-01 to C-05 — Family catalogue cards

Each of the five catalogue cards receives a clean document-led image treatment.

- actual cover or representative open spread;
- reduced decorative styling compared with homepage catalogue imagery;
- technical clarity and file/document recognition;
- consistent family sequencing and presentation rhythm;
- no invented certification seals, publication marks or unrelated manufacturer branding.

A single source catalogue may produce both homepage and dedicated-page derivatives, but the crop and presentation must differ to suit each context.

### 5.3 About page

#### A-01 — About hero

- **Role:** communicate precision and material craftsmanship without inventing company history.
- **Direction:** polished steel, finishing detail, serrations, joints, cutting edges, alignment or careful hand inspection.
- **Preferred framing:** portrait/editorial, compatible with the existing hero media slot.
- **Avoid:** identifiable factory claims, machinery implying Rosa ownership, staff uniforms with brands or unsafe handling.

#### A-02 — Procurement preview

- **Role:** connect the company story to a practical quotation process.
- **Direction:** catalogue review, product-code comparison, selected instruments and organized notes.
- **Treatment:** quieter and more process-oriented than the homepage procurement visual.

#### A-03+ — Craftsmanship detail set

When the current or planned About timeline needs additional media, prioritize contemporary macro craftsmanship:

- instrument joints and pivot details;
- polished or satin metal texture;
- controlled edge finishing;
- alignment and precision handling;
- hand finishing or inspection when source truthfulness is clear.

Historical evolution imagery is not the dominant direction for this batch.

### 5.4 Procurement Support page

#### P-01 — Procurement Support hero

- **Role:** communicate an organized requirement-building process.
- **Direction:** instruments, catalogue pages, notes and structured selection in one believable composition.
- **Preferred framing:** portrait/editorial for the existing hero media slot.

#### P-02+ — Optional supporting process imagery

Only add additional imagery where a current placeholder or established component already expects it. Suitable subjects include:

- neutral packaging preparation;
- quantity or code verification;
- document review;
- arranged selection before inquiry submission.

Do not introduce new decorative image sections merely to use extra candidates.

## 6. Candidate Requirements

Every slot receives one primary and one fallback candidate.

Each candidate record must include:

1. slot ID;
2. candidate status: primary, fallback, reserve or rejected;
3. source page URL;
4. direct asset URL when permitted;
5. creator or source organization;
6. licence name and source proof;
7. attribution requirement;
8. original width and height;
9. orientation and aspect ratio;
10. subject and visual-content description;
11. focal point;
12. recommended desktop crop;
13. recommended mobile crop;
14. suggested `object-position`;
15. overlay or contrast recommendation;
16. confidence level;
17. risks, including branding, geometry, misleading context or weak crop tolerance.

Hero candidates should preferably be at least 2400 px wide. Major section images should preferably be at least 1800 px on the long edge. Lower resolution is acceptable only when the intended rendered size and crop remain visibly clean.

## 7. Asset Processing

Approved preview assets will be stored under:

```text
apps/web/public/media/editorial/
  hero/
  families/
  procurement/
  catalogues/
  about/
  craftsmanship/
```

Processing rules:

- retain an untouched source copy outside optimized web derivatives when redistribution permits;
- create modern web derivatives using the repository's established media conventions;
- preserve enough resolution for responsive crops;
- strip unnecessary metadata when generating web derivatives;
- never upscale weak sources to pretend they are high-resolution;
- use clear, stable filenames tied to slot IDs and candidate role;
- keep restricted reference-only material outside production asset directories.

## 8. Preview Integration Rules

The preview branch may make only image-presentation changes needed to judge the candidates professionally.

Allowed:

- replacing placeholder visuals with real media;
- `object-fit` and `object-position` tuning;
- focal-point correction;
- restrained dark/light overlays;
- minor contrast balancing;
- responsive crop rules;
- accessible alternative text for meaningful images;
- decorative treatment where the image is already represented as decorative.

Not allowed:

- resizing major sections for convenience;
- redesigning card architecture;
- changing typography or copy;
- modifying button-animation work;
- changing product data or product-media ownership;
- touching backend, Supabase, OpenAPI or admin behavior;
- adding unverifiable public claims;
- merging the branch into `main` without explicit approval.

## 9. Documentation Structure

The branch will contain:

```text
docs/image-sourcing/
  non-product-slot-inventory.md
  source-and-licence-manifest.md
  candidate-review-sheet.md
  rejection-log.md
```

- **Slot inventory:** actual component, route, dimensions, aspect behavior and narrative role.
- **Source and licence manifest:** evidence for every retained source.
- **Candidate review sheet:** primary and fallback comparisons with crop recommendations.
- **Rejection log:** candidates excluded for legal, visual, contextual or technical reasons.

## 10. Execution Phases

### Phase 1 — Repository and layout audit

- enumerate all non-product placeholders and media surfaces;
- record desktop/mobile geometry and current component ownership;
- separate genuine non-product slots from product-media slots;
- identify collision risks with the button-animation and product-image agents.

### Phase 2 — Broad web sourcing

- search free commercial-use libraries and permissive institutional sources;
- collect a broad pool rather than accepting first matches;
- record source and licence evidence immediately;
- reject generic, branded, distorted, misleading or low-resolution candidates.

### Phase 3 — Curated shortlist

- choose one primary and one fallback for every confirmed slot;
- test crop tolerance before approval;
- preserve consistency across the full site rather than optimizing isolated sections.

### Phase 4 — In-layout previews

- add optimized derivatives to the isolated preview branch;
- integrate candidates into the actual components;
- make only restrained professional crop and overlay adjustments;
- capture full-page desktop and representative mobile previews.

### Phase 5 — User review

- present candidate comparisons and in-layout previews;
- record approved, rejected and revision-needed decisions;
- do not merge or hand off unapproved assets as final.

### Phase 6 — Final handoff

- remove rejected and unused production candidates;
- finalize the licence/source manifest;
- prepare a ZIP containing approved redistributable sources, optimized derivatives, crop guidance and documentation;
- leave the branch isolated for the main integration agent.

## 11. Acceptance Criteria

The batch is complete only when:

- every confirmed non-product slot has one primary and one fallback;
- every retained candidate has source, licence, dimension and crop records;
- the hero supports left-side copy and right-side subject emphasis;
- the five family tiles are distinct but visually coherent;
- catalogue imagery is grounded in actual Rosa documents;
- About imagery communicates craftsmanship without making factory claims;
- procurement imagery looks organized and believable rather than generic;
- desktop and mobile crops have been reviewed in context;
- no product-image agent assets are overwritten;
- no button-animation work is modified;
- no unapproved branch merge occurs;
- the final ZIP contains only assets that may be redistributed, plus documentation and crop guidance.

## 12. Non-Goals

This batch does not:

- source individual catalogue product photography;
- define product variants, dimensions or exact instrument mappings;
- redesign layouts or create new page sections;
- build a generic image CMS;
- introduce video, 3D or generative animation;
- claim manufacturing facilities, certifications, ownership or clinical outcomes;
- publish or merge assets before user approval.

## 13. Coordination

`main` remains authoritative. This branch is a preview and handoff lane only.

Before integrating any code or media that overlaps another agent's active work, compare the affected files and preserve the other agent's ownership. Product imagery and button-animation changes must not be overwritten or reformatted as part of this task.
