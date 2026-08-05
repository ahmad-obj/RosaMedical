# Chisels Batch 01 Source and Review Ledger

Status: Ahmad approved all 16 reviewed assets on 2026-08-03 at 21:10 PKT. The batch remains isolated: not merged, deployed, transferred to Supabase, or opened as a pull request.

## Batch scope

- Source file: `Chisels Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF pages: 2, 3, and 4.
- Printed catalogue pages: 1, 2, and 3.
- Visible configurations: 16.
- Exact catalogue codes: 95.
- Runtime derivatives: 32 — 16 AVIF and 16 WebP.
- Rights mode: `preferred-safe` because every committed derivative is produced from client-supplied catalogue material.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade replacement, working-end replacement, handle replacement, or fabricated curvature.
- Processing policy: isolate the catalogue instrument, remove the page background, rotate the complete instrument so the working end points toward the upper-right, scale proportionally, and center on a transparent 1800 x 1800 canvas.

## Client catalogue page 1

Catalogue groups:

- Osteotomes 13.5 cm — `36-6301` through `36-6305`.
- Chisels 13.5 cm — `36-6321` through `36-6325`.
- Gouges 13.5 cm — `36-6331` through `36-6335`.
- Hoke Osteotomes 14 cm Straight — `36-6401` through `36-6407`.
- Hoke Osteotomes 14 cm Curved — `36-6411` through `36-6417`.
- Round Handle Gouges 14 cm — `36-6500`.

| Asset ID | Codes | Match grade | Background | Review status |
|---|---|---|---|---|
| `chisels-osteotomes-13-5cm` | `36-6301`–`36-6305` | strong-match | transparent | approved |
| `chisels-chisels-13-5cm` | `36-6321`–`36-6325` | strong-match | transparent | approved |
| `chisels-gouges-13-5cm` | `36-6331`–`36-6335` | strong-match | transparent | approved |
| `chisels-hoke-osteotomes-straight` | `36-6401`–`36-6407` | strong-match | transparent | approved |
| `chisels-hoke-osteotomes-curved` | `36-6411`–`36-6417` | strong-match | transparent | approved |
| `chisels-round-handle-gouges` | `36-6500` | strong-match | transparent | approved |

## Client catalogue page 2

Catalogue groups:

- West Chisel 19 cm — `36-6601`.
- West Gouge 19 cm — `36-6621`.
- Andrews Gouge 16 cm — `36-6701` through `36-6705`.
- Alexander Osteotome 17.5 cm — `36-6801` through `36-6806`.
- Alexander Gouge 17.5 cm — `36-6821` through `36-6826`.
- Alexander Chisel 17.5 cm — `36-6831` through `36-6836`.

| Asset ID | Codes | Match grade | Background | Review status |
|---|---|---|---|---|
| `chisels-west-chisel` | `36-6601` | strong-match | transparent | approved |
| `chisels-west-gouge` | `36-6621` | strong-match | transparent | approved |
| `chisels-andrews-gouge` | `36-6701`–`36-6705` | strong-match | transparent | approved |
| `chisels-alexander-osteotome` | `36-6801`–`36-6806` | strong-match | transparent | approved |
| `chisels-alexander-gouge` | `36-6821`–`36-6826` | strong-match | transparent | approved |
| `chisels-alexander-chisel` | `36-6831`–`36-6836` | strong-match | transparent | approved |

## Client catalogue page 3

Catalogue groups:

- Stille Osteotomes Straight — `36-6901` through `36-6905` and `36-6940` through `36-6949`.
- Stille Osteotomes Curved — `36-6911` through `36-6915`.
- Stille Gouges Straight — `36-6921` through `36-6925` and `36-6950` through `36-6959`.
- Stille Chisels Straight — `36-6931` through `36-6935`.

Size-only variants at 20 cm and 23 cm remain grouped when the visible instrument configuration is unchanged.

The catalogue page provides one full-body Stille osteotome illustration while listing both straight and curved code groups. The curved record therefore reuses the catalogue body as an explicit `acceptable-similar` asset. It is not represented as an exact curved full-body photograph, and no curvature was generated. Ahmad's approval accepts this documented fallback without changing its match grade.

| Asset ID | Codes | Match grade | Background | Review status |
|---|---|---|---|---|
| `chisels-stille-osteotomes-straight` | `36-6901`–`36-6905`, `36-6940`–`36-6949` | strong-match | transparent | approved |
| `chisels-stille-osteotomes-curved` | `36-6911`–`36-6915` | acceptable-similar | transparent | approved |
| `chisels-stille-gouges-straight` | `36-6921`–`36-6925`, `36-6950`–`36-6959` | strong-match | transparent | approved |
| `chisels-stille-chisels-straight` | `36-6931`–`36-6935` | strong-match | transparent | approved |

## Final review decision

Ahmad approved all 16 Chisels Batch 01 assets on 2026-08-03 at 21:10 PKT.

- `approved`: 16
- `accepted-fallback`: 0 as a separate review status; the curved Stille asset remains explicitly graded `acceptable-similar`.
- `needs-replacement`: 0

Approval does not convert the curved Stille fallback into an exact match, alter source rights, authorize Supabase transfer, or authorize merge/deployment. Those actions require separate approval.
