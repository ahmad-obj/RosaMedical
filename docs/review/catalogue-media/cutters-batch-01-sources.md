# Cutters Batch 01 Source and Review Ledger

Status: Ahmad approved all 13 reviewed assets on 2026-08-03; the batch remains isolated on the preview branch and has not been merged, deployed, or transferred to Supabase.

## Batch scope

- Source file: `Cutters Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF pages: 2, 3, and 4.
- Printed catalogue pages: 1, 2, and 3.
- Visible configurations: 13.
- Exact catalogue codes: 22.
- Runtime derivatives: 26 — 13 AVIF and 13 WebP.
- Rights mode: `preferred-safe` because every derivative is produced from client-supplied catalogue material.
- Geometry policy: no generative editing, non-uniform scaling, stretching, cutting-end replacement, handle replacement, or fabricated curvature/angling.
- Processing policy: isolate the catalogue instrument, remove the page background, rotate the complete instrument so the working end points toward the upper-right, scale proportionally, and center on a transparent 1800 x 1800 canvas.
- Direction policy: where the catalogue supplies one shared full-body illustration plus labelled working-end schematics, preserve the shared body and retain the relevant schematic as a secondary inset. Do not fabricate a new full body.

## Client catalogue page 1

Catalogue groups:

- Liston Straight — `36-5101` through `36-5104`, 14.0 cm through 22.0 cm.
- Liston Curved — `36-5111` through `36-5114`, 14.0 cm through 22.0 cm.
- Cleveland — `36-5401` and `36-5402`, 15.0 cm and 17.0 cm.
- Bohler Straight — `36-5501`, 15.0 cm.
- Bohler Curved — `36-5511`, 15.0 cm.

The catalogue provides one full-body Liston illustration for both direction groups with no separate labelled full-body direction images. Both Liston records therefore remain transparently graded `acceptable-similar` despite approval.

The Bohler curved record uses the shared catalogue body with the catalogue curved working-end schematic. No curved full body was generated.

| Asset ID | Codes | Match grade | Background | Review status |
|---|---|---|---|---|
| `cutters-liston-straight` | `36-5101`–`36-5104` | acceptable-similar | transparent | approved |
| `cutters-liston-curved` | `36-5111`–`36-5114` | acceptable-similar | transparent | approved |
| `cutters-cleveland` | `36-5401`, `36-5402` | strong-match | transparent | approved |
| `cutters-bohler-straight` | `36-5501` | strong-match | transparent | approved |
| `cutters-bohler-curved` | `36-5511` | acceptable-similar | transparent | approved |

## Client catalogue page 2

Catalogue groups:

- Mc Indoe — `36-5600`, 17.5 cm.
- Ruskin-Liston Straight — `36-5701`, 18.5 cm.
- Ruskin-Liston Curved — `36-5711`, 18.5 cm.
- Ruskin-Rowland Straight — `36-5801`, 17.0 cm.
- Ruskin-Rowland Angled to side — `36-5811`, 17.0 cm.

The Ruskin-Liston and Ruskin-Rowland direction records reuse their respective catalogue full-body illustrations. The listed direction is represented by the exact catalogue working-end schematic retained beside the body. Curved and angled full bodies were not fabricated.

| Asset ID | Codes | Match grade | Background | Review status |
|---|---|---|---|---|
| `cutters-mc-indoe` | `36-5600` | strong-match | transparent | approved |
| `cutters-ruskin-liston-straight` | `36-5701` | strong-match | transparent | approved |
| `cutters-ruskin-liston-curved` | `36-5711` | acceptable-similar | transparent | approved |
| `cutters-ruskin-rowland-straight` | `36-5801` | strong-match | transparent | approved |
| `cutters-ruskin-rowland-angled-to-side` | `36-5811` | acceptable-similar | transparent | approved |

## Client catalogue page 3

Catalogue groups:

- Stille-Liston Straight — `36-5901` and `36-5902`, 23.0 cm and 27.0 cm.
- Stille-Liston Curved — `36-5911` and `36-5912`, 23.0 cm and 27.0 cm.
- Distinct Stille-Liston catalogue record — `36-6000`, 27.0 cm.

The Straight and Curved 36-59xx records share one catalogue full body and use the exact catalogue working-end schematics as insets. The `36-6000` record has its own distinct full-body illustration and is preserved as a separate visible configuration without inventing an unsupported direction label.

| Asset ID | Codes | Match grade | Background | Review status |
|---|---|---|---|---|
| `cutters-stille-liston-straight` | `36-5901`, `36-5902` | strong-match | transparent | approved |
| `cutters-stille-liston-curved` | `36-5911`, `36-5912` | acceptable-similar | transparent | approved |
| `cutters-stille-liston-36-6000` | `36-6000` | strong-match | transparent | approved |

## Review gate

Decision: Ahmad approved all 13 reviewed Cutters Batch 01 assets on 2026-08-03.

- `approved`: 13
- `accepted-fallback`: 0
- `needs-replacement`: 0

All shared-full-body limitations remain visible in this ledger. Approval records acceptance of the reviewed catalogue-derived assets; it does not convert `acceptable-similar` records into exact matches or authorize deployment, merge, or Supabase transfer.
