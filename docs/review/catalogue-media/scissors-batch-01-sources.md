# Scissors Batch 01 Source and Review Ledger

Status: isolated preview work; not merged, deployed, or approved for Supabase.

## Client catalogue page 1

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF page: 2.
- Printed catalogue page: 1.
- Families represented: Iris Scissors and Stevens Scissors.
- Rights mode: `preferred-safe` because the source is client-supplied catalogue material.
- Extraction: original PDF image objects were recovered with their soft masks, preserving source alpha and instrument geometry.
- Processing: finish-specific full instruments were combined with the catalogue's own straight or curved tip inset, rotated 180 degrees, proportionally scaled, and centered on a transparent 1800 × 1800 canvas.
- Geometry policy: no generative editing, stretching, reshaping, or fabricated blades, tips, handles, or finishes.
- Live web-source comparison: attempted on 2026-08-02, but the browsing service returned HTTP 503 for search and direct page opens. These catalogue-derived files remain candidates until Ahmad reviews them and web comparison can be retried.
- Catalogue correction: Iris is the `0901/0911` series at 10.5 cm; Stevens is the `0800/0810/0802/0812` series at 9.5 cm and 11.5 cm.

## Wave 1 candidates

| Asset ID | Catalogue codes | Match grade | Background | Review status | Notes |
|---|---|---|---|---|---|
| `scissors-iris-regular-straight` | `04-0901` | strong-match | transparent | candidate | Exact Regular catalogue body with exact straight tip inset. |
| `scissors-iris-regular-curved` | `04-0911` | acceptable-similar | transparent | candidate | Exact Regular catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-iris-super-cut-straight` | `05-0901` | strong-match | transparent | candidate | Exact Super Cut catalogue body with exact straight tip inset. |
| `scissors-iris-super-cut-curved` | `05-0911` | acceptable-similar | transparent | candidate | Exact Super Cut catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-iris-tungsten-carbide-straight` | `06-0901` | strong-match | transparent | candidate | Exact TC catalogue body with exact straight tip inset. |
| `scissors-iris-tungsten-carbide-curved` | `06-0911` | acceptable-similar | transparent | candidate | Exact TC catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-stevens-regular-straight` | `04-0800`, `04-0802` | strong-match | transparent | candidate | Exact Regular catalogue body with exact straight tip inset. |
| `scissors-stevens-regular-curved` | `04-0810`, `04-0812` | acceptable-similar | transparent | candidate | Exact Regular catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-stevens-super-cut-straight` | `05-0800`, `05-0802` | strong-match | transparent | candidate | Exact Super Cut catalogue body with exact straight tip inset. |
| `scissors-stevens-super-cut-curved` | `05-0810`, `05-0812` | acceptable-similar | transparent | candidate | Exact Super Cut catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-stevens-tungsten-carbide-straight` | `06-0800`, `06-0802` | strong-match | transparent | candidate | Exact TC catalogue body with exact straight tip inset. |
| `scissors-stevens-tungsten-carbide-curved` | `06-0810`, `06-0812` | acceptable-similar | transparent | candidate | Exact TC catalogue body with exact curved tip inset; full-body direction remains representative. |

## Wave 2 supplier sourcing

- Families represented: Mayo Scissors and Metzenbaum Scissors.
- Source: official KLS Martin product records selected separately for Regular, Super Cut, TC Gold, Straight, and Curved configurations.
- Rights mode: `supplier-fallback`, as explicitly authorized by Ahmad when a suitable commercially reusable image is unavailable.
- Match policy: `strong-match`. The supplier page identifies the exact family, finish class, and direction, but KLS Martin notes that catalogue images may differ from the actual product.
- Processing: the source product image is downloaded from the official product page, cropped against its clean white background, aligned by a deterministic principal-axis calculation, proportionally scaled, and centered on an 1800 × 1800 white canvas.
- Background policy: `clean-white` is retained instead of aggressive background removal because reflective steel edges and fine tips can be damaged by threshold cutouts.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade replacement, handle replacement, or direction fabrication.
- The preparation script writes the resolved original image URLs to `docs/review/catalogue-media/scissors-batch-01-wave2-downloads.md` when run from a network-enabled local checkout.

## Wave 2 candidates

| Asset ID | Official supplier page | Match grade | Background | Review status |
|---|---|---|---|---|
| `scissors-mayo-regular-straight` | `https://www.klsmartin.com/shop/en/products/product/11-170-17-07/` | strong-match | clean-white | candidate |
| `scissors-mayo-regular-curved` | `https://www.klsmartin.com/shop/en/products/product/11-171-17-07/` | strong-match | clean-white | candidate |
| `scissors-mayo-super-cut-straight` | `https://www.klsmartin.com/shop/en/products/product/11-652-17-07/` | strong-match | clean-white | candidate |
| `scissors-mayo-super-cut-curved` | `https://www.klsmartin.com/shop/en/products/product/11-653-17-07/` | strong-match | clean-white | candidate |
| `scissors-mayo-tungsten-carbide-straight` | `https://www.klsmartin.com/shop/en/products/product/11-910-17-07/` | strong-match | clean-white | candidate |
| `scissors-mayo-tungsten-carbide-curved` | `https://www.klsmartin.com/shop/en/products/product/11-911-17-07/` | strong-match | clean-white | candidate |
| `scissors-metzenbaum-regular-straight` | `https://www.klsmartin.com/shop/en/products/product/11-280-18-07/` | strong-match | clean-white | candidate |
| `scissors-metzenbaum-regular-curved` | `https://www.klsmartin.com/shop/en/products/product/11-285-18-07/` | strong-match | clean-white | candidate |
| `scissors-metzenbaum-super-cut-straight` | `https://www.klsmartin.com/shop/en/products/product/11-660-18-07/` | strong-match | clean-white | candidate |
| `scissors-metzenbaum-super-cut-curved` | `https://www.klsmartin.com/shop/en/products/product/11-661-18-07/` | strong-match | clean-white | candidate |
| `scissors-metzenbaum-tungsten-carbide-straight` | `https://www.klsmartin.com/shop/en/products/product/11-942-18-07/` | strong-match | clean-white | candidate |
| `scissors-metzenbaum-tungsten-carbide-curved` | `https://www.klsmartin.com/shop/en/products/product/11-943-18-07/` | strong-match | clean-white | candidate |

## Review gate

Ahmad must classify each candidate as one of:

- `approved`
- `accepted-fallback`
- `needs-replacement`

No candidate is represented as final production media before that review.
