# Rosa Medical — Curated Image Pass

Date: 2026-09-14

## Goal

Populate the finished WordPress layout with coherent, professional medical imagery while preserving the existing layout and allowing the client to replace any image later through WordPress/Elementor.

The visual target is a restrained grey/desaturated medical-instrument language: stainless steel, sterile preparation, precision, procurement and clinical context. Avoid generic smiling-doctor stock where a more instrument-led image works.

## Immediate implemented fallback set

These are project-owned/existing Rosa assets already present in the repository and therefore safe to use as an immediate first pass. A WordPress/Elementor-selected attachment always overrides the fallback.

| Slot | Fallback |
| --- | --- |
| home-hero-01 | curated/home-hero-01.webp — surgical-instrument hero |
| home-who-01 | curated/home-who-01.webp — gloved instrument inspection |
| home-feature-01 | curated/home-feature-01.webp — clinical instrument context |
| home-promo-01 | homepage-covers/knives-family-cover-full.svg |
| home-promo-02 | homepage-covers/scissors-family-cover-full.svg |
| home-promo-03 | homepage-covers/punches-family-cover.webp |
| home-promo-04 | curated/home-promo-04.jpg — catalogue visual |
| home-why-01 | curated/home-why-01.webp — dark instrument arrangement |
| home-evidence-01 | curated/home-evidence-01.jpg — surgical instruments |
| prefooter-person-01 | curated/prefooter-person-01.webp |
| about_procurement | curated/about-procurement.jpg |
| about_hospitals | curated/about-hospitals.jpg |
| about_international | curated/about-international.webp |

Fallbacks receive a scoped CSS grey/desaturation treatment. Images deliberately selected later by the client do not get forced through that fallback-only filter.

## Web-sourced replacement pool

These were shortlisted as high-quality alternatives if a particular fallback crop is weak in the live WordPress layout. Pexels pages mark the photos as free to use; the Pixabay item is offered under the Pixabay Content License. Download from the source page, keep a source record, then import to WordPress rather than hotlinking.

- Hero / feature: https://www.pexels.com/photo/medical-instruments-and-surgeon-performing-a-surgery-6291071/
- Who / procurement: https://www.pexels.com/photo/surgeon-preparing-surgical-instruments-in-operating-room-32351309/
- Instrument detail: https://www.pexels.com/photo/surgical-tools-in-operating-room-4483319/
- Gloved preparation detail: https://www.pexels.com/photo/hands-in-rubber-gloves-preparing-surgical-equ-15456809/
- Monochrome workflow/evidence: https://www.pexels.com/photo/black-and-white-surgical-operation-in-progress-33892275/
- Grey-background professional portrait if the prefooter needs a person: https://www.pexels.com/photo/man-with-stethoscope-around-his-neck-7407049/
- High-resolution sterile tray alternative: https://pixabay.com/photos/surgical-tools-surgery-instruments-5057118/

## Review rule

Review the live site at desktop, tablet and mobile. Replace any image whose focal subject is clipped, whose crop fights the text, or which makes the page feel repetitive. Do not redesign layout merely to rescue a weak image; choose a better image.
