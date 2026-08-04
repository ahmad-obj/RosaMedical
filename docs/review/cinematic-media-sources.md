# Cinematic Media Source Record

Date: 2026-08-04
Branch: `feature/cinematic-media-closeout`

## Scope

This record covers the nine release media slots wired through `apps/web/src/features/cinematic-media/cinematic-media.ts`.

All instrument imagery comes from the five client-supplied Rosa catalogue PDFs. No stock photography, external supplier imagery or newly invented instrument form is used.

The editorial backgrounds, document sheets, catalogue-cover framing, typography, spacing, lighting and instrument arrangement are layout synthesis performed by `apps/web/scripts/build_cinematic_media.mjs`. They are not presented as photographed Rosa facilities, staff, manufacturing environments or historical material.

## Source files

- `Knives Catalog(1).pdf`
- `Scissors Catalog(1).pdf`
- `Punches Catalog(1).pdf`
- `Chisels Catalog(1).pdf`
- `Cutters Catalog(1).pdf`

## Asset provenance

| Media slot | Runtime asset | Source pages and subject |
| --- | --- | --- |
| `homepage-hero` | `/media/cinematic/homepage-hero.webp` | Knives page 2, Scalpel Handle No. 3; Scissors page 3, Mayo Scissors; Punches page 2, Yeoman; Chisels page 2, Osteotomes; Cutters page 2, Liston |
| `homepage-procurement` | `/media/cinematic/homepage-procurement.webp` | Knives page 2, Scalpel Handle No. 3; Scissors page 3, Mayo Scissors; Cutters page 2, Liston |
| `homepage-catalogue-knives` | `/media/catalogue-covers/knives.webp` | Knives page 2, Scalpel Handle No. 3 |
| `homepage-catalogue-scissors` | `/media/catalogue-covers/scissors.webp` | Scissors page 3, Mayo Scissors |
| `homepage-catalogue-punches` | `/media/catalogue-covers/punches.webp` | Punches page 2, Yeoman |
| `homepage-catalogue-chisels` | `/media/catalogue-covers/chisels.webp` | Chisels page 2, Osteotomes |
| `homepage-catalogue-cutters` | `/media/catalogue-covers/cutters.webp` | Cutters page 2, Liston |
| `about-hero` | `/media/cinematic/about-hero.webp` | Chisels page 2, Osteotomes; Cutters page 2, Liston |
| `about-procurement` | `/media/cinematic/about-procurement.webp` | Scissors page 3, Mayo Scissors; Chisels page 2, Osteotomes |

## Review decisions

- The first generated review was rejected because catalogue instruments obscured titles, the hero cluster was too congested at the right edge and the About procurement composition showed blend ghosting.
- The accepted second review keeps family titles unobstructed, preserves left-side hero negative space and uses normal instrument compositing without ghost artifacts.
- Every runtime file is a local WebP and is referenced only through the typed cinematic-media manifest.
- The pre-existing placeholder for `about-scissors-evolution` remains unchanged because it is outside the approved nine-slot media scope.

## Rights and release caveats

- Public reuse of catalogue photography and catalogue-derived artwork requires explicit client confirmation before publication.
- Every manifest record therefore carries `rightsStatus: "client-confirmation-required"`.
- Punches technical media remains in candidate review state. Its use in the Punches cover and multi-family hero does not promote that product-media batch to approved status.
- These assets must not be described as factory photography, manufacturing evidence, certification evidence or historical company documentation.
