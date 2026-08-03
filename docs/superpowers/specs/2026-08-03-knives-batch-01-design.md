# Knives Batch 01 Design

## Goal

Create a complete local production-media batch for the first three printed pages of the client-supplied Knives catalogue, following the approved Scissors, Chisels, and Cutters workflow.

## Scope

- Source: `Knives Catalog(1).pdf` supplied by Ahmad.
- PDF pages: 2, 3, and 4.
- Printed catalogue pages: 1, 2, and 3.
- Visible configurations: 18.
- Exact catalogue codes: 32.
- Runtime derivatives: 36 — 18 AVIF and 18 WebP.
- Public family result after integration: 22 products — 18 Batch 01 records plus four preserved later-page records.

## Configuration rules

Group only true size-only variants:

- Liston: four codes, one visible configuration.
- Fox Lupus Curettes: four working-end sizes, one visible configuration.
- Keyes Dermal Punches: seven punch diameters, one visible configuration.

Keep every distinct handle/body geometry separate, including #3 Long, #3 Long Curved, #4 Long, Round Straight, Round Curved, Long Handle, and Short Handle.

## Media rules

- Use only client-supplied catalogue material.
- Do not fabricate geometry, curvature, cutting ends, handles, or interchangeable tips.
- Remove page background and retain the complete visible instrument or set.
- Rotate proportionally so the working end points toward the upper-right where practical.
- Center each result on a transparent 1800 × 1800 canvas within the established safe region.
- Store local AVIF and WebP derivatives under `/media/catalogue-preview/knives/`.
- Record conservative provenance and review metadata.
- Initial review state is `candidate`; Ahmad’s later visual approval changes it to `approved`.

## Public integration

- Add 18 Batch 01 products before the four established Knives records.
- Join products to media by stable media asset ID.
- Preserve all existing routes and records.
- Add focused unit tests and responsive Playwright checks for desktop, tablet, and mobile.

## Acceptance

The batch is ready for visual review when:

- inventory tests confirm 18 configurations and 32 unique codes;
- media tests confirm 18 AVIF and 18 WebP derivatives and complete provenance;
- public registry tests confirm 22 Knives products and 18 local media joins;
- Playwright confirms image decoding, representative detail data, and no horizontal overflow across all three viewport projects.
