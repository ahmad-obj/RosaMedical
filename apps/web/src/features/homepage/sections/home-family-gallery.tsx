"use client";

import Image from "next/image";
import { useRef, type ReactElement } from "react";
import { getCatalogueDocument } from "@/features/catalogues";
import type { PublicLocale } from "@/features/localization";
import { publicMediaAlt } from "@/features/public-media";
import type { FamilyCardModel, FamilySlug } from "@/features/public-catalogue";

const HOME_FAMILY_COVER_BY_SLUG = {
  knives: { src: "/media/families/homepage-covers/knives-family-cover-full.svg", focalPoint: "50% 50%" },
  scissors: { src: "/media/families/homepage-covers/scissors-family-cover-full.svg", focalPoint: "50% 50%" },
  punches: { src: "/media/families/homepage-covers/punches-family-cover.webp", focalPoint: "50% 50%" },
  chisels: { src: "/media/families/homepage-covers/chisels-family-cover-full.svg", focalPoint: "50% 50%" },
  cutters: { src: "/media/families/homepage-covers/cutters-family-cover-full.svg", focalPoint: "50% 50%" }
} as const satisfies Record<FamilySlug, { src: string; focalPoint: string }>;

const HOME_FAMILY_ORDER = ["scissors", "cutters", "punches", "chisels", "knives"] as const satisfies readonly FamilySlug[];

function inHomepageOrder(families: readonly FamilyCardModel[]): readonly FamilyCardModel[] {
  return HOME_FAMILY_ORDER.flatMap((slug) => {
    const family = families.find((candidate) => candidate.slug === slug);
    return family ? [family] : [];
  });
}

export function HomeFamilyGallery({ families, locale = "en" }: { families: readonly FamilyCardModel[]; locale?: PublicLocale }): ReactElement {
  const orderedFamilies = inHomepageOrder(families);
  const galleryRef = useRef<HTMLUListElement>(null);

  const scrollGallery = (direction: -1 | 1) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const amount = Math.max(gallery.clientWidth * 0.72, 220);
    const rtlMultiplier = locale === "ar" ? -1 : 1;
    gallery.scrollBy({ left: direction * amount * rtlMultiplier, behavior: "smooth" });
  };

  return (
    <div className="home-family-gallery-shell">
      <div className="home-family-gallery__mobile-controls" aria-label={locale === "ar" ? "التنقل بين عائلات المنتجات" : "Product family navigation"}>
        <button type="button" className="home-family-gallery__arrow" aria-label={locale === "ar" ? "العائلة السابقة" : "Previous family"} onClick={() => scrollGallery(-1)}><span aria-hidden="true">←</span></button>
        <button type="button" className="home-family-gallery__arrow" aria-label={locale === "ar" ? "العائلة التالية" : "Next family"} onClick={() => scrollGallery(1)}><span aria-hidden="true">→</span></button>
      </div>
      <ul ref={galleryRef} className="home-family-gallery" data-home-family-gallery aria-label={locale === "ar" ? "منتجات روزا" : "ROSA products"}>
        {orderedFamilies.map((family) => {
          const cover = HOME_FAMILY_COVER_BY_SLUG[family.slug];
          const document = getCatalogueDocument(family.slug);
          if (!document) return null;

          return (
            <li key={family.slug} className="home-family-gallery__panel" data-family-panel data-family={family.slug}>
              <a
                className="home-family-gallery__link"
                href={document.pdfPath}
                target="_blank"
                rel="noreferrer"
                aria-label={locale === "ar" ? `فتح كتالوج ${family.name}` : `Open ${family.name} catalogue`}
              >
                <div className="home-family-gallery__media home-family-gallery__media--catalogue-cover">
                  <Image
                    className="home-family-gallery__image"
                    src={cover.src}
                    alt={publicMediaAlt(family.media, locale)}
                    width={560}
                    height={786}
                    sizes="(max-width: 40rem) 44vw, (max-width: 64rem) 19vw, 18vw"
                    unoptimized
                    style={{ objectFit: "cover", objectPosition: cover.focalPoint }}
                  />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
