# Scissors Batch 01 Wave 3 — Operating Scissors Source Ledger

Status: all 18 Operating Scissors configurations approved by Ahmad on 2026-08-03 at 18:53 PKT. This remains isolated preview-branch work; it has not been merged, deployed, or transferred to Supabase.

## Final review decision

| Review gate | Configurations | Decision | Needs replacement |
|---|---:|---|---|
| Operating Scissors | 18 | approved | none |

The approval accepts the documented supplier fallback and montage limitations below. It does not convert `acceptable-similar` montages into exact photographs and does not create a new rights-clearance claim.

## Client catalogue page 2 — Operating

- Source file: `Scissors Catalog(1).pdf`, supplied directly by Ahmad in the Rosa Medical project.
- PDF page: 3; printed catalogue page: 2.
- Configurations: 18 visible groups from three finishes, two directions, and three point styles.
- Sizes grouped under each configuration: 12 cm, 14 cm, and 17 cm.
- Finishes: Regular, Super Cut, and Tungsten Carbide.
- Point styles: Sharp/Sharp, Sharp/Blunt, and Blunt/Blunt.
- Directions: Straight and Curved.
- Geometry policy: no generative editing, non-uniform scaling, stretching, blade replacement, point replacement, joint replacement, or handle replacement.

## Regular supplier source

- Product page: `https://www.mpmmedicalsupply.com/products/operating-scissors`
- Rights mode: `supplier-fallback`, used under the approved fallback rule where a suitable client-supplied exact full-body photograph was unavailable.
- Use: six Regular configurations, one supplier photograph for each direction and point-style combination.
- Match grade: `strong-match`.
- Processing: near-white background removal, complete-instrument rotation, proportional scaling, and centering on a transparent 1800 x 1800 canvas.

## Super Cut and Tungsten Carbide montages

- Rights mode: `preferred-safe` because each finish-specific full body comes from the client-supplied catalogue.
- Tip-detail source: the corresponding direction and point-style supplier photograph from the Regular set.
- Use: twelve montages — six Super Cut and six Tungsten Carbide.
- Composition: one finish-specific full body plus one separate exact tip-detail inset.
- Match grade: `acceptable-similar`; these are not represented as exact standalone supplier photographs of the complete Super Cut or tungsten-carbide configuration.
- Background: transparent.

## Configuration and code matrix

| Finish | Direction | Point style | Catalogue codes | Match grade | Rights mode | Final status |
|---|---|---|---|---|---|---|
| Regular | Straight | Sharp/Sharp | `04-0121`, `04-0101`, `04-0102` | strong-match | supplier-fallback | approved |
| Regular | Curved | Sharp/Sharp | `04-0131`, `04-0111`, `04-0112` | strong-match | supplier-fallback | approved |
| Regular | Straight | Sharp/Blunt | `04-0221`, `04-0201`, `04-0202` | strong-match | supplier-fallback | approved |
| Regular | Curved | Sharp/Blunt | `04-0231`, `04-0211`, `04-0212` | strong-match | supplier-fallback | approved |
| Regular | Straight | Blunt/Blunt | `04-0321`, `04-0301`, `04-0302` | strong-match | supplier-fallback | approved |
| Regular | Curved | Blunt/Blunt | `04-0331`, `04-0311`, `04-0312` | strong-match | supplier-fallback | approved |
| Super Cut | Straight | Sharp/Sharp | `05-0121`, `05-0101`, `05-0102` | acceptable-similar | preferred-safe | approved |
| Super Cut | Curved | Sharp/Sharp | `05-0131`, `05-0111`, `05-0112` | acceptable-similar | preferred-safe | approved |
| Super Cut | Straight | Sharp/Blunt | `05-0221`, `05-0201`, `05-0202` | acceptable-similar | preferred-safe | approved |
| Super Cut | Curved | Sharp/Blunt | `05-0231`, `05-0211`, `05-0212` | acceptable-similar | preferred-safe | approved |
| Super Cut | Straight | Blunt/Blunt | `05-0321`, `05-0301`, `05-0302` | acceptable-similar | preferred-safe | approved |
| Super Cut | Curved | Blunt/Blunt | `05-0331`, `05-0311`, `05-0312` | acceptable-similar | preferred-safe | approved |
| Tungsten Carbide | Straight | Sharp/Sharp | `06-0121`, `06-0101`, `06-0102` | acceptable-similar | preferred-safe | approved |
| Tungsten Carbide | Curved | Sharp/Sharp | `06-0131`, `06-0111`, `06-0112` | acceptable-similar | preferred-safe | approved |
| Tungsten Carbide | Straight | Sharp/Blunt | `06-0221`, `06-0201`, `06-0202` | acceptable-similar | preferred-safe | approved |
| Tungsten Carbide | Curved | Sharp/Blunt | `06-0231`, `06-0211`, `06-0212` | acceptable-similar | preferred-safe | approved |
| Tungsten Carbide | Straight | Blunt/Blunt | `06-0321`, `06-0301`, `06-0302` | acceptable-similar | preferred-safe | approved |
| Tungsten Carbide | Curved | Blunt/Blunt | `06-0331`, `06-0311`, `06-0312` | acceptable-similar | preferred-safe | approved |

## Final counts

- Configurations: 18
- Match grades: 6 `strong-match`, 12 `acceptable-similar`, 0 `exact`
- Rights modes: 12 `preferred-safe`, 6 `supplier-fallback`
- Backgrounds: 18 `transparent`, 0 `clean-white`
- Review statuses: 18 `approved`, 0 `candidate`, 0 `needs-replacement`

## Reproduction

Run from the repository root after extracting the supplied source-page ZIP:

```powershell
python -m pip install Pillow pillow-avif-plugin
python apps/web/scripts/prepare_scissors_wave3.py --self-test
python apps/web/scripts/prepare_scissors_wave3.py --repo-root .
```

Generated review files remain under ignored `apps/web/local-data/catalogue-review/scissors-wave3/`. Runtime AVIF and WebP files remain under `apps/web/public/media/catalogue-preview/scissors/`.
