# Scissors Batch 01 Wave 3 — Operating Scissors Source Ledger

Status: isolated preview candidates; not merged, deployed, approved, or transferred to Supabase.

## Client catalogue page 2 — Operating

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF page: 3.
- Printed catalogue page: 2.
- Configurations: 18 visible groups from three finishes, two directions, and three point styles.
- Sizes grouped under each visible configuration: 12 cm, 14 cm, and 17 cm.
- Finish-specific bodies: Regular, Super Cut, and Tungsten Carbide.
- Point styles: Sharp/Sharp, Sharp/Blunt, and Blunt/Blunt.
- Directions: Straight and Curved.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade replacement, point replacement, joint replacement, or handle replacement.

## Exact Regular supplier source

- Product page: `https://www.mpmmedicalsupply.com/products/operating-scissors`
- Rights mode: `supplier-fallback`, explicitly authorized for cases where a suitable commercially reusable image is unavailable.
- Use: six Regular Operating Scissors candidates, one exact supplier photograph for every direction and point-style combination.
- Processing: download the source photograph, remove only its near-white background, rotate the complete instrument so the working end points toward the upper-right, proportionally scale, and center on a transparent 1800 x 1800 canvas.
- Review status: `candidate`; supplier sourcing does not imply ownership or unrestricted reuse rights.

| Direction | Point style | Original image URL |
|---|---|---|
| Straight | Blunt/Blunt | `https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-blunt-blunt_700x700.jpg?v=1537150721` |
| Straight | Sharp/Blunt | `https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-sharp-blunt_700x700.jpg?v=1537150736` |
| Straight | Sharp/Sharp | `https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-straight-sharp-sharp_700x700.jpg?v=1537150751` |
| Curved | Blunt/Blunt | `https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-blunt-blunt_700x700.jpg?v=1537150765` |
| Curved | Sharp/Blunt | `https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-sharp-blunt_700x700.jpg?v=1537150810` |
| Curved | Sharp/Sharp | `https://www.mpmmedicalsupply.com/cdn/shop/products/operating-scissor-curved-sharp-sharp_700x700.jpg?v=1537150798` |

## Super Cut and Tungsten Carbide review montages

- Rights mode: `preferred-safe` because the full finish-specific body comes from the client-supplied catalogue.
- Tip-detail source: the exact direction and point-style supplier photograph listed above.
- Use: twelve review montages — six Super Cut and six Tungsten Carbide.
- Composition: one finish-specific full body plus one separate exact tip-detail inset.
- Match grade: `acceptable-similar`; the images are not represented as exact standalone supplier photographs of the complete Super Cut or TC configuration.
- Background: transparent.
- Review status: `candidate`.

## Configuration and code matrix

| Finish | Direction | Point style | Catalogue codes | Match grade | Source method |
|---|---|---|---|---|---|
| Regular | Straight | Sharp/Sharp | `04-0121`, `04-0101`, `04-0102` | strong-match | Exact supplier photograph |
| Regular | Curved | Sharp/Sharp | `04-0131`, `04-0111`, `04-0112` | strong-match | Exact supplier photograph |
| Regular | Straight | Sharp/Blunt | `04-0221`, `04-0201`, `04-0202` | strong-match | Exact supplier photograph |
| Regular | Curved | Sharp/Blunt | `04-0231`, `04-0211`, `04-0212` | strong-match | Exact supplier photograph |
| Regular | Straight | Blunt/Blunt | `04-0321`, `04-0301`, `04-0302` | strong-match | Exact supplier photograph |
| Regular | Curved | Blunt/Blunt | `04-0331`, `04-0311`, `04-0312` | strong-match | Exact supplier photograph |
| Super Cut | Straight | Sharp/Sharp | `05-0121`, `05-0101`, `05-0102` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Super Cut | Curved | Sharp/Sharp | `05-0131`, `05-0111`, `05-0112` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Super Cut | Straight | Sharp/Blunt | `05-0221`, `05-0201`, `05-0202` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Super Cut | Curved | Sharp/Blunt | `05-0231`, `05-0211`, `05-0212` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Super Cut | Straight | Blunt/Blunt | `05-0321`, `05-0301`, `05-0302` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Super Cut | Curved | Blunt/Blunt | `05-0331`, `05-0311`, `05-0312` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Tungsten Carbide | Straight | Sharp/Sharp | `06-0121`, `06-0101`, `06-0102` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Tungsten Carbide | Curved | Sharp/Sharp | `06-0131`, `06-0111`, `06-0112` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Tungsten Carbide | Straight | Sharp/Blunt | `06-0221`, `06-0201`, `06-0202` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Tungsten Carbide | Curved | Sharp/Blunt | `06-0231`, `06-0211`, `06-0212` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Tungsten Carbide | Straight | Blunt/Blunt | `06-0321`, `06-0301`, `06-0302` | acceptable-similar | Client catalogue body + exact supplier tip inset |
| Tungsten Carbide | Curved | Blunt/Blunt | `06-0331`, `06-0311`, `06-0312` | acceptable-similar | Client catalogue body + exact supplier tip inset |

## Reproduction

Run from the RosaMedical repository root after extracting the supplied source-page ZIP:

```powershell
python -m pip install Pillow pillow-avif-plugin
python apps/web/scripts/prepare_scissors_wave3.py --self-test
python apps/web/scripts/prepare_scissors_wave3.py --repo-root .
```

Generated review files are written under ignored `apps/web/local-data/catalogue-review/scissors-wave3/`. Runtime AVIF and WebP files are written under `apps/web/public/media/catalogue-preview/scissors/`.

## Review gate

Each candidate must be classified as one of:

- `approved`
- `accepted-fallback`
- `needs-replacement`

No candidate is represented as final production media before that review.
