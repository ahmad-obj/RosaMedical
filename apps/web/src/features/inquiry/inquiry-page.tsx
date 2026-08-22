"use client";

import type { ReactElement } from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/features/localization";
import { PublicHeroCarousel } from "@/features/public-hero";
import { InquiryBasketContent } from "./inquiry-basket-content";

export function InquiryPage(): ReactElement {
  const locale = getLocaleFromPathname(usePathname());

  return (
    <div className="public-page public-page--inquiry">
      <PublicHeroCarousel
        page="inquiry"
        locale={locale}
        headingId="inquiry-public-hero-title"
      />
      <InquiryBasketContent />
    </div>
  );
}
