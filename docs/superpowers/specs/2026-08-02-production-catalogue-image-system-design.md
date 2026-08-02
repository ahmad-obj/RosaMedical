# Production Catalogue Image System Design

Date: 2026-08-02
Repository: `manbtd0-cloud/RosaMedical`
Preview branch: `preview/scissors-image-batch-01`

## Goal

Create a production-ready image set for every distinct product configuration in the five supplied catalogues: Scissors, Chisels, Cutters, Knives, and Punches. Work one catalogue at a time, beginning with Scissors.

The catalogue remains the authority for product identity, code, visible geometry, direction, jaw or tip pattern, finish, and size grouping.

## Agreed decisions

- Workflow: finish one catalogue end-to-end before starting the next.
- Order: Scissors, Chisels, Cutters, Knives, Punches.
- Review method: small controlled batches.
- Rights policy: prefer commercially reusable or permission-safe images; supplier or other web images are allowed when no suitable alternative is found.
- Preview storage: local optimized files in the frontend preview branch. The backend partner will later move approved assets to Supabase Storage.
- Variants: visibly different Regular, Super Cut, TC, direction, point, jaw, curve, or angle configurations receive separate images.
- Sizes: sizes may share one image when the visible configuration is otherwise identical.
- Background: transparent by default. A clean white fallback is allowed only when background removal would damage the instrument.
- Orientation: standardized, full instrument centered, working end generally toward the upper-right, with no geometric distortion.
- Product structure: one visible configuration with all relevant sizes and exact catalogue codes grouped beneath it.

## Catalogue authority and correction

The verified Scissors catalogue mapping is:

- Iris Scissors: codes `04/05/06-0901` straight and `04/05/06-0911` curved, both 10.5 cm and sharp.
- Stevens Scissors: codes `04/05/06-0800` straight at 9.5 cm, `04/05/06-0810` curved at 9.5 cm, `04/05/06-0802` straight at 11.5 cm, and `04/05/06-0812` curved at 11.5 cm. All are sharp variants.

An earlier implementation revision swapped the Iris and Stevens code groups after relying on visual inference instead of the catalogue text table. This corrected revision supersedes that mistake. The rendered catalogue page and extracted catalogue text are authoritative.

## Image acceptance gate

An image is accepted only when:

1. The instrument family is correct.
2. The working end, handle pattern, curve, angle, point or jaw type matches the catalogue.
3. The full instrument is visible at useful resolution.
4. The image has no watermark, supplier logo burned into the product area, unrelated props, or unusable crop.
5. Background removal preserves edges and fine tips.
6. Standardized rotation and scale do not distort the instrument.
7. The source, match confidence, and any fallback reasoning are recorded.

Match grades:

- Exact
- Strong match
- Acceptable similar
- Reject

Only the first three may be used. Acceptable-similar images must be explicitly recorded as such.

## File and metadata model

Preview asset path:

`apps/web/public/media/catalogue-preview/<catalogue>/`

Recommended file naming:

`<catalogue>-<family>-<finish>-<direction>-<tip-or-jaw>.avif`

Each image record must include:

- catalogue family
- visible configuration key
- exact product codes
- grouped sizes
- source page URL
- original image URL when available
- match grade
- rights mode: preferred-safe or supplier-fallback
- background processing notes
- orientation notes
- reuse scope
- reviewer status

## Scissors Batch 1

Families:

1. Iris Scissors
2. Stevens Scissors
3. OP Scissors
4. Mayo Scissors
5. Metzenbaum Scissors

Required visible configuration targets:

- Iris: Regular/Super Cut/TC x Straight/Curved = 6
- Stevens: Regular/Super Cut/TC x Straight/Curved = 6
- OP: Regular/Super Cut/TC x Straight/Curved x Sh/Sh, Sh/Bl, Bl/Bl = 18
- Mayo: Regular/Super Cut/TC x Straight/Curved = 6
- Metzenbaum: Regular/Super Cut/TC x Straight/Curved = 6

Total Batch 1 image targets: 42.

## Sourcing approach

For each target:

1. Verify the exact catalogue drawing or photo and all associated codes.
2. Search exact name plus finish, direction, and point or jaw configuration.
3. Compare candidate geometry against the catalogue.
4. Prefer a clean product-only source with sufficient resolution.
5. Record the chosen candidate and rejected alternatives.
6. Download and preserve the original source file outside the web build.
7. Produce transparent normalized master and optimized AVIF/WebP preview derivative.
8. Attach the derivative to the grouped product configuration.
9. Run visual review in the real RosaMedical family and detail layouts.

## Error handling

- Missing exact image: use a strong or acceptable similar supplier image and record the difference.
- Watermarked image: reject.
- Background removal damages fine tips: use clean white background and flag it.
- Source disappears: retain the downloaded original and source manifest.
- Product identity is ambiguous: do not guess; hold the target for manual comparison.
- Same code appears under conflicting labels: catalogue page image and grouping are authoritative; record the discrepancy.

## Testing and verification

Automated checks must verify:

- every grouped configuration has a media record
- every exact catalogue code maps to one grouped configuration
- every referenced local file exists
- no temporary Thorhi URLs remain
- no direct third-party runtime hotlinks remain in approved output
- source and confidence metadata exist for every image
- grouped size reuse does not cross visible configuration boundaries

Visual verification must cover:

- desktop family cards
- product detail gallery
- mobile family cards
- transparent-edge quality
- consistent orientation and scale
- correct name/image pairing

## Boundaries

- Frontend work stays under `apps/web/**` plus documentation.
- Do not modify backend services, OpenAPI operations, Supabase schema, or production storage configuration.
- The backend partner owns final Supabase Storage integration.
- Preview assets remain isolated until user approval.
