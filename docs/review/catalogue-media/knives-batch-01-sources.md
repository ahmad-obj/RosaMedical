# Knives Batch 01 Source and Review Ledger

Status: approved isolated preview media; not merged, deployed, or transferred to Supabase.

## Batch scope

- Source file: `Knives Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF pages: 2, 3, and 4.
- Printed catalogue pages: 1, 2, and 3.
- Visible configurations: 18.
- Exact catalogue codes: 32.
- Runtime derivatives: 36 — 18 AVIF and 18 WebP.
- Rights mode: `preferred-safe` because every derivative is produced from client-supplied catalogue material.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade-fitting replacement, handle replacement, curvature fabrication, or interchangeable-tip fabrication.
- Processing policy: isolate the exact catalogue instrument or printed set, remove the page background, rotate single instruments proportionally where practical, and center on a transparent 1800 × 1800 canvas.
- Grouping policy: group only codes that share one visible catalogue configuration. Distinct body and handle geometries remain separate products.

## Client catalogue page 1

| Asset ID | Codes | Catalogue size | Match grade | Review status |
|---|---|---|---|---|
| `knives-number-3` | `18-0103`, `18-0103S` | 12.0 cm | strong-match | approved |
| `knives-number-4` | `18-0104`, `18-0104S` | 13.0 cm | strong-match | approved |
| `knives-number-7` | `18-0107` | 16.0 cm | strong-match | approved |
| `knives-micro-surgery-handle` | `18-0202` | 15.5 cm | strong-match | approved |
| `knives-number-3-long` | `18-0103L` | 21.0 cm | strong-match | approved |
| `knives-number-3-long-curved` | `18-0113L` | 20.5 cm | strong-match | approved |
| `knives-number-4-long` | `18-0104L` | 21.0 cm | strong-match | approved |
| `knives-liston` | `18-0401`–`18-0404` | 13.0–21.5 cm | strong-match | approved |

The No. 3 and No. 4 records each retain the two catalogue codes printed under one visible handle configuration. Liston groups only its four listed size variants.

## Client catalogue page 2

| Asset ID | Codes | Catalogue size | Match grade | Review status |
|---|---|---|---|---|
| `knives-number-9` | `18-0109` | 12.0 cm | strong-match | approved |
| `knives-hexagonal` | `18-0646` | 16.0 cm | strong-match | approved |
| `knives-round-straight` | `18-0644` | 14.5 cm | strong-match | approved |
| `knives-round-curved` | `18-0645` | 14.5 cm | strong-match | approved |
| `knives-long-handle` | `18-0647` | 16.0 cm | strong-match | approved |
| `knives-short-handle` | `18-0648` | 10.0 cm | strong-match | approved |

The straight and curved round handles remain separate because the catalogue shows distinct full-body direction geometry. Long and Short adjustable handles remain separate and retain the detachable head shown with each catalogue body.

## Client catalogue page 3

| Asset ID | Codes | Catalogue size | Match grade | Review status |
|---|---|---|---|---|
| `knives-saalfeld-comedo-extractor` | `19-0400` | 14.0 cm | strong-match | approved |
| `knives-fox-lupus-curettes` | `19-0503`–`19-0506` | 3–6 mm working ends | strong-match | approved |
| `knives-keyes-dermal-punches` | `19-0702`–`19-0708` | 2–8 mm diameters | strong-match | approved |
| `knives-keyes-dermal-punch-set` | `19-0800` | 19.0 cm | strong-match | approved |

Fox retains the full-body instrument and all four exact printed working-end sizes in one grouped configuration. Keyes individual punches retain the body and all seven printed diameter references. The Keyes set preserves the photographed rack, handle, and six interchangeable tips as one catalogue set.

## Review decision

Ahmad reviewed the generated contact sheet after the focused 28-test Vitest gate and six responsive Playwright checks passed. On 2026-08-04 he approved all 18 assets with no accepted fallbacks and no requested replacements.

Approval does not alter the recorded match grades and does not authorize merge, deployment, or Supabase transfer.
