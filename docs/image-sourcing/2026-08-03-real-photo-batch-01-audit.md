# Real Non-Product Photo Batch 01 Audit

Date: 2026-08-03
Branch: `preview/non-product-imagery-01`

This audit replaces the rejected generated/composite imagery work. Only real uploaded source photographs are considered here.

## Verification

All ten uploaded JPEG originals were opened successfully and inspected at full resolution.

| File | Dimensions | Intended use | Decision | Notes |
|---|---:|---|---|---|
| `pexels-jonathanborba-28727569.jpg` | 2048×1365 | Homepage hero | Accept | Best current hero source. Real surgical scene, clear instruments, usable wide crop. |
| `pexels-jonathanborba-13697728.jpg` | 2048×1365 | Hero fallback | Conditional | Strong depth and instrument coverage, but the prominent person limits clean headline space. |
| `pexels-konrads-photo-32351309.jpg` | 1365×2048 | Procurement / About | Accept | Strong full scene with human context and abundant visible instruments. |
| `pexels-ionelceban-15456809.jpg` | 2048×1365 | Procurement fallback | Conditional | Structured selection scene, but appears dental and includes a branded tool kit. |
| `pexels-cottonbro-7584485.jpg` | 1366×2048 | Knives / preparation | Accept | Real gloved preparation scene with usable instrument detail. |
| `pexels-lemniscate-l-3070285-14751430.jpg` | 2048×1369 | Scissors / procurement | Conditional | Real clinical handling scene; bright cyan grading requires restrained dark crop and colour correction. |
| `pexels-elementsinteractive-16053882.jpg` | 2048×1150 | Craftsmanship | Accept | Real Sialkot metalworking, sparks, action, cinematic depth. Must not imply this is Rosa's own factory unless client verifies that claim. |
| `pexels-hilmiisilak-28399433.jpg` | 1365×2048 | Craftsmanship fallback | Reject | Woodworking subject, soft focus and no credible medical-instrument link. |
| `pexels-karola-g2-6348.jpg` | 2048×1365 | Catalogue editorial | Reject | Fashion magazine content is unrelated to surgical catalogues. |
| `pexels-ushindinamegabe-10957431.jpg` | 1365×2048 | Catalogue review | Reject | Lifestyle brochure scene does not communicate medical procurement or premium catalogue review. |

## Current usable set

Accepted:

- Homepage hero primary
- Procurement / About editorial primary
- Knives / preparation primary
- Craftsmanship primary

Conditional:

- Homepage hero fallback
- Scissors / procurement candidate
- Procurement fallback

Rejected:

- Both catalogue candidates
- Craftsmanship fallback

## Remaining sourcing gaps

The next real-photo batch must prioritize:

1. Printed medical or technical catalogue review on a refined surface.
2. Punches family full scene with recognizable rongeur/punch geometry.
3. Chisels family scene with precision metal chisel/osteotome context, not generic woodworking.
4. Cutters family scene with medical/technical cutter geometry.
5. Cleaner scissors scene with controlled colour and stronger instrument recognition.
6. Optional second hero with genuine negative space for left-aligned copy.

## Guardrails

- No image generation.
- No catalogue cutout composites.
- No third-party brands visible in final crops.
- No manufacturing/factory ownership claims inferred from workshop imagery.
- No gore, surgery in progress or misleading certification context.
