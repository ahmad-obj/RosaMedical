# Punches Batch 01 Source and Review Ledger

Status: Ahmad approved all 14 reviewed assets on 2026-08-04; the branch remains isolated and is not merged, deployed, transferred to Supabase, or persisted through the backend.

## Batch scope

- Source file: `Punches Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF pages: 2, 3, and 4.
- Printed catalogue pages: 1, 2, and 3.
- Visible configurations: 14.
- Exact catalogue codes: 32.
- Runtime derivatives: 28 — 14 AVIF and 14 WebP.
- Rights mode: `preferred-safe` because every derivative is produced from client-supplied catalogue material.
- Geometry policy: no generative editing, redrawing, non-uniform scaling, shaft replacement, jaw replacement, curvature fabrication, serration fabrication, or cross-group working-end reuse.
- Processing policy: isolate the exact catalogue body and associated printed working-end detail, remove the page background, scale proportionally, and compose on a transparent 1800 × 1800 canvas.
- Grouping policy: group only unchanged visible configurations whose catalogue codes differ by shaft length or printed opening size.

## Client catalogue page 1

| Asset ID | Codes | Catalogue length | Match grade | Review status |
|---|---|---|---|---|
| `punches-yeoman-21-10` | `21-1001`–`21-1003` | 28.0–42.0 cm | strong-match | approved |
| `punches-yeoman-21-11` | `21-1101`–`21-1103` | 28.0–42.0 cm | strong-match | approved |
| `punches-yeoman-21-12` | `21-1201`–`21-1203` | 28.0–42.0 cm | strong-match | approved |
| `punches-yeoman-21-13` | `21-1301`–`21-1303` | 28.0–42.0 cm | strong-match | approved |

The catalogue shows one Yeoman body and four visibly distinct working-end groups. It does not print separate morphology names for the four groups, so the public records use conservative code-group labels. Each group retains only its own exact printed working-end detail.

## Client catalogue page 2

| Asset ID | Codes | Catalogue length | Match grade | Review status |
|---|---|---|---|---|
| `punches-yeoman-21-14` | `21-1401`–`21-1403` | 28.0–40.0 cm | strong-match | approved |
| `punches-yeoman-21-15` | `21-1501`–`21-1503` | 28.0–40.0 cm | strong-match | approved |
| `punches-turrel-21-16` | `21-1601`–`21-1603` | 28.0–40.0 cm | strong-match | approved |
| `punches-turrel-21-17` | `21-1701`–`21-1703` | 28.0–40.0 cm | strong-match | approved |

The page presents one 360-degree turnable body with two Yeoman and two Turrel working-end groups. Shaft-length-only variants are grouped; visibly distinct working ends remain separate products.

## Client catalogue page 3

| Asset ID | Codes | Catalogue specification | Match grade | Review status |
|---|---|---|---|---|
| `punches-fahlbusch` | `38-2401` | Horizontal cutting; 16.5 cm Nicola context | strong-match | approved |
| `punches-nicola-spoon-shaped` | `38-2410` | Spoon-shaped; 16.5 cm Nicola context | strong-match | approved |
| `punches-nicola-biopsy-straight` | `38-2402` | Biopsy straight; 16.5 cm Nicola context | strong-match | approved |
| `punches-yasargil-nicola` | `038-2420` | Yasargil-Nicola; 16.5 cm Nicola context | strong-match | approved |
| `punches-citelly` | `38-2501`–`38-2503` | 1.0–3.0 mm openings; 8.0 cm shaft | strong-match | approved |
| `punches-beyer` | `38-2510` | 1.5 mm opening; 9.5 cm shaft | strong-match | approved |

The four named Nicola-context records retain the complete body context with their exact printed tip detail. Citelly groups only the three listed opening-size variants because the catalogue shows one unchanged body. Beyer remains separate because its complete body geometry differs.

## Route preservation

The Batch 01 registry upgrades these existing routes in place:

- `/products/punches/yeoman`
- `/products/punches/yeoman-perforated`
- `/products/punches/yeoman-rectangular`

The unrelated existing `/products/punches/biopsy-punch` record remains preserved without Batch 01 media. Public Punches total after integration: 15.

## Review gate

Ahmad approved all 14 reviewed assets on 2026-08-04.

- Approved: 14
- Accepted fallback: 0
- Needs replacement: 0
- Candidate: 0

Approval does not change the recorded match grade and does not authorize merge, deployment, Supabase transfer, or backend persistence.
