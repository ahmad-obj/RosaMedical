# Scissors Batch 01 Source and Review Ledger

Status: all Iris, Stevens, Mayo, and Metzenbaum assets approved by Ahmad on 2026-08-03 at 18:53 PKT. This remains isolated preview-branch work; it has not been merged, deployed, or transferred to Supabase.

## Final review decisions

| Review gate | Configurations | Decision | Needs replacement |
|---|---:|---|---|
| Iris and Stevens | 12 | approved | none |
| Mayo and Metzenbaum | 12 | approved | none |

The `approved` decision accepts the documented match grades and source limitations below. It does not change `acceptable-similar` assets into exact photographs and does not make a new rights-clearance claim.

## Client catalogue page 1 — Iris and Stevens

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF page: 2; printed catalogue page: 1.
- Rights mode: `preferred-safe` because the source is client-supplied catalogue material.
- Extraction: original PDF image objects and soft masks were recovered while preserving source alpha and instrument geometry.
- Processing: finish-specific full instruments were combined with the catalogue's own straight or curved tip inset, rotated, proportionally scaled, and centered on a transparent 1800 x 1800 canvas.
- Geometry policy: no generative editing, stretching, reshaping, or fabricated blades, tips, handles, or finishes.
- Catalogue correction: Iris is the `0901/0911` series at 10.5 cm; Stevens is the `0800/0810/0802/0812` series at 9.5 cm and 11.5 cm.

| Asset ID | Catalogue codes | Match grade | Background | Final status |
|---|---|---|---|---|
| `scissors-iris-regular-straight` | `04-0901` | strong-match | transparent | approved |
| `scissors-iris-regular-curved` | `04-0911` | acceptable-similar | transparent | approved |
| `scissors-iris-super-cut-straight` | `05-0901` | strong-match | transparent | approved |
| `scissors-iris-super-cut-curved` | `05-0911` | acceptable-similar | transparent | approved |
| `scissors-iris-tungsten-carbide-straight` | `06-0901` | strong-match | transparent | approved |
| `scissors-iris-tungsten-carbide-curved` | `06-0911` | acceptable-similar | transparent | approved |
| `scissors-stevens-regular-straight` | `04-0800`, `04-0802` | strong-match | transparent | approved |
| `scissors-stevens-regular-curved` | `04-0810`, `04-0812` | acceptable-similar | transparent | approved |
| `scissors-stevens-super-cut-straight` | `05-0800`, `05-0802` | strong-match | transparent | approved |
| `scissors-stevens-super-cut-curved` | `05-0810`, `05-0812` | acceptable-similar | transparent | approved |
| `scissors-stevens-tungsten-carbide-straight` | `06-0800`, `06-0802` | strong-match | transparent | approved |
| `scissors-stevens-tungsten-carbide-curved` | `06-0810`, `06-0812` | acceptable-similar | transparent | approved |

## Client catalogue pages 2 and 3 — Mayo and Metzenbaum

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF pages: 3 and 4; printed catalogue pages: 2 and 3.
- Rights mode: `preferred-safe` because the derivatives use client-supplied catalogue material.
- Processing: each finish-specific full instrument was isolated, cleaned without altering geometry, rotated so the working end points toward the upper-right, proportionally scaled, and centered on a transparent 1800 x 1800 canvas.
- Direction limitation: the catalogue lists separate straight and curved codes but does not provide a separate full-body photograph for every direction. Curved derivatives therefore remain `acceptable-similar`; approval accepts this documented fallback and does not describe them as exact curved photographs.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade replacement, handle replacement, or direction fabrication.
- External comparison: KLS Martin product records were checked for regular, Super Cut, and tungsten-carbide Mayo and Metzenbaum forms. Their protected source-image endpoints were comparison references only and were not used as the committed image source.

| Asset ID | Catalogue codes | Match grade | Background | Final status |
|---|---|---|---|---|
| `scissors-mayo-regular-straight` | `04-0401`, `04-0402`, `04-0403`, `04-0404` | strong-match | transparent | approved |
| `scissors-mayo-regular-curved` | `04-0411`, `04-0412`, `04-0413`, `04-0414` | acceptable-similar | transparent | approved |
| `scissors-mayo-super-cut-straight` | `05-0401`, `05-0402`, `05-0403`, `05-0404` | strong-match | transparent | approved |
| `scissors-mayo-super-cut-curved` | `05-0411`, `05-0412`, `05-0413`, `05-0414` | acceptable-similar | transparent | approved |
| `scissors-mayo-tungsten-carbide-straight` | `06-0401`, `06-0402`, `06-0403`, `06-0404` | strong-match | transparent | approved |
| `scissors-mayo-tungsten-carbide-curved` | `06-0411`, `06-0412`, `06-0413`, `06-0414` | acceptable-similar | transparent | approved |
| `scissors-metzenbaum-regular-straight` | `04-1901`, `04-1902`, `04-1909`, `04-1903`, `04-1904`, `04-1905` | strong-match | transparent | approved |
| `scissors-metzenbaum-regular-curved` | `04-1911`, `04-1912`, `04-1919`, `04-1913`, `04-1914`, `04-1915` | acceptable-similar | transparent | approved |
| `scissors-metzenbaum-super-cut-straight` | `05-1901`, `05-1902`, `05-1909`, `05-1903`, `05-1904`, `05-1905` | strong-match | transparent | approved |
| `scissors-metzenbaum-super-cut-curved` | `05-1911`, `05-1912`, `05-1919`, `05-1913`, `05-1914`, `05-1915` | acceptable-similar | transparent | approved |
| `scissors-metzenbaum-tungsten-carbide-straight` | `06-1901`, `06-1902`, `06-1909`, `06-1903`, `06-1904`, `06-1905` | strong-match | transparent | approved |
| `scissors-metzenbaum-tungsten-carbide-curved` | `06-1911`, `06-1912`, `06-1919`, `06-1913`, `06-1914`, `06-1915` | acceptable-similar | transparent | approved |

## Final counts for these two gates

- Configurations: 24
- Match grades: 12 `strong-match`, 12 `acceptable-similar`, 0 `exact`
- Rights modes: 24 `preferred-safe`, 0 `supplier-fallback`
- Backgrounds: 24 `transparent`, 0 `clean-white`
- Review statuses: 24 `approved`, 0 `candidate`, 0 `needs-replacement`
