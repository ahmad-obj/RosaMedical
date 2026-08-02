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

## Wave 1 candidates

| Asset ID | Catalogue codes | Match grade | Background | Review status | Notes |
|---|---|---|---|---|---|
| `scissors-iris-regular-straight` | `04-0800`, `04-0802` | strong-match | transparent | candidate | Exact Regular catalogue body with exact straight tip inset. |
| `scissors-iris-regular-curved` | `04-0810`, `04-0812` | acceptable-similar | transparent | candidate | Exact Regular catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-iris-super-cut-straight` | `05-0800`, `05-0802` | strong-match | transparent | candidate | Exact Super Cut catalogue body with exact straight tip inset. |
| `scissors-iris-super-cut-curved` | `05-0810`, `05-0812` | acceptable-similar | transparent | candidate | Exact Super Cut catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-iris-tungsten-carbide-straight` | `06-0800`, `06-0802` | strong-match | transparent | candidate | Exact TC catalogue body with exact straight tip inset. |
| `scissors-iris-tungsten-carbide-curved` | `06-0810`, `06-0812` | acceptable-similar | transparent | candidate | Exact TC catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-stevens-regular-straight` | `04-0901` | strong-match | transparent | candidate | Exact Regular catalogue body with exact straight tip inset. |
| `scissors-stevens-regular-curved` | `04-0911` | acceptable-similar | transparent | candidate | Exact Regular catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-stevens-super-cut-straight` | `05-0901` | strong-match | transparent | candidate | Exact Super Cut catalogue body with exact straight tip inset. |
| `scissors-stevens-super-cut-curved` | `05-0911` | acceptable-similar | transparent | candidate | Exact Super Cut catalogue body with exact curved tip inset; full-body direction remains representative. |
| `scissors-stevens-tungsten-carbide-straight` | `06-0901` | strong-match | transparent | candidate | Exact TC catalogue body with exact straight tip inset. |
| `scissors-stevens-tungsten-carbide-curved` | `06-0911` | acceptable-similar | transparent | candidate | Exact TC catalogue body with exact curved tip inset; full-body direction remains representative. |

## Review gate

Ahmad must classify each candidate as one of:

- `approved`
- `accepted-fallback`
- `needs-replacement`

No candidate is represented as final production media before that review.
