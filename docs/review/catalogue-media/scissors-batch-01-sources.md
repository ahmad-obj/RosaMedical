# Scissors Batch 01 Source and Review Ledger

Status: isolated preview work; not merged, deployed, or approved for Supabase.

## Client catalogue page 1

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF page: 2.
- Printed catalogue page: 1.
- Families represented: Iris Scissors and Stevens Scissors.
- Rights mode: `preferred-safe` because the source is client-supplied catalogue material.
- Extraction: original PDF image objects were recovered with their soft masks, preserving source alpha and instrument geometry.
- Processing: finish-specific full instruments were combined with the catalogue's own straight or curved tip inset, rotated, proportionally scaled, and centered on a transparent 1800 x 1800 canvas.
- Geometry policy: no generative editing, stretching, reshaping, or fabricated blades, tips, handles, or finishes.
- Catalogue correction: Iris is the `0901/0911` series at 10.5 cm; Stevens is the `0800/0810/0802/0812` series at 9.5 cm and 11.5 cm.

## Wave 1 candidates

| Asset ID | Catalogue codes | Match grade | Background | Review status | Notes |
|---|---|---|---|---|---|
| `scissors-iris-regular-straight` | `04-0901` | strong-match | transparent | candidate | Exact Regular catalogue body with straight tip inset. |
| `scissors-iris-regular-curved` | `04-0911` | acceptable-similar | transparent | candidate | Exact Regular catalogue body with curved tip inset; full-body direction remains representative. |
| `scissors-iris-super-cut-straight` | `05-0901` | strong-match | transparent | candidate | Exact Super Cut catalogue body with straight tip inset. |
| `scissors-iris-super-cut-curved` | `05-0911` | acceptable-similar | transparent | candidate | Exact Super Cut catalogue body with curved tip inset; full-body direction remains representative. |
| `scissors-iris-tungsten-carbide-straight` | `06-0901` | strong-match | transparent | candidate | Exact TC catalogue body with straight tip inset. |
| `scissors-iris-tungsten-carbide-curved` | `06-0911` | acceptable-similar | transparent | candidate | Exact TC catalogue body with curved tip inset; full-body direction remains representative. |
| `scissors-stevens-regular-straight` | `04-0800`, `04-0802` | strong-match | transparent | candidate | Exact Regular catalogue body with straight tip inset. |
| `scissors-stevens-regular-curved` | `04-0810`, `04-0812` | acceptable-similar | transparent | candidate | Exact Regular catalogue body with curved tip inset; full-body direction remains representative. |
| `scissors-stevens-super-cut-straight` | `05-0800`, `05-0802` | strong-match | transparent | candidate | Exact Super Cut catalogue body with straight tip inset. |
| `scissors-stevens-super-cut-curved` | `05-0810`, `05-0812` | acceptable-similar | transparent | candidate | Exact Super Cut catalogue body with curved tip inset; full-body direction remains representative. |
| `scissors-stevens-tungsten-carbide-straight` | `06-0800`, `06-0802` | strong-match | transparent | candidate | Exact TC catalogue body with straight tip inset. |
| `scissors-stevens-tungsten-carbide-curved` | `06-0810`, `06-0812` | acceptable-similar | transparent | candidate | Exact TC catalogue body with curved tip inset; full-body direction remains representative. |

## Client catalogue pages 2 and 3

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF pages: 3 and 4.
- Printed catalogue pages: 2 and 3.
- Families represented: Mayo Scissors and Metzenbaum Scissors.
- Rights mode: `preferred-safe` because the generated derivatives use client-supplied catalogue material.
- Processing: each finish-specific full instrument was isolated from the rendered catalogue, cleaned without altering geometry, rotated so the working end points toward the upper-right, proportionally scaled, and centered on a transparent 1800 x 1800 canvas.
- Direction limitation: the catalogue lists separate straight and curved codes, but it does not provide a separate full-body photograph for every direction. The curved derivatives therefore remain `acceptable-similar` review candidates and are not represented as exact curved photographs.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade replacement, handle replacement, or direction fabrication.
- External comparison: official KLS Martin records were checked for the selected Mayo and Metzenbaum Regular, Super Cut, and TC configurations. Their protected source-image endpoints could not be retrieved reliably in this execution environment, so those pages are comparison references only and are not claimed as the source of the committed derivatives.

### External comparison pages

- Mayo Regular Straight: `https://www.klsmartin.com/shop/en/products/product/11-170-17-07/`
- Mayo Regular Curved: `https://www.klsmartin.com/shop/en/products/product/11-171-17-07/`
- Mayo Super Cut Straight: `https://www.klsmartin.com/shop/en/products/product/11-652-17-07/`
- Mayo Super Cut Curved: `https://www.klsmartin.com/shop/en/products/product/11-653-17-07/`
- Mayo Tungsten Carbide Straight: `https://www.klsmartin.com/shop/en/products/product/11-910-17-07/`
- Mayo Tungsten Carbide Curved: `https://www.klsmartin.com/shop/en/products/product/11-911-17-07/`
- Metzenbaum Regular Straight: `https://www.klsmartin.com/shop/en/products/product/11-280-18-07/`
- Metzenbaum Regular Curved: `https://www.klsmartin.com/shop/en/products/product/11-285-18-07/`
- Metzenbaum Super Cut Straight: `https://www.klsmartin.com/shop/en/products/product/11-660-18-07/`
- Metzenbaum Super Cut Curved: `https://www.klsmartin.com/shop/en/products/product/11-661-18-07/`
- Metzenbaum Tungsten Carbide Straight: `https://www.klsmartin.com/shop/en/products/product/11-942-18-07/`
- Metzenbaum Tungsten Carbide Curved: `https://www.klsmartin.com/shop/en/products/product/11-943-18-07/`

## Wave 2 candidates

| Asset ID | Catalogue codes | Match grade | Background | Review status | Notes |
|---|---|---|---|---|---|
| `scissors-mayo-regular-straight` | `04-0401`, `04-0402`, `04-0403`, `04-0404` | strong-match | transparent | candidate | Exact Mayo Regular catalogue body; reused only across listed sizes. |
| `scissors-mayo-regular-curved` | `04-0411`, `04-0412`, `04-0413`, `04-0414` | acceptable-similar | transparent | candidate | Mayo Regular family and finish match; separate exact curved full-body photograph still required for final approval. |
| `scissors-mayo-super-cut-straight` | `05-0401`, `05-0402`, `05-0403`, `05-0404` | strong-match | transparent | candidate | Exact Mayo Super Cut catalogue body; reused only across listed sizes. |
| `scissors-mayo-super-cut-curved` | `05-0411`, `05-0412`, `05-0413`, `05-0414` | acceptable-similar | transparent | candidate | Mayo Super Cut family and finish match; separate exact curved full-body photograph still required for final approval. |
| `scissors-mayo-tungsten-carbide-straight` | `06-0401`, `06-0402`, `06-0403`, `06-0404` | strong-match | transparent | candidate | Exact Mayo TC catalogue body; reused only across listed sizes. |
| `scissors-mayo-tungsten-carbide-curved` | `06-0411`, `06-0412`, `06-0413`, `06-0414` | acceptable-similar | transparent | candidate | Mayo TC family and finish match; separate exact curved full-body photograph still required for final approval. |
| `scissors-metzenbaum-regular-straight` | `04-1901`, `04-1902`, `04-1909`, `04-1903`, `04-1904`, `04-1905` | strong-match | transparent | candidate | Exact Metzenbaum Regular catalogue body; reused only across listed sizes. |
| `scissors-metzenbaum-regular-curved` | `04-1911`, `04-1912`, `04-1919`, `04-1913`, `04-1914`, `04-1915` | acceptable-similar | transparent | candidate | Metzenbaum Regular family and finish match; separate exact curved full-body photograph still required for final approval. |
| `scissors-metzenbaum-super-cut-straight` | `05-1901`, `05-1902`, `05-1909`, `05-1903`, `05-1904`, `05-1905` | strong-match | transparent | candidate | Exact Metzenbaum Super Cut catalogue body; reused only across listed sizes. |
| `scissors-metzenbaum-super-cut-curved` | `05-1911`, `05-1912`, `05-1919`, `05-1913`, `05-1914`, `05-1915` | acceptable-similar | transparent | candidate | Metzenbaum Super Cut family and finish match; separate exact curved full-body photograph still required for final approval. |
| `scissors-metzenbaum-tungsten-carbide-straight` | `06-1901`, `06-1902`, `06-1909`, `06-1903`, `06-1904`, `06-1905` | strong-match | transparent | candidate | Exact Metzenbaum TC catalogue body; reused only across listed sizes. |
| `scissors-metzenbaum-tungsten-carbide-curved` | `06-1911`, `06-1912`, `06-1919`, `06-1913`, `06-1914`, `06-1915` | acceptable-similar | transparent | candidate | Metzenbaum TC family and finish match; separate exact curved full-body photograph still required for final approval. |

## Review gate

Ahmad must classify each candidate as one of:

- `approved`
- `accepted-fallback`
- `needs-replacement`

No candidate is represented as final production media before that review.
