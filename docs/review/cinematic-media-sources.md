# Cinematic Media Source Record

Date: 2026-08-04
Branch: `feature/cinematic-media-closeout`

## Scope

This record covers the nine release media slots wired through `apps/web/src/features/cinematic-media/cinematic-media.ts`.

The renderer consumes the repository’s existing local catalogue-media derivatives for the selected instruments. Those derivatives were previously isolated from the five client-supplied Rosa catalogue PDFs and retain their own family source ledgers, processing notes and review states. No stock photography, external supplier imagery or newly invented instrument geometry is introduced by this cinematic-media phase.

The editorial backgrounds, document sheets, catalogue-cover framing, typography, spacing, lighting and instrument arrangement are layout synthesis performed by `apps/web/scripts/build_cinematic_media.mjs`. They are not presented as photographed Rosa facilities, staff, manufacturing environments or historical material.

## Source files

- `Knives Catalog(1).pdf`
- `Scissors Catalog(1).pdf`
- `Punches Catalog(1).pdf`
- `Chisels Catalog(1).pdf`
- `Cutters Catalog(1).pdf`

## Derivative chain

1. A selected instrument illustration is isolated from the client catalogue into its family-local runtime derivative under `apps/web/public/media/catalogue-preview/<family>/`.
2. The family catalogue-media manifest records the source ledger, review state, processing notes and reuse scope for that derivative.
3. `build_cinematic_media.mjs` reads only those local derivatives and composes the nine final editorial WebPs.
4. `cinematic-media.ts` maps those WebPs to the approved public slots and records the originating client catalogue files.

## Asset provenance

| Media slot | Runtime asset | Source pages and subject |
| --- | --- | --- |
| `homepage-hero` | `/media/cinematic/homepage-hero.webp` | Knives PDF page 2, Scalpel Handle No. 3; Scissors PDF page 3, Mayo Scissors; Punches PDF page 2, Yeoman; Chisels PDF page 2, Osteotomes; Cutters PDF page 2, Liston |
| `homepage-procurement` | `/media/cinematic/homepage-procurement.webp` | Knives PDF page 2, Scalpel Handle No. 3; Scissors PDF page 3, Mayo Scissors; Cutters PDF page 2, Liston |
| `homepage-catalogue-knives` | `/media/catalogue-covers/knives.webp` | Knives PDF page 2, Scalpel Handle No. 3 |
| `homepage-catalogue-scissors` | `/media/catalogue-covers/scissors.webp` | Scissors PDF page 3, Mayo Scissors |
| `homepage-catalogue-punches` | `/media/catalogue-covers/punches.webp` | Punches PDF page 2, Yeoman |
| `homepage-catalogue-chisels` | `/media/catalogue-covers/chisels.webp` | Chisels PDF page 2, Osteotomes |
| `homepage-catalogue-cutters` | `/media/catalogue-covers/cutters.webp` | Cutters PDF page 2, Liston |
| `about-hero` | `/media/cinematic/about-hero.webp` | Chisels PDF page 2, Osteotomes; Cutters PDF page 2, Liston |
| `about-procurement` | `/media/cinematic/about-procurement.webp` | Scissors PDF page 3, Mayo Scissors; Chisels PDF page 2, Osteotomes |

## Review decisions

- The first generated review was rejected because catalogue instruments obscured titles, the hero cluster was too congested at the right edge and the About procurement composition showed blend ghosting.
- The second review corrected those composition defects: family titles remained unobstructed, the hero retained left-side negative space and normal compositing removed the ghost artifacts.
- The required code review then found forbidden “ROSA MEDICAL” wording on the generated family covers. The renderer and all five covers were regenerated with the locked ROSA-only brand, and a regression test now rejects reintroduction of the forbidden wording.
- Every runtime file is a local WebP and is referenced only through the typed cinematic-media manifest.
- The pre-existing placeholder for `about-scissors-evolution` remains unchanged because it is outside the approved nine-slot media scope.

## Rights and release caveats

- Public reuse of catalogue photography and catalogue-derived artwork requires explicit client confirmation before publication.
- Every manifest record therefore carries `rightsStatus: "client-confirmation-required"`.
- Punches technical media remains in candidate review state. Its use in the Punches cover and multi-family hero does not promote that product-media batch to approved status.
- These assets must not be described as factory photography, manufacturing evidence, certification evidence or historical company documentation.
